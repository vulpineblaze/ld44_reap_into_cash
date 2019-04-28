

function playerCreate(game, playerGroup){
    var player;
   	player = playerGroup.create(game.world.centerX, game.world.centerY, 'dude');
    player.name="dude"

	//  We need to enable physics on the player
    game.physics.arcade.enable(player);
    // game.physics.p2.enable(player, true);

    //  Player physics properties. Give the little guy a slight bounce.
    // player.body.bounce.y = 0.2;
    // player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.body.fixedRotation = true;

    // player.tint = 0x6666ff;

    // player.body.setCircle(18);

    // player.anchor.setTo(-0.5, 0.5);   


    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    //  Our two animations, walking left and right.
    player.animations.add('down', [0, 1, 2], 10, true);
    player.animations.add('up', [9,10,11], 10, true);
    player.animations.add('left', [3,4,5], 10, true);
    player.animations.add('right', [6,7,8], 10, true);

    // game.physics.p2.setPostBroadphaseCallback(checkVeg, this);
    // console.log("player.name="+player.name);

	return player;
}



function playerMovement(cursors, player){
	player.body.velocity.x *= 0.01;
    player.body.velocity.y *= 0.01;

    var swipeDirection = "";

    var isMoving=false;

    if (cursors.up.isDown)
    {
        player.body.velocity.y = -300;
        swipeDirection +='up';
        player.animations.play('up');
        isMoving=true;
    }
    
    if (cursors.down.isDown)
    {
        swipeDirection +='down';
        player.body.velocity.y = 300;
        player.animations.play('down');
        isMoving=true;
    }

    if (cursors.left.isDown)
    {
        swipeDirection +='left';
        player.body.velocity.x = -300;
        player.animations.play('left');
        isMoving=true;

    }
    
    if (cursors.right.isDown)
    {
        swipeDirection +='right';
        player.body.velocity.x =300;
        player.animations.play('right');
        isMoving=true;
    }
    
    if(!isMoving)
    {
        //  Stand still
        player.animations.stop();

        player.frame = 1;
    }
    return	swipeDirection	;
}
