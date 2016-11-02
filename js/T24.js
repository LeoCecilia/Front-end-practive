/*DOM本来就是树，用这个Tree类其实没有必要，但是就当是更好的了解
 *appendChild和removeChild的原理吧
 *不过感觉自己的代码有点冗长
 *
 *还学习了queue和stack数据结构的应用
 *感觉大神的代码真的很优雅，一定要认真学习人家的态度
 *温故知新
 *
 *再就是不太理解为什么Object.create对象后，该对象变成了个function了，
 *在console调试的时候，还好好的
 *用字面量表示Tree.prototype的时候，不明白为什么将constructor指向Tree后
 *还是无法找到Tree.prototype的函数
 *还有就是删除时没有确认是否删除的操作
 */
var btn = document.getElementsByTagName('button'),
	treeRoot = document.getElementById('root'),
	div = document.getElementsByTagName('div'),
	Root = new Tree(treeRoot),
	widthTraverseBtn = btn[0],
	breadthTraverseBtn = btn[1],
	widthSearch = btn[2],
	breadthSearch = btn[3],
	addNodeBtn = btn[4],
	delNodeBtn = btn[5],
	TraversalList = [],//存储遍历节点的顺序,用于动画播放
	timer = null,
	draw = false,//draw = true : 当动画进行时，其他操作无效
	going = false,//going = true : 当div选中后，而又不进行增删操作，其他操作无效
	shotNode = null;//存储被选中的div

function addEventHandler(ele, event,handler)  {
	if (ele.addEventListener) {
		ele.addEventListener(event, handler, false);
	}else if (ele.attachEvent) {
		ele.attachEvent('on'+event, handler);
	}else {
		ele['on'+event] = handler;
	}
}
//不明白为什么Object.create后，该对象会变为一个function
function Node(data) {
 	this.Children = [];
	this.parent = null;
	this.data = data;
 } 
function Tree(data) {
	var node = new Node(data);
	this._root = node;
}

//stack LIFO
Tree.prototype.traversalBF = function (callback) {
		(function recurse(currentNode) {
			if (currentNode.data.children) {
				for (var i = 0; i < currentNode.Children.length; i++) {
					recurse(currentNode.Children[i]);
				}
			}
			callback(currentNode);//好优雅的回调函数
		})(this._root);
};
//queue FIFO
Tree.prototype.traversalDF = function (callback) {
		var queue = [];//用数组模拟队列
		queue.unshift(this._root);
		currentNode = queue.shift();
		while(currentNode){
			for (var i = 0; i < currentNode.Children.length; i++) {
				queue.push(currentNode.Children[i]);
			}
			callback(currentNode);
			currentNode = queue.shift();
		}	
};
Tree.prototype.contains = function (callback,traversal) {
		traversal.call(this,callback);	
};
Tree.prototype.add = function (data,toData,traversal) {
		var child = new Node(data),			
			parent = null;
			callback = function (node) {
				if (node.data === toData) {
					parent = node;
				}	
			};
			this.contains(callback,traversal);
			if (parent) {
				parent.Children.push(child);
				parent.data.appendChild(child.data);
				child.parent = parent;
			}else{
				throw new Error('Cannot add node to a non-existant parent');
			}
};
Tree.prototype.remove = function (data,fromData,traversal) {
		var parent = null,
		 	childToRemove = null,
		 	index;
		 var callback = function (node) {
		 	if (node.data === fromData) {
		 		parent = node;
		 	}
		 };
		 this.contains(callback,traversal);
		 if (parent) {
		 	index = this.findIndex(parent.Children,data);
		 	if (index === undefined) {
		 		throw new Error('Node to remove does not exist');
		 	}else{
		 		parent.Children.splice(index,1);
		 		parent.data.removeChild(data);
		 	}
		 }else{
		 	throw new Error('Parent does not exist.');
		 }
};
Tree.prototype.findIndex = function (arr,data) {
		var index;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].data === data) {
				index = i;
			}
		}
		return index;
};

