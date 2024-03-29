const { SlashCommandBuilder } = require('@discordjs/builders');
const init = require('../../init-list');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('init')
    .setDescription('Maakt een initiative roll.')

    .addStringOption(option => option
        .setName('naam')
        .setDescription('De naam van de character')
        .setRequired(true))
    
    .addIntegerOption(option => option
        .setName('bonus')
        .setDescription('De bonus die de character heeft op initiative'))

    .addBooleanOption(option => option
        .setName('advantage')
        .setDescription('Of de character advantage heeft op initiative')),

    async execute(interaction, client) {
        let naam = interaction.options.getString('naam');
        let bonus = interaction.options.getInteger('bonus');
        if (!bonus) {
            bonus = 0;
        }
        let advantage = interaction.options.getBoolean('advantage');
        if (!init.isFresh()) {
            await interaction.reply({content: init.roll(bonus, advantage, naam) + "\n**Pas op, oude initiative!**. Je kunt een nieuwe initiative maken met /new"});
        } else {
            await interaction.reply({content: init.roll(bonus, advantage, naam)});
        }
        await init.update();
    },
}