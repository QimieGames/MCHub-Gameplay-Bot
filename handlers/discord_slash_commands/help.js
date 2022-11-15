const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows Commands List.')
        .setDMPermission(false),
    async execute(interactionDetails, interactionResultDetails, discordEmbedDetails, discordSlashCommandHandlers) {

        interactionResultDetails.fullCommand = `/${interactionDetails.commandName}`;

        let helpEmbedDescription = '';

        discordSlashCommandHandlers.forEach((discordSlashCommandHandler) => {

            helpEmbedDescription = helpEmbedDescription + `Command: /${discordSlashCommandHandler.data.name}\n` + `Description: ${discordSlashCommandHandler.data.description}\n\n`;

        });

        const helpEmbed = new EmbedBuilder()
            .setColor(discordEmbedDetails.color.purple)
            .setTitle('COMMANDS')
            .setDescription(helpEmbedDescription)
            .setThumbnail(discordEmbedDetails.thumbnail.mchub_logo)
            .setTimestamp()
            .setFooter(discordEmbedDetails.footer);

        await interactionDetails.editReply({ embeds: [helpEmbed] }).then(() => {

            interactionResultDetails.result = true;

        });
        return interactionResultDetails;
    }
};