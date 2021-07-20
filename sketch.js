var PLAY = 1;
var END = 0;
var gameState = PLAY;
var speed;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var bullet;
var backgroundImg
var score=0;
var jumpSound, collidedSound;
var bulletImg;
var gameOver, restart;
var youWin;
function preload(){
  jumpSound = loadSound("sounds/jump.wav")
  collidedSound = loadSound("sounds/collided.wav")
  gunSound = loadSound("sounds/gun.mp3");
  backgroundImg = loadImage("assets/backgroundImg.png")
  sunAnimation = loadImage("assets/sun.png");
  backSound = loadSound("sounds/backG.mp3");
  trex_running = loadAnimation("assets/trex_2.png","assets/trex_1.png","assets/trex_3.png");
  trex_collided = loadAnimation("assets/trex_collided.png");
  
  groundImage = loadImage("assets/blackGround.png");
  
  cloudImage = loadImage("assets/cloud.png");
  
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  gun = loadImage("assets/player.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
    sky = loadImage("assets/sky.jpeg");
    corona = loadImage("assets/corona2.png");
    corona2 = loadImage("assets/corona.png");
    moon = loadImage("assets/moon.png");
    manDied = loadImage("assets/manDied.png");
    bulletImg = loadImage("assets/bullet.png");
    youWinImg = loadImage("assets/youWin.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-80,100,10,10);
  sun.addAnimation("moon", moon);
  sun.scale = 0.1
  
  trex = createSprite(camera.x+displayWidth/2,750,20,50);
  trex.x = 750
  speed=random(83,90);
  trex.addAnimation("running", gun);
  trex.addAnimation("collided", manDied);
  trex.setCollider('circle',0,0,360)
  trex.scale = 0.08
  //trex.visible = false
   //trex.debug=true;
  bullet= createSprite(trex.x,trex.y,50,50);
  bullet.addImage(bulletImg);
  bullet.scale = 0.1
  bullet.visible = false;

  invisibleGround = createSprite(width/2,height-20,3500,282);  
  invisibleGround.shapeColor = "black";
   
   invisibleGround.scale = 0.5
  ground = createSprite(width/2,height-10,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.scale = 0.5 
  //ground.setCollider('rectangle',70,70,100,50);
  //ground.velocityX = -(6 + 3*score/100);
  youWin = createSprite(800,400);
  youWin.addImage(youWinImg);
  youWin.scale = 0.5
  youWin.visible = false;
  gameOver = createSprite(windowWidth,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth-900,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  bulletsGroup = new Group();
  score = 0;
}


function draw() {
 
  camera.x = trex.x-750;
  gameOver.position.x = restart.position.x - camera.x;
  camera.position.x = windowWidth/2;

  //trex.debug = true;
  background(sky);
  textSize(20);
  fill("white")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    //backSound.play();
    
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    trex.collide(invisibleGround);
    if (keyCode === 120) {
      //bullet.visible = true;
      createBullets();
      gunSound.play();
    }
    spawnClouds();
    spawnObstacles();
    //keyPressed();
    if(bulletsGroup.isTouching(obstaclesGroup)){
      obstaclesGroup.destroyEach();
     bulletsGroup.destroyEach();
      }
    
      
    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;
    }
    if(score === 1000){
      gameState = "Win"
    }
  }
  else if (gameState === END) {
    backSound.pause();
    gameOver.visible = true;
    restart.visible = true;
   
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",manDied);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  else if(gameState == "Win"){
   youWin.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    backSound.pause();
    //change the trex animation
    //trex.changeAnimation("collided",);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }

  }
  textSize(30)
  text("Press x key to shoot",1000,100);
  //text("Press space key to jump",600,100);
  text("Make the score atleast 1000 to win",500,100);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.x+width/2,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x+width/2,height-125,20,30);
    obstacle.setCollider('circle',0,0,135)
    //obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(corona);
              //obstacle.scale = 0.2;
              break;
      case 2: obstacle.addImage(corona2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",gun);
  
  score = 0;
  
}

function createBullets(){
  var bullet= createSprite(170, 100, 60, 10);
  bullet.addImage(bulletImg);
  bullet.x = trex.x;
  bullet.y=trex.y-25;
  bullet.velocityX = 50;
  bullet.lifetime = 100;
  bullet.scale = 0.1;
  bulletsGroup.add(bullet); 
  return bullet;
}