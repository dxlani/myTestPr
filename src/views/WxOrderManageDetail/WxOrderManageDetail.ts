import { VueComponent, Prop, Watch } from 'vue-typescript'
import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router';
//import '../../favicon.ico';
import '../../components/WxHead/WxHeadCom'
import '../../components/WxFoot/WxFootCom'
import "../../img/orderStatus.png";
declare var $: any;

Vue.use(VueRouter);
var router = new VueRouter();
var orderTimer: any = "";
export { orderTimer }
@VueComponent({
    template: require('./WxOrderManageDetail.html'),
    style: require('./WxOrderManageDetail.scss')
})
export class WxOrderManageDetailComponent extends Vue {
    el: '#WxOrderManageDetail';
    components: ({
        vclienttable: any,
    });
    @Prop
    /**通过路由获取*/
    /**订单id */
    id = "";
    /**订单状态 */
    status = "";
    //v-model
    /**订单编号 */
    orderId = '';
    /**下单时间 */
    orderTime = '';
    /**销售编号 */
    clientOrderId = '';
    /**客户单位*/
    customerUnit = '';
    /**紧急程度*/
    urgency = '';
    /**发货计划人*/
    consignor = '';
    /**发货人电话*/
    consignorPhone = '';
    /**发货内容*/
    orderContent = '';
    /**总线路下 */
    /**发货地址 */
    shipAddress = '';
    /**送货地址 */
    deliverAddress = '';
    /**货物类别 */
    goodsTypeName = '';
    /**货物名称 */
    goodsName = '';
    /**货物数量 */
    goodsNum = '';
    /**子线路下 */
    /**发货地址 */
    // childShipAddress = '';
    // /**送货地址 */
    // childDeliverAddress = '';
    // /**货物类别 */
    // childGoodsType = '';
    // /**货物名称 */
    // childGoodsName = '';
    // /**货物数量 */
    // childGoodsNum = '';
    /**所需车型*/
    carType = '';
    /**所需车长*/
    carLength = '';
    /**承运方式*/
    carrierCategory = '';
    /**装车效果*/
    loadingEffect = '';
    /**备注 */
    remarks = '';

    /**承运商车辆信息 */
    /**车牌号 */
    carrierCarCode = '';
    /**车长 */
    carrierCarLength = '';
    /**车型 */
    carrierCarType = '';
    /**承运商车辆信息 显示，隐藏*/
    carrierShow: boolean = true;

    /**总线路详情信息 */
    totalLineData = [];
    /**中转地 */
    totalVia = '';
    /**里程数 */
    totalMileage = '';
    /**货物数量 */
    totalGoodsNum = '';
    /**货物数量2 */
    totalGoodsNumTwo = '';

        /**
     * 子线路信息 
     */
    childLineData = [];
    /**线路序号 */
    childLineIndex = "";
    /**发货地址 */
    childOriginAddress = "";
    /**送货地址 */
    childDestinationAddress = "";
    /**中转地 */
    childVia = '';
    /**发货时间 */
    childDeliveryTime = "";
    /**到货时间 */
    childArrivalTime = "";
    /**里程数 */
    childMileage = '';
    /**货物类别 */
    childGoodsTypeName = "";
    /**货物名称 */
    childGoodsName = "";
    /**吨位范围 */
    childTonnageRange = "";
    /**货物数量 */
    childGoodsNumO = '';
    /**货物数量2 */
    childGoodsNumT = '';
    /**单价 */
    receivablePrice = '';
    /**总价 */
    receivableTotalPrice = '';
    /**结算单位 */
    childSettle = "";
    /**结算方式 */
    childSettlementType = "";
    /**是否含税 */
    childIncludeTax = "";
    /**说明 */
    childReceivableSummary = "";
    /**工程名称 */
    childProjectName = "";
    /**工程编号 */
    childProjectCode = "";
    /**工程总量 */
    projectMax = '';
    /**收货单位 */
    childConsigneeCompany = "";
    /**收货人 */
    childConsignee = "";
    /**收货人号码 */
    childConsigneePhone = "";
    /**发货单号 */
    childOrderNumber = "";

    /* 订单跟踪 */
    orderFollowing = [];
    /* 收缩订单跟踪 */
    showDetailStatus = false;
    /* 显隐订单跟踪 */
    showOderDetail = false;
    /* 是否过期 */
    overdue = false;
    /* 跟踪时间 */
    trackTime = ""
    /* 跟踪结束时间 */
    endTime = ""
    /* 跟踪起始时间 */
    startTime = ""
    /* 订单日时分秒 */
    orderDay = "";
    orderHour = "";
    orderMinute = "";
    orderSecond = "";
    /* 动态跟踪时间 */
    ordertrackTime = "";

