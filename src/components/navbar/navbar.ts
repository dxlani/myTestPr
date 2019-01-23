import { VueComponent, Prop, Watch } from 'vue-typescript'
import * as VueRouter from 'vue-router';
//import '../../img/a0.jpg';
//import '../../img/headerBg.png';
//import '../../img/toNewPage.png';
//import '../../img/toOrderPage.png';

Vue.use(VueRouter);
var router = new VueRouter();
;

class Link {
    name: string;
    path: string;

    constructor(name: string, path: string) {
        this.name = name;
        this.path = path;
    }
}



@VueComponent({
    template: require('./navbar.html'),
    style: require('./navbar.scss')
})
export class Navbar extends Vue {

    @Prop
    inverted: boolean = true; //default value
    terr: boolean = false;

    @Prop
    userName = "";
    object: { default: string } = { default: 'Default object property!' }; //objects as default values don't need to be wrapped into functions
    isAdmin="";
    webAuthorize="";
    @Prop
    isFolded: boolean = false;
    asideFolded: boolean = true;
    fullscreen: boolean = true;
    faDedent: boolean = true;
    routerPath: string = "";
    showBtn: boolean = false
    btnClass: boolean = false
    links: Link[] = [
        new Link('Home', '/app/home'),
        new Link('About', '/app/about/se'),
        new Link('InquiryReleaseManage', '/app/inquiry/inquiryReleaseManage'),
        new Link('InquiryManage', '/app/inquiry/inquiryManage'),
        new Link('InquiryAdd', '/app/inquiry/inquiryAdd'),
        new Link('OrderReleaseManage', '/app/order/orderReleaseManage'),/* 5,待处理 */
        new Link('OrderReleaseDetail', '/app/order/orderReleaseDetail'),
        new Link('OrderReleaseAdd', '/app/order/orderReleaseAdd'),
        new Link('OrderManage', '/app/order/orderManage'),/* 8,待发货 */
        new Link('OrderManageDetail', '/app/order/orderManageDetail'),
        new Link('Sumaccount', '/app/Sumaccount'),
        new Link('SumaccountDetail', '/app/SumaccountDetail'),
        new Link('UserInfo', '/app/userInfo'),
        new Link('login', '/login'),
        new Link('DataAnalysis', '/app/dataAnalysis'),
        new Link('DataAnalysisCost', '/app/dataAnalysisCost'),
        new Link('QualityAnalysis', '/app/qualityWave'),
        new Link('authorityManage', '/app/authorityManage'),
        new Link('InquiryConfirmManage', '/app/inquiry/inquiryConfirmManage'),
        new Link('OrderManageDelivered', '/app/order/OrderManageDelivered'),  /* 19,已发货 */
        new Link('FeeManage','/app/feeManage'),  /**20,费用管理 */
    ]

    @Watch('$route.path')
    pathChanged() {
        if (window.sessionStorage.getItem("logined") != "yes" && this.$route.path != "/login") {
            router.go("/login")
        }
        if (window.sessionStorage.getItem("isContract") != "true" && this.$route.path != "/login") {
            router.go("/login")
        }
 
        if (this.$route.path == "/app/inquiry/inquiryReleaseManage" || this.$route.path == "/app/inquiry/inquiryManage" || this.$route.path == "/app/order/orderReleaseManage" || this.$route.path == "/app/order/orderManage" || this.$route.path == "/app/Sumaccount"
        || this.$route.path == "/app/inquiry/newInquiryReleaseManage" || this.$route.path == "/app/inquiry/newInquiryManage" || this.$route.path == "/app/order/newOrderReleaseManage" || this.$route.path == "/app/order/newOrderManage" || this.$route.path == "/app/newSumaccount"
    ) {
            this.showBtn = true;
        } else {
            this.showBtn = false;
        }
        /* 旧页面切新页面 */
        if (this.$route.path == "/app/inquiry/inquiryReleaseManage") {
            this.routerPath = '/app/inquiry/newInquiryReleaseManage';
            this.btnClass = false;
        }
        if (this.$route.path == "/app/inquiry/inquiryManage") {
            this.routerPath = '/app/inquiry/newInquiryManage';
            this.btnClass = false;
        }
        if (this.$route.path == "/app/order/orderReleaseManage") {
            this.routerPath = '/app/order/newOrderReleaseManage';
            this.btnClass = false;
        }
        if (this.$route.path == "/app/order/orderManage") {
            this.routerPath = '/app/order/newOrderManage';
            this.btnClass = false;
        }
        if (this.$route.path == "/app/Sumaccount") {
            this.routerPath = '/app/newSumaccount';
            this.btnClass = false;
        }
        if (this.$route.path == "/app/inquiry/newInquiryReleaseManage") {
            this.routerPath = '/app/inquiry/inquiryReleaseManage';
            this.btnClass = true;
        }
        if (this.$route.path == "/app/inquiry/newInquiryManage") {
            this.routerPath = '/app/inquiry/inquiryManage';
            this.btnClass = true;
        }
        if (this.$route.path == "/app/order/newOrderReleaseManage") {
            this.routerPath = '/app/order/orderReleaseManage';
            this.btnClass = true;
        }
        if (this.$route.path == "/app/order/newOrderManage") {
            this.routerPath = '/app/order/orderManage';
            this.btnClass = true;
        }
        if (this.$route.path == "/app/newSumaccount") {
            this.routerPath = '/app/Sumaccount';
            this.btnClass = true;
        }


    }

