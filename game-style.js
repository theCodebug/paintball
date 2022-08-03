function getStyle() {
  return {
    leaderboardX : width - 230,
    leaderboardY : 30,
    leaderboardMaxPlates : 5,
    namePlateCol : color(220),
    namePlateStroke : 10,
    namePlateTextCol : 10,
    namePlateTextSize: 16,
    namePlateWidth : 200,
    namePlateHeight : 40,
    namePlateOffset : 20,
    namePlateSpeed : 3,
    secondCounterX  :  width/2,
    secondCounterY : 30,
    secondColour : color(250),
    secondSize : 30,
    targetDiameter : 100,
    targetCol : color(200),
    targetCentreCol : color(150,0,0),
    targetStroke : color(50),
    colours : [color(255,0,0), color(0,255,0), color(255,255,0), color(255,0,230), color(23,255,255), color(197,150,255), color(255,64,153), color(64,255,144)],
    logoX : 55,
    logoY : 35
  }
}

class Game {
  framesBetweenShots = 25;
  shotDiameter = 10;
  standardDeviation = 10;
  // nextRoundRange = [120,200]; // seconds
  nextRoundRange = [10,15];      // DEBUG
  roundLength = 120;             // seconds
  leaderboardTime = 20;          // seconds
  framerate = 30;          // NOTE: actual framerate is all over the place!!
  
  scoreBands = [ [20,5], [40,4], [60,3], [80,2], [120,1] ];

  constructor() {
    this.state = 'WAITING';
    this.target = undefined;
    this.leaderboard = new Leaderboard(style.leaderboardX, style.leaderboardY);
    this.nextRound = int( random(this.nextRoundRange[0], this.nextRoundRange[1]) );
    this.secondCounter = this.nextRound;
    this.colourIndex = 0;
    this.reset();
  }

  reset() {
    this.players = {};
    this.opacity = 0;
    this.leaderboard.reset();
    this.counter = 0;
  }

  newPlayer(username) {
    let col = this.newColour();
    this.players[username] = {colour : col, score : 0, x : 0, y : 0, shot : false };
    this.newNamePlate(username, col);
  }

  newColour() {
    this.colourIndex++;
    if (this.colourIndex >= style.colours.length) {
      this.colourIndex = 0;
    }
    return style.colours[this.colourIndex];
  }
  
  newNamePlate(username, colour) {
    this.players[username].namePlate = createGraphics(style.namePlateWidth, style.namePlateHeight);
    let np = this.players[username].namePlate;

    np.fill( style.namePlateCol );
    if (style.namePlateStroke > -1) {   np.stroke(style.namePlateStroke);
    } else {   np.noStroke(); }
    np.rect(1,1, style.namePlateWidth-2, style.namePlateHeight-2, 10);
    np.noStroke();
    np.fill(colour);
    np.rect(2,2, 20, style.namePlateHeight-4, 10,0,0,10);  // magic number
    np.fill(style.namePlateTextCol);
    np.textAlign(LEFT, CENTER);
    np.textSize(style.namePlateTextSize);
    // TODO: truncate username as required
    np.text(username, 40, style.namePlateHeight / 2); // magic number
    np.text(0, style.namePlateWidth - 30, style.namePlateHeight / 2); // magic number
    // glint
    np.fill(255,170);
    np.rect(10,3, style.namePlateWidth-20,6, 5);
  }

  updateScore(username, score) {
    // TODO: allow for double digit+ scores
    let np = this.players[username].namePlate;
    np.fill( style.namePlateCol);
    np.rect(style.namePlateWidth-2, 2, -40, style.namePlateHeight-4, 5);  // magic number
    np.fill(style.namePlateTextCol);
    np.text(score, style.namePlateWidth - 30, style.namePlateHeight / 2); // magic number
    np.fill(255,170);      // glint
    np.rect(style.namePlateWidth-50,3, 40,6, 5);
  }

  showScores() {
    let temp = [];
    for (let k of Object.keys(this.players)) {
      temp.push([k, this.players[k].score]);
      this.updateScore( k, this.players[k].score );
    }
    let scores = this.sortArrayOfArrays(temp, 1);
    
    let plates = [];
    for (let s of scores) {
      let p = s[0];
      plates.push( this.players[p].namePlate );
    }
    this.leaderboard.addScorePlates( plates );
  }

  newShot(username, x, y) {
    if (username in this.players) {
      if (!this.players[username].shot) {
        this.makeShot(username, x, y);
      } else {
        // TODO: is there any other action that should happen here?
        print('Player has already shot');
      }
    } else {
      this.newPlayer(username);
      this.makeShot(username, x, y);
    }
  }

  makeShot(username, x, y) {
    debugger;
    this.players[username].x = x;
    this.players[username].y = y;
    this.players[username].shot = true;

    let d = dist(x,y, this.target.x, this.target.y);
    for (let s of this.scoreBands) {
      if (d < s[0]) {
        this.players[username].score += s[1];
        this.updateScore( username, s[1]);
        break;
      }
    }
  }

  displayShot(x, y, colour) {
    noStroke();
    fill(colour);
    for (let c=0; c<50; c++) {
      let xOffset = randomGaussian(0, this.standardDeviation);
      let yOffset = randomGaussian(0, this.standardDeviation);
      let d = dist(0,0, xOffset,yOffset);
      let diameter = max(1, this.shotDiameter - d/2); // make sure no negative nums
      circle(x + xOffset, y + yOffset, diameter);
    }
    splat.play();
  }

  fadeOut() {
    erase(this.opacity);
    rectMode(CORNER);
    rect(0,0, width,height);
    noErase();
    imageMode(CENTER);
    image(logo, style.logoX, style.logoY);
    this.opacity += 5;
  }

  endRound() {
    for (let p of Object.values(this.players) ) {
      p.shot = false;
    }
    this.counter = 0;
    this.nextRound = int( random(this.nextRoundRange[0], this.nextRoundRange[1]) );
    this.secondCounter = this.nextRound;
    this.leaderboard.reset();
    this.state = 'WAITING';
    this.opacity = 0;
    clear();
    imageMode(CENTER);
    image(logo, style.logoX, style.logoY);
  }

  showCoords() {
    let nums = [0,25,50,75];
    let x25 = width/4;
    let y25 = height/4;
    textSize(14);
    fill(255);
    stroke(20);
    for (let i=1; i<4; i++) {
      text(nums[i], 10,y25*i);
      text(nums[i], x25*i,7);
    }
  }

  sortArrayOfArrays( arr, sortIndex ) {
    let out = [];
    let max = -1;
    let maxIndex;
    let l = arr.length;
    for (let a=0; a<l; a++) {
      for (let i=0; i<arr.length; i++) {
        if (arr[i][sortIndex] > max) {
          max = arr[i][sortIndex];
          maxIndex = i;
        }
      }
      out.push( arr.splice(maxIndex, 1)[0] );
      max = -1;
    }
    return out;  
  }
}
