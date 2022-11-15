const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'pve_boss_spawned'
    },
    async execute(discordBot, configValues, guildID, clientID, discordEmbedDetails, chatMessageDiscordChannelID, chatMessageDiscordChannelName, rawChatMessage, chatMessageForConsole, chatMessageForDiscord, chatMessageRegex) {

        const logToConsoleString = String(configValues.feature[`log_${this.data.name}_to_console`]).toLowerCase();

        const logToDiscordString = String(configValues.feature[`log_${this.data.name}_to_discord`]).toLowerCase();

        if (logToConsoleString == 'true') {
            console.log(chatMessageForConsole);
        }
        if (logToDiscordString == 'true') {

            const pveBossSpawnedPingRoleID = configValues.discord_role_id[`${this.data.name}_ping`];

            const realmName = String(configValues.gameplay_bot.realm_name).toLowerCase();

            const pveBossSpawnedEmbed = new EmbedBuilder()
                .setColor(discordEmbedDetails.color.purple)
                .setTitle('PVE BOSS SPAWNED')
                .setTimestamp()
                .setFooter(discordEmbedDetails.footer);

            switch (realmName) {
                case 'atlantic':

                    const pveBossSpawnedDetails = String(rawChatMessage).match(chatMessageRegex);

                    pveBossSpawnedEmbed.setDescription(`Type: ${pveBossSpawnedDetails[1].toUpperCase()}\n` + `Name: ${pveBossSpawnedDetails[2]}`);

                    switch (pveBossSpawnedDetails[2]) {
                        default:

                            pveBossSpawnedEmbed.setThumbnail(discordEmbedDetails.thumbnail.mchub_logo);

                            break;
                        case 'Estranged Witch':

                            pveBossSpawnedEmbed.setThumbnail(discordEmbedDetails.thumbnail.minecraft_witch_head);

                            break;
                        case 'Explodey Creeper':

                            pveBossSpawnedEmbed.setThumbnail(discordEmbedDetails.thumbnail.minecraft_creeper_head);

                            break;
                        case 'Iron Enforcer':

                            pveBossSpawnedEmbed.setThumbnail(discordEmbedDetails.thumbnail.minecraft_iron_golem_head);

                            break;
                        case 'Oxar The Wizard':

                            pveBossSpawnedEmbed.setThumbnail(discordEmbedDetails.thumbnail.minecraft_evoker_head);

                            break;
                    }
                    break;
                case 'sun':

                    pveBossSpawnedEmbed.setThumbnail(discordEmbedDetails.thumbnail.mchub_logo);

                    break;
            }
            if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID) != undefined) {
                if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('ViewChannel') == true) {
                    if (discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).permissionsFor(clientID).has('SendMessages') == true) {
                        await discordBot.guilds.cache.get(guildID).channels.cache.get(chatMessageDiscordChannelID).send({ content: `|| <@&${pveBossSpawnedPingRoleID}> ||`, embeds: [pveBossSpawnedEmbed] });
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