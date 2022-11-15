module.exports = {
    data: {
        name: 'quit',
        description: 'Shut down gameplay bot.'
    },
    execute(discordBot, gameplayBot) {
        console.log('MCHGB > Shutting down gameplay bot...');
        gameplayBot.end();
        discordBot.destroy();
        return process.exit(1);
    }
};