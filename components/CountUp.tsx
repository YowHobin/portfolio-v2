import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness
  });

  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;

      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0
      };

      const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);

      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === 'down' ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    let startTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let randomIntervalId: ReturnType<typeof setInterval> | null = null;
    let endTimeoutId: ReturnType<typeof setTimeout> | null = null;

    if (isInView && startWhen) {
      if (typeof onStart === 'function') {
        onStart();
      }

      const startRandomization = () => {
        const randomDurationMs = duration * 1000;
        const startedAt = performance.now();
        const min = Math.min(from, to);
        const max = Math.max(from, to);

        randomIntervalId = setInterval(() => {
          if (!ref.current) return;

          const elapsed = performance.now() - startedAt;
          if (elapsed >= randomDurationMs) {
            if (randomIntervalId) {
              clearInterval(randomIntervalId);
              randomIntervalId = null;
            }

            motionValue.set(direction === 'down' ? from : to);
            return;
          }

          const range = max - min || 1;
          const randomValue = min + Math.random() * range;
          ref.current.textContent = formatValue(randomValue);
        }, 80);
      };

      startTimeoutId = setTimeout(startRandomization, delay * 1000);

      endTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === 'function') {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000
      );
    }

    return () => {
      if (startTimeoutId) {
        clearTimeout(startTimeoutId);
      }
      if (randomIntervalId) {
        clearInterval(randomIntervalId);
      }
      if (endTimeoutId) {
        clearTimeout(endTimeoutId);
      }
    };
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration, formatValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}
