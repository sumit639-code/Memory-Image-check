"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import Confetti from "react-confetti";

const Page = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    // Retrieve high score from localStorage or initialize to 0
    const savedHighScore = localStorage.getItem("highScore");
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [moves, setMoves] = useState(20);
  const router = useRouter();

  useEffect(() => {
    setCards(generateCards());
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setTimeout(checkForMatch, 400); // Delay before checking for matches
    }
  }, [flippedCards]);

  useEffect(() => {
    if (matchedCards.length === cards.length && matchedCards.length > 0) {
      handleGameCompletion();
    } else if (moves <= 0) {
      handleGameCompletion();
    }
  }, [matchedCards, moves]);

  const handleFlip = (index) => {
    if (
      !isAnimating &&
      !matchedCards.includes(index) &&
      !flippedCards.includes(index) &&
      !gameCompleted
    ) {
      setIsAnimating(true);
      setFlippedCards((prev) => [...prev, index]);
      setMoves((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const checkForMatch = useCallback(() => {
    const [firstIndex, secondIndex] = flippedCards;
    if (cards[firstIndex].value === cards[secondIndex].value) {
      setMatchedCards((prev) => [...prev, firstIndex, secondIndex]);
      setScore((prev) => prev + 10);
    }
    setTimeout(() => setFlippedCards([]), 600);
  }, [flippedCards, cards]);

  const handleGameCompletion = () => {
    setGameCompleted(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score);
    }
    setShowPopup(true);
  };

  function generateCards() {
    const cardValues = [
      "./apple",
      "./banana",
      "./carrot",
      "./cherry",
      "./mango",
      "./orange",
      "./strawberry",
      "./watermelon",
    ];
    const cards = [...cardValues, ...cardValues]
      .map((value, index) => ({ value, id: index, matched: false }))
      .sort(() => Math.random() - 0.5);
    return cards;
  }

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handlehome = () => {
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center flex-col p-5">
      {gameCompleted && <Confetti />}
      <div
        onClick={handlehome}
        className="font-lucky bg-[#5996C0] cursor-pointer text-white text-4xl w-fit px-3 rounded-md"
      >
        Memory GAME
      </div>
      <div className="font-play text-xl mt-2">Score : {score}</div>
      <div className="font-play text-xl mt-2">Moves Left : {moves}</div>
      {loading && <div className="mt-4 text-xl">Loading...</div>}
      <div className="grid grid-cols-4 gap-4">
        {cards?.map((card, index) => {
          const isFlipped =
            flippedCards.includes(index) || matchedCards.includes(index);
          return (
            <motion.div
              key={card.id}
              className="relative w-20 h-20 lg:w-40 lg:h-40 md:w-32 md:h-32 sm:w-20 sm:h-20 overflow-hidden"
              onClick={() => handleFlip(index)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.8 }}
              animate={{
                rotateY: isFlipped ? 180 : 0,
                scale: isFlipped ? 1.05 : 1,
              }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                x: { duration: 1 },
              }}
              style={{
                perspective: 1000,
              }}
            >
              <motion.div
                className={`absolute inset-0 w-full h-full object-cover border-4 border-[#5996C0] rounded-xl`}
                style={{
                  opacity: isFlipped ? 0 : 1,
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.6 }}
              >
                <motion.img
                  src="./back.png"
                  className="w-full h-full object-cover rounded-md"
                  onLoad={handleImageLoad}
                />
              </motion.div>

              <motion.div
                className={`absolute inset-0 w-full h-full object-cover border-4 border-[#5996C0] rounded-xl`}
                style={{
                  opacity: isFlipped ? 1 : 0,
                  rotateY: isFlipped ? 0 : 180,
                }}
                transition={{ duration: 0.6 }}
              >
                <motion.img
                  src={`${card.value}.jpg`}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                  onLoad={handleImageLoad}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <div className="text-2xl font-bold mb-4">Game Over!</div>
            <div className="text-lg mb-4">Your Score: {score}</div>
            <div className="text-lg mb-4">High Score: {highScore}</div>
            <div className="text-lg mb-4">Moves Left: {moves}</div>
            <button
              className="mt-4 px-4 py-2 bg-[#5996C0] text-white rounded"
              onClick={() => {
                setShowPopup(false);
                setGameCompleted(false); // Fixed typo here
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
