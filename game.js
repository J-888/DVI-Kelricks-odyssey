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
		.controls(true);

	Q.gravityY = 0;
/********************************/
/***********ANIMATIONS***********/
/********************************/

	Q.animations('player anim', {
		stand: { frames: [0], rate: 1/4.5, flip: false },
		stand_flipped: { frames: [0], rate: 1/4.5, flip: "x" },
		move: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], rate: 1/4.5},
		move_flipped: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], rate: 1/4.5, flip: "x" }
		/*run_right: { frames: [3,2,1], rate: 1/4.5 }, 
		run_left: { frames: [17,16,15], rate:1/4.5 },
		//fire_right: { frames: [9,10,10], next: 'stand_right', rate: 1/30, trigger: "fired" },
		//fire_left: { frames: [20,21,21], next: 'stand_left', rate: 1/30, trigger: "fired" },
		stand_right: { frames: [0], loop: true },
		stand_left: { frames: [14], loop: true },
		fall_right: { frames: [4], loop: true },
		fall_left: { frames: [18], loop: true }*/
	});

	Q.animations('octorok anim', {
		move_down: { frames: [0,1], rate: 1/4.5},
		move_up: { frames: [2,3], rate: 1/4.5},
		move_left: { frames: [4,5], rate: 1/4.5},
		move_right: { frames: [6,7], rate: 1/4.5},
		ready: { frames: [0], rate: 3/2, next: "shoot"},
		shoot: { frames: [1], rate: 1/2, trigger: "fired", next: "ready"}
	});


	Q.animations('projectile anim', {
		fly_3: { frames: [0,1,2], rate: 1/4.5}
	});
	
