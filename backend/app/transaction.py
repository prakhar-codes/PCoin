from flask import Blueprint, jsonify, request
from .models import User, Transaction, UTXO
from . import db, bcrypt
from .utils.crypto import generate_hash, verify_signature, sign_transaction
import json

transaction = Blueprint('transaction', __name__)

# Create a new transaction
@transaction.route('/transaction', methods=['POST'])
def create_transaction():
    data = request.get_json()
    transaction = data['transaction']
    public_key = data['publicKey']
    private_key = data['privateKey']
    username = data['username']
    password = data['password']
    is_unauthorized = data['isUnauthorized']

    tx_content = json.dumps(transaction)
    
    user = User.query.filter(User.username == username).first()

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({'message': 'Error validating the payment. Wrong password.'}), 401

    try:
        signature = sign_transaction(tx_content, private_key)
        if not verify_signature(tx_content, signature, public_key) and not is_unauthorized:
            return jsonify({'message': 'Error signing your transaction. Please check your keys.'}), 400
    except Exception as e:
        return jsonify({'message': 'Error signing your transaction. Please check your keys.'}), 403

    tx_hash = generate_hash(tx_content)

    tx = Transaction(
        hash=tx_hash,
        input_address=transaction['inputAddress'],
        input_amount=float(transaction['inputAmount']),
        transaction_fee=transaction['transactionFee'],
        signature=signature
    )
    db.session.add(tx)
    db.session.commit()

    # Create UTXOs
    for index, utxo_data in enumerate(transaction['utxos']):
        utxo = UTXO(
            tx_id=tx.id,
            output_index=index,
            address=utxo_data['address'],
            amount=float(utxo_data['amount'])
        )
        db.session.add(utxo)
    
    db.session.commit()
    return jsonify({'message': 'Transaction recorded.'}), 200
