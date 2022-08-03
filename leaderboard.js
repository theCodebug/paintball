class Leaderboard {
  constructor(x, y) {
    
    this.x = x;
    this.y = y;
    this.plateOffset = style.namePlateHeight + style.namePlateOffset;

    this.graphic = createGraphics(style.namePlateWidth, 
    style.leaderboardMaxPlates * this.plateOffset);
    this.reset();
  }
  
  addScorePlates(plates) {
    let num = min(plates.length, style.leaderboardMaxPlates);
    for (let i=0; i<num; i++) {
      this.plates[i] = { plate : plates[i], state : 'IN', height : 1 };
    }
  }
  
  setOutAnimation() {
    for (let p of this.plates) {
      p.state = 'OUT';
    }
  }
  
  reset() {
    this.platesShowing = 0;
    this.plates = [];
    this.graphic.clear();
  }
  
  showCurrentPlayer( plate ) {
    this.plates[this.platesShowing] = { plate : plate, state : 'IN', height : 1 };
    this.platesShowing++;
    
    if (this.platesShowing >= style.leaderboardMaxPlates) {
      this.platesShowing = 0;
      this.plates[0].state = 'OUT'
    } else {
      if (this.plates[this.platesShowing])
      this.plates[this.platesShowing].state = 'OUT'
    }
  }
  
  update() {
    for (let i=this.plates.length-1; i>=0; i--) {
      let p = this.plates[i];
      if (p.state === 'IN') {
        p.height += style.namePlateSpeed;
        if (p.height >= style.namePlateHeight) {
          p.state = 'ACTIVE';
        }
      } else if (p.state === 'OUT') {
        p.height -= style.namePlateSpeed;
        if (p.height < 1) {
          p.state = 'INACTIVE';
        }
      }
    }
    this.display();
  }
  
  display() {
    let g = this.graphic;
    g.imageMode(CENTER);
    let x = style.namePlateWidth/2;
    let y = style.namePlateHeight /2;
    g.clear();
    
    for (let p of this.plates) {
      if (p.state !== 'INACTIVE') {
        g.image(p.plate, x,y, style.namePlateWidth, p.height);
      }
      y += this.plateOffset;
    }
    // display leaderboard graphic
    imageMode(CORNER);
    rectMode(CORNER);
    erase();
    rect(this.x, this.y, style.namePlateWidth, style.leaderboardMaxPlates * this.plateOffset);
    noErase();
    image(this.graphic, this.x, this.y);
  }
}
