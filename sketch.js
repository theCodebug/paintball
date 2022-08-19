// NOTE: chat handler needs to pass username down the chain

// NOTE: console stuff triggers these messages
// window.onmessage = (e) => { // chat message from parent
//   if (game.state === 'PLAYING') {
//     validateInput(e.data) 
      // print(e);
      // noLoop();
  // }
// }

/* TODO:
  in SHOOTING show score for that round, not total
  remove magic numbers in nameplate methods ??
  
  TEST. IN. CHROMIUM.

  extras
       - mode for 'taking a break'
       - duck target
       - just take the first x shots (for larger channels)
       - random target size
*/

let style, game, font, ding, splat, logo;

function preload() {
  font = loadFont('BalooBhaina2.ttf');
  ding = loadSound('snd/ding.wav');
  splat = loadSound('snd/splat.wav');
  logo = loadImage('img/paintball.png');
}

function setup() {
  createCanvas(1600, 800);
  frameRate(30);
  
  ding.setVolume(0.7);
  
  style = getStyle();
  game = new Game();
  
  textFont(font);
  rectMode(CENTER);
  clear();    // DEBUG?
}

function draw() {
  switch (game.state) {
    case 'STOPPED':      
      break;
    case 'WAITING' :
      game.counter++;
      if (game.counter >= game.framerate) {
        game.counter = 0;
        game.secondCounter--;
      } 
      if (game.secondCounter < 1) {
        game.counter = 0;
        game.secondCounter = game.roundLength;
        game.state = 'PLAYING';
        game.target = new Target();
        textAlign(CENTER, CENTER);
      }
      break;
      
    case 'PLAYING' :
      clear();      // to refresh countdown
      image(logo, style.logoX, style.logoY);
      game.showCoords();
      game.counter++;
      if (game.counter >= game.framerate) {
        game.counter = 0;
        game.secondCounter--;
      }      
      fill(style.secondColour);
      stroke(0);
      strokeWeight(1);
      textSize(style.secondSize);
      text('Round ends: ' + game.secondCounter, style.secondCounterX, style.secondCounterY );
      
      // TODO: display !paint command hint - coords from top left
      if (game.secondCounter < 1) {
        game.state = 'SHOOTING';
        game.counter = 0;
        textAlign(LEFT, CENTER);
        textSize(style.namePlateTextSize)
        clear();
        image(logo, style.logoX, style.logoY);
        game.shots = Object.keys(game.players);
      }
      game.target.display();
      break;
      
    case 'SHOOTING' :      
      game.counter++;
      game.leaderboard.update();
      if (game.counter >= game.framesBetweenShots) {
        let p = game.shots.pop();
        if (p) {
          if ( game.players[p].shot) {
            game.displayShot(game.players[p].x, game.players[p].y, game.players[p].colour );

            game.leaderboard.showCurrentPlayer( game.players[p].namePlate );
            game.counter = 0;
          }
        } else {
          game.state = 'LEADERBOARD';
          game.counter = 0;
          game.secondCounter = game.leaderboardTime;
          game.showScores();
          ding.play();
        }
      }
      break;
      
    case 'LEADERBOARD' :
      game.counter++;
      if (game.counter >= game.framerate) {
        game.counter = 0;
        game.secondCounter--;
      }
      if (game.secondCounter < 3) {  game.fadeOut();  }
      
      game.leaderboard.update();
      
      if (game.secondCounter < 1) {
        game.endRound();
      } else if (game.secondCounter < 2) {
        game.leaderboard.setOutAnimation();           
      }
      break;  
  }
}

function validateInput(chat) {
  let parts = chat.trim().split(' ');
  parts[2] = float(parts[2]);
  parts[3] = float(parts[3]);
  let x, y;
  
  if (0 <= parts[2] <= 100 &&
      0 <= parts[3] <= 100) {
    
    x = (width / 100) * parts[2];
    y = (height / 100) * parts[3];

    game.newShot(parts[0], x, y);
  }
}
