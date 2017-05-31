window.addEventListener("load",function() {

	// Set up an instance of the Quintus engine and include
	// the Sprites, Scenes, Input and 2D module. The 2D module
	// includes the `TileLayer` class as well as the `2d` component.
	var Q = window.Q = Quintus()
		.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
		.setup("gameCanvas", { 
			maximize: false, // Maximize only on touch devices
			//width: 640, // Set the default width to 320 pixels
			//height: 960, // Set the default height to 480 pixels
			
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
		move_flipped: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], rate: 1/4.5, flip: "x" },
		move_back: { frames: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], rate: 1/4.5},
		move_back_flipped: { frames: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0], rate: 1/4.5, flip: "x" },
		slash_start: { frames: [0, 1, 2], rate: 1/15, loop: false, next: "slash_end", trigger: "inflictSlashDamage"},
		slash_start_flipped: { frames: [0, 1, 2], rate: 1/15, loop: false, flip: "x", next: "slash_end_flipped", trigger: "inflictSlashDamage" },
		slash_end: { frames: [3, 4, 5, 6, 7], rate: 1/15, loop: false, trigger: "stopSlashing"},
		slash_end_flipped: { frames: [3, 4, 5, 6, 7], rate: 1/15, loop: false, trigger: "stopSlashing", flip: "x" },
		shield: { frames: [0], rate: 1, loop: true},
		shield_flipped: { frames: [0], rate: 1, loop: true, flip: "x" },
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

	Q.animations('skeleton anim', {
		move: { frames: [0,1,2,3,4,5,6,7,8,9], rate: 1/4.5, flip: "x"},
		move_flipped: { frames: [0,1,2,3,4,5,6,7,8,9], rate: 1/4.5, flip: "x"}
	});

	Q.animations('skull anim', {
		move: { frames: [0,1], rate: 1/4.5, flip: "x"},
		move_flipped: { frames: [0,1], rate: 1/4.5, flip: "x"}
	});


	Q.animations('projectile anim', {
		fly_1: { frames: [0], rate: 1/4.5},
		fly_3: { frames: [0,1,2], rate: 1/4.5},
		fly_4dir_up: { frames: [0], rate: 1/4.5},
		fly_4dir_down: { frames: [1], rate: 1/4.5},
		fly_4dir_right: { frames: [2], rate: 1/4.5},
		fly_4dir_left: { frames: [3], rate: 1/4.5}
	});

	Q.animations('octorok anim', {
		move_down: { frames: [0,1], rate: 1/4.5},
		move_up: { frames: [2,3], rate: 1/4.5},
		move_left: { frames: [4,5], rate: 1/4.5},
		move_right: { frames: [6,7], rate: 1/4.5},
		ready: { frames: [0], rate: 3/2, next: "shoot"},
		shoot: { frames: [1], rate: 1/2, trigger: "fired", next: "ready"}
	});

	Q.animations('chest anim', {
		closed: { frames: [0], rate: 1/4.5, loop: false},
		opening: { frames: [1,2,3], rate: 1/2, loop: false, trigger: "showContent"},
		show_content_: { frames: [3], rate: 2, loop: false, trigger: "giveReward", next: "opened"},
		show_content_bow: { frames: [4], rate: 2, loop: false, trigger: "giveReward", next: "opened"},
		show_content_bomb: { frames: [5], rate: 2, loop: false, trigger: "giveReward", next: "opened"},
		show_content_shield: { frames: [6], rate: 2, loop: false, trigger: "giveReward", next: "opened"},
		opened: { frames: [3], rate: 1/4.5, loop: false}
	});

	Q.animations('bombThrown anim', {
		burn: { frames: [0], rate: 2, loop: false, trigger: "explode"}
	});

	Q.animations('explosion anim', {
		explode: { frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], rate: 1/10, loop: false, trigger: "endExplosion"}
	});
	
