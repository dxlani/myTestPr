import { VueComponent, Prop, Watch } from 'vue-typescript'
import { dataService } from '../service/dataService';
import * as VueRouter from 'vue-router';
import { platform } from 'os';

declare var $: any;
Vue.use(VueRouter);

var router = new VueRouter();

   //监听物理返回按钮  
   if(window.location.href.indexOf("wechatConfirm") != -1){
       if(navigator.userAgent.indexOf('MicroMessenger') != -1 ){
            if (window.sessionStorage.getItem("logined") == null && window.location.href.indexOf("wechatConfirm/login") == -1 && window.location.href.indexOf("&autologin=true") == -1) {
                $.toptip('用户未登录，请登录！', 'warning');
                 window.location.href = dataService().wxUrl;
            }
       }else {
            if(dataService().wxUrl){
                 window.location.href = dataService().wxUrl;
            }
       }
   }
   


@VueComponent({
    template: require('./wx-content.html'),
    style: require('./wx-content.scss')
})
export class wxContent extends Vue {


    @Watch('$route.path')
    pathChanged() {
        if (this.$route.path == "/"){
            window.location.href = dataService().wxUrl;
        }
        if (this.$route.path == dataService().wxUrl) {
            window.sessionStorage.removeItem("logined")//退出登陆后清除登陆信息
            window.sessionStorage.removeItem("userInfo");
            window.sessionStorage.removeItem("userName");
        }
    }

    //该方法会在加载页面和刷新的时候触发
    ready() {
          
    }
     
    }


 



