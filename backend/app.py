from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import hashlib
import time
import nmap
from dotenv import load_dotenv

app=Flask(__name__)
CORS(app)
load_dotenv()
API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

 # Replace with your actual API key
VT_URL = "https://www.virustotal.com/api/v3"

@app.route('/scan', methods=['POST'])
def scan():
    data = request.get_json()
    print("[DEBUG] Received data:", data)

    target = data.get('target')
    options = data.get('options', '-sS')

    if not target:
        return jsonify({'error': 'No target specified'}), 400

    scanner = nmap.PortScanner()
    try:
        print(f"[+] Scanning {target} with options: {options}")
        scanner.scan(hosts=target, arguments=options)

        all_hosts = scanner.all_hosts()
        if not all_hosts:
            return jsonify({'error': 'No hosts found'}), 404

        result = scanner[all_hosts[0]]
        print("[DEBUG] Scan result:", result)
        return jsonify(result), 200

    except Exception as e:
        print("[-] Error during scan:", e)
        return jsonify({'error': str(e)}), 500


@app.route('/bruteforce', methods=['POST'])
def bruteforce_directories():
    data = request.get_json()
    target = data.get('target')

    if not target:
        return jsonify({'error': 'Target is required'}), 400

    if not target.startswith('http://') and not target.startswith('https://'):
        target = 'http://' + target

    wordlist_path = os.path.join(os.path.dirname(__file__), 'rockyou.txt')
    if not os.path.exists(wordlist_path):
        return jsonify({'error': 'rockyou.txt not found'}), 404

    found_dirs = []
    try:
        with open(wordlist_path, 'r', encoding='utf-8', errors='ignore') as file:
            for line in file:
                dir_name = line.strip()
                if not dir_name:
                    continue
                url = f"{target.rstrip('/')}/{dir_name}"
                try:
                    response = requests.get(url, timeout=3)
                    print(f"[TRY] {url} => {response.status_code}")
                    if response.status_code in [200, 301, 403]:
                        found_dirs.append({
                            'directory': dir_name,
                            'status': response.status_code
                        })
                except requests.RequestException as e:
                    print(f"[ERROR] {url}: {e}")
                    continue

        return jsonify({'found': found_dirs}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/malware', methods=['POST'])
def analyze_malware():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    save_path = os.path.join('uploads', file.filename)
    os.makedirs('uploads', exist_ok=True)
    file.save(save_path)

    try:
        # Calculate SHA-256
        with open(save_path, "rb") as f:
            file_hash = hashlib.sha256(f.read()).hexdigest()

        headers = {"x-apikey": API_KEY}
        with open(save_path, "rb") as upload_file:
            files = {"file": upload_file}
            vt_response = requests.post(f"{VT_URL}/files", headers=headers, files=files)

        if vt_response.status_code != 200:
            return jsonify({'error': 'Failed to upload to VirusTotal', 'details': vt_response.text}), 500

        analysis_id = vt_response.json()["data"]["id"]

        # Wait for the analysis to complete
        for _ in range(10):
            time.sleep(15)
            result_resp = requests.get(f"{VT_URL}/analyses/{analysis_id}", headers=headers)
            analysis = result_resp.json()
            if analysis["data"]["attributes"]["status"] == "completed":
                break
        else:
            return jsonify({'error': 'Analysis timed out'}), 504

        stats = analysis["data"]["attributes"]["stats"]
        detections = analysis["data"]["attributes"]["results"]

        report = {
            "file_hash": file_hash,
            "summary": stats,
            "detections": [
                {
                    "engine": engine,
                    "category": res["category"],
                    "result": res.get("result", "Clean")
                } for engine, res in detections.items()
            ]
        }

        return jsonify(report), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        os.remove(save_path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