/********************************/
/***********COMPONENTS***********/
/********************************/

	Q.component('defaultEnemy', {
		added: function () {
			this.entity.p.collisionMask = Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT;
			this.entity.p.type = Q.SPRITE_ENEMY;
			this.entity.p.hp = 25;

			this.entity.on("die",this.entity,"die");

			this.entity.on("bump.left,bump.right,bump.top,bump.bottom",function(collision) {
				if(collision.obj.isA("Player")) { 
					/*console.log("x: " + collision.normalX);
					console.log("y: " + collision.normalY);*/
					collision.obj.loseHP(collision.normalX, collision.normalY, this);
				}
			});

			/*this.entity.on("bump.top",function(collision) {
				if(collision.obj.isA("Player")) { 
					this.play("die", 1);
					collision.obj.p.vy = -300;
					this.p.vx = 0;
				}
			});*/
		},
		extend: {	
			loseHP: function(damage, playerDir) {
				this.p.hp = Math.max(this.p.hp - damage, 0);
				if(this.p.hp == 0)
					this.die();
				else{	//knockback					
					this.p.ignoreControls = true; 
					var speedMult = -200;
					var normalX = 0;
					var normalY = 0;

					if(playerDir == "up")
						normalY = +1;
					else if(playerDir == "down")
						normalY = -1;
					else if(playerDir == "left")
						normalX = +1;
					else if(playerDir == "right")
						normalX = -1;

					this.p.vx = speedMult * normalX;
					this.p.vy = speedMult * normalY;
					this.animate({ vx: 0, vy: 0}, 0.25, {callback: function() { this.p.ignoreControls = false; }});
				}
			},
			die: function(p) {
				this.destroy();
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

		Q.component('customPlayAnim', {
		extend:{
			customplay: function(newSheet, newAnim) {
				/*if(newSheet.includes("_right")) {
					newSheet = newSheet.replace("_right", "_left");
					newAnim += "_flipped";
				} */

				var uniqueCase = false;

				if(this.p.name == "player"){

					if(newSheet.includes("stand_right") || newSheet.includes("move_right")) {
						newSheet = newSheet.replace("_right", "_left");
						newAnim += "_flipped";
						uniqueCase = true;
					} 
					else if(newSheet.includes("stand_left") || newSheet.includes("move_left")) {
						this.p.flip = false;
						uniqueCase = true;
					} 

				}

				if(!uniqueCase){
					if(newSheet.includes("_left")) {
						newSheet = newSheet.replace("_left", "_right");
						newAnim += "_flipped";
					} 
					else
						this.p.flip = false;
				}

				newSheet = this.p.name + "_" + newSheet;
				if(this.p.sheet != newSheet)
					this.sheet(newSheet);
				this.play(newAnim);
			}		
		}
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
				name: "player",
				sheet: "player_stand_down",	// Setting a sprite sheet sets sprite width and height
				sprite: "player anim",
				//x: 520,			// You can also set additional properties that can
				//y: 262,				// be overridden on object creation
				scale: 1,
				flip: false,
				items: [],
				type: Q.SPRITE_ACTIVE | Q.SPRITE_DEFAULT
			});

			// Add in pre-made components to get up and running quickly
			// The `2d` component adds in default 2d collision detection
			// and kinetics (velocity, gravity)
			// The `topdownControls` its a custom controls module
			// It also checks to make sure the player is on a horizontal surface before
			// letting them jump.
			this.add('2d, topdownControls, animation, tween, customPlayAnim');
    		this.on("stopSlashing",this,"stopSlashing");
    		this.on("inflictSlashDamage",this,"inflictSlashDamage");
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
			//console.log(Q.state.get("currentItem"));
			
			/*if(this.p.vx > 0) {
				this.play("run_right");
			} else if(this.p.vx < 0) {
				this.play("run_left");
			}*/ 


			this.p.shielding = false;

			if(this.p.justPressedAction && this.p.items.length != 0){

				if(this.p.items[Q.state.get("currentItem")%this.p.items.length] == "bow"){
					var arrowSpeed = 75;
					var locationX = this.p.x;
					var locationY = this.p.y;
					var speedX = 0;
					var speedY = 0;
					var margin = 5;
					if(this.p.direction == "up"){
						locationY -= (this.p.cy + margin);
						speedY = - arrowSpeed;
					} else if(this.p.direction == "down"){
						locationY += this.p.cy + margin;
						speedY = arrowSpeed;
					} else if(this.p.direction == "left"){
						locationX -= (this.p.cy + margin);
						speedX = - arrowSpeed;
					} else if(this.p.direction == "right"){
						locationX += this.p.cx + margin;
						speedX = arrowSpeed;
					}
					//Q.stage().insert(new Q.Arrow({x: locationX, y: locationY, vx: speedX, vy: speedY, dir: this.p.direction}));
					Q.stage().insert(new Q.Octorok_rok({x: locationX, y: locationY, vx: speedX, vy: speedY}));
				}
				else if(this.p.items[Q.state.get("currentItem")%this.p.items.length] == "bomb"){
					var grav = 100;
					var throwSpeed = 50;
					var margin = 5;

					var locationX = this.p.x;
					var locationY = this.p.y;

					var speedX = 0;
					var speedY = -throwSpeed;

					if(this.p.direction == "up"){
						locationY -= (this.p.cy + margin);
						speedY = - throwSpeed;
						grav = 0.25*grav;
					} else if(this.p.direction == "down"){
						locationY += this.p.cy + margin;
						speedY = throwSpeed;
						grav = -0.25*grav;
					} else if(this.p.direction == "left"){
						locationX -= (this.p.cy + margin);
						speedX = - throwSpeed;
					} else if(this.p.direction == "right"){
						locationX += this.p.cx + margin;
						speedX = throwSpeed;
					}

					Q.stage().insert(new Q.Bomb({x: locationX, y: locationY, vx: speedX, vy: speedY, gravityY: grav}));
				}
			}

			if(this.p.holdingAction && this.p.items.length != 0){
				if(this.p.items[Q.state.get("currentItem")%this.p.items.length] == "shield"){
					this.p.shielding = true;
					this.customplay("shield_" + this.p.direction, "shield");
				}
			}

			if(!this.p.shielding){
				if(this.p.newSlash){
					this.p.newSlash = false;
					this.p.midSlash = true;
					this.customplay("slash_" + this.p.direction, "slash_start");
				}

				if(!this.p.midSlash) {
					if(this.p.vx != 0 | this.p.vy != 0) {
						this.customplay("move_" + this.p.direction, "move");
					} else {
						this.customplay("stand_" + this.p.direction, "stand");
					}
				}
			}

			if(this.p.vx == 0)
				this.p.x = Math.round(this.p.x);

			if(this.p.vy == 0)
				this.p.y = Math.round(this.p.y);
		},
		loseHP: function(normalX, normalY, enemy) {
			//console.log("x: " + normalX + "  y: " + normalY);

			var attackSide = "down";	//y=1
			if(normalY == -1)
				attackSide = "up";
			else if(normalX == -1)
				attackSide = "left";
			if(normalY == 1)
				attackSide = "right";

			if(this.p.shielding && this.p.direction == attackSide) {
				if(enemy != undefined)
					enemy.loseHP(0, attackSide);
			}

			else {
				Q.state.dec("lives",1);
				
				/********GOD MODE***********/
				if(Q.state.get("lives") == 0)
					Q.state.inc("lives",1);

				this.p.ignoreControlsSoft = true; 
				//this.p.newSlash = false;
				//this.p.midSlash = false;
				//this.p.justSlashEnd = false;

				var speedMult = -200;
				this.p.vx = speedMult * normalX;
				this.p.vy = speedMult * normalY;

				/*if(normalX == 1)
					this.customplay("move_right", "move_back");
				else if(normalX == -1)
					this.customplay("move_left", "move_back");
				else if(normalY == 1)
					this.customplay("move_down", "move_back_flipped");
				else
					this.customplay("move_up", "move_back");*/

				this.animate({ vx: 0, vy: 0}, 0.25, {callback: function() { this.p.ignoreControlsSoft = false; }});
			}
		},
		inflictSlashDamage: function() {
			var swordDamage = 10;
			var areaRadius = 10;
			var areaCenterX = this.p.x;
			var areaCenterY = this.p.y;
			if(this.p.direction == "up"){
				areaCenterY -= this.p.cy + areaRadius;
			} else if(this.p.direction == "down"){
				areaCenterY += this.p.cy + areaRadius;
			} else if(this.p.direction == "left"){
				areaCenterX -= this.p.cx + areaRadius;
			} else if(this.p.direction == "right"){
				areaCenterX += this.p.cx + areaRadius;
			}

			var minX = areaCenterX - areaRadius;
			var maxX = areaCenterX + areaRadius;
			var minY = areaCenterY - areaRadius;
			var maxY = areaCenterY + areaRadius;

			var dir = this.p.direction;

			var allEnemies = Q(".defaultEnemy");
			allEnemies.each(function(range) {
				var minX = range[0];
				var maxX = range[1];
				var minY = range[2];
				var maxY = range[3];
				if(this.p.x+this.p.cx >= minX && this.p.x-this.p.cx <= maxX && this.p.y+this.p.cy >= minY && this.p.y-this.p.cy <= maxY) {
					this.loseHP(swordDamage, dir);
				}
			}, [minX, maxX, minY, maxY], swordDamage, dir); 
		},
		stopSlashing: function() {
			this.p.midSlash = false;			
			this.p.justSlashEnd = true;
		}
	});

	Q.Sprite.extend("Octorok",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				name: "octorok",
				sheet: "octorok_red",
				sprite: "octorok anim",
				proyectileSpeed: 100
			});

			// Add in pre-made components to get up and running quickly
			this.add('2d, animation, tween, defaultEnemy, aiShoot');
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
				collision.obj.loseHP(collision.normalX, collision.normalY, undefined);
			}
		}
	});

	Q.Sprite.extend("Skeleton",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				name: "skeleton",
				sheet: "skeleton_move_down",
				sprite: "skeleton anim"
			});

			// Add in pre-made components to get up and running quickly
			this.add('2d, animation, tween, defaultEnemy, aiChase, customPlayAnim');
		}
	});

	Q.Sprite.extend("Skull",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				name: "skull",
				sheet: "skull_move_down",
				sprite: "skull anim"
			});

			// Add in pre-made components to get up and running quickly
			this.add('2d, animation, tween, defaultEnemy, aiChase, customPlayAnim');
		}
	});

	Q.Sprite.extend("Chest",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				sheet: "chest",
				sprite: "chest anim",
				chestContent: "",
				opened: false,
				points: [[-14,1],[14,1],[14,30],[-14,30]],
				type: Q.SPRITE_FRIENDLY
			});

			this.add('2d, animation');
			this.play("closed");

			this.on("hit",this,"collision");
			this.on("showContent",this,"showContent");
			this.on("giveReward",this,"giveReward");
		},
		collision: function(collision) {
			if(!this.p.opened && collision.obj.isA("Player")) { 
				this.p.opened = true;
				this.play("opening");
				this.p.toPlayer = collision.obj;
			}
		},
		showContent: function(collision) {
			this.play("show_content_" + this.p.chestContent);
		},
		giveReward: function(collision) {
			this.p.toPlayer.p.items.push(this.p.chestContent);
			var currentIndex = Q.state.get("currentItem");
			var desiredIndex = this.p.toPlayer.p.items.length - 1;
			if(desiredIndex == 0)	//first item
				Q.state.inc("currentItem",1);
			else if (desiredIndex-currentIndex == 0)
				Q.state.inc("currentItem",this.p.toPlayer.p.items.length);
			else
				Q.state.inc("currentItem",desiredIndex-currentIndex);
		}

	});

	Q.Sprite.extend("Bomb",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				sheet: "bombThrown",
				sprite: "bombThrown anim",
				type: Q.SPRITE_FRIENDLY | Q.SPRITE_ACTIVE |Q.SPRITE_ENEMY
			});

			this.add('2d, animation');
			this.play("burn");

			this.on("explode",this,"explode");
		},
		explode: function(collision) {
			this.destroy();


			Q.stage().insert(new Q.Explosion({x: this.p.x, y: this.p.y}));

			var bombDamage = 1000;
			var areaRadius = 15;
			var areaCenterX = this.p.x;
			var areaCenterY = this.p.y;

			var minX = areaCenterX - areaRadius;
			var maxX = areaCenterX + areaRadius;
			var minY = areaCenterY - areaRadius;
			var maxY = areaCenterY + areaRadius;

			var allEnemies = Q(".defaultEnemy");
			allEnemies.each(function(range) {
				var minX = range[0];
				var maxX = range[1];
				var minY = range[2];
				var maxY = range[3];
				if(this.p.x+this.p.cx >= minX && this.p.x-this.p.cx <= maxX && this.p.y+this.p.cy >= minY && this.p.y-this.p.cy <= maxY) {
					var dir = "down";	//TODO
					this.loseHP(bombDamage, dir);
				}
			}, [minX, maxX, minY, maxY], bombDamage); 
		}

	});

	Q.Sprite.extend("Explosion",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				sheet: "explosion",
				sprite: "explosion anim",
				type: Q.SPRITE_FRIENDLY | Q.SPRITE_ACTIVE |Q.SPRITE_ENEMY
			});

			this.add('animation');
			this.play("explode");

			this.on("endExplosion",this,"endExplosion");
		},
		endExplosion: function(p) {
			this.destroy();
		}

	});

	Q.Sprite.extend("Arrow",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				sheet: "arrow",
				sprite: "projectile anim",
				dir: ""
			});

			// Add in pre-made components to get up and running quickly
			this.add('2d, animation, projectile');
			this.on("hit",this,"collision");
			this.play("fly_4dir_" + this.p.dir);
		},
		collision: function(collision) {
			this.destroy();

			if(collision.obj.defaultEnemy != undefined) { 
					var attackSide = "down";	//y=1
				if(normalY == -1)
					attackSide = "up";
				else if(normalX == -1)
					attackSide = "left";
				if(normalY == 1)
					attackSide = "right";

				collision.obj.loseHP(20, attackSide);
			}
		}
	});

	Q.Sprite.extend("Gate",{

		// the init constructor is called on creation
		init: function(p) {
			// You can call the parent's constructor with this._super(..)
			this._super(p, {
				sheet: "gate",
				sensor: true,
				collisionMask: Q.SPRITE_FRIENDLY,
			});

			// Add in pre-made components to get up and running quickly
			// The `2d` component adds in default 2d collision detection
			// and kinetics (velocity, gravity)
			this.on("sensor");

		},
		sensor: function(collision) {
			if(collision.isA("Player")) { 
				Q.clearStages();
				Q.stageScene('titleScreen');
			}
		}
	});


