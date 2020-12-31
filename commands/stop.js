module.exports = {
  name: "stop",
  aliases: ["disconnect", "leave"],
  run: async (client, message, args) => {
    if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} | 당신이 음성채널에 들어와 있어야 합니다`)
    if (!client.distube.isPlaying(message)) return message.channel.send(`${client.emotes.error} | 재생되고있는 음악이 없습니다`)
    client.distube.stop(message);
    message.channel.send(`${client.emotes.success} | 멈춤!`)
  }
}
