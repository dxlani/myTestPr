import { VueComponent } from 'vue-typescript'
import { AboutComponent } from '../../views/about/about';
import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router';
import '../../img/login-bj.png';
import '../../img/group.png';
import '../../img/group2.png';
import '../../img/group4.png';
import '../../img/login.png';
import '../../favicon.ico';
import '../../img/login-yun.png';
import '../../img/login-wenzi.png';
import '../../img/huojian.png';
import '../../img/login-yonghu.png';
import '../../img/login-mima.png';
import '../../img/login-erweima.png';
import '../../img/login-bottomimg.png';

Vue.use(VueRouter);
var router = new VueRouter();

var wilddog = require('wilddog');
declare var $:any;
@VueComponent({
    template: require('./login.html'),
    style: require('./login.scss')
})
export class LoginComponent extends Vue {
    el: '#login';
    components: ({
        AboutComponent: AboutComponent,
        vclienttable: any

    })
    authError=""
    user={
        weChatOpenid:"",
        userName:"",
        password:"",
        remenber:false
    }

    id: string= "";
    /**wilddogUrl */
    wilddogUrl:string="";
    /**Csp版本号 */
    versionCsp:string = "";
    /**是否显示更新说明 */
    isShow: any;

    ready=function(){
        this.versionCsp = "V18-0312";
        // this.wilddogUrl = dataService().wilddogUrl;
        this.authError="";
         //设置背景图片
        $('body').css({
            'backgroundImage': 'url(./img/login-bj.png)',
            'backgroundAttachment': 'fixed',
            'backgroundSize': 'cover'
        });
    }
    login=function(){
        if($('#login_loginBtn').hasClass('disabled')){
            return;
        }

        var loginData;
        dataService().User.login(this.user.userName,this.user.password, this.user.weChatOpenid).then((res)=>{
            if(!(res&&res.jwtToken)){
                bootbox.alert(res.errorMessage);
                return;
            }
            loginData=res;
            window.sessionStorage.setItem("logined","yes");
            var userInfo=JSON.stringify(loginData);
            window.sessionStorage.setItem("userInfo",userInfo);
            window.sessionStorage.setItem("isContract",loginData.isContract);
            window.sessionStorage.setItem("userName",res.userName);
            window.sessionStorage.setItem("isAdmin",res.isAdmin);
            window.sessionStorage.setItem("weChatAuthorize",res.weChatAuthorize);
            window.sessionStorage.setItem("webAuthorize",res.webAuthorize);

            // this.id = JSON.parse(window.sessionStorage.getItem("userInfo")).id;
            // var userData = wilddog.initializeApp({
            //     syncURL: this.wilddogUrl+"cspversion/" + this.id
            // });
            // var ref = userData.sync().ref();
            // ref.once('value',(snapshot)=>{
            //     if(!(snapshot.val() && snapshot.val().isClosed) || snapshot.val().version  != this.versionCsp || snapshot.val().isClosed == "false" ){
            //         ref.set({
            //             version:this.versionCsp,
            //             isClosed:"false"
            //         })
            //         //显示
            //         this.isShow = "true";
            //     }else{
            //         //不显示
            //         this.isShow = "false";
            //     }
            // }).then(()=>{
                // router.go('/app/home?isShow=' + this.isShow);

                if(loginData.isContract){
                    router.go('/app/home');
                }else{
                    $('#myModal').modal({
                        keyboard: false,
                        backdrop:"static"
                    });
                }
              
            // });
        },function(err){
            console.log(err)
        })
    };
    getInquiryList = function () {
        // dataService().Inquiry.getInquiryList();
    }
    package:string = 'vue-typescript';
    repo:string = 'https://github.com/itsFrank/vue-typescript';
    /* 协议 同意 */
    agree=function(){
        /* api */
        dataService().User.contract().then((res)=>{
        if(res.success){
            $('#myModal').modal('hide');
            window.sessionStorage.setItem("isContract",'true');
            router.go('/app/home');
        }
        })
    }

    /* 协议 不同意 */
    disagree=function(){
        $('#myModal').modal('hide');
        window.sessionStorage.removeItem("logined");
        window.sessionStorage.removeItem("userInfo");
        window.sessionStorage.removeItem("isContract");
        window.sessionStorage.removeItem("userName");
        router.go('/login');
    }
}
