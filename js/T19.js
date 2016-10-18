/*我终于学会怎么用chrome调试js了*/
//快速排序没有弄好
function addEventHandler(ele, event,handler)  {
	if (ele.addEventListener) {
		ele.addEventListener(event, handler, false);
	}else if (ele.attachEvent) {
		ele.attachEvent('on'+event, handler);
	}else {
		ele['on'+event] = handler;
	}
}
window.onload = function(){
	var container = document.getElementById('show'),
		buttonList = document.getElementsByTagName('input');
		//记得用数组啊
		queue = {
			str: [],
			leftPush: function(num){
				if (this.str.length <= 60) {
					this.str.unshift(num);
					this.render();
				}else{
					alert("the length of the array should be less than 60")
				}
			},
			rightPush: function(num) {
				if (this.str.length <= 60) {
					this.str.push(num);
					this.render();
				}else{
					alert("the length of the array should be less than 60")
				}
			},
			isEmpty: function () {
				return (this.str.length === 0);
			},
			leftPop: function (num) {
				if (!this.isEmpty()) {
				 	alert(this.str.shift());
				 	this.render();
				}else {
					alert('the queue is empty');
				}
			},
			rightPop: function (num) {
				if (!this.isEmpty()) {
				 	alert(this.str.pop());
				 	this.render();
				}else {
					alert('the queue is empty');
				}
			},
			render: function (timer) {
				timer = timer || 0;
				if (timer) {
					var clock = setTimeout(function () {
						var items = '';
						for(var Int of queue.str){
							items += '<div style = "height: '+(Int*3.5)+'px;" title = "'+Int+'">'+'</div>';
						}
						document.getElementById('show').innerHTML = Int ? items : '';
						addDivDelEvent();
					},1000);
				}else{
					var items = '';
					for(var Int of this.str){
						items += '<div style = "height: '+(Int*3.5)+'px;" title = "'+Int+'">'+'</div>';
					}
					document.getElementById('show').innerHTML = Int ? items : '';
					addDivDelEvent();
				}
			},			
			delId: function (id) {
				this.str.splice(id, 1);
				this.render();
			}
		};
		function addDivDelEvent () {
			 for (var i = 0; i < container.childNodes.length; i++) {
			  	addEventHandler(container.childNodes[i], 'click', function (m){
			  		//此处必须使用闭包，不然的话，i永远是鼠标相对于界面的值！
			  		//若用了事物管理，则不需要使用闭包
			  		return function () {
			  			 queue.delId(m);
			  		};
			  	}(i));
			 } 
		}
		//注意setInterval每隔一段时间执行一次
		function selectSort() {
			var Clock, 
				i = 0, min = 0,j = i+1,len = queue.str.length;
        	Clock = setInterval(function() {
           	 	if (i === len - 1) {
            	    clearInterval(Clock);
           	 	}
            	if (j === len) {
            		var temp = queue.str[i];
            		queue.str[i] = queue.str[min];
            		queue.str[min] = temp;
            		queue.render();
            		++i;//这里是关键
            		min = i;
            		j = i + 1;
            	}
            	if (parseInt(queue.str[j]) < parseInt(queue.str[min])) {
                	min = j;
            	}
            	++j;//j自加，关键
        	}, 10);
		}

		function quick(left,right){
			if (left >= right) return;
			var low = quickSort(left,right);
			if (left < low - 1) {
				quick(left,low - 1);
			}
			if (low < right) {
				quick(low+1,right);
			}
		}

		function quickSort(left,right) {			
			var STR = queue.str,
				key = parseInt(STR[left]),
				high = right,
				low = left;
				if (low === high) {
					clearTimeout(clock);
				}
				while(low < high){
			    	while((low < high) && (parseInt(STR[high]) >= key)){
			    		--high;
			    	}
			    	queue.str[low] = queue.str[high];
			    	queue.render(1);
			    	while((low<high) && (parseInt(STR[low]) <= key)){
			    		++low;
			    	}
			    	queue.str[high] = queue.str[low];
			    	queue.render(1);
				}			    
			    queue.str[low] = key;
			    queue.render(1);			    
			return low;
		}
		function random() {
			queue.str = [];
			for (var i = 0; i < 50; i++) {
				var a = Math.round((Math.random()*90))+10;
				queue.leftPush(a);
			}
		}
		addEventHandler(buttonList[1],'click',function () {
			 var input = buttonList[0].value.trim();
			 if (input.match(/^\d+$/)) {
			 	if (input < 10 || input > 100) {
			 		alert('plz enter an interger between 10 and 100');
				 }else{				 		
				 	queue.leftPush(input);
				 }				 	
			}else {
			 	alert("plz enter an interger!");
			 }
		});		
		addEventHandler(buttonList[2],'click',function () {
			 var input = buttonList[0].value.trim();
			 if (input.match(/^\d+$/)) {
			 	if (input < 10 || input > 100) {
			 		alert('plz enter an interger between 10 and 100');
				 }else{				 		
				 		queue.rightPush(input);
				 }				 	
			 }else {
			 	alert("plz enter an interger!");
			 }
		});			
		addEventHandler(buttonList[3],'click',function () {
			 queue.leftPop(); 
		});
		addEventHandler(buttonList[4],'click',function () {
			 queue.rightPop(); 
		});
		addEventHandler(buttonList[5],'click',function(){
			selectSort();				
		});
		addEventHandler(buttonList[6],'click',function(){
			var len = queue.str.length;
			quick(0,len-1);				
		});					
		addEventHandler(buttonList[7],'click',function(){
			random();				
		});		
};