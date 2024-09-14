"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { userState } from "@/app/context/gameAtoms"; // Adjust the import path as needed

const url = "https://memory-image-server-production.up.railway.app/user/register"; // Adjust the URL as needed

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useRecoilValue(userState); // Get the user state from Recoil

  useEffect(() => {
    // Check if user is already logged in
    if (user.accessToken) {
      router.push("/"); // Redirect to the root page if user is logged in
    }
  }, [user, router]);

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

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
        console.log("Registration successful:", data);
        // Redirect to login page or wherever appropriate
        router.push("/login");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen font-play bg-[#F8D5BB]">
      <div className="text-center bg-white p-10 rounded-xl shadow-md">
        <h1 className="text-4xl text-[#4F91B1] font-lucky mb-4">MEMORY GAME</h1>
        <p className="text-lg mb-6">Register to Create an Account</p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border-2 border-dashed border-[#4F91B1] rounded-lg text-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-dashed border-[#4F91B1] rounded-lg text-lg"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border-2 border-dashed border-[#4F91B1] rounded-lg text-lg"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={handleRegister}
            className={`w-full bg-[#4F91B1] text-white text-lg py-3 border-2 border-dashed border-[#4F91B1] rounded-lg hover:bg-[#357693] transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "REGISTER"}
          </button>
          <div className="text-sm sm:text-base mt-4 text-center cursor-pointer" onClick={() => router.push("/login")}>
          Already have an account
        </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
