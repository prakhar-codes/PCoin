from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from .models import User
from . import db, bcrypt

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    if current_user.is_authenticated:
        return jsonify({'message': 'Already logged in.'}), 200
    
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'Email already exists.'}), 400
        
        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'Username already exists.'}), 400
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(username=username, email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'Your account has been created!'}), 200

@auth.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return jsonify({'message': 'Already logged in.'}), 200
    
    if request.method == 'POST':
        data = request.get_json()
        identifier = data.get('identifier')
        password = data.get('password')

        if '@' in identifier:
            user = User.query.filter_by(email=identifier).first()
        else:
            user = User.query.filter_by(username=identifier).first()
        
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user, remember=True)
            return jsonify({'message': 'Login successful!'}), 200
        elif not user:
            return jsonify({'message': 'Wrong email or username.'}), 401
        else:
            return jsonify({'message': 'Wrong password.'}), 401

@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully.'}), 200
