const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'global_booster'
    },
    async execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, chatMessageDiscordChannelID, chatMessageDiscordChannelName, rawChatMessage, chatMessageForConsole, chatMessageForDiscord, chatMessageRegex) {

        const logToConsoleString = String(configValues.feature[`log_${this.data.name}_to_console`]).toLowerCase();

        const logToDiscordString = String(configValues.feature[`log_${this.data.name}_to_discord`]).toLowerCase();

        if (logToConsoleString == 'true') {
            console.log(chatMessageForConsole);
        }
        if (logToDiscordString == 'true') {

            const globalBoosterPingRoleID = configValues.discord_role_id[`${this.data.name}_ping`];

            const globalBoosterDetails = String(rawChatMessage).match(chatMessageRegex);

            const globalBoosterEmbedDescription = `IGN: ${globalBoosterDetails[1].replace(RegExp(/[\_]/, 'g'), '\\_')}\n` + `Rarity: ${globalBoosterDetails[2]}\n` + `Type: ${globalBoosterDetails[3]}\n` + `Duration: ${globalBoosterDetails[4]}`;

            const tagOnAlertRegex = RegExp(/^[0-9]+ hours|^[0-9]{1,1} hour|^[0-9]{2,2} minutes/);

            const globalBoosterEmbed = new EmbedBuilder()
                .setColor(discordEmbedDetails.color.purple)
                .setTitle('GLOBAL BOOSTER ACTIVATED')
                .setDescription(globalBoosterEmbedDescription)
                .setTimestamp()
                .setFooter(discordEmbedDetails.footer);

            let tagOnAlert;

            switch (globalBoosterDetails[3]) {
                default:

                    globalBoosterEmbed.setThumbnail(discordEmbedDetails.thumbnail.mchub_logo);

                    tagOnAlert = false;

                    break;
                case 'Proc Rate':

                    globalBoosterEmbed.setThumbnail(discordEmbedDetails.thumbnail.minecraft_diamond_pickaxe);

                    if (tagOnAlertRegex.test(globalBoosterDetails[4]) == true) {

                        tagOnAlert = true;

                    } else {

                        tagOnAlert = false;

                    }
                    break;
                case 'E-Token':

                    globalBoosterEmbed.setThumbnail(discordEmbedDetails.thumbnail.minecraft_magma_cream);

                    if (tagOnAlertRegex.test(globalBoosterDetails[4]) == true) {

                        tagOnAlert = true;

                    } else {

                        tagOnAlert = false;

                    }
                    break;
                case 'Lucky':

                    globalBoosterEmbed.setThumbnail(discordEmbedDetails.thumbnail.minecraft_gold_block);

                    tagOnAlert = false;

                    break;
                case 'Quarry':

                    globalBoosterEmbed.setThumbnail(discordEmbedDetails.thumbnail.minecraft_shulker);

                    tagOnAlert = false;

                    break;
            }
            if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID) != undefined) {
                if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('ViewChannel') == true) {
                    if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('SendMessages') == true) {
                        if (tagOnAlert == true) {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ content: `|| <@&${globalBoosterPingRoleID}> ||`, embeds: [globalBoosterEmbed] });
                        } else {
                            await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ embeds: [globalBoosterEmbed] });
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