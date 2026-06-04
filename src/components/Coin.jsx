import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

/**
 * Coin Component — Two-Phase 3D Flip Animation
 * 
 * Phase 1: SPIN — starts instantly on click, continuous fast rotation
 * Phase 2: LAND — when pendingResult arrives, decelerates and lands on correct face
 * 
 * This eliminates any delay between click and animation start.
 */
const Coin = ({ result = 'heads', isFlipping = false, pendingResult = null, onFlip, onAnimationComplete }) => {
  const controls = useAnimation();
  const isHeads = result === 'heads';
  const phaseRef = useRef('idle'); // 'idle' | 'spinning' | 'landing'

  // Phase 1: Start spinning immediately when isFlipping becomes true
  useEffect(() => {
    if (isFlipping && phaseRef.current === 'idle') {
      phaseRef.current = 'spinning';

      // Immediate fast spin — no waiting for voice result
      controls.start({
        rotateY: [0, 3600],
        y: [0, -70],
        scale: [1, 1.1],
        transition: {
          rotateY: {
            duration: 3,
            ease: 'linear',
            repeat: Infinity,
          },
          y: {
            duration: 0.4,
            ease: 'easeOut',
          },
          scale: {
            duration: 0.4,
            ease: 'easeOut',
          },
        },
      });
    }

    if (!isFlipping && phaseRef.current !== 'idle') {
      phaseRef.current = 'idle';
    }
  }, [isFlipping, controls]);

  // Phase 2: Land on correct face when pendingResult arrives
  useEffect(() => {
    if (isFlipping && pendingResult && phaseRef.current === 'spinning') {
      phaseRef.current = 'landing';

      const landOnHeads = pendingResult === 'heads';
      // Land rotation: ensure correct face (0° = heads, 180° = tails)
      const finalRotation = 3600 + (landOnHeads ? 0 : 180);

      // Stop the infinite spin and transition to landing
      controls.stop();
      controls.start({
        rotateY: finalRotation,
        y: 0,
        scale: 1,
        transition: {
          rotateY: {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1], // Smooth deceleration
          },
          y: {
            duration: 1.0,
            ease: [0.34, 1.56, 0.64, 1], // Slight bounce
          },
          scale: {
            duration: 1.0,
            ease: 'easeOut',
          },
        },
      }).then(() => {
        phaseRef.current = 'idle';
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });
    }
  }, [isFlipping, pendingResult, controls, onAnimationComplete]);

  // Snap to correct position when not flipping (initial state / after result)
  useEffect(() => {
    if (!isFlipping && phaseRef.current === 'idle') {
      controls.set({
        rotateY: isHeads ? 0 : 180,
        y: 0,
        scale: 1,
      });
    }
  }, [isFlipping, isHeads, controls]);

  return (
    <div
      className="flex items-center justify-center my-6 sm:my-8 md:my-10"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className={`relative w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 ${
          !isFlipping ? 'cursor-pointer' : 'cursor-default'
        }`}
        animate={controls}
        onClick={!isFlipping ? onFlip : undefined}
        whileHover={!isFlipping ? { scale: 1.04 } : {}}
        whileTap={!isFlipping ? { scale: 0.97 } : {}}
        style={{ transformStyle: 'preserve-3d' }}
        title="Click to flip!"
      >
        {/* ========== HEADS FACE ========== */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(145deg, #ec2891 0%, #d6196f 50%, #c4166e 100%)',
            boxShadow: `
              0 10px 50px rgba(233, 30, 140, 0.35),
              0 4px 20px rgba(233, 30, 140, 0.2),
              inset 0 2px 0 rgba(255, 255, 255, 0.2),
              inset 0 -2px 4px rgba(0, 0, 0, 0.1)
            `,
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 'calc(100% - 26px)',
              height: 'calc(100% - 26px)',
              border: '2.5px dotted rgba(255, 255, 255, 0.4)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)',
            }}
          />
          <span
            className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-wider select-none z-10"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.25)', letterSpacing: '4px' }}
          >
            HEADS
          </span>
        </div>

        {/* ========== TAILS FACE ========== */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(145deg, #1e1e36 0%, #141428 50%, #0d0d1a 100%)',
            boxShadow: `
              0 10px 50px rgba(0, 0, 0, 0.45),
              0 4px 20px rgba(0, 0, 0, 0.3),
              inset 0 2px 0 rgba(255, 255, 255, 0.06),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3)
            `,
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 'calc(100% - 26px)',
              height: 'calc(100% - 26px)',
              border: '2.5px dotted rgba(255, 255, 255, 0.3)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.06) 0%, transparent 60%)',
            }}
          />
          <span
            className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-wider select-none z-10"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)', letterSpacing: '4px' }}
          >
            TAILS
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Coin;
