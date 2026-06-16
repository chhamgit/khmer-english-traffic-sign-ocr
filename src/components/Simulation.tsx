/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { TRAFFIC_SIGNS_DB } from "../data/trafficSigns";
import { TrafficSign } from "../types";
import { TrafficSignIcon } from "./TrafficSignIcon";
import { Play, Pause, AlertTriangle, Eye, ShieldAlert, BadgeCheck, Navigation, Volume2, FastForward } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SimulationCheckpoint {
  id: string;
  sceneTitle: string;
  sceneDescription: string;
  bgGradient: string;
  roadEvent: string;
  signId: string;
}

const SIMULATION_SCENES: SimulationCheckpoint[] = [
  {
    id: "sc_1",
    sceneTitle: "Preah Norodom Boulevard, Phnom Penh",
    sceneDescription: "Driving along standard municipal lanes with high motorcycle density during evening hours.",
    bgGradient: "from-sky-900 to-slate-800",
    roadEvent: "Dense motorbike merging. Keep safe speed.",
    signId: "sign_speed_50"
  },
  {
    id: "sc_2",
    sceneTitle: "Wat Phnom Primary School District",
    sceneDescription: "Cruising close to local school boundary. Students disembarking onto sidewalk crossings.",
    bgGradient: "from-amber-900 to-stone-900",
    roadEvent: "Children leaving classroom gates. Slow down immediately.",
    signId: "sign_warning_school"
  },
  {
    id: "sc_3",
    sceneTitle: "Boeung Keng Kang 1 Alley Curve",
    sceneDescription: "Navigating narrow historic villas residential alleys with narrow lane dividers.",
    bgGradient: "from-blue-950 to-slate-900",
    roadEvent: "T-junction intersection. Blind spot of cross-lane traffic.",
    signId: "sign_stop"
  },
  {
    id: "sc_4",
    sceneTitle: "Monivong Boulevard Divergent Lane",
    sceneDescription: "Entering high speed bypass exit lanes heading south towards central markers.",
    bgGradient: "from-emerald-950 to-slate-900",
    roadEvent: "One-Way restriction zone begins. Keep to designated lane.",
    signId: "sign_no_entry"
  }
];

