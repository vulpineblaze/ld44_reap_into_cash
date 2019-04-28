<!-- hide script from old browsers




function main(){
    


	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {

	    game.load.image('ground', 'img/rip_grass.png');
	    game.load.image('vert', 'img/rip_grass_vertical.png');
	    game.load.spritesheet('dude', 'img/reaper_no_scythe_sprite(74x144).png', 26, 36,12);
	    game.load.spritesheet('baddie', 'img/reaper_no_scythe_sprite(74x144).png', 26, 36,12);
	    game.load.image('background','img/brown-soil-texture-background_1308-20483.jpg');

	    game.load.image('rock', 'img/rock_free_sprite(16x12).png');
	    game.load.image('poke', 'img/tahubacem_poke_sprite(19x36).png');
	    game.load.image('end', 'img/the_end.png');
	    game.load.image('end_lose', 'img/the_end_lose.png');

		game.load.audio('reapsong', ['audio/ReapSong.mp3', 
        	'audio/ReapSong.ogg']);
        game.load.audio('badkillplayer', 'audio/badkillplayer.wav');
        game.load.audio('badkillpoke', 'audio/badkillpoke.wav');
        game.load.audio('playerkillpoke', 'audio/playerkillpoke.wav');
	}

	var player;
	var playerGroup;
	// var sword;
	var platforms;
	var verts;
	var pokes;
	var baddies;

	var worldBound = 1600;

	var globalFXVolume= 0.3;
	var globalMusicVolume= 0.0;

	var cursors;
	var rockKey;

	var platformsCount = 3;
	var vertsCount = 3;

	var cash = 10;
	var cashWin = 30;
	var cashText = "";

	var rockVel = 500;
	var rockLifespan=500;

	var pokeVel=250;
	var pokeDrag=50;
	var pokeCount = 30;
	var pokeSkin = [0xffffff,0xffc3aa,0xf0b8a0,0xe1ac96,0xd2a18c,0xc39582,0xb48a78,0xa57e6e,0x967264,0x87675a,0x785c50,0x695046,0x5a453c,0x4b3932,0x3c2e28,0x2d221e];
	var pokeTimerDelay = 1800;

	var baddieVel=50;
	var baddieHuntVel=150;
	var baddieDrag=50;
	var baddieCash=3;
	var baddieCount=5;
	var baddieTimerDelay = 2000;

	var the_end;
	var the_end_lose;


	function create() {

		game.add.tileSprite(0, 0, 1600, 1600, 'background');

	    game.world.setBounds(0, 0, 1600, 1600);

	    game.physics.startSystem(Phaser.Physics.ARCADE);

	    music = game.add.audio('reapsong');
	    music.play();
	    music.volume = globalMusicVolume;

		badkillpoke = game.add.audio('badkillpoke');
		badkillplayer = game.add.audio('badkillplayer');
		playerkillpoke = game.add.audio('playerkillpoke');
    	badkillpoke.allowMultiple = true;
    	playerkillpoke.allowMultiple = true;
    	badkillpoke.volume = globalFXVolume;
    	badkillplayer.volume = globalFXVolume;
    	playerkillpoke.volume = globalFXVolume;


	    platforms = game.add.group();
	    platforms.enableBody = true;

	    var ground = platforms.create(0, game.world.height - 64, 'ground');
	    ground.scale.setTo(2, 2);
	    ground.body.immovable = true;
	    
	    var i;
	    for(i=0;i<platformsCount;i++){
	    	var {x,y} = getRandPosition();
			ground = platforms.create(x,y, 'ground');
	    	ground.scale.setTo(2, 2);
	    	ground.body.immovable = true;
	    }

	    verts = game.add.group();
	    verts.enableBody = true;

	    var vert = verts.create(game.world.width - 64, 0, 'vert');
	    vert.scale.setTo(2, 2);
	    vert.body.immovable = true;
	    
	    var i;
	    for(i=0;i<vertsCount;i++){
	    	var {x,y} = getRandPosition();
			vert = verts.create(x,y, 'vert');
	    	vert.scale.setTo(2, 2);
	    	vert.body.immovable = true;
	    }

	    playerGroup = game.add.group();

	    player = playerCreate(game, playerGroup);



	    cashText = game.add.text(16, 16, 'CASH: '+cash, { fontSize: '32px', fill: '#6f6' });
	    cashText.fixedToCamera = true;

	    rockKey = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
	    cursors = game.input.keyboard.addKeys( { 'w': Phaser.KeyCode.W, 
	    										's': Phaser.KeyCode.S, 
	    										'a': Phaser.KeyCode.A, 
	    										'd': Phaser.KeyCode.D,
	    										'up': Phaser.KeyCode.UP,
	    										'down': Phaser.KeyCode.DOWN,
	    										'left': Phaser.KeyCode.LEFT,
	    										'right': Phaser.KeyCode.RIGHT
	    										 } );

	    pokes = game.add.group();
	    pokes.enableBody = true;
	    pokes.physicsBodyType = Phaser.Physics.ARCADE;
	    pokes.createMultiple(pokeCount, 'poke');
	    pokes.setAll('outOfBoundsKill', true);
	    pokes.setAll('checkWorldBounds', true);


	    baddies = game.add.group();
	    baddies.enableBody = true;
	    baddies.physicsBodyType = Phaser.Physics.ARCADE;
	    baddies.createMultiple(baddieCount, 'baddie');
	    baddies.setAll('outOfBoundsKill', true);
	    baddies.setAll('checkWorldBounds', true);

	    doAllTimers();


	    the_end = game.add.sprite(0, 0, 'end');
		the_end.visible=false;
	    the_end_lose = game.add.sprite(0, 0, 'end_lose');
		the_end_lose.visible=false;
	    
	}

	function update() {

    	game.physics.arcade.collide(baddies, platforms);
    	game.physics.arcade.collide(pokes, platforms);
	    game.physics.arcade.collide(player, platforms);

    	game.physics.arcade.collide(baddies, verts);
    	game.physics.arcade.collide(pokes, verts);
	    game.physics.arcade.collide(player, verts);


	    game.physics.arcade.overlap(player, pokes, collectPoke, null, this);

	    game.physics.arcade.overlap(player, baddies, collectBaddie, null, this);
	    game.physics.arcade.overlap(baddies, pokes, collectBaddiePoke, null, this);

	    var swipeDirection = playerMovement(cursors, player);

        if(cash <= 0){
        	cleanup();
	    	the_end_lose.visible = true;
        }else if(cash >= cashWin){
        	cleanup();
			the_end.visible = true;
        }else{
        	//??
        }
        
        


	}

	function doAllTimers(){
		pokeTimer = game.time.create(false);
	    pokeTimer.loop(pokeTimerDelay, updatePokes, this);
	    pokeTimer.start();

	    baddieTimer = game.time.create(false);
	    baddieTimer.loop(baddieTimerDelay, updateBaddies, this);
	    baddieTimer.start();
	}

	function collectPoke (rock, poke) {
	    poke.kill();
	    cash += 1;
	    cashText.text = 'CASH: ' + cash;
	    playerkillpoke.play();
	}
	function collectBaddie (player, baddie) {
	    baddie.kill();
	    cash -= baddieCash;
	    cashText.text = 'CASH: ' + cash;
	    badkillplayer.play();
	}
	function collectBaddiePoke (baddie, poke) {
	    poke.kill();
	    badkillpoke.play();
	}
	function killHouseOverlap(platforms, house) {
		house.destroy();
	}
	function processCallback() {
		return true;
	}

	function updatePokes(){
		pokes.forEachAlive(function(poke){
        	var {x,y} = getRandBoundVelocity(pokeVel);
        	poke.body.velocity.x += x;
        	poke.body.velocity.y += y;
	    });
		pokes.forEachDead(function(poke){
			var {x,y} = getRandPosition();
        	poke.reset(x,y);
	    	poke.tint = pokeSkin[Math.floor(Math.random() * pokeSkin.length)];

	    	var {x,y} = getRandBoundVelocity(pokeVel);
        	poke.body.velocity.x += x;
        	poke.body.velocity.y += y;
	    	poke.body.drag.x = pokeDrag;
	    	poke.body.drag.y = pokeDrag;
	    });
	}

	function updateBaddies(){
		baddies.forEachAlive(function(baddie){
        	game.physics.arcade.moveToObject(baddie,player,baddieHuntVel);
	    	var {x,y} = getRandBoundVelocity(baddieVel);
        	baddie.body.velocity.x += x;
        	baddie.body.velocity.y += y;
	    });
		baddies.forEachDead(function(baddie){
			var {x,y} = getRandPosition();
        	baddie.reset(x,y);
		    baddie.tint = 0x6666ff;
        	game.physics.arcade.moveToObject(baddie,player,baddieHuntVel);

	    	var {x,y} = getRandBoundVelocity(baddieVel);
        	baddie.body.velocity.x += x;
        	baddie.body.velocity.y += y;
	    	baddie.body.drag.x = baddieDrag;
	    	baddie.body.drag.y = baddieDrag;
	    });
	}






	function getRandPosition(){
		var edge = 200;
		var x,y = 0;
		x = game.rnd.integerInRange(edge, game.world.width-edge);
		y = game.rnd.integerInRange(edge, game.world.height-edge);
		return {x,y};
	}
	function getRandBoundVelocity(bound){
		var x,y = 0;
		x = game.rnd.integerInRange(-bound,bound);
		y = game.rnd.integerInRange(-bound,bound);
		return {x,y};
	}


	function cleanup(){
		player.kill();
    	cashText.text = "Click to Restart!";
    	game.input.onTap.addOnce(restart,this);
    	music.stop();
    	game.camera.setPosition(0,0);
    	pokes.removeAll();
		baddies.removeAll();
	}

	function restart () {
		
	    console.log("restart");
		if(the_end){
			the_end.visible = false;
		}
		if(the_end_lose){
			the_end_lose.visible = false;
		}

	    cash = 10;
	    cashText.text = 'CASH: ' + cash;

	    player.revive();
		game.time.reset();

	    pokes.createMultiple(pokeCount, 'poke');
	    baddies.createMultiple(baddieCount, 'baddie');

	    doAllTimers();
	    // console.log(baddieTimer.running);

	    music.play();

	    console.log("restart_done: time:"+game.time.totalElapsedSeconds());



	}

}



// end hiding script from old browsers -->