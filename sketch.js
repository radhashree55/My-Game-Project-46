var bgimg,astroimg,rockimg,rockflyimg,astronaut,rocket,asteroid,astrofly,astroflyimg,astgroup;
var satelite,satgroup,bull,bulletgrp,flag,ice,astro;
var gameState = "Stage1";
var score = 0;
let pg;

function preload(){
  bgimg = loadImage("background.jpg");
  astroimg = loadImage("astronaut.png");
  rockimg = loadImage("rocket.static.png");
  rockflyimg = loadImage("rocket.flying.png");
  ast1 = loadImage("asteroid1.png");
  ast2 = loadImage("asteroid2.png");
  ast3 = loadImage("asteroid3.png");
  earth = loadImage("earth.png");
  astroflyimg = loadImage("astro.sit.png");
  sat1 = loadImage("sat1.png");
  sat2 = loadImage("sat2.png");
  sat3 = loadImage("sat3.png");
  bulletimg = loadImage("bull.png");
  flagimg = loadImage("flag.png");
  iceimg = loadImage("ice.png");
}

function setup() {
  createCanvas(1200,600);
  pg = createGraphics(100,100,WEBGL);

  astronaut = createSprite(50,500,50,50);
  astronaut.addImage(astroimg);
  astronaut.scale = 0.15;

  rocket = createSprite(600,400,50,50);
  rocket.addImage("standing",rockimg);
  rocket.addImage("flying",rockflyimg);
  rocket.setCollider("rectangle",0,0,50,100);
  rocket.scale = 2;

  astrofly = createSprite(10,300,50,50);
  astrofly.addImage(astroflyimg);
  astrofly.scale = 0.2;
  astrofly.velocityX = 1;
  astrofly.setCollider("rectangle",10,10,10,10);
  astrofly.debug = false;
  astrofly.visible = false;
  
  astgroup = createGroup();
  satgroup = createGroup();
  bulletgrp = createGroup();
}

