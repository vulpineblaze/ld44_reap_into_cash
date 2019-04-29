<!-- hide script from old browsers




function main(){
    


	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {

	    game.load.image('ground', 'img/rip_grass.png');
	    game.load.image('vert', 'img/rip_grass_vertical.png');
	    game.load.spritesheet('reap', 'img/reaper_no_scythe_sprite(74x144).png', 26, 36,12);
	    game.load.spritesheet('baddiesheet', 'img/reaper_no_scythe_sprite(74x144).png', 26, 36,12);
	    game.load.spritesheet('pokesheet', 'img/tahubacem_poke_spritesheet_halfed.png', 16, 31,12);
	    game.load.image('background','img/brown-soil-texture-background_1308-20483.jpg');

	    game.load.image('rock', 'img/rock_free_sprite(16x12).png');
	    // game.load.image('poke', 'img/tahubacem_poke_sprite(19x36).png');
	    game.load.image('end', 'img/win_screen.png');
	    game.load.image('end_lose', 'img/lose_screen.png');
	    game.load.image('the_start', 'img/dead_like_me_parody_background(800x600).png');

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
	var music;

	var worldBound = 1600;

	var globalFXVolume= 0.3;
	var globalMusicVolume= 0.3;

	var cursors;
	var rockKey;

	var platformsCount = 3;
	var vertsCount = 3;

	var cash = 10;
	var cashWin = 30;
	var cashTextHeader = "SOULCASH: ";
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

	var animThreshold = 30;

	var the_end;
	var the_end_lose;
	var the_start;
	var the_start_delay=1000;
	var the_start_doOnce = true;


	function create() {

		game.add.tileSprite(0, 0, worldBound, worldBound, 'background');

	    game.world.setBounds(0, 0, worldBound, worldBound);

	    game.physics.startSystem(Phaser.Physics.ARCADE);

	    music = game.add.audio('reapsong', globalMusicVolume, true);
	    music.play();
	    // music.volume = globalMusicVolume;

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



	    cashText = game.add.text(16, 16, cashTextHeader+cash, { fontSize: '32px', fill: '#6f6' });
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
	    pokes.createMultiple(pokeCount, 'pokesheet');
	    pokes.setAll('outOfBoundsKill', true);
	    pokes.setAll('checkWorldBounds', true);
	    


	    baddies = game.add.group();
	    baddies.enableBody = true;
	    baddies.physicsBodyType = Phaser.Physics.ARCADE;
	    baddies.createMultiple(baddieCount, 'baddiesheet');
	    baddies.setAll('outOfBoundsKill', true);
	    baddies.setAll('checkWorldBounds', true);
	    

		animationSetup();

	    doAllTimers();


	    the_end = game.add.sprite(0, 0, 'end');
		the_end.visible=false;
	    the_end_lose = game.add.sprite(0, 0, 'end_lose');
		the_end_lose.visible=false;
	    the_start = game.add.sprite(0, 0, 'the_start');
		the_start.visible=false;
	    
	}

	function update() {

		if(the_start_doOnce){
			cleanup();
			the_start.visible = true;
			startTimer = game.time.create(false);
		    startTimer.repeat(the_start_delay,1, restart, this);
		    startTimer.start();
			the_start_doOnce = false;

		}

    	game.physics.arcade.collide(baddies, platforms);
    	game.physics.arcade.collide(pokes, platforms);
	    game.physics.arcade.collide(player, platforms);

    	game.physics.arcade.collide(baddies, verts);
    	game.physics.arcade.collide(pokes, verts);
	    game.physics.arcade.collide(player, verts);


	    game.physics.arcade.overlap(player, pokes, collectPoke, null, this);

	    game.physics.arcade.overlap(player, baddies, collectBaddie, null, this);
	    game.physics.arcade.overlap(baddies, pokes, collectBaddiePoke, null, this);

	    var swipeDirection = playerMovement(game, cursors, player);

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
	    cashText.text = cashTextHeader + cash;
	    playerkillpoke.play();
	}
	function collectBaddie (player, baddie) {
	    baddie.kill();
	    cash -= baddieCash;
	    cashText.text = cashTextHeader + cash;
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
		// console.log("poke",pokeCount, pokes.countLiving(), pokes.countDead());
		pokes.forEachAlive(function(poke){
        	var {x,y} = getRandBoundVelocity(pokeVel);
        	poke.body.velocity.x += x;
        	poke.body.velocity.y += y;
        	var anim = getAnimationByVector(poke.body.velocity.x,poke.body.velocity.y,"poke_");
        	try { 
				poke.animations.play(anim);
			}
			catch(err) {
				console.log(anim, poke);
			}
	    });
		pokes.forEachDead(function(poke){
			var {x,y} = getRandPosition();
        	poke.reset(x,y);
        	poke.checkWorldBounds = true;
        	poke.outOfBoundsKill = true;
	    	poke.tint = pokeSkin[Math.floor(Math.random() * pokeSkin.length)];

	    	var {x,y} = getRandBoundVelocity(pokeVel);
        	poke.body.velocity.x += x;
        	poke.body.velocity.y += y;
	    	poke.body.drag.x = pokeDrag;
	    	poke.body.drag.y = pokeDrag;
	    });
	}

	function updateBaddies(){
		// console.log("baddie",baddieCount, baddies.countLiving(), baddies.countDead());
		baddies.forEachAlive(function(baddie){
        	game.physics.arcade.moveToObject(baddie,player,baddieHuntVel);
	    	var {x,y} = getRandBoundVelocity(baddieVel);
        	baddie.body.velocity.x += x;
        	baddie.body.velocity.y += y;
        	var anim = getAnimationByVector(baddie.body.velocity.x,baddie.body.velocity.y,"baddie_");
        	baddie.animations.play(anim);
        	// console.log(anim);
	    });
		baddies.forEachDead(function(baddie){
			var {x,y} = getRandPosition();
        	baddie.reset(x,y);
        	baddie.checkWorldBounds = true;
        	baddie.outOfBoundsKill = true;
		    baddie.tint = 0x6666ff;
        	game.physics.arcade.moveToObject(baddie,player,baddieHuntVel);

	    	var {x,y} = getRandBoundVelocity(baddieVel);
        	baddie.body.velocity.x += x;
        	baddie.body.velocity.y += y;
	    	baddie.body.drag.x = baddieDrag;
	    	baddie.body.drag.y = baddieDrag;
	    });
	}



	function getAnimationByVector(x,y,prefix){
		var isRight = false;
		var isDown = false;
		var ret_val = "";
		if(animThreshold > Math.abs(x) && animThreshold > Math.abs(y)){
			return prefix + "stop";
		}
        if(x == Math.max(Math.abs(x), x)){
        	// x = 10 ; x = -10 // 10 == 10 (R); -10 != 10 (L)
        	isRight = true;
        }
        if(y == Math.max(Math.abs(y), y)){
        	// x = 10 ; x = -10 // 10 == 10 (R); -10 != 10 (L)
        	isDown = true;
        }

        if(Math.abs(y) == Math.max(Math.abs(x), Math.abs(y))){
        	// y == max -> vert higher magnitude , else horz
        	if(isDown){
        		ret_val = prefix + "down";
        	}else{
        		ret_val = prefix + "up";
        	}
        }else{
        	if(isRight){
        		ret_val = prefix + "right";
        	}else{
        		ret_val = prefix + "left";
        	}
        }
        return ret_val;
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

	function animationSetup(){
		baddies.callAll('animations.add', 'animations', 'baddie_down', [0, 1, 2], 10, true);
	    baddies.callAll('animations.add', 'animations', 'baddie_up', [9,10,11], 10, true);
	    baddies.callAll('animations.add', 'animations', 'baddie_left', [3,4,5], 10, true);
	    baddies.callAll('animations.add', 'animations', 'baddie_right', [6,7,8], 10, true);
	    baddies.callAll('animations.add', 'animations', 'baddie_stop', [1], 0);

	    pokes.callAll('animations.add', 'animations', 'poke_down', [0, 1, 2], 10, true);
	    pokes.callAll('animations.add', 'animations', 'poke_up', [3,4,5], 10, true);
	    pokes.callAll('animations.add', 'animations', 'poke_left', [9,10,11], 10, true);
	    pokes.callAll('animations.add', 'animations', 'poke_right', [6,7,8], 10, true);
	    pokes.callAll('animations.add', 'animations', 'poke_stop', [1], 0);
	}

	function cleanup(){
		player.kill();
    	game.input.onTap.addOnce(restart,this);
    	music.stop();
    	game.camera.setPosition(0,0);
    	pokes.removeAll();
		baddies.removeAll();
    	cashText.text = "Click to Restart!";
    	cashText.bringToTop();
	    baddieTimer.stop();
	    pokeTimer.stop();
	}

	function restart () {
		
	    console.log("restart");
		if(the_end){
			the_end.visible = false;
		}
		if(the_end_lose){
			the_end_lose.visible = false;
		}
		if(the_start){
			the_start.visible = false;
		}
		

	    cash = 10;
	    cashText.text = cashTextHeader + cash;

	    player.revive();
		game.time.reset();

	    pokes.createMultiple(pokeCount, 'pokesheet');
	    baddies.createMultiple(baddieCount, 'baddiesheet');

	    doAllTimers();
	    animationSetup();
	    // console.log(baddieTimer.running);

	    music.play();

	    console.log("restart_done: time:"+game.time.totalElapsedSeconds());

	    



	}

}



// end hiding script from old browsers -->