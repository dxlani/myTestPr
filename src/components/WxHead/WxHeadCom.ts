import { VueComponent, Prop, Watch } from 'vue-typescript'
import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router'
import '../../../node_modules/jquery-weui/dist/lib/weui.css';
import '../../../node_modules/jquery-weui/dist/css/jquery-weui.min.css';
import '../../../node_modules/jquery-weui/dist/js/city-picker.min.js';
import '../../../node_modules/jquery-weui/dist/lib/fastclick.js';
import '../../../node_modules/jquery-weui/dist/js/jquery-weui.js';
/**dev */
// import '../../MP_verify_iqs5xfvxPByGkNhV.txt';
/**正式服 */
import '../../MP_verify_uxzsqrcdAEwzOVFu.txt';

declare var document: any;
declare var target: any;
declare var $: any;
declare var unescape: any;
Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
  template: require('./WxHead.html'),
  style: require('./WxHead.scss')
})

export class WxHeadCom extends Vue {

  @Prop
  
  @Watch('$route.path')
  pathChanged() {
    if (this.$route.path == "/") {
      window.location.href = dataService().weUrl;
    }

    if (window.sessionStorage.getItem("isContract") != "true" && window.sessionStorage.getItem("logined") != "yes" && window.location.href.indexOf("WxLogin/Login")==-1) {
      window.location.href = dataService().weUrl;
    }
    if (this.$route.path == dataService().weUrl) {
      window.sessionStorage.removeItem("logined")//退出登陆后清除登陆信息
      window.sessionStorage.removeItem("userInfo");
      window.sessionStorage.removeItem("userName");
      window.sessionStorage.removeItem("isContract");

    }
  }
  ready() {
    // if (window.sessionStorage.getItem("isContract") != "true" && window.sessionStorage.getItem("logined") != "yes" && window.location.href.indexOf("WxLogin/Login")==-1) {
    //   window.location.href = dataService().weUrl;
    // }

  }

}


