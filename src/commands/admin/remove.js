const { SlashCommandBuilder } = require('@discordjs/builders');
const init = require('../../init-list');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Verwijder een rol van initiative.')

    .addStringOption(option => option
        .setName('naam')
        .setDescription('De naam van de character')
        .setRequired(true)),

    async execute(interaction, client) {
        let naam = interaction.options.getString('naam');
        await interaction.reply({content: init.remove(naam)});
        init.update();
    },
}