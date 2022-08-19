# Paintball
Work in progress. Some features incomplete.  

Stream overlay game for Twitch.

## Usage

Set channel name in chat.js  
Set up a local webserver  
Load index.html as a browser overlay  

## Commands

**Broadcaster only**  
!paint start  
!paint stop  
  
**Chatters**  
!paint x y  -- where x and y are numbers. They a x and y co-ordinates of their shot in percentages of the screen resolution

## Customisation
The game works out of the box but you can customise it if you wish.  
Visual styles can be edited in *game-style.js* within the getStyle() function  
Gameplay variables can be edited in *game-style.js* within the Game object (just below the styles).
