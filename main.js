require('dotenv').config();

const nodeFS = require('fs');

const mineflayer = require('mineflayer');

const { IntentsBitField, Partials, Client, Collection, EmbedBuilder } = require('discord.js');

const { REST } = require('@discordjs/rest');

const { Routes, ActivityType } = require('discord-api-types/v10');

const readline = require('readline');

const importantDirectory =

{
    main_handler: './handlers/',
    gameplay_bot_chat_types_handler: './handlers/gameplay_bot_chat_types/',
    console_chat_commands_handler: './handlers/console_chat_commands/',
    discord_slash_commands_handler: './handlers/discord_slash_commands/',
    error_logs: './error_logs/'
};

const defaultEnvFileLayout =

    `DISCORD_BOT_TOKEN=DISCORD_BOT_TOKEN_HERE
GAMEPLAY_BOT_EMAIL=GAMEPLAY_BOT_EMAIL_HERE
GAMEPLAY_BOT_PASSWORD=GAMEPLAY_BOT_PASSWORD_HERE`;

const defaultConfigFileLayout =

{
    discord_bot: {
        guild_id: '1'
    },
    gameplay_bot: {
        realm_name: 'ATLANTIC/SUN',
        realm_season: '1'
    },
    feature: {
        log_discord_slash_command_usage_log_to_console: 'TRUE/FALSE',
        log_public_chat_to_console: 'TRUE/FALSE',
        log_supershout_message_to_console: 'TRUE/FALSE',
        log_shout_message_to_console: 'TRUE/FALSE',
        log_gang_chat_to_console: 'TRUE/FALSE',
        log_island_chat_to_console: 'TRUE/FALSE',
        log_private_message_to_console: 'TRUE/FALSE',
        log_mismatched_message_to_console: 'TRUE/FALSE',
        log_giveaway_winners_to_console: 'TRUE/FALSE',
        log_pve_boss_spawned_to_console: 'TRUE/FALSE',
        log_dungeon_boss_spawned_to_console: 'TRUE/FALSE',
        log_dungeon_opened_to_console: 'TRUE/FALSE',
        log_global_booster_to_console: 'TRUE/FALSE',
        log_beacon_meteor_spawned_to_console: 'TRUE/FALSE',
        log_bloodbath_started_to_console: 'TRUE/FALSE',
        log_loot_crates_spawned_to_console: 'TRUE/FALSE',
        log_upcoming_pve_boss_to_console: 'TRUE/FALSE',
        log_upcoming_dungeon_to_console: 'TRUE/FALSE',
        log_upcoming_prospector_to_console: 'TRUE/FALSE',
        log_upcoming_bloodbath_to_console: 'TRUE/FALSE',
        log_upcoming_loot_crates_to_console: 'TRUE/FALSE',
        log_discord_slash_command_usage_log_to_discord: 'TRUE/FALSE',
        log_public_chat_to_discord: 'TRUE/FALSE',
        log_supershout_message_to_discord: 'TRUE/FALSE',
        log_shout_message_to_discord: 'TRUE/FALSE',
        log_gang_chat_to_discord: 'TRUE/FALSE',
        log_island_chat_to_discord: 'TRUE/FALSE',
        log_private_message_to_discord: 'TRUE/FALSE',
        log_mismatched_message_to_discord: 'TRUE/FALSE',
        log_giveaway_winners_to_discord: 'TRUE/FALSE',
        log_pve_boss_spawned_to_discord: 'TRUE/FALSE',
        log_dungeon_boss_spawned_to_discord: 'TRUE/FALSE',
        log_dungeon_opened_to_discord: 'TRUE/FALSE',
        log_global_booster_to_discord: 'TRUE/FALSE',
        log_beacon_meteor_spawned_to_discord: 'TRUE/FALSE',
        log_bloodbath_started_to_discord: 'TRUE/FALSE',
        log_loot_crates_spawned_to_discord: 'TRUE/FALSE',
        log_upcoming_pve_boss_to_discord: 'TRUE/FALSE',
        log_upcoming_dungeon_to_discord: 'TRUE/FALSE',
        log_upcoming_prospector_to_discord: 'TRUE/FALSE',
        log_upcoming_bloodbath_to_discord: 'TRUE/FALSE',
        log_upcoming_loot_crates_to_discord: 'TRUE/FALSE'
    },
    discord_channel: {
        discord_slash_command_usage_log: '1',
        public_chat: '1',
        supershout_message: '1',
        shout_message: '1',
        gang_chat: '1',
        island_chat: '1',
        private_message: '1',
        mismatched_message: '1',
        giveaway_winners: '1',
        pve_boss_spawned: '1',
        dungeon_boss_spawned: '1',
        dungeon_opened: '1',
        global_booster: '1',
        beacon_meteor_spawned: '1',
        bloodbath_started: '1',
        loot_crates_spawned: '1',
        upcoming_pve_boss: '1',
        upcoming_dungeon: '1',
        upcoming_prospector: '1',
        upcoming_bloodbath: '1',
        upcoming_loot_crates: '1'
    },
    discord_role_id: {
        admin: '1',
        trusted: '1',
        blacklisted: '1',
        giveaway_winners_ping: '1',
        pve_boss_spawned_ping: '1',
        dungeon_boss_spawned_ping: '1',
        dungeon_opened_ping: '1',
        global_booster_ping: '1',
        beacon_meteor_spawned_ping: '1',
        bloodbath_started_ping: '1',
        loot_crates_spawned_ping: '1',
        upcoming_pve_boss_ping: '1',
        upcoming_prospector_ping: '1',
        upcoming_bloodbath_ping: '1',
        upcoming_loot_crates_ping: '1'
    }
};

const discordBotIntents =

    [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ];

const discordBotPartials =

    [
        Partials.GuildMember,
        Partials.Channel,
        Partials.Message,
        Partials.User
    ];

const discordBot = new Client({ intents: discordBotIntents, partials: discordBotPartials });

const discordEmbedDetails =

