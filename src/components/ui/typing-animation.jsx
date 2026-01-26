'use client';
import { useState, useEffect } from 'react';

export default function TypingWrapper({ children, speed = 50 }) {
  // children mein wahi text aayega jo aapne <TypingWrapper>...</TypingWrapper> ke beech likha hoga
  const text = children; 
  const [displayedText, setDisplayedText] = useState("");
  const [cursor, setCursor]=useState(false)

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setCursor(!cursor)
      }
    }, speed);

    return () => clearInterval(timer);
  });

  return (
    <>
      {displayedText}
      {cursor || <span className="ml-1 border-r-2 border-yellow-400 animate-pulse"></span>}
    </>
  );
}



