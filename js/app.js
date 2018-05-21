/*
 * Global variables
 */
let allEnemies = [];
let lives;
let points;
const pointsToWin = 500; /* this is the number of points you need to win the game */

// Find start, win and game over divs
const startDiv = document.getElementById('startDiv');
const winDiv = document.getElementById('winDiv');
const gameOverDiv = document.getElementById('gameOverDiv');

// Find buttons with class play
const startGame = document.querySelectorAll('.play');

// Find lives div for hearts
const hearts = document.getElementById('lives');
const heartsImg = document.getElementsByClassName('heart');

// Find points div
const showPoints = document.getElementById('points');


/*
 * Constructors
 */

// Player constructor
function Player(x, y) {
  this.sprite = 'images/char-boy.png';
  this.x = x;
  this.y = y;
};

// Enemy constructor with random speed
function Enemy(x, y, speed = randomSpeed(110, 320)) /* change interval to make the game easyer of harder */ {
  this.sprite = 'images/enemy-bug.png';
  this.x = x;
  this.y = y;
  this.speed = speed;
};

// Gem constructor
function Gem(x, y, sprite, points){
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.points = points;
};


/*
 * HandleInput, update and render for prototypes
 */

// Player's keypad and canvas limits
Player.prototype.handleInput = function(arrow) {
  if(lives >= 0) {
    this.xValue = 100;
    this.yValue = 85;

    if (arrow == 'up') {
      this.y -= this.yValue;
    }
    if (arrow == 'down') {
      this.y += this.yValue;
    }
    if (arrow == 'left') {
      this.x -= this.xValue;
    }
    if (arrow == 'right') {
      this.x += this.xValue;
    }
  }

  // Setting canvas limits to the player
  if (this.x < 0){
    this.x = 0;
  }
  if (this.x > 400){
    this.x = 400;
  }
  if (this.y > 400){
    this.y = 400;
  }
  if (this.y <= 30){
    this.y = -10;
    setTimeout(() => {
      this.y = 400;
      earnPoints();
      }, 150);
  }
};

 // Update the player's position
Player.prototype.update = function() {
  // Check if one enemy touched the player or if the player took one gem
  crash();
  collectGems();
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the enemy's position
Enemy.prototype.update = function(dt) {
  this.x = this.x + this.speed * dt;

  // When the enemy is out the board make it reapear and give it a new random speed and horizontal position.
  if(lives >= 0) {
    if(this.x > 505) {
      this.x = randomPosition(-200, -100);
      this.speed = randomSpeed(80, 250);
    }
  }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the gem's position
Gem.prototype.update = function() {
};

Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*
 * Instantiate objects
 */

// Create player and enemies
let player = new Player(200, 400);
let enemy1 = new Enemy(-400, 230);
let enemy2 = new Enemy(-150, 145);
let enemy3 = new Enemy(-780, 60);

// Create gems. Parameters passed to constructor for future creation of various gems.
let gem = new Gem(-500, -500, 'images/Gem Green.png', 5);
// let gem2 = new Gem(-500, -500, 'images/Gem Blue.png', 7);

// Add Enemies to array
allEnemies.push(enemy1, enemy2, enemy3);


/*
 * Other functions
 */

// Random speed generator for enemies
function randomSpeed(min, max) {
  return Math.random() * (max - min) + min  ;
};

// Random position generator for enemies
function randomPosition(min, max){
  return Math.random() * (max - min) + min;
};

// Start or restart the game
function restartGame(){

  // If there are hearts on the panel, delete them before creating new hearts
  if (lives >= 0) {
    for(let i = 0; i < lives; i++) {
      hearts.removeChild(hearts.childNodes[1]);
    }
  }

  // Set new values for the panel
  lives = 3;
  points = 0;
  showPoints.innerText = 'Points: ' + points;

  // Add hearts to the panel
  for(let i = 0; i < 3; i++){
    const oneHeart=document.createElement("img");
    oneHeart.setAttribute('src', 'images/Heart.png');
    oneHeart.setAttribute('class', 'heart');
    hearts.append(oneHeart);

    // Bring the gem to a random position after 15000 ms
    setTimeout(() => {
      gem.x = randomPosition(0, 400);
      gem.y = randomPosition(235, 60);
    }, 15000);
  }

  // Set new start positions for the enemies
  enemy1.x = -400;
  enemy2.x = -450;
  enemy3.x = -300;
};

// If the player and one enemy meet, lose a live and go to position 'y' 400
// Example code taken from https://javascript.wekeepcoding.com/article/11446068/Box+collison+in+JavaScript
function crash() {
  if(player.x+38>=enemy1.x-38 && player.x-38<=enemy1.x+38 && player.y+10>=enemy1.y-10 && player.y-10<=enemy1.y+10) {
    player.y = 400;
    loseLive();
  }
  if(player.x+38>=enemy2.x-38 && player.x-38<=enemy2.x+38 && player.y+10>=enemy2.y-10 && player.y-10<=enemy2.y+10) {
    player.y = 400;
    loseLive();
  }
  if(player.x+38>=enemy3.x-38 && player.x-38<=enemy3.x+38 && player.y+10>=enemy3.y-10 && player.y-10<=enemy3.y+10) {
    player.y = 400;
    loseLive();
  }
};

// Collect gems
// Example code taken from https://javascript.wekeepcoding.com/article/11446068/Box+collison+in+JavaScript
function collectGems() {
  if(player.x+38>=gem.x-38 && player.x-38<=gem.x+38 && player.y+38>=gem.y-38 && player.y-38<=gem.y+38) {
    gem.y = -500;
    gem.x = -500;

    // Gem appears with some delay
    setTimeout (() => {
      gem.y = randomPosition(235, 60);
      gem.x = randomPosition(0, 400);
    }, 10000);

    earnGemPoints();
  }
};

// Lose lives
function loseLive() {
  lives--
  // Detele one heart if there are some
  if (lives >= 0){
    hearts.removeChild(hearts.childNodes[1]);
  }
  // If the player losed 3 lives, end the game
  if(lives < 0) {
    gameOver();
  }
};

// Earn points for getting to the wather
function earnPoints(){
  points = points + 10;
  showPoints.innerText = 'Points: ' + points;

  // Check if the player has enough points to win
  if(points >= pointsToWin ) {
    win();
  }
};

// Earn points for collected gems. The points quantity depends of the gem  value in future upgrades of the game
function earnGemPoints(){
  points = points + gem.points;
  showPoints.innerText = 'Points: ' + points;

  // Check if the player has enough points to win
  if(points >= pointsToWin) {
    win();
  }
};



/*
 * Show and hide message's divs
 */

// Hide start, win and game over divs. Function called directly from buttons
function hideDiv(targetDiv){
  let tmp = document.getElementById(targetDiv);
  tmp.setAttribute('style', 'display: none;');
};

// Show win message
function win() {
  winDiv.setAttribute('style', 'display: flex;');
};

// Show game over message
function gameOver() {
  gameOverDiv.setAttribute('style', 'display: flex;');
};


/*
 * Event listeners
 */

// Find and listen to all the start buttons
for(let i = 0; i < startGame.length; i++) {
  startGame[i].addEventListener('click', function() {
    restartGame();
  });
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
