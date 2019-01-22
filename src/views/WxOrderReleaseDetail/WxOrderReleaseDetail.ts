import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import * as VueRouter from 'vue-router';
import '../../favicon.ico';
import '../../components/WxHead/WxHeadCom'
import '../../components/WxFoot/WxFootCom'
declare var $:any;

Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxOrderReleaseDetail.html'),
    style: require('./WxOrderReleaseDetail.scss')
})
export class WxOrderReleaseDetailComponent extends Vue{
    el:'#WxOrderReleaseManageDetail';
    components:({
        vclienttable:any,
    });


    @Prop
    /**路由获取 */
    /**订单id */
    id='';
    /**订单状态 */
    status='';

    /**订单详情 */
    orderData = [];
    /**紧急程度 */
    urgency = '';
    /**总线路货物数量 */
    goodsNum = '';
    /**子线路货物数量 */
    // childGoodsNum = '';

    /**
     * 总线路信息
     */
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

    /**紧急程度下拉 */
    urgencyUnitDropDown=[{text:"天",value:"1"},{text:"时",value:"2"},{text:"分",value:"3"}];

    /**是否显示删除订单按钮，终结订单按钮 */
    isShowr = false;
    isShowCopy = false;

    ready(){
        /**添加滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style", "height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.id = this.$route.query.id;
        this.status = this.$route.query.status;
        if(this.status == "未处理"){
            this.isShowCopy = false;
            this.isShowr = true;
            $('#WxOrderReleaseTextArea').css({"margin-bottom":"50px"});
        }else if(this.status == "1" || this.status == "2" || this.status == "3" || this.status == "4" ){
            this.isShowCopy = false;
            this.isShowr = false;
            $('#WxOrderReleaseTextArea').css({"margin-bottom":"50px"});
        }else if(this.status == "订单终结"){
            this.isShowCopy = true;
            this.isShowr = false;
        }

        dataService().CspOrder.getCspOrder(this.id).then((res)=>{
            // console.log(res);
            this.orderData = res;
            this.urgency = res.responseTime + this.urgencyUnitDropDown.filter(t=>t.value==res.responseTimeUnit)[0].text + "内回复"; 
            this.goodsNum = res.quantityOfGoods + res.goodsUnitStr;
            // this.childGoodsNum = res.items[0].quantityOfGoods + res.items[0].goodsUnitStr;
            this.totalLineData = res;
            this.childLineData = res.items;
            console.log(this.childLineData);
        });
        /**总线路初始化 */
        this.totalMileage = "";
        this.totalVia = "";
        this.totalGoodsNum = "";
        this.totalGoodsNumTwo = "";
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
    totalLineDetail = function(){
        var mileage = "";
        if(this.totalLineData.mileage == null){
            mileage = "";
        }else{
            mileage = this.totalLineData.mileage  + "公里";
        }
        this.totalMileage = mileage;
        this.totalVia = this.getViaAddress(this.totalLineData.viaAddressList);
        this.totalGoodsNum = this.totalLineData.quantityOfGoods + this.totalLineData.goodsUnitStr;
        var totalGoodsNumTwo = "";
        if(this.totalLineData.quantityOfGoodsTwo == null){
            totalGoodsNumTwo = "";
        }else{
            totalGoodsNumTwo = this.totalLineData.quantityOfGoodsTwo  + this.totalLineData.goodsUnitTwoStr;
        }
        this.totalGoodsNumTwo = totalGoodsNumTwo;
    }

    /**子线路1详情 隐藏 */
    childLineDetail = function(childLineItem,lineIndex){
        this.childLineIndex = lineIndex + 1;
        this.childOriginAddress = childLineItem.originAddress;
        this.childDestinationAddress = childLineItem.destinationAddress;
        this.childDeliveryTime =  childLineItem.deliveryTime;
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
        if(childLineItem.mileage == null){
            mileageC = "";
        }else{
            mileageC = childLineItem.mileage + "公里";
        }
        this.childMileage = mileageC;
        this.childGoodsNumO = childLineItem.quantityOfGoods + childLineItem.goodsUnitStr;
        var childGoodsNumT = "";
        if(childLineItem.quantityOfGoodsTwo == null){
            childGoodsNumT = "";
        }else{
            childGoodsNumT = childLineItem.quantityOfGoodsTwo + childLineItem.goodsUnitTwoStr;
        }
        this.childGoodsNumT = childGoodsNumT;
        var receivablePrice = "";
        if(childLineItem.receivablePrice == null){
            receivablePrice = "";
        }else{
            receivablePrice = childLineItem.receivablePrice + childLineItem.receivablePriceUnitStr;
        }
        this.receivablePrice = receivablePrice;
        var receivableTotalPrice = "";
        if(childLineItem.receivableTotalPrice == null){
            receivableTotalPrice = "";
        }else{
            receivableTotalPrice = childLineItem.receivableTotalPrice + "元";
        }
        this.receivableTotalPrice = receivableTotalPrice;
        var projectMax ="";
        if(childLineItem.projectMax == ""){
            projectMax ="";
        }else{
            projectMax = childLineItem.projectMax + childLineItem.projectMaxUnitStr;
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

    /**删除订单 */
    deleteOrder = function(){
        $.confirm("确认删除该订单吗？",()=>{
            dataService().CspOrder.deleteCspOrder(this.id).then((res)=>{
                if(res.success){
                    $.alert("删除成功！", function () {
                        router.go("/wechat/Wxorder");
                    });
                }else {
                    $.alert("删除失败！", function () {});
                }
            },()=>{
                return;
            });
        })
    }

    /**终结订单 */
    endOrder = function(){
        $.confirm("确认终结该订单吗？",()=>{
            dataService().CspOrder.editCspOrder(this.id).then((res)=>{
                if(res.success){
                    $.alert("终结成功！", function () {
                        router.go("/wechat/Wxorder");
                    });
                }else {
                    $.alert("终结失败！", function () {});
                }
            },()=>{
                return;
            });
        })
    }

    /**编辑订单 */
    editOrder = function(){
        // router.go("/WxOrder/WxOrderManageDetail?id="+this.orderData.orderId+"&status="+ this.status)//+ this.cspOrderStatus
        router.go('/WxOrder/WxOrderAdd/?id=' +this.$route.query.id + '&name=edit')
    }
    /**
     * 复制订单信息
     */
    copyOrder = function(){
        router.go('/WxOrder/WxOrderAdd/?id=' +this.$route.query.id + '&name=copy')
    }

   
}