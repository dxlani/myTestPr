import { VueComponent } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'

declare var $: any;
Vue.use(VueRouter);

var router = new VueRouter();

@VueComponent({
    template: require('./WxDeliveryDetail.html'),
    style: require('./WxDeliveryDetail.scss')
})
export class WxDeliveryDetailComponent extends Vue {
    el: '#WxDeliveryDetail';
    
    /**订单id */
    orderId:string="";
    /**收发货角色 */
    status:string="";
    /**发货时间 */
    startTime:string="";
    /**收货单位 */
    acceptCompany:string="";
    /**收货地址 */
    acceptAddress:string="";
    /**车牌号 */
    carCode:string="";
    /**驾驶员姓名 */
    driverName:string="";
    /**货物名称 */
    goodsName:string="";
    /**货物数量 */
    goodsNum:string="";
    /**备注信息 */
    remarks:string="";
    /**发货单位 */
    deliverCompany:string="";
    /**发货地址 */
    deliverAddress:string="";
    /**发货联系人姓名 */
    deliverUserName:string="";
    /**发货联系人电话 */
    deliverPhone:string="";
    /**是否已经确认发货 */
    isConfirm:boolean=false;
    /* 按钮内容 */
    buttonMessage:string="";
    /* 运单状态 */
    orderStatus:number;
    ready(){
        document.getElementsByTagName("body")[0].setAttribute("style", "height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.buttonMessage = "确认发货";
        this.orderId = this.$route.query.carrierorderid;
        dataService().Wxcsporders.getCspOrders(this.orderId).then((res)=>{
            this.orderStatus=res.status;
            /* 收货人 */
            this.startTime = res.deliveryTime;
            this.deliverCompany = res.consignorCompany;
            this.deliverAddress = res.originAddress;
            this.deliverUserName = res.consignorName;
            this.deliverPhone = res.consignorPhone;
            this.carCode = res.carCode;
            this.driverName = res.driver;
            this.goodsName = res.goodsName;
            this.goodsNum = res.realQuantityOfGoods + res.goodsUnit;
            this.remarks = res.remarks;
            /* 发货人 */
            this.acceptCompany = res.consigneeCompany;
            this.acceptAddress = res.destinationAddress;;

        }).then(()=>{
            if(this.$route.query.userState == "0"){
                this.status = "收货人";
                this.isConfirm = false;
            }
            else if(this.$route.query.userState == "1"){
                this.status = "发货人";
                if(this.orderStatus == 1 || this.orderStatus == 2){
                    this.isConfirm = true;
                    this.buttonMessage = "已确认发货";
                }else{
                    this.isConfirm = false;
                }
            }
        });
        
    }

    /**确认已发货 */
    confirmDeliver(){
        var obj = {
            "carrierorderid" : this.orderId
        }
        dataService().Wxcsporders.updataCspOrderStatus(obj).then((res)=>{
            if(res.success){
                $.toast("已确认");
                this.isConfirm = true;
                this.buttonMessage = "已确认发货";
            }else{
                $.toast("确认失败");
            }
        });
    }
}
