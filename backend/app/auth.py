from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, unset_jwt_cookies, jwt_required
from .models import User, Node
from . import db, bcrypt, jwt
from .utils.crypto import public_key_to_address

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    public_key = data.get('publicKey')
    
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists.'}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists.'}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, email=email, password=hashed_password)

    hashed_public_key = public_key_to_address(public_key)
    node = Node(id=user.id, public_key=public_key, hash=hashed_public_key)

    db.session.add(user)
    db.session.add(node)
    db.session.commit()
    
    return jsonify({'message': 'Your account has been created!'}), 200

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password')

    user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()
    node = Node.query.filter_by(id=user.id).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity={
            'username': user.username, 'email': user.email, 'publicKey': node.public_key, 'hash': node.hash
        })
        return jsonify(access_token=access_token), 200
    elif not user:
        return jsonify({'message': 'Wrong email or username.'}), 401
    else:
        return jsonify({'message': 'Wrong password.'}), 401

    