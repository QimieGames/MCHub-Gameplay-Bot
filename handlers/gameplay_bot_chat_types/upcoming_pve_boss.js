const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'upcoming_pve_boss'
    },
    async execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, chatMessageDiscordChannelID, chatMessageDiscordChannelName, rawChatMessage, chatMessageForConsole, chatMessageForDiscord, chatMessageRegex) {

        const logToConsoleString = String(configValues.feature[`log_${this.data.name}_to_console`]).toLowerCase();

        const logToDiscordString = String(configValues.feature[`log_${this.data.name}_to_discord`]).toLowerCase();

        if (logToConsoleString == 'true') {
            console.log(chatMessageForConsole);
        }
        if (logToDiscordString == 'true') {

            const upcomingPVEBossPingRoleID = configValues.discord_role_id[`${this.data.name}_ping`];

            const realmName = String(configValues.gameplay_bot.realm_name).toLowerCase();

            const upcomingPVEBossEmbed = new EmbedBuilder()
                .setColor(discordEmbedDetails.color.purple)
                .setTitle('UPCOMING PVE BOSS')
                .setThumbnail(discordEmbedDetails.thumbnail.mchub_logo)
                .setTimestamp()
                .setFooter(discordEmbedDetails.footer);

            const upcomingPVEBossDetails = String(rawChatMessage).match(chatMessageRegex);

            let ignoreAlert, tagOnAlert;

            switch (realmName) {
                case 'atlantic':

                    ignoreAlert = false;

                    upcomingPVEBossEmbed.setDescription(`Mob Kill(s) Left: ${upcomingPVEBossDetails[1]}`);

                    if (Number(upcomingPVEBossDetails[1]) <= 100) {

                        tagOnAlert = true;

                    } else {

                        tagOnAlert = false;

                    }
                    break;
                case 'sun':
                    if (upcomingPVEBossDetails[1] == '0 seconds') {

                        ignoreAlert = true;

                    } else {

                        ignoreAlert = false;

                        upcomingPVEBossEmbed.setDescription(`Time Left: ${upcomingPVEBossDetails[1]}`);

                        const tagOnAlertRegex = RegExp(/^10 minutes|^[0-9]{1,1} minutes|^[0-9]{1,2} seconds|^1 second/);

                        if (tagOnAlertRegex.test(upcomingPVEBossDetails[1]) == true) {

                            tagOnAlert = true;

                        } else {

                            tagOnAlert = false;

                        }
                    }
                    break;
            }
            if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID) != undefined) {
                if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('ViewChannel') == true) {
                    if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('SendMessages') == true) {
                        if (ignoreAlert == false) {
                            if (tagOnAlert == true) {
                                await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ content: `|| <@&${upcomingPVEBossPingRoleID}> ||`, embeds: [upcomingPVEBossEmbed] });
                            } else {
                                await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ embeds: [upcomingPVEBossEmbed] });
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