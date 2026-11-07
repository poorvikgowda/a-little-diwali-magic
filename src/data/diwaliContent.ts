import { Wish } from '../types';

export const DEFAULT_FRIEND_NAME = "Special Friend";

export const DIWALI_WISHES: Wish[] = [
  {
    id: 1,
    text: "May your life always be filled with happiness and peace.",
    theme: "from-amber-400 to-orange-500",
    highlight: "happiness and peace"
  },
  {
    id: 2,
    text: "Wishing you success in everything you work hard for.",
    theme: "from-yellow-300 to-amber-500",
    highlight: "success in everything"
  },
  {
    id: 3,
    text: "May all your dreams turn into beautiful realities.",
    theme: "from-pink-400 to-rose-500",
    highlight: "beautiful realities"
  },
  {
    id: 4,
    text: "I genuinely hope to see you achieve great things in life.",
    theme: "from-amber-300 to-red-400",
    highlight: "achieve great things"
  },
  {
    id: 5,
    text: "May you always find strength in challenges and reasons to smile.",
    theme: "from-purple-400 to-indigo-400",
    highlight: "strength in challenges"
  },
  {
    id: 6,
    text: "Wishing you endless happiness, good health, and a bright future.",
    theme: "from-orange-400 to-amber-500",
    highlight: "bright future"
  }
];

export const CLOSING_WISH = "Always wishing the very best for you. ❤️🪔";

export const RANDOM_WISH_BLESSINGS = [
  "✨ May every wish whispered to the stars come true for you!",
  "🪔 May warmth and golden moments follow you wherever you go.",
  "🌟 May good fortune, peace, and vibrant smiles light up your path.",
  "🎆 Here's to adventures, deep laughter, and endless cheerful memories!",
  "💫 May the spark in your soul shine through every challenge with grace.",
  "✨ May this festive season bless your heart with abundant serenity.",
  "🏮 May pure happiness and good health surround you and your loved ones!"
];

export const SECRET_LETTER = {
  teaser: "Some wishes are too special to be just written... 💗",
  button: "Open Your Secret Message 💌",
  paragraphs: [
    "Hey, you! ❤️",
    "I just wanted to send you something a little different this Diwali.",
    "I hope your life is always filled with beautiful moments, unexpected happiness, genuine smiles, and dreams that come true.",
    "Even on difficult days, I hope you find a reason to smile.",
    "You deserve kindness, happiness, success, and all the beautiful things this world has to offer.",
    "Never lose that special spark that makes you YOU.",
    "Sending lots of positive vibes and warm wishes your way.",
    "Happy Diwali! 🪔✨"
  ],
  closing: "Made with a little bit of magic and lots of good wishes. ❤️"
};

export const FINAL_SURPRISE_LINES = [
  { text: "Among all the lights that shine tonight,", delayAfter: 2000 },
  { text: "I hope you never forget that you deserve to shine the brightest.", delayAfter: 3000 },
  { text: "Keep smiling,", delayAfter: 1500 },
  { text: "Keep shining,", delayAfter: 1500 },
  { text: "And keep being you.", delayAfter: 3000 },
  { text: "Happy Diwali! 🪔✨", delayAfter: 0, isGrand: true }
];
