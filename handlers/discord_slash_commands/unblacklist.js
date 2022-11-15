const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription('Unblacklist A Discord User From Using This Gameplay Bot. [Admin User Command]')
        .setDMPermission(false)
        .addStringOption((discordUserID) =>
            discordUserID.setName('discord-user-id')
                .setDescription("Discord User's ID.")
                .setRequired(true)
                .setMinLength(1)),
    async execute(interactionDetails, interactionResultDetails, configValues, guildID, discordBot) {

        const discordUserID = interactionDetails.options.getString('discord-user-id');

        interactionResultDetails.fullCommand = `/${interactionDetails.commandName} discord-user-id:${discordUserID}`;

        const interactionWhistelistedRolesID = [configValues.discord_role_id.admin];

        if (interactionDetails.member.roles.cache.some((discordUserRole) => interactionWhistelistedRolesID.includes(discordUserRole.id)) == true) {

            const discordUserIDRegex = RegExp(/^[0-9]+$/);

            if (discordUserIDRegex.test(discordUserID) == true) {

                const discordUser = await discordBot.guilds.cache.get(guildID).members.fetch(discordUserID).catch(() => {
                    return undefined;
                });

                if (discordUser != undefined) {

                    const gameplayBotBlacklistedRoleID = configValues.discord_role_id.blacklisted;

                    if (discordUser.roles.cache.has(gameplayBotBlacklistedRoleID) == true) {
                        if (discordBot.guilds.cache.get(guildID).members.me.permissions.has('ManageRoles', true) == true) {
                            await discordUser.roles.remove(gameplayBotBlacklistedRoleID).then(async () => {
                                await interactionDetails.editReply({ content: '```Unblacklisted ' + discordUser.displayName + ' from using this gameplay bot.```' }).then(() => {

                                    interactionResultDetails.result = true;

                                });
                            });
                        } else {
                            await interactionDetails.editReply({ content: '```This gameplay bot does not have the permission to manage roles!```' }).then(() => {

                                interactionResultDetails.result = false, interactionResultDetails.failedReason = 'Gameplay bot has insufficient permission!';

                            });
                        }
                    } else {
                        await interactionDetails.editReply({ content: '```This user is not blacklisted from using this gameplay bot!```' }).then(() => {

                            interactionResultDetails.result = false, interactionResultDetails.failedReason = 'User is not blacklisted from using this gameplay bot!';

                        });
                    }
                } else {
                    await interactionDetails.editReply({ content: '```Invalid discord user id!```' }).then(() => {

                        interactionResultDetails.result = false, interactionResultDetails.failedReason = 'Invalid discord user id!';

                    });
                }
            } else {
                await interactionDetails.editReply({ content: '```Invalid discord user id provided!```' }).then(() => {

                    interactionResultDetails.result = false, interactionResultDetails.failedReason = 'Invalid discord user id provided!';

                });
            }
        } else {
            await interactionDetails.editReply({ content: '```You are not allowed to run this command!```' }).then(() => {

                interactionResultDetails.result = false, interactionResultDetails.failedReason = 'User has insufficient permission!';

            });
        }
        return interactionResultDetails;
    }
};