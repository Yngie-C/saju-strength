'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IS_TOSS } from '@/lib/design-tokens';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const iconMap: Record<ToastType, string> = {
  success: '\u2713',
  error: '\u0021',
  info: '\u2139',
};

const bgMap: Record<ToastType, string> = IS_TOSS
  ? {
      success: 'bg-tds-grey-900 text-white',
      error: 'bg-tds-red-500 text-white',
      info: 'bg-tds-grey-800 text-white',
    }
  : {
      success: 'bg-foreground text-background',
      error: 'bg-destructive text-destructive-foreground',
      info: 'bg-foreground text-background',
    };

export function Toast({
  message,
  type = 'success',
  visible,
  onClose,
  duration = 3000,
}: ToastProps) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
    if (visible) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${bgMap[type]}`}
        >
          <span className="text-base leading-none">{iconMap[type]}</span>
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
