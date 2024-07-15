from flask import Blueprint, jsonify, request
from .models import Node, Transaction, UTXO
from .utils.crypto import verify_signature
import json

minepool = Blueprint('minepool', __name__)

# Retrieve all transactions done by user
@minepool.route('/unconfirmed-transactions', methods=['GET'])
def get_unconfirmed_transactions():
    transactions = Transaction.query.all() # Change this line to retrieve all unconfirmed transactions only

    result = []
    for transaction in transactions:
        utxos = UTXO.query.filter_by(tx_id=transaction.id).all()
        utxos_list = [{
            'address': utxo.address,
            'amount': utxo.amount,
        } for utxo in utxos]
        
        result.append({
            'hash': transaction.hash,
            'timestamp': transaction.timestamp,
            'transaction_fee': transaction.transaction_fee,
            'input_amount': transaction.input_amount,
            'input_address': transaction.input_address,
            'utxos': utxos_list,
            'signature': transaction.signature
        })
    
    return jsonify(result)

# Verify transaction signature
@minepool.route('/verify-transaction', methods=['POST'])
def verify_transaction():
    data = request.get_json()
    transaction = data['transaction']
    signature = data['signature']
    hash = data['hash']

    transaction_query = Transaction.query.filter_by(hash=hash).first()
    if not transaction_query:
        return jsonify({'message': 'Transaction not found'}), 404

    node = Node.query.filter_by(hash=transaction['inputAddress']).first()
    if not node:
        return jsonify({'message': 'Node not found'}), 404
    
    tx_content = json.dumps(transaction)

    is_valid = verify_signature(tx_content, signature, node.public_key)
    return jsonify({'is_valid': is_valid}), 200
