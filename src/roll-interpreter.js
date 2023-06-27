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
    const interpretedExpression = interpret(parsedExpression)[1];
    return unwrapExpression(interpretedExpression)
}

function unwrapExpression(expression) {
    if (typeof expression === 'number') {
        return expression
    } else if (expression instanceof Roll) {
        return expression.roll()
    }
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

// class Number {
//     constructor(value) {
//         this.amount = value
//     }
//
//     add(other) {
//         if (this instanceof Number && other instanceof Number) {
//             this.amount += other.amount
//         }
//     }
//
//     get() {
//         return this.amount
//     }
// }

class Roll {
    constructor(amount, max) {
        this.amount = amount
        this.max = max
        this.multiplier = 1
        this.modifier = 0
        this.advantage = 0
    }

    roll() {
        const result = (unwrapExpression(this.amount) * unwrapExpression(this.max) / 2) * unwrapExpression(this.multiplier) + unwrapExpression(this.modifier)
        this.amount = 1
        this.max = result
        this.multiplier = 1
        this.modifier = 0
        return result
    }
}

function interpretStatement(token, operand1, operand2) {
    if (typeof operand1 === 'number' && typeof operand2 === 'number') {
        return interpretNumbers(token, operand1, operand2);
    } else if (typeof operand1 === 'number' && operand2 instanceof Roll) {
        return interpretNumberRoll(token, operand1, operand2);
    } else if (operand1 === undefined || operand2 === undefined) {
        return 0 // It's a feature!
    }
    switch (token) {
        case 'unary-':
            operand2.multiplier = interpretStatement('unary-', 0, operand2.multiplier)
            return operand2;
        case 'unary+':
            return operand2;
        case '+':
            operand1.modifier = interpretStatement(token, operand1.modifier, operand2);
            return operand1
        case '-':
            operand1.modifier = interpretStatement(token, operand1.modifier, operand2);
            return operand1
        case '*':
            operand1.modifier = interpretStatement(token, operand1.modifier, operand2);
            operand1.multiplier = interpretStatement(token, operand1.multiplier, operand2);
            return operand1
        case '/':
            operand1.modifier = interpretStatement(token, operand1.modifier, operand2);
            operand1.multiplier = interpretStatement(token, operand1.multiplier, operand2);
            return operand1
        case 'd':
            return new Roll(operand1, operand2);
        case 'k':
            operand1.advantage = operand2;
            return operand1;
        case 'kl':
            operand1.advantage = interpretStatement('unary-', 0, operand2);
            return operand1
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
            return new Roll(number1, number2);
        case 'k':
            return number1;
        case 'kl':
            return -number1;
    }
}

function interpretNumberRoll(token, number, roll) {
    switch (token) {
        case 'unary-':
            roll.multiplier = interpretStatement('unary-', 0, roll.multiplier)
            return roll;
        case 'unary+':
            return number;
        case '+':
            roll.modifier = interpretStatement(token, roll.modifier, number);
            return roll
        case '-':
            roll.modifier = interpretStatement('+', roll.modifier, number)
            roll.multiplier = interpretStatement('unary-', 0, roll.multiplier)
            return roll;
        case '*':
            roll.modifier = interpretStatement(token, roll.modifier, number);
            roll.multiplier = interpretStatement(token, roll.multiplier, number);
            return roll
        case '/':
            roll.modifier = interpretStatement(token, roll.modifier, number);
            roll.multiplier = interpretStatement(token, roll.multiplier, number);
            return roll
        case 'd':
            return new Roll(roll, number);
        case 'k':
            roll.advantage = number;
            return roll;
        case 'kl':
            roll.advantage = interpretStatement('unary-', 0, number);
            return roll
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