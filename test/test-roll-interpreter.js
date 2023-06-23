const sut = require('../src/roll-interpreter.js');

const tests = [
    { expression: '1+2', expected: 3 },
    { expression: '2*3+4', expected: 10 },
    { expression: '4-2/2', expected: 3 },
    { expression: '-2*-3', expected: 6 },
    { expression: '5+(-2)', expected: 3 },
    { expression: '-4*-(-2)', expected: -8 },
    { expression: '10/5*2', expected: 4 },
    { expression: '2*(3+4)', expected: 14 },
    { expression: '(-2)*(-3)', expected: 6 },
    { expression: '1+2*3', expected: 7 },
    { expression: '(1+2)*3', expected: 9 },
    { expression: '2*(3+4)/2', expected: 7 },
    { expression: '1+2*(3-4/2)', expected: 3 },
    { expression: '(((1+2)*3)-4)/2', expected: 2.5 },
    { expression: '(1+2)*(3+4)', expected: 21 },
    { expression: '1', expected: 1 },
    { expression: '5*-3', expected: -15 },
    { expression: '(5)(5)', expected: 25 },
    { expression: '-(-5)', expected: 5 },
    { expression: '-(-(-5))', expected: -5 },
    { expression: '---5', expected: -5 },
    { expression: '2*-3--4', expected: -2 },
    { expression: '-(5+3)*-2', expected: 16 },
    { expression: '2*-(3+4)', expected: -14 },
    { expression: '-2*(3+4)', expected: -14 },
    { expression: '-2*(3+4)/-2', expected: 7 },
    { expression: '1+-2*(3-4/2)', expected: -1 }
];

tests.forEach(({ expression, expected }) => {
    console.log(`Expression: ${expression}`);
    console.log(`Expected: ${expected}`);
    const result = sut.evaluateWord(expression)[1];
    console.log(`Result: ${result}`);
    console.log(`Test ${result === expected ? 'passed' : 'FAILED'}`);
    console.log('---');
});