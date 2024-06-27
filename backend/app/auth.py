from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import current_user, login_user, logout_user, login_required
from .models import User
from . import db, bcrypt

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(username=username, email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created!', 'success')
        return redirect(url_for('auth.login'))
    return render_template('register.html')

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user, remember=True)
            return redirect(url_for('main.home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.home'))