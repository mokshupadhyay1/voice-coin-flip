import { motion, AnimatePresence } from 'framer-motion';

/**
 * StatusMessage Component
 * 
 * Displays contextual status messages to the user during the flip process.
 * Shows different states: listening, permission denied, speech not detected, etc.
 * 
 * @param {string} status - Current status: 'idle' | 'listening' | 'flipping' | 'denied' | 'unsupported' | 'error' | 'result'
 * @param {string|null} detectedCall - What the user said (for debug/display purposes)
 */
const StatusMessage = ({ status = 'idle', detectedCall = null }) => {
  /**
   * Get the display message and styling for the current status.
   */
  const getStatusConfig = () => {
    switch (status) {
      case 'listening':
        return {
          message: '🎤 Listening... Say "Heads" or "Tails"!',
          color: 'text-pink-500',
          bgColor: 'bg-pink-50',
          borderColor: 'border-pink-200',
          show: true,
        };
      case 'flipping':
        return {
          message: '🪙 Flipping the coin...',
          color: 'text-indigo-500',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200',
          show: true,
        };
      case 'denied':
        return {
          message: '🚫 Microphone permission denied. Result will be random.',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          show: true,
        };
      case 'unsupported':
        return {
          message: '⚠️ Speech recognition not supported in this browser. Result will be random.',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          show: true,
        };
      case 'error':
        return {
          message: '❌ Speech recognition error. Result will be random.',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          show: true,
        };
      case 'result':
        return {
          message: detectedCall
            ? `You said "${detectedCall}" — here's your result!`
            : 'No call detected — random result!',
          color: detectedCall ? 'text-green-600' : 'text-gray-500',
          bgColor: detectedCall ? 'bg-green-50' : 'bg-gray-50',
          borderColor: detectedCall ? 'border-green-200' : 'border-gray-200',
          show: true,
        };
      default:
        return { message: '', color: '', bgColor: '', borderColor: '', show: false };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="h-12 flex items-center justify-center" id="status-message">
      <AnimatePresence mode="wait">
        {config.show && (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`
              px-4 py-2 rounded-full text-xs sm:text-sm font-medium
              ${config.color} ${config.bgColor} ${config.borderColor}
              border backdrop-blur-sm
            `}
          >
            {config.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusMessage;
