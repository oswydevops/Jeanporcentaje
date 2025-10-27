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
    last_click_time = db.Column(db.DateTime, default=datetime.utcnow)

class SystemConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    max_points = db.Column(db.Float, default=100.0)
    points_per_click = db.Column(db.Float, default=1.0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)