var drawGhostSprite = (function(){
    
    // add top of the ghost head to the current canvas path
    var addHead = (function() {

        // pixel coordinates for the top of the head
        // on the original arcade ghost sprite

        return function(ctx) {
            var i;
            ctx.save();

            // translate by half a pixel to the right
            // to try to force centering
            ctx.translate(0.5,0);

            ctx.moveTo(0,6);
            ctx.quadraticCurveTo(1.5,0,6.5,0);
            ctx.quadraticCurveTo(11.5,0,13,6);

            // draw lines between pixel coordinates
            /*
            ctx.moveTo(coords[0],coords[1]);
            for (i=2; i<coords.length; i+=2)
                ctx.lineTo(coords[i],coords[i+1]);
            */

            ctx.restore();
        };
    })();

    // add first ghost animation frame feet to the current canvas path
    var addFeet1 = (function(){

        // pixel coordinates for the first feet animation
        // on the original arcade ghost sprite
        var coords = [
            13,13,
            11,11,
            9,13,
            8,13,
            8,11,
            5,11,
            5,13,
            4,13,
            2,11,
            0,13,
        ];

        return function(ctx) {
            var i;
            ctx.save();

            // translate half a pixel right and down
            // to try to force centering and proper height
            ctx.translate(0.5,0.5);

            // continue previous path (assuming ghost head)
            // by drawing lines to each of the pixel coordinates
            for (i=0; i<coords.length; i+=2)
                ctx.lineTo(coords[i],coords[i+1]);

            ctx.restore();
        };

    })();

    // add second ghost animation frame feet to the current canvas path
    var addFeet2 = (function(){

        // pixel coordinates for the second feet animation
        // on the original arcade ghost sprite
        var coords = [
            13,12,
            12,13,
            11,13,
            9,11,
            7,13,
            6,13,
            4,11,
            2,13,
            1,13,
            0,12,
        ];

        return function(ctx) {
            var i;
            ctx.save();

            // translate half a pixel right and down
            // to try to force centering and proper height
            ctx.translate(0.5,0.5);

            // continue previous path (assuming ghost head)
            // by drawing lines to each of the pixel coordinates
            for (i=0; i<coords.length; i+=2)
                ctx.lineTo(coords[i],coords[i+1]);

            ctx.restore();
        };

    })();

    // draw regular ghost eyes
    var addEyes = function(ctx,dirEnum){
        var i;

        ctx.save();
        ctx.translate(2,3);

        var coords = [
            0,1,
            1,0,
            2,0,
            3,1,
            3,3,
            2,4,
            1,4,
            0,3
        ];

        var drawEyeball = function() {
            ctx.translate(0.5,0.5);
            ctx.beginPath();
            ctx.moveTo(coords[0],coords[1]);
            for (i=2; i<coords.length; i+=2)
                ctx.lineTo(coords[i],coords[i+1]);
            ctx.closePath();
            ctx.fill();
            ctx.lineJoin = 'round';
            ctx.stroke();
            ctx.translate(-0.5,-0.5);
            //ctx.fillRect(1,0,2,5); // left
            //ctx.fillRect(0,1,4,3);
        };

        var DIR_UP = 0;
        var DIR_LEFT = 1;
        var DIR_DOWN = 2;
        var DIR_RIGHT = 3;

        // translate eye balls to correct position
        if (dirEnum == DIR_LEFT) ctx.translate(-1,0);
        else if (dirEnum == DIR_RIGHT) ctx.translate(1,0);
        else if (dirEnum == DIR_UP) ctx.translate(0,-1);
        else if (dirEnum == DIR_DOWN) ctx.translate(0,1);

        // draw eye balls
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 1.0;
        ctx.lineJoin = 'round';
        drawEyeball();
        ctx.translate(6,0);
        drawEyeball();

        // translate pupils to correct position
        if (dirEnum == DIR_LEFT) ctx.translate(0,2);
        else if (dirEnum == DIR_RIGHT) ctx.translate(2,2);
        else if (dirEnum == DIR_UP) ctx.translate(1,0);
        else if (dirEnum == DIR_DOWN) ctx.translate(1,3);

        // draw pupils
        ctx.fillStyle = "#00F";
        ctx.fillRect(0,0,2,2); // right
        ctx.translate(-6,0);
        ctx.fillRect(0,0,2,2); // left

        ctx.restore();
    };

    // draw scared ghost face
    var addScaredFace = function(ctx,flash){
        ctx.strokeStyle = ctx.fillStyle = flash ? "#F00" : "#FF0";

        // eyes
        ctx.fillRect(4,5,2,2);
        ctx.fillRect(8,5,2,2);

        // mouth
        var coords = [
            1,10,
            2,9,
            3,9,
            4,10,
            5,10,
            6,9,
            7,9,
            8,10,
            9,10,
            10,9,
            11,9,
            12,10,
        ];
        ctx.translate(0.5,0.5);
        ctx.beginPath();
        ctx.moveTo(coords[0],coords[1]);
        for (i=2; i<coords.length; i+=2)
            ctx.lineTo(coords[i],coords[i+1]);
        ctx.lineWidth = 1.0;
        ctx.stroke();
        ctx.translate(-0.5,-0.5);
        /*
        ctx.fillRect(1,10,1,1);
        ctx.fillRect(12,10,1,1);
        ctx.fillRect(2,9,2,1);
        ctx.fillRect(6,9,2,1);
        ctx.fillRect(10,9,2,1);
        ctx.fillRect(4,10,2,1);
        ctx.fillRect(8,10,2,1);
        */
    };


    return function(ctx,x,y,frame,dirEnum,scared,flash,eyes_only,color) {
        ctx.save();
        ctx.translate(x-7,y-7);

        if (scared)
            color = flash ? "#FFF" : "#2121ff";

        if (!eyes_only) {
            // draw body
            ctx.beginPath();
            addHead(ctx);
            if (frame == 0)
                addFeet1(ctx);
            else
                addFeet2(ctx);
            ctx.closePath();
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = color;
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.fillStyle = color;
            ctx.fill();
        }

        // draw face
        if (scared)
            addScaredFace(ctx, flash);
        else
            addEyes(ctx,dirEnum);

        ctx.restore();
    };
})();

