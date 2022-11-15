const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_bloodbath'
    },
    async execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, chatMessageDiscordChannelID, chatMessageDiscordChannelName, rawChatMessage, chatMessageForConsole, chatMessageForDiscord, chatMessageRegex) {

        const logToConsoleString = String(configValues.feature[`log_${this.data.name}_to_console`]).toLowerCase();

        const logToDiscordString = String(configValues.feature[`log_${this.data.name}_to_discord`]).toLowerCase();

        if (logToConsoleString == 'true') {
            console.log(chatMessageForConsole);
        }
        if (logToDiscordString == 'true') {

            const upcomingBloodbathPingRoleID = configValues.discord_role_id[`${this.data.name}_ping`];

            const upcomingBloodbathDetails = String(rawChatMessage).match(chatMessageRegex);

            const upcomingBloodbathEmbedDescription = `Time Left: ${upcomingBloodbathDetails[1]}`;

            const upcomingBloodbathEmbed = new EmbedBuilder()
                .setColor(discordEmbedDetails.color.purple)
                .setTitle('UPCOMING BLOODBATH')
                .setDescription(upcomingBloodbathEmbedDescription)
                .setThumbnail(discordEmbedDetails.thumbnail.emoji_crossed_swords)
                .setTimestamp()
                .setFooter(discordEmbedDetails.footer);

            const tagOnAlertRegex = RegExp(/^1 hour|^[0-9]{1,2} minutes|^1 minute|^[0-9]{2,2} seconds/);

            if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID) != undefined) {
                if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('ViewChannel') == true) {
                    if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('SendMessages') == true) {
                        if (tagOnAlertRegex.test(upcomingBloodbathDetails[1]) == true) {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ content: `|| <@&${upcomingBloodbathPingRoleID}> ||`, embeds: [upcomingBloodbathEmbed] });
                        } else {
                            if (upcomingBloodbathDetails[1] != '0 seconds') {
                                await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ embeds: [upcomingBloodbathEmbed] });
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