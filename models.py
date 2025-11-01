from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Progress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    current_points = db.Column(db.Float, default=0.0)
    max_points = db.Column(db.Float, default=100.0)
    points_per_click = db.Column(db.Float, default=1.0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_click_time = db.Column(db.DateTime, default=datetime.utcnow)  # ✅ YA EXISTE - Perfecto!

class SystemConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    max_points = db.Column(db.Float, default=100.0)
    points_per_click = db.Column(db.Float, default=1.0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Level(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    level_number = db.Column(db.Integer, unique=True, nullable=False)
    percentage_required = db.Column(db.Float, nullable=False)  # 25, 50, 75, etc.
    name = db.Column(db.String(100), nullable=False)  # "Bronce", "Plata", "Oro"
    color = db.Column(db.String(7), default="#FFD700")  # Color del nivel
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Achievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    level_id = db.Column(db.Integer, db.ForeignKey('level.id'), nullable=False)
    level = db.relationship('Level', backref='achievements')
    message = db.Column(db.String(500), nullable=False)  # Mensaje del baúl
    is_opened = db.Column(db.Boolean, default=False)  # Si ya se abrió el baúl
    unlocked_at = db.Column(db.DateTime)  # Cuándo se desbloqueó
    created_at = db.Column(db.DateTime, default=datetime.utcnow)