// draw points displayed when pac-man eats a ghost or a fruit
var drawPacPoints = (function(){
    var ctx;
    var color;

    var plotOutline = function(points,color) {
        var len = points.length;
        var i;
        ctx.beginPath();
        ctx.moveTo(points[0],points[1]);
        for (i=2; i<len; i+=2) {
            ctx.lineTo(points[i],points[i+1]);
        }
        ctx.closePath();
        ctx.lineWidth = 1.0;
        ctx.lineCap = ctx.lineJoin = "round";
        ctx.strokeStyle = color;
        ctx.stroke();
    };

    var plotLine = function(points,color) {
        var len = points.length;
        var i;
        ctx.beginPath();
        ctx.moveTo(points[0],points[1]);
        for (i=2; i<len; i+=2) {
            ctx.lineTo(points[i],points[i+1]);
        }
        ctx.lineWidth = 1.0;
        ctx.lineCap = ctx.lineJoin = "round";
        ctx.strokeStyle = color;
        ctx.stroke();
    };

    var draw0 = function(x,y) {
        ctx.save();
        ctx.translate(x,y);
        plotOutline([
            1,0,
            2,0,
            3,1,
            3,5,
            2,6,
            1,6,
            0,5,
            0,1,
        ],color);
        ctx.restore();
    };

    var draw1narrow = function(x,y) {
        plotLine([x,y,x,y+6],color);
    };

    var draw1 = function(x,y) {
        ctx.save();
        ctx.translate(x,y);
        plotLine([
            0,1,
            1,0,
            1,6,
            0,6,
            2,6,
        ],color);
        ctx.restore();
    };

    var draw2 = function(x,y) {
        ctx.save();
        ctx.translate(x,y);
        plotLine([
            0,2,
            0,1,
            1,0,
            3,0,
            4,1,
            4,2,
            0,6,
            4,6,
        ],color);
        ctx.restore();
    };

    var draw3 = function(x,y) {
        ctx.save();
        ctx.translate(x,y);
        plotLine([
            0,0,
            4,0,
            2,2,
            4,4,
            4,5,
            3,6,
            1,6,
            0,5,
        ],color);
        ctx.restore();
    };

    var draw4 = function(x,y) {
        ctx.save();
        ctx.translate(x,y);
        plotLine([
            3,6,
            3,0,
            0,3,
            0,4,
            4,4,
        ],color);
        ctx.restore();
    };

    var draw5 = function(x,y) {
        ctx.save();
        ctx.translate(x,y);
        plotLine([
            4,0,
            0,0,
            0,2,
            3,2,
            4,3,
            4,5,
            3,6,
            1,6,
            0,5,
        ],color);
        ctx.restore();
    };

    var draw6 = function(x,y) {
        ctx.save();
        ctx.translate(x,y);
        plotLine([
            3,0,
            1,0,
            0,1,
            0,5,
            1,6,
            2,6,
            3,5,
            3,3,
            0,3,
        ],color);
        ctx.restore();
    };

    var draw7 = function(x,y) {
        ctx.save();
        ctx.translate(x,y);
        plotLine([
            0,1,
            0,0,
            4,0,
            4,1,
            2,4,
            2,6,
        ],color);
        ctx.restore();
    };

    var draw8 = function(x,y) {
        ctx.save();
        ctx.translate(x,y);
        plotOutline([
            1,0,
            3,0,
            4,1,
            4,2,
            3,3,
            1,3,
            0,4,
            0,5,
            1,6,
            3,6,
            4,5,
            4,4,
            3,3,
            1,3,
            0,2,
            0,1,
        ],color);
        ctx.restore();
    };

    var draw100 = function() {
        draw1(-5,-3);
        draw0(-1,-3);
        draw0(4,-3);
    };

    var draw200 = function() {
        draw2(-7,-3);
        draw0(-1,-3);
        draw0(4,-3);
    };

    var draw300 = function() {
        draw3(-7,-3);
        draw0(-1,-3);
        draw0(4,-3);
    };
    
    var draw400 = function() {
        draw4(-7,-3);
        draw0(-1,-3);
        draw0(4,-3);
    };

    var draw500 = function() {
        draw5(-7,-3);
        draw0(-1,-3);
        draw0(4,-3);
    };

    var draw700 = function() {
        draw7(-7,-3);
        draw0(-1,-3);
        draw0(4,-3);
    };

    var draw800 = function() {
        draw8(-7,-3);
        draw0(-1,-3);
        draw0(4,-3);
    };

    var draw1000 = function() {
        draw1(-8,-3);
        draw0(-4,-3);
        draw0(1,-3);
        draw0(6,-3);
    };
    
    var draw1600 = function() {
        draw1narrow(-7,-3);
        draw6(-5,-3);
        draw0(0,-3);
        draw0(5,-3);
    };

    var draw2000 = function() {
        draw2(-10,-3);
        draw0(-4,-3);
        draw0(1,-3);
        draw0(6,-3);
    };

    var draw3000 = function() {
        draw3(-10,-3);
        draw0(-4,-3);
        draw0(1,-3);
        draw0(6,-3);
    };

    var draw5000 = function() {
        draw5(-10,-3);
        draw0(-4,-3);
        draw0(1,-3);
        draw0(6,-3);
    };

    return function(_ctx,x,y,points,_color) {
        ctx = _ctx;
        color = _color;

        ctx.save();
        ctx.translate(x+0.5,y+0.5);
        ctx.translate(0,-1);

        var f = {
            100: draw100,
            200: draw200,
            300: draw300,
            400: draw400,
            500: draw500,
            700: draw700,
            800: draw800,
            1000: draw1000,
            1600: draw1600,
            2000: draw2000,
            3000: draw3000,
            5000: draw5000,
        }[points];

        if (f) {
            f();
        }

        ctx.restore();
    };
})();

