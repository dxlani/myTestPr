import { VueComponent } from 'vue-typescript'
import { dataService } from '../../../service/dataService'
import * as VueRouter from 'vue-router'
import '../../../img/cspBg.jpg';
import '../../../img/circle1.png';
import '../../../img/circle2.png';
import '../../../img/circle3.png';
import '../../../img/point1.png';
import '../../../img/point2.png';
declare var $: any;
declare var document: any;
declare var navigator: any;
Vue.use(VueRouter);

var router = new VueRouter();

@VueComponent({
    template: require('./cspShow.html'),
    style: require('./cspShow.scss'),
})
export class cspShow extends Vue {
    el: '#cspShow';
  
    ready () {
            window.localStorage.setItem('pageversion','1')
            this.browserRedirect();
            document.documentElement.style.height = window.innerHeight + 'px';
            if(window.location.hostname=='csp.sowl.cn'){
                var usename="麦当劳"
            }else if(window.location.hostname=='csp.jfry.cn'){
                var usename="肯德基"
            }
            dataService().User.login(usename,"123456", "").then((res)=>{
                var loginData=res;
                window.sessionStorage.setItem("logined","yes");
                var userInfo=JSON.stringify(loginData);
                window.sessionStorage.setItem("userInfo",userInfo);
                window.sessionStorage.setItem("userName",res.userName);
            },function(err){
                console.log(err)
            })
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
                    document.getElementById('circle').style.bottom="4%";  
                    return true;            
                } else {
                    document.getElementById('circle').style.bottom="10%";  
                    return false;
                }
            }
            jump(index){
                if(index=="1"){
                    this.$router.go('/cspOnroad')
                }else if(index=="2"){
                    this.$router.go('/cspWxdataAnalysis')
                }else if(index=="3"){
                    this.$router.go('/cspShowMessage')
                }
            }
   
}