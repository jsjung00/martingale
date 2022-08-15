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
const replayButtonWidth = 80;
var gameOverUpdated = false;
const betInputWidth = 100;
const betInputHeight = 30;

function setup() {
  var myCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  myCanvas.parent("sketchContainer");
  BG_COLOR = color("rgb(217,255,248)");
  textFont("Times New Roman");
}

function gameParamsReset() {
  numRounds = 0;
  roundUpdated = false;
  gameOverUpdated = false;
  //draw wager component
  betInput = createInput("");
  betInput.size(100);
  betInput.style.width = betInputWidth;
  betInput.style.height = betInputHeight;
  betInput.style("font-family", "Times New Roman");
  betInput.position(
    windowWidth / 2 - betInputWidth / 2,
    MARGIN - betInputHeight / 2
  );
  betInput.input(onBetInput);

  //draw spin component
  spinButton = createButton("Spin!");
  const spinFontSize = 32;
  const spinButtonWidth = spinFontSize * 3;
  const spinButtonHeight = spinFontSize + 20;
  spinButton.style.width = spinButtonWidth;
  spinButton.style.height = spinButtonHeight;
  spinButton.style("font-size", `${spinFontSize}px`);
  spinButton.style("font-weight", "600px");
  //spinButton.style("background-color", "#c7ffda");
  spinButton.style("width", `${spinButtonWidth}px`);
  spinButton.style("height", `${spinButtonHeight}px`);
  spinButton.style("border", "2px solid white");
  spinButton.style("border-radius", "10px");
  spinButton.style("font-family", "Times New Roman");
  spinButton.style("color", "black");
  spinButton.position(
    windowWidth / 2 - spinButtonWidth / 2,
    windowHeight / 2 - spinButtonHeight / 2
  );
  spinButton.attribute("disabled", "");
  spinButton.mousePressed(clickSpin);
}

function rollWheel() {
  wheel = new Roulette();
}

function draw() {
  background(BG_COLOR);
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
  if (!gameOverBool) {
    text("Bet:", width / 2 - betInputWidth / 2, MARGIN);
  }

  fill(7, 6, 0);
  textAlign(LEFT, TOP);
  text(`Rounds: ${numRounds}`, MARGIN, MARGIN);
  text(`Bet Color: ${bettingColor}`, MARGIN, MARGIN + FONTSIZE);

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
      //enable spin button
      spinButton.removeAttribute("disabled");
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
  //disable the input and spinner since ball spinning
  betInput.attribute("disabled", "");
  spinButton.attribute("disabled", "");
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
  const replayTextSize = 20;
  textSize(dispTextSize);
  text("Game Over", width / 2, MARGIN);
  replayButton = createButton("Replay");
  replayButton.style("width", `${replayButtonWidth}px`);
  replayButton.style("font-size", `${replayTextSize}px`);
  replayButton.style("height", `${replayTextSize + 5}px`);
  replayButton.style("border", "none");
  replayButton.style("border-radius", "3px");
  replayButton.style("font-family", "Times New Roman");
  replayButton.style("background-color", "white");
  replayButton.style(
    "box-shadow",
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
  );
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