/********************************/
/***********COMPONENTS***********/
/********************************/

	Q.component('defaultEnemy', {
		added: function () {
			this.entity.p.collisionMask = Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT;
			this.entity.p.type = Q.SPRITE_ENEMY;

			this.entity.on("die",this.entity,"die");

			this.entity.on("bump.left,bump.right,bump.bottom",function(collision) {
				if(collision.obj.isA("Player")) { 
					collision.obj.receiveDamage();
				}
			});

			this.entity.on("bump.top",function(collision) {
				if(collision.obj.isA("Player")) { 
					this.play("die", 1);
					collision.obj.p.vy = -300;
					this.p.vx = 0;
				}
			});
		},
		extend: {
			die: function(p) {
				this.destroy();
				Q.state.inc("score",200);
			}
		}
	});

	Q.component('projectile', {
		added: function () {
			this.entity.p.collisionMask = Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT;
			this.entity.p.type = Q.SPRITE_ENEMY;

			//this.entity.on("hit",this.entity,"collision");
		}/*,
		collision: function(collision) {
			if(collision.obj.isA("Mario")) { 
				collision.obj.destroy();
				if(Q.state.get("level") == 2)
					Q.stageScene("endGame",1, { label: "You Win" });
				else {
					Q.state.inc("level",1);
					Q.stageScene('level' + Q.state.get("level"));
				}
			}
			else
				this.entity.destroy();
		}*/
	});

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
				scale: 1,
				flip: false,
				type: Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT
			});

			// Add in pre-made components to get up and running quickly
			// The `2d` component adds in default 2d collision detection
			// and kinetics (velocity, gravity)
			// The `topdownControls` its a custom controls module
			// It also checks to make sure the player is on a horizontal surface before
			// letting them jump.
			this.add('2d, topdownControls, animation');
			//Q.stage().insert(new Q.SlashHitArea({x: this.p.x + 10, y:  this.p.y + 10, player: this.p}));

			if (typeof this.p.minX !== 'undefined')
				this.p.minX += this.p.cx;
			if (typeof this.p.maxX !== 'undefined')
				this.p.maxX -= this.p.cx;

		},
		step: function(dt) {
			//console.log("dir:" + this.p.lastdirection);
			//console.log("vx:" + this.p.vx);
			//console.log("vy:" + this.p.vy);
			
			/*if(this.p.vx > 0) {
				this.play("run_right");
			} else if(this.p.vx < 0) {
				this.play("run_left");
			}*/ 

			if(this.p.slashing){
				this.p.newSlash = false;
				this.p.slashing = true;
				console.log("slashing");
			}

			//if(this.p.stepping) {
			if(this.p.vx != 0 | this.p.vy != 0) {
				this.customplay("move_" + this.p.direction, "move");
			} else {
				this.customplay("stand_" + this.p.direction, "stand");
			}

			if(this.p.vx == 0)
				this.p.x = Math.round(this.p.x);

			if(this.p.vy == 0)
				this.p.y = Math.round(this.p.y);
		},
		customplay: function(newSheet, newAnim) {
			if(newSheet.includes("_right")) {
				newSheet = newSheet.replace("_right", "_left");
				newAnim += "_flipped";
			} 
			else
				this.p.flip = false;

			if(this.p.sheet != newSheet)
				this.sheet(newSheet);
			this.play(newAnim);
		},
		hit: function() {
			Q.state.dec("lives",1);
		}
	});

	Q.Sprite.extend("SlashHitArea",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				sheet: "octorok_red",
				sprite: "octorok anim",
				sx: 10,
				sy: 10,
				scale: 1,
				flip: false,
				type: Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT,
				sensor: true
			});

			this.add("2d, animation")

			// Add in pre-made components to get up and running quickly
			// The `2d` component adds in default 2d collision detection
			// and kinetics (velocity, gravity)
			// The `topdownControls` its a custom controls module
			// It also checks to make sure the player is on a horizontal surface before
			// letting them jump.
			this.on("sensor");

		},
		sensor: function(collision) {
			console.log("slash");
			if(!this.p.collected && collision.isA("Mario")) { 
				this.p.collected = true;
				Q.state.inc("score",200);
				this.animate({y: this.p.y-50}, 0.3, Q.Easing.Linear, { callback: function(){ this.destroy() } });
				//this.animate({y: this.p.y-50}, 0.3, Q.Easing.Quadratic.Out, { callback: function(){ this.destroy() } });
			}
		},
		step: function(collision) {
			this.p.x = this.p.player.x;
			this.p.y = this.p.player.y;
		}
	});

	Q.Sprite.extend("Octorok",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				sheet: "octorok_red",
				sprite: "octorok anim",
				proyectileSpeed: 100
			});

			// Add in pre-made components to get up and running quickly
			this.add('2d, animation, defaultEnemy, aiShoot');
			//this.play("run");
    		this.on("fired",this,"launchBullet");
		},
		launchBullet: function(){
			var locationX = this.p.x;
			var locationY = this.p.y;
			var speedX = 0;
			var speedY = 0;
			var margin = 5;
			if(this.p.facing == "up"){
				locationY -= (this.p.cy + margin);
				speedY = - this.p.proyectileSpeed;
			} else if(this.p.facing == "down"){
				locationY += this.p.cy + margin;
				speedY = this.p.proyectileSpeed;
			} else if(this.p.facing == "left"){
				locationX -= (this.p.cy + margin);
				speedX = - this.p.proyectileSpeed;
			} else if(this.p.facing == "right"){
				locationX += this.p.cx + margin;
				speedX = this.p.proyectileSpeed;
			}
			Q.stage().insert(new Q.Octorok_rok({x: locationX, y: locationY, vx: speedX, vy: speedY}));
		}
	});

	Q.Sprite.extend("Octorok_rok",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				sheet: "octorok_rok",
				sprite: "projectile anim"
			});

			// Add in pre-made components to get up and running quickly
			this.add('2d, animation, projectile');
			this.on("hit",this,"collision");
			this.play("fly_3");
		},
		collision: function(collision) {
			this.destroy();

			if(collision.obj.isA("Player")) { 
				collision.obj.hit();
				/*if(Q.state.get("lives") == 0)
					Q.stageScene("endGame",1, { label: "You Win" });
				else {
					Q.state.inc("level",1);
					Q.stageScene('level' + Q.state.get("level"));
				}*/
			}
		}
	});


/********************************/
/************SCENES**************/
/********************************/	

	Q.scene("level1",function(stage) {
		Q.stageTMX("level1.tmx",stage);

		/*SPAWN PLAYER*/
		/*var minX = 0, maxX = 60*34;
		var player = stage.insert(new Q.Player({minX: minX, maxX: maxX}));*/

		
		var player = stage.insert(new Q.Player({minX: 0, maxX: 1000}));

		stage.insert(new Q.Octorok({x: 300, y: 300}));

		/*VIEWPORT*/
		//stage.add("viewport").follow(player,{ x: true, y: true },{ minX: minX, maxX: maxX });
		stage.add("viewport").follow(player,{ x: true, y: true },{ minX: 0, maxX: 1000 });
		//stage.viewport.offsetX = -100;
		//stage.viewport.offsetY = 155;
		//stage.centerOn(150,380);
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
			//Q.stageScene('level' + Q.state.get("level"));
			Q.stageScene("gameStats",1);
		});

		container.fit(20);
	});

/********************************/
/*************LOAD***************/
/********************************/

	Q.load("playerSheetTransparent.png, playerSpritesTransparent.json, octorok.png, octorok.json", function() {
		Q.compileSheets("playerSheetTransparent.png","playerSpritesTransparent.json");
		Q.compileSheets("octorok.png","octorok.json");
		
		Q.loadTMX("level1.tmx, sprites.json", function() {
			Q.stageScene("level1");
			Q.stageScene("gameStats",1);
		});

		Q.debug = true;
	});

});