const initList = []; // Het hart van deze bot: De lijst met initiatives
let initMsg;
let initChannel;
let lastUpdated = Date.now();

function Inititative(total, bonus, name) { // Init constructor
    this.total = total;
    this.bonus = bonus;
    this.name = name;
}

Inititative.prototype.toString = function() {
    return this.name + ": \`" + this.total + "\`";
}

function setChannel(channel) {
    initChannel = channel;
}

function containsName(name) {
    for (let i = 0; i < initList.length; i++) {
        if (initList[i].name === name) {
            return true;
        }
    }
    return false;
}

/**
Voegt de roll toe aan de lijst en maakt het bericht om terug te sturen.
*/
function init(bonus, advantage, naam) {
    const rollList = rollInit(bonus, advantage, naam);
    let initiative = rollList[0];
    let stringOutput = initiative.name + " heeft gerold:\n \`[" + (initiative.total - initiative.bonus);
    if (rollList.length > 1) {
        stringOutput += ", " + (rollList[1].total - rollList[1].bonus);
        if (rollList[1].total > rollList[0].total) {
            initiative = rollList[1];
        }
    }
    if (!insertInitiative(initiative)) {
        return "Er bestaat al een initiative met de naam: " + initiative.name;
    }
    stringOutput += "]\` Resultaat: " + initiative.total;
    return stringOutput;
}

/**
Gebruikt insertion sort om een Initiative op de goede plek toe te voegen aan de lijst.
Als de roll een gelijke totale score heeft, wordt er op bonus gesorteerd.
*/
function insertInitiative(initiative) {
    if (containsName(initiative.name)) {
        return false;
    }
    if (initList.length === 0) {
        initList[0] = initiative;
        return true;
    }
    let i = 0;
    while (
        i < initList.length &&
        initiative.total <= initList[i].total &&
        (initiative.total < initList[i].total || initiative.bonus < initList[i].bonus)) {
        i++;
    }
    initList.splice(i, 0, initiative);
    return true;
}

/**
Genereert wilekeurig de uitkomst en geeft vervolgens een lijst van Initiative.
*/
function rollInit(bonus, advantage, name) {
    const roll = Math.ceil(Math.random() * 20) + bonus;
    const rollList = [];
    rollList.push(new Inititative(roll, bonus, name));
    if (advantage) {
        const secondRoll = Math.ceil(Math.random() * 20) + bonus;
        rollList.push(new Inititative(secondRoll, bonus, name));
    }
    return rollList;
}

/**
Voor het toevoegen van zelfgekozen rolls.
*/
function custom(bonus, rol, naam) {
    if (!insertInitiative(new Inititative(rol + bonus, bonus, naam))) {
        return "Er bestaat al een initiative met de naam: " + naam;
    }
    return "Custom rol toegevoegd voor " + naam + ": \`[" + rol + "]`\ Resultaat: " + (rol + bonus);
}

/**
Voor het toevoegen van zelfgekozen rolls.
*/
function remove(naam) {
    if (!containsName(naam)) {
        return "Ik kan geen initiative vinden met de naam: " + naam;
    }
    i = 0;
    while (initList[i].name !== naam) {
        i++;
    }
    initList.splice(i, 1);
    return naam + " succesvol verwijderd van de initiative!";
}

/**
Updatet het bericht met de complete lijst.
*/
async function update() {
    lastUpdated = Date.now();
    let resString = "**__Initiative gestart:__**";
    for (let i = 0; i < initList.length; i++) {
        resString += "\n" + initList[i].toString();
    }
    try {
        initMsg.edit(resString);
    } catch (error) {
        initMsg = await initChannel.send(resString);
    }
}

/**
Maakt een nieuwe lijst.
*/
async function newInit() {
    initMsg = await initChannel.send("**__Nieuwe Initiative gestart!__**");
    initList.length = 0;
    lastUpdated = 0;
}

function isFresh() {
    return Date.now() - lastUpdated < 1800000 || lastUpdated === 0;
}

module.exports = {
    isFresh: isFresh,
    setChannel: setChannel,
    roll: init,
    update: update,
    new: newInit,
    custom: custom,
    remove: remove
};