import { VueComponent, Prop, Watch } from 'vue-typescript'

import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router';

//import '../../img/bj_img@3x.png';
//import '../../img/bj_title@3x.png';
//import '../../img/01_icon@3x.png';
//import '../../img/02_icon@3x.png';
//import '../../img/03_icon@3x.png';
//import '../../img/04_icon@3x.png';
//import '../../img/05_icon@3x.png';
//import '../../favicon.ico';


Vue.use(VueRouter);

var router = new VueRouter();
class Link {
    name: string;
    path: string;

    constructor(name: string, path: string) {
        this.name = name;
        this.path = path;
    }
}

@VueComponent({
    template: require('./WxIndex.html'),
    style: require('./WxIndex.scss')
})
export class WxIndexComponent extends Vue {
    el: '#WxIndexPanel';
    components: ({
        vclienttable: any
    })
    // @Prop
    /**本月总询价量 */
    inquiryTotal:number = null;
     /**累计发布询价单数量 */
     inquiryReleaseTotal:number = null;
     /**本月总订单量 */
    orderTotal:number = null;
    /**累计发布订单数量 */
    orderReleaseTotal:number = null;
    userName = "";
    openida = "";
    object: { default: string } = { default: 'Default object property!' }; //objects as default values don't need to be wrapped into functions
    links: Link[] = [
        new Link('WxInquiryAdd', '/WxInquiry/WxInquiryAdd?id=""&name=add'),
        new Link('WxInquiryManage', '/WxInquiry/WxInquiryManage'),
        new Link('WxOrderAdd', '/WxOrder/WxOrderAdd'),
        new Link('WxOrderReleaseManage', '/WxOrder/WxOrderReleaseManage'),
        new Link('WxAnalysis', '/WxAnalysis/WxdataAnalysis')
    ]

    @Watch('$route.path')
    pathChanged() {
        if (window.sessionStorage.getItem("isContract") != "true" && window.sessionStorage.getItem("logined") != "yes" && window.location.href.indexOf("WxLogin/Login")==-1) {
            window.location.href = dataService().weUrl;
        }

    }
    ready = function () {
        /**移除滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style", "");
        /**询价单数据 */
        dataService().Work.getCount().then((res)=>{
            this.inquiryTotal = res.inquiry;
            this.inquiryReleaseTotal = res.totalCount;
            this.orderTotal = res.order;
            this.orderReleaseTotal = res.orderCount;
        });
        var userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.userName = userInfo ? userInfo.userName : "";
    }
    /**注销 */
    logOut = function () {
        window.sessionStorage.removeItem("logined")//退出登陆后清除登陆信息
        window.sessionStorage.removeItem("userInfo");
        window.sessionStorage.removeItem("userName");
        window.sessionStorage.removeItem("isContract");
        this.openida = window.sessionStorage.getItem("openid");
        if (this.openida != "") {
            dataService().User.LogOutOpenid(this.openida).then((res) => {
                window.sessionStorage.removeItem('openid');
            }, function (err) {
                console.log(err)
            });
        }
        window.location.href = dataService().weUrl;
    }

    package: string = 'vue-typescript';
    repo: string = 'https://github.com/itsFrank/vue-typescript';

}
