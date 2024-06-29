from flask import Blueprint, jsonify, request
from .models import Transaction, UTXO
from . import db
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

    tx_content = json.dumps(transaction)
    
    signature = sign_transaction(tx_content, private_key)
    if not verify_signature(tx_content, signature, public_key):
        return jsonify({'message': 'Error signing your transaction. Please check your keys.'}), 400

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

# # Retrieve UTXO by id
# @dashboard.route('/utxo/<int:utxo_id>', methods=['GET'])
# def get_utxo(utxo_id):
#     utxo = UTXO.query.get(utxo_id)
#     if utxo:
#         return jsonify({
#             'id': utxo.id,
#             'txid': utxo.txid,
#             'output_address': utxo.output_address,
#             'value': utxo.value,
#             'is_spent': utxo.is_spent
#         })
#     return jsonify({'error': 'UTXO not found'}), 404

# # Mark UTXO as spent
# @dashboard.route('/utxo/<int:utxo_id>/spend', methods=['POST'])
# def spend_utxo(utxo_id):
#     utxo = UTXO.query.get(utxo_id)
#     if utxo and not utxo.is_spent:
#         utxo.is_spent = True
#         db.session.commit()
#         return jsonify({'message': 'UTXO spent successfully'})
#     return jsonify({'error': 'UTXO not found or already spent'}), 404
