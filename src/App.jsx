// ============================================================
// App.jsx — Early Warning Sepsis Detector (EWSD) Frontend
// Author: Aditya Sahu · 23BCE0873 · VIT Vellore
// Tech: React 18 · Tailwind CSS · Recharts · Lucide React
//
// data-testid attributes are on EVERY interactive element
// for full Selenium test coverage (see SEDA1.pdf — REQ-9/12)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle, Bell, LogOut, Activity, ChevronUp,
  ChevronDown, Minus, Shield, CheckCircle, ArrowLeft,
  Heart, Thermometer, Droplets, Wind, User, Clock,
  RefreshCw, Wifi, WifiOff,
} from "lucide-react";
import { PATIENTS, INITIAL_ALERTS, generateVitalHistory } from "./data/mockData";
import ewsdLogo from "./logo.png";
// ============================================================
// UTILITIES
// ============================================================

export const getRiskConfig = (score) => {
  if (score >= 70)
    return {
      level: "HIGH", bgCard: "bg-red-950/60 border-red-600",
      badge: "bg-red-600 text-white", text: "text-red-400",
      bar: "bg-red-500", ring: "ring-red-500/30",
      sectionHeader: "text-red-400", headerIcon: "text-red-400",
    };
  if (score >= 30)
    return {
      level: "MODERATE", bgCard: "bg-amber-950/50 border-amber-600",
      badge: "bg-amber-500 text-white", text: "text-amber-400",
      bar: "bg-amber-400", ring: "ring-amber-500/30",
      sectionHeader: "text-amber-400", headerIcon: "text-amber-400",
    };
  return {
    level: "LOW", bgCard: "bg-emerald-950/50 border-emerald-700",
    badge: "bg-emerald-600 text-white", text: "text-emerald-400",
    bar: "bg-emerald-500", ring: "ring-emerald-500/30",
    sectionHeader: "text-emerald-400", headerIcon: "text-emerald-400",
  };
};

const TrendIcon = ({ trend, size = "w-4 h-4" }) => {
  if (trend === "up")   return <ChevronUp   className={`${size} text-red-400`} />;
  if (trend === "down") return <ChevronDown className={`${size} text-emerald-400`} />;
  return <Minus className={`${size} text-amber-400`} />;
};

const ScoreBadge = ({ score, label }) => {
  const thresholds =
    label === "NEWS2" ? [[0, 4, "Low", "emerald"], [5, 6, "Medium", "amber"], [7, 99, "High", "red"]]
    : label === "SIRS" ? [[0, 1, "Negative", "emerald"], [2, 3, "Positive", "amber"], [4, 4, "Severe", "red"]]
    : [[0, 2, "Low", "emerald"], [3, 5, "Moderate", "amber"], [6, 99, "Organ Fail", "red"]];

  const t = thresholds.find(([lo, hi]) => score >= lo && score <= hi) || thresholds[0];
  const colorMap = {
    emerald: "bg-emerald-900/60 text-emerald-300 border-emerald-700",
    amber:   "bg-amber-900/60 text-amber-300 border-amber-700",
    red:     "bg-red-900/60 text-red-300 border-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md border text-xs font-semibold ${colorMap[t[3]]}`}>
      {t[2]}
    </span>
  );
};

// ============================================================
// LOGIN PAGE
// ============================================================

