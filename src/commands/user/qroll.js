const { SlashCommandBuilder } = require('@discordjs/builders');
const init = require('../../init-list');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('qinit')
    .setDescription('Maakt een initiative roll met een enkel vakje voor arguments.')

    .addStringOption(option => option
        .setName('arguments')
        .setDescription('/qinit <naam> <bonus> <k1>')
        .setRequired(false)),
    async execute(interaction, client) {

        let args = interaction.options.getString('arguments')
        if (args == null) {
            args = []
        } else {
            args = args.split(/ +/);
        }

        let bonus = 0;
        let naam = "";
        let advantage = false;

        while (args.length > 0) { // Alle args bijlangs gaan en kijken wat ze doen
            const arg = args.shift();
            if (arg == "k1") {
                advantage = true;
            } else if (isNaN(arg)) {
                naam += " " + arg;
            } else {
                bonus = parseInt(arg);
            }
        }

        if (naam === "") {
            naam = interaction.member.displayName; // Als er geen naam bij zit, wordt de stuurder genoemd.
        }

        if (!init.isFresh()) {
            await interaction.reply({content: init.roll(bonus, advantage, naam) + "\n**Pas op, oude initiative!**. Je kunt een nieuwe initiative maken met /new"});
        } else {
            await interaction.reply({content: init.roll(bonus, advantage, naam)});
        }
        
        init.update();
    },
}