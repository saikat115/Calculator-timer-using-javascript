
var expr = '';
var justCalc = false;

function appendChar(ch) {
  var disp = document.getElementById('display');
  var ops = ['+', '-', '*', '/'];

  if (justCalc && !ops.includes(ch)) {
    expr = '';
  }

  justCalc = false;

  if (ch === '.' && expr.split(/[\+\-\*\/]/).pop().includes('.')) return;

  expr += ch;
  disp.value = expr;
}

function clearDisplay() {
  expr = '';
  justCalc = false;
  document.getElementById('display').value = '';
}

function calculate() {
  if (expr === '') return;

  try {
    var result = eval(expr);
    result = Math.round(result * 1e10) / 1e10;
    document.getElementById('display').value = result;
    expr = String(result);
    justCalc = true;
  } catch {
    document.getElementById('display').value = 'Error';
    expr = '';
  }
}

function toggleSign() {
  if (expr === '' || expr === '0') return;

  if (expr.startsWith('-')) {
    expr = expr.slice(1);
  } else {
    expr = '-' + expr;
  }

  document.getElementById('display').value = expr;
}

function percent() {
  if (expr === '') return;

  var val = parseFloat(expr);

  if (!isNaN(val)) {
    expr = String(val / 100);
    document.getElementById('display').value = expr;
  }
}


var timerLeft = 0;
var timerTick = null;

function startTimer() {
  if (timerTick !== null) return;

  if (timerLeft === 0) {
    var h = parseInt(document.getElementById('inputH').value) || 0;
    var m = parseInt(document.getElementById('inputM').value) || 0;
    var s = parseInt(document.getElementById('inputS').value) || 0;
    timerLeft = h * 3600 + m * 60 + s;
  }

  if (timerLeft <= 0) return;

  timerTick = setInterval(function () {
    timerLeft--;
    updateTimerDisplay();

    if (timerLeft <= 0) {
      clearInterval(timerTick);
      timerTick = null;
      document.getElementById('timerDisplay').style.color = 'red';
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerTick);
  timerTick = null;
}

function resetTimer() {
  clearInterval(timerTick);
  timerTick = null;
  timerLeft = 0;
  document.getElementById('timerDisplay').textContent = '00:00:00';
  document.getElementById('timerDisplay').style.color = '#222';
}

function updateTimerDisplay() {
  var h = Math.floor(timerLeft / 3600);
  var m = Math.floor((timerLeft % 3600) / 60);
  var s = timerLeft % 60;

  document.getElementById('timerDisplay').textContent =
    pad(h) + ':' + pad(m) + ':' + pad(s);
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}


var swRunning = false;
var swStart = 0;
var swSaved = 0;
var swInterval = null;
var lapCount = 0;

function swToggle() {
  if (!swRunning) {
    swStart = Date.now();
    swRunning = true;
    document.getElementById('swBtn').textContent = 'Stop';
    swInterval = setInterval(updateSW, 50);
  } else {
    swSaved += Date.now() - swStart;
    swRunning = false;
    document.getElementById('swBtn').textContent = 'Start';
    clearInterval(swInterval);
  }
}

function swReset() {
  clearInterval(swInterval);
  swRunning = false;
  swSaved = 0;
  lapCount = 0;
  document.getElementById('swDisplay').textContent = '00:00.000';
  document.getElementById('swBtn').textContent = 'Start';
  document.getElementById('lapList').innerHTML = '';
}

function swLap() {
  if (!swRunning) return;

  var total = swSaved + (Date.now() - swStart);
  lapCount++;

  var div = document.createElement('div');
  div.textContent = 'Lap ' + lapCount + ' — ' + formatSW(total);

  document.getElementById('lapList').prepend(div);
}

function updateSW() {
  var total = swSaved + (Date.now() - swStart);
  document.getElementById('swDisplay').textContent = formatSW(total);
}

function formatSW(ms) {
  var m = Math.floor(ms / 60000);
  var s = Math.floor((ms % 60000) / 1000);
  var mil = ms % 1000;

  return pad(m) + ':' + pad(s) + '.' + String(mil).padStart(3, '0');
}