const LoginPage = ({ onLogin }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleLogin = () => {
    if (!employeeId.trim() || !password.trim()) {
      setError("Please enter both Employee ID and Password.");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      onLogin({
        id: employeeId,
        name: employeeId === "DR001" ? "Dr. Aditya Sahu" : "Clinician",
        role: employeeId.startsWith("DR") ? "Attending Physician" : "Bedside Nurse",
      });
    }, 900);
  };

  const handleEmergency = () => {
    onLogin({ id: "EMRG-001", name: "Emergency Access", role: "Emergency Clinician", emergency: true });
  };

  return (
    <div
      data-testid="login-page"
      className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.6) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo block */}
        <div className="text-center mb-10">
          <img 
            src={ewsdLogo} 
            alt="EWSD Logo" 
            className="w-32 h-auto mx-auto mb-5 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
          />
          <h1 className="text-3xl font-bold text-white tracking-tight">EWSD</h1>
          <p className="text-slate-400 mt-1 text-sm">Early Warning Sepsis Detector · v1.0</p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-700/50 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse block" />
            <span className="text-emerald-400 text-xs font-medium">All Systems Operational</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-700/80 p-8 shadow-2xl shadow-black/50">
          <h2 className="text-white font-semibold text-lg mb-6">Secure Clinician Login</h2>

          {error && (
            <div
              data-testid="login-error"
              className="mb-5 flex items-center gap-3 p-3 bg-red-950/60 border border-red-700/60 rounded-xl text-red-300 text-sm"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Employee ID</label>
              <input
                data-testid="login-employee-id"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="e.g. DR001"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500
                           focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
              <input
                data-testid="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500
                           focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
            <p className="text-xs text-slate-500">
              Demo credentials — ID: <span className="text-cyan-400 font-mono">DR001</span> · Password:{" "}
              <span className="text-cyan-400 font-mono">any value</span>
            </p>
          </div>

          <button
            data-testid="login-submit"
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500
                       text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Authenticating…
              </>
            ) : (
              "Login to Dashboard"
            )}
          </button>

          <div className="mt-4 pt-4 border-t border-slate-700/60">
            <button
              data-testid="login-emergency"
              onClick={handleEmergency}
              className="w-full py-3 bg-red-950/60 hover:bg-red-900/70 border border-red-700/60
                         text-red-300 font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Emergency Access (Break Glass)
            </button>
            <p className="text-xs text-slate-600 text-center mt-2">
              Emergency access is fully logged and audited per REQ-12
            </p>
          </div>
        </div>

        <p className="text-center text-slate-700 text-xs mt-6">
          VIT Vellore · Software Engineering Lab · 23BCE0873
        </p>
      </div>
    </div>
  );
};

// ============================================================
// PATIENT CARD
// ============================================================

