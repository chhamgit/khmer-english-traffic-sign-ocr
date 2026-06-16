/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, Trash2, Volume2, ShieldCheck, HelpCircle, FileImage, Sparkles, Sliders, ExternalLink } from "lucide-react";
import { AnalysisResult } from "../types";
import { motion, AnimatePresence } from "motion/react";

export const Scanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Camera stream controls
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const [speechActive, setSpeechActive] = useState<string | null>(null);

  // File drag & drop state
  const [dragActive, setDragActive] = useState(false);

  // Demo image helpers
  const DEMO_TESTS = [
    { name: "Stop Sign File", id: "sign_stop", desc: "Test Stop (Octagon)" },
    { name: "Speed limit File", id: "sign_speed_50", desc: "Test Speed (Circle)" },
    { name: "No Entry Sign", id: "sign_no_entry", desc: "Test Restricted (Circle)" }
  ];

  // Stop active camera streams
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  // Launch camera
  const triggerCamera = async () => {
    try {
      setErrorMsg(null);
      setResult(null);
      stopCamera(); // Clean past stream if any

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      
      setCameraStream(stream);
      setCameraActive(true);

      // Timeout slightly to allow DOM element ref to populate
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (e: any) {
      console.error("Camera access failed:", e);
      if (e.name === "NotAllowedError" || e.message?.toLowerCase().includes("permission") || e.message?.toLowerCase().includes("allowed")) {
        setErrorMsg("Camera access permission was denied. Because this app runs inside a secure sandboxed iframe, browsers block webcam streams for privacy. Please follow the instructions in the Troubleshooting Guide to grant permission or launch the app in a new tab.");
      } else {
        setErrorMsg(`Failed to access your device camera (${e.name || "Error"}). Please upload an image instead or grant permissions.`);
      }
    }
  };

  // Capture snapshot from webcam feed
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setImage(dataUrl);
      setMimeType("image/png");
      stopCamera();
    }
  };

  // Convert uploaded files to base64
  const handleUploadedFiles = (files: FileList) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Please upload a valid image file.");
        return;
      }

      setMimeType(file.type);
      setErrorMsg(null);
      setResult(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleUploadedFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) handleUploadedFiles(e.dataTransfer.files);
  };

  // Post image data to full stack node backend api `/api/analyze`
  const runTrafficSignOCR = async (simulatedMockId?: string) => {
    if (!image && !simulatedMockId) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setErrorMsg(null);

    try {
      // Strip metadata from data URL (e.g. "data:image/png;base64,iVBORw0KGgo...")
      let rawBase64 = "";
      if (image) {
        rawBase64 = image.substring(image.indexOf(",") + 1);
      } else {
        // Force simulation image payload
        rawBase64 = "MOCK_BASE64_PLACEHOLDER_FOR_SIMULATION";
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: rawBase64,
          mimeType: mimeType,
          simulatedMockSignId: simulatedMockId
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "OCR route processing error");
      }

      const parsedResult: AnalysisResult = await response.json();
      setResult(parsedResult);

      // Auto speak result name
      if (parsedResult.detected) {
        speakWord(parsedResult.signFound, "en-US", "ocr_auto_en");
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong during symbol analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Speak speech synthesis
  const speakWord = (text: string, lang: "km-KH" | "en-US", id: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeechActive(id);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.onend = () => setSpeechActive(null);
    utterance.onerror = () => setSpeechActive(null);
    window.speechSynthesis.speak(utterance);
  };

  // Clear all states to standard
  const startOver = () => {
    setImage(null);
    setResult(null);
    setErrorMsg(null);
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div id="scanner_view_wrapper" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT CAMERA / CAPTURE VIEW (7 Columns) */}
      <div id="image_workspace_card" className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1.5 leading-snug">
              <Sparkles className="w-5 h-5 text-amber-500" /> Auto AI OCR Recognizer
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Upload photos or use camera to perform multi-language OCR on traffic symbols.
            </p>
          </div>

          {image && (
            <button
              onClick={startOver}
              className="cursor-pointer flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold font-mono transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Image
            </button>
          )}
        </div>

        {/* PREVIEW CONTAINER */}
        <div id="scanner_core_viewport">
          {!image && !cameraActive ? (
            /* Upload Drag & Drop zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[280px] transition-all cursor-pointer ${
                dragActive
                  ? "border-emerald-500 bg-emerald-50/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Upload className="w-12 h-12 text-gray-300 mb-4" />
              <h4 className="text-sm font-bold text-gray-700 leading-snug">Drag & drop traffic sign photo here</h4>
              <p className="text-xs text-gray-400 mt-1.5 max-w-sm mx-auto">
                Supports PNG, JPEG, WebP. Fits rectangular crops, street snaps or road-signs directly.
              </p>

              <div id="scanner_launch_buttons" className="flex flex-wrap gap-2 justify-center mt-6">
                <label className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                  <FileImage className="w-3.5 h-3.5" /> Select Local File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={triggerCamera}
                  className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" /> Use Device Camera
                </button>
              </div>
            </div>
          ) : cameraActive ? (
            /* Camera inline camera viewer */
            <div className="bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-h-[380px] object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3.5 z-10 px-4">
                <button
                  onClick={capturePhoto}
                  className="cursor-pointer px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 shadow-lg text-white font-extrabold text-xs tracking-wider rounded-xl transition-all"
                >
                  SNAP PHOTO
                </button>
                <button
                  onClick={stopCamera}
                  className="cursor-pointer px-6 py-2.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-extrabold text-xs tracking-wider rounded-xl transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            /* Captured / Uploaded Image Preview */
            <div className="bg-slate-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center min-h-[280px]">
              <img
                src={image}
                alt="Uploaded snapshot"
                className="max-h-[320px] rounded-xl object-contain shadow-xs"
              />

              {!result && !isAnalyzing && (
                <button
                  onClick={() => runTrafficSignOCR()}
                  className="cursor-pointer mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 shadow-sm text-white font-bold text-xs tracking-wider rounded-xl transition-all animate-bounce"
                >
                  RUN GEMINI AI ANALYSIS
                </button>
              )}
            </div>
          )}
        </div>

        {/* QUICK TRIAL MOCK FILE SELECTORS (Great for direct testing) */}
        <div id="mock_trial_container" className="pt-2 border-t border-gray-100">
          <span className="text-[10px] font-extrabold font-mono text-gray-400 block tracking-widest mb-3.5 uppercase">
            Test Instant Samples (Skip Cam/Images uploads)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DEMO_TESTS.map((demo) => (
              <button
                key={demo.id}
                onClick={() => {
                  startOver();
                  runTrafficSignOCR(demo.id);
                }}
                disabled={isAnalyzing}
                className="cursor-pointer flex items-center cursor-pointer gap-2.5 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-left transition-all text-xs font-semibold text-gray-600 bg-white shadow-3xs"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <div>
                  <div className="font-bold text-gray-800">{demo.name}</div>
                  <div className="text-[10px] text-gray-400 font-medium mt-0.5">{demo.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-start gap-3 leading-relaxed">
            <Sliders className="w-4 h-4 text-amber-650 mt-0.5 shrink-0" />
            <div className="space-y-2 w-full">
              <span className="font-bold block uppercase tracking-wider font-mono text-amber-800">Troubleshooting Guide</span>
              <p className="font-medium text-amber-950">{errorMsg}</p>
              
              {(errorMsg.toLowerCase().includes("camera") || errorMsg.toLowerCase().includes("permission")) && (
                <div className="bg-white/90 border border-amber-200 p-3.5 rounded-xl space-y-2 mt-2 text-slate-800 shadow-xxs">
                  <span className="font-extrabold text-[10px] text-amber-800 tracking-wider uppercase font-mono block">
                    How to solve Iframe / Sandbox blocks:
                  </span>
                  
                  <ol className="list-decimal pl-4.5 space-y-1.5 text-xs text-slate-650 font-normal">
                    <li>
                      <strong className="text-slate-900">Try Standard Standalone Window:</strong> Because this app runs within a secure sandboxed iframe, browsers can aggressively block webcam handshakes. Press <strong className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded text-xxs font-mono">Open in New Tab</strong> button at the top-right corner of the screen to launch it directly.
                    </li>
                    <li>
                      <strong className="text-slate-900">Enable Site Camera Permissions:</strong> Check your browser address bar next to the URL. If you see a lock icon or a blocked camera symbol, click it and toggled the access status to <strong className="text-emerald-700">Allow</strong>.
                    </li>
                    <li>
                      <strong className="text-slate-900">Check App/OS Lockouts:</strong> Make sure no other apps (e.g. Teams, Zoom, or Discord) are locking your device camera resource.
                    </li>
                    <li>
                      <strong className="text-slate-950 underline decoration-indigo-500 decoration-2">Instant Fallback:</strong> If troubleshooting is delayed, simply use <strong className="text-slate-900">Select Local File</strong> upload, or tap any of the <strong className="text-indigo-600">Test Instant Samples</strong> cards below to instantly evaluate traffic signs.
                    </li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT DETECTED RESULTS PANEL (5 Columns) */}
      <div id="results_inspector_panel" className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden sticky top-4">
        <div className="p-4 bg-slate-900 border-b border-slate-800 text-white flex justify-between items-center select-none font-mono">
          <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" /> SCANNER READOUT HUD
          </span>
          {isAnalyzing && (
            <span className="text-[9px] font-black tracking-widest text-amber-400 animate-pulse">
              ANALYZING...
            </span>
          )}
        </div>

        <div className="p-5 min-h-[350px]">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              /* Scanning/Processing Loader state */
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center space-y-4"
              >
                <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 font-mono tracking-wider uppercase">Evaluating Image...</h4>
                  <p className="text-xs text-gray-400 max-w-[240px] mx-auto">
                    Running optical character recognition & sign dictionary lookups.
                  </p>
                </div>
              </motion.div>
            ) : result ? (
              /* Actual OCR response results */
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Result header */}
                <div id="ocr_result_header" className="space-y-4">
                  {result.detected ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xxs px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold uppercase rounded-md tracking-wider font-mono">
                          {result.category}
                        </span>

                        <div className="text-right">
                          <span className="text-[9px] text-gray-400 font-semibold block font-mono">CC CONFIDENCE</span>
                          <span className="text-xs font-black text-gray-700 font-mono">
                            {(result.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {/* Display Text OCR Match */}
                      <div className="flex justify-between items-center py-1 mt-1">
                        <h4 className="text-xl font-bold font-sans text-gray-800 leading-tight">
                          {result.signFound}
                        </h4>
                        
                        <button
                          onClick={() => speakWord(result.signFound, "en-US", "ocr_en")}
                          className={`p-1.5 cursor-pointer rounded-full transition-all ${
                            speechActive === "ocr_en"
                              ? "bg-slate-200 text-slate-800 ring-2 ring-slate-300"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-500"
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Embedded Text (OCR parsed words or numbers) */}
                      {result.embeddedText && (
                        <div className="py-2 px-3.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                            OCR Text Found
                          </span>
                          <span className="font-mono bg-white px-2 py-0.5 border rounded-md font-extrabold text-[#DC2626]">
                            "{result.embeddedText}"
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-amber-50 rounded-xl border border-amber-100 font-sans text-amber-900 leading-normal space-y-2">
                      <HelpCircle className="w-10 h-10 text-amber-400 mx-auto" />
                      <h5 className="font-bold">No Symbol Detected</h5>
                      <p className="text-xs text-amber-800/80">
                        The AI could not recognize a standard traffic icon. Please make sure the sign is fully visible, crop tightly, and try again.
                      </p>
                    </div>
                  )}
                </div>

                {result.detected && (
                  <>
                    {/* Cambodia translations */}
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block tracking-wider uppercase font-mono">
                          Khmer Translation
                        </span>
                        <h4 className="text-lg font-bold text-emerald-800 mt-0.5">
                          {result.khmerTranslation}
                        </h4>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          Pronounc: "{result.phoneticGuide}"
                        </div>
                      </div>
                      <button
                        onClick={() => speakWord(result.khmerTranslation, "km-KH", "ocr_kh")}
                        className={`p-2 cursor-pointer rounded-full transition-all ${
                          speechActive === "ocr_kh"
                            ? "bg-emerald-200 text-emerald-800 ring-2 ring-emerald-300"
                            : "bg-emerald-100/70 hover:bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Description Explanations */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono block">
                          Meaning (EN)
                        </span>
                        <p className="text-xs text-gray-600 leading-relaxed font-sans">
                          {result.englishExplanation}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono block">
                          អត្ថន័យផ្លាកសញ្ញា (KH)
                        </span>
                        <p className="text-xs text-gray-600 leading-relaxed font-sans">
                          {result.khmerExplanation}
                        </p>
                      </div>
                    </div>

                    {/* Actions mandated by Law split cards */}
                    <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3.5">
                      <div className="space-y-1">
                        <h6 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                          Required Driver Response (EN)
                        </h6>
                        <p className="text-xs text-gray-200 leading-normal">
                          {result.safetyActionsEn}
                        </p>
                      </div>

                      <div className="border-t border-slate-800 pt-3.5 space-y-1">
                        <h6 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                          កាតព្វកិច្ចលក្ខខណ្ឌបើកបរ (KH)
                        </h6>
                        <p className="text-xs text-gray-200 leading-normal font-sans">
                          {result.safetyActionsKh}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              /* Idle welcome frame */
              <div className="py-16 text-center text-gray-400 space-y-3 max-w-xs mx-auto">
                <FileImage className="w-12 h-12 text-gray-200 mx-auto" />
                <h5 className="font-bold text-gray-600 leading-snug">Waiting for snap/upload</h5>
                <p className="text-xs">
                  Once you add/snap a picture or click one of our Demo Quick-Tests examples, the OCR analysis result will show details instantly here.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
