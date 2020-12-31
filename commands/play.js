module.exports = {
    name: "play",
    aliases: ["p"],
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} | 당신이 음성채널에 들어와 있어야 합니다`)
        let string = args.join(" ")
        if (!string) return message.channel.send(`${client.emotes.error} | Please enter a song url or query to search.`)
        try {
            client.distube.play(message, string)
        } catch (e) {
            message.channel.send(`${client.emotes.error} | 에러: \`${e}\``)
        }
    }
}
