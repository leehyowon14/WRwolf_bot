require("dotenv").config();//Loading .env
const Discord = require('discord.js');
const fs = require("fs");
const { Client, Util} = require('discord.js');
const { Collection } = require("discord.js");
const client = new Discord.Client();
const token = process.env.token;
client.commands = new Collection();//Making client.commands as a Discord.js Collection
client.queue = new Map()

client.config = {
  prefix: process.env.PREFIX
}

client.on('ready', async () => {
  console.log('WRwolf_bot is now online');
  client.user.setPresence({ activity: { name: '명령어:w_help' }, status: 'online'})
});


client.on("message", (message) => {
  if (message.author.bot) return

  if (message.content == "ping") {
    return message.reply("pong")
  }
  if(message.content == 'w_help') {
	let embed = new Discord.MessageEmbed()
	  .setColor('#73c4fa')
	  .setTitle('울프봇 명령어')
    .addField('\u200B', '\u200B')
    .addField('이쉬/이쒸', '이쒸')
    .addField('ㅂㄷㅂㄷ/qeqe', 'ㅂㄷㅂㄷ')
	  .addField('!청소 (숫자)', '메세지 삭제하기')
	  .addField('!초대코드/!초대링크', '초대링크 만들기')
    .addField('fuck', '엿날리기', true)
    .addField('음', '펀쿨섹좌', true)
    .addField('!fy/!료', '엿날리기', true)
	  .addField('투표', '패치중...')
	  .addField('!dm', '갠메 공지')
    .addField('\u200B', '\u200B')
    .setTimestamp()
    .setFooter('Developed by 월울프_')

    message.channel.send(embed)
  }else if(message.content == '!초대코드' || message.content == '!초대링크') {

    message.guild.channels.cache
    .get(message.channel.id)
    .createInvite({ maxAge: 0 })
      .then(invite => {
		let embed = new Discord.MessageEmbed()
			.setColor('#186de6')
			.addField(`초대링크`, invite.url)
			.setTimestamp()
			.setFooter('Developed by 월울프_')
    message.channel.send(embed)
      });
  }else if(message.content == '!fy' || message.content == '!료') {
    message.channel.send(`fuck you bitch`)
    message.channel.send(':middle_finger:')
    
  }else if(message.content == '음') {
    message.channel.send('https://cdn.discordapp.com/attachments/742044949859795019/755704078943649862/FirmLoathsomeFrillneckedlizard-size_restricted.gif')
    
  }else if(message.content == 'fuck') {
    message.channel.send('https://tenor.com/view/fuck-fuckoff-fuckity-pissedoff-gif-9736688')
    
  }else if(message.content == '이쒸' || message.content == '이쉬') {
    message.channel.send('https://tenor.com/view/%EC%96%91%EC%95%84%EC%A7%80-mad-angry-you-wanna-fight-me-gif-17326578')
    
  }else if(message.content == '양아지는') {
    message.channel.send('사랑이다\n```\n권희준님 요청\n```')
    
  }else if(message.content == 'ㅂㄷㅂㄷ' || message.content == 'qeqe') {
    message.channel.send('https://tenor.com/view/%EC%96%91%EC%95%84%EC%A7%80-fist-angry-mad-gif-17326572')
  }


  if(message.content.startsWith('!dm')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
		let contents = message.content.slice('!dm'.length);
	  	let embed = new Discord.MessageEmbed()
			.setTitle('전체공지')
			.setDescription(`from <@${message.author.id}>`)
			.setColor('#186de6')
      .setTimestamp()
			.setFooter('Developed by 월울프_')
		embed.addField(`공지`, contents)

    message.member.guild.members.cache.array().forEach((x) => {
        if(x.user.bot) return;
        x.user.send(embed)
      })
  
      return message.reply('공지를 전송했습니다.');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  } else if (message.content.startsWith("!청소")) {
    if (message.channel.type == "dm") {
      return message.reply("dm에서 사용할 수 없는 명령어 입니다.")
    }

    if (message.channel.type != "dm" && checkPermission(message)) return

    var clearLine = message.content.slice("!청소 ".length)
    var isNum = !isNaN(clearLine)

    if (isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return
    } else if (!isNum) {
      // c @나긋해 3
      if (message.content.split("<@").length == 2) {
        if (isNaN(message.content.split(" ")[2])) return

        var user = message.content.split(" ")[1].split("<@!")[1].split(">")[0]
        var count = parseInt(message.content.split(" ")[2]) + 1
        let _cnt = 0

        message.channel.messages.fetch().then((collected) => {
          collected.every((msg) => {
            if (msg.author.id == user) {
              msg.delete()
              ++_cnt
            }
            return !(_cnt == count)
          })
        })
      }
    } else {
      message.channel
        .bulkDelete(parseInt(clearLine) + 1)
        .then(() => {
          message.channel.send(`<@${message.author.id}> ${parseInt(clearLine)} 개의 메시지를 삭제했습니다. (이 메시지는 잠시 후 사라집니다.)`).then((msg) => msg.delete({ timeout: 3000 }))
        })
        .catch(console.error)
    }
  }
})

function checkPermission(message) {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> 명령어를 수행할 관리자 권한을 소지하고 있지않습니다.`)
    return true
  } else {
    return false
  }
}

client.on('messageUpdate', async(oldMessage, newMessage) => {
  if(oldMessage.content === newMessage.content) return // 임베드로 인한 수정같은 경우 
  let img = oldMessage.author.avatar ? `https://cdn.discordapp.com/avatars/${oldMessage.author.id}/${oldMessage.author.avatar}.webp?size=256` : undefined;
  let embed = new Discord.MessageEmbed()
  .setTitle('Chatting Log')
  .setColor('#FFFF')
  .addField('Log-Type', 'Edited Message')
  .addField('Message By:', oldMessage.author.tag)
  .addField('Channel:', oldMessage.channel.name)
  .addField('Old Message:', oldMessage.content)
  .addField('New Message:', newMessage.content)
  .setFooter(oldMessage.author.tag, img)
  .setTimestamp()

  oldMessage.channel.send(embed)
}) // 메세지 수정로그

client.on('messageDelete', async message => {
let img = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=256` : undefined;
let embed = new Discord.MessageEmbed()
.setTitle('')
.setColor('#FFFF')
.addField('Log-Type', 'Deleted Message')
.addField('Message By:', message.author.tag)
.addField('Channel:', message.channel.name)
.addField('Message:', message.content)
.setFooter(message.author.tag, img)
.setTimestamp()

message.channel.send(embed)

})

fs.readdir(__dirname + "/events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(__dirname + `/events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    console.log("Loading Event: "+eventName)
  });
});

//Loading Commands
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
    console.log("Loading Command: "+commandName)
  });
});

client.login(token);