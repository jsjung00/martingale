const MARGIN = 20;
const NUM_PIECES = 36;
var wheel;
var totalCash;
var betFixed = false;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
var gameStarted = false;
var bettingColor;
var numRounds;
var spinButton;
var betInput;
var roundUpdated = false;
var ballSpinning = false;
const replayButtonWidth = 40;
var gameOverUpdated = false;

function setup() {
  var myCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  myCanvas.parent("sketchContainer");
  BG_COLOR = color("rgb(225,229,242)");
}

function gameParamsReset() {
  numRounds = 0;
  roundUpdated = false;
  gameOverUpdated = false;
  //draw wager component
  betInput = createInput("");
  betInput.size(100);
  betInput.position(width / 2, MARGIN);
  betInput.input(onBetInput);
  //draw spin component
  spinButton = createButton("Spin!");
  spinButton.position(width / 2, height / 2);
  spinButton.attribute("disabled", "");
  spinButton.mousePressed(clickSpin);
}

function rollWheel() {
  wheel = new Roulette();
}

function draw() {
  background(220);
  if (!gameStarted) {
    let playButton = select("#playButton");
    //triggers once user clicks on playButton
    if (playButton.elt.name === "clicked") {
      gameParamsReset();
      rollWheel();
      gameStarted = true;
      const colorSelector = select("#winningColor");
      const betSelector = select("#betAmount");
      bettingColor = colorSelector.elt.value;
      totalCash = parseInt(betSelector.elt.value);
      playButton.elt.name = "unclicked";
    }
  } else {
    gameDraw();
  }
}

function gameDraw() {
  const gameOverBool = isGameOver();
  if (!gameOverUpdated && gameOverBool) {
    gameisOver();
    gameOverUpdated = true;
  }
  textSize(32);
  if (gameOverBool) {
    textAlign(CENTER, TOP);
    text("Game Over", width / 2, MARGIN);
  }
  //draw bet text and number of betting rounds
  const FONTSIZE = 20;
  textSize(FONTSIZE);
  textAlign(RIGHT, TOP);
  text(`Cash: $${totalCash}`, width - MARGIN, MARGIN);
  fill(0, 102, 153);
  textAlign(LEFT, TOP);
  text(`Rounds: ${numRounds}`, MARGIN, MARGIN);
  text(`Color: ${bettingColor}`, MARGIN, MARGIN + FONTSIZE);
  if (wheel.spinning) {
    //draw spinning wheel
    wheel.spin();
    //draw the spinning ball;
    wheel.ball();
    //update the acceleration
    wheel.ballUpdate();
    wheel.allUpdate();
    wheel.wheelUpdate();
    //if ball ends in slot and didn't yet update
    if (wheel.ballDegreeStep == 0 && !roundUpdated) {
      roundUpdated = true;
      numRounds += 1;
      ballSpinning = false;
      //win case
      if (wheel.winColor === bettingColor) {
        //enable input
        betInput.removeAttribute("disabled");
        //increase total cash
        let prevBetValue = parseInt(betInput.value());
        console.log(prevBetValue);
        totalCash += prevBetValue;
        betFixed = false;
      }
      //lose case
      else {
        //keep input disabled, double the bet value
        let prevBetValue = parseInt(betInput.value());
        totalCash -= prevBetValue;
        let newBetValue = parseInt(betInput.value()) * 2;
        betInput.value(newBetValue.toString());
        betFixed = true;
      }
    }
  } else {
    push();
    translate(width / 2, height / 2);
    wheel.drawStatic();
    pop();
  }
}

function onBetInput() {
  if (!isNaN(this.value()) && this.value().length > 0) {
    const betAmount = parseInt(this.value());
    //activate the button for valid bets
    if (
      betAmount <= totalCash &&
      (betFixed || betAmount > 0) &&
      !ballSpinning
    ) {
      spinButton.removeAttribute("disabled");
      return;
    }
  }
  spinButton.attribute("disabled", "");
}

function clickSpin() {
  rollWheel();
  roundUpdated = false;
  wheel.spinning = true;
  ballSpinning = true;
  //disable the input since ball spinning
  betInput.attribute("disabled", "");
}

function isGameOver() {
  const betAmount = parseInt(betInput.value());
  //game is over when user cannot continiue making a martingale bet
  return betFixed && betAmount > totalCash;
}

function gameisOver() {
  console.log("game is over");
  //remove spin button and betting input
  spinButton.remove();
  betInput.remove();
  const dispTextSize = 32;
  textSize(dispTextSize);
  text("Game Over", width / 2, MARGIN);
  replayButton = createButton("Replay");
  replayButton.style.width = replayButtonWidth;
  replayButton.position(
    windowWidth / 2 - replayButtonWidth / 2,
    0.5 * (windowHeight - CANVAS_HEIGHT) + MARGIN + dispTextSize
  );
  replayButton.mousePressed(restartClicked);
}

function restartClicked() {
  gameStarted = false;
  replayButton.remove();
  let startContainer = select("#startContainer");
  let sketchContainer = select("#sketchContainer");
  //change settings to default
  select("#betAmount").elt.value = "";
  select("#winningColor").elt.value = "red";
  startContainer.elt.style.display = "block";
  sketchContainer.elt.style.display = "none";
  loop();
}
