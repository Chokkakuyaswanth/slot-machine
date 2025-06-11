const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};
const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

let balance = 0;

function startGame() {
  const depositInput = document.getElementById("deposit");
  const amount = parseFloat(depositInput.value);
  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid deposit amount.");
    return;
  }
  balance = amount;
  document.getElementById("balance-display").innerText = `Balance: $${balance}`;
  document.getElementById("game-section").classList.remove("hidden");
  document.getElementById("balance-section").classList.add("hidden");
}

function getReels() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const idx = Math.floor(Math.random() * reelSymbols.length);
      const selected = reelSymbols[idx];
      reels[i].push(selected);
      reelSymbols.splice(idx, 1);
    }
  }
  return reels;
}

function transpose(reels) {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
}

function getWinnings(rows, bet, lines) {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    if (symbols.every((s) => s === symbols[0])) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
}

function displaySlots(rows) {
  const slotDiv = document.getElementById("slots");
  slotDiv.innerHTML = "";
  rows.forEach((row) => {
    row.forEach((symbol) => {
      const div = document.createElement("div");
      div.className = "slot-symbol";
      div.innerText = symbol;
      slotDiv.appendChild(div);
    });
  });
}

function playRound() {
  const lines = parseInt(document.getElementById("lines").value);
  const bet = parseFloat(document.getElementById("bet").value);
  if (isNaN(lines) || lines <= 0 || lines > 3) {
    alert("Enter valid number of lines (1-3)");
    return;
  }
  if (isNaN(bet) || bet <= 0 || bet * lines > balance) {
    alert("Invalid bet amount.");
    return;
  }

  balance -= bet * lines;
  const reels = getReels();
  const rows = transpose(reels);
  displaySlots(rows);

  const winnings = getWinnings(rows, bet, lines);
  balance += winnings;

  document.getElementById("balance-display").innerText = `Balance: $${balance}`;
  document.getElementById("result").innerText = `You won $${winnings}`;

  if (balance <= 0) {
    alert("You ran out of money!");
    resetGame();
  }
}

function resetGame() {
  balance = 0;
  document.getElementById("game-section").classList.add("hidden");
  document.getElementById("balance-section").classList.remove("hidden");
  document.getElementById("deposit").value = "";
  document.getElementById("slots").innerHTML = "";
  document.getElementById("result").innerText = "";
}
