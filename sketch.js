const MARGIN = 10;
const NUM_PIECES = 36;
var wheel;
var total_cash = 1000;
var bet_fixed = false;

function setup() {
  createCanvas(400, 400);
  wheel = new Roulette();
}

function draw() {
  background(220);
  //draw wager component
  let input = createInput("");
  input.size(100);
  input.input(inputEvent);
  input.position(width / 2, MARGIN);

  wheel.spinning = true;
  if (wheel.spinning) {
    //draw spinning wheel
    wheel.spin();

    //draw the spinning ball;
    wheel.ball();
    //update the acceleration
    wheel.ballUpdate();
    wheel.allUpdate();
    wheel.wheelUpdate();
  }
}

function inputEvent() {
  console.log(this.value());
}
