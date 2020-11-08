const Discord = require('discord.js');
const { Client, Util} = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;


client.on('ready', async () => {
  console.log('WRwolf_bot is now online');
  client.user.setPresence({ game: { name: '명령어:w_help' }, status: 'online' })
});



client.on('message', async message => {
  if(message.author.bot) return;

  if(message.content == 'ping') {
    return message.reply('pong');
  }

  if(message.content == 'w_help') {
	let embed = new Discord.RichEmbed()
	  .setColor('#73c4fa')
	  .setTitle('울프봇 명령어')
      .addBlankField()
	  .addField('이쉬/이쒸', '이쒸')
	  .addField('!청소 (숫자)', '메세지 삭제하기')
	  .addField('!초대코드/!초대링크', '초대링크 만들기')
      .addField('음', '펀쿨섹좌', true)
      .addField('!fy/!료 + [멘션]', '엿날리기', true)
	  .addField('투표', '!투표.[주제].[항목1/항목2/항목3].시간(1초 이상)')
	  .addField('!dm', '갠메 공지')
      .addBlankField()
      .setTimestamp()
      .setFooter('Developed by 월울프_')

    message.channel.send(embed)
  }else if(message.content == '!초대코드' || '초대링크') {

    message.guild.channels.get(message.channel.id).createInvite({maxAge: 0}) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
      .then(invite => {
		let embed = new Discord.RichEmbed()
			.setColor('#186de6')
			.addField(`초대링크`, invite.url)
			.setTimestamp()
			.setFooter('Developed by 월울프_')
        message.channel.send(embed)
      });
  }else if(message.content == '!fy' || '!료') {
	if (!message.mentions.users.size) {
		return message.channel.send(`올바른 사용법: !fy [멘션]`);
	}
	const targgeduser = message.mentions.first();
    message.channel.send(`fuck you bitch <@${targgeduser.username}>`)
    message.channel.send(':middle_finger:')
    
  }else if(message.content == '음') {
    message.channel.send('https://cdn.discordapp.com/attachments/742044949859795019/755704078943649862/FirmLoathsomeFrillneckedlizard-size_restricted.gif')
    
  }else if(message.content == '이쒸' || '이쉬') {
    message.channel.send('https://tenor.com/view/%EC%96%91%EC%95%84%EC%A7%80-mad-angry-you-wanna-fight-me-gif-17326578')
    
  }else if(message.content == '양아지는') {
    message.channel.send('사랑이다\n```\n권희준님 요청\n```')
    
  }
  
  if(message.content.startsWith("!투표")) {
	let args = message.content.split(".") // ["!투표", "주제", "항목1/항목2/항목3", "시간(초)"]
	let list = args[2].split("/") // ["항목1", "항목2", "항목3"]
	let emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]
	let tempString = ""
	let temp = 0
	if(!args) message.reply("`!투표.[주제].[항목1/항목2/항목3].시간(1초 이상)` 이 올바른 명령어 입니다.")
	if(!args[3] || args[3] < 1) message.reply("`!투표.[항목1/항목2/항목3].시간(1초 이상)` 이 올바른 명령어 입니다.")
	if(list > 5) message.reply("항목은 최대 5개까지 가능합니다.")
	let embed = new Discord.RichEmbed()
	embed.setTitle(`${message.member.displayName}님의 투표`)
		for(let i=0; i<list.length; i++) {
			temp += 1
			tempString += `**${temp}. ${list[i]}**\n`
		}
	embed.setDescription(tempString)
	embed.addField("주제", args[1])
	embed.addField(`투표시간`, `${args[2]}초`)
	embed.setFooter(`developed by 월울프_`)
	console.log('전송')
	message.channel.send({ embed: embed }).then(msg => {
		for(let i=0; i<list.length; i++) {
			msg.react(emojis[i])
		}
		setTimeout(function() {
			msg.edit(`<@!${message.author.id}> 투표가 종료되었습니다.`, { embed: embed })
			console.log('종료')
		}, parseInt(args[2])*1000)
	})
}

  if(message.content.startsWith('!dm')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
		let contents = message.content.slice('!dm'.length);
	  	let embed = new Discord.RichEmbed()
			.setTitle('전체공지')
			.setDescription(`from <@${message.author.id}>`)
			.setColor('#186de6')
        	.setTimestamp()
			.setFooter('Developed by 월울프_')
		embed.addField(`공지`, contents)

	  message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(embed);
      });
  
      return message.reply('공지를 전송했습니다.');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  }

  if(message.content.startsWith('!청소')) {
    if(checkPermission(message)) return

    var clearLine = message.content.slice('!청소 '.length);
    var isNum = !isNaN(clearLine)

    if(isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return;
    } else if(!isNum) { 
      if(message.content.split('<@').length == 2) {
        if(isNaN(message.content.split(' ')[2])) return;

        var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
        var count = parseInt(message.content.split(' ')[2])+1;
        const _limit = 10;
        let _cnt = 0;

        message.channel.fetchMessages({limit: _limit}).then(collected => {
          collected.every(msg => {
            if(msg.author.id == user) {
              msg.delete();
              ++_cnt;
            }
            return !(_cnt == count);
          });
        });
      }
    } else {
      message.channel.bulkDelete(parseInt(clearLine) + 1)
        .then(() => {
          AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
        })
        .catch(console.error)
	}

 }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } else {
    return false;
  }
}


client.login(token);