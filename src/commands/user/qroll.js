const { SlashCommandBuilder } = require('@discordjs/builders');
const roller = require('../../roll-interpreter');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('qroll')
    .setDescription('Rol dobbelstenen.')

    .addStringOption(option => option
        .setName('arguments')
        .setDescription('/qroll 1d20+5')
        .setRequired(false)),
    async execute(interaction, client) {
        const args = interaction.options.getString('arguments')
        const result = interaction.member.displayName + " heeft gerold: " + roller.interpret_and_roll(args)
        await interaction.reply({content: result});
    },
}