import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, session, send_from_directory
from models import db, User, Progress, SystemConfig
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta 

app = Flask(__name__)

# Configuración para producción
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///progress.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PREFERRED_URL_SCHEME'] = 'https'  # Para Azure

db.init_app(app)

# Configuración inicial por defecto
DEFAULT_CONFIG = {
    'max_points': 100.0,
    'points_per_click': 1.0
}

def initialize_database():
    """Inicializa la base de datos con datos por defecto"""
    with app.app_context():
        try:
            db.create_all()
            
            # Crear usuario admin por defecto si no existe
            if not User.query.filter_by(username='admin').first():
                admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
                admin_user = User(
                    username='admin',
                    password=generate_password_hash(admin_password)
                )
                db.session.add(admin_user)
                print("Usuario admin creado")
            
            # Crear configuración por defecto si no existe
            if not SystemConfig.query.first():
                config = SystemConfig(
                    max_points=DEFAULT_CONFIG['max_points'],
                    points_per_click=DEFAULT_CONFIG['points_per_click']
                )
                db.session.add(config)
            
            # Crear progreso inicial si no existe
            if not Progress.query.first():
                progress = Progress(
                    current_points=0.0,
                    max_points=DEFAULT_CONFIG['max_points'],
                    points_per_click=DEFAULT_CONFIG['points_per_click']
                )
                db.session.add(progress)
            
            db.session.commit()
            print("Base de datos inicializada correctamente")
            
        except Exception as e:
            print(f"Error inicializando base de datos: {e}")
            db.session.rollback()

@app.before_request
def setup_database():
    """Configura la base de datos antes del primer request"""
    if not hasattr(app, 'database_initialized'):
        initialize_database()
        app.database_initialized = True

# Ruta para archivos estáticos
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/')
def index():
    progress = Progress.query.first()
    config = SystemConfig.query.first()
    if progress and config:
        return render_template('index.html', progress=progress, config=config)
    else:
        return "Error: Base de datos no inicializada", 500

@app.route('/add_points', methods=['POST'])
def add_points():
    try:
        progress = Progress.query.first()
        config = SystemConfig.query.first()
        
        if not progress or not config:
            return jsonify({'error': 'Configuración no encontrada'}), 500
        
        # VERIFICAR SI HA PASADO 20 HORAS
        time_since_last_click = datetime.utcnow() - progress.last_click_time
        twenty_hours = timedelta(hours=20)
        
        if time_since_last_click < twenty_hours:
            hours_remaining = twenty_hours - time_since_last_click
            hours = int(hours_remaining.total_seconds() // 3600)
            minutes = int((hours_remaining.total_seconds() % 3600) // 60)
            return jsonify({
                'error': True,
                'message': f'Debes esperar {hours}h {minutes}m para sumar puntos nuevamente'
            }), 429
        
        # SUMAR PUNTOS Y ACTUALIZAR TIEMPO
        progress.current_points += config.points_per_click
        progress.last_click_time = datetime.utcnow()  # ACTUALIZAR TIEMPO
        
        if progress.current_points > config.max_points:
            progress.current_points = config.max_points
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'current_points': progress.current_points,
            'max_points': config.max_points,
            'percentage': (progress.current_points / config.max_points) * 100
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password, password):
            session['admin_logged_in'] = True
            return redirect(url_for('admin_panel'))
        else:
            return render_template('admin_login.html', error='Credenciales inválidas')
    
    return render_template('admin_login.html')

@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('index'))

@app.route('/admin')
def admin_panel():
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    progress = Progress.query.first()
    config = SystemConfig.query.first()
    
    if progress and config:
        return render_template('admin_panel.html', progress=progress, config=config)
    else:
        return "Error: Base de datos no inicializada", 500

@app.route('/admin/update_config', methods=['POST'])
def update_config():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'No autorizado'}), 401
    
    try:
        max_points = float(request.json.get('max_points'))
        points_per_click = float(request.json.get('points_per_click'))
        
        config = SystemConfig.query.first()
        progress = Progress.query.first()
        
        if not config or not progress:
            return jsonify({'error': 'Configuración no encontrada'}), 500
        
        config.max_points = max_points
        config.points_per_click = points_per_click
        progress.max_points = max_points
        progress.points_per_click = points_per_click
        
        # Ajustar puntos actuales si excede el nuevo máximo
        if progress.current_points > max_points:
            progress.current_points = max_points
        
        db.session.commit()
        
        return jsonify({'success': True})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/admin/reset_progress', methods=['POST'])
def reset_progress():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'No autorizado'}), 401
    
    try:
        progress = Progress.query.first()
        if not progress:
            return jsonify({'error': 'Progreso no encontrado'}), 500
            
        progress.current_points = 0.0
        db.session.commit()
        
        return jsonify({'success': True})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/admin/add_manual_points', methods=['POST'])
def add_manual_points():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'No autorizado'}), 401
    
    try:
        points_to_add = float(request.json.get('points'))
        
        progress = Progress.query.first()
        config = SystemConfig.query.first()
        
        if not progress or not config:
            return jsonify({'error': 'Configuración no encontrada'}), 500
        
        progress.current_points += points_to_add
        if progress.current_points > config.max_points:
            progress.current_points = config.max_points
        elif progress.current_points < 0:
            progress.current_points = 0
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'current_points': progress.current_points,
            'percentage': (progress.current_points / config.max_points) * 100
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/progress')
def get_progress():
    try:
        progress = Progress.query.first()
        config = SystemConfig.query.first()
        
        if not progress or not config:
            return jsonify({'error': 'Configuración no encontrada'}), 500
        
        return jsonify({
            'current_points': progress.current_points,
            'max_points': config.max_points,
            'percentage': (progress.current_points / config.max_points) * 100,
            'points_per_click': config.points_per_click
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/admin/subtract_manual_points', methods=['POST'])
def subtract_manual_points():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'No autorizado'}), 401
    
    try:
        points_to_subtract = float(request.json.get('points'))
        
        progress = Progress.query.first()
        config = SystemConfig.query.first()
        
        if not progress or not config:
            return jsonify({'error': 'Configuración no encontrada'}), 500
        
        # RESTAR PUNTOS
        progress.current_points -= points_to_subtract
        if progress.current_points < 0:
            progress.current_points = 0
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'current_points': progress.current_points,
            'percentage': (progress.current_points / config.max_points) * 100
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400  

# Health check para Azure
@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Application is running'})

# Manejo de errores
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint no encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

if __name__ == '__main__':
    # Inicializar la base de datos al iniciar la aplicación
    initialize_database()
    
    # Configurar puerto para Azure (usa 8000 para producción)
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    app.run(host='0.0.0.0', port=port, debug=debug)