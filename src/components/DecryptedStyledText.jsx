import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledDecryptText = styled.span`
  display: inline-block;
  font-size: ${(props) => props.fontSize || 'inherit'};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  color: ${(props) => props.color || 'inherit'};
  text-align: ${(props) => props.textAlign || 'left'};
  animation: fadeIn 1s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const DecryptedStyledText = ({ text, delay = 50, className, ...styleProps }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [decryptionCompleted, setDecryptionCompleted] = useState(false);

  useEffect(() => {
    if (decryptionCompleted) return;

    let iteration = 0;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const interval = setInterval(() => {
      const partiallyDecryptedText = text
        .split('')
        .map((char, idx) => {
          if (idx < iteration) return char; // Reveal actual character
          return characters[Math.floor(Math.random() * characters.length)]; // Random character
        })
        .join('');

      setDisplayedText(partiallyDecryptedText);

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayedText(text);
        setDecryptionCompleted(true);
      }

      iteration++;
    }, delay);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [text, delay, decryptionCompleted]);

  return (
    <StyledDecryptText className={className} {...styleProps}>
      {displayedText}
    </StyledDecryptText>
  );
};

export default DecryptedStyledText;
