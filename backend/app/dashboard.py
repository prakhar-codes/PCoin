from flask import Blueprint, jsonify
from .models import Node

dashboard = Blueprint('dashboard', __name__)

# Retrieve all nodes
@dashboard.route('/nodes', methods=['GET'])
def get_nodes():
    nodes = Node.query.all()
    return jsonify([{
        'public_key': node.public_key,
        'hash': node.hash
    } for node in nodes])
