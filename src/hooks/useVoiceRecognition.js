import { useRef, useCallback, useState } from 'react';

/**
 * Custom hook for voice recognition using the Web Speech API.
 * Listens for "heads" or "tails" spoken by the user.
 * 
 * Returns the detected call and status information.
 * The recognition automatically stops after detecting a valid word
 * or after a 3-second timeout.
 */
const useVoiceRecognition = () => {
  const [status, setStatus] = useState('idle'); // idle | listening | detected | error | unsupported | denied
  const [detectedCall, setDetectedCall] = useState(null); // 'heads' | 'tails' | null
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  /**
   * Check if the Web Speech API is supported in the current browser.
   */
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  /**
   * Clean up recognition instance and timeout.
   */
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore errors during cleanup
      }
      recognitionRef.current = null;
    }
  }, []);

  /**
   * Start listening for the user's coin call.
   * Returns a promise that resolves with the detected call ('heads' or 'tails')
   * or null if nothing valid was detected.
   */
  const startListening = useCallback(() => {
    return new Promise((resolve) => {
      // Check browser support
      if (!isSupported) {
        setStatus('unsupported');
        resolve(null);
        return;
      }

      // Clean up any previous instance
      cleanup();

      // Reset state
      setDetectedCall(null);
      setStatus('listening');

      // Create new recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Configure recognition
      recognition.lang = 'en-US';
      recognition.interimResults = true; // Get results as they come
      recognition.maxAlternatives = 5; // Check multiple interpretations
      recognition.continuous = false; // Single utterance mode

      let hasResolved = false;

      /**
       * Parse transcript for "heads" or "tails" keywords.
       */
      const parseTranscript = (transcript) => {
        const lower = transcript.toLowerCase().trim();
        if (lower.includes('head')) return 'heads';
        if (lower.includes('tail')) return 'tails';
        return null;
      };

      /**
       * Handle successful resolution with a detected call.
       */
      const resolveWith = (call) => {
        if (hasResolved) return;
        hasResolved = true;
        setDetectedCall(call);
        setStatus(call ? 'detected' : 'idle');
        cleanup();
        resolve(call);
      };

      // Handle recognition results
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          // Check all alternatives for a match
          for (let j = 0; j < result.length; j++) {
            const transcript = result[j].transcript;
            const call = parseTranscript(transcript);
            if (call) {
              resolveWith(call);
              return;
            }
          }
        }
      };

      // Handle recognition end (no match found)
      recognition.onend = () => {
        resolveWith(null);
      };

      // Handle errors
      recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setStatus('denied');
        } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
          setStatus('error');
        }
        resolveWith(null);
      };

      // Start recognition
      try {
        recognition.start();
      } catch (e) {
        setStatus('error');
        resolveWith(null);
        return;
      }

      // Set 3-second timeout
      timeoutRef.current = setTimeout(() => {
        resolveWith(null);
      }, 3000);
    });
  }, [isSupported, cleanup]);

  /**
   * Stop listening immediately.
   */
  const stopListening = useCallback(() => {
    cleanup();
    setStatus('idle');
  }, [cleanup]);

  return {
    startListening,
    stopListening,
    status,
    detectedCall,
    isSupported,
  };
};

export default useVoiceRecognition;
