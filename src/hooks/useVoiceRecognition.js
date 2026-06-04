import { useRef, useCallback, useState } from 'react';

/**
 * Custom hook for voice recognition using the Web Speech API.
 * 
 * Improved detection:
 * - Uses continuous mode for better capture
 * - Checks multiple alternatives per result
 * - Broader keyword matching (head/heads/had/hat, tail/tails/tale)
 * - Handles interim results for faster detection
 * - 4-second timeout for more time to speak
 */
const useVoiceRecognition = () => {
  const [status, setStatus] = useState('idle');
  const [detectedCall, setDetectedCall] = useState(null);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore
      }
      recognitionRef.current = null;
    }
  }, []);

  /**
   * Parse transcript for heads/tails with fuzzy matching.
   * Speech recognition often mishears "heads" as "had", "hat", "head", etc.
   * and "tails" as "tale", "tail", "tells", etc.
   */
  const parseTranscript = (transcript) => {
    const lower = transcript.toLowerCase().trim();

    // Check for heads variants (order matters — check before tails)
    const headsPatterns = [
      'heads', 'head', 'had', 'hat', 'hats', 'hedge', 'hades', 'hence', 'hands',
      'eight', 'ad', 'add', 'hide', 'hit', 'hits', 'heat', 'ed', 'eds', 'hads',
      'hud', 'hath', 'height', 'heights', 'ahead', 'at', 'aid', 'aids'
    ];
    for (const pattern of headsPatterns) {
      if (lower === pattern || lower.includes(' ' + pattern) || lower.includes(pattern + ' ') || (lower.length <= pattern.length + 2 && lower.includes(pattern))) return 'heads';
    }

    // Check for tails variants
    const tailsPatterns = [
      'tails', 'tail', 'tale', 'tales', 'tells', 'tell', 'dale', 'dales', 'detail',
      'details', 'sale', 'sales', 'fail', 'fails', 'pill', 'pills', 'trail',
      'trails', 'dell', 'dells', 'tiles', 'tile', 'teal', 'teals', 'til'
    ];
    for (const pattern of tailsPatterns) {
      if (lower === pattern || lower.includes(' ' + pattern) || lower.includes(pattern + ' ') || (lower.length <= pattern.length + 2 && lower.includes(pattern))) return 'tails';
    }

    return null;
  };

  const startListening = useCallback(() => {
    return new Promise((resolve) => {
      if (!isSupported) {
        setStatus('unsupported');
        resolve(null);
        return;
      }

      cleanup();
      setDetectedCall(null);
      setStatus('listening');

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Configuration for better detection
      // Set to detect based on browser default language first, fallback to en-US
      recognition.lang = navigator.language || 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 10; // More alternatives = better chance of detection
      recognition.continuous = false; // Single word recognition works much faster without continuous mode

      let hasResolved = false;

      const resolveWith = (call) => {
        if (hasResolved) return;
        hasResolved = true;
        setDetectedCall(call);
        setStatus(call ? 'detected' : 'idle');
        cleanup();
        resolve(call);
      };

      // Process all results and alternatives
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
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

      recognition.onend = () => {
        if (!hasResolved) {
          resolveWith(null);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setStatus('denied');
        } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
          setStatus('error');
        }
        resolveWith(null);
      };

      try {
        recognition.start();
      } catch (e) {
        setStatus('error');
        resolveWith(null);
        return;
      }

      // 4-second timeout (increased from 3s for better detection)
      timeoutRef.current = setTimeout(() => {
        resolveWith(null);
      }, 4000);
    });
  }, [isSupported, cleanup]);

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
