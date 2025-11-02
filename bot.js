// bot.js — Discord tarot bot for Koyeb
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');

// --- Load local tarot meanings ---
const tarotData = JSON.parse(fs.readFileSync('./tarot_meanings.json', 'utf8'));

const TOKEN = process.env.TOKEN;
const PREFIX = '!';

// --- Tarot emojis ---
const MAJOR_EMOJIS = {
  "the fool": "🤡✨", "the magician": "🪄🔮", "the high priestess": "🌙🕯️", "the empress": "🌸👑",
  "the emperor": "🛡️👑", "the hierophant": "📜⛪", "the lovers": "💖💏", "the chariot": "🏎️🛡️",
  "strength": "🦁💪", "the hermit": "🧙‍♂️🕯️", "wheel of fortune": "🎡🔄", "justice": "⚖️🗡️",
  "the hanged man": "🙃🔄", "death": "💀🔄", "temperance": "⚗️🌊", "the devil": "😈⛓️",
  "the tower": "🏰⚡", "the star": "⭐🌊", "the moon": "🌙🦊", "the sun": "☀️🌻",
  "judgement": "📯🔔", "the world": "🌎🏆"
};
const SUIT_EMOJIS = { swords: "🗡️", cups: "🍷", pentacles: "🪙", wands: "🪄" };

function getCardEmoji(name) {
  const n = name.toLowerCase();
  if (MAJOR_EMOJIS[n]) return MAJOR_EMOJIS[n];
  for (const [suit, emoji] of Object.entries(SUIT_EMOJIS))
    if (n.toLowerCase().includes(suit)) return emoji;
  return "🔮";
}

// --- Discord setup ---
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once("clientReady", () => console.log(`💫 Logged in as ${client.user.tag}`));

// --- Helper: Draw random cards from local data ---
function drawCards(n = 3) {
  const allCards = Object.keys(tarotData);
  const drawn = [];
  while (drawn.length < n) {
    const randomName = allCards[Math.floor(Math.random() * allCards.length)];
    const reversed = Math.random() < 0.5;
    drawn.push({
      name: randomName,
      reversed,
      ...tarotData[randomName]
    });
  }
  return drawn;
}

// --- Command handler ---
client.on("messageCreate", async (msg) => {
  if (msg.author.bot || !msg.content.startsWith(PREFIX)) return;

  const cmd = msg.content.slice(PREFIX.length).trim().toLowerCase();
  const match = cmd.match(/^([1-5])card$/);
  if (!match) return;
  const n = parseInt(match[1]);

  try {
    await msg.channel.sendTyping();
    const cards = drawCards(n);

    const embeds = cards.map((c) => {
      const isReversed = c.reversed;
      const orientationText = isReversed ? "🔄 Reversed" : "✨ Upright";

      const uprightMeaning = c.upright || tarotData[c.name]?.upright || "Not found";
      const reversedMeaning = c.reversed || tarotData[c.name]?.reversed || "Not found";
      const generalReading = c["General Reading"] || tarotData[c.name]?.["General Reading"] || "Not found";

      return new EmbedBuilder()
        .setTitle(`${getCardEmoji(c.name)} ${c.name} — ${orientationText}`)
        .setDescription(
          `**Upright Meaning:** ${uprightMeaning}\n**Reversed Meaning:** ${reversedMeaning}`
        )
        .addFields({
          name: "General Reading",
          value: generalReading.length > 1024 ? generalReading.slice(0, 1020) + "…" : generalReading,
        })
        .setFooter({ text: "🔮 Tarot Reading" });
    });

    await msg.channel.send({
      content: `✨ Your ${n}-card reading, ${msg.member.displayName}! ✨`,
      embeds,
    });

  } catch (err) {
    console.error(err);
    msg.reply("Oops! Couldn’t draw your cards. Try again later 💜");
  }
});

client.login(TOKEN);

// --- Express keep-alive server ---
const app = express();
const PORT = process.env.PORT || 8080;
let serverStarted = false;

if (!serverStarted) {
  app.get("/", (_, res) => res.send("🌙 TarotBot is awake and magical! 🔮✨"));
  app.listen(PORT, () => {
    serverStarted = true;
    console.log(`🕯️ Keep-alive server on port ${PORT}`);
  });
}

// --- Keep-alive self-ping system (for Koyeb) ---
const fetchKeepAlive = async () => {
  try {
    const url = `https://${process.env.KOYEB_APP_NAME || 'your-app-name'}.koyeb.app/`;
    await fetch(url);
    console.log("🔁 Self-ping sent to keep bot awake");
  } catch (err) {
    console.error("⚠️ Keep-alive ping failed:", err.message);
  }
};
setInterval(fetchKeepAlive, 5 * 60 * 1000);
