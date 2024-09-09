const fetch = require('node-fetch');
const { Telegraf } = require('telegraf');
const cron = require('node-cron');

// Füge hier deinen Telegram Bot Token ein
const bot = new Telegraf('DEIN_TELEGRAM_BOT_TOKEN');

// Funktion, um das aktuelle Datum und die Zeit zu berechnen
function getCurrentImageUrl() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Monat beginnt bei 0
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = Math.floor(now.getUTCMinutes() / 10) * 10; // Auf volle 10 Minuten abrunden
  const minutesPadded = String(minutes).padStart(2, '0');

  // URL für das aktuelle Webcam-Bild
  return `https://www.foto-webcam.org/webcam/wallberg/${year}/${month}/${day}/${hours}${minutesPadded}_hu.jpg`;
}

// Funktion, um das Bild in den Telegram-Kanal zu senden
async function sendWebcamImage(ctx) {
  const imageUrl = getCurrentImageUrl();
  try {
    // Überprüfen, ob die URL existiert
    const response = await fetch(imageUrl);
    if (response.ok) {
      // Bild an den Kanal senden
      await ctx.replyWithPhoto({ url: imageUrl });
      console.log('Bild gesendet:', imageUrl);
    } else {
      console.log('Bild nicht gefunden:', imageUrl);
    }
  } catch (error) {
    console.error('Fehler beim Senden des Bildes:', error);
  }
}

// Regelmäßig alle 10 Minuten ausführen
cron.schedule('1,11,21,31,41,51 * * * *', () => {
  sendWebcamImage(bot.telegram);
});

// Start des Bots
bot.launch();
console.log('Bot läuft und wartet auf Befehle...');