window.onload = function () {
	//先建立树
	(function initTree() {
		var queue = [];//用数组模拟队列,实现层次遍历
		queue.unshift(treeRoot);
		currentNode = queue.shift();
		while(currentNode){
			for (var i = 0; i < currentNode.children.length; i++) {
				queue.push(currentNode.children[i]);
			}
			currentNode = queue.shift();
			if (currentNode) {
				Root.add(currentNode,currentNode.parentNode,Root.traversalBF);
			}
		}
	})();
	//跨浏览器兼容
	function content(ele) {
		if (ele.innerText) {
			return ele.innerText;
		}
		if (ele.textContent) {
			return ele.textContent;
		}
	}
	//初始化样式
	function reset() {
		var div = document.getElementsByTagName('div');
		TraversalList = [];
		clearInterval(timer);
		for (var i = 0; i < div.length; i++) {
			div[i].style.backgroundColor = '#fff';
		}
	}
	//颜色变化函数
	function changeColor(searched,flag) {
		var i = 0;
		searched = searched || null;//不能设为''
		flag = (flag===0) ? flag : (flag || -1);//flag用来标志是否进行搜索,flag = 0搜索，flag = -1则不搜索
		TraversalList[i].style.backgroundColor = '#EA384D';
		timer = setInterval(function () {
			draw = true;
			if (i < TraversalList.length) {
				if (content(TraversalList[i]).match(new RegExp('^'+searched,'i'))) {
					flag = 1;
					TraversalList[i].style.backgroundColor = '#a8e063';

					if ((++i)<TraversalList.length) {//自加后再取值
						TraversalList[i].style.backgroundColor = '#EA384D';
					}					
				}else{
					TraversalList[i].style.backgroundColor = '#fff';
					if((++i)<TraversalList.length){
						TraversalList[i].style.backgroundColor = '#EA384D';
					}
				}
			}else{
				clearInterval(timer);
				draw = false;
				if (!flag) {
					alert('搜索失败');
				}
			}
		},500);
	}
	//创建div
	function createDiv(data) {
		var divEle = document.createElement('div');
		divEle.innerHTML = data;
		divEle.style.backgroundColor = '#fff';
		return divEle;
	}
	//选中div，这个很管用
	addEventHandler(treeRoot,'click',function (event) {
		//允许冒泡
		if (!draw) {
			reset();
			going = true;
			var ev = event || window.event;
			event.target.style.background = '#a8e063';
			shotNode = event.target;
		}else{
			alert('动画中！');
		}
	});
	addEventHandler(widthTraverseBtn,'click',function () {
		if (!draw) {
			if (!going) {
				reset();
				Root.traversalBF(function (Node) {
					TraversalList.push(Node.data);
				});
				changeColor();
			}else{
				alert('插入/删除程序正在运行!');
			}	
		}else{
			alert('动画中！');
		}
	});
	addEventHandler(breadthTraverseBtn,'click',function () {
		if (!draw) {
			if (!going) {
				reset();
				Root.traversalDF(function (Node) {
					TraversalList.push(Node.data);
				});
				changeColor();
			}else{
				alert('插入/删除程序正在运行!');
			}	
		}else{
			alert('动画中！');
		}
	});	
	addEventHandler(widthSearch,'click',function () {
		if (!draw) {
			if (!going) {
				var searched = document.getElementById('input').value;
				if (searched) {
					reset();
					Root.traversalBF(function (Node) {
						TraversalList.push(Node.data);
					});
					changeColor(searched,0);
				}else{
					alert('输入值不能为空！');
				}	
			}else{
				alert('插入/删除程序正在运行!');
			}
		}else{
			alert('动画中！');
		}
	});	
	addEventHandler(breadthSearch,'click',function () {
		if (!draw) {
			if (!going) {
				var searched = document.getElementById('input').value;	
				if (searched) {
					reset();
					Root.traversalDF(function (Node) {
						TraversalList.push(Node.data);
					});
					changeColor(searched,0);		
				}else{
					alert('输入值不能为空！');
				}		
			}else{
				alert('插入/删除程序正在运行!');
			}
		}else{
			alert('动画中！');
		}
	});	
	addEventHandler(addNodeBtn,'click',function () {
		if (!draw) {
			var addData = document.getElementById('add').value;
			if (shotNode) {
				if (!addData) {
					alert('请输入新增节点！');

				}else{
					addData = createDiv(addData);
					Root.add(addData,shotNode,Root.traversalDF);
					going = false;
				}
			}else{
				alert('请先选中节点！');
			}
		}else{
			alert('动画中！');
		}
	});
	addEventHandler(delNodeBtn,'click',function () {
		if (!draw) {
			if (shotNode) {
				if (shotNode === treeRoot) {
					alert('不能删除根节点！');
				}else{					
					Root.remove(shotNode,shotNode.parentNode,Root.traversalDF);				
					shotNode = null;
					going = false;
				}
			}else{
				alert('请先选中节点！');
			}
		}else{
			alert('动画中！');
		}
	});
};