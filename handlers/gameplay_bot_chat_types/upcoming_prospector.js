const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_prospector'
    },
    async execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, chatMessageDiscordChannelID, chatMessageDiscordChannelName, rawChatMessage, chatMessageForConsole, chatMessageForDiscord, chatMessageRegex) {

        const logToConsoleString = String(configValues.feature[`log_${this.data.name}_to_console`]).toLowerCase();

        const logToDiscordString = String(configValues.feature[`log_${this.data.name}_to_discord`]).toLowerCase();

        if (logToConsoleString == 'true') {
            console.log(chatMessageForConsole);
        }
        if (logToDiscordString == 'true') {

            const upcomingProspectorPingRoleID = configValues.discord_role_id[`${this.data.name}_ping`];

            const upcomingProspectorDetails = String(rawChatMessage).match(chatMessageRegex);

            const upcomingProspectorEmbedDescription = `Time: ${upcomingProspectorDetails[1]}`;

            const upcomingProspectorEmbed = new EmbedBuilder()
                .setColor(discordEmbedDetails.color.purple)
                .setTitle('LAST PROSPECTOR PROC')
                .setDescription(upcomingProspectorEmbedDescription)
                .setThumbnail(discordEmbedDetails.thumbnail.minecraft_emerald)
                .setTimestamp()
                .setFooter(discordEmbedDetails.footer);

            const tagOnAlertRegex = RegExp(/^([0-9]{2,2})m/);

            let tagOnAlert;

            if (tagOnAlertRegex.test(upcomingProspectorDetails[1]) == true) {
                if (Number(upcomingProspectorDetails[1].match(tagOnAlertRegex)[1]) >= 45) {

                    tagOnAlert = true;

                } else {

                    tagOnAlert = false;

                }
            } else {

                tagOnAlert = false;

            }
            if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID) != undefined) {
                if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('ViewChannel') == true) {
                    if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('SendMessages') == true) {
                        if (tagOnAlert == true) {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ content: `|| <@&${upcomingProspectorPingRoleID}> ||`, embeds: [upcomingProspectorEmbed] });
                        } else {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ embeds: [upcomingProspectorEmbed] });
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