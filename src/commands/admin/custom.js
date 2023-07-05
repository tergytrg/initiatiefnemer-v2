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
        let naam = interaction.options.getString('naam');
        let bonus = interaction.options.getInteger('bonus');
        if (!bonus) {
            bonus = 0;
        }
        let rol = interaction.options.getInteger('rol');
        if (!init.isFresh()) {
            await interaction.reply({content: init.custom(bonus, rol, naam) + "\n**Pas op, oude initiative!**. Je kunt een nieuwe initiative maken met /new"});
        } else {
            await interaction.reply({content: init.custom(bonus, rol, naam)});
        }
        await init.update();
    },
}