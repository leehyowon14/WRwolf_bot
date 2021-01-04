module.exports = {
    name: 'reactionrole',
    description: "Sets up a reaction role message!",
    async execute(message, args, Discord, client) { 
        const channel = '795479877595430964';
        const Gtech = message.guild.roles.cache.find(role => role.name === "G테크");
        const jungci = message.guild.roles.cache.find(role => role.name === "정치")

        const gemoji = '🎉';
        const jemoji = '📩';

        let embed = new Discord.MessageEmbed()
            .setColor('#186de6')
            .setTitle('이모지를 눌러 역할을 받으세요!')
            .setDescription('받고싶은 역할에 해당하는 이모지를 눌러 역할을 받으세요\n\n'
            + `${gemoji} 를 눌러 G-테크(구:호떡iT)의 새로운 소식을 받아보세요!\n`
            + `${jemoji} 를 눌러 정치채팅방에 엑세스하세요!`);
        let messageEmbed = await message.channel.send(embed);
        messageEmbed.react(gemoji);
        messageEmbed.react(jemoji);

        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == channel) {
                if (reaction.emoji.name === gemoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(Gtech);
                }
                if (reaction.emoji.name === jemoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(jungci);
                }
            } else {
                return;
            }

        });

        client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == channel) {
                if (reaction.emoji.name === gemoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(Gtech);
                }
                if (reaction.emoji.name === jemoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(jungci);
                }
            } else {
                return;
            }

        });

    }
}