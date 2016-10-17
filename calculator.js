let calculator = document.createElement('DIV');
let display = document.createElement('DIV');
let input = document.createElement('DIV');
let operatorPanel = document.createElement('DIV');
let controlPanel = document.createElement('DIV');

calculator.className = 'calculator';
display.className = "display";
input.className = 'input';
operatorPanel.className = 'operator-panel';
controlPanel.className = 'control-panel';

document.body.appendChild(calculator);
calculator.appendChild(display);
calculator.appendChild(input);
calculator.appendChild(operatorPanel);
calculator.appendChild(controlPanel);

let numbers = '123456789π0e';
let symbols = '.';
let operators = '\+,\-,ˆ,\*,\/,√,%,log,';
let special = 'x!,\=';
let controls = 'DEL,C,AC';
createButtons((numbers + symbols).split(''), input);
createButtons((operators + special).split(','), operatorPanel);
createButtons(controls.split(','), controlPanel);
function createButtons(arr, targetDiv) {
  arr.forEach(token => {
    let button = document.createElement("BUTTON");
    button.className = 'btn';
    button.setAttribute( "onclick", `calculate('${token}');`);
    button.innerHTML=token;
    targetDiv.appendChild(button);
  });
}

let operator = '';
let current = '';
let total = '';

window.calculate = function(n) {
  if(n === 'AC') { //all clear
    current = operator = total = '';
  } else if(n === 'C') { //clear 
    current = operator = '';
  } else if(n === 'DEL') { //backspace
    current = current.length > 0 ? current.slice(0, -1) : '';
  }  else if(n === '=') { //equals
    if(operator === '√') {
      current = '2';
    } else if(operator === 'log'){
      current = '10';
    }
    tally();
  } else if (n === 'x!') {
    x = +current;
    current = 1;
    for(let i = x; i > 1; i--) {
      current *= i;
    }
    total = '' + current;
    current = '';
  } else if (n === '.' && !current.match(/\./g)) { //point (only one allowed)
    current += current === '' ? '0.' : '.';
    checkOp();
  } else if(operators.includes(n)) { //operator
    if(total === '') {
      operator = n;
      if(current  !== '') {
        total = current[current.length - 1] === '.' ? current + '0' : current;
        current = '';
      } else {
        total = '0';
      }
    } else {
      if(current !== '') {
        tally();
      } else {
        if(operator === '√') {
          current = '2';
          tally();
        } else if(operator === 'log'){
          current = '10';
          tally();
        }
      }
      operator = n;
    }
  } else if(numbers.includes(n)) { //number
      if(n === 'e'){ 
        current = Math.E;
      } else if(n === 'π'){
        current = Math.PI;
      } else if(current === '0') {
        current = n;
      } else {
        current += n;
      }
      checkOp();
  }
  display.innerHTML= total !== '' ? 
    operator === '√' ? 
      `<sup>${current}</sup> ${operator} ${total}` 
      : operator === 'log' ? 
        `${operator}<sub>${current}</sub>${total}` 
        : `${total} ${operator} ${current}` 
    :`${current}`;
};

function tally () {
  if(current !== '') {
    if(total === '') {
      total = '0';
    } else {
      if(operator === '√')
        total = Math.pow(total, 1/current);
      else if(operator === 'ˆ')
        total = Math.pow(total, current);
      else if(operator === 'log')
        total = Math.log(total) / Math.log(current);
      else
        total = eval(total + operator + current);
    }
  }
  operator = current = '';
  total = '' + total;
}

function checkOp () {
  if(operator === '') {
    total = '';
  }
}