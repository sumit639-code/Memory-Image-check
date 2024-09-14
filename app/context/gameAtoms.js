// state/atoms.js
"use client";
import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    accessToken: "",
    refreshToken: "",
    user: {
      createdAt: "",
      score: 0,
      username: "",
      _id: "",
    },
  },
});

export const cardsState = atom({
  key: "cardsState",
  default: [],
});

export const flippedCardsState = atom({
  key: "flippedCardsState",
  default: [],
});

export const matchedCardsState = atom({
  key: "matchedCardsState",
  default: [],
});

export const isAnimatingState = atom({
  key: "isAnimatingState",
  default: false,
});

export const loadingState = atom({
  key: "loadingState",
  default: true,
});

export const scoreState = atom({
  key: "scoreState",
  default: 0,
});

export const highScoreState = atom({
  key: "highScoreState",
  default: 0, // Default value, to be updated from backend
});

export const gameCompletedState = atom({
  key: "gameCompletedState",
  default: false,
});

export const showPopupState = atom({
  key: "showPopupState",
  default: false,
});

export const movesState = atom({
  key: "movesState",
  default: 20,
});
