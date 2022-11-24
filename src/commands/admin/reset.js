const { SlashCommandBuilder } = require('@discordjs/builders');
const init = require('../../init-list');

// Als er een oude initiative in de chat staat, kun je deze snel toevoegen met dit commando
// Voorbeeld input:
// Initiative gestart: Doolan: 20 Rivian: 20 lair: 20 Bob: 16 Stormspawn: 9 Heldras: 9 Tacetti: 6 capuel: 5 Riza: 2
module.exports = {
    data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Gebruik een oude initiative lijst')

    .addStringOption(option => option
        .setName('oud')
        .setDescription('Je kunt gewoone een compleet bericht uit #initiative hierin plakken')
        .setRequired(true)),

    async execute(interaction, client) {
    
        if (!init.isFresh()) {
            await interaction.reply({content: "**Pas op!**\nJe bent nu rolls aan een oude initiative aan het toevoegen. Je kunt een nieuwe initiative maken met !new"});
        }
        let naam = interaction.options.getString('oud').replace(/ +(?= )/g,''); // Dubbele spaties veranderen in enkele spaties
        const oldInits = naam.split(" ");
        for (let i = 2; i < oldInits.length; i++) {
            let naam = oldInits[i];
            let j = i + 1;
            while(j < oldInits.length && !Number.isInteger(Number(oldInits[j]))) {
                naam += " " + oldInits[j];
                j++;
            }
            const rol = parseInt(oldInits[j]);
            naam = naam.slice(0, -1);
            console.log("naam " + naam);
            console.log("rol " + rol);
            init.custom(0 - i, rol + i, naam);
            i = j;
        }

        await interaction.reply({content: "Oude initiative gestuurd!"});
        init.update();
    },
}
