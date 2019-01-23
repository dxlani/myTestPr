import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router';
//import '../../favicon.ico';
declare var $: any;

Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxInquiryDetail.html'),
    style: require('./WxInquiryDetail.scss')
})
export class WxInquiryDetailComponent extends Vue {
    el: '#wxInquiryDetail';
    components: ({
        vclienttable: any,
    })
    /**
     * 是否是管理员
     */
    isAdmin:string = "";
    /**
     * wechat权限
     */
    weChatAuthorize:string = "";
    //v-model初始化
    /**询价单id */
    id = ""
    /**是否显示报价信息 */
    quotation: boolean = false;
    inquiryChildId = "";//子询价单编号
    responseTime: string = '';//紧急程度
    creationTime = ""//下单那时间
    clientName = ""//客户单位
    customerName = ""//发货计划人
    customerPhone = ""//发货人电话
    content = ""//总询价内容
    /**发货地址集合 */
    allStartArea = "";
    originProvinceStr = "";
    originCityStr = "";
    originCountyStr = "";
    originDetails = "";
    /**送货地址集合 */
    allEndArea = "";
    destinationProvinceStr = "";
    destinationCityStr = "";
    destinationCountyStr = "";
    destinationDetails = "";
    foreArrivalTime = "";
    foreDeliveryTime = "";

    goodsName = "";
    goodsTypeName = "";
    goodsTypeId = "";
    goodsId = "";

    quantityOfGoods = "";
    goodsUnit = "";
    goodsUnitStr = "";
    //车辆信息
    vehicleTypeStr = "";
    carLengthStr = "";
    carriageWayStr = "";
    loadingEffect = ""//装车效果

    consignor: string = '';
    consignorPhone: string = '';
    starProvince: string = '';
    starCity: string = '';
    starAreaCity: string = '';
    startAddress: string = '';
    endProvince: string = '';
    endCity: string = '';
    endArea: string = '';
    endAddress: string = '';
    plannedArrivalTime: string = "";
    plannedDeliveryTime: string = ''
    goodsQuantity: string = ''
    goodsQuantityUnit: string = ''
    carType: string = ''
    carrierCategory: string = ''
    attachmentDetails: string = ''
    quotationAmount: string = ''
    quotationAmountUnit: string = ''
    quotationDescription: string = ''
    remarks = "";
    /**报价信息集合 */
    receivablePriceAll = "";
    receivablePrice = "";
    receivablePriceUnitStr = "";
    receivableSummary = ""

    winBid:boolean = false;
    loseBid:boolean = false;
    uk:boolean = false;
    addOrder:boolean = false;

    //设置禁用（详情）
    status: string = "";
    titleInquiry: string = '';
    statusList = [
        { text: "待报价", value: "2,3,4,5,6,7" },
        { text: "待确认", value: "8,11" },
        { text: "已中标", value: "9" },
        { text: "未中标", value: "10" },
    ]

