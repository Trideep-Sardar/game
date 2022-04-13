//positioning the sprites

const setPosition=(sprite)=>{
    let hero=document.getElementById(sprite.element);
    hero.style.left=sprite.x + 'px';
    hero.style.top=sprite.y + 'px';
}

//key mapping for the player movement and actions
const toggleKey=(keyCode,clicked)=>{
    if(keyCode==='ArrowDown'){
        controller.d1=clicked;
    }
    if(keyCode==='ArrowUp'){
        controller.u1=clicked;
    }if(keyCode==='ArrowLeft'){
        controller.l1=clicked;
    }if(keyCode==='ArrowRight'){
        controller.r1=clicked;
    }
    if(keyCode==='0'){
        controller.f1=clicked;
    }


    if(keyCode==='a'){
        controller.l2=clicked;
    }
    if(keyCode==='d'){
        controller.r2=clicked;
    }if(keyCode==='w'){
        controller.u2=clicked;
    }if(keyCode==='s'){
        controller.d2=clicked;
    }
    if(keyCode==='f'){
        controller.f2=clicked;
    }
}

//player motion over the arena

const handleControls=()=>{
    if(controller.u1){
        hero1.y-=HERO_MOTION;
    }
    if(controller.d1){
        hero1.y+=HERO_MOTION;
    }
    if(controller.l1){
        hero1.x-=HERO_MOTION;
    }
    if(controller.r1){
        hero1.x+=HERO_MOTION;
    }
    if(controller.f1 && laser1.y<=-120){
        laser1.x=hero1.x+10;
        laser1.y=hero1.y-20;
    }



    if(controller.u2){
        hero2.y-=HERO_MOTION;
    }
    if(controller.d2){
        hero2.y+=HERO_MOTION;
    }
    if(controller.l2){
        hero2.x-=HERO_MOTION;
    }
    if(controller.r2){
        hero2.x+=HERO_MOTION;
    }
    if(controller.f2 && laser2.y>=500){
        laser2.x=hero2.x+10;
        laser2.y=hero2.y;
    }
    handleBoundary();
}


//handle boundary reason to make all the things strictly inside the arena
const handleBoundary=()=>{
    if(hero1.x < 5){
        hero1.x=5;
    }
    if(hero1.y < 5){
        hero1.y=5;
    }
    if(hero1.x > 470){
        hero1.x=470;
    }
    if(hero1.y > 470){
        hero1.y=470;
    }

    if(hero2.x < 5){
        hero2.x=5;
    }
    if(hero2.y < 5){
        hero2.y=5;
    }
    if(hero2.x > 470){
        hero2.x=470;
    }
    if(hero2.y > 470){
        hero2.y=470;
    }
}

//random function to generate random numbers
const getRandom=(maxNum)=>{
    return parseInt(Math.random() * maxNum);
}


//point of interaction of the players
const intersecting=(a,b)=>{
    return a.x < b.x + 20 && a.x + 2 > b.x && a.y + 20 > b.y && a.y < b.y + 20;
}

//game over function after completing 3 rounds simultaneously

const gameOver=(loser)=>{
    let player=document.getElementById(loser.element);
    let laser=document.getElementById('laser-1');
    player.style.visibility='hidden';
    loser.x=-100;
    loser.y=-100;
    laser.style.visibility='hidden';
    let gameState=document.getElementById('game-status');
    gameState.style.visibility='visible';
}





//handle collison actions

const checkCollision=()=>{
    if(intersecting(laser1,hero2)){
        hero2.power-=getRandom(30);  //used larger random value to quick demonstrate the code on the screen
        if(hero2.power<=0){
            hero1.won+=1;
            hero2.power=100;
        }
    }else if(intersecting(laser2,hero1)){
        hero1.power-=getRandom(30);
        if(hero1.power<=0){
            hero2.won+=1;
            hero1.power=100;
        }
    }
}
//updating positions for dynatmic motion of objects inside the arena

const updatePosition=()=>{
    laser1.y-=30;
    laser2.y+=30;
}

//display function to display the actual functioning of the objects on the screen
const showSprites=()=>{
    setPosition(hero1);
    setPosition(hero2);
    setPosition(laser1);
    setPosition(laser2);
 
    let player1=document.getElementById('p1-score');
    let player2=document.getElementById('p2-score');
    player1.innerText='Player1 Health : '+ hero1.power + ' Wins : '+ hero1.won;
    player2.innerText='Player2 Health : '+ hero2.power + ' Wins : '+ hero2.won;
    if(hero2.won===3){
        let winnerdiv=document.getElementById('winner');
        winnerdiv.innerHTML='player 2 won the match!!!'
        gameOver(hero1);
    }else if(hero1.won===3){
        let winnerdiv=document.getElementById('winner');
        winnerdiv.innerHTML='player 1 won the match!!!'
        gameOver(hero2)
    }
}

//main game loop for fps and auto rendering of all the things
const loop=()=>{
    if(new Date().getTime() - lastLoopRun > 40){
        handleControls();
        updatePosition();
        checkCollision();
        showSprites();
        lastLoopRun=new Date().getTime();
    }
    setTimeout(() => {
        loop();
    }, 2);
}

//function for ease to create various sprites
const createSprite=(sprite,x,y)=>{
    let result=new Object();
    result.element=sprite;
    result.x=x;
    result.y=y;
    result.power=100;
    result.won=0;
    return result;
}
let hero1=createSprite('hero-1',180,450);
let hero2=createSprite('hero-2',180,20);
let laser1=createSprite('laser-1',-250,-250);
let laser2=createSprite('laser-2',-250,-250);

let HERO_MOTION=10;
let lastLoopRun=0;
let controller=new Object();
document.onkeyup=(e)=>{
    toggleKey(e.key,false)
}
document.onkeydown=(e)=>{
    toggleKey(e.key,true)
}

//handling reset button after game over
let button=document.getElementById('reset');
button.addEventListener('click',()=>{
    window.location.reload();
})

loop();