// draw pacman body
var drawPacmanSprite = function(ctx,x,y,dirEnum,angle,mouthShift,scale,centerShift,alpha,color,rot_angle) {

    if (mouthShift == undefined) mouthShift = 0;
    if (centerShift == undefined) centerShift = 0;
    if (scale == undefined) scale = 1;
    if (alpha == undefined) alpha = 1;

    if (color == undefined) {
        color = "rgba(255,255,0," + alpha + ")";
    }

    ctx.save();
    ctx.translate(x,y);
    ctx.scale(scale,scale);
    if (rot_angle) {
        ctx.rotate(rot_angle);
    }
    var DIR_UP = 0;
    var DIR_LEFT = 1;
    var DIR_DOWN = 2;
    var DIR_RIGHT = 3;
    // rotate to current heading direction
    var d90 = Math.PI/2;
    if (dirEnum == DIR_UP) ctx.rotate(3*d90);
    else if (dirEnum == DIR_RIGHT) ctx.rotate(0);
    else if (dirEnum == DIR_DOWN) ctx.rotate(d90);
    else if (dirEnum == DIR_LEFT) ctx.rotate(2*d90);

    // plant corner of mouth
    ctx.beginPath();
    ctx.moveTo(-3+mouthShift,0);

    // draw head outline
    ctx.arc(centerShift,0,6.5,angle,2*Math.PI-angle);
    ctx.closePath();

    //ctx.strokeStyle = color;
    //ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
};