{
    color: {
        purple: '#4f10b5',
        red: '#b80f0f',
        yellow: '#ccd638',
        green: '#24ad4b'
    },
    thumbnail: {
        mchub_logo: 'https://i.imgur.com/QvMjFBH.png',
        emoji_tada: 'https://i.imgur.com/pJu2HOd.png',
        emoji_crossed_swords: 'https://i.imgur.com/p3Q3f1l.png',
        minecraft_tripwire_hook: 'https://i.imgur.com/qGKYX9X.png',
        minecraft_witch_head: 'https://i.imgur.com/32Cnzyi.png',
        minecraft_evoker_head: 'https://i.imgur.com/M9aN4ph.png',
        minecraft_creeper_head: 'https://i.imgur.com/ROWi27D.png',
        minecraft_iron_golem_head: 'https://i.imgur.com/9qIVfOl.png',
        minecraft_magma_cream: 'https://i.imgur.com/iTFYeNP.png',
        minecraft_diamond_pickaxe: 'https://i.imgur.com/Uv3Jcv3.png',
        minecraft_gold_block: 'https://i.imgur.com/okKooYh.png',
        minecraft_shulker: 'https://i.imgur.com/bMZzrzY.png',
        minecraft_beacon_block: 'https://i.imgur.com/rY6GGQt.png',
        minecraft_chest_block: 'https://i.imgur.com/XebocLd.png',
        minecraft_emerald: 'https://i.imgur.com/rGBEdvg.png'
    },
    footer: {
        text: 'Custom Coded By QimieGames',
        iconURL: 'https://i.imgur.com/DKvFjXw.png'
    }
};

let configValues, guildID, clientID, mainHandlers = new Map(), gameplayBotChatTypeHandlers = new Map(), consoleChatCommandHandlers = new Map(), gameplayBot, isGameplayBotReady = false, isDiscordBotReady = false, discordSlashCommandHandlers = new Collection(), isDiscordCommandsOnCooldown = false;

function accessDirectory(directoryName, directoryPath) {
    try {
        console.log(`MCHGB > Accessing ${directoryName} directory...`);
        nodeFS.accessSync(directoryPath, nodeFS.constants.F_OK);
        console.log(`MCHGB > Accessed ${directoryName} directory.`);
        return true;
    } catch {
        console.log(`MCHGB > Failed to access ${directoryName} directory!`);
        return false;
    }
}

function generateDirectory(directoryName, directoryPath) {
    try {
        console.log(`MCHGB > Generating a new ${directoryName} directory...`);
        nodeFS.mkdirSync(directoryPath);
        console.log(`MCHGB > Generated ${directoryName} directory.`);
        return true;
    } catch (generateDirectoryError) {
        console.log(generateDirectoryError);
        console.log(`MCHGB > Error occured while generating a new ${directoryName} directory! Forcing gameplay bot to restart...`);
        return false;
    }
}

function loadImportantDirectories() {
    console.log('MCHGB > Loading important directories...');

    let loadImportantDirectoriesResult;

    Object.keys(importantDirectory).forEach((importantDirectoryType) => {
        if (loadImportantDirectoriesResult == undefined || loadImportantDirectoriesResult == true) {

            const directoryName = importantDirectoryType.replace(RegExp(/[\_]/, 'g'), ' ');

            const directoryPath = importantDirectory[importantDirectoryType];

            if (accessDirectory(directoryName, directoryPath) == true) {

                loadImportantDirectoriesResult = true;

            } else {
                if (generateDirectory(directoryName, directoryPath) == true) {

                    loadImportantDirectoriesResult = true;

                } else {

                    loadImportantDirectoriesResult = false;

                }
            }
        }
    });
    if (loadImportantDirectoriesResult == true) {
        console.log('MCHGB > Loaded important directories.');
    }
    return loadImportantDirectoriesResult;
}

function loadImportantFiles() {
    console.log('MCHGB > Loading important files...');

    let loadImportantFilesResult;

    try {

        const defaultMainHandlerFilesName = ['console_chat.js', 'error_logger.js', 'gameplay_bot_chat.js', 'tasks_scheduler.js'];

        const defaultGameplayBotChatTypeHandlerFilesName = ['beacon_meteor_spawned.js', 'bloodbath_started.js', 'dungeon_boss_spawned.js', 'dungeon_opened.js', 'gang_chat.js', 'giveaway_winners.js', 'global_booster.js', 'island_chat.js', 'loot_crates_spawned.js', 'mismatched_message.js', 'private_message.js', 'public_chat.js', 'pve_boss_spawned.js', 'shout_message.js', 'supershout_message.js', 'upcoming_bloodbath.js', 'upcoming_dungeon.js', 'upcoming_loot_crates.js', 'upcoming_prospector.js', 'upcoming_pve_boss.js'];

        const defaultConsoleChatCommandHandlerFilesName = ['help.js', 'quit.js', 'restart.js'];

        const defaultDiscordSlashCommandHandlerFilesName = ['blacklist.js', 'help.js', 'unblacklist.js'];

        const otherImportantFilesName = ['LICENSE', 'package-lock.json', 'package.json'];

        const currentMainHandlerFilesName = nodeFS.readdirSync(importantDirectory.main_handler).filter((currentMainHandlerFileName) => currentMainHandlerFileName.endsWith('.js'));

        const currentGameplayBotChatTypeHandlerFilesName = nodeFS.readdirSync(importantDirectory.gameplay_bot_chat_types_handler).filter((currentGameplayBotChatTypeHandlerFileName) => currentGameplayBotChatTypeHandlerFileName.endsWith('.js'));

        const currentConsoleChatCommandHandlerFilesName = nodeFS.readdirSync(importantDirectory.console_chat_commands_handler).filter((currentConsoleChatCommandHandlerFileName) => currentConsoleChatCommandHandlerFileName.endsWith('.js'));

        const currentDiscordSlashCommandHandlerFilesName = nodeFS.readdirSync(importantDirectory.discord_slash_commands_handler).filter((currentDiscordSlashCommandHandlerFileName) => currentDiscordSlashCommandHandlerFileName.endsWith('.js'));

        let missingFilesName = new Array(), extraFilesName = new Array();

        defaultMainHandlerFilesName.forEach((defaultMainHandlerFileName) => {
            if (currentMainHandlerFilesName.includes(defaultMainHandlerFileName) != true) {
                missingFilesName.push(defaultMainHandlerFileName);
            }
        });
        currentMainHandlerFilesName.forEach((currentMainHandlerFileName) => {
            if (defaultMainHandlerFilesName.includes(currentMainHandlerFileName) != true) {
                extraFilesName.push(currentMainHandlerFileName);
            }
        });
        defaultGameplayBotChatTypeHandlerFilesName.forEach((defaultGameplayBotChatTypeHandlerFileName) => {
            if (currentGameplayBotChatTypeHandlerFilesName.includes(defaultGameplayBotChatTypeHandlerFileName) != true) {
                missingFilesName.push(defaultGameplayBotChatTypeHandlerFileName);
            }
        });
        currentGameplayBotChatTypeHandlerFilesName.forEach((currentGameplayBotChatTypeHandlerFileName) => {
            if (defaultGameplayBotChatTypeHandlerFilesName.includes(currentGameplayBotChatTypeHandlerFileName) != true) {
                extraFilesName.push(currentGameplayBotChatTypeHandlerFileName);
            }
        });
        defaultConsoleChatCommandHandlerFilesName.forEach((defaultConsoleChatCommandHandlerFileName) => {
            if (currentConsoleChatCommandHandlerFilesName.includes(defaultConsoleChatCommandHandlerFileName) != true) {
                missingFilesName.push(defaultConsoleChatCommandHandlerFileName);
            }
        });
        currentConsoleChatCommandHandlerFilesName.forEach((currentConsoleChatCommandHandlerFileName) => {
            if (defaultConsoleChatCommandHandlerFilesName.includes(currentConsoleChatCommandHandlerFileName) != true) {
                extraFilesName.push(currentConsoleChatCommandHandlerFileName);
            }
        });
        defaultDiscordSlashCommandHandlerFilesName.forEach((defaultDiscordSlashCommandHandlerFileName) => {
            if (currentDiscordSlashCommandHandlerFilesName.includes(defaultDiscordSlashCommandHandlerFileName) != true) {
                missingFilesName.push(defaultDiscordSlashCommandHandlerFileName);
            }
        });
        currentDiscordSlashCommandHandlerFilesName.forEach((currentDiscordSlashCommandHandlerFileName) => {
            if (defaultDiscordSlashCommandHandlerFilesName.includes(currentDiscordSlashCommandHandlerFileName) != true) {
                extraFilesName.push(currentDiscordSlashCommandHandlerFileName);
            }
        });
        otherImportantFilesName.forEach((otherImportantFileName) => {
            try {
                nodeFS.accessSync(otherImportantFileName, nodeFS.constants.F_OK);
            } catch {
                missingFilesName.push(otherImportantFileName);
            }
        });
        if (missingFilesName.length == 0 && extraFilesName.length == 0) {
            console.log('MCHGB > Loaded important files.');

            loadImportantFilesResult = true;

        } else {
            if (missingFilesName.length != 0) {
                if (extraFilesName.length != 0) {
                    console.log(`MCHGB > Extra File(s): "${extraFilesName.join('", "')}"`);
                }
                console.log(`MCHGB > Missing File(s): "${missingFilesName.join('", "')}" | Please do a clean installation of gameplay bot! Forcing gameplay bot to shutdown...`);
            } else {
                console.log(`MCHGB > Extra File(s): "${extraFilesName.join('", "')}" | Please remove these file(s) first! Forcing gameplay bot to shutdown...`);
            }

            loadImportantFilesResult = false;

        }
    } catch (loadImportantFilesError) {
        console.log(loadImportantFilesError);
        console.log('MCHGB > Error occured while loading important files! Forcing gameplay bot to restart...');

        loadImportantFilesResult = 'ERROR';

    }
    return loadImportantFilesResult;
}

