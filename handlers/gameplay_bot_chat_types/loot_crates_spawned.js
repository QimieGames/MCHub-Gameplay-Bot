const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'loot_crates_spawned'
    },
    async execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, chatMessageDiscordChannelID, chatMessageDiscordChannelName, rawChatMessage, chatMessageForConsole, chatMessageForDiscord, chatMessageRegex) {

        const logToConsoleString = String(configValues.feature[`log_${this.data.name}_to_console`]).toLowerCase();

        const logToDiscordString = String(configValues.feature[`log_${this.data.name}_to_discord`]).toLowerCase();

        if (logToConsoleString == 'true') {
            console.log(chatMessageForConsole);
        }
        if (logToDiscordString == 'true') {

            const lootCratesSpawnedPingRoleID = configValues.discord_role_id[`${this.data.name}_ping`];

            const lootCratesSpawnedEmbed = new EmbedBuilder()
                .setColor(discordEmbedDetails.color.purple)
                .setTitle('LOOT CRATES SPAWNED')
                .setThumbnail(discordEmbedDetails.thumbnail.minecraft_chest_block)
                .setTimestamp()
                .setFooter(discordEmbedDetails.footer);

            if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID) != undefined) {
                if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('ViewChannel') == true) {
                    if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('SendMessages') == true) {
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ content: `|| <@&${lootCratesSpawnedPingRoleID}> ||`, embeds: [lootCratesSpawnedEmbed] });
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