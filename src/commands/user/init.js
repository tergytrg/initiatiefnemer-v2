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
    
        if (!init.isFresh()) {
            msg.channel.send("**Pas op!**\nJe bent nu rolls aan een oude initiative aan het toevoegen. Je kunt een nieuwe initiative maken met !new");
        }

        let naam = interaction.options.getString('naam');

        let bonus = interaction.options.getInteger('bonus');
        if (!bonus) {
            bonus = 0;
        }

        let advantage = interaction.options.getBoolean('advantage');

        await interaction.reply({content: init.roll(bonus, advantage, naam)});
        init.update();
    },
}