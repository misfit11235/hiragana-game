import { useState, useCallback } from 'react';

export function useHiraganaGame(selectedChars) {
  const [currentChar, setCurrentChar] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);

  const startGame = useCallback(() => {
    if (selectedChars.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedChars.length);
      setCurrentChar(selectedChars[randomIndex]);
      setWrongGuesses(0);
    }
  }, [selectedChars]);

  const checkAnswer = useCallback((input) => {
    if (!currentChar) return false;

    const isCorrect = input.toLowerCase() === currentChar.romanization;
    setScore((prevScore) => (isCorrect ? prevScore + 1 : prevScore));
    setTotalAttempts((prevAttempts) => prevAttempts + 1);
    
    if (!isCorrect) {
      setWrongGuesses((prev) => Math.min(prev + 1, 3));
    } else {
      setWrongGuesses(0);
    }

    if (isCorrect) {
      startGame();
    }

    return isCorrect;
  }, [currentChar, startGame]);

  const resetGame = useCallback(() => {
    setScore(0);
    setTotalAttempts(0);
    setWrongGuesses(0);
    setCurrentChar(null);
  }, []);

  return {
    currentChar,
    score,
    totalAttempts,
    wrongGuesses,
    setWrongGuesses,
    startGame,
    checkAnswer,
    resetGame,
  };
}

