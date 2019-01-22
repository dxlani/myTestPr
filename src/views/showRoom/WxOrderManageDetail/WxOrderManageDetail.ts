import { VueComponent, Prop, Watch} from 'vue-typescript'
import {dataService} from '../../../service/dataService';
import * as VueRouter from 'vue-router';
import '../../../favicon.ico';
import '../../../components/WxHead/WxHeadCom'
import '../../../components/WxFoot/WxFootCom'
declare var $:any;

Vue.use(VueRouter);
var router = new VueRouter();
var orderTimer:any="";
export  {orderTimer}
@VueComponent({
    template: require('./WxOrderManageDetail.html'),
    style: require('./WxOrderManageDetail.scss')
})
export class cspWxOrderManageDetailComponent extends Vue{
    el:'#WxOrderManageDetail';
    components:({
        vclienttable:any,
    });
    @Prop
    /**通过路由获取*/
    /**订单id */
    id="";
    /**订单状态 */
     status="";
    //v-model
    /**订单编号 */
    orderId='';
    /**下单时间 */
    orderTime='';
    /**销售编号 */
    clientOrderId= '';
    /**客户单位*/
    customerUnit='';
    /**紧急程度*/
    urgency='';
    /**发货计划人*/
    consignor='';
    /**发货人电话*/
    consignorPhone='';
    /**发货内容*/
    orderContent='';
    /**总线路下 */
    /**发货地址 */
    shipAddress='';
    /**送货地址 */
    deliverAddress='';
    /**货物类别 */
    goodsTypeName='';
    /**货物名称 */
    goodsName='';
    /**货物数量 */
    goodsNum='';
    /**子线路下 */
    /**发货地址 */
    childShipAddress='';
    /**送货地址 */
    childDeliverAddress='';
    /**货物类别 */
    childGoodsType='';
    /**货物名称 */
    childGoodsName='';
    /**货物数量 */
    childGoodsNum='';
    /**所需车型*/
    carType='';
    /**所需车长*/
    carLength='';
    /**承运方式*/
    carrierCategory='';
    /**装车效果*/
    loadingEffect='';
    /**备注 */
    remarks='';

    /**承运商车辆信息 */
    /**车牌号 */
    carrierCarCode='';
    /**车长 */
    carrierCarLength='';
    /**车型 */
    carrierCarType='';
    /**承运商车辆信息 显示，隐藏*/
    carrierShow:boolean = true;

    /**总线路详情信息 */
    totalLineData=[];
    /**中转地 */
    totalVia = '';
    /**里程数 */
    totalMileage = '';
    /**货物数量 */
    totalGoodsNum = '';
    /**货物数量2 */
    totalGoodsNumTwo = '';
    /**子线路1信息 */
    childLineData=[];
    /**中转地 */
    childVia = '';
    /**里程数 */
    childMileage = '';
    /**货物数量 */
    childGoodsNumO = '';
    /**货物数量2 */
    childGoodsNumT = '';
    /**单价 */
    receivablePrice = '';
    /**总价 */
    receivableTotalPrice = '';
    /**工程总量 */
    projectMax = '';
        /* 订单跟踪 */
        orderFollowing=[];
        /* 显隐订单跟踪 */
        showDetailStatus=false;
        /* 跟踪时间 */
        trackTime=""
        /* 订单日时分秒 */
        orderDay="";
        orderHour="";
        orderMinute="";
        orderSecond="";
        /* 动态跟踪时间 */
        ordertrackTime="";

