import { VueComponent } from 'vue-typescript'
import { dataService } from '../../../service/dataService'
import * as VueRouter from 'vue-router'
import '../../../img/aiBg.jpg';
import '../../../img/circle1.png';
import '../../../img/circle2.png';
import '../../../img/circle3.png';
declare var $: any;
declare var document: any;
declare var navigator: any;
Vue.use(VueRouter);

var router = new VueRouter();

@VueComponent({
    template: require('./aiShow.html'),
    style: require('./aiShow.scss'),
})
export class aiShow extends Vue {
    el: '#aiShow';
  
    ready () {
        this.browserRedirect();
        document.documentElement.style.height = window.innerHeight + 'px';
        }
        openwechat(){
            location.href="weixin://"
        }
         full(){
            let main = document.body;
            if (main.requestFullscreen) {
               main.requestFullscreen();
            } else if (main.mozRequestFullScreen) {
                main.mozRequestFullScreen();
            } else if (main.webkitRequestFullScreen) {
                main.webkitRequestFullScreen();
            } else if (main.msRequestFullscreen) {
                main.msRequestFullscreen();
            }
    
             if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
         browserRedirect() {
                var sUserAgent = navigator.userAgent.toLowerCase();
                var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
                var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                var bIsMidp = sUserAgent.match(/midp/i) == "midp";
                var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                var bIsAndroid = sUserAgent.match(/android/i) == "android";
                var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
                if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                    document.getElementById('circle0').style.bottom="30%";  
                    return true;            
                } else {
                    document.getElementById('circle0').style.bottom="35%";  
                    return false;
                }
            }
   
}