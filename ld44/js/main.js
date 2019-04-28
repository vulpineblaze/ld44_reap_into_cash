<!-- hide script from old browsers




function main(){
    


	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload() {

	    game.load.image('ground', 'img/platform.png');
	    game.load.spritesheet('dude', 'img/reaper_no_scythe_sprite(74x144).png', 26, 36,12);
	    game.load.spritesheet('baddie', 'img/reaper_no_scythe_sprite(74x144).png', 26, 36,12);
	    game.load.image('background','img/brown-soil-texture-background_1308-20483.jpg');
	    // game.load.spritesheet('sword','img/shitsword.png',64, 64);
	    // game.load.image('sword', 'img/shitsword_skinny.png');
	    game.load.image('rock', 'img/rock_free_sprite(16x12).png');
	    game.load.image('poke', 'img/tahubacem_poke_sprite(19x36).png');
	    game.load.image('end', 'img/the_end.png');
	    game.load.image('end_lose', 'img/the_end_lose.png');

	    // game.load.image('house1', 'img/house1.png');
	    var i; 
	    for(i=1;i<=houseIndex;i++){
		    game.load.image('house'+i, 'img/house'+i+'.png');
	    }
	}

	var player;
	var playerGroup;
	// var sword;
	var platforms;
	var pokes;
	var baddies;

	var worldBound = 1600;

	var cursors;
	var rockKey;

	var houseIndex=5;
	var houseCount=20;

	var cash = 10;
	var cashWin = 30;
	var cashText = "";

	var rockVel = 500;
	var rockLifespan=500;

	var pokeVel=250;
	var pokeDrag=50;
	var pokeCount = 30;
	var pokeSkin = [0xffffff,0xffc3aa,0xf0b8a0,0xe1ac96,0xd2a18c,0xc39582,0xb48a78,0xa57e6e,0x967264,0x87675a,0x785c50,0x695046,0x5a453c,0x4b3932,0x3c2e28,0x2d221e];

	var baddieVel=50;
	var baddieHuntVel=150;
	var baddieDrag=50;
	var baddieCash=3;
	var baddieCount=5;

	var the_end;
	var the_end_lose;


	function create() {

		game.add.tileSprite(0, 0, 1600, 1600, 'background');

	    game.world.setBounds(0, 0, 1600, 1600);

	    // game.physics.startSystem(Phaser.Physics.P2JS);
	    // game.physics.p2.setImpactEvents(true);
	    // game.physics.p2.restitution = 0.9;
	    //  We're going to be using physics, so enable the Arcade Physics system
	    game.physics.startSystem(Phaser.Physics.ARCADE);

	    //  A simple background for our game
	    // game.add.sprite(0, 0, 'sky');

	    //  The platforms group contains the ground and the 2 ledges we can jump on
	    platforms = game.add.group();

	    //  We will enable physics for any object that is created in this group
	    platforms.enableBody = true;

	    var i;
	    for(i=1;i<=houseIndex;i++){
			var {x,y} = getRandPosition();
	    	var house = platforms.create(x, y, 'house'+i);	
	    	house.scale.setTo(2, 2);
	    	house.body.immovable = true;

	    	// if(game.physics.arcade.overlap(platforms, platforms, killHouseOverlap, processCallback, this)){
	    	// 	console.log('processCallback,i: '+i);
	    	// 	i--;
	    	// }
	    	if(game.physics.arcade.collide(platforms, house)){
	    		house.destroy();
	    		console.log('intersects,i: '+i);
	    		i--;
	    	}
	    }

	    // if(game.physics.arcade.overlap(platforms, platforms, killHouseOverlap, processCallback, this)){
    	// 	console.log('processCallback,i: '+i);
    	// 	i--;
    	// }


    	



	    // The player and its settings
	    // player = game.add.sprite(32, game.world.height - 150, 'dude');
	    playerGroup = game.add.group();

	    player = playerCreate(game, playerGroup);



	    //  The cash
	    cashText = game.add.text(16, 16, 'CASH: '+cash, { fontSize: '32px', fill: '#6f6' });
	    cashText.fixedToCamera = true;
	    // cashText.cameraOffset(0,0);

	    //  Our controls.
	    // cursors = game.input.keyboard.createCursorKeys();
	    rockKey = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
	    cursors = game.input.keyboard.addKeys( { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } );

	 //    var wasd = {
		//   up: game.input.keyboard.addKey(Phaser.Keyboard.W),
		//   down: game.input.keyboard.addKey(Phaser.Keyboard.S),
		//   left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		//   right: game.input.keyboard.addKey(Phaser.Keyboard.D),
		// };
		rocks = game.add.group();
	    rocks.enableBody = true;
	    rocks.physicsBodyType = Phaser.Physics.ARCADE;
	    rocks.createMultiple(1, 'rock');
	    rocks.setAll('anchor.x', 0.5);
	    rocks.setAll('anchor.y', 1);
	    rocks.setAll('outOfBoundsKill', true);
	    rocks.setAll('checkWorldBounds', true);



	    pokes = game.add.group();
	    pokes.enableBody = true;
	    pokes.physicsBodyType = Phaser.Physics.ARCADE;
	    pokes.createMultiple(pokeCount, 'poke');
	    pokes.setAll('outOfBoundsKill', true);
	    pokes.setAll('checkWorldBounds', true);

	    // sprite.tint = Math.random() * 0xffffff;

	    


	    baddies = game.add.group();
	    baddies.enableBody = true;
	    baddies.physicsBodyType = Phaser.Physics.ARCADE;
	    baddies.createMultiple(baddieCount, 'baddie');
	    baddies.setAll('outOfBoundsKill', true);
	    baddies.setAll('checkWorldBounds', true);

	    doAllTimers();


	    the_end = game.add.sprite(0, 0, 'end');
		the_end.visible=false;
		// the_end.fixedToCamera=true;
	    the_end_lose = game.add.sprite(0, 0, 'end_lose');
		the_end_lose.visible=false;
		// the_end_lose.fixedToCamera=true;
	    
	}

	function update() {

    	game.physics.arcade.collide(baddies, platforms);
    	game.physics.arcade.collide(pokes, platforms);

	    //  Collide the player and the stars with the platforms
	    game.physics.arcade.collide(player, platforms);

	    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
	    // game.physics.arcade.overlap(player, stars, collectStar, null, this);
	    // game.physics.arcade.overlap(sword, stars, collectStar, null, this);

	    // game.physics.arcade.overlap(rocks, pokes, collectPoke, null, this);
	    game.physics.arcade.overlap(player, pokes, collectPoke, null, this);

	    game.physics.arcade.overlap(player, baddies, collectBaddie, null, this);
	    game.physics.arcade.overlap(baddies, pokes, collectBaddiePoke, null, this);



	    //  Reset the players velocity (movement)
	    // player.body.setZeroVelocity();
	    var swipeDirection = playerMovement(cursors, player);
	    
	    // swordSwipe(rockKey, sword, swipeDirection);

		// swordStickToParent(sword, player);


	    //  Allow the player to jump if they are touching the ground.
	    // if (cursors.up.isDown && player.body.touching.down)
	    // {
	    //     player.body.velocity.y = -350;
	    // }

        if (rockKey.isDown){
        	rock = rocks.getFirstExists(false);
        	if(rock){
        		rock.reset(player.body.x+13,player.body.y+18);
        		rock.lifespan = rockLifespan;
        		if(swipeDirection.includes("up")){
        			rock.body.velocity.y = -rockVel;
        		}else if(swipeDirection.includes("down")){
        			rock.body.velocity.y = rockVel;
        		}else if(swipeDirection.includes("left")){
        			rock.body.velocity.x = -rockVel;
        		}else if(swipeDirection.includes("right")){
        			rock.body.velocity.x = rockVel;
        		}else{
        			rock.body.velocity.y = rockVel;

        		}
        	}
        }


        if(cash <= 0){
        	//dead
        	player.kill();
        	cashText.text = "Click to Restart!";
        	game.input.onTap.addOnce(restart,this);
	    	// music.stop();
	    	the_end_lose.visible = true;
	    	game.camera.setPosition(0,0);
        }else if(cash >= cashWin){
        	player.kill();
        	cashText.text = "Click to Restart!";
        	game.input.onTap.addOnce(restart,this);
	    	// music.stop();

			the_end.visible = true;
	    	game.camera.setPosition(0,0);

        }else{
        	//??
        }
        
        


	}

	function doAllTimers(){
		aliveTimer = game.time.create(false);
	    aliveTimer.loop(1800, updateAlivePokes, this);
	    aliveTimer.start();

	    deadTimer = game.time.create(false);
	    deadTimer.loop(1900, updateDeadPokes, this);
	    deadTimer.start();

	    baddieTimer = game.time.create(false);
	    baddieTimer.loop(2000, updateBaddies, this);
	    baddieTimer.start();
	}

	function collectPoke (rock, poke) {
	    poke.kill();
	    cash += 1;
	    cashText.text = 'CASH: ' + cash;
	}
	function collectBaddie (player, baddie) {
	    baddie.kill();
	    cash -= baddieCash;
	    cashText.text = 'CASH: ' + cash;
	}
	function collectBaddiePoke (baddie, poke) {
	    poke.kill();
	}
	function killHouseOverlap(platforms, house) {
		house.destroy();
	}
	function processCallback() {
		return true;
	}

	function updateAlivePokes(){
		pokes.forEachAlive(function(poke){
        	// game.physics.arcade.velocityFromRotation(playerShip.rotation, 60, bullet.body.velocity);
        	// game.physics.arcade.velocityFromRotation(player.rotation, 60, poke.body.velocity);
        	var {x,y} = getRandVelocity();
        	poke.body.velocity.x += x;
        	poke.body.velocity.y += y;
        	// console.log(poke.body.velocity);
	    });
	}

	function updateDeadPokes(){
		pokes.forEachDead(function(poke){
			var {x,y} = getRandPosition();
        	poke.reset(x,y);
	    	poke.tint = pokeSkin[Math.floor(Math.random() * pokeSkin.length)];
	    	var {x,y} = getRandVelocity();
        	poke.body.velocity.x += x;
        	poke.body.velocity.y += y;
	    	// console.log(poke.body.position);
	    	poke.body.drag.x = pokeDrag;
	    	poke.body.drag.y = pokeDrag;
	    });
	}

	function updateBaddies(){
		baddies.forEachAlive(function(baddie){
        	// game.physics.arcade.velocityFromRotation(playerShip.rotation, 60, bullet.body.velocity);
        	// game.physics.arcade.velocityFromRotation(player.rotation, baddieHuntVel, baddie.body.velocity);
        	game.physics.arcade.moveToObject(baddie,player,baddieHuntVel);
	    	var {x,y} = getRandBoundVelocity(baddieVel);
        	baddie.body.velocity.x += x;
        	baddie.body.velocity.y += y;
        	// console.log(baddie.body.velocity);
	    });
		baddies.forEachDead(function(baddie){
			var {x,y} = getRandPosition();
        	baddie.reset(x,y);
		    baddie.tint = 0x6666ff;
        	game.physics.arcade.moveToObject(baddie,player,baddieHuntVel);
	    	var {x,y} = getRandBoundVelocity(baddieVel);
        	baddie.body.velocity.x += x;
        	baddie.body.velocity.y += y;
	    	// console.log(baddie.body.position);
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

	function getRandVelocity(){
		var x,y = 0;
		x = game.rnd.integerInRange(-pokeVel,pokeVel);
		y = game.rnd.integerInRange(-pokeVel,pokeVel);
		return {x,y};
	}
	function getRandBoundVelocity(bound){
		var x,y = 0;
		x = game.rnd.integerInRange(-bound,bound);
		y = game.rnd.integerInRange(-bound,bound);
		return {x,y};
	}



	function restart () {
		
	    console.log("restart");
		if(the_end){
			the_end.visible = false;
		}
		if(the_end_lose){
			the_end_lose.visible = false;
		}

	    //  A new level starts
	    cash = 10;
	    cashText.text = 'CASH: ' + cash;
	    //revives the player
	    player.revive();
	    //hides the text

		game.time.reset();

		pokes.removeAll();
		baddies.removeAll();

	    pokes.createMultiple(pokeCount, 'poke');
	    baddies.createMultiple(baddieCount, 'baddie');


	    doAllTimers();
	    console.log(baddieTimer.running);


	    // music.play();

	    console.log("restart_done: time:"+game.time.totalElapsedSeconds());



	}

}



// end hiding script from old browsers -->