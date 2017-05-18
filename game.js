window.addEventListener("load",function() {

	// Set up an instance of the Quintus engine and include
	// the Sprites, Scenes, Input and 2D module. The 2D module
	// includes the `TileLayer` class as well as the `2d` component.
	var Q = window.Q = Quintus()
		.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
		.setup({ 
			maximize: false, // Maximize only on touch devices
			width: 320, // Set the default width to 320 pixels
			height: 480, // Set the default height to 480 pixels
			
			//scaleToFit: true, // Scale the game to fit the screen of the player's device
			scaleToFit2: true, // Scale (using integer factors) the game to fit the screen of the player's device

			development: true
		})
  
		// And turn on default input controls and touch input (for UI)
		.controls().touch();


/********************************/
/***********ANIMATIONS***********/
/********************************/

	Q.animations('player anim', {
		stand: { frames: [0], rate: 1/4.5 },
		//stand_flipped: { frames: [0], rate: 1/4.5, flip: true }
		/*run_right: { frames: [3,2,1], rate: 1/4.5 }, 
		run_left: { frames: [17,16,15], rate:1/4.5 },
		//fire_right: { frames: [9,10,10], next: 'stand_right', rate: 1/30, trigger: "fired" },
		//fire_left: { frames: [20,21,21], next: 'stand_left', rate: 1/30, trigger: "fired" },
		stand_right: { frames: [0], loop: true },
		stand_left: { frames: [14], loop: true },
		fall_right: { frames: [4], loop: true },
		fall_left: { frames: [18], loop: true }*/
	});
	
/********************************/
/***********COMPONENTS***********/
/********************************/


/********************************/
/************SPRITES*************/
/********************************/

	/*
	Q.SPRITE_NONE = 0;
	Q.SPRITE_DEFAULT = 1;
	Q.SPRITE_PARTICLE = 2;
	Q.SPRITE_ACTIVE = 4;
	Q.SPRITE_FRIENDLY = 8;
	Q.SPRITE_ENEMY = 16;
	Q.SPRITE_UI = 32;
	Q.SPRITE_ALL = 0xFFFF;
	*/
	
	// ## Player Sprite
	// The very basic player sprite, this is just a normal sprite
	// using the player sprite sheet with default controls added to it.
	Q.Sprite.extend("Player",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				sheet: "stand_down",	// Setting a sprite sheet sets sprite width and height
				sprite: "player anim",
				x: 150,			// You can also set additional properties that can
				y: 380,				// be overridden on object creation
				gravity: 0,
				scale: 1,
				type: Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT
			});

			// Add in pre-made components to get up and running quickly
			// The `2d` component adds in default 2d collision detection
			// and kinetics (velocity, gravity)
			// The `topdownControls` its a custom controls module
			// It also checks to make sure the player is on a horizontal surface before
			// letting them jump.
			this.add('2d, topdownControls, animation');

			if (typeof this.p.minX !== 'undefined')
				this.p.minX += this.p.cx;
			if (typeof this.p.maxX !== 'undefined')
				this.p.maxX -= this.p.cx;

		},
		step: function(dt) {
			//console.log(this.p.direction);
			
			/*if(this.p.vx > 0) {
				this.play("run_right");
			} else if(this.p.vx < 0) {
				this.play("run_left");
			} else {*/
				this.customplay("stand_" + this.p.direction, "stand");
			/*}*/

			/*if(this.p.vx == 0)
				this.p.x = Math.round(this.p.x);*/
		},
		customplay: function(newSheet, newAnim) {
			if(newSheet.includes("_right")) {
				newSheet = newSheet.replace("_right", "_left");
				//newAnim += "_flipped";
				this.p.flip = "x";
			}

			if(this.p.sheet != newSheet)
				this.sheet(newSheet);
			this.play(newAnim);
		}
	});


/********************************/
/************SCENES**************/
/********************************/	

	Q.scene("level1",function(stage) {
		Q.stageTMX("level1.tmx",stage);

		/*SPAWN PLAYER*/
		var minX = 0, maxX = 60*34;
		var player = stage.insert(new Q.Player({minX: minX, maxX: maxX}));

		/*VIEWPORT*/
		stage.add("viewport").follow(player,{ x: true, y: false },{ minX: minX, maxX: maxX });
		stage.viewport.offsetX = -100;
		stage.viewport.offsetY = 155;
		stage.centerOn(150,380);
	});

	Q.UI.Text.extend("Lives",{
		init: function(p) {
			this._super({ label: "", x: Q.width/2-10, y: 10-Q.height/2, weight: 100, size: 20, family: "PressStart2P", color: "#FF0000", outlineWidth: 6, align: "right" });
			Q.state.on("change.lives",this,"lives");
			this.lives(Q.state.get("lives"));
		},
		lives: function(lives) {
			if(lives <= 5)
				this.p.label = "♥".repeat(lives);
			else
				this.p.label = lives+"x♥";
		}
	});

	Q.scene("gameStats",function(stage) {
		var container = stage.insert(new Q.UI.Container({ x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0)" }));
		var livesLabel = container.insert(new Q.Lives());
	});

	Q.scene('endGame',function(stage) {
		var container = stage.insert(new Q.UI.Container({ x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)" }));
		var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: "Play Again", font: "100 20px SuperMario", fontColor: "#000000", keyActionName:['confirm', 'fire', 'action']  }));
		var label = container.insert(new Q.UI.Text({x: 0, y: -10 - button.p.h, label: stage.options.label, family: "SuperMario", color: "#FFFFFF" }));
		
		button.on("click",function() {
			Q.clearStages();
			Q.stageScene('titleScreen');
		});

		button.on("push",function() {
			Q.clearStages();
			Q.stageScene('titleScreen');
		});

		container.fit(20);
	});

	Q.scene('titleScreen',function(stage) {
		var container = stage.insert(new Q.UI.Container({ x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)" }));
		var button = container.insert(new Q.UI.Button({ asset: "mainTitle.png", x: 0, y: 0, keyActionName:['confirm', 'fire', 'action'] }))
		var label = container.insert(new Q.UI.Text({x:0, y: 70, weight: 100, size: 24, family: "SuperMario", color: "#FFFFFF", outlineWidth: 4, label: "Start" }));
		
		button.on("click",function() {
			Q.clearStages();
			Q.state.reset({ level: 1, lives: 3 });
			Q.stageScene('level' + Q.state.get("level"));
			Q.stageScene("gameStats",1);
		});

		container.fit(20);
	});

/********************************/
/*************LOAD***************/
/********************************/

	Q.load("playerSheetTransparent.png, playerSpritesTransparent.json", function() {
		Q.compileSheets("playerSheetTransparent.png","playerSpritesTransparent.json");
		
		//Q.debug = true;
	});

	Q.loadTMX("level1.tmx, sprites.json", function() {
		Q.stageScene("level1");
	});
});