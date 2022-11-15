const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_loot_crates'
    },
    async execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, chatMessageDiscordChannelID, chatMessageDiscordChannelName, rawChatMessage, chatMessageForConsole, chatMessageForDiscord, chatMessageRegex) {

        const logToConsoleString = String(configValues.feature[`log_${this.data.name}_to_console`]).toLowerCase();

        const logToDiscordString = String(configValues.feature[`log_${this.data.name}_to_discord`]).toLowerCase();

        if (logToConsoleString == 'true') {
            console.log(chatMessageForConsole);
        }
        if (logToDiscordString == 'true') {

            const upcomingLootCratesPingRoleID = configValues.discord_role_id[`${this.data.name}_ping`];

            const upcomingLootCratesDetails = String(rawChatMessage).match(chatMessageRegex);

            const upcomingLootCratesEmbedDescription = `Time Left: ${upcomingLootCratesDetails[1]}`;

            const upcomingLootCratesEmbed = new EmbedBuilder()
                .setColor(discordEmbedDetails.color.purple)
                .setTitle('UPCOMING LOOT CRATES')
                .setDescription(upcomingLootCratesEmbedDescription)
                .setThumbnail(discordEmbedDetails.thumbnail.minecraft_chest_block)
                .setTimestamp()
                .setFooter(discordEmbedDetails.footer);

            const tagOnAlertRegex = RegExp(/^[0-9]{1,1} minutes|^[0-9]{2,2} seconds/);

            const ignoreAlertRegex = RegExp(/^[0-9]{1,1} seconds|^[0-9]{1,1} second/);

            if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID) != undefined) {
                if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('ViewChannel') == true) {
                    if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('SendMessages') == true) {
                        if (tagOnAlertRegex.test(upcomingLootCratesDetails[1]) == true) {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ content: `|| <@&${upcomingLootCratesPingRoleID}> ||`, embeds: [upcomingLootCratesEmbed] });
                        } else {
                            if (ignoreAlertRegex.test(upcomingLootCratesDetails[1]) != true) {
                                await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ embeds: [upcomingLootCratesEmbed] });
                            }
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