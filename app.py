from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from models import db, User, Progress, SystemConfig
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///progress.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Configuración inicial por defecto
DEFAULT_CONFIG = {
    'max_points': 100.0,
    'points_per_click': 1.0
}

def initialize_database():
    """Inicializa la base de datos con datos por defecto"""
    with app.app_context():
        db.create_all()
        
        # Crear usuario admin por defecto si no existe
        if not User.query.filter_by(username='admin').first():
            admin_user = User(
                username='admin',
                password=generate_password_hash('admin123')
            )
            db.session.add(admin_user)
            print("Usuario admin creado: admin / admin123")
        
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

@app.before_request
def setup_database():
    """Configura la base de datos antes del primer request"""
    if not hasattr(app, 'database_initialized'):
        initialize_database()
        app.database_initialized = True

@app.route('/')
def index():
    progress = Progress.query.first()
    config = SystemConfig.query.first()
    return render_template('index.html', progress=progress, config=config)

@app.route('/add_points', methods=['POST'])
def add_points():
    progress = Progress.query.first()
    config = SystemConfig.query.first()
    
    progress.current_points += config.points_per_click
    if progress.current_points > config.max_points:
        progress.current_points = config.max_points
    
    db.session.commit()
    
    return jsonify({
        'current_points': progress.current_points,
        'max_points': config.max_points,
        'percentage': (progress.current_points / config.max_points) * 100
    })

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
    
    return render_template('admin_panel.html', progress=progress, config=config)

@app.route('/admin/update_config', methods=['POST'])
def update_config():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'No autorizado'}), 401
    
    try:
        max_points = float(request.json.get('max_points'))
        points_per_click = float(request.json.get('points_per_click'))
        
        config = SystemConfig.query.first()
        progress = Progress.query.first()
        
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
        return jsonify({'error': str(e)}), 400

@app.route('/admin/reset_progress', methods=['POST'])
def reset_progress():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'No autorizado'}), 401
    
    progress = Progress.query.first()
    progress.current_points = 0.0
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/admin/add_manual_points', methods=['POST'])
def add_manual_points():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'No autorizado'}), 401
    
    try:
        points_to_add = float(request.json.get('points'))
        
        progress = Progress.query.first()
        config = SystemConfig.query.first()
        
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
        return jsonify({'error': str(e)}), 400

@app.route('/api/progress')
def get_progress():
    progress = Progress.query.first()
    config = SystemConfig.query.first()
    
    return jsonify({
        'current_points': progress.current_points,
        'max_points': config.max_points,
        'percentage': (progress.current_points / config.max_points) * 100,
        'points_per_click': config.points_per_click
    })

if __name__ == '__main__':
    # Inicializar la base de datos al iniciar la aplicación
    initialize_database()
    app.run(host='0.0.0.0', port=5000, debug=True)