window.onload = winLoad();
function winLoad() {
	Slidesnow($('.imgContainer'),{});
	/**
     * 轮播图组件
     * @param {HTMLELement} element HTML节点图片容器
     * @param {JSON}                     option  配置项
     *   @config   {String}                 noLoop         不循环？，默认为循环，只要存在则不循环
     *   @config   {String}                  reverse        是否反向，只有“noLoop”不存在时，也就是只有循环时，才执行。
     *   @config   {Number}             intervalTime   轮播间隔时间（单位为毫秒），默认为4000，
     */	
	function Slidesnow(element,option) {
		var timer = null,//自动播放计时器
			imgArr = element.getElementsByTagName('img');
			imgArrLen = imgArr.length,
			createUl = document.createElement('ul'),
			iCurrent = parseInt(getStyle(imgArr[0],'width'));
		var iSpeed;
		element.style.width = iCurrent * imgArrLen + 'px';
		for (var i = 0; i < imgArrLen; i++) {
			createUl.innerHTML += '<li></li>';
		}
		element.parentNode.appendChild(createUl);
		addClass(createUl,'Slideshow-nav');
		addClass(createUl.getElementsByTagName('li')[0],'active');
		//创建左右导航
		var createSpan = document.createElement('div');
		addClass(createSpan,'left-right');
		createSpan.innerHTML = "<span class = 'nav-left'>&lt;</span><span class = 'nav-right'>&gt;</span>";
		element.parentNode.appendChild(createSpan);
		//图片自动播放间隔时间
		if (option.intervalTime) {
			iSpeed = option.intervalTime;
		}else{
			iSpeed = 4000;
		}
		//实现自动播放
		timer = setInterval(autoPlay,iSpeed);
		clickLi();//执行点击函数
		hoverElement();
		/*
         * 移入图片容器暂停，移出继续播放。
         * 因为该函数，避免了很多复杂的东西以及bug
         */
        function hoverElement(){
        	//element在Line3已有定义
        	util.addEvent(element.parentNode,'mouseover', function(){
        		clearInterval(timer);
        	});
        	util.addEvent(element.parentNode,'mouseout', function() {
        		timer = setInterval(autoPlay,iSpeed);
        	});
        }
        //点击Li
        function clickLi() {
        	util.delegateEvent(createUl, 'li', 'click', function(){
        		var iTarget = -iCurrent * getIndex(this);
        		removeLiClass();
        		addClass(this,'active');//移出
        		startMove(element,{
        			'left':iTarget
        		});
        		clearInterval(timer);
        	});
        }
        //左右箭头
        clickSpan();
        //点击左右箭头
        function clickSpan() {
        	util.delegateEvent(createSpan,'span','click', function () {
        		var heightLi = $('Slideshow-nav active'),
        			//左右箭头的索引是0和1
        			leftIndex = !getIndex(this);//点击左时为true,点击右时为false
        			//移动的目标值，默认正向
        			play(leftIndex);

        	});
        }
        //自动播放调用函数
        function autoPlay() {
        	var heightLi = $('.Slideshow-nav .active'),
        		iTarget;
        	if (heightLi) {
        		if (option.noLoop) {
        			iTarget = (getIndex(heightLi)+1) === imgArrLen ? 0 : (-iCurrent(getIndex(heightLi)+1));
        			if (getIndex(heightLi)+1 === imgArrLen - 1) {
        				clearInterval(timer);
        			}
        			var nextLi = heightLi.nextElementSibling;
        			if (nextLi) {
        				removeLiClass();
        				addClass(nextLi,'active');
        			}
        			startMove(element,{
        				'left':iTarget
        			});
        		}else{
        			if (option) {
        				play(option.reverse);
        			}else{
        				play('');
        			}
        		}
        	}
        }
        function play(reverse) {
        	var heightLi = $('.Slideshow-nav .active'),
        		iTarget;
        	if (reverse) {
        		iTarget = getIndex(heightLi) === 0 ? -iCurrent*(imgArrLen - 1):-iCurrent*(getIndex(heightLi) - 1);//反向循环
        		var previousLi = heightLi.previousElementSibling;
        		if (previousLi) {
        			removeLiClass();
        			addClass(previousLi,'active');
        		}else{
        			removeLiClass();
        			addClass(createUl.getElementsByTagName('li')[imgArrLen-1],'active');

        		}
        	}else{
        		iTarget = (getIndex(heightLi) + 1) === imgArrLen ? 0 : (-iCurrent*(getIndex(heightLi)+1));
        		var nextLi = heightLi.nextElementSibling;
        		if (nextLi) {
        			removeLiClass();
        			addClass(nextLi,'active');
        		}else{
        			removeLiClass();
        			addClass($('.Slideshow-nav li'),'active');//返回第一个li节点(util.js);
        		}
        	}
        	startMove(element,{
        		'left': iTarget
        	});

        }
        function removeLiClass() {
        	var oLi = createUl.getElementsByTagName('li');
        	for (var i = 0; i < oLi.length; i++) {
        		removeClass(oLi[i],'active');
        	}
        }
    }
	
}