/********************************/
/************SCENES**************/
/********************************/	

	Q.scene("level1",function(stage) {
		Q.stageTMX("level1.tmx",stage);

		stage.insert(new Q.Gate({x: 1216, y: 1232}));
		
		/*SPAWN PLAYER*/
		var player = stage.insert(new Q.Player({x: 520, y: 260}));

		Q.stage().insert(new Q.Arrow({x: 500, y: 500, vx: 0, vy: 0, dir: "left"}));

		/*CHESTS*/
		stage.insert(new Q.Chest({x: 584, y: 204, chestContent:"shield"}));
		stage.insert(new Q.Chest({x: 513, y: 998, chestContent:"bow"}));
		stage.insert(new Q.Chest({x: 1345, y: 572, chestContent:"bomb"}));

		/*SPAWN ENEMIES*/

		stage.insert(new Q.Skull({x: 690, y: 485}));
		stage.insert(new Q.Skull({x: 615, y: 615}));
		stage.insert(new Q.Skull({x: 679, y: 905}));
		stage.insert(new Q.Octorok({x: 867, y: 1081}));
		stage.insert(new Q.Octorok({x: 1184, y: 715}));
		stage.insert(new Q.Skeleton({x: 1411, y: 685}));
		stage.insert(new Q.Skeleton({x: 1284, y: 838}));
		stage.insert(new Q.Skeleton({x: 1121, y: 1279}));
		stage.insert(new Q.Skeleton({x: 1372, y: 1536}));


		/*stage.insert(new Q.Octorok({x: 300, y: 300}));
		stage.insert(new Q.Skeleton({x: 400, y: 400}));
		stage.insert(new Q.Skull({x: 430, y: 430}));*/


		/*VIEWPORT*/
		var vp = stage.add("viewport");
		vp.follow(player,{ x: true, y: true },{});
		vp.viewport.scale = 1;
		//stage.viewport.offsetX = -100;
		//stage.viewport.offsetY = 155;
		stage.centerOn(150,380);
	});

	Q.UI.Text.extend("LivesHUD",{
		init: function(p) {
			this._super({ label: "", x: 10-Q.width/2, y: 10-Q.height/2, weight: 100, size: 30, family: "PressStart2P", color: "#FF0000", outlineWidth: 6, align: "left" });
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

	Q.UI.Text.extend("ItemHUD",{
		init: function(p) {
			this._super({ label: "", x: Q.width/2-10, y: 10-Q.height/2, weight: 100, size: 30, family: "PressStart2P", color: "#FF0000", outlineWidth: 6, align: "right" });
			Q.state.on("change.currentItem",this,"currentItem");
			this.currentItem(Q.state.get("currentItem"));
		},
		currentItem: function(currentItem) {
			var player = Q("Player").first();
        	if(player != undefined) {
        		var current = "";
        		if(player.p.items.length != 0){
        			var index = Math.abs(currentItem%player.p.items.length);
					current = player.p.items[index];
        		}

				this.p.label = current;
			}
		}
	});

	Q.scene("HUD",function(stage) {
		//var container = stage.insert(new Q.UI.Container({ x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0)" }));
		//var livesLabel = container.insert(new Q.Lives());

		var container = stage.insert(new Q.UI.Container({ x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0)" }));
		var label = container.insert(new Q.UI.Text({x:Q.width/2, y: Q.height/2, weight: 0, size: 0, family: "SuperMario", color: "#FFFFFF", outlineWidth: 4, label: "." }));
		var livesLabel = container.insert(new Q.LivesHUD());
		var itemLabel = container.insert(new Q.ItemHUD());


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
		var imgw = Q.assets["mainTitle.jpg"].width;
		var imgh = Q.assets["mainTitle.jpg"].height;
		var imgScale = Math.min(Q.width/imgw, Q.height/imgh);

		var container = stage.insert(new Q.UI.Container({ x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)" }));
		var button = container.insert(new Q.UI.Button({ asset: "mainTitle.jpg", x: 0, y: 0, scale: imgScale, keyActionName:['confirm', 'fire', 'action'] }))
		var label = container.insert(new Q.UI.Text({x:0, y: 70, weight: 100, size: 24, family: "SuperMario", color: "#FFFFFF", outlineWidth: 4, label: "Start" }));
		
		button.on("click",function() {
			Q.clearStages();
			Q.state.reset({ level: 1, lives: 5, currentItem: 0 });
			Q.stageScene('level' + Q.state.get("level"));
			Q.stageScene("HUD",1);
		});

		container.fit(20);
	});

/********************************/
/*************LOAD***************/
/********************************/

	Q.load("playerSheetTransparent.png, playerSpritesTransparent.json, playerSheetPink.gif, playerSpritesPink.json, swordAttack.png, swordAttack.json, shield.png, shield.json, octorok.png, octorok.json, skeletonMovement.png, skeletonMovement.json, skullMovement.png, skullMovement.json, mainTitle.jpg, overworld.png, overworld.json, chest.png, chest.json, bombThrown.png, bombThrown.json, explosion.png, explosion.json, arrow.png, arrow.json", function() {
		Q.compileSheets("playerSheetTransparent.png", "playerSpritesTransparent.json");
		//Q.compileSheets("playerSheetPink.gif", "playerSpritesPink.json");
		Q.compileSheets("swordAttack.png", "swordAttack.json");
		Q.compileSheets("shield.png", "shield.json");
		Q.compileSheets("octorok.png", "octorok.json");
		Q.compileSheets("skeletonMovement.png", "skeletonMovement.json");
		Q.compileSheets("skullMovement.png", "skullMovement.json");
		Q.compileSheets("overworld.png", "overworld.json");
		Q.compileSheets("chest.png", "chest.json");
		Q.compileSheets("bombThrown.png", "bombThrown.json");
		Q.compileSheets("explosion.png", "explosion.json");
		Q.compileSheets("arrow.png", "arrow.json");
		
		Q.loadTMX("level1.tmx", function() {
			/*Q.stageScene("level1");
			Q.stageScene("HUD", 1);*/
			Q.stageScene('titleScreen');
		});

		//Q.debug = true;
	}, {
		progressCallback: function(loaded,total) {
			var element = document.getElementById("loading_progress");
			element.style.width = Math.floor(loaded/total*100) + "%";
		}
	});

});