from hashlib import sha256, new
from ecdsa import SigningKey, VerifyingKey, SECP256k1, BadSignatureError
import base58


def generate_hash(message):

    message = message.encode('utf-8')
    hash = sha256(message).hexdigest()
    return hash


def public_key_to_address(public_key):

    sha256_hash = sha256(bytes.fromhex(public_key)).digest()

    ripemd160 = new('ripemd160')
    ripemd160.update(sha256_hash)
    hashed_public_key = ripemd160.digest() 
    
    versioned_payload = b'\x00' + hashed_public_key
    
    sha256_first = sha256(versioned_payload).digest()
    sha256_second = sha256(sha256_first).digest()
    
    checksum = sha256_second[:4] 
   
    binary_address = versioned_payload + checksum 
   
    bitcoin_address = base58.b58encode(binary_address).decode('utf-8')
    
    return bitcoin_address


def sign_transaction(transaction, private_key):

    private_key_bytes = bytes.fromhex(private_key)
    sk = SigningKey.from_string(private_key_bytes, curve=SECP256k1)
    transaction_hash = sha256(transaction.encode('utf-8')).digest()
    signature = sk.sign(transaction_hash)
    return signature.hex()


def verify_signature(transaction, signature, public_key):

    public_key_bytes = bytes.fromhex(public_key)
    signature_bytes = bytes.fromhex(signature)
    pk = VerifyingKey.from_string(public_key_bytes, curve=SECP256k1)
    transaction_hash = sha256(transaction.encode('utf-8')).digest()
    try:
        return pk.verify(signature_bytes, transaction_hash)
    except BadSignatureError:
        return False

    