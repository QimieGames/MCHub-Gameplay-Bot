const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'dungeon_boss_spawned'
    },
    async execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, chatMessageDiscordChannelID, chatMessageDiscordChannelName, rawChatMessage, chatMessageForConsole, chatMessageForDiscord, chatMessageRegex) {

        const logToConsoleString = String(configValues.feature[`log_${this.data.name}_to_console`]).toLowerCase();

        const logToDiscordString = String(configValues.feature[`log_${this.data.name}_to_discord`]).toLowerCase();

        if (logToConsoleString == 'true') {
            console.log(chatMessageForConsole);
        }
        if (logToDiscordString == 'true') {

            const dungeonBossSpawnedPingRoleID = configValues.discord_role_id[`${this.data.name}_ping`];

            const dungeonBossSpawnedDetails = String(rawChatMessage).match(chatMessageRegex);

            const dungeonBossSpawnedEmbedDescription = `Time Left: ${dungeonBossSpawnedDetails[1]}`;

            const dungeonBossSpawnedEmbed = new EmbedBuilder()
                .setColor(discordEmbedDetails.color.purple)
                .setTitle('DUNGEON BOSS SPAWNED')
                .setDescription(dungeonBossSpawnedEmbedDescription)
                .setThumbnail(discordEmbedDetails.thumbnail.mchub_logo)
                .setTimestamp()
                .setFooter(discordEmbedDetails.footer);

            const tagOnAlertRegex = RegExp(/^[0-9]{2,2} minutes/);

            if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID) != undefined) {
                if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('ViewChannel') == true) {
                    if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('SendMessages') == true) {
                        if (tagOnAlertRegex.test(dungeonBossSpawnedDetails[1]) == true) {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ content: `|| <@&${dungeonBossSpawnedPingRoleID}> ||`, embeds: [dungeonBossSpawnedEmbed] });
                        } else {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ embeds: [dungeonBossSpawnedEmbed] });
                        }
                    } else {
                        console.log(`MCHGB > Unable to log ${this.data.name.replace(RegExp(/[\_]/, 'g'), ' ')} in #${chatMessageDiscordChannelName}!`);
                    }
                } else {
                    console.log(`MCHGB > Unable to view #${chatMessageDiscordChannelName}!`);
                }
            } else {
                console.log(`MCHGB > Failed to find ${this.data.name.replace(RegExp(/[\_]/, 'g'), ' ')} log channel!`);
            }
        }
    }
};