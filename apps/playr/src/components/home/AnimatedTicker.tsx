'use client';

import { motion } from 'framer-motion';

const COLLAB_ITEMS = [
  "OFFICIAL PARTNER: CHENNAI SUPER KINGS",
  "NEW DROP: SEATTLE ORCAS PRO KIT",
  "RESTOCKED: MUMBAI INDIANS TRAINING GEAR",
  "OFFICIAL MERCHANDISE: UP YODDHAS",
];

export function AnimatedTicker() {
  return (
    <div className="w-full bg-[#867b5d] text-[#fdf9f0] py-3 overflow-hidden flex whitespace-nowrap">
      <motion.div
        className="flex gap-16 pr-16 items-center"
        animate={{ x: [0, -1000] }} 
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {[...COLLAB_ITEMS, ...COLLAB_ITEMS, ...COLLAB_ITEMS].map((item, i) => (
          <div key={i} className="flex items-center gap-16 text-sm font-bold tracking-widest uppercase">
            <span>{item}</span>
            <span className="w-2 h-2 rounded-full bg-[#fdf9f0]/50" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
