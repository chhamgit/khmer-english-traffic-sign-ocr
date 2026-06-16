/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { TRAFFIC_SIGNS_DB } from "../data/trafficSigns";
import { TrafficSign, QuizQuestion } from "../types";
import { TrafficSignIcon } from "./TrafficSignIcon";
import { Award, RefreshCw, Eye, Sparkles, AlertCircle, CheckCircle, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const EducationalCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"quiz" | "flashcards">("quiz");

  // FLASHCARDS STATE
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // QUIZ STATE
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [speechActive, setSpeechActive] = useState<string | null>(null);

  // Read Aloud helpers
  const speakText = (text: string, lang: "km-KH" | "en-US", id: string) => {
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

  // Build 5 procedural quiz questions utilizing details from the DB
  const startNewQuiz = () => {
    // Shuffle helper
    const shuffleArray = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
    const signs = shuffleArray([...TRAFFIC_SIGNS_DB]);
    const questionsLength = Math.min(5, signs.length);
    const questionsList: QuizQuestion[] = [];

    for (let i = 0; i < questionsLength; i++) {
      const correctSign = signs[i];
      // Draw 3 other random signs as incorrect options
      const distractors = TRAFFIC_SIGNS_DB.filter(s => s.id !== correctSign.id);
      const shuffledDistractors = shuffleArray(distractors).slice(0, 3);
      
      const options = shuffleArray([
        { signId: correctSign.id, textEn: correctSign.nameEn, textKh: correctSign.nameKh },
        ...shuffledDistractors.map(s => ({ signId: s.id, textEn: s.nameEn, textKh: s.nameKh }))
      ]);

      questionsList.push({
        id: `q_${i}`,
        signId: correctSign.id,
        questionText: `Identify this traffic symbol and its standard Khmer translation:`,
        options,
        correctSignId: correctSign.id,
        explanationEn: `This is a ${correctSign.nameEn}. It is a ${correctSign.category.toLowerCase()} sign. ${correctSign.descriptionEn}`,
        explanationKh: `នេះជាផ្លាកសញ្ញា ${correctSign.nameKh}។ វាជាប្រភេទផ្លាកសញ្ញា ${correctSign.category.toLowerCase()}។ ${correctSign.rulesKh}`
      });
    }

    setQuizQuestions(questionsList);
    setCurrentQuestionIdx(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizStarted(true);
    setQuizCompleted(false);
  };

  useEffect(() => {
    startNewQuiz();
  }, []);

  const handleOptionSelect = (optionSignId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionSignId);
  };

  const handleAnswerSubmit = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const currentQuestion = quizQuestions[currentQuestionIdx];
    if (selectedOptionId === currentQuestion.correctSignId) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    if (currentQuestionIdx + 1 < quizQuestions.length) {
      setCurrentQuestionIdx(idx => idx + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Flashcards navigation
  const nextFlashcard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setFlashcardIdx((idx) => (idx + 1) % TRAFFIC_SIGNS_DB.length);
    }, 150);
  };

  const prevFlashcard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setFlashcardIdx((idx) => (idx - 1 + TRAFFIC_SIGNS_DB.length) % TRAFFIC_SIGNS_DB.length);
    }, 150);
  };

  const activeFlashcard = TRAFFIC_SIGNS_DB[flashcardIdx];

  return (
    <div id="education_workspace" className="max-w-4xl mx-auto space-y-6">
      {/* Tab Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit mx-auto border border-gray-200">
        <button
          onClick={() => setActiveTab("quiz")}
          className={`px-6 cursor-pointer py-2 rounded-lg text-sm cursor-pointer font-bold tracking-wide transition-all ${
            activeTab === "quiz"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Mock Driving Practice
        </button>
        <button
          onClick={() => setActiveTab("flashcards")}
          className={`px-6 py-2 rounded-lg cursor-pointer text-sm font-bold tracking-wide transition-all ${
            activeTab === "flashcards"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Study Flashcards
        </button>
      </div>

      {/* RENDER ACTIVE MODE */}
      <div id="edu_tab_content" className="min-h-[480px]">
        {activeTab === "quiz" ? (
          /* MOCK TEST INTERACTIVE PANEL */
          <div id="study_quiz_panel">
            {quizCompleted ? (
              /* QUIZ SCOREBOARD SUMMARY */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center max-w-lg mx-auto space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
                  <Award className="w-10 h-10" />
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-black text-gray-800">Practice Completed!</h3>
                  <p className="text-xs text-gray-400 font-mono">ROAD RULES MOCK TEST SCORECARD</p>
                </div>

                {/* Score Dial */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100 max-w-xs mx-auto">
                  <div className="text-4xl font-extrabold text-gray-800">{score} <span className="text-gray-300">/</span> {quizQuestions.length}</div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    {score === quizQuestions.length 
                      ? "Perfect! You understand all traffic signs flawlessly." 
                      : score >= 3 
                      ? "Great job! Familiarize yourself with other warning categories." 
                      : "We recommend reviewing the reference Catalog to study translations."}
                  </p>
                </div>

                <button
                  onClick={startNewQuiz}
                  className="w-full max-w-xs cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto text-sm"
                >
                  <RefreshCw className="w-4 h-4" /> Restart New Test
                </button>
              </motion.div>
            ) : quizQuestions.length > 0 ? (
              /* ACTIVE TEST CARD */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Visual Question component (Left) */}
                <div className="md:col-span-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col items-center justify-between min-h-[300px]">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xxs font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md font-mono">
                      MCQ TEST
                    </span>
                    <span className="text-xs font-bold text-gray-400 font-mono">
                      Q: {currentQuestionIdx + 1} / {quizQuestions.length}
                    </span>
                  </div>

                  {/* Render Visual Sign to Recognize */}
                  <div className="my-8 py-3 bg-slate-50/50 w-full rounded-2xl flex items-center justify-center min-h-[160px]">
                    <TrafficSignIcon
                      type={TRAFFIC_SIGNS_DB.find(s => s.id === quizQuestions[currentQuestionIdx].correctSignId)?.svgType || ""}
                      size={142}
                      className="filter drop-shadow-md animate-pulse"
                    />
                  </div>

                  <div className="w-full text-center">
                    <p className="text-xs text-gray-400">Match the design above to its name</p>
                  </div>
                </div>

                {/* Answers Choice component (Right) */}
                <div className="md:col-span-7 space-y-4">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider font-mono">
                      Choose standard answer:
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2">
                      {quizQuestions[currentQuestionIdx].options.map((option, index) => {
                        const isSelected = selectedOptionId === option.signId;
                        const isCorrect = option.signId === quizQuestions[currentQuestionIdx].correctSignId;
                        
                        let optionStyle = "border-gray-100 bg-gray-50/50 hover:bg-gray-100/50";
                        if (isSelected && !isAnswerSubmitted) {
                          optionStyle = "border-slate-800 bg-slate-50 ring-2 ring-slate-800/10";
                        } else if (isAnswerSubmitted) {
                          if (isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-300/20";
                          } else if (isSelected && !isCorrect) {
                            optionStyle = "border-rose-300 bg-rose-50/60 text-rose-800";
                          } else {
                            optionStyle = "border-gray-100 bg-gray-50/30 text-gray-400 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={option.signId}
                            onClick={() => handleOptionSelect(option.signId)}
                            className={`w-full text-left cursor-pointer p-4 rounded-xl border text-sm flex items-start gap-4 transition-all ${optionStyle}`}
                            disabled={isAnswerSubmitted}
                          >
                            <span className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 select-none">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <div>
                              <div className="font-bold">{option.textEn}</div>
                              <div className="text-xs text-gray-500 mt-0.5 font-sans font-medium">{option.textKh}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Action button */}
                    <div className="pt-2 flex justify-end">
                      {!isAnswerSubmitted ? (
                        <button
                          onClick={handleAnswerSubmit}
                          disabled={!selectedOptionId}
                          className="px-6 py-2.5 cursor-pointer bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs tracking-wider transition-all shadow-sm"
                        >
                          CONFIRM SUBMISSION
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="px-6 py-2.5 cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs tracking-wider transition-all shadow-sm flex items-center gap-1.5"
                        >
                          {currentQuestionIdx + 1 === quizQuestions.length ? "Finish Test" : "Next Question"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Feedback Explanation (rendered on submit) */}
                  <AnimatePresence>
                    {isAnswerSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`rounded-2xl p-5 border text-xs leading-relaxed space-y-4 shadow-2xs ${
                          selectedOptionId === quizQuestions[currentQuestionIdx].correctSignId
                            ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                            : "bg-amber-50/50 border-amber-100 text-amber-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedOptionId === quizQuestions[currentQuestionIdx].correctSignId ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <span className="font-bold uppercase tracking-wider font-mono">
                            {selectedOptionId === quizQuestions[currentQuestionIdx].correctSignId ? "Answer Correct" : "Incorrect Answer"}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {/* English explanation */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                                Rule Context
                              </span>
                              <button
                                onClick={() => speakText(quizQuestions[currentQuestionIdx].explanationEn, "en-US", "quiz_ex_en")}
                                className="p-1 rounded-full cursor-pointer bg-white border border-gray-100 hover:bg-gray-100 active:scale-95 transition-all text-gray-500"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-gray-600 leading-normal font-sans">
                              {quizQuestions[currentQuestionIdx].explanationEn}
                            </p>
                          </div>

                          {/* Khmer explanation */}
                          <div id="quiz_expl_kh_wrapper" className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                                ពន្យល់ច្បាប់ចរាចរណ៍ (Khmer Context)
                              </span>
                              <button
                                onClick={() => speakText(quizQuestions[currentQuestionIdx].explanationKh, "km-KH", "quiz_ex_kh")}
                                className="p-1 cursor-pointer rounded-full bg-white border border-gray-100 hover:bg-gray-100 active:scale-95 transition-all text-gray-500"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-gray-600 leading-normal font-sans">
                              {quizQuestions[currentQuestionIdx].explanationKh}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          /* STUDY FLASHCARDS PANEL WITH 3D FLIP */
          <div id="study_flashcard_panel" className="max-w-md mx-auto flex flex-col items-center">
            
            <p className="text-xs text-gray-400 text-center mb-6">
              Click the card below to flip and inspect the Khmer translating pronunciations.
            </p>

            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-80 relative cursor-pointer group select-none perspective-1000"
            >
              {/* Card Container */}
              <div
                className={`w-full h-full duration-500 transform-style-3d relative transition-all ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* FRONT: Visual graphic */}
                <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-6 backface-hidden">
                  <span className="text-[10px] font-bold text-gray-400 font-mono tracking-widest absolute top-4">
                    FLASHCARD FRONT
                  </span>
                  
                  <TrafficSignIcon type={activeFlashcard.svgType} size={130} className="filter drop-shadow-md" />

                  <h3 className="mt-6 text-sm font-bold text-gray-500 font-mono uppercase tracking-widest text-center">
                    Tap to Flip Meaning
                  </h3>
                </div>

                {/* BACK: Descriptions and translations */}
                <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-2xl shadow-sm text-white flex flex-col justify-between p-6 rotate-y-180 backface-hidden">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-emerald-400 font-mono tracking-widest uppercase">
                      {activeFlashcard.category} Sign
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid double flipping
                        speakText(activeFlashcard.nameKh, "km-KH", "flash_kh");
                      }}
                      className="p-1 cursor-pointer bg-slate-800 text-emerald-400 rounded-full hover:bg-slate-700 hover:text-white transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Core Content */}
                  <div className="my-auto space-y-3.5 text-center">
                    <div>
                      <h4 className="text-lg font-black">{activeFlashcard.nameEn}</h4>
                      <div className="text-emerald-400 text-sm font-bold font-sans mt-0.5">
                        {activeFlashcard.nameKh}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        Phonetic: "{activeFlashcard.phoneticKh}"
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-normal max-w-xs mx-auto">
                      {activeFlashcard.descriptionEn}
                    </p>
                  </div>

                  {/* Card bottom footer */}
                  <div className="text-center text-[10px] text-gray-500 font-semibold uppercase tracking-widest">
                    TAP CARD TO FLIP BACK
                  </div>
                </div>
              </div>
            </div>

            {/* Flashcards controls */}
            <div className="flex justify-between items-center w-full max-w-md mt-6">
              <button
                onClick={prevFlashcard}
                className="px-4 cursor-pointer py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-bold font-mono transition-all"
              >
                PREVIOUS SIGN
              </button>
              <span className="text-xs text-gray-400 font-mono font-bold">
                {flashcardIdx + 1} / {TRAFFIC_SIGNS_DB.length}
              </span>
              <button
                onClick={nextFlashcard}
                className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-bold font-mono transition-all"
              >
                NEXT SIGN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
