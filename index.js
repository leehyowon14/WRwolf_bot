const Discord = require('discord.js');
const { Client, Util} = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;

const defaults = {
	timeout: 30,
	color: 2555834,
	triggers: {newPoll: '!투표시작', vote: '!투표', results: '!결과'},
	appName: '투표봇'
};
var pollIndex = 0, polls = new Map();

var MD = 1;

// The corresponding emojis are used as unique keys for choices within each poll object
const emoji = {
	numbers: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
		.map((value, index) => [String(index), `:${value}:`]),
	letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
		.map(value => [value, `:regional_indicator_${value}:`]),
	yn: [['yes','**Yes**'],['no','**No**']],
	maybe: ['maybe','**Maybe**']
};

class Poll {
	constructor(opt) {
		var args = opt.arguments;
		this.name = opt.name;
		this.id = pollIndex;
			pollIndex++;

		this.choices = new Map();
		opt.choices.forEach((value, index) => {
			this.choices.set(emoji[opt.emojiType][index][0], {
				name: value,
				emoji: emoji[opt.emojiType][index][1],
				votes: 0
			});
		});
		if(args.maybe || args.idk) {
			this.choices.set(emoji.maybe[0], {
				name: 'I don\'t know.',
				emoji: emoji.maybe[1],
				votes: 0
			});
		}

		this.disallowEdits = args.lock || false;
		this.blind = args.blind || false;
		this.reactionVoting = args.reactions || args.rxn || false;
		this.allowMultipleVotes = this.reactionVoting || args.mult || args.multiple || false;
		this.restrictRole = args.role || false;
		this.dontCloseEarly = args.lo || args.leaveopen || args.dontcloseearly || false;
		this.timeout = opt.timeout || 30;
		this.color = opt.color;

		this.footNote = opt.notes || ' ';
		this.footNote += `${opt.notes ? '| ' : ''}이 투표는 #${this.id}. ${this.timeout} 분 후에 만료될거야`;

		this.open = false;
		this.totalVotes = 0;

		this.voters = new Map();

		this.server = opt.server;

		this.timeCreated = new Date();
	}

	// Function to initiate timer
	startTimer() {
		this.open = true;
		setTimeout(function() {
			this.open = false;
		}.bind(this), this.timeout * 60 * 1000);
	}

	// Log votes (if the poll is open and unlocked/user hasn't voted)
	vote(key, user) {
		console.log(key, this.choices);
		if(this.open) {
			if(this.lock && this.voters.get(user.id)) {
				return {
					success: false,
					reason: 'lock',
					message: "미안 이 투표는 고정된 투표라 투표내용을 편집할 수 없고, 너는 이미 투표했어!"
				};
			} else if(!this.choices.get(key)) {
				return {
					success: false,
					reason: '유효하지 않음',
					message: "그 항목은 유효하지 않아, 그래서 나는 너의 투표를 기록할 수 없어. 선택사항에 해당하는 문자, 숫자, 또는 단어만 입력해줘!"
				};
			} else if(this.voters.get(user.id)) {
				// User has already voted, we need to change their vote
				let oldVoter = this.voters.get(user.id);
				this.choices.get(oldVoter.vote.choice).votes--;
				
				this.choices.get(key).votes++;
				this.voters.set(user.id, {
					user: user,
					vote: {
						time: new Date(),
						choice: key
					}
				});
				return {
					success: true,
					reason: '',
					message: `너의 투표 항목을 "${this.choices.get(key).name}" 으로 바꾸었어!`
				};

			} else {
				this.choices.get(key).votes++;
				// While we technically *could* use the user object as the key, that would be difficult to access. id should be unique.
				this.voters.set(user.id, {
					user: user,
					vote: {
						time: new Date(),
						choice: key
					}
				});
				return {
					success: true,
					reason: '',
					message: `나는 너의 투표 항목을 "${this.choices.get(key).name}"에 기록했어!`
				};
			}
		} else {
			return {
				sucess: false,
				reason: '시간초과',
				message: "미안, 이 투표는 시간이 초과되어 더 이상 투표할 수 없어."
			};
		}
	}

	close() {
		// Calling close() on a closed poll has no effect
		if(this.open) {
			this.open = false;
			return true;
		} else return false;
	}

