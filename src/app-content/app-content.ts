import { VueComponent, Prop, Watch } from 'vue-typescript'
import { dataService } from '../service/dataService';
import * as VueRouter from 'vue-router';

declare var $: any;
Vue.use(VueRouter);

var router = new VueRouter();

//监听物理返回按钮  
if (window.sessionStorage.getItem("logined") == null && window.location.href.indexOf("WxLogin/Login") == -1 && window.location.href.indexOf("/Wx") != -1) {
    window.location.href = dataService().weUrl;
    $.toptip('用户未登录，请登录！', 'warning');
}

@VueComponent({
    template: require('./app-content.html'),
    style: require('./app-content.scss')
})
export class appContent extends Vue {

    @Prop
    inverted: boolean = true; //default value
    terr: boolean = false;

    @Prop
    // realName = "";

    @Prop
    isFolded: boolean = false;

    @Watch('$route.path')
    pathChanged() {
        if (this.$route.path == "/") {
            router.go("/login")
        }
        if (window.sessionStorage.getItem("logined") != "yes" && this.$route.path != "/login") {
            router.go("/login")
        }
        if (window.sessionStorage.getItem("isContract") != "true" && this.$route.path != "/login") {
            router.go("/login")
        }
        if (this.$route.path == "/login") {
            this.isLogined = false;
            window.sessionStorage.removeItem("logined")//退出登陆后清除登陆信息
            window.sessionStorage.removeItem("isContract")//退出登陆后清除登陆信息
            window.sessionStorage.removeItem("userInfo");
            window.sessionStorage.removeItem("userName");
        }
    }

    //该方法会在加载页面和刷新的时候触发
    ready() {
        $('#userImg').attr("src", './img/a0.jpg');
        var userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        // this.realName = userInfo ? userInfo.userName : "";

        $('body').css({ 'backgroundImage': '', });

        this.$on('changeNavLeft', function (event) {
            this.isFolded = event;
        })
        // window.onresize = (ev) => {
        //     if (window.innerWidth < 1200) {
        //         this.isFolded = true
        //     } else {
        //         this.isFolded = false
        //     }
        // }
        // if (window.innerWidth < 1200) {
        //     this.isFolded = true
        // }
        $('.table-responsive').on("swipe", function () {
            // $("span").text("滑动检测!");
            // bootbox.alert('触摸')
        });
    }

    toggle = function (data) {
        // this.terr = !this.terr;
        $('#navbar' + data).toggleClass("active");
        $('#navbar' + data).siblings(".active").removeClass('active');
    }
    isLogined: boolean = false;


} 
