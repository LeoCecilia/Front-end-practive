window.onload = Load();
function Load() {
    var input = $('input'),
        ul = $('ul'),
        Li = $('li'),
        text = ['Simon', 'Erik','Summer','Kener','apple','anchor','beauty','city','baby'],
        Display = [];
    inputCharge();
    keydownLi();
    liChosen();
    function inputCharge() {
        $.on(input,'input',search);//输入时，触发search函数
    }
    function search() {
        var Value = input.value,
            flag = 0;//标志是否有匹配项
        if (Value !== '') {
            text.forEach(function(element,index,array) {
                //i表示不区分大小写模式
                if(element.match(new RegExp('^' + Value, 'i'))){
                    //RegExp['$&']--  lastMatch:表示最近的一次匹配项
                    //RegExp["$'"]--  表示字符串中lastMatch之后的文本                    
                    Display.push([RegExp['$&'],RegExp["$'"]]);//二维数组
                    flag = 1;
                }
            });
            if (flag) {
                render();                 
            }else{
                ul.style.display = 'none';
            }          
        }else{
            ul.style.display = 'none';
        }
    }  
    function render() {
        var html = '';
        for (var i = 0; i < Display.length; i++) {
            html += '<li>'+'<span>' + Display[i][0] + '</span>' + Display[i][1] + '</li>';
        }
        ul.innerHTML = html;
        ul.style.display = 'block';
        Display = [];
    }
    function removeLiClass() {
        var oLi = ul.getElementsByTagName('li');
        for (var i = 0; i < oLi.length; i++) {
            removeClass(oLi[i],'active');
        }
    }
    function hasActive() {
        var Li = ul.getElementsByTagName('li');
        for (var i = 0; i < Li.length; i++) {
            if (hasClass(Li[i],'active')) {
                return true;
            }
        }
        return false;   
    }
    //input框聚焦时，键盘事件触发,而不是li触发的
    function keydownLi() {
        
         util.addEvent(input, 'keydown', function (ev) {
             var heightLi = $('.active'),
                 oEvent = ev || window.event;
             if (oEvent.keyCode === 38) {//向上
                if (heightLi) {
                    var previous = heightLi.previousElementSibling;
                    if (previous) {
                        removeLiClass();
                        addClass(previous,'active');
                    }
                }else{
                    addClass($('div li'),'active');
                }
             }
             if (oEvent.keyCode === 40) {//向下
                if (heightLi) {
                    var next = heightLi.nextElementSibling;
                    if (next) {
                        removeLiClass();
                        addClass(next,'active');
                    }
                }else{
                    addClass($('div li'),'active');
                }
             }
            if (oEvent.keyCode === 13) {//回车
               

                input.value = delSpan($('.active').innerHTML);
                ul.style.display = 'none';
            }                          
         });       
    }
    function delSpan(argument) {//删除<span></span>这一文本内容
        var b = argument.match(new RegExp('</span>','i'));
        return argument.substr(6,b.index-6) + argument.substr((b.index+7));
    }
    function liChosen() {       
        $.delegate(ul,'li','click',function(){
            input.value = delSpan(this.innerHTML);
            ul.style.display = 'none';
        });                 
        $.delegate(ul,'li','mouseover',function () {
            removeLiClass();//避免高亮li同时触发                
            addClass(this,'active');
        });
        $.delegate(ul,'li','mouseout',function () {
            removeLiClass();                
        });
    }
}