	get chart() {
		// TODO generate charts of results
		return null;
	}
}

function generateDiscordEmbed(poll, type) {
	var embed = {}, choiceList = ``, resultsList = ``;
	poll.choices.forEach((choice, key) => {
		choiceList += `${choice.emoji} - ${choice.name} \n`;
		resultsList += `***${choice.votes} votes*** \n`;
	});

	switch(type) {
		case 'poll':
			embed = {
				title: `Poll ${poll.id}: ${poll.name}`,
				description: `투표하기위해서, ${poll.timeout} 분 이내에 \`!투표 choice\`라고 보내줘! ex)"!투표 ${poll.choices.keys().next().value}". 만약, 여러개의 투표가 열려있다면, 너는 투표의 태그를 이용해서 투표해야해. ex) \`!투표 #${poll.id} (선택지)\` 이 투표의 태그는 "#0" 이야.`,
				color: poll.color,
				timestamp: poll.timeCreated,
				footer: {
					text: poll.footNote
				},
				author: {
					name: defaults.appName
				},
				fields: [{
					name: `선택지:`,
					value: choiceList
				}]
			};
			break;
		case 'results':
			//TODO: Order choices in results based on number of votes

			embed = {
				title: `*결과* - ${poll.id}: ${poll.name}`,
				description: poll.open ? `이 투표는 아직 실행중이기 떄문에 언제든 결과가 바뀔 수 있어.` : `이 투표는 마감되어 투표할 수 없습니다.`,
				color: poll.color,
				timestamp: new Date(),
				footer: {
					text: `더 자세한 결과를 보려면 \`--users\` 를 명령어 뒤에 붙여줘!`
				},
				author: {
					name: defaults.appName
				},
				fields: [{
					name: `선택지:`,
					value: choiceList,
					inline: true
				}, {
					name: `결과:`,
					value: resultsList,
					inline: true
				}]
			};
			break;
		case 'detailResults':
			//TODO: Order choices in results based on number of votes

			embed = {
				title: `*결과* - ${poll.id}: ${poll.name}`,
				description: poll.open ? `이 투표는 아직 실행중이기 떄문에 언제든 결과가 바뀔 수 있어.` : `이 투표는 마감되어 투표할 수 없습니다.`,
				color: poll.color,
				timestamp: new Date(),
				footer: {
					text: `우리는 아직 구체적인 결과가 없다`
				},
				author: {
					name: defaults.appName
				},
				fields: [{
					name: `선택지:`,
					value: choiceList,
					inline: true
				}, {
					name: `결과:`,
					value: resultsList,
					inline: true
				}]
			};
	}

	return embed;
}
client.on('ready', async () => {
  console.log('WRwolf_bot is now online');
  client.user.setPresence({ game: { name: '명령어:w_help' }, status: 'online' })
});

