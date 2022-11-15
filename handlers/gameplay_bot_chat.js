module.exports = {
    data: {
        name: 'gameplay_bot_chat'
    },
    async execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, rawChatMessage, gameplayBotChatTypeHandlers) {

        const realmName = String(configValues.gameplay_bot.realm_name).toLowerCase();

        switch (realmName) {
            case 'atlantic':

                var chatMessageTypeRegexes =

                {
                    public_chat: new RegExp(/^(\[R[0-9]{1,4}\]|\[\-\]|\[P[0-9]+\] \[R[0-9]{1,4}\]|\[P[0-9]+\] \[\-\]) (\[.+\]|\|\[.+\]\|) ([0-9A-Za-z\_\*]{3,17}|\[.+\] [0-9A-Za-z\_\*]{3,17}|\|\[.+\]\| [0-9A-Za-z\_\*]{3,17})(| \[P\])\: .+$/),
                    supershout_message: new RegExp(/^\([A-Za-z]+[0-9]+\) \[SS\] \[.+\] [0-9A-Za-z\_\*]{3,17}\: .+$/),
                    shout_message: new RegExp(/^\[Shout\] \[.+\] [0-9A-Za-z\_\*]{3,17} \» .+$/),
                    gang_chat: new RegExp(/^\[GC\] [0-9A-Za-z\_\*]{3,17}\: .+$/),
                    private_message: new RegExp(/^\[[A-Za-z]+[0-9]+\] \[([0-9A-Za-z\_\*]{3,17}|me) \-\> ([0-9A-Za-z\_\*]{3,17}|me)\] .+$/),
                    giveaway_winners: new RegExp(/^([A-Za-z]+) giveaway winners for ([0-9]{4,4})\-([0-9]{1,2})\-([0-9]{1,2}) are ([0-9A-Za-z\_\*\, ]+)/),
                    pve_boss_spawned: new RegExp(/^BEACON \» The \[([A-Za-z]+)\] ([A-Za-z ]+) has spawned\! Go to \/warp beacon to defeat it\!/),
                    dungeon_boss_spawned: new RegExp(/^Dungeons \» The dungeon boss has spawned\! There are ([0-9a-z ]+) left before the dungeon closes\!/),
                    dungeon_opened: new RegExp(/^Dungeons \» A new dungeon has opened\! You can join the dungeon by typing \/dungeon\!/),
                    global_booster: new RegExp(/^MCHUB \» ([0-9A-Za-z\_\*]{3,17}) has activated a Global ([A-Za-z]+) (.+) \(([0-9a-z ]+)\) booster\!/),
                    beacon_meteor_spawned: new RegExp(/^BEACON \» A meteor has entered the atmosphere and is about to make impact\! Go to \/warp beacon to mine it up\!/),
                    bloodbath_started: new RegExp(/^BLOODBATH \» Bloodbath has started\! \/warp pvp/),
                    upcoming_pve_boss: new RegExp(/^BEACON \» The next boss will spawn in ([0-9]{1,3}) beacon mob kills\!/),
                    upcoming_dungeon: new RegExp(/^Dungeons \» The next dungeon is scheduled to start in ([0-9a-z ]+)\!/),
                    upcoming_prospector: new RegExp(/^MCHUB \» Prospector last procced at ([0-9a-z ]+) ago\./),
                    upcoming_bloodbath: new RegExp(/^BLOODBATH \» The next bloodbath is in ([0-9a-z ]+)\!/)
                };

                break;
            case 'sun':

                var chatMessageTypeRegexes =

                {
                    public_chat: new RegExp(/^\[L[0-9]+\] (\[.+\]|\|\[.+\]\|) (.{3,17}|\[.+\] .{3,17}|\|\[.+\]\| .{3,17})(| \[P\])\: .+$/),
                    supershout_message: new RegExp(/^\([A-Za-z]+[0-9]+\) \[SS\] \[.+\] [0-9A-Za-z\_\*]{3,17}\: .+$/),
                    shout_message: new RegExp(/^\[Shout\] \[.+\] [0-9A-Za-z\_\*]{3,17} \» .+$/),
                    island_chat: new RegExp(/^\[IC\] [0-9A-Za-z\_\*]{3,17}\: .+$/),
                    private_message: new RegExp(/^\[[A-Za-z]+[0-9]+\] \[([0-9A-Za-z\_\*]{3,17}|me) \-\> ([0-9A-Za-z\_\*]{3,17}|me)\] .+$/),
                    giveaway_winners: new RegExp(/^([A-Za-z]+) giveaway winners for ([0-9]{4,4})\-([0-9]{1,2})\-([0-9]{1,2}) are ([0-9A-Za-z\_\*\, ]+)/),
                    pve_boss_spawned: new RegExp(/^BOSS \» A Boss has spawned\, find it in the depths of \/warp pve\!/),
                    dungeon_boss_spawned: new RegExp(/^Dungeons \» The dungeon boss has spawned\! There are ([0-9a-z ]+) left before the dungeon closes\!/),
                    dungeon_opened: new RegExp(/^Dungeons \» A new dungeon has opened\! You can join the dungeon by typing \/dungeon\!/),
                    loot_crates_spawned: new RegExp(/^ENVOY \> Loot Crates have spawned in the warzone\!/),
                    upcoming_pve_boss: new RegExp(/^MCHUB \» The next boss will spawn in ([0-9a-z ]+)\!/),
                    upcoming_dungeon: new RegExp(/^Dungeons \» The next dungeon is scheduled to start in ([0-9a-z ]+)\!/),
                    upcoming_loot_crates: new RegExp(/^ENVOY \> Loot Crates will be spawning in the warzone in ([0-9a-z ]+)\!/)
                };

                break;
        }

        let chatMessageDiscordChannelID, chatMessageDiscordChannelName, chatMessageForConsole, chatMessageForDiscord, chatMessageType, chatMessageRegex;

        chatMessageForConsole = rawChatMessage.toAnsi();

        Object.keys(chatMessageTypeRegexes).forEach((chatMessageTypeRegexName) => {
            if (chatMessageType == undefined) {

                const chatMessageTypeRegex = chatMessageTypeRegexes[chatMessageTypeRegexName];

                if (chatMessageTypeRegex.test(rawChatMessage) == true) {

                    chatMessageType = chatMessageTypeRegexName, chatMessageRegex = chatMessageTypeRegex;

                }
            }
        });
        if (chatMessageType == undefined) {

            chatMessageType = 'mismatched_message';

        }
        if (String(configValues.feature[`log_${chatMessageType}_to_discord`]).toLowerCase() == 'true') {

            chatMessageDiscordChannelID = configValues.discord_channel[chatMessageType];

            chatMessageDiscordChannelName = discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).name;

            chatMessageForDiscord = String(rawChatMessage).replace(RegExp(/[\`]{3}/, 'g'), '` ');

        }

        const gameplayBotChatTypeHandler = gameplayBotChatTypeHandlers.get(chatMessageType);

        await gameplayBotChatTypeHandler.execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, chatMessageDiscordChannelID, chatMessageDiscordChannelName, rawChatMessage, chatMessageForConsole, chatMessageForDiscord, chatMessageRegex);
    }
};