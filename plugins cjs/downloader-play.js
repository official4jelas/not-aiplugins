const yts = require('yt-search');
const axios = require('axios');

var handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) throw `Gunakan contoh: ${usedPrefix}${command} Orange 9`;

  // Pesan loading yang lebih sederhana
  await m.reply('Sedang mencari... ⏳');

  try {
    let search = await yts(text);
    let vid = search.videos[0];
    if (!vid) throw 'Video tidak ditemukan, coba judul lain.';

    let { url, title, thumbnail } = vid;

    // Pastikan URL diisi dengan benar
    const response = await axios.get(`https://api.nexoracle.com/downloader/yt-audio?apikey=free_key@maher_apis&url=${encodeURIComponent(url)}`);
    let res = response.data.result;
    let { audio } = res;

    // Pastikan 'audio' ada sebelum dipake
    if (!audio) throw 'Audio tidak ditemukan, coba lagi nanti.';

    let audioMessage = {
      audio: {
        url: audio, // Ganti 'mp3' dengan 'audio'
      },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 2,
          mediaUrl: url,
          title: title,
          body: '©Botzz - MD',
          sourceUrl: url,
          thumbnailUrl: thumbnail,
          renderLargerThumbnail: true
        }
      }
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });
  } catch (err) {
    console.error(err); // Log error untuk debugging
    await m.reply('Terjadi kesalahan, silahkan coba lagi nanti. 🤖');
  }
};

handler.help = ['play'].map((v) => v + ' <query>');
handler.tags = ['downloader', 'sound'];
handler.command = /^(play|song|lagu|carikanlagu|cari kan lagu|songs|musik|music)$/i;

module.exports = handler;