// draw giant pacman body
var drawGiantPacmanSprite = function(ctx,x,y,dirEnum,frame) {

    var color = "#FF0";
    var mouthShift = 0;
    var angle = 0;
    if (frame == 1) {
        mouthShift = -4;
        angle = Math.atan(7/14);
    }
    else if (frame == 2) {
        mouthShift = -2;
        angle = Math.atan(13/9);
    }

    ctx.save();
    ctx.translate(x,y);

    // rotate to current heading direction
    var d90 = Math.PI/2;
    if (dirEnum == DIR_UP) ctx.rotate(3*d90);
    else if (dirEnum == DIR_RIGHT) ctx.rotate(0);
    else if (dirEnum == DIR_DOWN) ctx.rotate(d90);
    else if (dirEnum == DIR_LEFT) ctx.rotate(2*d90);

    // plant corner of mouth
    ctx.beginPath();
    ctx.moveTo(mouthShift,0);

    // draw head outline
    ctx.arc(0,0,16,angle,2*Math.PI-angle);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
};


//Draw fruits

var drawCherry = function(ctx,x,y) {

    // cherry
    var cherry = function(x,y) {
        ctx.save();
        ctx.translate(x,y);

        // red fruit
        ctx.beginPath();
        ctx.arc(2.5,2.5,3,0,Math.PI*2);
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.fillStyle = "#ff0000";
        ctx.fill();

        // white shine
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(1,3);
        ctx.lineTo(2,4);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.restore();
    };

    ctx.save();
    ctx.translate(x,y);

    // draw both cherries
    cherry(-6,-1);
    cherry(-1,1);

    // draw stems
    ctx.beginPath();
    ctx.moveTo(-3,0);
    ctx.bezierCurveTo(-1,-2, 2,-4, 5,-5);
    ctx.lineTo(5,-4);
    ctx.bezierCurveTo(3,-4, 1,0, 1,2);
    ctx.strokeStyle = "#ff9900";
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();
};