function draw() {
  background(bgimg);

  if(gameState==="Stage1"){
    
    fill(0,255,255);
    stroke(0);
    textSize(22);
    text("SCORE: "+score,10,25);

    fill(255,200,0);
    textSize(21);
    text("The Rocket's about to leave !! Press the Right Arrow to take off !!",340,20);

    if(keyDown(RIGHT_ARROW)){
      astronaut.x += 10;
      text("You're about to face a massive Asteroid Attack ! Watch Out !",360,65);
    }
    if(astronaut.isTouching(rocket)){
      rocket.changeImage("flying",rockflyimg);
      astronaut.destroy();
      rocket.velocityY = -7;
    }
    if(rocket.y<0){
      rocket.destroy();
      bgimg = loadImage("space.jpg");
      gameState ="Stage2";
      score +=50;
    }
  }
  if(gameState==="Stage2"){
    pg.texture(earth);
    pg.rotateY(0.01);
    pg.sphere(pg.width/2.7);
    image(pg,100,450,150,150);

    fill(0,255,255);
    stroke(0);
    textSize(22);
    text("SCORE: "+score,astrofly.x-600,23);
    fill(255,0,0);

    if(score < 200){
    text("Use UP & DOWN ARROW keys to find your way out, AVOID the ASTEROIDS",astrofly.x-350,22);
    }
    else{};

    astrofly.visible = true;

    if(keyDown(UP_ARROW)){
      astrofly.y = astrofly.y-10;
    }
    if(keyDown(DOWN_ARROW)){
      astrofly.y = astrofly.y+10;
    }
    camera.on();
    camera.position.x = astrofly.x;
    camera.position.y = height/2;

    spawnAsteroids();

    if(astrofly.isTouching(astgroup)){
      score = score-20;
    }
    else{score = score+1}

    if(score===1000){
      gameState="Stage3";
    }
    if(score <50){
      gameState = "over";
    }
    if(gameState==="over"){
      fill(0,255,255);
      stroke(0);
      textSize(22);
      text("SCORE: "+score,astrofly.x-600,camera.position.y-300);

      astrofly.velocityX = 0;
      astgroup.destroyEach();
      
      fill(0,255,255);
      stroke(0);
      textSize(22);
      text(" OOPS ! GAME OVER ",astrofly.x-400,camera.position.y-300);
    }
  }
  if(gameState==="Stage3"){
    bgimg = loadImage("space2.jpg");

    fill(0,255,255);
    stroke(0);
    textSize(22);
    text("SCORE: "+score,astrofly.x-600,22);

    if(score<1200){
    fill(255,0,0);
    text("LEVEL UP !! MISSION: Kill the Neighbouring Country's Spying Satellites.",astrofly.x-350,22);
    }
    else{};

    astrofly.visible = true;
    astgroup.destroyEach();

    camera.on();
    camera.position.x = astrofly.x;
    camera.position.y = height/2;

    spawnSat();

    if(keyDown(UP_ARROW)){
      astrofly.y = astrofly.y-10;
    }
    if(keyDown(DOWN_ARROW)){
      astrofly.y = astrofly.y+10;
    }
    if(keyWentDown("SPACE")){
      bullet();
    }
    if(bulletgrp.isTouching(satgroup)){
      satgroup.destroyEach();
      bulletgrp.destroyEach();
      score+=50;
    }
    if(astrofly.isTouching(satgroup)){
      score = score-20;
    }
    if(score===1250){
      gameState ="Stage4";
    }
    if(gameState==="Stage4"){
      camera.off();
      bgimg = loadImage("moongrd.jpg");

      astrofly.visible = false;

      flag = createSprite(2700,70,20,20);
      flag.addImage("flagimg",flagimg);
      flag.scale = 0.3;

      astro = createSprite(1950,500,50,50);
      astro.addImage(astroimg);
      astro.scale = 0.15;

      if(keyDown(UP_ARROW)){
        astro.y = astro.y-10;
      }
      if(keyDown(DOWN_ARROW)){
        astro.y = astro.y+10;
      }
      if(frameCount%10===0){
        var ice = createSprite(random(3000,3100),random(100,600),20,20);
          ice.addImage("iceimg",iceimg);
          ice.scale = 0.5;
          ice.velocityX = -2;
       }
     }
   }

  drawSprites(); 
}

function spawnAsteroids(){
  if(frameCount%10===0){
    var asteroid = createSprite(random(camera.position.x*2.5,camera.position.x*4),random(0,600),20,20);
    asteroid.velocityX = random(-2,-4);
    var rand = Math.round(random(1,3));
    switch(rand){
      case 1:
        asteroid.addImage("asteroid1",ast1);
        break;
      case 2:
      asteroid.addImage("asteroid2",ast2);
        break;
      case 3:
      asteroid.addImage("asteroid3",ast3);
        break;
      default:
        break;
      }
    astgroup.add(asteroid);
    asteroid.scale = 0.2;
    asteroid.lifetime = 1000;
    asteroid.debug = false;
    }
  }

  function spawnSat(){
    if(frameCount%20===0){
      var satelite = createSprite(random(camera.position.x*1.5,camera.position.x*3),random(30,570),20,20);
      satelite.velocityX = random(-1,-4);
      var rand = Math.round(random(1,3));
      switch(rand){
        case 1:
          satelite.addImage("sat1",sat1);
          break;
        case 2:
          satelite.addImage("sat2",sat2);
          break;
        case 3:
        satelite.addImage("sat3",sat3);
          break;
        default:
          break;
        }
      satgroup.add(satelite);
      satelite.scale = 0.4;
      satelite.lifetime = 1000;
      satelite.debug = false;
      }
    }

  function bullet(){
    bull = createSprite(astrofly.x,astrofly.y,20,10);
    bull.addImage("bulletimg",bulletimg);
    bull.scale = 0.15;
    bull.velocityX = 15;
    bulletgrp.add(bull);
  }