/**
 * @param {import('..classes/Client')}
 */

client.on('ready', async () => {
  console.log('WRwolf_bot is now online');
  client.user.setPresence({ activity: { name: '명령어:w_help' }, status: 'online'})
});
  
  module.exports = onReady