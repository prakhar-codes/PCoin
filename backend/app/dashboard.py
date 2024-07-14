from flask import Blueprint, jsonify, request
from .models import Node, Transaction, UTXO

dashboard = Blueprint('dashboard', __name__)

# Retrieve all nodes
@dashboard.route('/nodes', methods=['GET'])
def get_nodes():
    nodes = Node.query.all()
    return jsonify([{
        'public_key': node.public_key,
        'hash': node.hash
    } for node in nodes])

# Retrieve all transactions done by user
@dashboard.route('/my-transactions', methods=['POST'])
def get_transactions():
    data = request.get_json()
    hash = data.get('hash')
    transactions = Transaction.query.filter_by(input_address=hash)

    result = []
    for transaction in transactions:
        utxos = UTXO.query.filter_by(tx_id=transaction.id).all()
        utxos_list = [{
            'output_index': utxo.output_index,
            'address': utxo.address,
            'amount': utxo.amount,
        } for utxo in utxos]
        
        result.append({
            'hash': transaction.hash,
            'timestamp': transaction.timestamp,
            'transaction_fee': transaction.transaction_fee,
            'utxos': utxos_list
        })
    
    return jsonify(result)