function accessFile(fileName, filePath) {
    try {
        console.log(`MCHGB > Accessing ${fileName} file...`);
        nodeFS.accessSync(filePath, nodeFS.constants.F_OK);
        console.log(`MCHGB > Accessed ${fileName} file.`);
        return true;
    } catch {
        console.log(`MCHGB > Failed to access ${fileName} file!`);
        return false;
    }
}

function generateEnvFile() {
    try {
        console.log('MCHGB > Generating a new .env file...');
        nodeFS.appendFileSync('.env', defaultEnvFileLayout);
        console.log('MCHGB > Generated a new .env file. Please configure it first. Forcing gameplay bot to shutdown...');
        return true;
    } catch (generateEnvFileError) {
        console.log(generateEnvFileError);
        console.log('MCHGB > Error occured while generating a new .env file! Forcing gameplay bot to restart...');
        return false;
    }
}

function reformatEnvFile() {
    try {
        console.log('MCHGB > Reformatting .env file...');
        nodeFS.writeFileSync('.env', defaultEnvFileLayout);
        console.log('MCHGB > Reformatted .env file. Please configure it first. Forcing gameplay bot to shutdown...');
        return true;
    } catch (reformatEnvFileError) {
        console.log(reformatEnvFileError);
        console.log('MCHGB > Error occured while reformatting .env file! Forcing gameplay bot to restart...');
        return false;
    }
}

function loadEnvFileValues() {
    console.log('MCHGB > Validating .env file values...');
    if (process.env.DISCORD_BOT_TOKEN == undefined || process.env.GAMEPLAY_BOT_EMAIL == undefined || process.env.GAMEPLAY_BOT_PASSWORD == undefined) {
        console.log('MCHGB > Invalid .env file!');
        if (reformatEnvFile() == true) {
            return false;
        } else {
            return 'ERROR';
        }
    } else {

        const invalidEnvFileValueRegex = RegExp(/^DISCORD_BOT_TOKEN_HERE$|^GAMEPLAY_BOT_EMAIL_HERE$|^GAMEPLAY_BOT_PASSWORD_HERE$|^$|^[ ]+$/);

        if (invalidEnvFileValueRegex.test(process.env.DISCORD_BOT_TOKEN) == false && invalidEnvFileValueRegex.test(process.env.GAMEPLAY_BOT_EMAIL) == false && invalidEnvFileValueRegex.test(process.env.GAMEPLAY_BOT_PASSWORD) == false) {
            console.log('MCHGB > Validated .env file values.');
            return true;
        } else {
            console.log('MCHGB > Invalid .env value(s)! Please configure it first. Forcing gameplay bot to shutdown...');
            return false;
        }
    }
}

function loadEnvFile() {
    console.log('MCHGB > Loading .env file...');
    if (accessFile('.env', './.env') == true) {
        switch (loadEnvFileValues()) {
            default:
                return 'ERROR';
                break;
            case false:
                return false;
                break;
            case true:
                console.log('MCHGB > Loaded .env file.');
                return true;
                break;
        }
    } else {
        if (generateEnvFile() == true) {
            return false;
        } else {
            return 'ERROR';
        }
    }
}

function generateConfigFile() {
    try {
        console.log('MCHGB > Generating a new config.json file...');
        nodeFS.appendFileSync('config.json', JSON.stringify(defaultConfigFileLayout, null, 4));
        console.log('MCHGB > Generated a new config.json file. Please configure it first. Forcing gameplay bot to shutdown...');
        return true;
    } catch (generateConfigFileError) {
        console.log(generateConfigFileError);
        console.log('MCHGB > Error occured while generating a new config.json file! Forcing gameplay bot to restart...');
        return false;
    }
}

