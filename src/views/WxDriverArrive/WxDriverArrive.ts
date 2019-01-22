import { VueComponent } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'
Vue.use(VueRouter);

@VueComponent({
    template: require('./WxDriverArrive.html'),
})
export class WxDriverArriveComponent extends Vue {
    el: '#WxDriverArrive';

    /**订单id */
    orderId:string="";
    /* 订单编号 */
    orderNum:string="";
    /**货物名称 */
    goodsName:string="";
    /**重量/体积 */
    goodsNum:string="";
    /**发货地 */
    deliverAddress:string="";
    /**收货地 */
    acceptAddress:string="";
    /**车牌号 */
    carCode:string="";
    /**驾驶员姓名 */
    driverName:string="";
    /* 驾驶员手机号 */
    driverPhone:string="";
    /**备注信息 */
    remarks:string="";
    /* 下单时间 */
    orderTime:string="";
    /* 司机到场时间 */
    driverArriveTime:string="";

    ready(){
        document.getElementsByTagName("body")[0].setAttribute("style", "height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.orderId = this.$route.query.carrierorderid;
        
        this.orderNum = "";
        this.goodsName = "";
        this.goodsNum = "";
        this.deliverAddress = "";
        this.acceptAddress = "";
        this.carCode = "";
        this.driverName = "";
        this.driverPhone = "";
        this.remarks = "无";
        this.orderTime = "";
        this.driverArriveTime = "";

        /* 详情接口 */
        dataService().Wxcsporders.getCspOrders(this.orderId).then((res)=>{
            this.orderNum = res.orderId;
            this.goodsName = res.goodsName;
            this.goodsNum = res.realQuantityOfGoods + res.goodsUnit;
            this.deliverAddress = res.originAddress;
            this.acceptAddress = res.destinationAddress;
            this.carCode = res.carCode;
            this.driverName = res.driver;
            this.driverPhone = res.driverPhone;
            if(res.remarks == ""){
                this.remarks = "无";
            }else{
                this.remarks = res.remarks;
            }
            this.orderTime = res.creationTime;
            this.driverArriveTime = res.presentTime;
        }).then(()=>{});
    } 
}
