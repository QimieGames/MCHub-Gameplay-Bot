const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'giveaway_winners'
    },
    async execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, chatMessageDiscordChannelID, chatMessageDiscordChannelName, rawChatMessage, chatMessageForConsole, chatMessageForDiscord, chatMessageRegex) {

        const logToConsoleString = String(configValues.feature[`log_${this.data.name}_to_console`]).toLowerCase();

        const logToDiscordString = String(configValues.feature[`log_${this.data.name}_to_discord`]).toLowerCase();

        if (logToConsoleString == 'true') {
            console.log(chatMessageForConsole);
        }
        if (logToDiscordString == 'true') {

            const giveawayWinnersPingRoleID = configValues.discord_role_id[`${this.data.name}_ping`];

            const giveawayWinnersDetails = String(rawChatMessage).match(chatMessageRegex);

            const giveawayWinnersIGN = giveawayWinnersDetails[5].split(', ');

            let giveawayWinnersEmbedDescription = `Date: ${giveawayWinnersDetails[4]}-${giveawayWinnersDetails[3]}-${giveawayWinnersDetails[2]}\n\n`;

            giveawayWinnersIGN.forEach((giveawayWinnerIGN) => {

                giveawayWinnersEmbedDescription = giveawayWinnersEmbedDescription + `Winner #${giveawayWinnersIGN.indexOf(giveawayWinnerIGN) + 1}: ${giveawayWinnerIGN.replace(RegExp(/[\_]/, 'g'), '\\_')}\n`;

            });

            const giveawayWinnersEmbed = new EmbedBuilder()
                .setColor(discordEmbedDetails.color.purple)
                .setTitle(`${giveawayWinnersDetails[1].toUpperCase()} GIVEAWAY WINNERS`)
                .setDescription(giveawayWinnersEmbedDescription)
                .setThumbnail(discordEmbedDetails.thumbnail.emoji_tada)
                .setTimestamp()
                .setFooter(discordEmbedDetails.footer);

            if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID) != undefined) {
                if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('ViewChannel') == true) {
                    if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('SendMessages') == true) {
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ content: `|| <@&${giveawayWinnersPingRoleID}> ||`, embeds: [giveawayWinnersEmbed] });
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