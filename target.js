class Target {
  constructor() {
    this.strokeWeight = 3;
    
    this.state = 'ENTER'; // ACTIVE, ENTER
    this.enterX = 1;
    this.enterSpeed = 5;
    this.lb = {x : style.leaderboardX, y : style.leaderboardY, 
               width :style.namePlateWidth, 
               height : style.leaderboardMaxPlates * (style.namePlateHeight + style.namePlateOffset) };
    
    this.cd = {x : width/2 -100, y : 0, 
               width :200, 
               height : 100 };
    
    this.randomLocation();
    this.generateGraphic();
  }
  
  randomLocation() {
    let collideLeaderboard = true;
    let collideCounter = true;
    while (collideLeaderboard || collideCounter) {
      this.x = random(style.targetDiameter/2, width - style.targetDiameter/2);
      this.y = random(style.targetDiameter/2, height - style.targetDiameter/2);

      collideLeaderboard = this.circCollideRect({ x: this.x, y : this.y}, style.targetDiameter/2,
                         this.lb, this.lb.width, this.lb.height);
      collideCounter = this.circCollideRect({ x: this.x, y : this.y}, style.targetDiameter/2,
                         this.cd, this.cd.width, this.cd.height);
    }
  }
  
  circCollideRect(circ, circRad, topLeft, width, height) {
  return circ.x + circRad > topLeft.x && circ.x - circRad < topLeft.x + width &&
         circ.y + circRad > topLeft.y && circ.y - circRad < topLeft.y + height;
  }
  
  generateGraphic() {
    this.graphic = createGraphics(style.targetDiameter, style.targetDiameter);
    let g = this.graphic;
    let cxy = style.targetDiameter / 2;
    g.fill(style.targetCol);
    g.strokeWeight(this.strokeWeight);
    g.stroke(style.targetStroke);
    g.circle(cxy, cxy, style.targetDiameter);
    g.noStroke();
    g.fill(style.targetCentreCol);
    g.circle(cxy, cxy, style.targetDiameter - 30);
    g.fill(style.targetCol);
    g.circle(cxy, cxy, style.targetDiameter - 50);
    g.fill(style.targetCentreCol);
    g.circle(cxy, cxy, style.targetDiameter/4);
  }
  
  display() {    
    imageMode(CENTER);
    if (this.state === 'ENTER') {
      image(this.graphic, this.x, this.y, this.enterX, style.targetDiameter);
      this.enterX += this.enterSpeed;
      if (this.enterX >= style.targetDiameter) {
        this.state = 'ACTIVE';
      }
    } else {
      image(this.graphic, this.x, this.y);
    }
  }
}
