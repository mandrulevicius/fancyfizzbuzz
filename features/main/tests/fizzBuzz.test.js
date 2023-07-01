"use strict";

const tests = {};

tests.solveFizzBuzz = [{ args: [16, 3, 5], expectedResult: [
  '1', '2', 'Fizz', '4', 'Buzz',
  'Fizz', '7', '8', 'Fizz', 'Buzz',
  '11', 'Fizz', '13', '14', 'FizzBuzz',
  '16'
] }];

tests.toFizzBuzz = [
  { args: [1, 3, 5], expectedResult: '1' },
  { args: [2, 3, 5], expectedResult: '2' },
  { args: [3, 3, 5], expectedResult: 'Fizz' },
  { args: [4, 3, 5], expectedResult: '4' },
  { args: [5, 3, 5], expectedResult: 'Buzz' },
  { args: [6, 3, 5], expectedResult: 'Fizz' },
  { args: [15, 3, 5], expectedResult: 'FizzBuzz' },
  { args: [16, 3, 5], expectedResult: '16' },
];

export { tests };