    ready() {
        /**添加滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style","height:100%;overflow-y:scroll;-webkit-overflow-scrolling:touch;");
        this.isAdmin=sessionStorage.getItem("isAdmin");
        this.weChatAuthorize=sessionStorage.getItem("weChatAuthorize");
        /**询价单id */
        this.id = this.$route.query.id;
        this.quotation = false;
        this.winBid = false;
        this.loseBid = false;
        this.uk = false;
        //判断订单状态
        dataService().Inquiry.getInquiry(this.id).then((res) => {
            this.status = res.states;
            this.status = this.statusList.filter(t => t.value.indexOf(this.status) > -1)[0].text;
            switch (this.status) {
                case '待确认': {
                    this.quotation = true;
                    this.winBid = true;
                    this.loseBid = true;
                    this.uk = false;
                    this.addOrder = false;
                }; break;
                case '已中标': {
                    this.quotation = true;
                    this.winBid = false;
                    this.loseBid = false;
                    this.uk = false;
                    this.addOrder = true;
                }; break;
                case '未中标': {
                    this.quotation = true;
                    this.winBid = false;
                    this.loseBid = false;
                    this.uk = false;
                    this.addOrder = false;
                }; break;
                case '待报价': {
                    this.quotation = false;
                    this.winBid = false;
                    this.loseBid = false;
                    this.uk = true;
                    this.addOrder = false;
                }; break;
            }
            //总询价内容
            this.inquiryChildId = res.inquiryChildId;
            this.responseTime = res.responseTimeStr;
            this.creationTime = res.creationTime;
            this.clientName = res.clientName;
            this.customerName = res.customerName
            this.customerPhone = res.customerPhone

            this.content = res.content

            //线路信息
            /**发货地址集合 */
            this.allStartArea = res.originProvinceStr + res.originCityStr + res.originCountyStr + res.originDetails;
            this.originProvinceStr = res.originProvinceStr
            this.originCityStr = res.originCityStr
            this.originCountyStr = res.originCountyStr
            this.originDetails = res.originDetails
            /**送货地址集合 */
            this.allEndArea = res.destinationProvinceStr + res.destinationCityStr + res.destinationCountyStr + res.destinationDetails;
            this.destinationProvinceStr = res.destinationProvinceStr
            this.destinationCityStr = res.destinationCityStr
            this.destinationCountyStr = res.destinationCountyStr
            this.destinationDetails = res.destinationDetails

            this.foreArrivalTime = res.foreArrivalTime
            this.foreDeliveryTime = res.foreDeliveryTime

            this.goodsName = res.goodsName
            this.goodsTypeName = res.goodsTypeName
            this.goodsTypeId = res.goodsTypeId
            this.goodsId = res.goodsId
            /**货物数量集合 */
            this.goodsQuantity = res.quantityOfGoods + res.goodsUnitStr;
            this.quantityOfGoods = res.quantityOfGoods
            this.goodsUnitStr = res.goodsUnitStr
            //所需车辆信息
            this.vehicleTypeStr = res.vehicleTypeStr
            this.carLengthStr = res.carLengthStr
            this.carriageWayStr = res.carriageWayStr
            this.loadingEffect = res.loadingEffect
            this.remarks = res.attachmentRemarks
            /**报价信息集合 */
            this.receivablePriceAll = res.receivablePrice + res.receivablePriceUnitStr;
            this.receivablePrice = res.receivablePrice ? res.receivablePrice : "";
            this.receivablePriceUnitStr = res.receivablePriceUnitStr ? res.receivablePriceUnitStr : "";
            this.receivableSummary = res.receivableSummary ? res.receivableSummary : "";

        }, function (rej) {})


    }//ready end

    /**已接受 */
    winTheBid = function () {
        this.inquiryId;
        $.confirm("是否接受报价？", () => {
            dataService().Inquiry.editInquiry(this.id, "9").then((res) => {
                console.log(res)
                if(res.success){
                    $.alert("接受报价成功",function(){
                        router.go("/wechat/WxInquiryReleaseManage");
                    });
                }else{
                    if(res.errorCode == "2004"){
                        $.alert("接受报价失败，此询价单状态已被修改",function(){
                            router.go("/wechat/WxInquiryReleaseManage");
                        });
                    }else{
                        var error: string = res.errorMessage;
                        $.alert(error,function(){
                            router.go("/wechat/WxInquiryReleaseManage");
                        });
                    }
                }
            }, (rej) => {});
        }, function () {});
    }

    /**已拒绝 */
    loseTheBid = function () {
        $.confirm("是否拒绝报价？", () => {
            dataService().Inquiry.editInquiry(this.id, "10").then((res) => {
                if(res.success){
                    $.alert("拒绝报价成功", function () {
                        router.go("/wechat/WxInquiryReleaseManage");
                    });
                }else{
                    if(res.errorCode == "2004"){
                        $.alert("拒绝报价失败，此询价单状态已被修改",function(){
                            router.go("/wechat/WxInquiryReleaseManage");
                        });
                    }else{
                        var error: string = res.errorMessage;
                        $.alert(error,function(){
                            router.go("/wechat/WxInquiryReleaseManage");
                        });
                    }
                }
                
            }, (rej) => {});
        }, function () {});
    }

    /**终结 */
    unKnow = function () {
        $.confirm({
            title: '联系客服',
            text: `如需终结询价单，<br>请拨打客服电话：<a id="callPhone" style="color:#36a9ce" href="tel:18106108671">18106108671</a>，<br>诺得物流竭诚为您服务！`,
            onOK: function () {
                window.location.href = 'tel:18106108671';
                },
            onCancel: function () {
            }
        });
    }
    /**
     * 一键下单
     */
    copyOrder(){
        router.go('/WxOrder/WxOrderAdd/?id=' + this.id + '&name=copyInquiry')
    }

    /**
     * 复制询价单
     */
    copyInquiry(){
        router.go('/WxInquiry/WxInquiryAdd?id='+ this.id + '&name=copyInquiry');
    }
}