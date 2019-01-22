import { VueComponent, Prop } from 'vue-typescript'
// import { azureBlob } from '../../service/azure-blob-upload'
import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router'

var VueTables = require('vue-tables');
Vue.use(VueTables.client, {
    filterable: false,
    compileTemplates: true,
    pagination: {
        dropdown: false,
    },
    texts: {
        count: '{count} 条',
    }

});
var router = new VueRouter();
@VueComponent({
    template: require('./inquiryCheck.html'),
    style: require('./inquiryCheck.scss')
})
export class InquiryCheckComponent extends Vue {
    el: '#inquiryCheckEl'
    components: ({
        vclienttable: any,
    })

    /**
     * 是否是管理员
     */
    isAdmin:string = "";
    /**
     * web权限
     */
    webAuthorize:string = "";
    //v-model初始化
    id = ""
    quotation: boolean = false;
    inquiryChildId = "";//子询价单编号
    responseTime: string = '';//紧急程度
    creationTime = ""//下单那时间
    clientName = ""//客户单位
    customerName = ""//发货计划人
    customerPhone = ""//发货人电话
    content = ""//总询价内容
    originProvinceStr = "";
    originCityStr = "";
    originCountyStr = "";
    originDetails = "";
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
    loadingEffect = ""

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
    mileage: string = ''
    remarks = "";
    receivablePrice = "";
    receivablePriceUnitStr = "";
    receivableSummary = ""

    winBid = true;
    loseBid = true;

    //设置禁用（详情）
    status: string = "";
    titleInquiry: string = ''
    statusList = [
        { text: "全部", value: "" },
        { text: "待报价", value: "2,3,4,5,6,7" },
        { text: "待确认", value: "8,11" },
        { text: "已中标", value: "9" },
        { text: "未中标", value: "10" },
        // { text: "中标待定", value: "11" },
        { text: "询价终结", value: "12" },
    ]

    goodsTypeDropDown = [];
    goodsNameDropDown = [];

    originProvinceList = [];
    originCityList = [];
    originCountyList = [];
    destinationProvinceList = [];
    destinationCityList = [];
    destinationCountyList = [];

    imageLists = [];
    imageColumns = ['name', 'rate', 'state', 'operation'];
    imageOptions = {
        texts:{
            noResults:'暂无数据',
        },
        headings: {
            name: "名称",
            rate: "进度",
            state: "状态",
            operation: '操作'
        },
        templates: {
            operation: function (row) {

                return `<button  type="button" class="btn btn-primary btn-xs btnDownLoad" @click="$parent.download(${row.index})">
                        <span class="fa fa-cloud-download"></span> 下载
                    </button>`
            },
            state: function (row) {
                return `<span class='glyphicon glyphicon-ok text-success' id="${row.id}" title='状态显示'></span>`;
            },
            rate: function (row) {
                return `<div class="progress" style="width:60%"><div class="progress-bar progress-bar-uploadFile" id='${row.id}progressBar' role="progressbar" style="width:100%"></div></div>`;
            }
        },
    };
    /**
     * 附件下载
     */
    download = function (index) {
        var id = this.imageLists.filter(t => t.index == index)[0].id;
        window.location.href = dataService().baseUrl + "Attachment/getAttachment/" + id;

    }

