var gameScene = new Phaser.Scene('game');
var ship;
var bullets; 
var enemies_l;
var enemies_r;
var score = 0;
var loaded = false;
var scoreText;
var startText;
var k=1;
var lose = false;
var velocity = 50;
var bgvel = 10;


gameScene.preload = function(){
    this.load.image('ship', './assets/ship.png')
    this.load.image('bullet', './assets/bullet.png')
    this.load.image('enemy', './assets/enemy.svg')
    this.load.image('platform', './assets/platform.png')
    this.load.image('background', './assets/bg.png');
}
gameScene.create = function(){

    this.bg = this.add.tileSprite(0,0,900,600,'background').setOrigin(0,0);
    enemies_l = this.physics.add.group({
        key: 'enemy',
        repeat: Phaser.Math.Between(3,5),
        setXY: { x: 50, y: 50, stepX: Phaser.Math.Between(40, 90)},
        setScale: {x: 1.8, y: 1.8},
    });
    enemies_r = this.physics.add.group({
        key: 'enemy',
        repeat: Phaser.Math.Between(3,5),
        setXY: { x: 500, y: 50, stepX: Phaser.Math.Between(40, 80)},
        setScale: {x: 1.8, y: 1.8},
    });
 
    loaded = true;
    this.input.on('pointerdown', function(){
    enemies_l.setVelocityY(velocity);
    enemies_r.setVelocityY(velocity);
    })
    console.log(velocity);
    console.log(enemies_l.countActive(true));
    ship = this.physics.add.sprite(450, 500, 'ship');
    platform = this.physics.add.sprite(0, 599, 'platform').setScale(150, 0);

    bullets = this.physics.add.group({
        key: 'bullet',
        frameQuantity: 5,
    });

    this.input.on('pointerdown', (pointer) =>
    {
        var bullet = bullets.create(ship.x, 500, 'bullet');
        bullet.setVelocityY(-300);
        bullet.setAngle(-90);
    });

    scoreText = this.add.text(16,16, "Score: " + score, {fontSize: '18px', fill: '#FFF'});
    startText = this.add.text(450,300, "Level: "+k++ +" Click To Play!", {fontSize: '18px', fill: '#FFF'}).setOrigin(0.5);

    this.input.on('pointerdown', function(){
        startText.destroy();
    })
    

    this.physics.add.overlap(bullets, enemies_l, hit_l, null, this);
    this.physics.add.overlap(bullets, enemies_r, hit_r, null, this);
    this.physics.add.overlap(ship, enemies_l, death_l, null, this);
    this.physics.add.overlap(ship, enemies_r, death_r, null, this);
    this.physics.add.overlap(enemies_l, platform, death_l, null, this);
    this.physics.add.overlap(enemies_r, platform, death_r, null, this);
}
gameScene.update = function(){
    
    this.bg.tilePositionY -= bgvel;
    if(lose){
        alert('You have lost! Your Score:' +score);
        lose = false;
        score = 0;
        this.scene.restart();
    }
    ship.x = this.input.mousePointer.x;
    
    if(loaded){
        if(enemies_l.countActive(true) == 0 && enemies_r.countActive(true) == 0){
            velocity+=30;
            bgvel+=3.5;
            loaded = false;
            this.scene.restart();
            console.log("ok");
        }
    }


}
function hit_l(bullets, enemies_l){
    enemies_l.destroy();
    score+=100;
    scoreText.setText("Score: " + score);
}
function hit_r(bullets, enemies_r){
    enemies_r.destroy();
    score+=100;
    scoreText.setText("Score: " + score);
}
function death_l(ship, enemies_l){
    this.physics.pause();
    velocity = 50;
    bgvel = 10;
    lose = true;
    loaded = false;
}
function death_r(ship, enemies_r){
    this.physics.pause();
    velocity = 50;
    bgvel = 10;
    loaded = false;
    lose = true;
}

var config = {
    type: Phaser.AUTO,
    width: 900, 
    height: 600,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity:{y: 0}
        }
    },
};

var game = new Phaser.Game(config);
