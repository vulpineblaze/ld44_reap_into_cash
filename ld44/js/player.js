
var playerVel = 300;

function playerCreate(game, playerGroup){
    var player;
   	player = playerGroup.create(game.world.centerX, game.world.centerY, 'reap');
    player.name="reap"

    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;

    player.body.fixedRotation = true;

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    player.animations.add('down', [0, 1, 2], 10, true);
    player.animations.add('up', [9,10,11], 10, true);
    player.animations.add('left', [3,4,5], 10, true);
    player.animations.add('right', [6,7,8], 10, true);

	return player;
}



function playerMovement(game, cursors, player){

    if(game.input.activePointer.isDown && game.physics.arcade.distanceToPointer(player) > 10){
        game.physics.arcade.moveToPointer(player, playerVel*150);
    }

	player.body.velocity.x *= 0.01;
    player.body.velocity.y *= 0.01;

    var swipeDirection = "";

    var isMoving=false;

    if (cursors.up.isDown||cursors.w.isDown)
    {
        player.body.velocity.y = -playerVel;
        swipeDirection +='up';
        player.animations.play('up');
        isMoving=true;
    }
    
    if (cursors.down.isDown||cursors.s.isDown)
    {
        swipeDirection +='down';
        player.body.velocity.y = playerVel;
        player.animations.play('down');
        isMoving=true;
    }

    if (cursors.left.isDown||cursors.a.isDown)
    {
        swipeDirection +='left';
        player.body.velocity.x = -playerVel;
        player.animations.play('left');
        isMoving=true;

    }
    
    if (cursors.right.isDown||cursors.d.isDown)
    {
        swipeDirection +='right';
        player.body.velocity.x =playerVel;
        player.animations.play('right');
        isMoving=true;
    }
    
    if(!isMoving)
    {
        player.animations.stop();
        player.frame = 1;
    }
    return	swipeDirection	;
}
