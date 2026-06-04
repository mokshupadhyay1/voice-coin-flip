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
    <div 
      className="flex items-center justify-center gap-4 text-sm sm:text-base w-full" 
      id="scoreboard"
    >
      {/* Heads counter */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-full glass-pill flex-1 max-w-[150px]">
        <span className="font-medium text-gray-500">Heads</span>
        <motion.span
          key={`heads-${heads}`}
          initial={{ scale: 1.4, color: '#ff2a85' }}
          animate={{ scale: 1, color: '#374151' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="font-bold"
        >
          {heads}
        </motion.span>
      </div>

      {/* Tails counter */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-full glass-pill flex-1 max-w-[150px]">
        <span className="font-medium text-gray-500">Tails</span>
        <motion.span
          key={`tails-${tails}`}
          initial={{ scale: 1.4, color: '#4f46e5' }}
          animate={{ scale: 1, color: '#374151' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="font-bold"
        >
          {tails}
        </motion.span>
      </div>
    </div>
  );
};

export default ScoreBoard;
