const { SlashCommandBuilder } = require('@discordjs/builders');
const init = require('../../init-list');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('custom')
    .setDescription('Voeg handmatig een custom rol toe aan initiative.')

    .addStringOption(option => option
        .setName('naam')
        .setDescription('De naam van de character')
        .setRequired(true))

    .addIntegerOption(option => option
        .setName('rol')
        .setDescription('Hoe hoog gerold is, zonder bonus')
        .setRequired(true))
    
    .addIntegerOption(option => option
        .setName('bonus')
        .setDescription('De bonus die de character heeft op initiative')),

    async execute(interaction, client) {
    
        if (!init.isFresh()) {
            await interaction.reply({content: "**Pas op!**\nJe bent nu rolls aan een oude initiative aan het toevoegen. Je kunt een nieuwe initiative maken met !new"});
        }

        let naam = interaction.options.getString('naam');

        let bonus = interaction.options.getInteger('bonus');
        if (!bonus) {
            bonus = 0;
        }

        let rol = interaction.options.getInteger('rol');

        await interaction.reply({content: init.custom(bonus, rol, naam)});
        init.update();
    },
}