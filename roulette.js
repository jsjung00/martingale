/**
 * By default the ball will land on red at deg 0 and if wheel doesn't move
 */
class Roulette {
  constructor() {
    this.degree = 0;
    this.pos = createVector(width / 2, height / 2);
    this.boardRad = Math.floor((width * 8) / 10) * 0.5;
    this.sliceRad = Math.floor((width * 7) / 10) * 0.5;
    this.degreeStep = PI * 0.01;
    this.spinning = false;
    this.ballPosRadRatio = 1; //1 means that it starts on the outer of the wheel, 0.5 means its halfway from center to outside
    this.ballRad = 20;
    //pre-determine if ball will land red or black
    //red
    if (Math.random() < 0.5) {
      this.ballDegree = (0.15 * 2 * PI) / NUM_PIECES;
    }
    //black
    else {
      this.ballDegree = (-0.85 * 2 * PI) / NUM_PIECES;
    }
    this.ballDegreeStep = PI * 0.04;
    this.ballDegreeAcc = PI * 0.04 * 0.002;
    //used to add randomness to spin end location
    this.allAcc = -PI * 0.001 * random(1, 5);
  }
  drawStatic() {
    //draw the board
    fill(85, 51, 17);
    circle(0, 0, 2 * this.boardRad);

    //draw the pieces

    let a = TWO_PI / NUM_PIECES;
    let d = this.boardRad * 2;
    for (let i = 0; i < NUM_PIECES; i++) {
      if (i % 2 == 0) {
        fill(255, 0, 0);
      } else {
        fill(0);
      }
      stroke(255);
      arc(0, 0, 2 * this.sliceRad, 2 * this.sliceRad, i * a, (i + 1) * a, PIE);
    }
  }
  spin() {
    push();
    translate(width / 2, height / 2);
    rotate(this.degree);
    this.drawStatic();
    pop();
  }
  wheelUpdate() {
    this.degree += this.degreeStep;
  }
  ball() {
    push();
    translate(width / 2, height / 2);
    rotate(this.ballDegree);
    circle(this.sliceRad * this.ballPosRadRatio, 0, this.ballRad);
    fill(255);
    pop();
  }
  ballUpdate() {
    //if ball stops i.e reaches 0 speed and lies in either black or red
    if (this.ballDegreeStep == 0) {
      //keep ball synced with the wheel speed
      this.ballDegree += this.degreeStep;
      return;
    }

    this.ballDegree += this.ballDegreeStep;
    if (this.ballDegreeStep > 0) {
      this.ballPosRadRatio = max(0.5, this.ballPosRadRatio - 0.00015);
    }
    this.ballDegreeStep = max(0, this.ballDegreeStep - this.ballDegreeAcc);
  }
  //slow down both the wheel and the ball by set random amount to change end location
  allUpdate() {
    if (this.ballDegreeStep > 0) {
      this.degree -= this.allAcc;
      this.ballDegree -= this.allAcc;
    }
  }
}
