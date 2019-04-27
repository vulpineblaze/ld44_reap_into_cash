function swordCreate(game,playerGroup){
    var sword;
    var offset = {x:30,y:30};
   	sword = playerGroup.create(playerGroup.x + offset.x, 
                                playerGroup.y + offset.y, 
                                    'sword');
    sword.name = 'sword';
	//  We need to enable physics on the player
    game.physics.arcade.enable(sword);
    // sword.physicsBodyType = Phaser.Physics.P2JS;
    // game.physics.p2.enable(sword, true);
    // sword.body.collideWorldBounds = true;
    // sword.enableBody = true;
    // sword.physicsBodyType = Phaser.Physics.P2JS;

    //  Player physics properties. Give the little guy a slight bounce.
    // player.body.bounce.y = 0.2;
    // player.body.gravity.y = 300;

    // sword.body.setCircle(18);
    // sword.body.fixedRotation = true;
    // sword.anchor.setTo(-0.5, 0.5);

    //  Our two animations, walking left and right.
    // sword.animations.add('swipe', [0, 1, 2, 3], 10, false);
    // sword.animations.add('right', [5, 6, 7, 8], 10, true);

    // game.physics.p2.setPostBroadphaseCallback(checkSwordHit, this);
    // sword.anchor.setTo(-0.0, -0.4);
    sword.pivot.x = sword.width * .5;
    sword.pivot.y = sword.height;
    // sword.pivot.y = 180;
    // sword.pivot.x = -5;

	return sword;
}

var rotateMax = 3.1;
var rotateMin = 0;
var rotateStep = 0.4;
var lastDir = 'right';

function swordSwipe(swordKey, sword, swipeDirection){
    var swipeShift = {x:30,y:1};

    if(!swipeDirection.includes(lastDir) && swipeDirection != ''){
        console.log("changed dir:"+lastDir  +" to "+swipeDirection  );
        if(swipeDirection.includes("left")){
            sword.body.x -= swipeShift.x;
            sword.scale.x *= -1;
            lastDir='left';
        }else if(swipeDirection.includes("right")){
            sword.body.x += swipeShift.x;
            sword.scale.x *= -1;
            lastDir='right';
        }
        console.log("last dir now:"+lastDir  );

    }

    if (swordKey.isDown)
    {
        sword.body.enable = true;
        // sword.animations.play('swipe');
        console.log("SAPACEBAR pressed" + sword.rotation);

        if(swipeDirection.includes("left")){

            sword.rotation -= rotateStep;
            // sword.rotation -= rotateStep;
            // if(sword.rotation > rotateMax){
            //     sword.rotation = rotateMin;
            // }

        }else if(swipeDirection.includes("right")){
                //right
            sword.rotation += rotateStep;
            // sword.rotation -= rotateStep;
        }else{
            if(lastDir.includes("left")){
                sword.rotation -= rotateStep;
            }else if(lastDir.includes("right")){
                sword.rotation += rotateStep;
            }
        }


        if(sword.rotation > rotateMax || sword.rotation < -rotateMax ){
            sword.rotation = rotateMin;
        }
        
        // if(sword.rotation < rotateMin){
        //     sword.rotation = rotateMax;
        // }

    }else{
        sword.body.enable = false;
        sword.rotation = rotateMin;
        // sword.rotation = rotateMax;

        // sword.animations.stop();

        // sword.frame = 5;
    }
}



function swordStickToParent(sword, player){
    // sword.x = player.x;
    // sword.y = player.y;
    // sword.body.x = player.x;
    // sword.body.y = player.y;
    // sword.body.velocity.x = 0;
    // sword.body.velocity.y = 0;
    // console.log("sword stick " + sword.position + player.position);

}


function checkSwordHit(body1, body2) {

    //  To explain - the post broadphase event has collected together all potential collision pairs in the world
    //  It doesn't mean they WILL collide, just that they might do.

    //  This callback is sent each collision pair of bodies. It's up to you how you compare them.
    //  If you return true then the pair will carry on into the narrow phase, potentially colliding.
    //  If you return false they will be removed from the narrow phase check all together.

    //  In this simple example if one of the bodies is our space ship, 
    //  and the other body is the green pepper sprite (frame ID 4) then we DON'T allow the collision to happen.
    //  Usually you would use a collision mask for something this simple, but it demonstates use.
    console.log(" body1 test!! " +body1.sprite.name+ "|"+ body1.position);
    console.log(" body2 test!! " +body2.sprite.name+ "|"+ body2.position);

    if ((body1.sprite.name === 'sword' && body2.sprite.name === 'star') || (body2.sprite.name === 'sword' && body1.sprite.name === 'star'))
    {
        return true;
        console.log(" star hit!! " +body1.sprite.name+ "|" + body1.position);

    }

    return false;

}