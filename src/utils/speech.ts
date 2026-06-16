export const speakWithFallback = (
  text: string,
  lang: "km-KH" | "en-US",
  id: string,
  setSpeechActive?: (id: string | null) => void
) => {
  if (lang === "km-KH") {
    // Check if there is an actual km-KH voice in speechSynthesis
    let hasKhmer = false;
    if ("speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      hasKhmer = voices.some(v => v.lang.toLowerCase().includes("km"));
    }

    // If native Khmer voice is missing, fallback to Google Translate TTS
    if (!hasKhmer) {
      if (setSpeechActive) setSpeechActive(id);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=km&q=${encodeURIComponent(text)}`;
      const audio = new Audio(url);
      
      audio.onended = () => { if (setSpeechActive) setSpeechActive(null); };
      audio.onerror = () => {
        if (setSpeechActive) setSpeechActive(null);
        alert("Unable to play Khmer voice. Please check your internet connection.");
      };
      
      audio.play().catch((err) => {
        console.error("Audio playback failed:", err);
        if (setSpeechActive) setSpeechActive(null);
      });
      return;
    }
  }

  // Use native browser speech for English or if Khmer voice is actually available natively
  if (!("speechSynthesis" in window)) {
    alert("Text-to-speech is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();
  if (setSpeechActive) setSpeechActive(id);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  utterance.onend = () => { if (setSpeechActive) setSpeechActive(null); };
  utterance.onerror = () => { if (setSpeechActive) setSpeechActive(null); };
  window.speechSynthesis.speak(utterance);
};
