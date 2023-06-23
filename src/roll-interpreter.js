function evaluateExpression(expression) {
    let result = ""
    expression.split(' ').forEach(word => {
        let tuple = evaluateWord(word)
        result += "\n" + evaluationToString(tuple[0], tuple[1])
    })
    return result
}

function evaluateWord(word) {
    const tokens = tokenize(word);
    if (tokens === null) {
        return word
    }
    const desugaredTokens = desugar(tokens)
    const parsedExpression = parse(desugaredTokens);
    return interpret(parsedExpression);
}

function tokenize(expression) {
    const regex = /\d+|\+|-|\*|\/|\(|\)|d|k|kl/g;
    return expression.toLowerCase().match(regex)
}

function desugar(tokens) {
    for (let i = 0; i < tokens.length; i++) {
        if (isNaN(tokens[i - 1]) && tokens[i - 1] !== ')') {
            if (tokens[i] === '-' || tokens[i] === '+') {
                tokens[i] = 'unary' + tokens[i]
            } else if (tokens[i] === 'd') {
                tokens.splice(i, 0, 1);
            }
        } else {
            if (tokens[i] === '(' || !isNaN(tokens[i])) {
                tokens.splice(i, 0, '*');
            }
        }
    }
    return tokens
}

function parse(tokens) {
    const precedence = {
        'k': 1,
        'kl': 1,
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        'd': 3,
        'unary-': 5,
        'unary+': 5
    };
    const output = [];
    const operatorStack = [];

    tokens.forEach(token => {
        if (!isNaN(token)) {
            output.push(parseFloat(token));
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                output.push(operatorStack.pop());
            }
            if (operatorStack.length === 0) {
                throw new Error('Volgens mij kloppen je haakjes niet.');
            }
            operatorStack.pop();
        } else {
            while (
                operatorStack.length > 0 &&
                operatorStack[operatorStack.length - 1] !== '(' &&
                precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
                ) {
                output.push(operatorStack.pop());
            }
            operatorStack.push(token);
        }
    });

    while (operatorStack.length > 0) {
        if (operatorStack[operatorStack.length - 1] === '(') {
            throw new Error('Volgens mij kloppen je haakjes niet.');
        }
        output.push(operatorStack.pop());
    }

    return output;
}

function interpret(parsedExpression) {
    const stack = [];
    const rollsList = [];
    parsedExpression.forEach(token => {
        if (typeof token === 'number' || token instanceof Roll) {
            stack.push(token);
        } else {
            let operand2 = stack.pop();
            let operand1 = stack.pop();
            if (token.startsWith('unary')) {
                if (operand1 !== undefined) {
                    stack.push(operand1)
                }
                operand1 = 0
            }
            stack.push(interpretStatement(token, operand1, operand2));
        }
    });
    return [rollsList, stack.pop()]
}

class Roll {
    constructor(amount, max) {
        this.amount = amount
        this.max = max
        this.multiplier = 1
        this.modifier = 0
        this.advantage = 0
    }
}

function interpretStatement(token, operand1, operand2) {
    switch (true) {
        case typeof operand1 === 'number' && typeof operand2 === 'number':
            return interpretNumbers(token, operand1, operand2);
        case typeof operand1 === 'number' && operand2 instanceof Roll:
            return interpretNumberRoll(token, operand1, operand2);
        case operand1 instanceof Roll && typeof operand2 === 'number':
            return interpretRollNumber(token, operand1, operand2);
        case operand1 instanceof Roll && operand2 instanceof Roll:
            return interpretRolls(token, operand1, operand2);
    }
}

function interpretNumbers(token, number1, number2) {
    switch (token) {
        case 'unary-':
            return -number2
        case 'unary+':
            return number2
        case '+':
            return number1 + number2;
        case '-':
            return number1 - number2;
        case '*':
            return number1 * number2;
        case '/':
            return number1 / number2;
        case 'd':
            return Roll.constructor(number1, number2);
        case 'k':
            return number1;
        case 'kl':
            return -number1;
    }
}

function interpretRollNumber(token, roll, number) {
    switch (token) {
        case 'unary-':
            return -number
        case 'unary+':
            return number
        case '+':
            roll.modifier += number;
            return roll;
        case '-':
            roll.modifier -= number;
            return roll;
        case '*':
            roll.multiplier *= number;
            return roll;
        case '/':
            roll.multiplier /= number;
            return roll;
        case 'd':
            return Roll.constructor(roll, number);
        case 'k':
            roll.advantage = number;
            return roll;
        case 'kl':
            roll.advantage = -number;
            return roll;
    }
}

function interpretNumberRoll(token, number, roll) {
    switch (token) {
        case 'unary-':
            roll.modifier *= -1;
            return roll
        case 'unary+':
            return roll
        case '+':
            roll.modifier += number;
            return roll;
        case '-':
            roll.modifier -= number;
            roll.multiplier *= -1
            return roll;
        case '*':
            roll.multiplier *= number;
            return roll;
        case '/': // Is this possible to do lazily?
            return roll;
        case 'd':
            return Roll.constructor(number, roll);
        case 'k':
            return number
        case 'kl':
            return -number
    }
}

function interpretRolls(token, roll1, roll2) {
    switch (token) {
        case 'unary-':
            roll2.modifier *= -1;
            return roll2;
        case 'unary+':
            return roll2;
        case '+':
            return interpretStatement(token, roll1.modifier, roll2);
        case '-':
            return interpretStatement(token, roll1.modifier, roll2);
        case '*':
            return interpretStatement(token, roll1.multiplier, roll2);
        case '/':
            return interpretStatement(token, roll1.multiplier, roll2);
        case 'd':
            return Roll.constructor(roll1, roll2);
        case 'k':
            roll1.advantage = roll2;
            return roll1;
        case 'kl':
            roll1.advantage = interpretStatement('unary-', 0, roll2);
            return roll1
    }
}

function roll_dice(amount, max) {
    if (amount < 0) {
        throw RangeError("Je kunt niet minder dan nul dobbelstenen rollen.")
    }
    const rolls = []
    for (let i = 0; i < amount; i++) {
        if (max > 0) {
            rolls.push(Math.ceil(Math.random() * max))
        } else {
            rolls.push(Math.floor(Math.random() * max))
        }
    }
    return rolls
}

function evaluationToString(rollsList, result) {
    let output = ""
    rollsList.forEach(list => {
        output += "[" + list.toString() + "]"
    })
    if (rollsList.length === 0) {
        output = "[]"
    }
    return "\`" + output + "\`" + " Resultaat: " + result
}

module.exports = {
    evaluateWord: evaluateWord,
    interpret_and_roll: evaluateExpression
};