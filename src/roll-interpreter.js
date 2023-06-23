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
                tokens[i] += 'u'
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
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        'd': 3,
        'k': 4,
        'kl': 4,
        '-u': 5,
        '+u': 5
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
    let k = 0;
    let kl = 0;
    parsedExpression.forEach(token => {
        if (typeof token === 'number') {
            stack.push(token);
        } else {
            const operand2 = stack.pop();
            const operand1 = stack.pop();
            let result;

            switch (token) {
                case '+':
                    result = operand1 + operand2;
                    break;
                case '-':
                    result = operand1 - operand2;
                    break;
                case '*':
                    result = operand1 * operand2;
                    break;
                case '/':
                    result = operand1 / operand2;
                    break;
                case 'd':
                    const rolls = roll_dice(operand1, operand2)
                    rollsList.push(rolls)
                    result = 0
                    rolls.forEach(roll => {
                        result += roll
                    })
                    break;
                case 'k':
                    result = operand1
                    k = operand2
                    break;
                case 'kl':
                    result = operand1
                    kl = operand2
                    break;
                case '-u':
                    stack.push(operand1)
                    result = 0 - operand2
                    break;
                case '+u':
                    stack.push(operand1)
                    result = operand2
            }

            stack.push(result);
        }
    });
    return [rollsList, stack.pop()]
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