from . import db
from sqlalchemy import Numeric
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

class Node(db.Model):
    __tablename__ = 'nodes'
    id = db.Column(db.Integer, primary_key=True)
    public_key = db.Column(db.String(256), unique=True, nullable=False)
    hash = db.Column(db.String(64), unique=True, nullable=False)

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    hash = db.Column(db.String(64), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now())
    input_amount = db.Column(Numeric(10, 2), nullable=False)
    input_address = db.Column(db.String(64), nullable=False)
    transaction_fee = db.Column(Numeric(10, 2), nullable=False)
    signature = db.Column(db.String(256), nullable=False)

class UTXO(db.Model):
    __tablename__ = 'utxos'
    id = db.Column(db.Integer, primary_key=True)
    tx_id = db.Column(db.Integer, db.ForeignKey('transactions.id'), nullable=False)
    output_index = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(64), nullable=False)
    amount = db.Column(Numeric(10, 2), nullable=False)
    is_spent = db.Column(db.Boolean, default=False)