export const Simulation: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scanStatus, setScanStatus] = useState<"IDLE" | "SCANNING" | "IDENTIFIED">("IDLE");
  const [speed, setSpeed] = useState(55);
  const [scannerGlow, setScannerGlow] = useState(false);
  const playTimer = useRef<NodeJS.Timeout | null>(null);

  const activeScene = SIMULATION_SCENES[activeIdx];
  const activeSign = TRAFFIC_SIGNS_DB.find(s => s.id === activeScene.signId);

  // Auto speech read out
  const speakSimAlert = (title: string, detail: string, lang: "km-KH" | "en-US") => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    
    // First speak Name, then the driving instruction detail
    const speechText = `${title}. ${detail}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = lang;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const executeAutoAnalysis = () => {
    setScanStatus("SCANNING");
    setScannerGlow(true);
    
    // Decrease speed safely to mock defensive driving!
    if (activeScene.signId === "sign_stop" || activeScene.signId === "sign_warning_school") {
      setSpeed(15);
    } else if (activeScene.signId === "sign_speed_30") {
      setSpeed(28);
    } else {
      setSpeed(48);
    }

    setTimeout(() => {
      setScanStatus("IDENTIFIED");
      setScannerGlow(false);
      
      // Auto voice notification when identified
      if (activeSign) {
        // Speak safety rules
        speakSimAlert(activeSign.nameEn, activeSign.rulesEn, "en-US");
      }
    }, 1200);
  };

  // Turn active scene navigation trigger
  const goToNextScene = () => {
    setScanStatus("IDLE");
    setSpeed(58);
    setActiveIdx((prev) => (prev + 1) % SIMULATION_SCENES.length);
  };

  useEffect(() => {
    if (isPlaying) {
      executeAutoAnalysis();
      playTimer.current = setInterval(() => {
        goToNextScene();
      }, 7000);
    } else {
      if (playTimer.current) {
        clearInterval(playTimer.current);
      }
    }
    return () => {
      if (playTimer.current) clearInterval(playTimer.current);
    };
  }, [isPlaying, activeIdx]);

  return (
    <div id="simulation_workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT Dashcam live view */}
      <div className="lg:col-span-8 space-y-4">
        <div id="simulation_dashboard_frame" className="bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-xl overflow-hidden relative">
          
          {/* TOP BAR info overlays */}
          <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur-xs py-2 px-4 rounded-xl text-white text-xs border border-slate-800 absolute top-7 left-7 right-7 z-20">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping shrink-0" />
              <span className="font-bold text-rose-400">DASHCAM SIM FEED</span>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono">
              <span>GPS: 11.5564° N, 104.9282° E</span>
              <span>HD 1080P</span>
            </div>
          </div>

          {/* Core HUD view depicting driving background */}
          <div
            className={`w-full min-h-[340px] rounded-xl bg-gradient-to-b ${activeScene.bgGradient} flex items-center justify-center p-8 relative transition-all duration-700 overflow-hidden border border-slate-900`}
          >
            {/* Scenic background elements representation */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-slate-900/60 flex flex-col justify-end p-2 border-t border-slate-800/40">
              {/* Simulated driving road perspective lines */}
              <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-48 h-32 bg-slate-800/60 clip-road rotate-x-60 border-l border-r border-dashed border-gray-600/40" />
            </div>

            {/* Simulated target symbol in environment */}
            <motion.div
              key={activeScene.id}
              initial={{ scale: 0.2, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 60 }}
              className="relative z-10 flex flex-col items-center justify-center cursor-pointer"
              onClick={executeAutoAnalysis}
            >
              {/* Neurological camera scanning bracket */}
              {scanStatus === "SCANNING" && (
                <div id="scanner_reticle_border" className="absolute -inset-6 border-2 border-dashed border-emerald-400 rounded-2xl animate-spin" />
              )}
              {scanStatus === "IDENTIFIED" && (
                <div id="found_reticle_border" className="absolute -inset-4 border-2 border-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="absolute -top-6 bg-emerald-600 text-[8px] font-bold text-white px-1.5 py-0.5 rounded font-mono uppercase tracking-wide">
                    OK: {activeSign?.nameEn}
                  </span>
                </div>
              )}

              {activeSign && (
                <TrafficSignIcon
                  type={activeSign.svgType}
                  size={120}
                  className={`filter drop-shadow-lg p-1.5 rounded-2xl bg-white/5 backdrop-blur-xxs ${
                    scannerGlow ? "animate-pulse" : ""
                  }`}
                />
              )}
            </motion.div>
          </div>

          {/* Autopilot lower control dashboard */}
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-900">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center cursor-pointer gap-1.5 px-4 y-2 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all ${
                  isPlaying
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-emerald-600 text-white hover:bg-emerald-500"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" /> PAUSE DRIVE
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 animate-bounce" /> ENGAGE DRIVING
                  </>
                )}
              </button>

              <button
                onClick={goToNextScene}
                className="p-2 bg-slate-900 cursor-pointer hover:bg-slate-800 text-slate-400 rounded-xl border border-slate-800"
                title="Skip Scene"
              >
                <FastForward className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Gauge & Autopilot status indicators */}
            <div className="flex gap-6 items-center">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-mono block">SIMULATED VELOCITY</span>
                <span className="text-xl font-extrabold text-white font-mono">{speed} <span className="text-xs text-slate-400">km/h</span></span>
              </div>

              <div className="text-right border-l border-slate-900 pl-4">
                <span className="text-[10px] text-slate-500 font-mono block">ADAS OCR OCR</span>
                <span className={`text-xs font-bold font-mono ${
                  scanStatus === "SCANNING" 
                    ? "text-amber-400 animate-pulse" 
                    : scanStatus === "IDENTIFIED" 
                    ? "text-emerald-400" 
                    : "text-slate-500"
                }`}>
                  {scanStatus === "SCANNING" ? "ANALYZING..." : scanStatus === "IDENTIFIED" ? "IDENTIFIED" : "STANDBY"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scenic details card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-slate-100 rounded-xl text-slate-800 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 leading-tight">
              Current Location: {activeScene.sceneTitle}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {activeScene.sceneDescription}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT Live HUD Assistance HUD Panel */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden sticky top-4">
        <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex justify-between items-center">
          <span className="text-xs font-bold font-mono text-gray-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> PASSENGER ALERT ADAS
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-800 text-gray-400 rounded">
            V 2.5
          </span>
        </div>

        <div className="p-5 space-y-6">
          <AnimatePresence mode="wait">
            {scanStatus === "IDENTIFIED" && activeSign ? (
              <motion.div
                key={activeSign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Visual symbol and matching tag */}
                <div className="flex items-center gap-3.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <TrafficSignIcon type={activeSign.svgType} size={64} className="shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded uppercase font-mono tracking-widest">
                      {activeSign.category}
                    </span>
                    <h5 className="text-sm font-bold text-gray-800 leading-tight mt-1">
                      {activeSign.nameEn}
                    </h5>
                    <span className="text-xs font-semibold text-emerald-600 block">
                      {activeSign.nameKh}
                    </span>
                  </div>
                </div>

                {/* translations detail */}
                <div className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 font-mono tracking-widest block uppercase">
                      Alert translation
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans">
                      {activeSign.descriptionKh}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 font-mono tracking-widest block uppercase">
                      English Pronunciation phonetic
                    </span>
                    <p className="text-xs text-slate-700 bg-slate-50 font-semibold p-2 rounded-lg border border-slate-100 font-mono block">
                      "{activeSign.phoneticKh}"
                    </p>
                  </div>
                </div>

                {/* Safety Action advice block */}
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-900 rounded-xl space-y-3.5">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h6 className="text-[9px] font-bold uppercase font-mono text-rose-800 tracking-wider">
                        Action Required En
                      </h6>
                      <p className="text-xs text-rose-950 mt-0.5 leading-normal">
                        {activeSign.rulesEn}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-rose-200/50 pt-3 flex items-start gap-2.5">
                    <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h6 className="text-[9px] font-bold uppercase font-mono text-rose-800 tracking-wider">
                        ច្បាប់ចរាចរណ៍ដែលត្រូវអនុវត្ត
                      </h6>
                      <p className="text-xs text-rose-950 mt-0.5 leading-normal font-sans">
                        {activeSign.rulesKh}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trigger Speak manually */}
                <button
                  onClick={() => speakSimAlert(activeSign.nameEn, activeSign.rulesEn, "en-US")}
                  className="cursor-pointer w-full py-2 bg-slate-100 hover:bg-slate-200 active:scale-98 transition-all flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 rounded-xl border border-slate-200"
                >
                  <Volume2 className="w-4 h-4 text-slate-500" /> Re-vocalize Audio Aid
                </button>

              </motion.div>
            ) : scanStatus === "SCANNING" ? (
              <div className="p-12 text-center text-slate-500 space-y-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono tracking-widest uppercase">
                  ACTIVE AI OCR SCANNING ROAD SPACE...
                </p>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400 space-y-4">
                <Eye className="w-10 h-10 text-gray-200 mx-auto" />
                <p className="text-xs font-sans max-w-xs mx-auto">
                  Click <strong>Engage Driving</strong> simulation to start processing live street signs and hear autopilot audio assistance descriptions!
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
