import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
//import '../../img/bj_img@3x.png';
//import '../../img/person.png';
//import '../../img/upArrow@2x.png';
//import '../../img/downArrow@2x.png';
//import '../../img/settingPerson.png';
//import '../../img/fankui.png';
import * as VueRouter from 'vue-router';
declare var $:any;

Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxSetting.html'),
    style: require('./WxSetting.scss')
})
export class WxSettingComponent extends Vue{
    el:'#WxSetting';

    /* 用户名 */
    userName:string="";
    /* 订单增长数量 */
    orderPercent:string = "";
    /* 订单增长状态 */
    orderPercentStatus:string = "";
    /* 是否增长 */
    isUp:boolean = false;
    /* 增长减少pic */
    arrowPic:string = "";
    /* 订单数量 */
    orderTotal:string = "";
    /**派车中 */
    sendingCar:number = null;
    /**待发货 */
    pendDelivery:number = null;
    /**已发货 */
    alreadyDelivery:number = null;
    /**已送达 */
    alreadyReach:number = null;
    /**未处理*/
    untreated:number = null;
    /**已终结 */
    orderEnd:number = null;
    /**账户余额 */
    accountBalance:string = "";
    /**账户状态 */
    accountStatus:string = "";
    isAdmin="";
    weChatAuthorize="";
    showTemp:boolean=true;

    ready(){
        var userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.userName = userInfo ? userInfo.userName : "";
        this.isAdmin=sessionStorage.getItem("isAdmin");
        this.weChatAuthorize=sessionStorage.getItem("weChatAuthorize");
        this.accountBalance = "";
        this.accountStatus = "";
        this.sendingCar = 0;
        this.pendDelivery = 0;
        this.alreadyDelivery = 0;
        this.alreadyReach = 0;
        this.untreated = 0;
        this.orderEnd = 0;
        if(this.weChatAuthorize.indexOf('5')>-1 || this.isAdmin=='true'){
            this.showTemp=true;
            dataService().Work.getOrderCount().then((res)=>{
                this.orderTotal = res.item1.order;
                this.orderPercent = res.item1.monthDiffer;
                this.orderPercentStatus = res.item1.rateTrend;
                this.sendingCar = res.item1.itc;
                this.pendDelivery = res.item1.wftd;
                this.alreadyDelivery = res.item1.ship;
                this.alreadyReach = res.item1.tchbd;
                this.untreated = res.item1.untreated;
                this.orderEnd = res.item1.oend;
            }).then(()=>{
                if(this.orderPercentStatus == "Up"){
                    this.orderPercentStatus = "增长：";
                    this.arrowPic = "./img/upArrow@2x.png";
                }else{
                    this.orderPercentStatus = "减少：";
                    this.arrowPic = "./img/downArrow@2x.png";
                }
            });
            /**获取账户状态及余额 */
            dataService().feeManage.getAccountInfo().then((res)=>{
                this.accountBalance = res.accountBalance;
                if(res.status){
                    this.accountStatus = "开启状态";
                }else{
                    this.accountStatus = "关闭状态";
                }
            });
        }else{
            this.showTemp=false;
        }
    }

    /**退出登录 */
    logOut = function () {
        window.sessionStorage.removeItem("logined");
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

    /* 跳转到订单页 */
    redirectOrder=function(){
        router.go('./Wxorder');
    }
     /* 跳转到在途页 */
     redirectOnroad=function(){
        router.go('./onroad');
    }

}
   