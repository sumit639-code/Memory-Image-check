"use client";
import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { userState } from "@/app/context/gameAtoms"; // Adjust the path as necessary

const url = "https://memory-image-server-production.up.railway.app/user/login";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  // Initialize Recoil state from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.accessToken) {
        router.push("/"); // Redirect if already logged in
      }
    }
  }, [router, setUser]);

  // Save Recoil state to localStorage whenever the user state changes
  useEffect(() => {
    if (user && user.accessToken) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("refreshToken", user.refreshToken);
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update Recoil state with the login data
        const userData = {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          user: {
            createdAt: data.data.user.createdAt,
            score: data.data.user.score,
            username: data.data.user.username,
            _id: data.data.user._id,
          },
        };
        setUser(userData); // Recoil state will automatically save to localStorage via the useEffect above
        router.push("/"); // Redirect to the menu page after login
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen font-play bg-[#F8D5BB] p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl text-[#4F91B1] font-lucky mb-4">
          MEMORY GAME
        </h1>
        <p className="text-base sm:text-lg mb-6">Login to Continue</p>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border-2 border-dashed border-[#4F91B1] rounded-lg text-base sm:text-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-dashed border-[#4F91B1] rounded-lg text-base sm:text-lg"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={handleLogin}
            className={`w-full bg-[#4F91B1] text-white text-base sm:text-lg py-3 border-2 border-dashed border-[#4F91B1] rounded-lg hover:bg-[#357693] transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "LOGIN"}
          </button>
        </form>
        <div
          className="text-sm sm:text-base mt-4 text-center cursor-pointer"
          onClick={() => router.push("/register")}
        >
          Register
        </div>
      </div>
    </div>
  );
};

export default Login;