function reformatConfigFile() {
    try {
        console.log('MCHGB > Reformatting config.json file...');
        nodeFS.writeFileSync('config.json', JSON.stringify(defaultConfigFileLayout, null, 4));
        console.log('MCHGB > Reformatted config.json file. Please configure it first. Forcing gameplay bot to shutdown...');
        return true;
    } catch (reformatConfigFileError) {
        console.log(reformatConfigFileError);
        console.log('MCHGB > Error occured while reformatting config.json file! Forcing gameplay bot to restart...');
        return false;
    }
}

function loadConfigFileSettings() {
    try {
        console.log('MCHGB > Validating config.json file settings...');

        configValues = JSON.parse(nodeFS.readFileSync('./config.json'));

        try {

            let defaultConfigFileSettings = new Array(), currentConfigFileSettings = new Array(), missingConfigFileSettings = new Array(), extraConfigFileSettings = new Array();

            Object.keys(defaultConfigFileLayout).forEach((defaultConfigFileMainSetting) => {
                Object.keys(defaultConfigFileLayout[defaultConfigFileMainSetting]).forEach((defaultConfigFileSecondarySetting) => {
                    defaultConfigFileSettings.push(`${defaultConfigFileMainSetting}.${defaultConfigFileSecondarySetting}`);
                });
            });
            Object.keys(configValues).forEach((currentConfigFileMainSetting) => {
                Object.keys(configValues[currentConfigFileMainSetting]).forEach((currentConfigFileSecondarySetting) => {
                    currentConfigFileSettings.push(`${currentConfigFileMainSetting}.${currentConfigFileSecondarySetting}`);
                });
            });
            defaultConfigFileSettings.forEach((defaultConfigFileSetting) => {
                if (currentConfigFileSettings.includes(defaultConfigFileSetting) != true) {
                    missingConfigFileSettings.push(defaultConfigFileSetting);
                }
            });
            currentConfigFileSettings.forEach((currentConfigFileSetting) => {
                if (defaultConfigFileSettings.includes(currentConfigFileSetting) != true) {
                    extraConfigFileSettings.push(currentConfigFileSetting);
                }
            });
            if (missingConfigFileSettings.length == 0 && extraConfigFileSettings.length == 0) {
                console.log('MCHGB > Validated config.json file settings.');
                return true;
            } else {
                if (missingConfigFileSettings.length != 0) {
                    console.log(`MCHGB > Missing Config Setting(s): "${missingConfigFileSettings.join('", "')}"`);
                }
                if (extraConfigFileSettings.length != 0) {
                    console.log(`MCHGB > Extra Config Setting(s): "${extraConfigFileSettings.join('", "')}"`);
                }
                if (reformatConfigFile() == true) {
                    return false;
                } else {
                    return 'ERROR';
                }
            }
        } catch (validateConfigFileSettingsError) {
            console.log(validateConfigFileSettingsError);
            console.log('MCHGB > Error occured while validating config.json file settings! Forcing gameplay bot to restart...');
            return 'ERROR';
        }
    } catch {
        console.log('MCHGB > Invalid config.json file!');
        if (reformatConfigFile() == true) {
            return false;
        } else {
            return 'ERROR';
        }
    }
}

function loadConfigFile() {
    console.log('MCHGB > Loading config.json file...');
    if (accessFile('config.json', './config.json')) {
        switch (loadConfigFileSettings()) {
            default:
                return 'ERROR';
                break;
            case false:
                return false;
                break;
            case true:
                console.log('MCHGB > Loaded config.json file.');
                return true;
                break;
        }
    } else {
        if (generateConfigFile() == true) {
            return false;
        } else {
            return 'ERROR';
        }
    }
}

function registerHandlers() {
    try {
        console.log('MCHGB > Registering handlers...');

        const mainHandlerFilesName = nodeFS.readdirSync(importantDirectory.main_handler).filter((mainHandlerFileName) => mainHandlerFileName.endsWith('.js'));

        const gameplayBotChatTypeHandlerFilesName = nodeFS.readdirSync(importantDirectory.gameplay_bot_chat_types_handler).filter((gameplayBotChatTypeHandlerFileName) => gameplayBotChatTypeHandlerFileName.endsWith('.js'));

        const consoleChatCommandHandlerFilesName = nodeFS.readdirSync(importantDirectory.console_chat_commands_handler).filter((consoleChatCommandHandlerFileName) => consoleChatCommandHandlerFileName.endsWith('.js'));

        mainHandlerFilesName.forEach((mainHandlerFileName) => {

            const mainHandlerFile = require(`${importantDirectory.main_handler}${mainHandlerFileName}`);

            mainHandlers.set(mainHandlerFile.data.name, mainHandlerFile);
        });
        gameplayBotChatTypeHandlerFilesName.forEach((gameplayBotChatTypeHandlerFileName) => {

            const gameplayBotChatTypeHandlerFile = require(`${importantDirectory.gameplay_bot_chat_types_handler}${gameplayBotChatTypeHandlerFileName}`);

            gameplayBotChatTypeHandlers.set(gameplayBotChatTypeHandlerFile.data.name, gameplayBotChatTypeHandlerFile);
        });
        consoleChatCommandHandlerFilesName.forEach((consoleChatCommandHandlerFileName) => {

            const consoleChatCommandHandlerFile = require(`${importantDirectory.console_chat_commands_handler}${consoleChatCommandHandlerFileName}`);

            consoleChatCommandHandlers.set(consoleChatCommandHandlerFile.data.name, consoleChatCommandHandlerFile);
        });
        console.log('MCHGB > Registered handlers.');
        return true;
    } catch (registerHandlersError) {
        console.log(registerHandlersError);
        console.log('MCHGB > Error occured while executing registerHandlers function! Forcing gameplay bot to shutdown...');
        return 'ERROR';
    }
}

function logError(errorMessage) {

    let logErrorDetails = { result: null, fileName: null };

    const errorLogDateDetails = new Date();

    logErrorDetails.fileName = `ERROR_LOG-${errorLogDateDetails.getDate()}_${errorLogDateDetails.getMonth() + 1}_${errorLogDateDetails.getFullYear()}-${errorLogDateDetails.getHours()}_${errorLogDateDetails.getMinutes()}_${errorLogDateDetails.getSeconds()}.txt`;

    const errorLoggerHandler = mainHandlers.get('error_logger');

    errorLoggerHandler.execute(logErrorDetails, errorMessage);
    return logErrorDetails;
}

