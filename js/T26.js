/*function(){
	return{};只提供这些接口
}的结构可以达到封装的效果，以此来降低模块与模块之间的耦合
*/
(function () {
	var SPACESHIP_SIZE = 30,
		SPACESHIP_SPEED = 2,
		SPACESHIP_POWER = 100,
		SPACESHIP_COUNT = 4,
		DEFAULT_CHARGE_RATE = 0.2,
		DEFAULT_DISCHARGE_RATE = 0.3,
		POWERBAR_POS_OFFSET = 5;//电量条的高度
		WELL_POWER_COLOR = '#70ed3f';
		GENERAL_POWER_COLOR = '#FCCD1F';
		BAD_POWER_COLOR = '#FB0000';
		POWERBAR_WIDTH = 5;
		SCREEN_WIDTH  = 800;
		SCREEN_HEIGHT = 800;
		SCREEN_CENTER_X = SCREEN_WIDTH/2;
		SCREEN_CENTER_Y = SCREEN_HEIGHT/2;
		PLANET_RADIUS = 50;
		ORBIT_COUNT = 4;
		FAILURE_RATE = 0.3;
		requestAnimationFrAME = window.requestAnimationFrame || window.mozRequestAnimation || window.webkitRequestAnimationFrame || msRequestAnimationFrame

	function Spaceship(id) {
		this.currentState = 'stop';
		this.id = id;
		this.power = 100;
		this.mediator = null;
		this.deg = 0;
		this.orbit = 100 + 50*id - SPACESHIP_SIZE/2;
		this.timer = null;
	}

	Spaceship.prototype.stateManager = function (){
			var self = this,
				states = {
					fly : function (state) {
						self.currentState = 'fly';
						self.forceSystem().fly();
						self.powerManager().disCharge();
					},
					stop:function (state) {
						self.currentState = 'stop';
						self.forceSystem().stop();
						self.powerManager().charge();
					},
					destroy:function (state) {
						self.currentState = 'destroy';
						self.destroy();
					}
				},
				changeState = function (state) {
					/*console.log(states[state]);*/
					if (states[state] && states[state]()) {
						ConsoleUtil.show('Spaceship No.'+(self.id+1)+" 'state is " + state);
					}
				};
				//封装之后，提供一个唯一的出口
				return {
					changeState : changeState
				};
	};
	Spaceship.prototype.forceSystem = function () {
			var self = this,
				fly = function () {
					ConsoleUtil.show('Spaceship No.'+(self.id+1) + ' is flying!');
					self.timer = setInterval(function () {
						self.deg += SPACESHIP_SPEED;
						if (self.deg >= 360) {
							self.deg = 0;
						}
					},20);
				},
				stop = function () {
					clearInterval(self.timer);
					ConsoleUtil.show('Spaceship No.'+(self.id+1)+' stopped!');
				};
			return {
				fly : fly,
				stop : stop
			};
		};
		//封装之后比较优雅
		Spaceship.prototype.powerManager = function () {
			var self = this,
				charge = function () {
					var chargeRate = DEFAULT_CHARGE_RATE,
						timer = setInterval(function () {
							if (self.currentState === 'fly' || self.currentState === 'destroy') {
								clearInterval(timer);								
							}
							if (self.power >= 100) {
								self.power = 100;
								clearInterval(timer);																
							}
							self.power += chargeRate;							
						},20);
						ConsoleUtil.show('Spaceship No.' + (self.id+1) + ' is charging');
				};
				//放电
				disCharge = function () {					
					var timer = setInterval(function () {						
						if(self.currentState === 'stop' || self.currentState === 'destroy'){
							clearInterval(timer);							
						}
						if (self.power <= 0) {
							self.power = 0;
							self.stateManager().changeState('stop');
							clearInterval(timer);							
						}
						self.power -= DEFAULT_DISCHARGE_RATE;
					},20);
					ConsoleUtil.show('Spaceship No.' + (self.id+1) + ' is discharging');

				};
				return {
					charge : charge,
					disCharge : disCharge
				};
		};
		Spaceship.prototype.destroy = function () {
			this.mediator.remove(this);//介质移除了它
			ConsoleUtil.show('Spaceship No.'+(this.id+1)+' destroy!');
		};
		Spaceship.prototype.Receptor = function () {
			var self = this;
			return {
				receive : function (msg,from) {
					if (self.currentState !== msg.cmd && self.id === msg.id) {
						self.stateManager().changeState(msg.cmd);
					}
				}
			};
		};
	function index(Node) {
			for (var i = 0; i < Node.parentNode.children.length; i++) {
				if(Node.parentNode.children[i] === Node){
					return i;
				}
			}
	}
	var buttonHandler = function (commander) {
		var id = null,
			cmd = null;
		$('button').on('click',function () {
			var cmdName = $(this).attr('name');
			switch(cmdName){
				case 'lanuch':
				case 'fly':
				case 'stop':
				case 'destroy':
					id = index($(this)[0].parentNode);
					cmd = cmdName;
					break;
				default:
					alert('invalid command!');
					return false;
			}
			var msg = new Message(id,cmd);
			commander.send(msg);
			return true;
		});

	};
	var Message = function (target,command) {	
		this.id = target;
		this.cmd = null;
		switch(command){
			case "lanuch":
			case "fly":
			case "stop":
			case "destroy":
				this.cmd = command;
				break;
			default:
				alert('invalid command');
		}
	};

	function Commander() {
		this.mediator = null;
		this.cmds = [];
		this.id = '';
	}

	Commander.prototype.send = function (msg) {			
			this.mediator.send(msg);
			this.cmds.push(msg);//将指令存储起来		
	};

	//采用中介者模式
	function Mediator() {
		var spaceships = [],//存储的只是spaceship的id
			commander = null;
		return {
			register : function (obj) {
				if (obj instanceof Spaceship) {
					obj.mediator = this;
					spaceships[obj.id] = obj;
					ConsoleUtil.show('spaceship '+(obj.id+1) + ' register in mediator!');
					return true;
				}else if ( obj instanceof Commander) {
					obj.mediator = this;
					commander = obj;
					ConsoleUtil.show('commander '+obj.id + 'register in mediator!');
					return true;					
				}
				ConsoleUtil.show('register failed');
			},
			send : function (msg,froms,to) {
				var self = this;
				setTimeout(function () {			
					var success = (Math.random() > FAILURE_RATE) ? true : false;
					if (success) {
						if (to) {
							to.receive(msg, froms);
						}else{
							if (msg.cmd === 'lanuch') {
								self.create(msg);
							}
							for(var key of spaceships){
								if (key !== froms) {
									key.Receptor().receive(msg,froms);
								}
							}
						}
						ConsoleUtil.show('send success');
						return true;
					}else{
						ConsoleUtil.show('send failed');
						return false;
					}	
				},1000);			
			},
			create : function (msg) {
				if (!((spaceships === undefined) || (spaceships[parseInt(msg.id)] === undefined))){
					ConsoleUtil.show('Spaceship already exists');
					return false;
				}
				var Spaceships = new Spaceship(msg.id);
				this.register(Spaceships);
				return true;
			},
			remove : function (obj) {
				if (obj instanceof Spaceship) {
					ConsoleUtil.show('destroy spaceship No.'+(obj.id+1));
					delete spaceships[obj.id];
					return true;
				}
				ConsoleUtil.show('mediator remove failed');
				return false;
			},
			getSpaceships : function () {
				return spaceships;
			}
		};
	}
	/* 
	 * 采用双缓存刷新及requestAnimationFrame致力消除动画闪屏现象
	 * 获取到页面中的Canvas对象之后，创建了一个与页面Canvas同样大小的Canvas对象。
	 * 绘图时先将图像绘制到缓冲Canvas中，等到每一桢的图像绘制完全后
	 * 再把整个缓冲Canvas绘制到页面Canvas中。
	 */
	var AnimUtil = (function () {
		var canvas = document.getElementById('screen');
		canvas.width = SCREEN_WIDTH;
		canvas.height = SCREEN_HEIGHT;
		var ctx = canvas.getContext('2d');
		var canvasCache = document.createElement('canvas');
		canvasCache.width = SCREEN_WIDTH;
		canvasCache.height = SCREEN_HEIGHT;
		var cacheCtx = canvasCache.getContext('2d'),
			timer = null;

		var drawPlanet = function (_ctx) {
			var x = SCREEN_CENTER_X - PLANET_RADIUS,
				y = SCREEN_CENTER_Y - PLANET_RADIUS,
				planet = new Image();
			planet.src = '../img/min-iconfont-planet.png';
			planet.onload = function () {
				_ctx.drawImage(planet,x,y,PLANET_RADIUS * 2, PLANET_RADIUS *2);
			};
		},
		 drawOrbit = function(_ctx) {
			for (var i = 0; i < ORBIT_COUNT; i++) {
				_ctx.strokeStyle = '#999';
				_ctx.beginPath();
				_ctx.arc(SCREEN_CENTER_X,SCREEN_CENTER_Y,100+50*i,0,2*Math.PI);
				_ctx.closePath();
				_ctx.stroke();
			}
		};
		//动画更新时背景不用刷新，因此仅仅在初始化时绘制一次在Background画布上的背景，减少运算量
		(function () {
			var canvas = document.getElementById('background');
			canvas.width = SCREEN_WIDTH;
			canvas.height = SCREEN_HEIGHT;
			var _ctx = canvas.getContext('2d');
			_ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
			drawPlanet(_ctx);
			drawOrbit(_ctx);
		})();

		var drawSpaceship = function (_ctx,spaceship) {
			var spaceshipImg = new Image();
			spaceshipImg.src = '../img/min-iconfont-rocket-active.png';
			spaceshipImg.onload = function () {
				try{
					//旋转画布
					_ctx.save();//保存画布原有设置
					_ctx.translate(SCREEN_CENTER_X,SCREEN_CENTER_Y);//更改画布坐标系，将画布坐标原点移到画布中心
					_ctx.rotate(-spaceship.deg*Math.PI/180);//根据旋转角度旋转画布
					_ctx.beginPath();
					if (spaceship.power >= 60) {
						_ctx.strokeStyle = WELL_POWER_COLOR;
					}else if (spaceship.power <=60 && spaceship.power >= 30) {
						_ctx.strokeStyle = GENERAL_POWER_COLOR;

					}else{
						_ctx.strokeStyle = BAD_POWER_COLOR;
					}
					_ctx.lineWidth = POWERBAR_WIDTH;
					_ctx.moveTo(spaceship.orbit, -POWERBAR_POS_OFFSET);
					_ctx.lineTo(spaceship.orbit + SPACESHIP_SIZE*(spaceship.power/100),-POWERBAR_POS_OFFSET);
					_ctx.stroke();
					//画飞船贴图
					_ctx.drawImage(spaceshipImg,spaceship.orbit,0,SPACESHIP_SIZE,(SPACESHIP_SIZE+20));
					_ctx.restore();//恢复画布原有状态
					//清除页面，防止重叠，增加计算量
					ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
					ctx.drawImage(canvasCache,0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
					return true;

				}catch(error){
					return false;
				}
			};
		},
		onDraw = function (spaceships) {
			if (!(spaceships === undefined || spaceships.every(function(item,index,array){
				return item === undefined;
			}))) {
				cacheCtx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);//每次更新清空缓存
				for (var i = 0; i < spaceships.length; i++) {
					if(spaceships[i]!==undefined){
						drawSpaceship(cacheCtx,spaceships[i]);
					}
				}
			}else{
				ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
			}
		},
		animLoop = function () {
			requestAnimationFrame(animLoop);
			onDraw(mediator.getSpaceships());
		},
		setMediator = function (_mediator) {
			mediator = _mediator;
		};
		return{
			setMediator : setMediator,
			animLoop : animLoop 
		};

	})();
	var ConsoleUtil = (function () {
		var $consoleLog = $('.console ul'),
			show = function (msg) {
				var $msg = $('<li></li>');
				$msg.text(msg);
				$consoleLog.prepend($msg);
			};
			return {
				show : show
			};
	})();
	window.onload = function () {
		var commander = new Commander(),
			mediator = new Mediator();
		mediator.register(commander);
		//mediator 控制渲染动画
		mediator.register(AnimUtil);
		buttonHandler(commander);
		AnimUtil.setMediator(mediator);
		AnimUtil.animLoop();
	};
})();
