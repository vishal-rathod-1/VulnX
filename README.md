# 🛡️ VulnX - Vulnerability Scanner & Threat Analyzer

VulnX is a security automation tool that performs vulnerability scans and basic malware analysis using Nmap and the VirusTotal API. It features a React frontend and a Flask backend.

---

## ⚙️ Features

- 🔍 IP and port scanning via Nmap  
- 🦠 File hash malware scanning via VirusTotal  
- 📊 Modern UI to view and manage scans  

---

## 🔐 VirusTotal API Setup

1. Go to [https://virustotal.com](https://virustotal.com) and log in.  
2. Get your **public API key** from your profile.  
3. In the `backend` directory, create a `.env` file:

```bash
touch .env
```

4. Paste this inside `.env`:

```env
VIRUSTOTAL_API=your_api_key_here
```

✅ Or use the included `.env.example` file.

---

## 🚀 Backend Setup (Flask API)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows

pip install -r requirements.txt
python app.py
```

> Backend runs on: `http://localhost:5000`

---

## 💻 Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

> Frontend runs on: `http://localhost:3000`

---

## 📡 Connecting Frontend to Backend

Ensure the backend is running on `http://localhost:5000`. The frontend will auto-connect if this is the default setting.

---

## 🧪 Usage

- Enter an IP and run a port scan using Nmap  
- Upload a file to get VirusTotal hash analysis  
- See results in real time via the React UI

---

## 📁 Project Structure

```
VulnX/
├── backend/
│   ├── app.py
│   ├── .env.example
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── src/
│   └── package.json
└── README.md
```

---

## 📝 .env.example (for backend)

```env
# Rename to `.env` and insert your key
VIRUSTOTAL_API=your_api_key_here
```
