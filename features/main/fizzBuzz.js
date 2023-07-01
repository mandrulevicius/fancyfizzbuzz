'use strict';

// NOT PURE, CALLS ANOTHER FUNCTION THAT IS NOT PASSED THROUGH PARAMS
function solveFizzBuzz(size, div1, div2) {
  const outputList = [];
  for (let i = 1; i <= size; i++) outputList.push(toFizzBuzz(i, div1, div2));
  return outputList;
}

function toFizzBuzz(number, div1, div2) {
  const isDivisible1 = (number % div1 === 0);
  const isDivisible2 = (number % div2 === 0);
  const isDivisibleBoth = isDivisible1 && isDivisible2;
  // todo - less garbage collection? find out if primitive function vars are actually relevant for GC
  // todo - branchless
  if (isDivisibleBoth) return 'FizzBuzz';
  if (isDivisible1) return 'Fizz';
  if (isDivisible2) return 'Buzz';
  return number.toString();
}

export { solveFizzBuzz, toFizzBuzz };