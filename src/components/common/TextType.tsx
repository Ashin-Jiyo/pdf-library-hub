import React from 'react';

interface TextTypeProps {
  words: string[];
  typeSpeed?: number; // ms per character while typing
  deleteSpeed?: number; // ms per character while deleting
  delayBetween?: number; // pause at end of a word before deleting
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  cursorChar?: string;
}

const TextType: React.FC<TextTypeProps> = ({
  words,
  typeSpeed = 60,
  deleteSpeed = 30,
  delayBetween = 1200,
  loop = true,
  className,
  style,
  ariaLabel,
  cursorChar = '|',
}) => {
  const [wordIndex, setWordIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);
  const [blink, setBlink] = React.useState(true);
  const [finished, setFinished] = React.useState(false);

  const currentWord = words[wordIndex] || '';

  // Cursor blink
  React.useEffect(() => {
    const blinkInterval = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Typing logic
  React.useEffect(() => {
    if (!words.length) return;
    if (finished) return;

    // At end of non-looping sequence
    if (!loop && wordIndex === words.length - 1 && subIndex === currentWord.length && !deleting) {
      setFinished(true);
      return;
    }

    let timeout = typeSpeed;

    // If typing forward
    if (!deleting && subIndex < currentWord.length) {
      timeout = typeSpeed;
      const t = setTimeout(() => setSubIndex((i) => i + 1), timeout);
      return () => clearTimeout(t);
    }

    // If at end of word, pause then start deleting
    if (!deleting && subIndex === currentWord.length) {
      const t = setTimeout(() => setDeleting(true), delayBetween);
      return () => clearTimeout(t);
    }

    // Deleting characters
    if (deleting && subIndex > 0) {
      timeout = deleteSpeed;
      const t = setTimeout(() => setSubIndex((i) => i - 1), timeout);
      return () => clearTimeout(t);
    }

    // Finished deleting, move to next word
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setWordIndex((idx) => (idx + 1) % words.length);
    }
  }, [subIndex, deleting, wordIndex, words, typeSpeed, deleteSpeed, delayBetween, loop, finished, currentWord.length]);

  // Keep currentWord in sync when wordIndex changes
  React.useEffect(() => {
    setSubIndex(0);
    setDeleting(false);
  }, [wordIndex]);

  const text = currentWord.slice(0, subIndex);

  return (
    <span
      className={className}
      style={style}
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {text}
      <span aria-hidden="true" style={{ opacity: blink ? 1 : 0 }}> {cursorChar}</span>
    </span>
  );
};

export default TextType;
