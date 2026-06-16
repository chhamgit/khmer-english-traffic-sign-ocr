/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Scanner } from "./components/Scanner";
import { Catalog } from "./components/Catalog";
import { EducationalCenter } from "./components/EducationalCenter";
import { Simulation } from "./components/Simulation";
import { 
  Sparkles, 
  Map, 
  BookOpen, 
  Car, 
  Tv, 
  Shield, 
  Info, 
  ExternalLink,
  Bot,
  BrainCircuit,
  Languages,
  BadgeAlert,
  Server
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"scan" | "catalog" | "edu" | "sim">("scan");
  const [systemHealthy, setSystemHealthy] = useState<boolean | null>(null);

  // Ping full-stack status check to ensure everything is mounted
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "healthy") setSystemHealthy(true);
      })
      .catch((err) => {
        console.warn("Full-stack healthcheck offline or initial build delay:", err);
        setSystemHealthy(false);
      });
  }, []);

  return (
    <div id="app_frame" className="min-h-screen bg-slate-50/50 text-slate-800 selection:bg-emerald-500/10 selection:text-emerald-700">
      
      {/* HEADER BAR */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Visual Logo / Launcher */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white relative shadow-sm">
                <BrainCircuit className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <span className="font-mono text-[9px] font-black text-rose-500 block tracking-widest leading-none">
                  AI CORE ADAS
                </span>
                <h1 className="text-base font-extrabold text-slate-900 leading-tight">
                  Khmer-English Traffic Sign OCR
                </h1>
              </div>
            </div>

            {/* Server health check status */}
            <div className="flex items-center gap-2">
              <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold font-mono text-gray-400">SERVER STATUS:</span>
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                  systemHealthy === true 
                    ? "bg-emerald-500" 
                    : systemHealthy === false 
                    ? "bg-amber-400" 
                    : "bg-gray-300 animate-pulse"
                }`} />
                <span className="text-[10px] font-bold text-gray-500 font-mono">
                  {systemHealthy === true ? "ACTIVE_AI" : systemHealthy === false ? "SIMULATED" : "CHECKING"}
                </span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* CORE HERO SECTION */}
      <section className="bg-slate-900 text-white overflow-hidden relative border-b border-slate-800">
        {/* Glow vector circle */}
        <div className="absolute right-0 top-0 w-[420px] h-[420px] bg-emerald-500/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute left-10 bottom-0 w-[300px] h-[300px] bg-indigo-500/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xxs px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase rounded-full tracking-widest font-mono">
                Multimodal Image Recognition
              </span>
              <span className="text-xxs px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold uppercase rounded-full tracking-widest font-mono">
                Gemini 3.5-Flash
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Optical Recognition & Language Aid for Cambodia
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
              A full-stack, AI-powered system that reads arbitrary road traffic signs, converts numbers or words via instant OCR, and translates warning instructions securely to both <strong>English</strong> and <strong>Khmer</strong>, complete with audio support and flashcard test practices.
            </p>
          </div>

          <div className="md:col-span-4 bg-slate-800/50 border border-slate-700/60 p-5 rounded-2xl space-y-3 shadow-inner">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> core capabilities
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 font-medium">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Multilingual OCR Translations
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Camera Snaps & Upload Analysis
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Phonetic Pronunciation Guide
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Virtual Autopilot Driving Dashcam
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* VIEWPORT CONTROLLER CARD */}
      <main id="main_content_area" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TAB NAVIGATION HEADER */}
        <div id="dashboard_tab_rail" className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs tracking-wider transition-all uppercase font-mono ${
              activeTab === "scan"
                ? "border-emerald-600 text-slate-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Bot className="w-4 h-4 shrink-0" /> AI OCR Scanner
          </button>

          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs tracking-wider transition-all uppercase font-mono ${
              activeTab === "catalog"
                ? "border-emerald-600 text-slate-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" /> Reference Catalog
          </button>

          <button
            onClick={() => setActiveTab("edu")}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs tracking-wider transition-all uppercase font-mono ${
              activeTab === "edu"
                ? "border-emerald-600 text-slate-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Map className="w-4 h-4 shrink-0" /> Practice Quiz
          </button>

          <button
            onClick={() => setActiveTab("sim")}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs tracking-wider transition-all uppercase font-mono ${
              activeTab === "sim"
                ? "border-emerald-600 text-slate-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Car className="w-4 h-4 shrink-0" /> Dashcam Simulation
          </button>
        </div>

        {/* ACTIVE WORKSPACE FRAME WITH MOTION */}
        <div id="active_workspace_frame" className="min-h-[420px]">
          <AnimatePresence mode="wait">
            {activeTab === "scan" && (
              <motion.div
                key="scan_tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Scanner />
              </motion.div>
            )}

            {activeTab === "catalog" && (
              <motion.div
                key="catalog_tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Catalog />
              </motion.div>
            )}

            {activeTab === "edu" && (
              <motion.div
                key="edu_tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <EducationalCenter />
              </motion.div>
            )}

            {activeTab === "sim" && (
              <motion.div
                key="sim_tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Simulation />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DETAILS SECTION (Translating initial prompt overview notes beautifully) */}
        <section id="theoretical_notes" className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Info className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-extrabold text-slate-800">
              Technical Specification & Project Scope
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Technical Workflow Column */}
            <div className="space-y-3">
              <span className="flex items-center gap-1.5 text-xs font-bold font-mono tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded w-fit uppercase">
                1. System Workflow
              </span>
              <ul className="text-xs text-gray-500 space-y-2.5 list-disc pl-4 leading-relaxed font-sans">
                <li><strong>Dynamic Image Capture:</strong> Support smartphone files uploaded directly, snaps from local device webcams, or targeted demo triggers.</li>
                <li><strong>AI Multimodal Segmenting:</strong> Process parameters through Gemini server proxy routes, segmenting icons from complex scenery.</li>
                <li><strong>Dual-Lingual Annotation:</strong> Direct mapping of signs to official Khmer and English rule explanations with syllabic helper phonetics.</li>
                <li><strong>TTS Speech Synthesizers:</strong> Real-time browser audio playback allowing tourists and expatriates to hear Cambodian terms spoke clearly.</li>
              </ul>
            </div>

            {/* Use cases Column */}
            <div className="space-y-3">
              <span className="flex items-center gap-1.5 text-xs font-bold font-mono tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded w-fit uppercase">
                2. Key Use Cases
              </span>
              <ul className="text-xs text-gray-500 space-y-2.5 list-disc pl-4 leading-relaxed font-sans">
                <li><strong>Driving Schools:</strong> Accelerating tourist and learner comprehension of regional warnings (hospital areas, speed restrictions, stop boxes).</li>
                <li><strong>Expatriate Adaptability:</strong> Assisting travelers in recognizing local rules such as "ហាមចូល" (No entry) or "ហាមបត់ឆ្វេង" (No left turns).</li>
                <li><strong>Autopilot Integration:</strong> Providing reference systems for smart vehicle overlays or maps notifications within Cambodian streets.</li>
                <li><strong>Law Enforcement Helpers:</strong> Serving as catalog assistants for traffic control training and standard rules audit mappings.</li>
              </ul>
            </div>

            {/* Challenges Column */}
            <div className="space-y-3">
              <span className="flex items-center gap-1.5 text-xs font-bold font-mono tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded w-fit uppercase">
                3. Overcoming Obstacles
              </span>
              <ul className="text-xs text-gray-500 space-y-2.5 list-disc pl-4 leading-relaxed font-sans">
                <li><strong>Severe Occlusion & Rain:</strong> Mitigated by standard Gemini multimodal depth reasoning that classifies signs even under poor weather.</li>
                <li><strong>Night Snap Glare:</strong> Resolved through automated contrast balance and robust schema classifications in the model layers.</li>
                <li><strong>Dialect translation accuracy:</strong> Solved through specific context-informed instruction queries to avoid literal word translation errors.</li>
              </ul>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300 font-mono">Traffic Symbol OCR</span>
            <span className="text-slate-700">|</span>
            <span>Enhancing Road Safety in Cambodia</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600">
            <span>Local Time: 2026-06-15 20:35 UTC-7</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