function handleError(errorMessage, errorHandledAction) {

    let handleErrorErrorAction;

    try {
        switch (errorHandledAction) {
            default:

                errorHandledAction = 0;

                handleErrorErrorAction = 'Forcing gameplay bot to restart...';

                break;
            case 0:

                handleErrorErrorAction = 'Forcing gameplay bot to restart...';

                break;
            case 1:

                handleErrorErrorAction = 'Forcing gameplay bot to shutdown...';

                break;
        }
        try {
            gameplayBot.end();
        } catch { }
        try {
            discordBot.destroy();
        } catch { }

        const errorLogDetails = logError(errorMessage);

        switch (errorLogDetails.result) {
            default:
                console.log('MCHGB > Error occured while generating an error log!');
                break;
            case true:
                console.log(`MCHGB > Successfully generated an error log! File Name: ${errorLogDetails.fileName}`);
                break;
            case false:
                console.log('MCHGB > Failed to generate an error log!');
                break;
        }
    } catch {
        console.log(`MCHGB > Error occured while handling error! ${handleErrorErrorAction}`);
    }
    return process.exit(errorHandledAction);
}

async function loadConfigFileValues() {
    try {
        console.log('MCHGB > Loading config file values...');

        const validRealmNames = ['atlantic', 'sun'];

        let discordBotGuildsID = new Array(), discordBotGuildRolesID = new Array(), discordBotGuildChannelsID = new Array(), incorrectConfigFileValueSetting = new Array();

        if (typeof Number(configValues.discord_bot.guild_id) != 'number') {
            console.log('MCHGB > Incorrect Config Value: discord_bot.guild_id');
            return false;
        } else {
            await discordBot.guilds.fetch().then((discordBotGuildsFetchResult) => {
                discordBotGuildsFetchResult.forEach((discordBotGuildFetchResult) => {
                    discordBotGuildsID.push(discordBotGuildFetchResult.id);
                });
            });
            if (discordBotGuildsID.includes(configValues.discord_bot.guild_id) != true) {
                console.log('MCHGB > Incorrect Config Value: discord_bot.guild_id');
                return false;
            } else {

                guildID = configValues.discord_bot.guild_id, clientID = discordBot.user.id;

            }
        }
        await discordBot.guilds.cache.get(configValues.discord_bot.guild_id).channels.fetch().then((discordBotGuildChannelsFetchResult) => {
            discordBotGuildChannelsFetchResult.forEach((discordBotGuildChannelFetchResult) => {
                discordBotGuildChannelsID.push(discordBotGuildChannelFetchResult.id);
            });
        });
        await discordBot.guilds.cache.get(configValues.discord_bot.guild_id).roles.fetch().then((discordBotGuildRolesFetchResult) => {
            discordBotGuildRolesFetchResult.forEach((discordBotGuildRoleFetchResult) => {
                discordBotGuildRolesID.push(discordBotGuildRoleFetchResult.id);
            });
        });
        if (typeof Number(configValues.gameplay_bot.realm_season) != 'number') {
            incorrectConfigFileValueSetting.push('gameplay_bot.realm_season');
        }
        if (validRealmNames.includes(String(configValues.gameplay_bot.realm_name).toLowerCase()) != true) {
            incorrectConfigFileValueSetting.push('gameplay_bot.realm_name');
        }
        Object.keys(configValues).forEach((currentConfigFileMainSetting) => {
            Object.keys(configValues[currentConfigFileMainSetting]).forEach((currentConfigFileSecondarySetting) => {

                const configValue = String(configValues[currentConfigFileMainSetting][currentConfigFileSecondarySetting]).toLowerCase();

                switch (currentConfigFileMainSetting) {
                    case 'feature':
                        if (configValue != 'true' && configValue != 'false') {
                            incorrectConfigFileValueSetting.push(`${currentConfigFileMainSetting}.${currentConfigFileSecondarySetting}`);
                        }
                        break;
                    case 'discord_channel':
                        if (typeof Number(configValue) != 'number') {
                            incorrectConfigFileValueSetting.push(`${currentConfigFileMainSetting}.${currentConfigFileSecondarySetting}`);
                        } else {
                            if (String(configValues.feature[`log_${currentConfigFileSecondarySetting}_to_discord`]).toLowerCase() == 'true') {
                                if (discordBotGuildChannelsID.includes(configValue) != true) {
                                    incorrectConfigFileValueSetting.push(`${currentConfigFileMainSetting}.${currentConfigFileSecondarySetting}`);
                                }
                            }
                        }
                        break;
                    case 'discord_role_id':
                        if (typeof Number(configValue) != 'number') {
                            incorrectConfigFileValueSetting.push(`${currentConfigFileMainSetting}.${currentConfigFileSecondarySetting}`);
                        } else {

                            const specialDiscordRoleIDSettingRegex = RegExp(/^([a-z\_]+)\_ping$/);

                            if (specialDiscordRoleIDSettingRegex.test(currentConfigFileSecondarySetting) == true) {
                                if (String(configValues.feature[`log_${currentConfigFileSecondarySetting.match(specialDiscordRoleIDSettingRegex)[1]}_to_discord`]).toLowerCase() == 'true') {
                                    if (discordBotGuildRolesID.includes(configValue) != true) {
                                        incorrectConfigFileValueSetting.push(`${currentConfigFileMainSetting}.${currentConfigFileSecondarySetting}`);
                                    }
                                }
                            } else {
                                if (discordBotGuildRolesID.includes(configValue) != true) {
                                    incorrectConfigFileValueSetting.push(`${currentConfigFileMainSetting}.${currentConfigFileSecondarySetting}`);
                                }
                            }
                        }
                        break;
                }
            });
        });
        if (incorrectConfigFileValueSetting.length == 0) {
            console.log('MCHGB > Loaded config file values.');
            return true;
        } else {
            console.log(`MCHGB > Incorrect Config Value(s): "${incorrectConfigFileValueSetting.join('", "')}"`);
            console.log('MCHGB > Invalid config file value(s)! Please configure it first. Shutting down gameplay bot...');
            return false;
        }
    } catch (loadConfigFileValuesError) {
        console.log(loadConfigFileValuesError);
        console.log('MCHGB > Error occured while executing loadConfigFileValues function! Restarting gameplay bot...');
        return loadConfigFileValuesError;
    }
}

