
# 🏥 Early Warning Sepsis Detector (EWSD) — Frontend

![React](https://img.shields.io/badge/React-Frontend-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-Styling-38bdf8)
![Status](https://img.shields.io/badge/Status-Prototype-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

A modern **clinical decision-support dashboard** that helps doctors and nurses detect early signs of **sepsis** using real-time patient data and predictive analytics.

---

## ✨ Overview

The **EWSD Frontend** is a responsive React-based dashboard that visualizes:

- 📊 Patient vitals and trends  
- ⚠️ Real-time sepsis risk scores  
- 🚨 Intelligent alerting system  
- 🧠 Explainable AI (XAI) insights  

Built as part of a Software Engineering Lab project at VIT.

> This project is based on a full Software Requirements Specification and system design including DFDs, ER diagrams, and ML workflow. 

---

## 🧠 System Architecture

### 🔹 Data Flow (DFD Level 0 & 1)
- Data flows from **Hospital EHR → EWSD → Clinicians**
- Alerts are triggered and sent to rapid response teams  
- System logs and reports are maintained for audit  



---

### 🔹 Core Workflow

1. 📥 Data ingestion from hospital systems  
2. 🧹 Data cleaning & normalization  
3. 🤖 ML inference (risk score 0–1)  
4. ⚠️ Threshold-based alerting  
5. 👨‍⚕️ Clinician intervention  

---

### 🔹 Class & Data Model

- Patient is the central entity  
- Linked with:
  - Vital Signs  
  - Lab Results  
  - Risk Scores  
  - Alerts  

📌 Based on class diagrams and system modeling: fileciteturn1file2

---

## 🚀 Features

### 🏥 Dashboard
- Ward-level overview of all patients
- Color-coded risk levels:
  - 🟢 Low (<30%)
  - 🟡 Moderate (30–70%)
  - 🔴 High (>70%)

### 📈 Patient Detail View
- Interactive charts (HR, MAP, Temp, SpO₂)
- Clinical scores (SOFA, SIRS, NEWS2)
- Risk explanation (XAI)

### 🚨 Alert System
- Instant high-risk alerts
- Acknowledge + escalation logic
- Alert history tracking

### 🔍 Search & Filter
- Filter patients by severity
- Search by ID or name

---

## ⚙️ Tech Stack

| Layer        | Tech                          |
|-------------|-------------------------------|
| Frontend     | React, Tailwind CSS           |
| Charts       | Recharts                      |
| Icons        | Lucide React                  |
| Backend (planned) | Flask / Node.js          |
| ML (planned) | XGBoost / Random Forest       |

---

## 🛠️ Setup

```bash
npx create-react-app ewsd-frontend
cd ewsd-frontend

npm install recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Tailwind Config

```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

---

## ▶️ Run

```bash
npm start
```

🔗 http://localhost:3000  

**Login:**
- ID: `DR001`
- Password: anything

---

## 🧪 Testing (Selenium Ready)

Uses `data-testid` attributes for automation.

Example:

```python
driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()
```

---

## 📊 Requirements Coverage

| Requirement | Feature |
|------------|--------|
| REQ-1 | Data polling simulation |
| REQ-5 | Risk classification |
| REQ-7 | Explainable AI |
| REQ-10 | Alert acknowledgment |
| REQ-13 | Interactive charts |

---

## 🎯 Project Goals

- Reduce sepsis mortality through early detection  
- Automate clinical scoring systems  
- Provide real-time decision support  
- Improve hospital operational efficiency  

---

## 📸 Future Improvements

- 🔗 Backend integration with real EHR (FHIR APIs)  
- 📱 Mobile support for clinicians  
- 🧠 Live ML inference engine  
- ☁️ Cloud deployment   

---

## ⭐ Contribute

Feel free to fork, improve UI/UX, or integrate backend ML models.

---

## 📄 License

MIT License