var drawStrawberry = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // red body
    ctx.beginPath();
    ctx.moveTo(-1,-4);
    ctx.bezierCurveTo(-3,-4,-5,-3, -5,-1);
    ctx.bezierCurveTo(-5,3,-2,5, 0,6);
    ctx.bezierCurveTo(3,5, 5,2, 5,0);
    ctx.bezierCurveTo(5,-3, 3,-4, 0,-4);
    ctx.fillStyle = "#f00";
    ctx.fill();
    ctx.strokeStyle = "#f00";
    ctx.stroke();

    // white spots
    var spots = [
        {x:-4,y:-1},
        {x:-3,y:2 },
        {x:-2,y:0 },
        {x:-1,y:4 },
        {x:0, y:2 },
        {x:0, y:0 },
        {x:2, y:4 },
        {x:2, y:-1 },
        {x:3, y:1 },
        {x:4, y:-2 } ];

    ctx.fillStyle = "#fff";
    var i,len;
    for (i=0, len=spots.length; i<len; i++) {
        var s = spots[i];
        ctx.beginPath();
        ctx.arc(s.x,s.y,0.75,0,2*Math.PI);
        ctx.fill();
    }

    // green leaf
    ctx.beginPath();
    ctx.moveTo(0,-4);
    ctx.lineTo(-3,-4);
    ctx.lineTo(0,-4);
    ctx.lineTo(-2,-3);
    ctx.lineTo(-1,-3);
    ctx.lineTo(0,-4);
    ctx.lineTo(0,-2);
    ctx.lineTo(0,-4);
    ctx.lineTo(1,-3);
    ctx.lineTo(2,-3);
    ctx.lineTo(0,-4);
    ctx.lineTo(3,-4);
    ctx.closePath();
    ctx.strokeStyle = "#00ff00";
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // stem
    ctx.beginPath();
    ctx.moveTo(0,-4);
    ctx.lineTo(0,-5);
    ctx.lineCap = 'round';
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.restore();
};

var drawOrange = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // orange body
    ctx.beginPath();
    ctx.moveTo(-2,-2);
    ctx.bezierCurveTo(-3,-2, -5,-1, -5,1);
    ctx.bezierCurveTo(-5,4, -3,6, 0,6);
    ctx.bezierCurveTo(3,6, 5,4, 5,1);
    ctx.bezierCurveTo(5,-1, 3,-2, 2,-2);
    ctx.closePath();
    ctx.fillStyle="#ffcc33";
    ctx.fill();
    ctx.strokeStyle = "#ffcc33";
    ctx.stroke();

    // stem
    ctx.beginPath();
    ctx.moveTo(-1,-1);
    ctx.quadraticCurveTo(-1,-2,-2,-2);
    ctx.quadraticCurveTo(-1,-2,-1,-4);
    ctx.quadraticCurveTo(-1,-2,0,-2);
    ctx.quadraticCurveTo(-1,-2,-1,-1);
    ctx.strokeStyle = "#ff9900";
    ctx.lineJoin = 'round';
    ctx.stroke();

    // green leaf
    ctx.beginPath();
    ctx.moveTo(-0.5,-4);
    ctx.quadraticCurveTo(0,-5,1,-5);
    ctx.bezierCurveTo(2,-5, 3,-4,4,-4);
    ctx.bezierCurveTo(3,-4, 3,-3, 2,-3);
    ctx.bezierCurveTo(1,-3,1,-4,-0.5,-4);
    ctx.strokeStyle = "#00ff00";
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.fillStyle = "#00ff00";
    ctx.fill();

    ctx.restore();
};

var drawApple = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // red fruit
    ctx.beginPath();
    ctx.moveTo(-2,-3);
    ctx.bezierCurveTo(-2,-4,-3,-4,-4,-4);
    ctx.bezierCurveTo(-5,-4,-6,-3,-6,0);
    ctx.bezierCurveTo(-6,3,-4,6,-2.5,6);
    ctx.quadraticCurveTo(-1,6,-1,5);
    ctx.bezierCurveTo(-1,6,0,6,1,6);
    ctx.bezierCurveTo(3,6, 5,3, 5,0);
    ctx.bezierCurveTo(5,-3, 3,-4, 2,-4);
    ctx.quadraticCurveTo(0,-4,0,-3);
    ctx.closePath();
    ctx.fillStyle = "#ff0000";
    ctx.fill();

    // stem
    ctx.beginPath();
    ctx.moveTo(-1,-3);
    ctx.quadraticCurveTo(-1,-5, 0,-5);
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ff9900';
    ctx.stroke();

    // shine
    ctx.beginPath();
    ctx.moveTo(2,3);
    ctx.quadraticCurveTo(3,3, 3,1);
    ctx.lineCap = 'round';
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    ctx.restore();
};