    //该方法会在加载页面和刷新的时候触发
    ready() {
        var userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.userName = userInfo ? userInfo.userName : "";
        this.isAdmin=sessionStorage.getItem("isAdmin");
        this.webAuthorize=sessionStorage.getItem("webAuthorize");

        this.setClasses();
        if (location.href.indexOf("/app/inquiry/inquiryReleaseManage") != -1 || location.href.indexOf("/app/inquiry/inquiryManage") != -1 || location.href.indexOf("/app/order/orderReleaseManage") != -1 || location.href.indexOf("/app/order/orderManage") != -1 || location.href.indexOf("/app/Sumaccount") != -1
        || location.href.indexOf("/app/inquiry/newInquiryReleaseManage") != -1 || location.href.indexOf("/app/inquiry/newInquiryManage") != -1 || location.href.indexOf("/app/order/newOrderReleaseManage") != -1 || location.href.indexOf("/app/order/newOrderManage") != -1 || location.href.indexOf("/app/newSumaccount") != -1
    ) {
            this.showBtn = true;
        } else {
            this.showBtn = false;
        }
        if (location.href.indexOf("app/inquiry/inquiryReleaseManage") != -1) {
            this.routerPath = '/app/inquiry/newInquiryReleaseManage';
            this.btnClass = false;
        }
        if (location.href.indexOf("inquiry/inquiryManage") != -1) {
            this.routerPath = '/app/inquiry/newInquiryManage';
            this.btnClass = false;

        }
        if (location.href.indexOf("/app/order/orderReleaseManage") != -1) {
            this.routerPath = '/app/order/newOrderReleaseManage';
            this.btnClass = false;

        }
        if (location.href.indexOf("/app/order/orderManage") != -1) {
            this.routerPath = '/app/order/newOrderManage';
            this.btnClass = false;
        }
        if (location.href.indexOf("/app/Sumaccount") != -1) {
            this.routerPath = '/app/newSumaccount';
            this.btnClass = false;
        }
        if (location.href.indexOf("app/inquiry/newInquiryReleaseManage") != -1) {
            this.routerPath = '/app/inquiry/inquiryReleaseManage';
            this.btnClass = true;
        }
        if (location.href.indexOf("/app/inquiry/newInquiryManage") != -1) {
            this.routerPath = '/app/inquiry/inquiryManage';
            this.btnClass = true;
        }
        if (location.href.indexOf("/app/order/newOrderReleaseManage") != -1) {
            this.routerPath = '/app/order/orderReleaseManage';
            this.btnClass = true;
        }
        if (location.href.indexOf("/app/order/newOrderManage") != -1) {
            this.routerPath = '/app/order/orderManage';
            this.btnClass = true;
        }
        if (location.href.indexOf("/app/newSumaccount") != -1) {
            this.routerPath = '/app/Sumaccount';
            this.btnClass = true;
        }
    }


    isLogined: boolean = false;
    clearActive() {
        $('.active').removeClass('active');
    }

    toggle(data) {
        window.localStorage.clear();
        $('#navbar' + data).toggleClass("active");
        $('#navbar' + data).siblings(".active").removeClass('active');
    }

    clearStorage() {
        window.localStorage.clear();
    }



    setClasses = function () {
        if (this.asideFolded) {
            this.faDedent = "fa fa-fw fa-dedent";
        } else {
            this.faDedent = "fa fa-fw fa-indent";
        }
    }

    changeDedentIcon = function () {
        if (this.asideFolded) {
            this.asideFolded = false;
            this.isFolded = true;
            this.$dispatch('changeNavLeft', this.isFolded);
        } else {
            this.asideFolded = true;
            this.isFolded = false;
            this.$dispatch('changeNavLeft', this.isFolded);

        }
        this.setClasses();
    }
    redirectPage() {
        router.go(this.routerPath);
    }

} 