    ready() {
        this.id = this.$route.query.id;
        this.status = this.$route.query.status;
        this.isAdmin=sessionStorage.getItem("isAdmin");
        this.webAuthorize=sessionStorage.getItem("webAuthorize");
        //判断订单状态
        dataService().Inquiry.getInquiry(this.id).then((res) => {
            this.status = this.statusList.filter(t => t.value.indexOf(this.status) > -1)[0].text;
            switch (this.status) {
                case '待确认': {
                    this.titleInquiry = '询价单审核详情';
                    this.quotation = true;
                    this.winBid = true;
                    this.loseBid = true;
                }; break;
                case '未中标': ;
                case '已中标': {
                    this.titleInquiry = '询价单详情';
                    this.quotation = true;
                    this.winBid = false;
                    this.loseBid = false;
                }; break;
                case '待报价': {
                    this.titleInquiry = '询价单详情';
                    this.quotation = false;
                    this.winBid = false;
                    this.loseBid = false;
                }; break;
                default: {
                    this.titleInquiry = '询价单审核详情';
                    this.quotation = true;
                    this.winBid = true;
                    this.loseBid = true;
                }
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
            this.originProvinceStr = res.originProvinceStr
            this.originCityStr = res.originCityStr
            this.originCountyStr = res.originCountyStr
            this.originDetails = res.originDetails

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
            this.mileage = res.mileage
            this.quantityOfGoods = res.quantityOfGoods
            this.goodsUnitStr = res.goodsUnitStr
            //所需车辆信息
            this.vehicleTypeStr = res.vehicleTypeStr
            this.carLengthStr = res.carLengthStr
            this.carriageWayStr = res.carriageWayStr
            this.loadingEffect = res.loadingEffect
            this.remarks = res.attachmentRemarks
            //报价信息
            this.receivablePrice = res.receivablePrice ? res.receivablePrice : "";
            this.receivablePriceUnitStr = res.receivablePriceUnitStr ? res.receivablePriceUnitStr : "";
            this.receivableSummary = res.receivableSummary ? res.receivableSummary : "";
            // 获取附件
            this.imageLists = [];
            if (res.attachmentList) {
                res.attachmentList.forEach((item, index) => {
                    item.index = index;
                    this.imageLists.push(item)
                })
            }

        }, function (rej) {})
    }
    /**
     * 终结
     */
    endInquiry(){
        bootbox.alert({
            title: "联系客服",
		    message: `如需终结询价单，请拨打客服电话：<span style="color:#36A9CE">18106108671</span>，诺得物流竭诚为您服务！`,
	    });
    }
    /**已接受 */
    winTheBid = function () {
        bootbox.confirm("是否接受报价？", (bootboxResult) => {
            if (!bootboxResult) {
                return;
            }
            dataService().Inquiry.editInquiry(this.id, "9").then((res) => {
                if(res.success){
                    bootbox.alert("接受报价成功",function(){
                        router.go('/app/inquiry/inquiryManage');
                    });
                }else{
                    if(res.errorCode == "2004"){
                        bootbox.alert("接受报价失败，此询价单状态已被修改",function(){
                            router.go('/app/inquiry/inquiryManage');
                        });
                    }else{
                        var error: string = res.errorMessage;
                        bootbox.alert(error,function(){
                            router.go('/app/inquiry/inquiryManage');
                        });
                    }
                }
            })
        })
    }
    /**已拒绝 */
    loseTheBid = function () {
        bootbox.confirm("是否拒绝报价？", (bootboxResult) => {
            if (!bootboxResult) {
                return;
            }
            dataService().Inquiry.editInquiry(this.id, "10").then((res) => {
                if(res.success){
                    bootbox.alert("拒绝报价成功",function(){
                        router.go('/app/inquiry/inquiryManage');
                    });
                }else{
                    if(res.errorCode == "2004"){
                        bootbox.alert("拒绝报价失败，此询价单状态已被修改",function(){
                            router.go('/app/inquiry/inquiryManage');
                        });
                    }else{
                        var error: string = res.errorMessage;
                        bootbox.alert(error,function(){
                            router.go('/app/inquiry/inquiryManage');
                        });
                    }
                }
                
            })
        })
    }

    /**
     * 一键下单（发货发布）
     */
    goAddOrder(){
        dataService().CspOrder.getAddOrderAuthAndSettleIsExis("").then((res)=>{
            if(res.addOrderAuth){
                router.go('/app/order/orderReleaseAdd/?id='+ this.id +'&name=copyInquiryRelease');
            }else{
                bootbox.alert("一键下单失败，请先联系对应商务人员与诺得签订有效托运合同！");
            }
        });
    }
    /**取消 */
    cancel() {
        if(this.status == "待报价"){
            router.go('/app/inquiry/inquiryReleaseManage')
        }else if(this.status == "待确认"){
            router.go('/app/inquiry/inquiryManage')
        }else{
            router.go('/app/inquiry/inquiryConfirmManage')
        }
    }

}
