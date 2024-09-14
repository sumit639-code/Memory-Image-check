"use client";
import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://memory-image-server-production.up.railway.app/game/leaderboard', {
          method: 'POST',
          credentials: 'include' // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Sort users by score in descending order
        const sortedUsers = data.data.sort((a, b) => b.score - a.score);
        setUsers(sortedUsers);
      } catch (err) {
        setError('Error fetching leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p className="text-center text-gray-500 text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Leaderboard</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="py-3 px-4 text-left">Username</th>
            <th className="py-3 px-4 text-left">Score</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-b odd:bg-gray-100">
              <td className="py-3 px-4">{user.username}</td>
              <td className="py-3 px-4">{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