export const PatientCard = ({ patient, onClick, alerts }) => {
  const risk = getRiskConfig(patient.riskScore);
  const hasAlert = alerts.some((a) => a.patientId === patient.id && !a.acknowledged);

  return (
    <div
      data-testid={`patient-card-${patient.id}`}
      onClick={() => onClick(patient)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(patient)}
      className={`relative cursor-pointer rounded-2xl border ${risk.bgCard}
                  p-5 transition-all duration-200 hover:scale-[1.015] hover:shadow-xl
                  hover:${risk.ring} hover:ring-2 focus:outline-none focus:ring-2 ${risk.ring}`}
    >
      {hasAlert && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 animate-pulse">
          <Bell className="w-3 h-3 text-white" />
        </span>
      )}

      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold mb-2 ${risk.badge}`}>
            {risk.level}
          </span>
          <h3 className="text-white font-semibold text-base leading-tight">{patient.name}</h3>
          <p className="text-slate-400 text-sm mt-0.5">
            Room {patient.room} · Age {patient.age} · {patient.gender}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-4xl font-bold ${risk.text}`}>{patient.riskScore}%</p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <TrendIcon trend={patient.trend} />
            <span className="text-slate-500 text-xs">trend</span>
          </div>
        </div>
      </div>

      {/* Risk bar */}
      <div className="w-full h-1.5 bg-slate-700/60 rounded-full mb-4 overflow-hidden">
        <div
          data-testid={`risk-bar-${patient.id}`}
          className={`h-full rounded-full transition-all duration-700 ${risk.bar}`}
          style={{ width: `${patient.riskScore}%` }}
        />
      </div>

      {/* Vital mini-grid */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "HR",   value: patient.vitals.hr,   icon: Heart,        color: "text-red-400",     testid: `card-hr-${patient.id}` },
          { label: "MAP",  value: patient.vitals.map,  icon: Activity,     color: "text-blue-400",    testid: `card-map-${patient.id}` },
          { label: "°C",   value: patient.vitals.temp, icon: Thermometer,  color: "text-orange-400",  testid: `card-temp-${patient.id}` },
          { label: "SpO₂", value: `${patient.vitals.spo2}%`, icon: Droplets, color: "text-cyan-400", testid: `card-spo2-${patient.id}` },
        ].map((v) => (
          <div key={v.label} data-testid={v.testid} className="text-center p-2 bg-slate-900/50 rounded-xl">
            <v.icon className={`w-3 h-3 ${v.color} mx-auto mb-1`} />
            <p className="text-white text-xs font-bold">{v.value}</p>
            <p className="text-slate-500 text-xs">{v.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-slate-500 text-xs">{patient.physician}</p>
        <p className="text-slate-600 text-xs">admitted {patient.admitDate}</p>
      </div>
    </div>
  );
};

// ============================================================
// ALERT CENTER
// ============================================================

export const AlertCenter = ({ alerts, onAcknowledge, compact = false }) => {
  const active = alerts.filter((a) => !a.acknowledged);
  const acked  = alerts.filter((a) => a.acknowledged);

  return (
    <div data-testid="alert-center" className="bg-slate-900 rounded-2xl border border-slate-700/80 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/60 bg-slate-800/50">
        <Bell className="w-4 h-4 text-slate-300" />
        <h2 className="text-white font-semibold text-sm">Alert &amp; Notification Center</h2>
        {active.length > 0 && (
          <span
            data-testid="active-alert-count"
            className="ml-auto flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white block" />
            {active.length} ACTIVE
          </span>
        )}
        {active.length === 0 && (
          <span className="ml-auto text-emerald-400 text-xs flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Clear
          </span>
        )}
      </div>

      {/* Alert list */}
      <div
        data-testid="alert-list"
        className={`overflow-y-auto space-y-3 p-4 ${compact ? "max-h-80" : "max-h-96"}`}
      >
        {alerts.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
            <p className="text-sm">No alerts at this time</p>
          </div>
        )}

        {/* Active alerts */}
        {active.map((alert) => (
          <div
            key={alert.id}
            data-testid={`alert-item-${alert.id}`}
            className="p-4 bg-red-950/50 border border-red-700/60 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm">{alert.patientName}</span>
                  <span className="text-red-300 text-sm">— Room {alert.room}</span>
                  <span className="ml-auto text-xs font-bold bg-red-700 text-white px-2 py-0.5 rounded-md">
                    {alert.score}%
                  </span>
                </div>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{alert.reason}</p>
                <div className="flex items-center gap-1 mt-1.5 text-slate-500 text-xs">
                  <Clock className="w-3 h-3" />
                  Triggered {alert.time}
                </div>
              </div>
            </div>
            <button
              data-testid={`alert-ack-btn-${alert.id}`}
              onClick={() => onAcknowledge(alert.id)}
              className="mt-3 w-full py-2 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold
                         rounded-lg transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Acknowledge Alert
            </button>
          </div>
        ))}

        {/* Acknowledged alerts */}
        {acked.map((alert) => (
          <div
            key={alert.id}
            data-testid={`alert-item-${alert.id}`}
            className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl opacity-60"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-slate-300 text-sm">{alert.patientName}</span>
                <span className="text-slate-500 text-xs ml-2">Rm {alert.room}</span>
                <p className="text-slate-500 text-xs truncate mt-0.5">{alert.reason}</p>
              </div>
              <span className="text-emerald-400 text-xs font-medium flex-shrink-0">Acknowledged</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// PATIENT DETAIL
// ============================================================

export const PatientDetail = ({ patient, alerts, onAcknowledge, onBack }) => {
  const risk = getRiskConfig(patient.riskScore);
  const [activeLines, setActiveLines] = useState({ hr: true, map: true, temp: true, spo2: true });
  const patientAlerts = alerts.filter((a) => a.patientId === patient.id);

  const chartData = patient.history.map((h) => ({
    time: h.time,
    "Heart Rate": h.hr,
    "MAP": h.map,
    "Temp (°C)": h.temp,
    "SpO₂": h.spo2,
  }));

  const lineConfig = [
    { key: "hr",   dataKey: "Heart Rate", color: "#f87171", label: "Heart Rate (bpm)", toggle: "hr" },
    { key: "map",  dataKey: "MAP",        color: "#60a5fa", label: "MAP (mmHg)",        toggle: "map" },
    { key: "temp", dataKey: "Temp (°C)",  color: "#fb923c", label: "Temp (°C)",          toggle: "temp" },
    { key: "spo2", dataKey: "SpO₂",      color: "#22d3ee", label: "SpO₂ (%)",           toggle: "spo2" },
  ];

  const toggleLine = (key) =>
    setActiveLines((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div data-testid={`patient-detail-${patient.id}`} className="space-y-6">

      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <button
          data-testid="back-to-dashboard"
          onClick={onBack}
          className="p-2.5 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-white">{patient.name}</h2>
            <span className={`px-3 py-1 rounded-lg text-sm font-bold ${risk.badge}`}>
              {risk.level} RISK — {patient.riskScore}%
            </span>
            <TrendIcon trend={patient.trend} size="w-5 h-5" />
          </div>
          <p className="text-slate-400 mt-1 text-sm">
            Room {patient.room} · Age {patient.age} · {patient.physician} · Admitted {patient.admitDate}
          </p>
        </div>
      </div>

      {/* Current Vitals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3" data-testid={`vitals-grid-${patient.id}`}>
        {[
          { label: "Heart Rate",  value: `${patient.vitals.hr} bpm`,       icon: Heart,       color: "text-red-400",    testid: `vital-hr-${patient.id}` },
          { label: "MAP",         value: `${patient.vitals.map} mmHg`,      icon: Activity,    color: "text-blue-400",   testid: `vital-map-${patient.id}` },
          { label: "Temperature", value: `${patient.vitals.temp}°C`,        icon: Thermometer, color: "text-orange-400", testid: `vital-temp-${patient.id}` },
          { label: "SpO₂",        value: `${patient.vitals.spo2}%`,         icon: Droplets,    color: "text-cyan-400",   testid: `vital-spo2-${patient.id}` },
          { label: "Lactate",     value: `${patient.vitals.lactate} mmol/L`,icon: Wind,        color: "text-purple-400", testid: `vital-lactate-${patient.id}` },
          { label: "WBC",         value: `${patient.vitals.wbc} K/μL`,      icon: Shield,      color: "text-yellow-400", testid: `vital-wbc-${patient.id}` },
          { label: "Creatinine",  value: `${patient.vitals.creatinine} mg/dL`, icon: Activity, color: "text-pink-400",  testid: `vital-creatinine-${patient.id}` },
        ].map((v) => (
          <div
            key={v.label}
            data-testid={v.testid}
            className="bg-slate-800/80 rounded-xl border border-slate-700/60 p-3 text-center"
          >
            <v.icon className={`w-4 h-4 ${v.color} mx-auto mb-1.5`} />
            <p className="text-white font-bold text-sm">{v.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{v.label}</p>
          </div>
        ))}
      </div>

      {/* Vital Sign Chart */}
      <div
        data-testid={`vitals-chart-${patient.id}`}
        className="bg-slate-900 rounded-2xl border border-slate-700/80 p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h3 className="text-white font-semibold">24-Hour Vital Sign Trends</h3>
          {/* Line toggles */}
          <div className="flex gap-2 flex-wrap" data-testid={`chart-toggles-${patient.id}`}>
            {lineConfig.map((l) => (
              <button
                key={l.key}
                data-testid={`chart-toggle-${l.key}-${patient.id}`}
                onClick={() => toggleLine(l.key)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                  activeLines[l.key]
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-transparent border-slate-700 text-slate-500"
                }`}
                style={{ borderColor: activeLines[l.key] ? l.color : undefined }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: l.color, opacity: activeLines[l.key] ? 1 : 0.3 }}
                />
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72" data-testid={`chart-canvas-${patient.id}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} interval={3} />
              <YAxis stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  color: "#f8fafc",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
              {lineConfig.map((l) =>
                activeLines[l.key] ? (
                  <Line
                    key={l.key}
                    type="monotone"
                    dataKey={l.dataKey}
                    stroke={l.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ) : null
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clinical Scores + Inference Rationale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Clinical Score Summary */}
        <div
          data-testid={`clinical-scores-${patient.id}`}
          className="bg-slate-900 rounded-2xl border border-slate-700/80 p-6"
        >
          <h3 className="text-white font-semibold mb-5">Clinical Score Summary</h3>
          <table className="w-full text-sm" data-testid={`scores-table-${patient.id}`}>
            <thead>
              <tr className="text-slate-500 text-xs border-b border-slate-700/60">
                <th className="text-left pb-3 font-medium">Score</th>
                <th className="text-center pb-3 font-medium">Value</th>
                <th className="text-center pb-3 font-medium">Threshold</th>
                <th className="text-right pb-3 font-medium">Classification</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "NEWS2", value: patient.scores.news2,  ref: "≥7 = High Risk" },
                { name: "SIRS",  value: patient.scores.sirs,   ref: "≥2 criteria = Positive" },
                { name: "SOFA",  value: patient.scores.sofa,   ref: "≥2 from baseline" },
              ].map((s) => (
                <tr
                  key={s.name}
                  data-testid={`score-row-${s.name.toLowerCase()}-${patient.id}`}
                  className="border-b border-slate-800/60"
                >
                  <td className="py-3.5 font-semibold text-slate-200">{s.name}</td>
                  <td className="py-3.5 text-center text-2xl font-bold text-white">{s.value}</td>
                  <td className="py-3.5 text-center text-xs text-slate-500">{s.ref}</td>
                  <td className="py-3.5 text-right">
                    <ScoreBadge score={s.value} label={s.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inference Rationale (XAI) */}
        <div
          data-testid={`inference-rationale-${patient.id}`}
          className="bg-slate-900 rounded-2xl border border-slate-700/80 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white font-semibold">AI Inference Rationale</h3>
            <span className="ml-auto text-xs px-2 py-0.5 bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 rounded-md">
              XAI · XGBoost
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-5">{patient.rationale}</p>
          <div data-testid={`contributing-factors-${patient.id}`} className="space-y-2">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-2">
              Contributing Factors
            </p>
            {patient.factors.map((f, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg text-xs font-medium ${
                  f.startsWith("↑↑") || f.startsWith("↓↓")
                    ? "bg-red-950/50 text-red-300 border border-red-800/40"
                    : f.startsWith("↑")
                    ? "bg-amber-950/50 text-amber-300 border border-amber-800/40"
                    : f.startsWith("↓")
                    ? "bg-orange-950/50 text-orange-300 border border-orange-800/40"
                    : "bg-emerald-950/50 text-emerald-300 border border-emerald-800/40"
                }`}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient-specific Alerts */}
      {patientAlerts.length > 0 && (
        <div
          data-testid={`patient-alerts-${patient.id}`}
          className="bg-slate-900 rounded-2xl border border-slate-700/80 p-6"
        >
          <h3 className="text-white font-semibold mb-4">Active Alerts for this Patient</h3>
          <div className="space-y-3">
            {patientAlerts.map((alert) => (
              <div
                key={alert.id}
                data-testid={`detail-alert-${alert.id}`}
                className={`p-4 rounded-xl border flex items-center gap-4 ${
                  alert.acknowledged
                    ? "bg-slate-800/40 border-slate-700/40 opacity-60"
                    : "bg-red-950/50 border-red-700/60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm">{alert.reason}</p>
                  <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.time}
                  </p>
                </div>
                {alert.acknowledged ? (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium flex-shrink-0">
                    <CheckCircle className="w-4 h-4" /> Acknowledged
                  </span>
                ) : (
                  <button
                    data-testid={`alert-ack-btn-${alert.id}`}
                    onClick={() => onAcknowledge(alert.id)}
                    className="flex-shrink-0 px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white text-xs
                               font-bold rounded-lg transition"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// WARD DASHBOARD
// ============================================================

const WardDashboard = ({ patients, alerts, onPatientSelect, onAcknowledge, user, onLogout }) => {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Update "last update" display every tick
  useEffect(() => { setLastUpdate(new Date()); }, [patients]);

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.room.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterLevel === "all" ||
      (filterLevel === "high" && p.riskScore >= 70) ||
      (filterLevel === "moderate" && p.riskScore >= 30 && p.riskScore < 70) ||
      (filterLevel === "low" && p.riskScore < 30);
    return matchSearch && matchFilter;
  });

  const high     = filtered.filter((p) => p.riskScore >= 70);
  const moderate = filtered.filter((p) => p.riskScore >= 30 && p.riskScore < 70);
  const low      = filtered.filter((p) => p.riskScore < 30);
  const activeAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col" data-testid="ward-dashboard">

      {/* Navbar */}
      <nav data-testid="navbar" className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src={ewsdLogo} alt="EWSD" className="w-8 h-auto" />
          <span className="text-white font-bold tracking-tight">EWSD</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 text-sm">Ward Overview</span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Realtime indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live · {lastUpdate.toLocaleTimeString()}</span>
          </div>

          <div className="relative" data-testid="nav-alert-bell">
            <Bell className="w-5 h-5 text-slate-400" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
                {activeAlerts.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2" data-testid="nav-user">
            <div className="w-7 h-7 bg-cyan-800/60 rounded-full flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white text-xs font-medium leading-tight">{user.name}</p>
              <p className="text-slate-500 text-xs">{user.role}</p>
            </div>
          </div>

          <button
            data-testid="logout-btn"
            onClick={onLogout}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" data-testid="stats-row">
            {[
              { label: "Total Patients", value: patients.length, text: "text-white",    testid: "stat-total",    bg: "bg-slate-800 border-slate-700" },
              { label: "High Risk",      value: patients.filter((p) => p.riskScore >= 70).length,              text: "text-red-400",    testid: "stat-high",     bg: "bg-red-950/40 border-red-800/50" },
              { label: "Moderate Risk",  value: patients.filter((p) => p.riskScore >= 30 && p.riskScore < 70).length, text: "text-amber-400",  testid: "stat-moderate", bg: "bg-amber-950/40 border-amber-800/50" },
              { label: "Low Risk",       value: patients.filter((p) => p.riskScore < 30).length,               text: "text-emerald-400",testid: "stat-low",      bg: "bg-emerald-950/40 border-emerald-800/50" },
            ].map((s) => (
              <div key={s.label} data-testid={s.testid} className={`rounded-2xl border p-4 text-center ${s.bg}`}>
                <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3" data-testid="search-filter-bar">
            <input
              data-testid="patient-search"
              type="search"
              placeholder="Search patient name, room, or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm
                         focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition"
            />
            <div className="flex gap-2">
              {["all", "high", "moderate", "low"].map((lvl) => (
                <button
                  key={lvl}
                  data-testid={`filter-${lvl}`}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition border ${
                    filterLevel === lvl
                      ? lvl === "high"     ? "bg-red-700 border-red-600 text-white"
                        : lvl === "moderate" ? "bg-amber-700 border-amber-600 text-white"
                        : lvl === "low"      ? "bg-emerald-700 border-emerald-600 text-white"
                        : "bg-slate-600 border-slate-500 text-white"
                      : "bg-transparent border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Patient grid */}
          <div data-testid="patient-grid">
            {high.length > 0 && (
              <section className="mb-8" data-testid="section-high-risk">
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Risk ({high.length})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {high.map((p) => (
                    <PatientCard key={p.id} patient={p} onClick={onPatientSelect} alerts={alerts} />
                  ))}
                </div>
              </section>
            )}
            {moderate.length > 0 && (
              <section className="mb-8" data-testid="section-moderate-risk">
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
                  Moderate Risk ({moderate.length})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {moderate.map((p) => (
                    <PatientCard key={p.id} patient={p} onClick={onPatientSelect} alerts={alerts} />
                  ))}
                </div>
              </section>
            )}
            {low.length > 0 && (
              <section data-testid="section-low-risk">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
                  Low Risk ({low.length})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {low.map((p) => (
                    <PatientCard key={p.id} patient={p} onClick={onPatientSelect} alerts={alerts} />
                  ))}
                </div>
              </section>
            )}
            {filtered.length === 0 && (
              <div data-testid="no-results" className="text-center py-16 text-slate-500">
                <p className="text-lg">No patients match your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — Alert Center + System Status */}
        <aside className="hidden xl:flex xl:flex-col gap-4 w-80 flex-shrink-0 p-4 border-l border-slate-800 bg-slate-900/40 overflow-y-auto">
          <AlertCenter alerts={alerts} onAcknowledge={onAcknowledge} compact />

          {/* System Status */}
          <div data-testid="system-status" className="bg-slate-900 rounded-2xl border border-slate-700/80 p-5">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">System Status</p>
            <div className="space-y-2.5 text-sm">
              {[
                { label: "FHIR Server",  status: "Connected",  ok: true },
                { label: "ML Engine",    status: "Active",     ok: true },
                { label: "WebSocket",    status: "Live",       ok: true },
                { label: "PostgreSQL DB",status: "Connected",  ok: true },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center" data-testid={`sys-${s.label.toLowerCase().replace(/\s/g,"-")}`}>
                  <span className="text-slate-400">{s.label}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${s.ok ? "text-emerald-400" : "text-red-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.ok ? "bg-emerald-400" : "bg-red-400"}`} />
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Next FHIR Poll</span>
                <span className="text-slate-300 font-mono" data-testid="next-poll">14m 32s</span>
              </div>
              <div className="flex justify-between text-xs mt-1.5">
                <span className="text-slate-500">Active Patients</span>
                <span className="text-slate-300" data-testid="active-count">{patients.length}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// ============================================================
// ROOT APP — Routing + Simulation
// ============================================================

export default function App() {
  const [page, setPage]                   = useState("login");
  const [user, setUser]                   = useState(null);
  const [patients, setPatients]           = useState(PATIENTS);
  const [alerts, setAlerts]               = useState(INITIAL_ALERTS);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ── Simulated WebSocket: push vital updates every 6 seconds ──
  useEffect(() => {
    if (page === "login") return;

    const interval = setInterval(() => {
      setPatients((prev) =>
        prev.map((p) => {
          const drift   = (Math.random() - 0.47) * 3.5;
          const newScore = Math.min(99, Math.max(1, p.riskScore + drift));
          const newTrend = drift > 0.6 ? "up" : drift < -0.6 ? "down" : "stable";
          const newHR    = Math.round(Math.max(40, Math.min(160, p.vitals.hr + (Math.random() - 0.5) * 5)));
          const newPoint = {
            time: "Now",
            hr: newHR,
            map: Math.round(p.vitals.map + (Math.random() - 0.5) * 3),
            temp: parseFloat((p.vitals.temp + (Math.random() - 0.5) * 0.12).toFixed(1)),
            spo2: Math.min(100, Math.max(82, Math.round(p.vitals.spo2 + (Math.random() - 0.5) * 2))),
          };
          return {
            ...p,
            riskScore: Math.round(newScore),
            trend: newTrend,
            vitals: { ...p.vitals, hr: newHR },
            history: [...p.history.slice(1), newPoint],
          };
        })
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [page]);

  const handleLogin         = useCallback((userData) => { setUser(userData); setPage("dashboard"); }, []);
  const handleLogout        = useCallback(() => { setUser(null); setPage("login"); }, []);
  const handlePatientSelect = useCallback((patient) => { setSelectedPatient(patient); setPage("detail"); }, []);
  const handleAcknowledge   = useCallback((alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true, ackedAt: new Date().toLocaleTimeString() } : a))
    );
  }, []);

  // Keep detail view in sync with live patient data
  const livePatient = selectedPatient
    ? patients.find((p) => p.id === selectedPatient.id) ?? selectedPatient
    : null;

  if (page === "login") return <LoginPage onLogin={handleLogin} />;

  if (page === "detail" && livePatient)
    return (
      <div className="min-h-screen bg-slate-950" data-testid="detail-page">
        <nav className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center gap-4">
          <img src={ewsdLogo} alt="EWSD" className="w-8 h-auto" />
          <span className="text-white font-bold">EWSD</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 text-sm">Patient Detail</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-slate-400 text-sm">{user?.name}</span>
            <button
              data-testid="logout-btn"
              onClick={handleLogout}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </nav>
        <div className="p-6 max-w-7xl mx-auto">
          <PatientDetail
            patient={livePatient}
            alerts={alerts}
            onAcknowledge={handleAcknowledge}
            onBack={() => setPage("dashboard")}
          />
        </div>
      </div>
    );

  return (
    <WardDashboard
      patients={patients}
      alerts={alerts}
      onPatientSelect={handlePatientSelect}
      onAcknowledge={handleAcknowledge}
      user={user}
      onLogout={handleLogout}
    />
  );
}
