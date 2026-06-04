import { motion } from 'framer-motion';

/**
 * ScoreBoard Component
 * 
 * Displays the running count of heads and tails results.
 * Features subtle animations when counts update.
 * 
 * @param {number} heads - Count of heads results
 * @param {number} tails - Count of tails results
 */
const ScoreBoard = ({ heads = 0, tails = 0 }) => {
  return (
    <div className="flex items-center justify-center gap-6 sm:gap-8 text-base sm:text-lg" id="scoreboard">
      {/* Heads counter */}
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-gray-600">Heads:</span>
        <motion.span
          key={`heads-${heads}`}
          initial={{ scale: 1.4, color: '#e91e8c' }}
          animate={{ scale: 1, color: '#1a1a2e' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="font-bold text-gray-800"
        >
          {heads}
        </motion.span>
      </div>

      {/* Tails counter */}
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-gray-600">Tails:</span>
        <motion.span
          key={`tails-${tails}`}
          initial={{ scale: 1.4, color: '#e91e8c' }}
          animate={{ scale: 1, color: '#1a1a2e' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="font-bold text-gray-800"
        >
          {tails}
        </motion.span>
      </div>
    </div>
  );
};

export default ScoreBoard;
