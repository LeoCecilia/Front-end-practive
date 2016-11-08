/*function(){
	return{};只提供这些接口
}的结构可以达到封装的效果，以此来降低模块与模块之间的耦合
*/
//动力系统由内部设定
//若是两个对象都有适配器，那就直接创建一个适配器的对象 !important

//使用对象关联，委托对象Message,高内聚，低耦合

//使用HTML5的dataset方法

//让planet和spaceship都有adapter管理器，这样那个就不用那么繁杂，维护起来也更方便
//message要完完全全地重构！

//宝宝啊，我终于找到可以应用的方法了mua

(function () {
	var SPACESHIP_SIZE = 30,
		SPACESHIP_POWER = 100,
		SPACESHIP_COUNT = 4,
		POWERBAR_POS_OFFSET = 5,//电量条的高度
		WELL_POWER_COLOR = '#70ed3f',
		GENERAL_POWER_COLOR = '#FCCD1F',
		BAD_POWER_COLOR = '#FB0000',
		POWERBAR_WIDTH = 5,
		SCREEN_WIDTH  = 800,
		SCREEN_HEIGHT = 800,
		SCREEN_CENTER_X = SCREEN_WIDTH/2,
		SCREEN_CENTER_Y = SCREEN_HEIGHT/2,
		PLANET_RADIUS = 50,
		ORBIT_COUNT = 4,
		FAILURE_RATE = 0.1,
		requestAnimationFrAME = window.requestAnimationFrame || window.mozRequestAnimation || window.webkitRequestAnimationFrame || msRequestAnimationFrame;

	function Spaceship(id) {
		this.currentState = 'stop';
		this.id = id;
		this.power = 100;
		this.bus = null;
		this.deg = 0;
		this.orbit = 100 + 50*id - SPACESHIP_SIZE/2;
		this.timer = null;
		this.speed = null;
		this.disChargeRate = null;
		this.chargeRate = null;
		var self = this;
		(function spaceshipSend() {
			timer = setInterval(function () {		
			/*if (self.currentState !== 'destroy') {*/
				var msg = self.adapter().compiler();
					self.bus.send(msg,false,true);
				/*}*/		
			},1000);
		})();
	}
	Spaceship.prototype.setStyle = function (msg) {
		var obj = this.adapter().deCompiler(msg);
		this.chargeRate = obj.chargeRate;
		this.disChargeRate = obj.disChargeRate;
		this.speed = obj.speed;
	};
	//动力系统
	Spaceship.prototype.stateManager = function () {
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
						self.deg += self.speed;
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
		//能源系统
		Spaceship.prototype.powerManager = function () {
			var self = this,
				charge = function () {
					var chargeRate = self.chargeRate,
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
						if (self.power < 0) {
							self.power = 0;
							self.stateManager().changeState('stop');
							clearInterval(timer);							
						}
						self.power -= self.disChargeRate;
					},20);
					ConsoleUtil.show('Spaceship No.' + (self.id+1) + ' is discharging');

				};
				return {
					charge : charge,
					disCharge : disCharge
				};
		};

		Spaceship.prototype.destroy = function () {
			this.bus.remove(this);//介质移除了它
			ConsoleUtil.show('Spaceship No.'+(this.id+1)+' destroyed!');
		};

		Spaceship.prototype.Receptor = function () {
			var self = this;
			return {
				receive : function (msg,from) {
					msg = self.adapter().deCompiler(msg);
					if (self.currentState !== msg.cmd && self.id === msg.id) {
						self.stateManager().changeState(msg.cmd);
					}
				}
			};
		};
		//适配器
		Spaceship.prototype.adapter = function () {
			var self = this,
			compiler = function () {
				var idCode = self.id.toString(2).length < 2 ? '0'+self.id.toString(2) : self.id.toString(2),				
					pModelCode = null,//动力系统型号code
					eModelCode = null,//能源系统型号code
					stateCode = null,
					surplusCode = null,//power剩余量
					code = null;
				//此编码依次代表前进号，奔腾号，超速号
				switch(self.disChargeRate){
					case 0.1:
						pModelCode = '00';
						break;
					case 0.14:
						pModelCode = '01';
						break;
					case 0.18:
						pModelCode = '10';
						break;
					default:
						ConsoleUtil.show('Invalid powerModel message!');					
				}
				switch(self.chargeRate){
					case 0.04:
						eModelCode = '00';
						break;
					case 0.06:
						eModelCode = '01';
						break;
					case 0.1:
						eModelCode = '10';
						break;
					default:
						ConsoleUtil.show('Invalid energyModel message!');															
				}
				switch(self.currentState){
					case 'fly':
						stateCode = '01';
						break;
					case 'stop':
						stateCode = '10';
						break;
					case 'destroy':
						stateCode = '11';
						break;																				
				}
				var len = self.power.toString(2).length,
					tem = '';
				if (len < 7) {
					for(var i = 0;i<7-len;i++){
						tem += '0';
					}
				}
				surplusCode = tem + parseInt(self.power).toString(2);
				code = pModelCode + eModelCode + idCode + stateCode + surplusCode;
				if (self.currentState !== 'destroy') {
					ConsoleUtil.show('Spaceship No.' + (self.id+1) +' is sending code: ' +code);
				}
				return code;				
			},
			deCompiler = function (code) {
				var	pModelCode = code.substring(0,2),
					eModelCode = code.substring(2,4),
			 		idCode = code.substring(4,6),
					cmdCode = code.substring(6,8),
					id = parseInt(idCode,2),
					cmd = null,
					spd = null,
					chargeRate = null,
					disChargeRate = null;
				switch(cmdCode){
					case '00':
						cmd = 'lanuch';
						break;
					case '01':
						cmd = 'fly';
						break;
					case '10':
						cmd = 'stop';
						break;
					case '11':
						cmd = 'destroy';
						break;
					default:
						ConsoleUtil.show('Invalid CMD code');
				}
				switch(pModelCode){
					case '00':
						spd = 3;
						disChargeRate = 0.1;
						break;
					case '01':
						spd = 5;
						disChargeRate = 0.14;
						break;
					case '10':
						spd = 8;
						disChargeRate = 0.18;
						break;
					default:
						ConsoleUtil.show('Invalid powerModel code!');
				}
				switch(eModelCode){
					case '00':
						chargeRate = 0.04;
						break;
					case '01':
						chargeRate = 0.06;
						break;
					case '10':
						chargeRate = 0.1;
						break;
					default:
						ConsoleUtil.show('Invalid state code!');				
				}
				return{
					id:id,
					cmd:cmd,
					speed:spd,
					chargeRate:chargeRate,
					disChargeRate:disChargeRate,										
				};				
			};
			return{
				compiler:compiler,
				deCompiler:deCompiler
			};
		};
		/*Spaceship.prototype.send = function () {
			var msg = this.adapter().compiler(),
			self = this;
			timer = setInterval(function () {				
				self.bus.send(msg,false,true);
			},1000);
		};*/

	function index(Node) {
			for (var i = 0; i < Node.parentNode.children.length; i++) {
				if(Node.parentNode.children[i] === Node){
					return i;
				}
			}
	}

	function fetchMessage(dynamic,resource) {
		var pattern1 = /号/g,
			pattern2 = /型/g,
			power = '',
			energy = '';
		if (dynamic.match(pattern1)) {
			power = RegExp["$`"];			
		}
		if (resource.match(pattern2)) {
			energy = RegExp["$`"];
		}
		return {
			power : power,
			energy : energy
		};
	}

	var buttonHandler = function (commander) {
		var id = null,
			cmd = null,
			style = null;
		$('button').on('click',function () {
			var cmdName = $(this).attr('name');
			switch(cmdName){
				case 'lanuch':	
					var select1 = $(this)[0].parentNode.getElementsByClassName('powerSystem')[0].value,
						select2 = $(this)[0].parentNode.getElementsByClassName('energySystem')[0].value;
					style = fetchMessage(select1,select2);
				case 'fly':
				case 'stop':
				case 'destroy':
					id = index($(this)[0].parentNode);
					cmd = cmdName;
					break;
				default:
					ConsoleUtil.show('invalid command!');
					return false;
			}
			message.setMessage(id,cmd,style);
			commander.send();
			return true;
		});
	};	
	//commander需要经过行星创建信息实例，和通过行星的适配器进行编译和反编译
	var Planet = {
		setMessage : function (id,command,style,speed,chargeRate,disChargeRate,surplusEnergy,state) {
			this.id = id;
			this.cmd = null;
			this.style = null;
			this.speed = null;
			this.chargeRate = null;
			this.disChargeRate = null;
			this.surplusEnergy = 0;
			this.state = null;
			if (style) {
				this.style = style;
			}
			if (speed && chargeRate && disChargeRate) {
				this.speed = speed;
				this.chargeRate = chargeRate;
				this.disChargeRate = disChargeRate;
			}
			if (surplusEnergy) {
				this.surplusEnergy = surplusEnergy;
			}
			if (command) {
				switch(command){
					case "lanuch":
					case "fly":
					case "stop":
					case "destroy":
						this.cmd = command;
						break;
					default:
						ConsoleUtil.show('invalid command');
				}
			}
			if (state) {
				switch(state){
					case "fly":
					case "stop":
					case "destroy":
						this.state = state;
						break;
					default:
						ConsoleUtil.show('invalid state');
				}				
			}
		},
		getMessage : function () {
			return {
				id:this.id,
				cmd:this.cmd,
				speed:this.spd,
				chargeRate:this.chargeRate,
				disChargeRate:this.disCharge,
				surplusEnergy:this.surplusEnergy,
				currentState : this.state,
				style : this.style	
			};
		},
		compileAdapter : function () {
			var idCode = this.id.toString(2).length < 2 ? '0'+this.id.toString(2) : this.id.toString(2),
				cmdCode = null,
				pModelCode = null,//动力系统型号code
				eModelCode = null,//能源系统型号code
				code = null;
			switch (this.cmd){
				case 'lanuch':
					cmdCode = '00';
					break;
				case 'fly':
					cmdCode = '01';
					break;
				case 'stop':
					cmdCode = '10';
					break;
				case 'destroy':
					cmdCode = '11';
					break;
				default:
					ConsoleUtil.show('Invalid CMD message!');
			}
			switch(this.style.power){
				case '前进':
					pModelCode = '00';
					break;
				case '奔腾':
					pModelCode = '01';
					break;
				case '超速':
					pModelCode = '10';
					break;
				default:
					ConsoleUtil.show('Invalid powerModel message!');					
			}
			switch(this.style.energy){
				case '劲量':
					eModelCode = '00';
					break;
				case '光能':
					eModelCode = '01';
					break;
				case '永久':
					eModelCode = '10';
					break;
				default:
					ConsoleUtil.show('Invalid energyModel message!');															
			}
			code = pModelCode + eModelCode + idCode + cmdCode;
			ConsoleUtil.show('Sending code: ' +code);
			return code;
		},
		decompileAdapter : function (code) {
			var	pModelCode = code.substring(0,2),
				eModelCode = code.substring(2,4),
			 	idCode = code.substring(4,6),
			 	stateCode = code.substring(6,8),
				surplusCode = code.substring(8,15),
				id = parseInt(idCode,2),
				power = null,
				energy = null,
				style = null,
				currentState = null,
				surplusEnergy = parseInt(surplusCode,2);
			switch(pModelCode){
				case '00':
					power = '前进号';
					break;
				case '01':
					power = '奔腾号';
					break;
				case '10':
					power = '超速号';
					break;
				default:
					ConsoleUtil.show('Invalid powerModel code!');
			}
			switch(eModelCode){
				case '00':
					energy = '劲量型';
					break;
				case '01':
					energy = '光能型';
					break;
				case '10':
					energy = '永久型';
					break;
				default:
					ConsoleUtil.show('Invalid energyModel code!');				
			}
			switch(stateCode){
				case '01':
					currentState = 'fly';
					break;
				case '10':
					currentState = 'stop';
					break;
				case '11':
					currentState = 'destroy';
					break;										
				default:
					ConsoleUtil.show('Invalid state code!');
			}
			style = {power:power,energy:energy};
			this.setMessage(id,null,style,null,null,null,surplusEnergy,currentState);
			return this.getMessage();
		},
		updateData : function () {
			
		}
	};
	function Commander() {
		this.bus = null;
		this.cmds = [];
		this.acceptedCode = [];
		this.id = '';
		var self = this;
		(function dataUpdate() {
			var timer = setInterval(function () {
				//所有记录
      	  		var table = document.getElementsByTagName("table")[0],
      	  		    records = table.getElementsByTagName("tr"),
     	  			//当前时间
     	            t = Date.now();
     	   		if (records) {

    	   	 	for(var i = 0; i < records.length; i++) {    	        
   	        		 if(!records[i].dataset.update) {
           	   			 continue;
    	   	   		 }
    	        //上次更新时间超过3秒删除记录，超过1秒标记为失联
      		      	if(t - records[i].dataset.update > 3000) {
     		        	table.removeChild(records[i]);
     		        	delete records[i];
      	          		delete self.acceptedCode[i-1];
      	          	} else if(t - records[i].dataset.update > 1000) {
     	           		records[i].getElementsByTagName("td")[3].innerHTML = 'missing';

      	       		}
     	     	}
     	   	  }
			},1000);
		})();		
	}
	Commander.prototype.send = function () {
		var msg = message.compileAdapter();
		this.bus.send(msg);
		this.cmds.push(message.getMessage());//将指令存储起来		
	};
	Commander.prototype.accept = function (code) {	
		var msg = message.decompileAdapter(code),
			table = document.getElementsByTagName("table")[0],
			records = table.getElementsByTagName('tr');		
		this.acceptedCode[msg.id] = message.decompileAdapter(code);
		for (var i of this.acceptedCode){
			if (i) {
				ConsoleUtil.showSpaceship(i);
			}
		}
	};
	
	//采用中介者模式
	function Bus() {
		var spaceships = [],//存储的只是spaceship的id
			commander = null;
		return {
			register : function (obj) {
				if (obj instanceof Spaceship) {
					obj.bus = this;
					spaceships[obj.id] = obj;
					ConsoleUtil.show('spaceship '+(obj.id+1) + ' register in bus!');
					ConsoleUtil.show('spaceship'+(obj.id+1)+' { chargeRate: '+obj.chargeRate+', dischargeRate: ' + obj.disChargeRate + ', speed: ' + obj.speed+'}');
					return true;
				}else if ( obj instanceof Commander) {
					obj.bus = this;
					commander = obj;
					ConsoleUtil.show('commander '+obj.id + 'register in bus!');
					return true;					
				}
				ConsoleUtil.show('register failed');
			},
			//from：从commander到spaceship
			//to：从spaceship到commander
			send : function (msg,froms,to) {
				var self = this;
				//此处不能空格	
				setTimeout(function retry() {						
					var success = (Math.random() > FAILURE_RATE) ? true : false;
					if (success) {
						if (to) {
							commander.accept(msg);
						}else{
							//若cmd为lanuch
							//第5,6位是id的二进制码
							if (msg.match(/(..)00$/)) {
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
						retry();
					}
				},300);
			},
			create : function (msg) {
				//将二进制码转变为十进制
				var sid = parseInt(RegExp["$+"],2);
				if (!((spaceships === undefined) || (spaceships[sid] === undefined))){
					ConsoleUtil.show('Spaceship already exists');
					return false;
				}
				var Spaceships = new Spaceship(sid);
				Spaceships.setStyle(msg);
				this.register(Spaceships);
				return true;
			},
			remove : function (obj) {
				if (obj instanceof Spaceship) {
					ConsoleUtil.show('destroy spaceship No.'+(obj.id+1));
					delete spaceships[obj.id];
					return true;
				}
				ConsoleUtil.show('bus remove failed');
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
			onDraw(bus.getSpaceships());
		},
		setbus = function (_bus) {
			bus = _bus;
		};
		return{
			setbus : setbus,
			animLoop : animLoop 
		};
	})(),

	ConsoleUtil = (function () {
		var $consoleLog = $('.console ul'),
			$messageLog = $('table');
		$messageLog.innerHTML = null;
			var show = function (msg) {
				var $msg = $('<li></li>');
				$msg.text(new Date() + ' ' +msg);
				$consoleLog.prepend($msg);
			},
			showSpaceship = function (obj) {
				if (obj.currentState !== 'destroy') {
					var record = document.getElementById('record-'+obj.id);
					if (!record) {
						record = document.createElement('tr');
						record.id = 'record-'+obj.id;
						for (var i = 0; i < 5; i++) {
							record.appendChild(document.createElement('td'));
						}
						document.getElementsByTagName('table')[0].appendChild(record);
					}
					var items = record.getElementsByTagName('td');
					items[0].innerHTML = (obj.id+1);
					items[1].innerHTML = obj.style.power;
					items[2].innerHTML = obj.style.energy;
					items[3].innerHTML = obj.currentState;
					items[4].innerHTML = obj.surplusEnergy+'&#37;';//'&#37'
					//记录更新时间
					record.dataset.update = Date.now();
				}
			};
			return {
				show : show,
				showSpaceship:showSpaceship
			};
	})(),

	//message乃是全局变量
	message = Object.create(Planet);

	window.onload = function () {
		var commander = new Commander(),
			bus = new Bus();
		bus.register(commander);
		//bus 控制渲染动画
		buttonHandler(commander);
		AnimUtil.setbus(bus);
		AnimUtil.animLoop();
	};
})();