"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// import Menu from './components/menu';
const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.1, backgroundColor: "#5996C0", color: "white" },
};
const page = () => {
  const [highScore, setHighScore] = useState(() => {
    // Retrieve high score from localStorage or initialize to 0
    const savedHighScore = localStorage.getItem("highScore");
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });
  const router = useRouter();
  const newgame = () => {
    router.push("/game");
  };
  const leaderboard = () => {
    router.push("/leaderboard");
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <div className="font-lucky bg-[#5996C0] text-white text-4xl w-fit px-3 rounded-md">
          Memory GAME
        </div>

        <div className="font-play">Heighest Score: {highScore} </div>

        <div className="mt-4 space-y-3 text-2xl">
          <motion.div
            className="font-lucky text-[#2577ae] border-2 border-dashed border-[#5996C0] px-3 rounded-md cursor-pointer transition-all"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            onClick={newgame}
            whileHover="hover"
            transition={{ type: "spring", duration: 0.1 }}
          >
            New game
          </motion.div>
          <motion.div
            className="font-lucky text-[#2577ae] border-2 border-dashed border-[#5996C0] px-3 rounded-md cursor-pointer transition-all "
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            onClick={leaderboard}
            transition={{ type: "spring", duration: 0.1 }}
          >
            LeaderBoard
          </motion.div>
          <motion.div
            className="font-lucky text-[#2577ae] border-2 border-dashed border-[#5996C0] px-3 rounded-md cursor-pointer transition-all "
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
              hover: {
                scale: 1.1,
                backgroundColor: "#5996C0",
                color: "#ef413b",
              },
            }}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ type: "spring", duration: 0.1 }}
          >
            Reset Score
          </motion.div>
        </div>
      </div>
    </div>
    // <Menu/>
  );
};

export default page;