client.on('message', message => {
	if(message.content) {
		// Array with: anything in brackets, anything in quotes, anything separated by spaces (in that hierarchy)
		var args = message.content.trim().match(/(?:[^\s"\[]+|\[[^\[]*\]|"[^"]*")+/g);
		if(args[0].toLowerCase() === defaults.triggers.newPoll) {
			args.shift();
			// Do a little format checking to make sure (first argument, title, should be in quotes, and second argument, choices, should be in brackets)
			if(
				args.length > 1 &&
				args[0].charAt(0) === '"' &&
				args[0].charAt(args[0].length - 1) === '"' &&
				args[1].charAt(0) === '[' &&
				args[1].charAt(args[1].length - 1) === ']'
			) {
				
				// Title of the poll, without quotes
				var title = args.shift().slice(1,-1);
				// Array of poll choices, trimmed
				var choices = args.shift().slice(1,-1).split(',').map(Function.prototype.call, String.prototype.trim);
				var options = {
					name: title,
					choices: choices,
					emojiType: 'letters',
					timeout: defaults.timeout,
					color: defaults.color,
					arguments: {},
					role: false,
					notes: '',
					server: message.guild
				};

				// args should now just have the arguments
				args.forEach((arg, index) => {
					// If it's a new argument (starts with '--')
					if(arg.charAt(0) === '-' && arg.charAt(1) === '-') {

						// Remove '--'
						arg = arg.slice(2);

						if(arg === 'time' || arg === 'timeout') {
							let nextEl = args[index + 1];
							// If the next element is a nunber
							if(!isNaN(nextEl) && nextEl > 0) {
								options.timeout = +nextEl;
								args.slice(index + 1, 1);
							} else {
								let errorMessage = `시간초과 인수가 발견되었으나 다음 항목은 유효한 숫자가 아니므로 시간이 ${defaults.timeout} 분으로 설정되었다`;
								console.warn(errorMessage);
								options.notes += errorMessage;
							}

						} else if(arg === 'color' || arg === 'colour') {
							let nextEl = args[index + 1];
							// If the next element is a valid RGB int code
							if(!isNaN(nextEl) && +nextEl >= 0 && +nextEl <= 256*256*256) {
								options.color = +nextEl;
								args.slice(index + 1, 1);
							} else {
								let errorMessage = `색상 인수가 발견되었지만 다음 항목은 RGB int 코드가 아니므로 이를 무시했다.`;
								console.warn(errorMessage);
								options.notes += errorMessage;
							}

						} else if(arg === 'role') {
							let nextEl = args[index + 1];
							// If the next element is surrounded by double quotes
							if(args.find(el => el == 'rxn' || el === 'reactions')) {
								let errorMessage = `'역할' 주장이 나왔지만 리액션 옵션이 가능했기 때문에 투표는 역할에 국한될 수 없다.`;
								console.warn(errorMessage);
								footNote += errorMessage;
							} else if(nextEl.charAt(0) === '"' && nextEl.charAt(nextEl.length - 1) === '"') {
								options.role = nextEl.slice(1, -1);
								args.slice(index + 1, 1);
							} else {
								let errorMessage = `"역할" 인수가 발견되었지만 다음 항목은 " "으로 둘러싸인 끈이 아니었기 때문에 이것은 무시되었다. `;
								console.warn(errorMessage);
								options.notes += errorMessage;
							}

						} else if(arg === 'numbers' || arg === 'num') {
							if(choices.length <= emoji.numbers.length) {
								options.emojiType = 'numbers';
							} else {
								let errorMessage = `여론조사는 숫자 아이콘으로 표시해 달라고 요청했지만 아이콘은 10개뿐이고 ${choices.length} 옵션만 지정돼 있어 이를 무시했다.`;
								console.warn(errorMessage);
								options.notes += errorMessage;
							}

						} else if(arg === 'yesno' || arg === 'yn') {
							if(choices.length <= emoji.yn.length) {
								options.emojiType = 'yn';
							} else {
								let errorMessage = `여론조사는 예/아니오 아이콘으로 표시하도록 요청되었지만 너무 많은 옵션(${choice.length})이 지정되었기 때문에 무시되었다.`;
								console.warn(errorMessage);
								options.notes += errorMessage;
							}

						} else {
							options.arguments[arg] = true;
						}
					}
				});

				var newPoll = new Poll(options);
				newPoll.startTimer();
				polls.set(newPoll.id, newPoll);

				let embed = generateDiscordEmbed(newPoll, 'poll');
				message.channel.send('OK, here\'s your poll:', {embed});

			} else {
				console.error("Message format was invalid.");
				message.channel.send(`투표에서는 최소한 제목과 투표할 항목들이 있어야 합니다. 예를들어, \`${defaults.triggers.newPoll} "네가 가장 좋아하는 음식은 뭐니?" [치킨, 피자, 햄버거]\`를 시도해 보십시오.`);
			}

		} else if(args[0].toLowerCase() == defaults.triggers.vote) {
			args.shift();

			var activePollsInServer = [], voteResponse;
			polls.forEach(poll => {
				if(poll.open && poll.server == message.guild) {
					activePollsInServer.push(poll.id);
				}
			});

			if(activePollsInServer.length === 0) {
				voteResponse = `이 서버에는 현재 활성 상태의 여론조사가 없기 때문에 투표를 할 수 없다.`;

			} else if(args[0].charAt(0) !== '#') {
				// Only the vote was supplied
				if(activePollsInServer.length === 1) {
					voteResponse = polls.get(activePollsInServer[0]).vote(args[0].toLowerCase(), message.author).message;
				} else {
					// TODO dynamic examples
					voteResponse = '미안, 어떤 투표에 투표해야 할지 모르겠어. 예를들어 \'!투표 #1 A\' 처럼 투표해줘! [!투표 (태그) (선택지)]';
				}

			} else {
				// The ID and vote were supplied
				let pollID = +(args[0].substr(1));

				if(activePollsInServer.includes(pollID)) {
					voteResponse = polls.get(pollID).vote(args[1].toLowerCase(), message.author).message;
				} else {
					// TODO dynamic examples
					voteResponse = '미안, 그건 투표할 수 있는 유효한 투표가 아니야';
				}
	 		}

	 		message.channel.send(voteResponse);

	 	} else if(args[0].toLowerCase() == defaults.triggers.results) {
	 		args.shift();

	 		var response;

	 		if(args[0].charAt(0) !== '#') { 
	 			message.channel.send('미안, 어떤 투표 결과를 얻어야 할지 모르겠어. 예)\'!결과 #1\`를 사용해줘[!결과 (태그)]');
	 		} else {
	 			let pollID = +(args[0].substr(1));

	 			if(polls.get(pollID)) {
	 				let embed;
	 				if(args[1] && (args[1].slice(2) === 'detailed' || args[1].slice(2) === 'users')) {
	 					embed = generateDiscordEmbed(polls.get(pollID), 'detailResults');
	 				} else {
	 					embed = generateDiscordEmbed(polls.get(pollID), 'results');
	 				}
	 				
	 				message.channel.send({embed});
	 			} else {
	 				message.channel.send('미안, 그 투표는 존재하지 않는거 같아');
	 			}
	 		}

	 	} else if(args[0].toLowerCase() == '핑') {
	 		message.channel.send('퐁!'); //for testing connection
	 	}
	}
});

client.on('message', async message => {
  if(message.author.bot) return;

  if(message.content == 'ping') {
    return message.reply('pong');
  }

  if(message.content == 'w_help') {
	let embed = new Discord.RichEmbed()
	  .setTitle('울프봇 명령어')
      .addBlankField()
	  .addField('이쉬/이쒸', '이쒸')
	  .addField('!청소 (숫자)', '메세지 삭제하기')
	  .addField('!초대코드', '초대코드 만들기')
      .addField('fuck', '엿날리기', true)
      .addField('음', '펀쿨섹좌', true)
      .addField('!fy/!료', '엿날리기', true)
	  .addField('투표', '!투표시작 "(제목)" [선택지, 선택지 ...] \n2.!투표 {태그} (선택지) \n3.!결과 (태그)\n')
	  .addField('!dm', '갠메 공지')
      .addBlankField()
      .setTimestamp()
      .setFooter('Developed by 월울프_')

    message.channel.send(embed)
  }else if(message.content == '!초대코드') {

    message.guild.channels.get(message.channel.id).createInvite({maxAge: 0}) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
      .then(invite => {
		let embed = new Discord.RichEmbed()
			.setColor('#186de6')
			.addField(`초대링크`, invite.url)
			.setTimestamp()
			.setFooter('Developed by 월울프_')
        message.channel.send(embed)
      });
  }else if(message.content == '!fy') {
    message.channel.send('fuck you bitch')
    message.channel.send(':middle_finger:')
    
  }else if(message.content == '음') {
    message.channel.send('https://cdn.discordapp.com/attachments/742044949859795019/755704078943649862/FirmLoathsomeFrillneckedlizard-size_restricted.gif')
    
  }else if(message.content == 'fuck') {
    message.channel.send('https://tenor.com/view/fuck-fuckoff-fuckity-pissedoff-gif-9736688')
    
  }else if(message.content == '이쒸') {
    message.channel.send('https://tenor.com/view/%EC%96%91%EC%95%84%EC%A7%80-mad-angry-you-wanna-fight-me-gif-17326578')
    
  }else if(message.content == '이쉬') {
    message.channel.send('https://tenor.com/view/%EC%96%91%EC%95%84%EC%A7%80-mad-angry-you-wanna-fight-me-gif-17326578')
    
  }else if(message.content == '양아지는') {
    message.channel.send('사랑이다\n```\n권희준님 요청\n```')
    
  }else if(message.content == '!료') {
    message.channel.send('fuck you bitch')
    message.channel.send(':middle_finger:')
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
      message.channel.bulkDelete(parseInt(clearLine))
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