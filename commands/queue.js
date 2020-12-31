module.exports = {
  name: "queue",
  aliases: ["q"],
  run: async (client, message, args) => {
    let queue = client.distube.getQueue(message);
    if (!queue) return message.channel.send(`${client.emotes.error} | 재생되고있는 음악이 없습니다`)
    let q = queue.songs.map((song, i) => {
      return `${i === 0 ? "Playing:" : `${i}.`} ${song.name} - \`${song.formattedDuration}\``
    }).join("\n");
    message.channel.send(`${client.emotes.queue} | **Server Queue**\n${q}`)
  }
}
