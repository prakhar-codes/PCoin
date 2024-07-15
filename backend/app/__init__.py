from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from datetime import timedelta
import os

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', os.urandom(24))
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', os.urandom(24))
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

    CORS(app)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    from .routes import main as main_blueprint
    from .auth import auth as auth_blueprint
    from .dashboard import dashboard as dashboard_blueprint
    from .minepool import minepool as minepool_blueprint
    from .transaction import transaction as transaction_blueprint

    app.register_blueprint(main_blueprint)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(dashboard_blueprint)
    app.register_blueprint(minepool_blueprint)
    app.register_blueprint(transaction_blueprint)

    with app.app_context():
        db.create_all()

    return app
