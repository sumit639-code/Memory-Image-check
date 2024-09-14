"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { highScoreState, userState } from "@/app/context/gameAtoms"; // Adjust the path as necessary
import axios from "axios";

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.1, backgroundColor: "#5996C0", color: "white" },
};

const Page = () => {
  // const user = useRecoilValue(userState);
  const setHighScore = useSetRecoilState(highScoreState);
  // const setUser = useSetRecoilState(userState); // Add this to reset user state
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  console.log(user);
  setHighScore(user.user.score);
  useEffect(() => {
    if (!user.accessToken) {
      router.push("/login");
    }
  }, [user.accessToken, router]);

  const highScore = useRecoilValue(highScoreState);

  const newgame = () => {
    router.push("/game");
  };

  const leaderboard = () => {
    router.push("/leaderboard");
  };

  const resetScore = async () => {
    const score = 0;
    try {
      const response = await fetch("http://localhost:8080/game/updateScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ score }),
      });

      if (!response.ok) {
        throw new Error("Failed to update high score");
      }

      // Ensure getScore is awaited
    } catch (error) {
      console.error("Error updating high score:", error);
    }
    router.refresh();
  };
  useEffect(() => {
    handleUser();
  }, []);
  const logout = async () => {
    try {
      // Perform logout logic here (e.g., API call to invalidate session)
      const response = await axios.post(
        "http://localhost:8080/user/logout",
        {},
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Clear user state and redirect to login
      setUser({
        accessToken: "",
        refreshToken: "",
        user: {
          createdAt: "",
          score: 0,
          username: "",
          _id: "",
        },
      });

      router.push("/login");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const handleUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/getUser", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Update Recoil state with the login data
        const userData = {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          user: {
            createdAt: data.data.createdAt,
            score: data.data.score,
            username: data.data.username,
            _id: data.data._id,
          },
        };
        setUser(userData); // Recoil state will automatically save to localStorage via the useEffect above
        // Redirect to the menu page after login
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <div className="font-lucky bg-[#5996C0] text-white text-4xl w-fit px-3 rounded-md">
          Memory GAME
        </div>

        <div className="font-play">
          Hi! {user.user.username || "couldn't get a user"}
        </div>
        <div className="font-play">Highest Score: {highScore} </div>

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
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ type: "spring", duration: 0.1 }}
            onClick={resetScore}
          >
            Reset Score
          </motion.div>
          <motion.div
            className="font-lucky text-[#2577ae] border-2 border-dashed border-[#5996C0] px-3 rounded-md cursor-pointer transition-all"
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
            onClick={logout}
          >
            Logout
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Page;
