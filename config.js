// ============================================================
// SYSTEM ZERO — CONFIG.JS
// Only edit values in this file. Do not touch game.js or style.css.
// ============================================================

const CONFIG = {
  // Team name shown on the victory screen
  TEAM_NAME: "Team Alpha",

  // Password to unlock Level 1
  LEVEL1_PASSWORD: "FIREWALL",

  // Password to unlock Level 2 (hidden in room after Level 1)
  LEVEL2_PASSWORD: "SENSOR",

  // Password to unlock Level 3 (hidden in room after Level 2)
  LEVEL3_PASSWORD: "NEXUS",

  // Hint shown after Level 1 — where is the Level 2 code hidden in the room?
  HINT_AFTER_LEVEL1: "The next code is hidden where temperature is watched. Something in this room measures the cold.",

  // Hint shown after Level 2 — where is the Level 3 code hidden in the room?
  HINT_AFTER_LEVEL2: "The last code was left by something that thinks but cannot feel. Find the thing in this room that was never truly alive.",

  // Set to null to derive master code from gameplay.
  // Set to a string like "PHISHING-5-BLIND TRUST" to force a specific code.
  MASTER_CODE_OVERRIDE: null,

  // Time limits in seconds
  LEVEL1_TIME_LIMIT: 120,
  LEVEL2_TIME_LIMIT: 180,
  LEVEL3_TIME_LIMIT: 300,

  // Wrong attempts before a hint appears
  HINT_TRIGGER_AFTER_WRONG_ATTEMPTS: 2,

  // Primary accent colour — change to match event branding
  ACCENT_COLOR: "#00ff88",

  // Set to false to disable all sounds
  SOUND_ENABLED: true,

  // Password for Game Master menu and session restore
  GM_PASSWORD: "iloveu",

  // Time limits for mini-games (seconds)
  RANSOMWARE_TIME_LIMIT: 90,
  ROGUE_HUNT_TIME_LIMIT: 180,
  SYNTHETIC_MEDIA_TIME_LIMIT: 300,
};

