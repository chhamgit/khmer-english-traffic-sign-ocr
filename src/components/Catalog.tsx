/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TRAFFIC_SIGNS_DB } from "../data/trafficSigns";
import { TrafficSign, SignCategory } from "../types";
import { TrafficSignIcon } from "./TrafficSignIcon";
import { Search, Volume2, ShieldCheck, HeartPulse, Sparkles, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Catalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSign, setSelectedSign] = useState<TrafficSign | null>(TRAFFIC_SIGNS_DB[0]);
  const [speechActive, setSpeechActive] = useState<string | null>(null);

  // Filter traffic signs based on category and search query
  const filteredSigns = TRAFFIC_SIGNS_DB.filter((sign) => {
    const matchesCategory =
      selectedCategory === "ALL" || sign.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      sign.nameEn.toLowerCase().includes(searchLower) ||
      sign.nameKh.toLowerCase().includes(searchLower) ||
      sign.descriptionEn.toLowerCase().includes(searchLower) ||
      sign.descriptionKh.toLowerCase().includes(searchLower) ||
      sign.phoneticKh.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  // Client-side text-to-speech synthesis
  const speakWord = (text: string, lang: "km-KH" | "en-US", id: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop active speech
    setSpeechActive(id);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Attempt to configure standard speed
    utterance.rate = lang === "km-KH" ? 0.85 : 0.92;

    // Check if voice exists and assign it
    const voices = window.speechSynthesis.getVoices();
    if (lang === "km-KH") {
      const khmerVoice = voices.find(v => v.lang.startsWith("km") || v.lang.includes("Khmer"));
      if (khmerVoice) utterance.voice = khmerVoice;
    } else {
      const englishVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Google"));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      setSpeechActive(null);
    };

    utterance.onerror = () => {
      setSpeechActive(null);
    };

    window.speechSynthesis.speak(utterance);
  };


  return (
    <div id="catalog_workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT: Search & Grid */}
      <div className="lg:col-span-7 space-y-4">
        {/* Controls Card */}
        <div id="catalog_filters_card" className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              id="catalog_search_input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by english name, khmer, phonetic or warning detail..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none text-sm placeholder:text-gray-400 text-gray-800 transition-all"
            />
          </div>

          {/* Filtering Tabs */}
          <div id="category_tabs_wrapper" className="flex flex-wrap gap-1.5 pt-1">
            {["ALL", ...Object.values(SignCategory)].map((cat) => (
              <button
                key={cat}
                id={`cat_tab_btn_${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                {cat === "ALL" ? "All Signs" : cat.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-semibold text-gray-500 font-mono">
            SHOWING {filteredSigns.length} OF {TRAFFIC_SIGNS_DB.length} SYMBOLS
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-emerald-600 hover:underline font-semibold"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Symbols Grid */}
        <div
          id="catalog_symbols_grid"
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar"
        >
          <AnimatePresence mode="popLayout">
            {filteredSigns.map((sign) => {
              const worksAsSelected = selectedSign?.id === sign.id;
              return (
                <motion.div
                  key={sign.id}
                  id={`sign_card_${sign.id}`}
                  className={`bg-white rounded-xl p-4 border transition-all cursor-pointer flex flex-col items-center justify-between text-center select-none ${
                    worksAsSelected
                      ? "ring-2 ring-emerald-500 border-transparent shadow-md"
                      : "border-gray-100 hover:border-gray-200 hover:shadow-xs shadow-2xs"
                  }`}
                  onClick={() => setSelectedSign(sign)}
                  layoutId={`sign_layout_${sign.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="w-20 h-20 p-1 flex items-center justify-center bg-gray-50/50 rounded-lg">
                    <TrafficSignIcon type={sign.svgType} size={64} />
                  </div>

                  <div className="mt-4 space-y-1">
                    <span className="text-xxs font-bold text-gray-400 tracking-wider block font-mono">
                      {sign.category}
                    </span>
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-1 leading-snug">
                      {sign.nameEn}
                    </h4>
                    <span className="text-xs font-semibold text-emerald-600 block font-sans">
                      {sign.nameKh}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredSigns.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-gray-700">No symbols found</h4>
              <p className="text-xs text-gray-400 mt-1">Try tweaking your search term.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Detailed Inspector panel */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden sticky top-4">
        <AnimatePresence mode="wait">
          {selectedSign ? (
            <motion.div
              key={selectedSign.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header Visual frame */}
              <div
                id="inspector_visual_frame"
                className="bg-slate-50 border-b border-gray-100 p-8 flex flex-col items-center justify-center relative min-h-[220px]"
              >
                {/* Visual Glow */}
                <div
                  className="absolute inset-0 opacity-10 blur-3xl rounded-full"
                  style={{ backgroundColor: selectedSign.primaryColor }}
                />

                <TrafficSignIcon type={selectedSign.svgType} size={140} className="relative z-10 filter drop-shadow-md" />

                <div className="absolute top-4 right-4 flex gap-1 bg-white/80 backdrop-blur-xs px-2 py-1 rounded-full border border-gray-100">
                  <span className="font-mono text-[9px] font-bold text-gray-500">
                    {selectedSign.shape.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Text content details */}
              <div id="inspector_text_details" className="p-6 space-y-6">
                <div>
                  <span className="text-xxs font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md uppercase tracking-wider font-mono">
                    {selectedSign.category} CODE
                  </span>
                  
                  {/* English Name & Play */}
                  <div className="flex items-center justify-between mt-2.5">
                    <h3 className="text-xl font-bold text-gray-800 leading-tight">
                      {selectedSign.nameEn}
                    </h3>
                    <button
                      onClick={() => speakWord(selectedSign.nameEn, "en-US", `inspect_en_${selectedSign.id}`)}
                      className={`p-1.5 rounded-full transition-all ${
                        speechActive === `inspect_en_${selectedSign.id}`
                          ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-500"
                      }`}
                      title="Speak English"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Khmer Name & Play */}
                  <div className="flex items-center justify-between mt-2 py-2 px-3.5 bg-emerald-50/50 border border-emerald-100/40 rounded-xl">
                    <div>
                      <span className="text-xs text-emerald-800/60 font-medium block">Khmer standard</span>
                      <h4 className="text-lg font-bold text-emerald-700 leading-tight">
                        {selectedSign.nameKh}
                      </h4>
                    </div>
                    <div className="flex gap-1.5">
                      {/* Khmer phonetic helper */}
                      <div className="text-right pr-2">
                        <span className="text-[10px] text-gray-400 block font-mono">PHONETIC</span>
                        <span className="text-xs font-semibold text-gray-600 font-mono block">
                          "{selectedSign.phoneticKh}"
                        </span>
                      </div>
                      <button
                        onClick={() => speakWord(selectedSign.nameKh, "km-KH", `inspect_kh_${selectedSign.id}`)}
                        className={`p-1.5 rounded-full transition-all ${
                          speechActive === `inspect_kh_${selectedSign.id}`
                            ? "bg-emerald-200 text-emerald-800 ring-2 ring-emerald-400"
                            : "bg-emerald-100/60 hover:bg-emerald-100 text-emerald-700"
                        }`}
                        title="Speak Khmer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Meanings */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> ENGLISH DESCRIPTION
                    </h5>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedSign.descriptionEn}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> KHMER DESCRIPTION
                    </h5>
                    <p className="text-sm text-gray-600 leading-relaxed font-sans">
                      {selectedSign.descriptionKh}
                    </p>
                  </div>
                </div>

                {/* Actionable Rules */}
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3.5">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h6 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-mono">
                        Rule Compliance (EN)
                      </h6>
                      <p className="text-xs text-gray-200 leading-normal">
                        {selectedSign.rulesEn}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex items-start gap-2.5">
                    <HeartPulse className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h6 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-mono">
                        Rule Compliance (KH)
                      </h6>
                      <p className="text-xs text-gray-200 leading-normal font-sans">
                        {selectedSign.rulesKh}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-12 text-center text-gray-400">
              Select or search a traffic symbol on the left grid inspect its translations and meanings instantly.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
