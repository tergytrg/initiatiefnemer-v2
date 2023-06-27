const sut = require('../src/roll-interpreter.js');

const tests = [
    { expression: '-2*-3', expected: 6 },
    { expression: '1+2', expected: 3 },
    { expression: '2*3+4', expected: 10 },
    { expression: '4-2/2', expected: 3 },
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
    { expression: '1+-2*(3-4/2)', expected: -1 },
    { expression: '0+0', expected: 0 },
    { expression: '0*5-0/10', expected: 0 },
    { expression: '0+(0*0)', expected: 0 },
    { expression: '0*(0+(0-0))', expected: 0 },
    { expression: '1d20', expected: 10 },
    { expression: '3d6', expected: 9 },
    { expression: '10d2', expected: 10 },
    { expression: '2d4+1', expected: 5 },
    { expression: '2*(1d10+3)', expected: 16 },
    { expression: '(2d6+1)*3', expected: 21 },
    { expression: '2*(1d10+3)', expected: 16 },
    { expression: '(2d6+1)*3', expected: 21 },
    { expression: '4d8', expected: 16 },
    { expression: '5d4-2', expected: 8 },
    { expression: '6d3+2d6', expected: 15 },
    { expression: '2d10*3', expected: 30 },
    { expression: '(1d6+2d4)*2', expected: 14 },
    { expression: '2d8-1d4', expected: 6 },
    { expression: '2d6/3', expected: 2 },
    { expression: '3d4+2d4-1', expected: 9 },
    { expression: 'd20d20d20', expected: 1000 }
];

let number_passed = 0
let number_failed = 0

tests.forEach(({ expression, expected }) => {
    console.log(`Expression: ${expression}`);
    console.log(`Expect: ${expected}`);
    const result = sut.evaluateWord(expression);
    console.log(`Result: ${result}`);
    if (result === expected) {
        console.log('\x1b[1m\x1b[32m%s\x1b[0m', 'Passed')
        number_passed += 1
    } else {
        console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Failed')
        number_failed += 1
    }
    console.log('---');
});

if (number_failed === 0) {
    const output = `Passed ${number_passed}/${number_passed} tests`
    const color = '\x1b[1m\x1b[32m%s\x1b[0m'
    console.log(color, '♥'.repeat(output.length))
    console.log(color, output)
    console.log(color, '♥'.repeat(output.length))
} else {
    const output = `Passed ${number_passed}/${number_passed + number_failed} tests`
    const color = '\x1b[1m\x1b[31m%s\x1b[0m'
    console.log(color, '!'.repeat(output.length))
    console.log(color, output)
    console.log(color, '!'.repeat(output.length))
}