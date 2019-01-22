import { VueComponent, Prop, Watch} from 'vue-typescript'
import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router'
declare var $: any;
Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./wxfooter.html'),
    style: require('./wxfooter.scss')
})

export class wxfooter extends Vue {

    @Watch('$route.path')
    pathChanged() {
        if (this.$route.path.indexOf("wechat/onroad") != -1){
            $('.ZT').addClass('weui-bar__item--on').siblings('a').removeClass('weui-bar__item--on');
        }else if(this.$route.path.indexOf("wechat/WxdataAnalysis") != -1) {
            $('.SJ').addClass('weui-bar__item--on').siblings('a').removeClass('weui-bar__item--on');
        }else if(this.$route.path.indexOf("wechat/WxInquiryReleaseManage") != -1) {
            $('.XJ').addClass('weui-bar__item--on').siblings('a').removeClass('weui-bar__item--on');
        }else if(this.$route.path.indexOf("wechat/Wxorder") != -1) {
            $('.DD').addClass('weui-bar__item--on').siblings('a').removeClass('weui-bar__item--on');
        }else if(this.$route.path.indexOf("wechat/WxSetting") != -1) {
            $('.WO').addClass('weui-bar__item--on').siblings('a').removeClass('weui-bar__item--on');
        }
    }

    ready() {
        if (location.href.indexOf("wechat/onroad") != -1) {
            $('.ZT').addClass('weui-bar__item--on').siblings('a').removeClass('weui-bar__item--on');
        }
        if (location.href.indexOf("wechat/WxSetting") != -1) {
            $('.WO').addClass('weui-bar__item--on').siblings('a').removeClass('weui-bar__item--on');
        }
        if (location.href.indexOf("wechat/WxdataAnalysis") != -1) {
            $('.SJ').addClass('weui-bar__item--on').siblings('a').removeClass('weui-bar__item--on');
        }
        if (location.href.indexOf("wechat/WxInquiryReleaseManage") != -1) {
            $('.XJ').addClass('weui-bar__item--on').siblings('a').removeClass('weui-bar__item--on');
        }
        if (location.href.indexOf("wechat/Wxorder") != -1) {
            $('.DD').addClass('weui-bar__item--on').siblings('a').removeClass('weui-bar__item--on');
        }
        $('.weui-tabbar__item').click(function(){
            $(this).addClass('weui-bar__item--on').siblings('.weui-tabbar__item').removeClass('weui-bar__item--on');
        })

    }
    clear(){
        window.sessionStorage.removeItem('orderQueryTotal');
        window.sessionStorage.removeItem('orderQuery');
    }
}


