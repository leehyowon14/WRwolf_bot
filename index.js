require("dotenv").config();//Loading .env
const Discord = require('discord.js');
const fs = require("fs");
const { Client, Util} = require('discord.js');
const { Collection } = require("discord.js");
const request = require("request")
const client = new Discord.Client();
const token = process.env.token;

const webhook = new Discord.WebhookClient(process.env.webhookid, process.env.webhooktoken)
const prefix = '-'
client.commands = new Collection();//Making client.commands as a Discord.js Collection
client.queue = new Map()

/**
 * @param {string[]} arr
 * @returns {string}
 */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const bold = (txt) => { return `**${txt}**` }
const spoiler = (txt) => { return `||${txt}||` }



client.on('ready', async () => {
  console.log('WRwolf_bot is now online');
  client.user.setPresence({ activity: { name: '명령어:w_help' }, status: 'online'})
});

client.on('message', async (msg) => {
  const { author, content, channel } = msg

  if (author.bot) return
  if (track.indexOf(content) > -1) return channel.send(track[track.indexOf(content) + 1])

  if (!content.startsWith(prefix)) return

  const slices = content.substring(prefix.length).split(' ')
  const args = slices.slice(1)
  const cmd = slices[0]

  switch (cmd) {
    case 'randUm':
    case 'randum': {
      const nick = (args[1] || '') + pick(where) + pick(doing) + (args[0] || author.username)
      await msg.member.setNickname(nick, '엄준식').catch(() => {})

      let embed = new MessageEmbed({
        title: '성공',
        description: bold(nick) + '로 변경이 완료되었습니다.',
        color: 0x42f55a
      })

      if (msg.member.nickname !== nick) {
        embed = new MessageEmbed({
          title: '실패',
          description: bold(nick) + '로 변경하지 못했습니다.\n봇의 역할 권한이 명령어를 쓰는 사람보다 높아 실패하는 경우가 많습니다.',
          color: 0xff0000
        })
      }

      msg.channel.send(embed)
      break
    }
  }
})

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
  }else if(message.content == '!covid' || message.content =='!코로나'){
    let url = "https://apiv2.corona-live.com/stats.json"
request(url, (error, response, body) => {
    let overview = JSON.parse(response.body).overview;
    overview = {
        total_confirmed_person: overview.confirmed[0], // 총 확진자수
        yesterday_confirmed_person: overview.confirmed[1], // 어제 확진자수

        current_confirmed_person: overview.current[0], // 현재 확진자수
        current_confirmed_person_diff: overview.current[1], // diff(어제 이 시간대 확진자 수 - 현재 이 시간대 확진자 수)
    }

    let current = JSON.parse(response.body).current;
    current = {
        gyeongbuk_confirmed_person: current[12].cases[0],//경북 현재 확진자 수
        gyeongbuk_confirmed_person_diff: current[12].cases[1],//경북 diff(어제 이 시간대 확진자 수 - 현재 이 시간대 확진자 수)
    }

    let overall = JSON.parse(response.body).overall;
    overall = {
        gyeongbuk_total_confirmed_person: overall[12].cases[0], // 경북 총 확진자수
        gyeongbuk_yesterday_confirmed_person: overall[12].cases[1], // 경북 어제 확진자수
    }

    let embed = new Discord.MessageEmbed()
    embed.setTitle('코로나')
    embed.setURL('https://corona-live.com')
    embed.setColor('#FF8000')
    embed.setDescription('증상이 있으실 경우 주변 접촉자에게 알리신 후 인근 보건소를 찾아주시기 바랍니다')
    embed.addField(`대한민국 총 확진자수`, `${overview.total_confirmed_person}명`, true)
    embed.addField(`어제 확진자수`, overview.yesterday_confirmed_person + `명`, true)
    embed.addField(`오늘 확진자수(집계중)`, overview.current_confirmed_person + `명`, true)
    embed.addField(`오늘 어제지금시간   -   현재지금시간의 확진자`, overview.current_confirmed_person_diff + `명`, true)
    embed.addField(`--------------------------------------------------------------------------------------------------`, 'ㅤ')
    let embed4 = new Discord.MessageEmbed()
    embed4.setColor('#FF8000')
    embed4.addField(`경북` ,'ㅤ')
    embed4.addField(`경북 총 확진자수`,  overall.gyeongbuk_total_confirmed_person + `명`, true)
    embed4.addField(`경북 어제 확진자수`, overall.gyeongbuk_yesterday_confirmed_person + `명`, true)
    embed4.addField(`경북 현재 확진자 수(집계중)`, current.gyeongbuk_confirmed_person + `명`, true)
    embed4.addField(`경북 어제  지금시간   -   현재지금시간의 확진자`, current.gyeongbuk_confirmed_person_diff + `명`,true)
    embed4.addField(`--------------------------------------------------------------------------------------------------`, 'ㅤ')
    message.channel.send(embed)
    message.channel.send(embed4)
  })

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

  webhook.send(embed)
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

webhook.send(embed)

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