var drawMelon = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // draw body
    ctx.beginPath();
    ctx.arc(0,2,5.5,0,Math.PI*2);
    ctx.fillStyle = "#7bf331";
    ctx.fill();

    // draw stem
    ctx.beginPath();
    ctx.moveTo(0,-4);
    ctx.lineTo(0,-5);
    ctx.moveTo(2,-5);
    ctx.quadraticCurveTo(-3,-5,-3,-6);
    ctx.strokeStyle="#69b4af";
    ctx.lineCap = "round";
    ctx.stroke();
    var spots = [
        0,-2,
        -1,-1,
        -2,0,
        -3,1,
        -4,2,
        -3,3,
        -2,4,
        -1,5,
        -2,6,
        -3,-1,
        1,7,
        2,6,
        3,5,
        2,4,
        1,3,
        0,2,
        1,1,
        2,0,
        3,-1,
        3,1,
        4,2,
         ];

    ctx.fillStyle="#69b4af";
    var i,len;
    for (i=0, len=spots.length; i<len; i+=2) {
        var x = spots[i];
        var y = spots[i+1];
        ctx.beginPath();
        ctx.arc(x,y,0.65,0,2*Math.PI);
        ctx.fill();
    }

    // white spots
    var spots = [
        {x: 0,y:-3},
        {x:-2,y:-1},
        {x:-4,y: 1},
        {x:-3,y: 3},
        {x: 1,y: 0},
        {x:-1,y: 2},
        {x:-1,y: 4},
        {x: 3,y: 2},
        {x: 1,y: 4},
         ];

    ctx.fillStyle = "#fff";
    var i,len;
    for (i=0, len=spots.length; i<len; i++) {
        var s = spots[i];
        ctx.beginPath();
        ctx.arc(s.x,s.y,0.65,0,2*Math.PI);
        ctx.fill();
    }

    ctx.restore();
};

var drawGalaxian = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // draw yellow body
    ctx.beginPath();
    ctx.moveTo(-4,-2);
    ctx.lineTo(4,-2);
    ctx.lineTo(4,-1);
    ctx.lineTo(2,1);
    ctx.lineTo(1,0);
    ctx.lineTo(0,0);
    ctx.lineTo(0,5);
    ctx.lineTo(0,0);
    ctx.lineTo(-1,0);
    ctx.lineTo(-2,1);
    ctx.lineTo(-4,-1);
    ctx.closePath();
    ctx.lineJoin = 'round';
    ctx.strokeStyle = ctx.fillStyle = '#fffa36';
    ctx.fill();
    ctx.stroke();

    // draw red arrow head
    ctx.beginPath();
    ctx.moveTo(0,-5);
    ctx.lineTo(-3,-2);
    ctx.lineTo(-2,-2);
    ctx.lineTo(-1,-3);
    ctx.lineTo(0,-3);
    ctx.lineTo(0,-1);
    ctx.lineTo(0,-3);
    ctx.lineTo(1,-3);
    ctx.lineTo(2,-2);
    ctx.lineTo(3,-2);
    ctx.closePath();
    ctx.lineJoin = 'round';
    ctx.strokeStyle = ctx.fillStyle = "#f00";
    ctx.fill();
    ctx.stroke();

    // draw blue wings
    ctx.beginPath();
    ctx.moveTo(-5,-4);
    ctx.lineTo(-5,-1);
    ctx.lineTo(-2,2);
    ctx.moveTo(5,-4);
    ctx.lineTo(5,-1);
    ctx.lineTo(2,2);
    ctx.strokeStyle = "#00f";
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.restore();
};

var drawBell = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // bell body
    ctx.beginPath();
    ctx.moveTo(-1,-5);
    ctx.bezierCurveTo(-4,-5,-6,1,-6,6);
    ctx.lineTo(5,6);
    ctx.bezierCurveTo(5,1,3,-5,0,-5);
    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle = "#fffa37";
    ctx.stroke();
    ctx.fill();

    // marks
    ctx.beginPath();
    ctx.moveTo(-4,4);
    ctx.lineTo(-4,3);
    ctx.moveTo(-3,1);
    ctx.quadraticCurveTo(-3,-2,-2,-2);
    ctx.moveTo(-1,-4);
    ctx.lineTo(0,-4);
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // bell bottom
    ctx.beginPath();
    ctx.rect(-5.5,6,10,2);
    ctx.fillStyle = "#68b9fc";
    ctx.fill();
    ctx.beginPath();
    ctx.rect(-0.5,6,2,2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.restore();
};

