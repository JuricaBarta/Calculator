const display = document.getElementById("result");
const numbers = document.querySelectorAll(".numbers");
const signs = document.querySelectorAll(".sign");
const equalsButton = document.getElementById("equals");
const decimalButton = document.querySelector("#decimal");
const percentButton = document.querySelector('.sign[value="%"]');
const calculator = document.querySelector(".calculator");
const powerButton = document.querySelector('.power');
let currentCalculation = "";
let hasDecimalPoint = false;
let isDisplayBlack = false;
let isCPressed = false;
let decimalSingKey = ','

function evaluateExpression(expression) {
  try {
    const result = Function('return ' + expression)();
    return Math.round(result * 10000) / 10000;
  } catch {
    return "Error";
  }
}

function updateDisplay() {
  display.innerHTML = currentCalculation;
}

function clearDisplay() {
  currentCalculation = "";
  updateDisplay();
}

function backspace() {
  currentCalculation = currentCalculation.slice(0, -1);
  updateDisplay();
}

function handleNumberPress(number) {
  currentCalculation += number;
  updateDisplay();
}

function handleDecimalPress() {
  if (!hasDecimalPoint) {
    currentCalculation += ".";
    hasDecimalPoint = true;
    updateDisplay();
  } else if (!currentCalculation.endsWith(".")) {
    const lastNum = getLastNum();
    if (lastNum.indexOf(".") === -1) {
      currentCalculation += ".";
      updateDisplay();
      hasDecimalPoint = true;
    }
  }
}

decimalButton.addEventListener("click", handleDecimalPress);

function handleOperatorPress(operator) {
  if (currentCalculation.endsWith(".") || 
      currentCalculation.endsWith("/") || 
      currentCalculation.endsWith("*") || 
      currentCalculation.endsWith("+") || 
      currentCalculation.endsWith("-")) {
    currentCalculation = currentCalculation.slice(0, -1); 
  }
  
  const lastChar = currentCalculation.charAt(currentCalculation.length - 1);
  if (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/") {
    currentCalculation = currentCalculation.slice(0, -1) + operator;
  } else {
    if (operator === "/" && getLastNum() === "0") {
      alert("Error: Division by zero");
      return;
    } else {
      currentCalculation += operator;
    }
  }
  
  updateDisplay();
}
  
for (let i = 0; i < numbers.length; i++) {
  numbers[i].addEventListener("click", function() {
    handleNumberPress(this.value);
  });
}

for (let i = 0; i < signs.length; i++) {
  const buttonValue = signs[i].value;
  switch (buttonValue) {
    case "+/-":
      signs[i].addEventListener("click", function() {
        if (currentCalculation.startsWith("-")) {
          currentCalculation = currentCalculation.substring(1);
        } else {
          currentCalculation = "-" + currentCalculation;
        }
        updateDisplay();
      });
      break;
    case "%":
      signs[i].addEventListener("click", function() {
        if (currentCalculation !== "") {
          let lastNum = getLastNum();
          currentCalculation = currentCalculation.substring(0, currentCalculation.length - lastNum.length);
          let result = lastNum / 1;
          currentCalculation += result;
          updateDisplay();
        }
      });
      break;
    case "C":
      signs[i].addEventListener("click", function() {
        currentCalculation = "";
        hasDecimalPoint = false;
        updateDisplay();
      });
      break;
    case ",":
      signs[i].addEventListener("click", function() {
        if (hasDecimalPoint && currentCalculation.endsWith(".")) {
          hasDecimalPoint = false;
        }
        currentCalculation = currentCalculation.substring(0, currentCalculation.length - 1);
        updateDisplay();
      });
      break;
    case "=":
      signs[i].addEventListener("click", function() {
        if (currentCalculation !== "") {
          const result = evaluateExpression(currentCalculation);
          if (result === "Error") {
            display.innerHTML = "Error: invalid expression";
          } else {
            currentCalculation = result.toString();
          }
        }
      });
      break;
    default:
      signs[i].addEventListener("click", function() {
        currentCalculation += buttonValue;
        updateDisplay();
      });
      break;
  }
}

function getLastNum() {
  let num = "";
  let i = currentCalculation.length - 1;

  while (isNumericOrDecimal(currentCalculation[i])) {
    num = currentCalculation[i] + num;
    i--;
    if (i < 0) break;
  }

  return num;
}

function isNumericOrDecimal(char) {
  return !isNaN(char) || char === "." || char === ",";
}

equalsButton.addEventListener("click", function() {
  if (currentCalculation !== "") {
    const result = evaluateExpression(currentCalculation);
    if (result === "Error") {
      display.innerHTML = "Error: invalid expression";
    } else {
      currentCalculation = result.toString();
      updateDisplay();
    }
  }
});

percentButton.addEventListener('click', function() {
  if (display.textContent.endsWith('%') || display.textContent.endsWith('.')) {
    return;
  } else if (display.textContent !== '') {
    display.textContent += '%';
    isPercentage = true;
  }
});

powerButton.addEventListener('click', () => {
  if (isDisplayBlack) {
    display.style.backgroundColor = '#ffffff';
    isDisplayBlack = false;
  } else {
    display.style.backgroundColor = '#000000';
    isDisplayBlack = true;
  }
});

setTimeout(() => {
  if (isDisplayBlack) {
    display.backgroundColor = "black";
  } else {
    display.backgroundColor = "white";
  }
});

document.addEventListener("keydown", function(event) {
  const key = event.key;
  if (/\d/.test(key)) {
    handleNumberPress(key);
  } else if 
    (key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/") {
    handleOperatorPress(key);
  } else if (key === ",") {
    handleDecimalPress();
  } else if (key === "Enter") {
    equalsButton.click();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "c") {
    clearDisplay();
  } else if (key === "%") {
    percentButton.click();
  }
});
