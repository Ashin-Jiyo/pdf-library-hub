import React from 'react';
import './terminalLoader.css';
import LetterGlitch from './LetterGlitch';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  renderGlitchBg?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...', className = '', renderGlitchBg = false }) => {
  return (
    <div className={`flex items-center justify-center w-full min-h-screen ${className}`} style={{ background: 'transparent', position: 'relative' }}>
      {renderGlitchBg && (
        <LetterGlitch glitchSpeed={50} centerVignette={true} outerVignette={false} smooth={true} zIndex={0} />
      )}
      <div className="terminal-loader" role="status" aria-live="polite" aria-label={message}>
        <div className="terminal-header">
          <div className="terminal-title">Status</div>
          <div className="terminal-controls">
            <div className="control close"></div>
            <div className="control minimize"></div>
            <div className="control maximize"></div>
          </div>
        </div>
        <div className="terminal-text">{message}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
