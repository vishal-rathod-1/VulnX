from flask import Flask, request, jsonify
from flask_cors import CORS
import nmap
import ipaddress

app = Flask(__name__)
CORS(app)

def is_valid_ip(target):
    try:
        ipaddress.ip_address(target)
        return True
    except ValueError:
        return False

@app.route('/scan', methods=['POST'])
def scan():
    data = request.get_json()
    target = data.get('target', '')

    if not target or not is_valid_ip(target):
        return jsonify({'error': 'Invalid or missing target IP'}), 400

    nm = nmap.PortScanner()

    try:
        print(f"[+] Running full scan on: {target}")
        scan_args = "-sC -sV -O -p 80"
        nm.scan(hosts=target, arguments=scan_args)

        if target not in nm.all_hosts():
            return jsonify({'error': 'No host found'}), 404

        result = nm[target]
        return jsonify(result), 200

    except Exception as e:
        print("[-] Scan error:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Nmap API is running'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
