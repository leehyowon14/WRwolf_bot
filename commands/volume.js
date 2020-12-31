module.exports = {
  name: "volume",
  aliases: ["v", "set", "set-volume"],
  run: async (client, message, args) => {
    if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} | 당신이 음성채널에 들어와 있어야 합니다`)
    if (!client.distube.isPlaying(message)) return message.channel.send(`${client.emotes.error} | 재생되고있는 음악이 없습니다`)
    let volume = parseInt(args[0]);
    if (isNaN(volume)) return message.channel.send(`${client.emotes.error} | 올바른 숫자를 입력하십시오(1~100)`)
    client.distube.setVolume(message, volume);
    message.channel.send(`${client.emotes.success} | 현재 불륨: \`${volume}\``)
  }
}