var drawKey = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // draw key metal
    ctx.beginPath();
    ctx.moveTo(-1,-2);
    ctx.lineTo(-1,5);
    ctx.moveTo(0,6);
    ctx.quadraticCurveTo(1,6,1,3);
    ctx.moveTo(1,4);
    ctx.lineTo(2,4);
    ctx.moveTo(1,1);
    ctx.lineTo(1,-2);
    ctx.moveTo(1,0);
    ctx.lineTo(2,0);
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // draw key top
    ctx.beginPath();
    ctx.moveTo(0,-6);
    ctx.quadraticCurveTo(-3,-6,-3,-4);
    ctx.lineTo(-3,-2);
    ctx.lineTo(3,-2);
    ctx.lineTo(3,-4);
    ctx.quadraticCurveTo(3,-6, 0,-6);
    ctx.strokeStyle = ctx.fillStyle = "#68b9fc";
    ctx.fill();
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1,-5);
    ctx.lineTo(-1,-5);
    ctx.lineCap = 'round';
    ctx.strokeStyle = "#000";
    ctx.stroke();

    ctx.restore();
};

var drawPretzel = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // bread
    ctx.beginPath();
    ctx.moveTo(-2,-5);
    ctx.quadraticCurveTo(-4,-6,-6,-4);
    ctx.quadraticCurveTo(-7,-2,-5,1);
    ctx.quadraticCurveTo(-3,4,0,5);
    ctx.quadraticCurveTo(5,5,5,-1);
    ctx.quadraticCurveTo(6,-5,3,-5);
    ctx.quadraticCurveTo(1,-5,0,-2);
    ctx.quadraticCurveTo(-2,3,-5,5);
    ctx.moveTo(1,1);
    ctx.quadraticCurveTo(3,4,4,6);
    ctx.lineWidth = 2.0;
    ctx.lineCap = 'round';
    ctx.strokeStyle = "#ffcc33";
    ctx.stroke();

    // salt
    var spots = [
        -5,-6,
        1,-6,
        4,-4,
        -5,0,
        -2,0,
        6,1,
        -4,6,
        5,5,
         ];

    ctx.fillStyle = "#fff";
    var i,len;
    for (i=0, len=spots.length; i<len; i+=2) {
        var x = spots[i];
        var y = spots[i+1];
        ctx.beginPath();
        ctx.arc(x,y,0.65,0,2*Math.PI);
        ctx.fill();
    }

    ctx.restore();
};

var drawPear = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // body
    ctx.beginPath();
    ctx.moveTo(0,-4);
    ctx.bezierCurveTo(-1,-4,-2,-3,-2,-1);
    ctx.bezierCurveTo(-2,1,-4,2,-4,4);
    ctx.bezierCurveTo(-4,6,-2,7,0,7);
    ctx.bezierCurveTo(2,7,4,6,4,4);
    ctx.bezierCurveTo(4,2,2,1,2,-1);
    ctx.bezierCurveTo(2,-3,1,-4,0,-4);
    ctx.fillStyle = ctx.strokeStyle = "#00ff00";
    ctx.stroke();
    ctx.fill();

    // blue shine
    ctx.beginPath();
    ctx.moveTo(-2,3);
    ctx.quadraticCurveTo(-2,5,-1,5);
    ctx.strokeStyle = "#0033ff";
    ctx.lineCap = 'round';
    ctx.stroke();

    // white stem
    ctx.beginPath();
    ctx.moveTo(0,-4);
    ctx.quadraticCurveTo(0,-6,2,-6);
    ctx.strokeStyle = "#fff";
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();
};

