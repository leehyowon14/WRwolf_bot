const { Util, MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "skip",
    description: "To skip the current music",
    usage: "",
    aliases: ["s"],
  },

  run: async function (client, message, args) {
if (!message.member.hasPermission('ADMINISTRATOR')) {
  message.channel.send(`<@${message.author.id}> 명령어를 수행할 관리자 권한을 소지하고 있지않습니다.`)
  return
}
    const channel = message.member.voice.channel
    if (!channel)return sendError("I'm sorry but you need to be in a voice channel to play music!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("There is nothing playing that I could skip for you.", message.channel);
        if(!serverQueue.connection)return
if(!serverQueue.connection.dispatcher)return
     if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      .setDescription(":arrow_forward: Resumed the music for you!")
      .setColor("YELLOW")
      .setTitle("Music has been Resumed!")
       
   return message.channel.send(xd).catch(err => console.log(err));
      
    }


       try{
      serverQueue.connection.dispatcher.end()
      } catch (error) {
        serverQueue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
        return sendError(`:notes: The player has stopped and the queue has been cleared.: ${error}`, message.channel);
      }
    message.react(":white_check_mark:")
  },
};