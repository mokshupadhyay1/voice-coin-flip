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
    <div className="flex flex-col items-center gap-2.5 mt-1 sm:mt-2 w-full">
      <motion.button
        id="flip-button"
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full py-4 px-8
          text-white font-bold text-base sm:text-lg
          rounded-2xl
          transition-all duration-300 ease-in-out
          btn-glow
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer active:scale-98 hover:scale-[1.02]'
          }
          ${isListening ? 'listening-pulse' : ''}
        `}
        style={{
          background: 'linear-gradient(135deg, #ff2a85 0%, #c4166e 100%)',
        }}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        aria-label="Flip the coin"
      >
        {disabled ? 'Flipping...' : 'Flip the coin!'}
      </motion.button>

      {/* Helper text */}
      <p className="text-xs text-gray-500 font-normal tracking-wide">
        (Touch screen or press space bar)
      </p>
    </div>
  );
};

export default FlipButton;
