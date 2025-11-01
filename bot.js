const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const app = express();
const PORT = process.env.PORT || 3000;

// --- Express server to satisfy Koyeb ---
app.get('/', (req, res) => res.send('Tarot Bot is running!'));
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// --- Bot token ---
const TOKEN = process.env.DISCORD_TOKEN; // Set this as a secret in Koyeb

// --- Major Arcana emojis ---
const majorArcanaEmojis = {
    'The Fool': '🤡',
    'The Magician': '🧙‍♂️',
    'The High Priestess': '👩‍🎤',
    'The Empress': '👸',
    'The Emperor': '🤴',
    'The Hierophant': '⛪',
    'The Lovers': '💑',
    'The Chariot': '🏎️',
    'Strength': '🦁',
    'The Hermit': '🕯️',
    'Wheel of Fortune': '🎡',
    'Justice': '⚖️',
    'The Hanged Man': '🙃',
    'Death': '💀',
    'Temperance': '🥂',
    'The Devil': '😈',
    'The Tower': '🏰',
    'The Star': '⭐',
    'The Moon': '🌙',
    'The Sun': '☀️',
    'Judgement': '📯',
    'The World': '🌍'
};

// --- Minor Arcana emojis ---
const minorArcanaEmojis = {
    'Wands': '🔥',
    'Cups': '💧',
    'Swords': '⚔️',
    'Pentacles': '💰'
};

// --- Minor Arcana cards ---
const minorCardNames = [
    'Ace', 'Two', 'Three', 'Four', 'Five',
    'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Page', 'Knight', 'Queen', 'King'
];

// --- Ready event ---
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// --- Message handler ---
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === '!tarot') {
        // Randomly decide Major or Minor Arcana
        const isMajor = Math.random() < 0.5;

        let reply;
        if (isMajor) {
            const cardNames = Object.keys(majorArcanaEmojis);
            const card = cardNames[Math.floor(Math.random() * cardNames.length)];
            const emoji = majorArcanaEmojis[card];
            reply = `Your Major Arcana card is: ${emoji} ${card}`;
        } else {
            const suitNames = Object.keys(minorArcanaEmojis);
            const suit = suitNames[Math.floor(Math.random() * suitNames.length)];
            const card = minorCardNames[Math.floor(Math.random() * minorCardNames.length)];
            const emoji = minorArcanaEmojis[suit];
            reply = `Your Minor Arcana card is: ${emoji} ${card} of ${suit}`;
        }

        message.reply(reply);
    }
});

// --- Login ---
client.login(TOKEN);
