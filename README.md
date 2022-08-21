# Paintball
**Work in progress. Some features incomplete.**  
Uses [P5.js](https://p5js.org/)  

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
img/paintball.png shows when the game is running - you may replace it with any image but not omit it entirely  

## Pending features ##
* Broadcaster display leaderboard command - outside of current round
* Broadcaster pause game command
* Broadcaster reloadStyle command for on the fly visual changes
* Help text - on screen or in chat
* Delta time rather than framerate() for consistent timings
* Broadcaster machine gun mode
* Other targets - ducks etc. - maybe only occassionally a different target
* Taking a break mode - no delay between rounds
