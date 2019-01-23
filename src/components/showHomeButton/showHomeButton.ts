import { VueComponent, Prop, Watch} from 'vue-typescript'
import * as VueRouter from 'vue-router'
declare var $: any;
Vue.use(VueRouter);
var router = new VueRouter();
declare var event:any;
//import '../../img/homeBtn.png';
@VueComponent({
    template: require('./showHomeButton.html'),
    style: require('./showHomeButton.scss')
})

export class showHomeButton extends Vue {
    el:'#wxContent'
    flag:boolean=false;
     cur = {
        x:0,
        y:0
    }
    nx=null;
    ny=null;
    dx=null;
    dy=null;
    x=null;
    y=null;
    showHomeButton:any;
    ready(){
        $(window).resize(function() {
            document.documentElement.style.height = window.innerHeight + 'px';
          });

        this.showHomeButton = document.getElementById("showHomeButton");

        this.x=document.body.offsetWidth-100;
        this.y=document.body.offsetHeight-100;
        this.showHomeButton.style.left = this.x+"px";
        this.showHomeButton.style.top = this.y +"px";

        this.showHomeButton.addEventListener("mousedown",()=>{
            this.down();
        },false);
        this.showHomeButton.addEventListener("touchstart",()=>{
            this.down();
        },false)
        this.showHomeButton.addEventListener("mousemove",()=>{
            this.move();
        },false);
        this.showHomeButton.addEventListener("touchmove",()=>{
             event.preventDefault();
            this.move();
        },false)
        document.body.addEventListener("mouseup",()=>{
            this.end();
        },false);
        this.showHomeButton.addEventListener("touchend",()=>{
            this.end();
        },false);
        /* 横竖屏判断，横屏则跳转首页 */
        if( window.localStorage.getItem('pageversion')=="1"){
            // if (window.orientation === 90 || window.orientation === -90 ){ 
            //     router.go('/csp/cspShow')
            // } 
         window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
                if (window.orientation === 180 || window.orientation === 0) { 
                //  alert('竖屏状态！');
                } 
                if (window.orientation === 90 || window.orientation === -90 ){ 
                    router.go('/csp/cspShow')
                } 
            }, false);
       }
    }
   
    

    down(){
        this.flag = true;
        var touch ;
        if(event.touches){
            touch = event.touches[0];
        }else {
            touch = event;
        }
        this.cur.x = touch.clientX; 
        this.cur.y = touch.clientY;
        this.dx = this.showHomeButton.offsetLeft;
        this.dy = this.showHomeButton.offsetTop;
    }
    move(){
        if(this.flag){
            var touch ;
            if(event.touches){
                touch = event.touches[0];
            }else {
                touch = event;
            }
            this.nx = touch.clientX - this.cur.x;
            this.ny = touch.clientY - this.cur.y;
            this.x = this.dx+this.nx; 
            this.y = this.dy+this.ny; 
           if(this.x<=0){this.x=0;}
           if(this.x>=document.body.offsetWidth-70){this.x=document.body.offsetWidth-70;}
           if(this.y<=0){this.y=0;}
           if(this.y>=document.body.offsetHeight-70){this.y=document.body.offsetHeight-70;}
           this.showHomeButton.style.left = this.x+"px";
           this.showHomeButton.style.top = this.y +"px";
        }
    }

    end(){
        this.flag = false;
    }
  
    //  stopdefault(event) {
    //     var w = x<0?x*-1:x;     //x轴的滑动值
    //     var h = y<0?y*-1:y;     //y轴的滑动值
    //     if(w>h){                //如果是在x轴中滑动
    //        event.preventDefault();
    //     }
    //     event.preventDefault();
    // }
    showHome(){
        if(window.localStorage.getItem('pageversion')==='1'){
            router.go('/csp/cspShow')
        }else{
            router.go('/cspShow')
        }
    }
}


