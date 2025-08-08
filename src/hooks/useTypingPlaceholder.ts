import { useEffect, useRef } from 'react';

type Options = {
  typeSpeed?: number; // ms per character typing
  deleteSpeed?: number; // ms per character deleting
  delayBetween?: number; // pause at end before deleting
  startDelay?: number; // initial delay before start
  pauseOnFocus?: boolean; // pause animation when input focused
};

export function useTypingPlaceholder(
  inputRef: React.RefObject<HTMLInputElement | null>,
  words: string[],
  options: Options = {}
) {
  const {
    typeSpeed = 45,
    deleteSpeed = 25,
    delayBetween = 1200,
    startDelay = 300,
    pauseOnFocus = true,
  } = options;

  const wordIndexRef = useRef(0);
  const subIndexRef = useRef(0);
  const deletingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const input = inputRef.current;
    if (!input || words.length === 0) return;

    const handleFocus = () => {
      if (pauseOnFocus) pausedRef.current = true;
    };
    const handleBlur = () => {
      if (pauseOnFocus) pausedRef.current = false;
    };
    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);

    const tick = () => {
      if (!inputRef.current) return;
      if (pausedRef.current) {
        // While paused (e.g., focused), schedule next check
        timerRef.current = window.setTimeout(tick, 200);
        return;
      }

      const currentWord = words[wordIndexRef.current] || '';

      // Typing forward
      if (!deletingRef.current && subIndexRef.current < currentWord.length) {
        subIndexRef.current += 1;
        inputRef.current.placeholder = currentWord.slice(0, subIndexRef.current);
        timerRef.current = window.setTimeout(tick, typeSpeed);
        return;
      }

      // Pause at full word, then start deleting
      if (!deletingRef.current && subIndexRef.current === currentWord.length) {
        deletingRef.current = true;
        timerRef.current = window.setTimeout(tick, delayBetween);
        return;
      }

      // Deleting
      if (deletingRef.current && subIndexRef.current > 0) {
        subIndexRef.current -= 1;
        inputRef.current.placeholder = currentWord.slice(0, subIndexRef.current);
        timerRef.current = window.setTimeout(tick, deleteSpeed);
        return;
      }

      // Move to next word
      if (deletingRef.current && subIndexRef.current === 0) {
        deletingRef.current = false;
        wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
        timerRef.current = window.setTimeout(tick, typeSpeed);
        return;
      }
    };

    timerRef.current = window.setTimeout(() => {
      tick();
    }, startDelay);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
    };
  }, [inputRef, words, typeSpeed, deleteSpeed, delayBetween, startDelay, pauseOnFocus]);
}
