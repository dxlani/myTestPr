import { VueComponent } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'

import '../../img/bj-img@3x.jpg';
import '../../img/yun_img@3x.png';
import '../../img/yonghu-icon@3x.png';
import '../../img/mima-img@3x.png';
import '../../favicon.ico';

declare var $: any;
declare var document: any;
declare var target: any;
declare var unescape: any;
declare var GetQueryString: any;
Vue.use(VueRouter);

var router = new VueRouter();

@VueComponent({
    template: require('./WxConfirmLogin.html'),
    style: require('./WxConfirmLogin.scss')
})
export class WxConfirmLoginComponent extends Vue {
    el: '#WxConfirmLogin';
    components: ({
        vclienttable: any
    })
    /**login */
    user = {
        phone: "",
        code: "",
        weChatOpenid: ""
    }
    /**默认验证码再次发送等待时间 */
    waitTime:number = null;
    /**验证码再次发送剩余等待时间 */
    timeleft:number = null;
    /**获取验证码按钮内容 */
    btnMessage:string="";
    /**定时器 */
    timeT:any;

    ready = function () {
        function GetQueryString(names) {
            var reg = new RegExp("(^|&)" + names + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            } else {
                return null;
            }
        };
        var myCode = GetQueryString("code");
        if (myCode != null && myCode.toString().length > 1) {
            GetQueryString("code")
            dataService().User.GetOpenidForCode(myCode).then((res) => {
                this.user.weChatOpenid = res.openid;
                     /* 修改刷新登录页的bug */
                if (this.user.weChatOpenid != undefined && this.user.weChatOpenid != null) {
                    window.sessionStorage.setItem("openid", this.user.weChatOpenid);
                    dataService().User.autoLogin(this.user.weChatOpenid).then((res)=>{
                        if(res.islogin){
                            window.sessionStorage.setItem("logined", "yes");
                            router.go('/wechatConfirm/wxAcceptanceList'); 
                        }else{
                            return;
                        }
                    });
                }else if(this.user.weChatOpenid == null){
                    window.location.href = dataService().wxUrl;
                }
            }, function (err) {});
            if (/Android [4-6]/.test(navigator.appVersion)) {
                document.write('<style>.Wxfoot{visibility:hidden}@media(min-height:' + ($(window).height() - 10) + 'px){.Wxfoot{visibility:visible}}</style>');
            };
        }
        this.waitTime = 60;
        this.btnMessage = "获取验证码";
        clearInterval(this.timeT);
    }

    /**获取验证码 */
    getCode(){
        $('#yzm').attr("disabled",true); //防止多次点击
        dataService().User.getCode(this.user.phone).then((res)=>{
            if(!res.status){
                $.toptip('请重新发送！', 'error')
                this.btnMessage = "重新发送";
                $('#yzm').removeAttr("disabled");
            }else{
                this.timeleft = this.waitTime;
                this.timeCount();
            }
        });
    }

    /**
     * 登陆
     */
    login = function(){
        if ($('#wxlogin_wxloginBtn').hasClass('weui-btn_disabled')) {
            $.toptip('请输入用户名和验证码！', 'warning');
            return;
        }
        var loginData;
        $.showLoading('登录中...');
        dataService().User.wechartLogin(this.user.phone, this.user.code,this.user.weChatOpenid).then((res) => {
            if (!res.isCheck) {
                $.toptip('请输入正确的验证码！', 'error');
                $.hideLoading();
                return;
                
            }
            window.sessionStorage.setItem("logined", "yes");
            $.hideLoading();
            clearInterval(this.timeT);
            router.go('/wechatConfirm/wxAcceptanceList'); 
        });
    }

    /**倒计时 */
    timeCount(){
        this.timeT = setInterval(()=>{
            this.timeleft-=1
            if (this.timeleft>0){
                this.btnMessage = this.timeleft+" 秒后重发";
            }else {
                this.btnMessage = "重新发送";
                this.timeleft = this.waitTime;
                clearInterval(this.timeT);
                this.user.code = "";
                $('#yzm').removeAttr("disabled");
            }
        },1000)
    }
}
