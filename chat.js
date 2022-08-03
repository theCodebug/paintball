const client = new tmi.Client({
  channels: ["thecodebug"],
});

client.connect();

client.on('connected', () => { print('Connected to chat'); } );

client.on("message", (channel, tags, message, self) => {
  
  if (self) return true;                 // avoid responding to Bot's own mesages
  
  const chatStr = message.trim();

  if (tags.badges && tags.badges.broadcaster) {
    if ( chatStr.startsWith('!paint start') ) {
      game.state = 'WAITING';
      imageMode(CENTER);
      image(logo, style.logoX, style.logoY);
      return;
    } 
    if ( chatStr.startsWith('!paint stop') ) {
      game.state = 'STOPPED';
      clear();
      return;
    }
  }
  
  if (chatStr.startsWith("!paint")) {
    if (game.state === "PLAYING") {
      validateInput(tags.username + ' ' + chatStr);
      print(tags.username + ' ' + chatStr);
    }
  }
});

