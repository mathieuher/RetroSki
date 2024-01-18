# Retro Ski game
Welcome on a small game dev project.<br>
Put your skis and let's race some randomly generated alpine ski tracks with your friends.

## Demo
https://mathieuher.github.io/RetroSki

## Controls
### During the downhill
* <b>Arrow up</b> (1x) -> Start skiing
* <b>Arrow left</b> -> Left carving
* <b>Arrow right</b> -> Right carving
* <b>Space bar</b> -> Braking/Side sliding
* <b>R</b> -> Go back to event menu (allow to restart the race)

### Anytime
* <b>Escape</b> -> Quit and go back to event setup
* <b>D</b> -> Toggle debug mode

## Gamer guide
### Event setup
Welcome to your event setup.<br>
Here you have to provide few informations before starting to ride :
1. Name of the track (if the track doesn't exist it generates a new one)<br>
<b>Note: Check one of the preloaded tracks below for your first ride</b>
2. Style of the track (Slalom, Giant slalom, Super-G or Downhill)<br>
<b>Note: This param is only applied when generating a new track.</b>
3. Name of the first player
4. Name of the second player (must be different than the first player)
5. Number of races (1 to 10 is recommended)
### Event manager
This screen is the home place before and after each race.<br>
It provides informations about the current event.
### Race
You made it to the top of the hill !<br>
Now it's time to have fun and enjoy some nice carving !<br><br>
Press <b>Arrow UP</b> (1x) to start skiing and see you at the finish line !<br>
Don't miss a gate or you'll receive a penalty of <b>3 seconds</b>

## Tips
### Preloaded tracks
By default the game provides 5 tracks, so you can use the same track as your friends even on a different setup.
1. Davos (Giant slalom)
2. Adelboden (Slalom)
3. Soelden (Giant slalom)
4. Wengen (Super-G)
5. Zermatt (Downhill)

### Different track styles
Each track style follow is own rule when generating a new track.<br>
The dynamic of the skier is also impacted by the style of the track to mimic real world differences.

### Keep your records
RetroSki use localStorage of the browser to persist generated tracks and records.<br> 
You can easily export them and share them with friends by using the browser developper tools.

## Developer guide
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the Vite server!
3. Have fun!
