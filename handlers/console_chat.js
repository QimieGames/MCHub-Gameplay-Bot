module.exports = {
    data: {
        name: 'console_chat'
    },
    execute(consoleChatInput, consoleChatCommandHandlers, discordBot, gameplayBot) {
        try {
            if (consoleChatInput !== '') {

                const emptyConsoleChatInputRegex = new RegExp(/^[ ]+$/, 'm');

                if (emptyConsoleChatInputRegex.test(consoleChatInput) !== true) {

                    const internalConsoleChatCommandRegex = new RegExp(/^\\([A-Za-z]+)$/);

                    if (internalConsoleChatCommandRegex.test(consoleChatInput) === true) {

                        const internalConsoleChatCommandDetails = String(consoleChatInput).match(internalConsoleChatCommandRegex);

                        const internalConsoleChatCommand = internalConsoleChatCommandDetails[1];

                        const consoleChatCommands = ['help', 'quit', 'restart'];

                        let consoleChatCommandHandler;

                        switch (consoleChatCommands.includes(internalConsoleChatCommand)) {
                            case false:

                                consoleChatCommandHandler = consoleChatCommandHandlers.get('help');

                                consoleChatCommandHandler.execute(discordBot, gameplayBot, consoleChatCommandHandlers);
                                break;
                            case true:

                                consoleChatCommandHandler = consoleChatCommandHandlers.get(`${internalConsoleChatCommand}`);

                                consoleChatCommandHandler.execute(discordBot, gameplayBot, consoleChatCommandHandlers);
                                break;
                        }
                    } else {
                        gameplayBot.chat(consoleChatInput);
                    }
                } else {
                    console.log('MCHGB > Console chat input cannot be empty!');
                }
            } else {
                console.log('MCHGB > Console chat input cannot be empty!');
            }
            return true;
        } catch (consoleChatCommandError) {
            console.log(consoleChatCommandError);
            console.log('MCHGB > Error occured executing console chat command handlers! Restarting gameplay bot...');
            return consoleChatCommandError;
        }
    }
};