    ready(){
        /**添加滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style","height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.id = this.$route.query.id;
        this.status=this.$route.query.status;
        clearInterval(orderTimer);
        dataService().Order.getOrder(this.id).then((res)=>{ 
            this.orderId = res.orderId;
            this.clientOrderId = res.clientOrderId;
            this.orderTime = res.creationTime;
            this.urgency = res.responseTime;
            this.customerUnit = res.clientName;
            this.consignor = res.consignorName;
            this.consignorPhone = res.consignorPhone;
            this.orderContent = res.content;
            this.totalLineData = res;
            this.shipAddress = res.originAddress;
            this.deliverAddress = res.destinationAddress;
            this.goodsTypeName = res.goodsTypeName;
            this.goodsName = res.goodsName;
            this.goodsNum = res.goodsNum + res.goodsNumUnitStr;
            this.childLineData = res.items[0];
            this.childShipAddress = res.items[0].originAddress;
            this.childDeliverAddress = res.items[0].destinationAddress;
            this.childGoodsType = res.items[0].goodsTypeName;
            this.childGoodsName = res.items[0].goodsName;
            this.childGoodsNum = res.items[0].quantityOfGoods + res.items[0].goodsUnitStr;
            this.carType= res.vehicleTypeStr;
            this.carLength = res.carLengthStr;
            this.carrierCategory = res.carriageWayStr;
            this.loadingEffect = res.loadingEffect;
            this.remarks = res.remarks; 

            //承运商车辆信息 显示，隐藏(已派车、待发货、已发货、货已送达显示;  派车中，订单终结不显示)  
            if(res.orderStatus == "1" || res.orderStatus == "4" || res.orderStatus == "8" ){
                this.carrierShow=false;
            }else{
                this.carrierShow = true;
            }
            this.carrierCarCode =res.carrierCarCode
            this.carrierCarLength = res.carrierCarLengthStr
            this.carrierCarType = res.carrierVehicleTypeStr;

            this.totalMileage = "";
            this.totalVia = "";
            this.totalGoodsNum = "";
            this.totalGoodsNumTwo = "";

            this.childVia = "";
            this.childMileage = "";
            this.childGoodsNumO = "";
            this.childGoodsNumT = "";
            this.receivablePrice = "";
            this.receivableTotalPrice = "";
            this.projectMax = "";
        },(rej)=>{

        });

        // this.trackTime="1天23小时59分55秒";
        this.trackTime="2018-07-03 15:07:38";
        this.orderDay="";
        this.orderHour="";
        this.orderMinute="";
        this.orderSecond="";
        this.ordertrackTime="";
        if(this.status=='3' || this.status=='5' || this.status=='6' || this.status=='7'){
            this.timeGo();
        }
        this.orderFollowing=[
            {title:'货已送达',content:'您的货物已送达指定地点',time:'2018-7-21 22:23:21'},
            {title:'在途定位',content:'[车辆实时位置] 中国石化(常州灵桥加油站)，338省道灵桥头村路段(春江服务站西)',time:'2018-7-21 20:23:21'},
            {title:'在途定位',content:'[车辆实时位置] 江苏镇江京口区丁卯十二路470号',time:'2018-7-21 17:23:21'},
            {title:'已发货',content:'您的货物装车完毕，已发出',time:'2018-7-21 16:23:21'},
            {title:'已到场',content:'承运车辆已到场，请准备装货',time:'2018-7-21 15:23:21'},
            {title:'待发货',content:'您的订单已通过审核，承运车辆即将出发',time:'2018-7-21 14:23:21'},
            {title:'已派车',content:'您的订单已指定承运车辆',time:'2018-7-21 13:23:21'},
            {title:'派车中',content:'您的订单已被受理，正在派车',time:'2018-7-21 12:23:21'},
  
        ];

        $('.orderStatusDetail').children('.orderStatusPosition:gt(1)').hide();
        this.showDetailStatus=false;
      
        
    }

    /**总线路详情 */
    totalLineDetail = function(){
        var mileage = "";
        if(this.totalLineData.mileage == null){
            mileage = "";
        }else{
            mileage = this.totalLineData.mileage  + "公里";
        }
        this.totalMileage = mileage;
        this.totalVia = this.getViaAddress(this.totalLineData.viaAddressList);
        this.totalGoodsNum = this.totalLineData.goodsNum + this.totalLineData.goodsNumUnitStr;
        var totalGoodsNumTwo = "";
        if(this.totalLineData.goodsNumTwo == null){
            totalGoodsNumTwo = "";
        }else{
            totalGoodsNumTwo = this.totalLineData.goodsNumTwo  + this.totalLineData.goodsNumUnitTwoStr;
        }
        this.totalGoodsNumTwo = totalGoodsNumTwo;
    }

    /**子线路1详情 */
    childLineDetail = function(){
        this.childVia = this.getViaAddress(this.childLineData.viaList);
        var mileageC = "";
        if(this.childLineData.mileage == null){
            mileageC = "";
        }else{
            mileageC = this.childLineData.mileage + "公里";
        }
        this.childMileage = mileageC;
        this.childGoodsNumO = this.childLineData.quantityOfGoods + this.childLineData.goodsUnitStr;
        var childGoodsNumT = "";
        if(this.childLineData.quantityOfGoodsTwo == null){
            childGoodsNumT = "";
        }else{
            childGoodsNumT = this.childLineData.quantityOfGoodsTwo + this.childLineData.goodsUnitTwoStr;
        }
        this.childGoodsNumT = childGoodsNumT;
        var receivablePrice = "";
        if(this.childLineData.receivablePrice == null){
            receivablePrice = "";
        }else{
            receivablePrice = this.childLineData.receivablePrice + this.childLineData.receivablePriceUnitStr;
        }
        this.receivablePrice = receivablePrice;
        var receivableTotalPrice = "";
        if(this.childLineData.receivableTotalPrice == null){
            receivableTotalPrice = "";
        }else{
            receivableTotalPrice = this.childLineData.receivableTotalPrice + "元";
        }
        this.receivableTotalPrice = receivableTotalPrice;
        var projectMax = "";
        if(this.childLineData.projectMax == ""){
            projectMax = "";
        }else{
            projectMax = this.childLineData.projectMax + this.childLineData.projectMaxUnitStr;
        }
        this.projectMax = projectMax;
    }


    //修改中转地显示方式
    getViaAddress=function(viaList){
        var addre="";
        for(var i=0;i< viaList.length;i++){
            addre = addre +  (viaList[i].province  + viaList[i].city +  viaList[i].county )
            if(i != viaList.length - 1){
                addre += "；";
            }           
        }
        return addre;
    }


    package:string = 'vue-typescript';
    repo:string = 'https://github.com/itsFrank/vue-typescript';

     /* 显隐订单跟踪详情 */
     showDetail= function(){
        if(this.showDetailStatus==false){
            this.showDetailStatus=true;
            $('.orderStatusDetail').children('.orderStatusPosition:gt(1)').fadeIn();
        }else{
            this.showDetailStatus=false;
            $('.orderStatusDetail').children('.orderStatusPosition:gt(1)').fadeOut();
        }
    }

    /* 跟踪时间流 */
    timeGo=function(){
        // var day=Number(this.trackTime.substring(0,this.trackTime.indexOf('天')));
        // var hour=Number(this.trackTime.substring(this.trackTime.indexOf('天')+1,this.trackTime.indexOf('小时')));
        // var minute=Number(this.trackTime.substring(this.trackTime.indexOf('小时')+2,this.trackTime.indexOf('分')));
        // var second=Number(this.trackTime.substring(this.trackTime.indexOf('分')+1,this.trackTime.indexOf('秒')));
        // orderTimer=setInterval(()=>{
        //     second=second+1;
        //     if(second == 60){
        //         minute=minute+1;
        //         second=0;
        //         if(minute==60){
        //             hour=hour+1;
        //             minute=0;
        //             if(hour==24){
        //                 day=day+1;
        //                 hour=0;
        //             }
        //         }
        //     }
        //     let H=hour<10?'0'+hour:hour;
        //     let M=minute<10?'0'+minute:minute;
        //     let S=second<10?'0'+second:second;
        //     this.ordertrackTime=day+'天'+ H+'小时'+M+'分'+S+'秒';
        // },1000)


         orderTimer=setInterval(()=>{
            this.timeElapse(this.trackTime);
        },1000)
       
       
    }
     timeElapse(date){
        var current = Date();
        var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
        var days = Math.floor(seconds / (3600 * 24));
        seconds = seconds % (3600 * 24);
        var hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let H=hours<10?'0'+hours:hours;
        let M=minutes<10?'0'+minutes:minutes;
        let S=seconds<10?'0'+seconds:seconds;
        this.ordertrackTime=days+'天'+ H+'小时'+M+'分'+S+'秒';
    }
}