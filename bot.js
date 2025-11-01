// bot.js — Discord tarot bot hosted on Render
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const TOKEN = process.env.TOKEN; // we’ll set this in Render later
const PREFIX = '!';

const MAJOR_EMOJIS = {
  "the fool":"🤡✨","the magician":"🪄🔮","the high priestess":"🌙🕯️","the empress":"🌸👑",
  "the emperor":"🛡️👑","the hierophant":"📜⛪","the lovers":"💖💏","the chariot":"🏎️🛡️",
  "strength":"🦁💪","the hermit":"🧙‍♂️🕯️","wheel of fortune":"🎡🔄","justice":"⚖️🗡️",
  "the hanged man":"🙃🔄","death":"💀🔄","temperance":"⚗️🌊","the devil":"😈⛓️",
  "the tower":"🏰⚡","the star":"⭐🌊","the moon":"🌙🦊","the sun":"☀️🌻",
  "judgement":"📯🔔","the world":"🌎🏆"
};
const SUIT_EMOJIS = { "swords":"🗡️","cups":"🍷","pentacles":"🪙","wands":"🪄" };

function getCardEmoji(name) {
  const n = name.toLowerCase();
  if (MAJOR_EMOJIS[n]) return MAJOR_EMOJIS[n];
  if (n.includes("swords")) return SUIT_EMOJIS.swords;
  if (n.includes("cups")) return SUIT_EMOJIS.cups;
  if (n.includes("pentacles")) return SUIT_EMOJIS.pentacles;
  if (n.includes("wands")) return SUIT_EMOJIS.wands;
  return "🔮";
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once("ready", () => console.log(`💫 Logged in as ${client.user.tag}`));

async function fetchCards(n = 3) {
  const url = `https://tarotapi.dev/api/v1/cards/random?n=${n}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.cards || [];
}

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const cmd = message.content.slice(PREFIX.length).trim().toLowerCase();
  const match = cmd.match(/^([1-5])card$/);
  if (!match) return;
  const n = parseInt(match[1]);

  try {
    await message.channel.sendTyping();
    const cards = await fetchCards(n);

    const embeds = cards.map((card) => {
      const reversed = card.reversed ? " 🔄 Reversed" : "";
      const title = `${getCardEmoji(card.name)} ${card.name}${reversed}`;
      const meaning = card.reversed ? card.meaning_rev : card.meaning_up;
      return new EmbedBuilder()
        .setTitle(title)
        .setDescription(meaning)
        .setColor(0x8a2be2)
        .setFooter({ text: "🔮 Tarot Reading" });
    });

    await message.channel.send({
      content: `✨ Your ${n}-card reading, ${message.member.displayName}! ✨`,
      embeds,
    });
  } catch (err) {
    console.error("Error:", err);
    message.reply("Oops! Couldn’t fetch cards. Try again soon 💜");
  }
});

client.login(TOKEN);

// Tiny web server to keep bot awake on Koyeb
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🌙 TarotBot is awake and magical! 🔮✨");
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

