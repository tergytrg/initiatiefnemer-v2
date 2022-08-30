const { SlashCommandBuilder } = require('@discordjs/builders');
const init = require('.../init-list.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('new')
    .setDescription('Maakt een nieuwe initiative.'),
    async execute(interaction, client) {
        await interaction.reply({content: "Initiative gestart!"});
        init.new();
    },
}