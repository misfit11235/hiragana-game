"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { hiraganaList } from "@/../utils/hiraganaData";
import { useHiraganaGame } from "@/hooks/useHiraganaGame";

export default function HiraganaGame() {
  const [selectedChars, setSelectedChars] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [motivationalMessage, setMotivationalMessage] = useState("");

  const {
    currentChar,
    score,
    totalAttempts,
    wrongGuesses,
    setWrongGuesses,
    startGame,
    checkAnswer,
    resetGame,
  } = useHiraganaGame(selectedChars);

  const handleCharacterToggle = (char) => {
    setSelectedChars((prev) =>
      prev.some((c) => c.character === char.character)
        ? prev.filter((c) => c.character !== char.character)
        : [...prev, char]
    );
  };

  const handleStartGame = () => {
    if (selectedChars.length > 0) {
      setGameStarted(true);
      startGame();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isCorrect = checkAnswer(userInput);
    if (wrongGuesses < 3) {
      setFeedback(isCorrect ? "Correct!" : "Incorrect. Try again!");
      setTimeout(() => setFeedback(""), 1500);
    } else {
      setFeedback("");
    }
    setUserInput("");
  };

  return (
    <div className="container mx-auto p-4 pt-16 md:pt-24 max-w-4xl min-h-screen flex flex-col justify-center">
      <div className="text-center mb-12">
        <p className="text-6xl font-bold text-primary transform -rotate-6 inline-block">
          こんにちは!
        </p>
        <p className="text-2xl mt-6">Welcome to the Hiragana Game!</p>
      </div>
      {!gameStarted ? (
        <div>
          {motivationalMessage && (
            <p className="text-xl text-accent-foreground mb-4">
              {motivationalMessage}
            </p>
          )}
          <h2 className="text-xl font-semibold mb-4">
            Select characters to practice:
          </h2>
          {Object.entries(hiraganaList).map(([key, chars]) => (
            <div key={key} className="mb-6">
              <div className="flex items-center mb-2">
                <Checkbox
                  id={`row-${key}`}
                  checked={chars.every((char) =>
                    selectedChars.some((c) => c.character === char.character)
                  )}
                  onCheckedChange={(checked) => {
                    setSelectedChars((prev) =>
                      checked
                        ? [...new Set([...prev, ...chars])]
                        : prev.filter(
                            (c) =>
                              !chars.some(
                                (char) => char.character === c.character
                              )
                          )
                    );
                  }}
                />
                <Label
                  htmlFor={`row-${key}`}
                  className="ml-2 text-lg font-medium"
                >
                  {key.toUpperCase()} Row
                </Label>
              </div>
              <div className="grid grid-cols-5 gap-2 ml-6">
                {chars.map((char) => (
                  <div
                    key={char.character}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={char.character}
                      checked={selectedChars.some(
                        (c) => c.character === char.character
                      )}
                      onCheckedChange={() => handleCharacterToggle(char)}
                    />
                    <Label htmlFor={char.character}>
                      {char.character} ({char.romanization})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button
            onClick={handleStartGame}
            disabled={selectedChars.length === 0}
            className="mt-4"
          >
            Start Game
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <p className="text-6xl mb-2">{currentChar?.character}</p>
            <p>
              Score: {score} / {totalAttempts}
            </p>
            <div className="flex justify-center mt-2">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl mx-1 transition-opacity duration-300 ${
                    i < 3 - wrongGuesses
                      ? "text-red-500"
                      : "text-gray-300 opacity-0"
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>
          </div>
          {wrongGuesses < 3 ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center"
            >
              <Input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter the romanization"
                className="mb-2 max-w-xs"
              />
              <Button type="submit">Submit</Button>
            </form>
          ) : (
            <div className="mt-4">
              <p className="text-xl text-accent-foreground mb-4">
                You've reached 3 wrong guesses. Time to review the characters.
              </p>
              <Button
                onClick={() => {
                  setGameStarted(false);
                  resetGame();
                }}
              >
                Return to Character Selection
              </Button>
            </div>
          )}
          {feedback && wrongGuesses < 3 && (
            <p className="mt-2 font-semibold text-accent-foreground">
              {feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
