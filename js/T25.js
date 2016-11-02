function TreeNode(obj) {
	this.Children = obj.Children || [];
	this.parent = obj.parent;
	this.data = obj.data || '';//data是其中的文本，gotcha
	//这个超级厉害
	this.selfElement = obj.selfElement;//访问对应的DOM节点,这个好厉害,obj.selfElement指的就是节点本身，只需要在传参时，手动传入该节点
	this.selfElement.TreeNode = this;//访问回对应的TreeNode
}
TreeNode.prototype = {
	constructor : TreeNode,
	//解耦样式操作，四个参数表示是否改变箭头，可见性，高亮||普通，后两个参数可省略
	render : function (arrow,visibility,highlight,deHighlight) {
		if (arguments.length < 3) {
			highlight = false;
			deHighlight = false;
		}
		if (arrow) {//改变右下箭头，得设立一个判断是否是叶节点与是否折叠的函数
			//不然的话，很难判断样式的
			if (this.isLeaf()) {
				//这就是html类分开的好处
				this.selfElement.getElementsByClassName('arrow')[0].className = 'arrow empty-arrow';
			}
			if (this.isFolded()) {
				this.selfElement.getElementsByClassName('arrow')[0].className = 'arrow right-arrow';
			}else{
				this.selfElement.getElementsByClassName('arrow')[0].className = 'arrow down-arrow';				
			}
		}
		if (visibility) {//改变可见性
			//字符串含有indexOf的方法
			if (this.selfElement.className.indexOf('nodebody-visible') === -1) {
				//字符串是不能被修改的
				this.selfElement.className= this.selfElement.className.replace('hidden','visible');
			}else{
				this.selfElement.className= this.selfElement.className.replace('visible','hidden');
			}
		}
		if (highlight) {
			this.selfElement.getElementsByClassName('node-title')[0].className = 'node-title node-title-highlight';
		}
		if (deHighlight) {
			this.selfElement.getElementsByClassName('node-title')[0].className = 'node-title';			
		}
	},
	addChild : function (text) {
		//return this;以便链式操作
		if (text === null) return this;
		if (trim(text) === '') {
			alert('节点内容不能为空');
			return this;
		}
		//先增加子节点，再渲染自身样式
		//若当前节点关闭，则将其展开
		if (!this.isLeaf() && this.isFolded()) {
			this.toggleFold();
		}
		//创建新的DOM节点并附加
		var newNode = document.createElement('div');
		newNode.className = 'nodebody-visible';
		var newHeader = document.createElement('label');
		newHeader.className = 'node-header';
		var newSymbol = document.createElement('div');
		newSymbol.className = 'arrow empty-arrow';
		var newTitle = document.createElement('span');
		newTitle.className = 'node-title';
		newTitle.innerHTML = text;
		var space = document.createElement('span');
		space.innerHTML = '&nbsp;&nbsp';
		var newDelete = document.createElement('img');
		newDelete.className = 'deleteIcon';
		newDelete.src = '../img/delete.png';
		var newAdd = document.createElement('img');
		newAdd.className = 'addIcon';
		newAdd.src = '../img/add.png';
		newHeader.appendChild(newSymbol);
		newHeader.appendChild(newTitle);
		newHeader.appendChild(space);
		newHeader.appendChild(newAdd);
		newHeader.appendChild(newDelete);
		newNode.appendChild(newHeader);
		this.selfElement.appendChild(newNode);
		this.Children.push(new TreeNode({
			parent : this,
			Children : [],
			data : text,
			selfElement : newNode
		}));
		this.render(true,false);
		return this;//返回自身，以便链接操作，这个也好棒
	},
	deleteNode : function () {
		var i;
		if (!this.isLeaf()) {
			for (var i = 0; i < this.Children.length; i++) {
				this.Children[i].deleteNode();
			}
		}	
		this.parent.selfElement.removeChild(this.selfElement);
		for (var i = 0; i < this.parent.Children.length; i++) {
			if(this.parent.Children[i]){
				if (this.parent.Children[i] === this) {
					this.parent.Children.splice(i,1);
					break;
				}
			}
		}
		//调整父节点箭头样式
		this.parent.render(true,false);
	},
	//展开收拢，收拢节点
	toggleFold : function () {
		//return this; 返回自身以便链式操作
		if (this.isLeaf()) {
			return this;//改变所有子节点的可见状态
		}
		for (var i = 0; i < this.Children.length; i++) {
			this.Children[i].render(false,true);//这里也很厉害			
		}
		//渲染本节点的箭头
		this.render(true,false);
		return this;//返回自身
	},
	isLeaf : function () {
		return this.Children.length === 0;
	},
	isFolded : function () {
		if (this.isLeaf()) 
			return false;
		if (this.Children[0].selfElement.className === 'nodebody-visible') 
			return false;
		return true;
	}
};
//===============================以上是封装TreeNode的代码============================/
//创建根节点对应的TreeNode对象
var root = new TreeNode({parent:null,Children:[],data:'前端工程师',selfElement:document.getElementsByClassName('nodebody-visible')[0]});
addEvent(root.selfElement,'click',function (e) {
	var target = e.target || e.srcElement,
		domNode = target;
	while(domNode.className.indexOf('nodebody') === -1){
		domNode = domNode.parentNode;
	}
	selectedNode = domNode.TreeNode;//获取DOM对象对应的TreeNode对象
	//如果点在节点文字或箭头上
	if ((target.className.indexOf('node-title') !== -1)|| (target.className.indexOf('arrow')!==-1)) {
		selectedNode.toggleFold();
	}else if (target.className === 'addIcon') {
		selectedNode.addChild(prompt('请输入子节点内容！'));

	}else if (target.className === 'deleteIcon') {
		selectedNode.deleteNode();		
	}
});
//给root绑定广度优先搜索函数，无需访问DOM，返回一个搜索结果队列
root.search = function (query) {
	var resultList = [],
		queue = [],//辅助队列，顺序存储待访问的节点
		current = this;
	queue.push(current);
	while(queue.length > 0){
		current = queue.shift();
		//还原当前节点颜色
		current.render(false,false,false,true);
		if (current.data === query) {
			resultList.push(current);			
		}
		for (var i = 0; i < current.Children.length; i++) {
			queue.push(current.Children[i]);
		}
	}
	return resultList;
};
addEvent(document.getElementById('search'),'click',function (e) {
	var search = document.getElementById('searchText'),
		result = document.getElementById('result'),
		text = trim(search.value);
	if (text === '') {
		result.innerHTML = '请输入查询内容！';
		return;
	}
	//执行搜索
	var resultList = root.search(text);
	//处理搜索结果
	if (resultList.length === 0) {
		result.innerHTML = '没有查询到符合条件的节点';		
	}else{
		result.innerHTML = '查询到'+resultList.length+'个符合条件的节点';
		var pathNode;
		for (var i = 0; i < resultList.length; i++) {
			pathNode = resultList[i];
			pathNode.render(false,false,true,false);
			while(pathNode.parent !== null){
				if (pathNode.selfElement.className === 'nodebody-hidden') {
					pathNode.parent.toggleFold();
				}
				pathNode = pathNode.parent;
			}
		}
	}
});
addEvent(document.getElementById('clear'),'click',function () {
	document.getElementById('searchText').value = '';
	root.search(null);
	document.getElementById('result').innerHTML = '';	
});
//=======================================Demo展示区==================================================
//动态生成Demo树
root.addChild("技术").addChild("IT公司").addChild("谈笑风生");
root.Children[0].addChild("HTML5").addChild("CSS3").addChild("JavaScript").addChild("PHP").addChild("Node.JS").toggleFold();
root.Children[0].Children[4].addChild("JavaScript").toggleFold();
root.Children[1].addChild("百度").addChild("腾讯").addChild("大众点评").toggleFold();
root.Children[2].addChild("身经百战").addChild("学习一个").addChild("吟两句诗").toggleFold();
root.Children[2].Children[2].addChild("苟利国家生死以").toggleFold();
//初始化查询Demo值
document.getElementById("searchText").value = "JavaScript";
//==================================================================================================

function trim(str) {
	var result = '';
	for (var i = 0; i < str.length; i++) {
		if (str[i] !== ' ' && str[i] !== '\t') {
			break;
		}
	}
	for (var j = str.length - 1; j >= 0; j--) {
		if (str[j] !== ' ' && str[j] !== '\t') {
			break;
		}
	}
	result = str.substring(i,j+1);
	return result;
}
//浏览器兼容操作
function addEvent(ele, event,handler)  {
	if (ele.addEventListener) {
		ele.addEventListener(event, handler, false);
	}else if (ele.attachEvent) {
		ele.attachEvent('on'+event, handler);
	}else {
		ele['on'+event] = handler;
	}
}