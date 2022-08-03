function nameplateTest() {
  noLoop();
  game.newPlayer('Tester');
  image(game.players['Tester'].namePlate, 200,200);
}

function test() {
  let players = ['codebug', 'sue', 'john', 'mike', 'ellie', 'dennie'];
  let s = 0;
  let y = 10;
  for (let p of players) {
    validateInput(p + ' !paint 10 ' + y);
    game.players[p].score = s;
    // game.updateScore(p, s);
    s++;
    y+=3;
  }
}

function targetTest(limit) {
  for (let i=0; i<limit; i++) {
    let t = new Target();
    t.enterX = style.targetDiameter;
    t.display();    
  }
}
