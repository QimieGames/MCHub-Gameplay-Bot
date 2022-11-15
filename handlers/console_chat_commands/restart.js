module.exports = {
    data: {
        name: 'restart',
        description: 'Restart gameplay bot.'
    },
    execute(discordBot, gameplayBot) {
        console.log('MCHGB > Restarting gameplay bot...');
        gameplayBot.end();
        discordBot.destroy();
        return process.exit(0);
    }
};