     /* 终结按钮 */
     btnGroup1:boolean = false;
     /* 确认发货|申请撤回 */
     btnGroup2:boolean = false;
     /* 确认收货|通报异常 */
     btnGroup3:boolean = false;
    /*  已确认发货*/
    isDelivery:boolean = false;
     /**
     * 确认发货按钮名
     */
    isDeliveryName:string="";
    /*  已确认收货*/
    isReceipt:boolean = false;
      /**
     * 确认收货按钮名
     */
    isReceiptName:string="";
    ready() { 
      
        this.orderFollowing = [];
        this.startTime = "";
        this.endTime = "";
        this.ordertrackTime = "";
        /**添加滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style", "height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.id = this.$route.query.id;
        this.status = this.$route.query.status;
        if(this.status=="1" || this.status=="2" || this.status=="3" || this.status=="4"){
            this.btnGroup1=true;
            this.btnGroup2=false;
            this.btnGroup3=false;
        }else if (this.status=="5"){
            this.btnGroup2=true;
            this.btnGroup1=false;
            this.btnGroup3=false;
        } else if (this.status=="6" || this.status=="7"){
            this.btnGroup3=true;
            this.btnGroup1=false;
            this.btnGroup2=false;
        }else {
            this.btnGroup3=false;
            this.btnGroup1=false;
            this.btnGroup2=false;
        }
        clearInterval(orderTimer);
        dataService().Order.getOrder(this.id).then((res) => {
            this.isDelivery= res.isDelivery;
            this.isReceipt= res.isReceipt;
            this.isDeliveryName=this.isDelivery?'已确认发货':'确认发货';
            this.isReceiptName=this.isReceipt?'已确认收货':'确认收货';
            this.orderId = res.orderId;
            this.clientOrderId = res.clientOrderId;
            this.orderTime = res.creationTime;
            this.urgency = res.responseTimeStr;
            this.customerUnit = res.clientName;
            this.consignor = res.consignorName;
            this.consignorPhone = res.consignorPhone;
            this.orderContent = res.content;
            this.totalLineData = res;
            this.shipAddress = res.originAddress;
            this.deliverAddress = res.destinationAddress;
            this.goodsTypeName = res.goodsTypeName;
            this.goodsName = res.goodsName;
            this.goodsNum = res.quantityOfGoods + res.goodsUnitStr;
            /**子线路数据 */
            this.childLineData = res.items;
            this.carType = res.vehicleTypeStr;
            this.carLength = res.carLengthStr;
            this.carrierCategory = res.carriageWayStr;
            this.loadingEffect = res.loadingEffect;
            this.remarks = res.remarks;

            //承运商车辆信息 显示，隐藏(已派车、待发货、已发货、货已送达显示;  派车中，订单终结不显示)  
            if (res.orderStatus == "1" || res.orderStatus == "4" || res.orderStatus == "8") {
                this.carrierShow = false;
            } else {
                this.carrierShow = true;
            }
            this.carrierCarCode = res.carrierCarCode
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


        }).then(() => {
            if (this.status == '3' || this.status == '4' || this.status == '5' || this.status == '6' || this.status == '7') {
                if (Date.parse(Date()) - Date.parse(this.orderTime) > 7776000000) {
                    this.overdue = true;
                    this.showOderDetail = false;
                } else {
                    dataService().Order.getOrderLogList(this.orderId).then((res) => {
                        if (res.data.length>0) {
                            this.orderFollowing = res.data.reverse();
                            this.orderFollowing.forEach(item => {
                                if (item.orderStatus == "派车中") {
                                    this.startTime = item.operatorTime;
                                }
                                if (item.orderStatus == "货已送达") {
                                    this.endTime = item.operatorTime;
                                }

                            })
                            this.timeGo();
                            this.overdue = false;
                            this.showOderDetail = true;
                        }else{
                            this.overdue = true;
                            this.showOderDetail = false;
                        }
                    })
                }
            } else {
                this.overdue = false;
                this.showOderDetail = false;
            }


        });
        this.orderDay = "";
        this.orderHour = "";
        this.orderMinute = "";
        this.orderSecond = "";
        this.ordertrackTime = "";
        this.showDetailStatus = false;

        /**子线路初始化 */
        this.childLineIndex = "1";
        this.childOriginAddress = "";
        this.childDestinationAddress = "";
        this.childVia = '';
        this.childDeliveryTime = "";
        this.childArrivalTime = "";
        this.childMileage = '';
        this.childGoodsTypeName = "";
        this.childGoodsName = "";
        this.childTonnageRange = "";
        this.childGoodsNumO = '';
        this.childGoodsNumT = '';
        this.receivablePrice = '';
        this.receivableTotalPrice = '';
        this.childSettle = "";
        this.childSettlementType = "";
        this.childIncludeTax = "";
        this.childReceivableSummary = "";
        this.childProjectName = "";
        this.childProjectCode = "";
        this.projectMax = '';
        this.childConsigneeCompany = "";
        this.childConsignee = "";
        this.childConsigneePhone = "";
        this.childOrderNumber = "";


    }

    /**总线路详情 */
    totalLineDetail = function () {
        var mileage = "";
        if (this.totalLineData.mileage == null) {
            mileage = "";
        } else {
            mileage = this.totalLineData.mileage + "公里";
        }
        this.totalMileage = mileage;
        this.totalVia = this.getViaAddress(this.totalLineData.viaAddressList);
        this.totalGoodsNum = this.totalLineData.quantityOfGoods + this.totalLineData.goodsUnitStr;
        var totalGoodsNumTwo = "";
        if (this.totalLineData.quantityOfGoodsTwo == null) {
            totalGoodsNumTwo = "";
        } else {
            totalGoodsNumTwo = this.totalLineData.quantityOfGoodsTwo + this.totalLineData.goodsUnitTwoStr;
        }
        this.totalGoodsNumTwo = totalGoodsNumTwo;
    }

    /**子线路1详情 */
    childLineDetail(childLineItem,childLineIndex) {
        this.childLineIndex = childLineIndex + 1;
        this.childOriginAddress = childLineItem.originAddress;
        this.childDestinationAddress = childLineItem.destinationAddress;
        this.childDeliveryTime = childLineItem.deliveryTime;
        this.childArrivalTime = childLineItem.arrivalTime;
        this.childGoodsTypeName = childLineItem.goodsTypeName;
        this.childGoodsName = childLineItem.goodsName;
        this.childTonnageRange = childLineItem.tonnageRange;
        this.childSettle = childLineItem.settle;
        this.childSettlementType = childLineItem.settlementTypeStr;
        this.childIncludeTax = childLineItem.includeTaxStr;
        this.childReceivableSummary = childLineItem.receivableSummary;
        this.childProjectName = childLineItem.projectName;
        this.childProjectCode = childLineItem.projectCode;
        this.childConsigneeCompany = childLineItem.consigneeCompany;
        this.childConsignee = childLineItem.consignee;
        this.childConsigneePhone = childLineItem.consigneePhone;
        this.childOrderNumber = childLineItem.orderNumber;
        this.childVia = this.getViaAddress(childLineItem.viaAddressList);
        var mileageC = "";
        if (childLineItem.mileage == null) {
            mileageC = "";
        } else {
            mileageC = childLineItem.mileage + "公里";
        }
        this.childMileage = mileageC;
        this.childGoodsNumO = childLineItem.quantityOfGoods + childLineItem.goodsUnitStr;
        var childGoodsNumT = "";
        if (childLineItem.quantityOfGoodsTwo == null) {
            childGoodsNumT = "";
        } else {
            childGoodsNumT = childLineItem.quantityOfGoodsTwo + childLineItem.goodsUnitTwoStr;
        }
        this.childGoodsNumT = childGoodsNumT;
        var receivablePrice = "";
        if (childLineItem.receivablePrice == null) {
            receivablePrice = "";
        } else {
            receivablePrice = childLineItem.receivablePrice + childLineItem.receivablePriceUnitStr;
        }
        this.receivablePrice = receivablePrice;
        var receivableTotalPrice = "";
        if (childLineItem.receivableTotalPrice == null) {
            receivableTotalPrice = "";
        } else {
            receivableTotalPrice = childLineItem.receivableTotalPrice + "元";
        }
        this.receivableTotalPrice = receivableTotalPrice;
        var projectMax = "";
        if (childLineItem.projectMax == "") {
            projectMax = "";
        } else {
            projectMax = childLineItem.projectMax + childLineItem.projectMaxUnitStr;
        }
        this.projectMax = projectMax;
    }


    //修改中转地显示方式
    getViaAddress = function (viaList) {
        var addre = "";
        for (var i = 0; i < viaList.length; i++) {
            addre = addre + (viaList[i].province + viaList[i].city + viaList[i].county)
            if (i != viaList.length - 1) {
                addre += "；";
            }
        }
        return addre;
    }


    package: string = 'vue-typescript';
    repo: string = 'https://github.com/itsFrank/vue-typescript';

    /* 显隐订单跟踪详情 */
    showDetail = function () {
        if (this.showDetailStatus == false) {
            this.showDetailStatus = true;
            $('.orderStatusDetail').children('.orderStatusPosition:gt(1)').slideDown();
        } else {
            this.showDetailStatus = false;
            $('.orderStatusDetail').children('.orderStatusPosition:gt(1)').slideUp();
        }
    }

    /* 跟踪时间流 */
    timeGo = function () {
        if (this.status == "7") {
            this.timeElapse(this.startTime.replace(/-/g, '/'), this.endTime.replace(/-/g, '/'));
        } else {
            orderTimer = setInterval(() => {
                let endT = new Date();
                this.timeElapse(this.startTime.replace(/-/g, '/'), endT);
            }, 1000)
        }

    }
    timeElapse(start, end) {
        var seconds = (Date.parse(end) - Date.parse(start)) / 1000;
        var days = Math.floor(seconds / (3600 * 24));
        seconds = seconds % (3600 * 24);
        var hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let H = hours < 10 ? '0' + hours : hours;
        let M = minutes < 10 ? '0' + minutes : minutes;
        let S = seconds < 10 ? '0' + seconds : seconds;
        this.ordertrackTime = days + '天' + H + '小时' + M + '分' + S + '秒';
    }
    beforeDestroy() {
        clearInterval(orderTimer);
    }
    /* 终结派车中订单 */
    endOrder(){
        dataService().Order.getCustomerServicePhone(this.id).then((res)=>{
            $.confirm({
                title: "联系客服",
                text: `如需终结订单，<br>请拨打客服电话：<a id="callPhone" style="color:#36a9ce" href="tel:${res.phoneNumber}">${res.phoneNumber}</a>，<br>诺得物流竭诚为您服务！`,
                onOK: function () {
                    window.location.href = 'tel:' + res.phoneNumber;
                  },
                onCancel: function () {
                }
          })
        });
    }

     /*确认发货  */
     comfirmDeliver(){
         if(!this.isDelivery){
            $.confirm("确认发货吗？",()=>{
                dataService().Order.updateIsDelivery(this.id).then((res)=>{
                    if(res.success){
                        this.isDelivery=true;
                        this.isDeliveryName="已确认发货";
                        $.alert("确认发货成功",()=> {
                                this.$router.go('/wechat/Wxorder')
                            })
                    }
                });
        })
         }
    };
    /*确认收货  */
    comfirmAccept(){
        if(!this.isReceipt){
            $.confirm('确认收货吗？',()=>{
                dataService().Order.getUpdateIsReceipt(this.id).then((res)=>{
                    if(res.success){
                        this.isReceipt=true;
                        this.isReceiptName="已确认收货";
                        $.alert("确认收货成功",()=> {
                            this.$router.go('/wechat/Wxorder')
                        })
                    }
                });
        })
        }
    };
    /* 申请撤回 */
    recall(){
        dataService().Order.getCustomerServicePhone(this.id).then((res)=>{
          $.confirm({
            title: "联系客服",
            text: `如需申请撤回，<br>请拨打客服电话：<a style="color:#36a9ce" href="tel:${res.phoneNumber}">${res.phoneNumber}</a>，<br>诺得物流竭诚为您服务！`,
            onOK: function () {
                window.location.href = 'tel:' + res.phoneNumber;
              },
            onCancel: function () {
            }
            })
        });
    };
    /* 通报异常 */
    unusual(){
        dataService().Order.getCustomerServicePhone(this.id).then((res)=>{
            $.confirm({
                title: "联系客服",
                text: `如需通报异常，<br>请拨打客服电话：<a style="color:#36a9ce" href="tel:${res.phoneNumber}">${res.phoneNumber}</a>，<br>诺得物流竭诚为您服务！`,
                onOK: function () {
                     window.location.href = 'tel:' + res.phoneNumber;
                  },
                onCancel: function () {
                }
          })
        });
    };
    /* 复制订单 */
    copyOrder(){
        router.go('/WxOrder/WxOrderAdd/?id=' +this.$route.query.id + '&name=copyOrder')
    }
}