async function synchronizeDiscordSlashCommands() {
    try {
        console.log('MCHGB > Synchronizing discord slash commands...');

        let synchronizeDiscordSlashCommandsResult;

        const restAPI = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

        const discordSlashCommandFilesName = nodeFS.readdirSync(importantDirectory.discord_slash_commands_handler).filter((discordSlashCommandFileName) => discordSlashCommandFileName.endsWith('.js'));

        let discordSlashCommands = new Array();

        discordSlashCommandFilesName.forEach((discordSlashCommandFileName) => {

            const discordSlashCommandFile = require(`${importantDirectory.discord_slash_commands_handler}${discordSlashCommandFileName}`);

            discordSlashCommands.push(discordSlashCommandFile.data.toJSON());
            discordSlashCommandHandlers.set(discordSlashCommandFile.data.name, discordSlashCommandFile);
        });
        await restAPI.put(Routes.applicationGuildCommands(clientID, guildID), { body: discordSlashCommands }).then(() => {
            console.log('MCHGB > Synchronized discord slash commands.');

            synchronizeDiscordSlashCommandsResult = true;

        }).catch((synchronizeDiscordSlashCommandsError) => {
            console.log(synchronizeDiscordSlashCommandsError);
            console.log('MCHGB > Failed to synchronize discord slash commands! Restarting gameplay bot...');

            synchronizeDiscordSlashCommandsResult = false;

        });
        return synchronizeDiscordSlashCommandsResult;
    } catch (synchronizeDiscordSlashCommandsError) {
        console.log(synchronizeDiscordSlashCommandsError);
        console.log('MCHGB > Error occured while executing synchronizeDiscordSlashCommands function! Restarting gameplay bot...');
        return synchronizeDiscordSlashCommandsError;
    }
}

async function logDiscordSlashCommandUsage(interactionDetails, interactionResultDetails) {

    const discordUserDisplayName = interactionDetails.member.displayName;

    const discordUserID = interactionDetails.member.id;

    let discordSlashCommandUsageLogEmbedColor, discordSlashCommandUsageLogTemplate;

    switch (interactionResultDetails.result) {
        default:

            discordSlashCommandUsageLogEmbedColor = discordEmbedDetails.color.red;

            discordSlashCommandUsageLogTemplate = `User's Display Name: ${discordUserDisplayName}\n` + `User's ID: ${discordUserID}\n` + `Command: ${interactionResultDetails.fullCommand}\n` + `Command Status: ERROR\n` + `Channel's Name: #${interactionDetails.channel.name}\n` + `Channel's ID: ${interactionDetails.channel.id}`;

            break;
        case false:

            discordSlashCommandUsageLogEmbedColor = discordEmbedDetails.color.yellow;

            discordSlashCommandUsageLogTemplate = `User's Display Name: ${discordUserDisplayName}\n` + `User's ID: ${discordUserID}\n` + `Command: ${interactionResultDetails.fullCommand}\n` + `Command Status: FAILED\n` + `Failed Reason: ${interactionResultDetails.failedReason}\n` + `Channel's Name: #${interactionDetails.channel.name}\n` + `Channel's ID: ${interactionDetails.channel.id}`;

            break;
        case true:

            discordSlashCommandUsageLogEmbedColor = discordEmbedDetails.color.green;

            discordSlashCommandUsageLogTemplate = `User's Display Name: ${discordUserDisplayName}\n` + `User's ID: ${discordUserID}\n` + `Command: ${interactionResultDetails.fullCommand}\n` + `Command Status: SUCCESS\n` + `Channel's Name: #${interactionDetails.channel.name}\n` + `Channel's ID: ${interactionDetails.channel.id}`;

            break;
    }
    if (String(configValues.feature.log_discord_slash_command_usage_log_to_console).toLowerCase() == 'true') {
        console.log('========================\n' + discordSlashCommandUsageLogTemplate + '\n========================');
    }
    if (String(configValues.feature.log_discord_slash_command_usage_log_to_discord).toLowerCase() == 'true') {

        const discordSlashCommandUsageLogChannelID = configValues.discord_channel.discord_slash_command_usage_log;

        const discordSlashCommandUsageLogChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(discordSlashCommandUsageLogChannelID).name;

        const discordSlashCommandUsageLogEmbed = new EmbedBuilder()
            .setColor(discordSlashCommandUsageLogEmbedColor)
            .setTitle('SLASH COMMAND USAGE')
            .setDescription(discordSlashCommandUsageLogTemplate)
            .setThumbnail(interactionDetails.member.displayAvatarURL())
            .setTimestamp()
            .setFooter(discordEmbedDetails.footer);

        if (discordBot.guilds.cache.get(guildID).channels.cache.get(discordSlashCommandUsageLogChannelID) != undefined) {
            if (discordBot.guilds.cache.get(guildID).channels.cache.get(discordSlashCommandUsageLogChannelID).permissionsFor(clientID).has('ViewChannel') == true) {
                if (discordBot.guilds.cache.get(guildID).channels.cache.get(discordSlashCommandUsageLogChannelID).permissionsFor(clientID).has('SendMessages') == true) {
                    await discordBot.guilds.cache.get(guildID).channels.cache.get(discordSlashCommandUsageLogChannelID).send({ embeds: [discordSlashCommandUsageLogEmbed] });
                } else {
                    console.log(`MCHGB > Unable to log discord slash command usage log in #${discordSlashCommandUsageLogChannelName}!`);
                }
            } else {
                console.log(`MCHGB > Unable to view #${discordSlashCommandUsageLogChannelName}!`);
            }
        } else {
            console.log('MCHGB > Failed to find discord slash command usage log channel!');
        }
    }
}

