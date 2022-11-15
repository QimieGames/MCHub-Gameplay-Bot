module.exports = {
    data: {
        name: 'help',
        description: 'Shows This Menu.'
    },
    execute(discordBot, gameplayBot, consoleChatCommandHandlers) {

        let consoleHelpMenu = '';

        consoleChatCommandHandlers.forEach((consoleChatCommandHandler) => {
            
            consoleHelpMenu = consoleHelpMenu + `${consoleChatCommandHandler.data.name} -> ${consoleChatCommandHandler.data.description}\n`;

        });
        console.log('================================\n' + consoleHelpMenu + '================================');
    }
};