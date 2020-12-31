module.exports = {
  name: "repeat",
  aliases: ["loop", "rp"],
  run: async (client, message, args) => {
    if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} | 당신이 음성채널에 들어와 있어야 합니다!`)
    if (!client.distube.isPlaying(message)) return message.channel.send(`${client.emotes.error} | 당신이 음성채널에 들어와 있어야 합니다`)
    let mode = null;
    switch (args[0]) {
      case "off":
        mode = 0
        break
      case "song":
        mode = 1
        break
      case "queue":
        mode = 2
        break
    }
    mode = client.distube.setRepeatMode(message, mode);
    mode = mode ? mode == 2 ? "Repeat queue" : "Repeat song" : "Off";
    message.channel.send(`${client.emotes.repeat} | 반복재생: \`${mode}\``);
  }
}
