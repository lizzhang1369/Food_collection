import { motion } from 'motion/react';
import { Soup } from 'lucide-react';

export const SoupLogo = () => {
  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      {/* Animated Steam */}
      <div className="absolute -top-1 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0, scale: 0.5 }}
            animate={{ 
              y: -15, 
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.8],
              x: Math.sin(i) * 5
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut"
            }}
            className="w-1 h-3 bg-orange-warm/40 rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* The Bowl */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 text-orange-warm"
      >
        <Soup size={40} strokeWidth={2.5} />
      </motion.div>

      {/* Decorative Sparkle */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -right-1 top-2 w-2 h-2 bg-chick-yellow rounded-full shadow-[0_0_8px_rgba(255,214,102,0.8)]"
      />
    </div>
  );
};
