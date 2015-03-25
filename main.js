/**********使用requestAnimationFrame***********/
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());   
var loading = {
    loading_wave: document.getElementById("loading_pao"),
    total: 0,
    source: ['logo.png', 'lay1_1.png', 'lay2_1.png', 'lay3_1.png', 'lay4_1.png']
}
loading.per = (1 / loading.source.length);

loading.loadingdone = function(){
    $("#loading-wrap").fadeOut(500, function(){homepage.init();});
}
loading.loadingFn = function(){
    var img = new Image();
    img.onload = function(){
        /* 每加载完一张图片，就把total加一份 */
        loading.total += loading.per;
        loading.loading_wave.style.top = 120*(1-loading.total) + 'px';
        loading.source.pop();
        setTimeout(function(){
            if(loading.source.length == 0)
                loading.loadingdone();
            else 
                loading.loadingFn();
        }, 1000/3)
    }
    /* 每次调用一次函数，就会把图片src更改 */
    img.src = loading.source[loading.source.length - 1];
}

loading.loadingFn();

var logo = {
    ele: document.getElementById("logo"),
    y: 0,
    speed: 0,
    g: 3,
    fall: function(h, obj){
        logo.speed += logo.g;
        logo.y += logo.speed;
        if(logo.y > h){
            logo.y = h;
            logo.speed *= -1;
        }
        logo.speed *= 0.95;
        obj.style.top = logo.y - 320 + 'px';
    },
}
var homepage = {
    logoIn: function(){
        setInterval(function(){logo.fall(400, logo.ele)}, 15);
        bindWheelEvent();
    },
    init: function(){
        setTimeout(function(){homepage.logoIn()}, 500);
    }
}
/* 接下来实现滚动动画 */
/*********************************/
var sprite = {
    value: 0,
    position: 1,
    endValue: 150,
    runBr: false
}
sprite.ele = [
                {g: document.getElementById('bg1'), d:0, m: 4, m2: 43, v1: 40, v2: 40, v3: 40, l:170},
                {g: document.getElementById('g2'), d: 0, m: 5, m2: 45, v1: 40, v2: 36, v3: 44, l: 600},
                {g: document.getElementById('bg2'), d:0, m: 68, m2: 76, v1: 40, v2: 50, v3: 80, l:2800},
]
sprite.cw = document.documentElement.clientWidth || document.body.clientWidth - 0;

for (var i = 0; i < sprite.ele.length; i++) {
    sprite.ele[i].g.style.left = (sprite.cw + sprite.ele[i].l) + 'px';
}//重置定位

sprite.render = function(){
    if(sprite.value == 0 || sprite.value == sprite.endValue){
        return;
    }
    for(var i=0; i<sprite.ele.length; i++){
        if(sprite.value > sprite.ele[i].m){
            if(sprite.value < sprite.ele[i].m2){
                /* between m and m2 */
                sprite.ele[i].d += sprite.position * sprite.ele[i].v3;  
            }else {
                sprite.ele[i].d += sprite.position * sprite.ele[i].v2;
            }
        }else{
            sprite.ele[i].d += sprite.position * sprite.ele[i].v1 ;
        }
    }
}
sprite.update = function(){
    if(sprite.value < 0){
        sprite.value = 0;
        return ;
    }
    if(sprite.value >= sprite.endValue){
        sprite.value = sprite.endValue;
        return ;
    }
    for(var i=0; i<sprite.ele.length; i++){
        sprite.ele[i].g.style.webkitTransform = 'translate3d(-' + sprite.ele[i].d + 'px,0,0)';
        sprite.ele[i].g.style.mozTransform = 'translate3d(-' + sprite.ele[i].d + 'px,0,0)';
        sprite.ele[i].g.style.msTransform = 'translate3d(-' + sprite.ele[i].d + 'px,0,0)';
        sprite.ele[i].g.style.transform = 'translate3d(-' + sprite.ele[i].d + 'px,0,0)';
    }
}
sprite.scrollFn = function(){
    sprite.render();
    sprite.update();
}
var scrollFunc = function(e){
    if (!sprite.runBr) {
        sprite.runBr = true;
        window.requestAnimationFrame(function() {
            sprite.runBr = false;
        });
        e = e || window.event;
        if (e.wheelDelta) {
            if (e.wheelDelta > 0) {
                /* shang */
                sprite.value--;
                sprite.position = -1;
            } else {
                /* xia gun */
                sprite.value++;
                sprite.position = 1;
            }
        } else if (e.detail) {
            if (e.detail > 0) {
                sprite.value++;
                sprite.postion = 1;
            } else {
                sprite.value--;
                sprite.postion = -1;
            }
        }
        // console.log(sprite.value);
        sprite.scrollFn();
        if (e.preventDefault) e.preventDefault();
        else return false;
    }
}
function bindWheelEvent(){
    if(document.addEventListener){
        document.addEventListener('DOMMouseScroll', function(event){
            scrollFunc(event);
        }, false);
    }
    window.onmousewheel = document.onmousewheel = scrollFunc;
}