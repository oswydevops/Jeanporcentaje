import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, session, send_from_directory
from models import db, User, Progress, SystemConfig, Level, Achievement
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta 

app = Flask(__name__)

# === INICIO MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
# Configuración de idiomas
LANGUAGES = {
    'es': 'Español',
    'fr': 'Français'
}

def get_current_language():
    """Determina el idioma preferido del usuario"""
    return session.get('language', 'es')
# === FIN MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===

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

# === INICIO MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
@app.route('/set_language/<language>')
def set_language(language):
    """Cambia el idioma de la aplicación"""
    if language in LANGUAGES:
        session['language'] = language
    # Redirigir a la página anterior o al inicio
    return redirect(request.referrer or url_for('index'))
# === FIN MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===

# Ruta para archivos estáticos
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/')
def index():
    progress = Progress.query.first()
    config = SystemConfig.query.first()
    if progress and config:
        # === INICIO MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
        return render_template('index.html', progress=progress, config=config, current_language=get_current_language())
        # === FIN MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
    else:
        return "Error: Base de datos no inicializada", 500

@app.route('/add_points', methods=['POST'])
def add_points():
    try:
        progress = Progress.query.first()
        config = SystemConfig.query.first()
        
        if not progress or not config:
            return jsonify({'error': 'Configuración no encontrada'}), 500
        
        # SUMAR PUNTOS
        progress.current_points += config.points_per_click
        
        # Actualizar el tiempo del último clic
        progress.last_click_time = datetime.utcnow()
        
        if progress.current_points > config.max_points:
            progress.current_points = config.max_points
        
        # CALCULAR PORCENTAJE ACTUAL
        current_percentage = (progress.current_points / config.max_points) * 100
        
        # VERIFICAR Y CREAR LOGROS
        check_achievements(current_percentage)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'current_points': progress.current_points,
            'max_points': config.max_points,
            'percentage': current_percentage
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
            # === INICIO MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
            return render_template('admin_login.html', error='Credenciales inválidas', current_language=get_current_language())
            # === FIN MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
    
    # === INICIO MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
    return render_template('admin_login.html', current_language=get_current_language())
    # === FIN MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===

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
        # === INICIO MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
        return render_template('admin_panel.html', progress=progress, config=config, current_language=get_current_language())
        # === FIN MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
    else:
        return "Error: Base de datos no inicializada", 500

@app.route('/admin/update_config', methods=['POST'])
def update_config():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'No autorizado'}), 401
    
    try:
        max_points = float(request.json.get('max_points'))
        points_per_click = float(request.json.get('points_per_click'))

        # NUEVA VALIDACIÓN BACKEND
        if points_per_click < 0.01:
            return jsonify({'error': 'Los puntos por clic deben ser mayor o igual a 0.01'}), 400
        
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
        
        # CALCULAR PORCENTAJE Y VERIFICAR LOGROS
        current_percentage = (progress.current_points / config.max_points) * 100
        check_achievements(current_percentage)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'current_points': progress.current_points,
            'percentage': current_percentage
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

@app.route('/api/levels')
def get_levels():
    levels = Level.query.order_by(Level.percentage_required).all()
    achievements = Achievement.query.all()
    
    return jsonify({
        'levels': [{
            'id': level.id,
            'level_number': level.level_number,
            'percentage_required': level.percentage_required,
            'name': level.name,
            'color': level.color
        } for level in levels],
        'achievements': [{
            'id': achievement.id,
            'level_id': achievement.level_id,
            'message': achievement.message,
            'is_opened': achievement.is_opened,
            'unlocked_at': achievement.unlocked_at.isoformat() if achievement.unlocked_at else None
        } for achievement in achievements]
    })

@app.route('/api/achievements/<int:achievement_id>/open', methods=['POST'])
def open_achievement(achievement_id):
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'No autorizado'}), 401
    
    achievement = Achievement.query.get_or_404(achievement_id)
    achievement.is_opened = True
    achievement.unlocked_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'success': True})

#Ruta para eliminar levels
@app.route('/admin/levels/delete/<int:level_id>', methods=['POST'])
def delete_level(level_id):
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'No autorizado'}), 401
    
    try:
        level = Level.query.get_or_404(level_id)
        
        # Eliminar también el achievement asociado
        achievement = Achievement.query.filter_by(level_id=level_id).first()
        if achievement:
            db.session.delete(achievement)
        
        db.session.delete(level)
        db.session.commit()
        
        return redirect(url_for('manage_levels'))
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/admin/levels', methods=['GET', 'POST'])
def manage_levels():
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    if request.method == 'POST':
        try:
            # Crear nuevo nivel
            level_number = int(request.form.get('level_number'))
            percentage_required = float(request.form.get('percentage_required'))
            name = request.form.get('name')
            color = request.form.get('color')
            message = request.form.get('message')
            
            # VERIFICAR SI EL NÚMERO DE NIVEL YA EXISTE
            existing_level = Level.query.filter_by(level_number=level_number).first()
            if existing_level:
                levels = Level.query.order_by(Level.percentage_required).all()
                # === INICIO MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
                return render_template('admin_levels.html', 
                                    levels=levels, 
                                    error=f'El nivel número {level_number} ya existe. Usa un número diferente.',
                                    current_language=get_current_language())
                # === FIN MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
            
            # VERIFICAR SI EL NOMBRE DE NIVEL YA EXISTE
            existing_name = Level.query.filter_by(name=name).first()
            if existing_name:
                levels = Level.query.order_by(Level.percentage_required).all()
                # === INICIO MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
                return render_template('admin_levels.html', 
                                    levels=levels, 
                                    error=f'El nombre de nivel "{name}" ya existe. Usa un nombre diferente.',
                                    current_language=get_current_language())
                # === FIN MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
            
            new_level = Level(
                level_number=level_number,
                percentage_required=percentage_required,
                name=name,
                color=color
            )
            db.session.add(new_level)
            db.session.commit()
            
            # Crear achievement para este nivel
            new_achievement = Achievement(
                level_id=new_level.id,
                message=message
            )
            db.session.add(new_achievement)
            db.session.commit()
            
            return redirect(url_for('manage_levels'))
            
        except Exception as e:
            db.session.rollback()
            levels = Level.query.order_by(Level.percentage_required).all()
            # === INICIO MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
            return render_template('admin_levels.html', 
                                levels=levels, 
                                error=f'Error al crear el nivel: {str(e)}',
                                current_language=get_current_language())
            # === FIN MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
    
    levels = Level.query.order_by(Level.percentage_required).all()
    # === INICIO MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===
    return render_template('admin_levels.html', levels=levels, current_language=get_current_language())
    # === FIN MODIFICACIÓN SISTEMA DE TRADUCCIÓN SIMPLIFICADO ===

# Función para verificar y crear logros automáticamente
def check_achievements(current_percentage):
    levels = Level.query.filter(Level.percentage_required <= current_percentage).all()
    
    for level in levels:
        # Verificar si ya existe un achievement para este nivel
        existing_achievement = Achievement.query.filter_by(level_id=level.id).first()
        if not existing_achievement:
            # Crear achievement automáticamente SOLO si se alcanzó el porcentaje
            new_achievement = Achievement(
                level_id=level.id,
                message=f"¡Felicidades! Alcanzaste el nivel {level.name}. Contacta a tu administrador para reclamar tu recompensa."
            )
            db.session.add(new_achievement)
    
    db.session.commit()

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