var drawBanana = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // body
    ctx.beginPath();
    ctx.moveTo(-5,5);
    ctx.quadraticCurveTo(-4,5,-2,6);
    ctx.bezierCurveTo(2,6,6,2,6,-4);
    ctx.lineTo(3,-3);
    ctx.lineTo(3,-2);
    ctx.lineTo(-4,5);
    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle = "#ffff00";
    ctx.stroke();
    ctx.fill();

    // stem
    ctx.beginPath();
    ctx.moveTo(4,-5);
    ctx.lineTo(5,-6);
    ctx.strokeStyle="#ffff00";
    ctx.lineCap='round';
    ctx.stroke();

    // black mark
    ctx.beginPath();
    ctx.moveTo(3,-1);
    ctx.lineTo(-2,4);
    ctx.strokeStyle = "#000";
    ctx.lineCap='round';
    ctx.stroke();

    // shine
    ctx.beginPath();
    ctx.moveTo(2,3);
    ctx.lineTo(0,5);
    ctx.strokeStyle = "#fff";
    ctx.lineCap='round';
    ctx.stroke();

    ctx.restore();
};

var drawCookie = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // body
    ctx.beginPath();
    ctx.arc(0,0,6,0,Math.PI*2);
    ctx.fillStyle = "#f9bd6d";
    //ctx.fillStyle = "#dfab68";
    ctx.fill();

    // chocolate chips
    var spots = [
        0,-3,
        -4,-1,
        0,2,
        3,0,
        3,3,
         ];

    ctx.fillStyle = "#000";
    var i,len;
    for (i=0, len=spots.length; i<len; i+=2) {
        var x = spots[i];
        var y = spots[i+1];
        ctx.beginPath();
        ctx.arc(x,y,0.75,0,2*Math.PI);
        ctx.fill();
    }

    ctx.restore();
};

var drawCookieFlash = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);

    // body
    ctx.beginPath();
    ctx.arc(0,0,6,0,Math.PI*2);
    ctx.fillStyle = "#000";
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#f9bd6d";
    ctx.fill();
    ctx.stroke();

    // chocolate chips
    var spots = [
        0,-3,
        -4,-1,
        0,2,
        3,0,
        3,3,
         ];

    ctx.fillStyle = "#f9bd6d";
    var i,len;
    for (i=0, len=spots.length; i<len; i+=2) {
        var x = spots[i];
        var y = spots[i+1];
        ctx.beginPath();
        ctx.arc(x,y,0.75,0,2*Math.PI);
        ctx.fill();
    }

    ctx.restore();
};

var getSpriteFuncFromFruitName = function(name) {
    var funcs = {
        'cherry': drawCherry,
        'strawberry': drawStrawberry,
        'orange': drawOrange,
        'apple': drawApple,
        'melon': drawMelon,
        'galaxian': drawGalaxian,
        'bell': drawBell,
        'key': drawKey,
        'pretzel': drawPretzel,
        'pear': drawPear,
        'banana': drawBanana,
        'cookie': drawCookie,
    };

    return funcs[name];
};


var drawRewindSymbol = function(ctx,x,y,color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x,y);

    var s = 3;
    var drawTriangle = function(x) {
        ctx.beginPath();
        ctx.moveTo(x,s);
        ctx.lineTo(x-2*s,0);
        ctx.lineTo(x,-s);
        ctx.closePath();
        ctx.fill();
    };
    drawTriangle(0);
    drawTriangle(2*s);

    ctx.restore();
};

var drawUpSymbol = function(ctx,x,y,color) {
    ctx.save();
    ctx.translate(x,y);
    var s = tileSize;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0,-s/2);
    ctx.lineTo(s/2,s/2);
    ctx.lineTo(-s/2,s/2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};

var drawDownSymbol = function(ctx,x,y,color) {
    ctx.save();
    ctx.translate(x,y);
    var s = tileSize;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0,s/2);
    ctx.lineTo(s/2,-s/2);
    ctx.lineTo(-s/2,-s/2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};

var drawExclamationPoint = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = ctx.fillStyle = "#ff0";
    ctx.beginPath();
    ctx.moveTo(-1,1);
    ctx.bezierCurveTo(-1,0,-1,-3,0,-3);
    ctx.lineTo(2,-3);
    ctx.bezierCurveTo(2,-2,0,0,-1,1);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-2,3,0.5,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
};

