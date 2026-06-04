import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Coin from './components/Coin';
import FlipButton from './components/FlipButton';
import ScoreBoard from './components/ScoreBoard';
import useVoiceRecognition from './hooks/useVoiceRecognition';

/**
 * App - Main application component for Voice Coin Flip
 * 
 * Looks like a normal coin flip website but secretly listens to the user's
 * voice call and always shows the OPPOSITE result.
 * 
 * The animation and result reveal are perfectly synced via onAnimationComplete
 * callback from the Coin component — no setTimeout drift.
 */
function App() {
  const [result, setResult] = useState('heads');
  const [isFlipping, setIsFlipping] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);
  const [scores, setScores] = useState({ heads: 0, tails: 0 });

  // Store the pending result in a ref so the callback always reads latest value
  const pendingResultRef = useRef(null);

  const { startListening } = useVoiceRecognition();

  /**
   * Core flip logic:
   * 1. Start flip animation + voice recognition simultaneously
   * 2. Voice finishes → compute inverted result → store as pendingResult
   * 3. Coin animates towards the pending result face
   * 4. onAnimationComplete fires → reveal result instantly (zero lag)
   */
  const handleFlip = useCallback(async () => {
    if (isFlipping) return;

    setIsFlipping(true);

    // Start voice recognition (runs in background, max 3 seconds)
    const detectedCall = await startListening();

    // Determine the result (INVERTED logic — the core trick!)
    let finalResult;
    if (detectedCall === 'heads') {
      finalResult = 'tails';
    } else if (detectedCall === 'tails') {
      finalResult = 'heads';
    } else {
      finalResult = Math.random() < 0.5 ? 'heads' : 'tails';
    }

    // Set pending result — Coin will animate towards this face
    pendingResultRef.current = finalResult;
    setPendingResult(finalResult);
  }, [isFlipping, startListening]);

  /**
   * Called by Coin when flip animation completes.
   * Result reveal is perfectly synced — no lag.
   */
  const handleAnimationComplete = useCallback(() => {
    const finalResult = pendingResultRef.current;
    if (finalResult) {
      setResult(finalResult);
      setScores(prev => ({
        ...prev,
        [finalResult]: prev[finalResult] + 1,
      }));
      pendingResultRef.current = null;
      setPendingResult(null);
    }
    setIsFlipping(false);
  }, []);

  /**
   * Spacebar shortcut to flip.
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isFlipping) {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipping, handleFlip]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 sm:pt-12 md:pt-16 px-4 pb-8">
      {/* Header */}
      <motion.header
        className="flex flex-col items-center gap-3 mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Coin icon */}
        <div
          className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="14" rx="9" ry="5" stroke="#2d3047" strokeWidth="1.8" fill="none" />
            <ellipse cx="12" cy="10" rx="9" ry="5" stroke="#2d3047" strokeWidth="1.8" fill="none" />
            <line x1="3" y1="10" x2="3" y2="14" stroke="#2d3047" strokeWidth="1.8" />
            <line x1="21" y1="10" x2="21" y2="14" stroke="#2d3047" strokeWidth="1.8" />
            <line x1="7" y1="6" x2="7" y2="6.5" stroke="#2d3047" strokeWidth="1.2" />
            <line x1="9" y1="5.5" x2="9" y2="6" stroke="#2d3047" strokeWidth="1.2" />
            <line x1="11" y1="5.2" x2="11" y2="5.7" stroke="#2d3047" strokeWidth="1.2" />
            <line x1="13" y1="5.2" x2="13" y2="5.7" stroke="#2d3047" strokeWidth="1.2" />
            <line x1="15" y1="5.5" x2="15" y2="6" stroke="#2d3047" strokeWidth="1.2" />
            <line x1="17" y1="6" x2="17" y2="6.5" stroke="#2d3047" strokeWidth="1.2" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 tracking-tight">
          Heads or Tails
        </h1>

        <p className="text-sm sm:text-base text-gray-400 font-normal">
          Flip a virtual coin with this online and free app.
        </p>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="flex flex-col items-center w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      >
        <ScoreBoard heads={scores.heads} tails={scores.tails} />

        <Coin
          result={result}
          isFlipping={isFlipping}
          pendingResult={pendingResult}
          onFlip={handleFlip}
          onAnimationComplete={handleAnimationComplete}
        />

        <FlipButton onClick={handleFlip} disabled={isFlipping} />
      </motion.main>
    </div>
  );
}

export default App;