try {
    console.log('MCHGB > Starting up gameplay bot...');
    if (loadImportantDirectories() == true) {
        switch (loadImportantFiles()) {
            default:
                return process.exit(0);
                break;
            case false:
                return process.exit(1);
                break;
            case true:
                switch (loadEnvFile()) {
                    default:
                        return process.exit(0);
                        break;
                    case false:
                        return process.exit(1);
                        break;
                    case true:
                        switch (loadConfigFile()) {
                            default:
                                return process.exit(0);
                                break;
                            case false:
                                return process.exit(1);
                                break;
                            case true:
                                if (registerHandlers() == true) {

                                    const gameplayBotSettings =

                                    {
                                        username: process.env.GAMEPLAY_BOT_EMAIL,
                                        password: process.env.GAMEPLAY_BOT_PASSWORD,
                                        auth: 'microsoft',
                                        version: '1.18.2',
                                        viewDistance: 'tiny',
                                        host: 'QimieGames.MCHub.COM',
                                        keepAlive: true,
                                        checkTimeoutInterval: 30000
                                    };

                                    process.once('unhandledRejection', (processOnceUnhandledRejection) => {

                                        isGameplayBotReady = false, isDiscordBotReady = false;

                                        console.log(processOnceUnhandledRejection);
                                        console.log('MCHGB > Process Unhandled Rejection! Restarting gameplay bot...');
                                        handleError(processOnceUnhandledRejection, 0);
                                    });

                                    process.once('uncaughtException', async (processOnceUncaughtException) => {

                                        isGameplayBotReady = false, isDiscordBotReady = false;

                                        console.log(processOnceUncaughtException);
                                        console.log('MCHGB > Process Uncaught Exception! Restarting gameplay bot...');
                                        handleError(processOnceUncaughtException, 0);
                                    });

                                    gameplayBot = mineflayer.createBot(gameplayBotSettings);

                                    gameplayBot.once('error', (gameplayBotOnceError) => {

                                        isGameplayBotReady = false;

                                        console.log(gameplayBotOnceError);
                                        console.log('MCHGB > Gameplay Bot Error! Restarting gameplay bot...');
                                        handleError(gameplayBotOnceError, 0);
                                    });

                                    gameplayBot.once('kicked', (gameplayBotOnceKicked) => {

                                        isGameplayBotReady = false;

                                        console.log(gameplayBotOnceKicked);
                                        console.log('MCHGB > Gameplay Bot Kicked! Restarting gameplay bot...');
                                        handleError(gameplayBotOnceKicked, 0);
                                    });

                                    gameplayBot.once('end', () => {

                                        isGameplayBotReady = false;

                                    });

                                    gameplayBot.once('login', async () => {
                                        try {
                                            console.log(`MCHGB > Connecting to ${gameplayBotSettings.host}...`);

                                            discordBot.once('error', (discordBotOnceError) => {

                                                isDiscordBotReady = false;

                                                console.log(discordBotOnceError);
                                                console.log('MCHGB > Discord Bot Error! Restarting gameplay bot...');
                                                handleError(discordBotOnceError, 0);
                                            });

                                            discordBot.once('invalidated', (discordBotOnceInvalidated) => {

                                                isDiscordBotReady = false;

                                                console.log(discordBotOnceInvalidated);
                                                console.log('MCHGB > Discord Bot Invalidated! Restarting gameplay bot...');
                                                handleError(discordBotOnceInvalidated, 0);
                                            });

                                            discordBot.once('shardError', (discordBotOnceShardError) => {

                                                isDiscordBotReady = false;

                                                console.log(discordBotOnceShardError);
                                                console.log('MCHGB > Discord Bot Shard Error! Restarting gameplay bot...');
                                                handleError(discordBotOnceShardError, 0);
                                            });

                                            discordBot.on('ready', async () => {
                                                try {

                                                    const realmName = String(configValues.gameplay_bot.realm_name).toLowerCase();

                                                    let discordbotActivityStatusMessage;

                                                    switch (realmName) {
                                                        case 'atlantic':

                                                            discordbotActivityStatusMessage = `${gameplayBotSettings.host} - Atlantic Prisons`;

                                                            break;
                                                        case 'sun':

                                                            discordbotActivityStatusMessage = `${gameplayBotSettings.host} - Sun Skyblock`;

                                                            break;
                                                    }
                                                    discordBot.user.setActivity(discordbotActivityStatusMessage, { type: ActivityType.Playing, name: discordbotActivityStatusMessage });

                                                    isDiscordBotReady = true;

                                                } catch (discordBotOnReadyError) {
                                                    console.log(discordBotOnReadyError);
                                                    console.log('MCHGB > Error occured while executing discord bot on ready tasks! Restarting gameplay bot...');
                                                    handleError(discordBotOnReadyError, 0);
                                                }
                                            });

                                            discordBot.on('interactionCreate', async (interactionDetails) => {

                                                let interactionResultDetails = { result: null, fullCommand: null, failedReason: null };

                                                try {
                                                    if (interactionDetails.isChatInputCommand()) {
                                                        if (isDiscordCommandsOnCooldown == false) {

                                                            isDiscordCommandsOnCooldown = true;

                                                            await interactionDetails.deferReply({ ephemeral: false }).then(async () => {
                                                                if (isGameplayBotReady == true) {

                                                                    const gameplayBotBlacklistedRolesID = [configValues.discord_role_id.blacklisted];

                                                                    if (interactionDetails.member.roles.cache.some((discordUserRole) => gameplayBotBlacklistedRolesID.includes(discordUserRole.id)) == false) {

                                                                        const interactionHandler = discordSlashCommandHandlers.get(interactionDetails.commandName);

                                                                        switch (interactionDetails.commandName) {
                                                                            default:
                                                                                await interactionDetails.editReply({ content: '```This command is still in development stage!```' }).then(() => {

                                                                                    interactionResultDetails.result = false, interactionResultDetails.fullCommand = `/${interactionDetails.commandName}`, interactionResultDetails.failedReason = 'This command is still in development stage!';

                                                                                }).then(async () => {
                                                                                    await logDiscordSlashCommandUsage(interactionDetails, interactionResultDetails);
                                                                                });
                                                                                break;
                                                                            case 'blacklist':
                                                                                await interactionHandler.execute(interactionDetails, interactionResultDetails, configValues, guildID, discordBot).then(async (interactionHandlerResultDetails) => {
                                                                                    await logDiscordSlashCommandUsage(interactionDetails, interactionHandlerResultDetails);
                                                                                });
                                                                                break;
                                                                            case 'help':
                                                                                await interactionHandler.execute(interactionDetails, interactionResultDetails, discordEmbedDetails, discordSlashCommandHandlers).then(async (interactionHandlerResultDetails) => {
                                                                                    await logDiscordSlashCommandUsage(interactionDetails, interactionHandlerResultDetails);
                                                                                });
                                                                                break;
                                                                            case 'unblacklist':
                                                                                await interactionHandler.execute(interactionDetails, interactionResultDetails, configValues, guildID, discordBot).then(async (interactionHandlerResultDetails) => {
                                                                                    await logDiscordSlashCommandUsage(interactionDetails, interactionHandlerResultDetails);
                                                                                });
                                                                                break;
                                                                        }
                                                                    } else {
                                                                        await interactionDetails.editReply({ content: '```You are blacklisted from using this gameplay bot!```' }).then(() => {

                                                                            interactionResultDetails.result = false, interactionResultDetails.fullCommand = `/${interactionDetails.commandName}`, interactionResultDetails.failedReason = 'User is blacklisted from using this gameplay bot!';

                                                                        }).then(async () => {
                                                                            await logDiscordSlashCommandUsage(interactionDetails, interactionResultDetails);
                                                                        });
                                                                    }
                                                                } else {
                                                                    await interactionDetails.editReply({ content: '```Gameplay bot is not ready!```' }).then(() => {

                                                                        interactionResultDetails.result = false, interactionResultDetails.fullCommand = `/${interactionDetails.commandName}`, interactionResultDetails.failedReason = 'Gameplay bot is not ready!';

                                                                    }).then(async () => {
                                                                        await logDiscordSlashCommandUsage(interactionDetails, interactionResultDetails);
                                                                    });
                                                                }
                                                            });

                                                            isDiscordCommandsOnCooldown = false;

                                                        } else {
                                                            await interactionDetails.editReply({ content: '```Discord commands are on cooldown!```' }).then(() => {

                                                                interactionResultDetails.result = false, interactionResultDetails.fullCommand = `/${interactionDetails.commandName}`, interactionResultDetails.failedReason = 'Discord commands are on cooldown!';

                                                            }).then(async () => {
                                                                await logDiscordSlashCommandUsage(interactionDetails, interactionResultDetails);
                                                            });
                                                        }
                                                    }
                                                } catch (discordBotOnInteractionCreateError) {
                                                    console.log(discordBotOnInteractionCreateError);
                                                    if (interactionDetails.isChatInputCommand()) {
                                                        await interactionDetails.editReply({ content: '```Error occured while executing discord bot on interaction create tasks!```' }).then(() => {

                                                            interactionResultDetails.result = 'ERROR', interactionResultDetails.fullCommand = `/${interactionDetails.commandName}`;

                                                        }).then(async () => {
                                                            await logDiscordSlashCommandUsage(interactionDetails, interactionResultDetails);
                                                        }).catch(() => { });
                                                    }
                                                    console.log('MCHGB > Error occured while executing discord bot on interaction create tasks! Restarting gameplay bot...');
                                                    handleError(discordBotOnInteractionCreateError, 0);
                                                }
                                            });

                                            console.log('MCHGB > Connecting to the Discord Bot...');
                                            await discordBot.login(process.env.DISCORD_BOT_TOKEN).then(async () => {
                                                console.log('MCHGB > Connected to the Discord Bot.');
                                                await loadConfigFileValues().then(async (loadConfigFileValuesResult) => {
                                                    switch (loadConfigFileValuesResult) {
                                                        default:
                                                            handleError(loadConfigFileValuesResult, 0);
                                                            break;
                                                        case false:
                                                            return process.exit(1);
                                                            break;
                                                        case true:
                                                            await synchronizeDiscordSlashCommands().then((synchronizeDiscordSlashCommandsResult) => {
                                                                switch (synchronizeDiscordSlashCommandsResult) {
                                                                    default:
                                                                        handleError(synchronizeDiscordSlashCommandsResult, 0);
                                                                        break;
                                                                    case false:
                                                                        handleError(synchronizeDiscordSlashCommandsResult, 0);
                                                                        break;
                                                                    case true:
                                                                        console.log('MCHGB > Started up gameplay bot.');

                                                                        const tasksSchedulerHandler = mainHandlers.get('tasks_scheduler');

                                                                        const taskSchedulerResult = tasksSchedulerHandler.execute(configValues, gameplayBot);

                                                                        switch (taskSchedulerResult) {
                                                                            default:
                                                                                return process.exit(0);
                                                                                break;
                                                                            case true:
                                                                                console.log('MCHGB > Starting console chat interface...');

                                                                                const consoleChat = readline.createInterface({ input: process.stdin, output: process.stdout });

                                                                                console.log('MCHGB > Started console chat interface.');

                                                                                consoleChat.on('line', (consoleChatInput) => {
                                                                                    try {

                                                                                        const consoleChatHandler = mainHandlers.get('console_chat');

                                                                                        consoleChatHandler.execute(consoleChatInput, consoleChatCommandHandlers, discordBot, gameplayBot);
                                                                                    } catch (consoleChatOnLineError) {
                                                                                        console.log(consoleChatOnLineError);
                                                                                        console.log('MCHGB > Error occured while executing console chat on line tasks! Restarting gameplay bot...');
                                                                                        handleError(consoleChatOnLineError, 0);
                                                                                    }
                                                                                });

                                                                                break;
                                                                        }
                                                                        break;
                                                                }
                                                            });
                                                            break;
                                                    }
                                                });
                                            }).catch((discordBotOnLoginError) => {
                                                console.log(discordBotOnLoginError);
                                                console.log('MCHGB > Error occured while connecting to the Discord Bot! Restarting gameplay bot...');
                                                handleError(discordBotOnLoginError, 0);
                                            });
                                        } catch (gameplayBotOnceLoginError) {
                                            console.log(gameplayBotOnceLoginError);
                                            console.log('MCHGB > Error occured while executing gameplay bot once login tasks! Restarting gameplay bot...');
                                            handleError(gameplayBotOnceLoginError, 0);
                                        }
                                    });

                                    gameplayBot.once('spawn', async () => {
                                        console.log(`MCHGB > Connected to ${gameplayBotSettings.host}.`);
                                    });

                                    gameplayBot.on('spawn', async () => {

                                        isGameplayBotReady = true;

                                    });

                                    gameplayBot.on('message', async (rawChatMessage, chatMessagePosition) => {
                                        try {
                                            if (isDiscordBotReady == true && chatMessagePosition != 'game_info') {

                                                const gameplayBotChatMainHandler = mainHandlers.get('gameplay_bot_chat');

                                                await gameplayBotChatMainHandler.execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, rawChatMessage, gameplayBotChatTypeHandlers);
                                            }
                                        } catch (gameplayBotOnMessageError) {
                                            console.log(gameplayBotOnMessageError);
                                            console.log('MCHGB > Error occured while gameplay bot on message tasks! Restarting gameplay bot...');
                                            handleError(gameplayBotOnMessageError, 0);
                                        }
                                    });

                                    gameplayBot.on('resourcePack', async (resourcePackURL, resourcePackHash) => {
                                        try {
                                            console.log('MCHGB > Incoming texture pack from MCHub.COM.\n' + `MCHGB > Resource Pack URL: ${resourcePackURL}\n` + `MCHGB > Resource Pack Hash: ${resourcePackHash}\n` + 'MCHGB > Denying incoming texture pack...');
                                            gameplayBot.denyResourcePack();
                                            console.log('MCHGB > Denied incoming texture pack.');
                                        } catch (gameplayBotOnResourcePackError) {
                                            console.log(gameplayBotOnResourcePackError);
                                            console.log('MCHGB > Error occured while executing gameplay bot on resource pack tasks! Restarting gameplay bot...');
                                            handleError(gameplayBotOnResourcePackError, 0);
                                        }
                                    });

                                } else {
                                    return process.exit(0);
                                }
                                break;
                        }
                        break;
                }
                break;
        }
    } else {
        return process.exit(0);
    }
} catch (startUpError) {
    console.log(startUpError);
    console.log('MCHGB > Error occured while starting up gameplay bot! Forcing gameplay bot to restart...');
    return process.exit(0);
}