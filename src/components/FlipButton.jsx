import { motion } from 'framer-motion';

/**
 * FlipButton Component
 * 
 * The main call-to-action button for triggering the coin flip.
 * Disabled during flipping animation with visual feedback.
 * Supports both click and spacebar interactions.
 * 
 * @param {function} onClick - Handler for flip action
 * @param {boolean} disabled - Whether the button is disabled (during flip)
 * @param {boolean} isListening - Whether voice recognition is active
 */
const FlipButton = ({ onClick, disabled = false, isListening = false }) => {
  return (
    <div className="flex flex-col items-center gap-3 mt-2 sm:mt-4">
      <motion.button
        id="flip-button"
        onClick={onClick}
        disabled={disabled}
        className={`
          relative px-10 sm:px-14 py-3.5 sm:py-4
          text-white font-semibold text-base sm:text-lg
          rounded-full
          transition-all duration-300 ease-in-out
          btn-glow
          ${disabled 
            ? 'opacity-60 cursor-not-allowed' 
            : 'cursor-pointer active:scale-95 hover:scale-105'
          }
          ${isListening ? 'listening-pulse' : ''}
        `}
        style={{
          background: 'linear-gradient(135deg, #e91e8c 0%, #c4166e 100%)',
          boxShadow: disabled 
            ? '0 2px 10px rgba(233, 30, 140, 0.15)'
            : '0 4px 20px rgba(233, 30, 140, 0.3)',
        }}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        aria-label="Flip the coin"
      >
        {disabled ? 'Flipping...' : 'Flip the coin!'}
      </motion.button>

      {/* Helper text */}
      <p className="text-sm text-gray-400 font-normal">
        (Touch screen or press space bar)
      </p>
    </div>
  );
};

export default FlipButton;
