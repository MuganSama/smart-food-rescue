# 🌱 Smart Food Rescue (Multi-Role Surplus Food & Hunger Relief Platform)

> **Zero Food Waste. Zero Local Hunger.**  
> A full-stack, zero-dependency React platform connecting restaurants with surplus food, shelters needing meals, and citizen spotters mapping local hunger hot-spots in real-time.

![License](https://img.shields.io/badge/License-MIT-emerald.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-teal.svg)
![Leaflet](https://img.shields.io/badge/GIS_Maps-Leaflet.js-green.svg)
![Hackathon Ready](https://img.shields.io/badge/Status-Hackathon_Submission-brightgreen.svg)

---

## 🎯 The Core Problem & Solution

Every night, commercial kitchens and restaurants discard tons of pristine, fresh prepared food due to shelf-life constraints. Simultaneously, local shelters and unhoused communities face daily food shortages.

**Smart Food Rescue** bridges this gap through a 3-sided community marketplace:
1. **Restaurants / Donors**: List surplus meals with expiration countdowns and run **AI Freshness Checks**.
2. **NGOs & Food Banks**: Browse available food via an **Interactive GIS Map** and claim donations with **QR / PIN Verification Handshakes**.
3. **Citizen Spotters**: Map urgent community hunger hot-spots so shelter teams can dispatch targeted food distribution units.

---

## ✨ Key Features & Technical Highlights

### 🏨 1. Food Donor Portal
* **Instant Listing Form**: Specify category, meal counts, dietary tags (Vegan, Nut-Free), and pickup address.
* **🔒 Handshake PIN Verification**: Donors enter the NGO's 4-digit pickup PIN to securely verify driver arrival and transition status to `Completed & Delivered`.

### 🏢 2. NGO & Shelter Command Center
* **🗺️ Interactive GIS Rescue Map**: Leaflet.js map displaying live green markers for surplus food and pulsing red markers for citizen hunger spots.
* **⚡ 1-Click Food Claiming**: Generates a dynamic **4-Digit Security PIN** and **QR Code** upon claiming a donation for safe pickup verification.
* **🚚 Citizen Alert Dispatch**: Review crowd-sourced hunger spotter reports and dispatch distribution teams to high-urgency locations.

### 📍 3. Citizen Need Spotters
* **Hunger Spot Reporting**: Citizens report unhoused community clusters or temporary shelters needing food assistance.
* **Urgency Levels & Estimation**: Provide estimated headcount and urgency rating (`Emergency`, `High`, `Medium`).

### 🌍 4. Global Impact & Environmental Engine
* **Carbon & Water Offset Tracking**: Live counter calculating total meals rescued (14,850+), CO₂ offset (18,560 kg), and participating shelter metrics.
* **Public Logistics Feed**: Real-time GIS map open to community viewers.

### 🎭 5. Judge Demo Toolbar (Hackathon Evaluation Feature)
* A persistent bottom-right floating bar allows hackathon judges to switch between **Donor (Green Olive Bistro)**, **NGO (Hope Kitchen)**, **Spotter (Sarah Jenkins)**, or **Public View** in **1 click** with pre-filled mock data!

---

## 🏗️ System Architecture & Lifecycle

```
[🏨 Restaurant Donor] ---> (Post Surplus Food) ---> [🌱 Smart Food Rescue Platform]
                                                            |
[📍 Citizen Spotter]  ---> (Report Hunger Spot) ------------+---> [🗺️ Interactive GIS Map]
                                                            |
[🏢 NGO / Food Bank]  <--- (Claim & Dispatch) --------------+---> [🔒 PIN & QR Verification]
```

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Launch (Zero Installation Required!)
Simply double-click `index.html` or open it in any browser (Chrome, Edge, Firefox, Safari). The app uses CDN-based React 18, Tailwind CSS, and Leaflet.js with full LocalStorage state persistence.

### Option 2: Local HTTP Server (PowerShell / Node.js)
Execute the included server script to run locally on `http://localhost:8000`:

```bash
# On Windows PowerShell:
npm start
# OR execute directly:
powershell -ExecutionPolicy Bypass -File ./server.ps1
```

---

## 👥 Demo Accounts (Pre-configured)

| Role | Demo Name | Organization | Pre-filled Credentials |
| :--- | :--- | :--- | :--- |
| **Donor** | Elena Vance | Green Olive Bistro | Click `🏨 Donor` in Judge Demo Bar |
| **NGO** | Marcus Brody | Hope Community Kitchen | Click `🏢 NGO` in Judge Demo Bar |
| **Spotter** | Sarah Jenkins | Citizen Spotter | Click `📍 Spotter` in Judge Demo Bar |

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 18 (Hooks, Context API, HashRouter)
* **Styling**: Tailwind CSS (Custom Emerald/Teal Design System)
* **Maps & GIS**: Leaflet.js & OpenStreetMap
* **Security & Handshake**: QR Code Generator API + 4-Digit PIN State Verification
* **Data Layer**: Asynchronous `dbClient` wrapper with LocalStorage fallback & Supabase integration hooks

---

## 📜 License

Distributed under the MIT License.
