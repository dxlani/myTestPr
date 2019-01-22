import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router';
import '../../favicon.ico';
declare var $: any;

Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxInquiryReleaseDetail.html'),
    style: require('./WxInquiryReleaseDetail.scss')
})
export class WxInquiryReleaseDetailComponent extends Vue {
    el: '#wxInquiryReleaseDetail';
    components: ({
        vclienttable: any,
    })
    //v-model初始化
    /** 子询价单编号*/
    inquiryChildCode: string = ''
    /** 询价时间 */
    inquiryTime: string = ''
    /** 紧急程度 */
    urgency: string = '';
    urgencyUnit: string = '';
    consignor: string = '';
    consignorPhone: string = '';
    content: string = '';
    /** 发货地址集合 */
    allStartArea: string = '';
    starProvince: string = '';
    starCity: string = '';
    starAreaCity: string = '';
    startAddress: string = '';
    /** 发货目的地集合 */
    allEndArea: string = '';
    endProvince: string = '';
    endCity: string = '';
    endArea: string = '';
    endAddress: string = '';
    plannedArrivalTime: string = "";
    plannedDeliveryTime: string = ''
    goodsTypeId: string = "";
    /**货物类别名称 */
    goodsTypeName: string = "";
    goodsId: string = '';
    /**货物名称 */
    goodsName: string = '';
    goodsQuantity: string = ''
    goodsQuantityUnit: string = ''
    carType: string = ''
    carLengthStr: string = ''
    carrierCategory: string = ''
    loadingEffect: string = ''
    attachmentDetails: string = ''

    @Prop
    /**是否显示删除、终结按钮 */
    showEnable: boolean = false;
    /**	Csp询价单总单ID */
    inquiryChildIdLinkTo: string = '';
    /** 发货地址省 */
    starProvinceList = [];
    /** 发货地址市 */
    starCityList = [];
    /** 发货地址区 */
    starAreaList = [];
    /** 送货地址省 */
    endProvinceList = [];
    /** 送货地址市 */
    endCityList = [];
    /** 送货地址区 */
    endAreaList = [];
    /** 货物数量单位 */
    goodsQuantityUnitDropDown = [{ "text": "吨", "value": "1" }, { "text": "立方", "value": "2" }, { "text": "车", "value": "3" }, { "text": "件", "value": "4" }, { "text": "托", "value": "5" }, { "text": "台", "value": "6" }, { "text": "其他", "value": "7" }]
    /** 所需车型下拉 */
    // carTypeDropDown = [{ "text": "厢车", "value": "1" }, { "text": "飞翼", "value": "2" }, { "text": "半挂", "value": "3" }, { "text": "标厢", "value": "4" }, { "text": "大平板", "value": "5" }, { "text": "平板", "value": "6" }, { "text": "高低板", "value": "7" }, { "text": "高栏平板", "value": "8" }, { "text": "高栏高低板", "value": "9" }, { "text": "大件车抽拉板", "value": "10" }, { "text": "大件车超低板", "value": "11" }, { "text": "自卸车", "value": "12" }, { "text": "单车", "value": "13" }, { "text": "其他", "value": "14" }]
    /** 所需车长下拉 */
    carLengthDropDown = [{ "text": "4.2米", "value": "1" }, { "text": "5.8米", "value": "2" }, { "text": "6米", "value": "3" }, { "text": "6.2米", "value": "4" }, { "text": "6.5米", "value": "5" }, { "text": "6.8米", "value": "6" }, { "text": "7.6米", "value": "7" }, { "text": "8.6米", "value": "8" }, { "text": "8.7米", "value": "9" }, { "text": "9.6米", "value": "10" }, { "text": "13米", "value": "11" }, { "text": "13.5米", "value": "12" }, { "text": "16米", "value": "13" }, { "text": "17.5米", "value": "14" }, { "text": "其他", "value": "15" }]
    /** 承运方式下拉 */
    carrierCategoryDropDown = [{ "text": "整车", "value": "1" }, { "text": "零担", "value": "2" }, { "text": "整车/零担", "value": "3" }]
    /** 紧急程度单位下拉 */
    urgencyUnitDropDown = [{ text: "天", value: "1" }, { text: "小时", value: "2" }, { text: "分钟", value: "3" }];
    /** 货物分类下拉 */
    goodsTypeDropDown = [];
    /** 货物名称下拉 */
    goodsNameDropDown = [];
    /** 发货计划人下拉 */
    consignorDropDown = [];
    /** 询价单id */
    inquiryId: string;
    /**询价状态供判断 */
    name: string;
    /** */
    customerUnit: string = '';
    /** */
    enterpriseid: string;
    /** */
    customerId: string = '';
    mileage: string = '';

    ready() {
        /**添加滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style","height:100%;overflow-y:scroll;-webkit-overflow-scrolling:touch;");

        //初始设置
        this.inquiryChildCode = '';
        this.inquiryTime = '';
        this.urgency = '';
        this.urgencyUnit = '';
        /**紧急程度下拉 */
        this.urgencyUnitDropDown;
        this.consignor = '';
        this.consignorPhone = '';
        this.content = '';
        /**发货地址集合 */
        this.allStartArea = '';
        this.starProvince = '';
        this.starCity = '';
        this.starAreaCity = '';
        this.startAddress = '';
        /**发货目的地集合 */
        this.allEndArea = '';
        this.endProvince = '';
        this.endCity = '';
        this.endArea = '';
        this.endAddress = '';
        this.plannedArrivalTime = '';
        this.plannedDeliveryTime = '';
        this.goodsTypeId = '';
        /**货物类别名称 */
        this.goodsTypeName = '';
        this.goodsId = '';
        /**货物名称 */
        this.goodsName = '';
        this.goodsQuantity = '';
        this.goodsQuantityUnit = '';
        this.carType = '';
        this.carLengthStr = '';
        this.carrierCategory = '';
        this.loadingEffect = ''
        this.attachmentDetails = '';
        //客户单位初始化
        this.customerUnit = JSON.parse(window.sessionStorage.getItem("userInfo")).realName;
        this.enterpriseid = '';
        this.mileage = '';

        /**是否显示编辑,删除,终结按钮 */
        this.showEnable = false;
        this.name = this.$route.query.status;
        if (this.name == "未处理") {
            this.showEnable = true;
        }
        if (this.name == "询价终结") {
            this.showEnable = false;
        }

        /** 询价单id */
        this.inquiryId = this.$route.query.id;
        //获取货物类别列表
        dataService().GoodsType.getDoodsTypeList(this.inquiryId, 0, -1).then((res) => {
            this.goodsTypeDropDown = res.data;
        })
        //获取省列表
        dataService().Area.getProvince().then((res) => {
            this.starProvinceList = res.list;
            this.endProvinceList = res.list;
        })

        // 获取发布询价详情
        if (this.inquiryId !== "undefined" && this.inquiryId) {
            dataService().CspInquiry.getCspInquiry(this.inquiryId).then((res) => {
               // console.log(res);
                //子询价编号
                this.inquiryChildCode = res.cspInquiryChildCode;
                /**	Csp询价单总单ID */
                this.inquiryChildIdLinkTo = res.inquiryChildId;
                //询价发布时间
                this.inquiryTime = res.cspInquiryTime
                //客户单位
                this.customerUnit = res.clientName
                /**发货计划人 */
                this.consignor = res.customerName
                //发货人电话
                this.consignorPhone = res.customerPhone
                //总询价内容
                this.content = res.content
                /**发货目的地集合 */
                this.allEndArea = res.destinationProvinceStr + res.destinationCityStr + res.destinationCountyStr + res.destinationDetails;
                /**发货目的地 */
                this.endProvince = res.destinationProvince
                // this.getEndProvinceList();
                this.endCity = res.destinationCity
                // this.getEndCityList();
                this.endArea = res.destinationCounty
                this.endAddress = res.destinationDetails
                /**发货地址集合 */
                this.allStartArea = res.originProvinceStr + res.originCityStr + res.originCountyStr + res.originDetails;
                /**发货起始地 */
                this.starProvince = res.originProvince
                // this.getStarProvinceList();
                this.starCity = res.originCity;
                // this.getCityList();
                this.starAreaCity = res.originCounty
                this.startAddress = res.originDetails
                //（到货时间）
                this.plannedDeliveryTime = res.foreDeliveryTime;//到货
                //（发货时间）
                this.plannedArrivalTime = res.foreArrivalTime;//发货
                /**货物类别id */
                this.goodsTypeId = res.goodsTypeId;
                /**货物类别下拉 */
                this.goodsTypeDropDown.forEach(Agoods => {
                    if (Agoods.id == res.goodsTypeId) {
                        this.goodsTypeName = Agoods.name;
                    }
                });
                // this.goodsTypeSelect();
                //货物name
                this.goodsId = res.goodsId;
                this.goodsName = res.goodsName;
                //货物数量
                this.goodsQuantity = res.quantityOfGoods + res.goodsUnitStr;
                //货物数量单位
                this.goodsQuantityUnit = res.goodsUnit
                //车型
                this.carType = res.vehicleTypeStr
                //车长
                this.carLengthStr = res.carLengthStr
                //承运发式
                this.carrierCategory = res.carriageWayStr
                //装车效果
                this.loadingEffect = res.loadingEffect
                //附件备注
                this.attachmentDetails = res.attachmentRemarks
                this.mileage = res.mileage

                //紧急程度单位
                this.urgencyUnit = res.responseTimeUnit;
                /**紧急程度下拉 */
                this.urgencyUnitDropDown.forEach(e => {
                    if (e.value == res.responseTimeUnit) {
                        /**紧急程度集合 */
                        this.urgency = res.responseTime + e.text;
                    }
                });

            }, (rej) => {})
        }

    }
    /**
     * 编辑询价单
     */
    editInquiry(){
        router.go('/WxInquiry/WxInquiryAdd?id='+ this.inquiryId + '&name=edit');
    }

    /**删除询价单 */
    delInquiry() {
        $.confirm("确认删除该询价单吗？", () => {
            dataService().CspInquiry.deleteCspInquiry(this.inquiryId).then((res) => {
                if(res.success){
                    $.alert("删除成功！", function () {
                        router.go("/wechat/WxInquiryReleaseManage");
                    });
                }else{
                    $.alert("删除失败！", function () {});  
                } 
            }, (rej) => {});
        }, function(){});
    }

    /**终结询价单 */
    overInquiry() {
        $.confirm("确认终结该询价单吗？", () => {
            dataService().CspInquiry.editCspInquiry(this.inquiryId).then((res) => {
                if(res.success){
                    $.alert("终结成功！", function () {
                        router.go("/wechat/WxInquiryReleaseManage");
                    });
                }else{
                    $.alert("终结失败！", function () {
                    });
                }
            }, (rej) => {});
        }, function () {});
    }
    /**
     * 复制询价单
     */
    copyInquiry(){
        router.go('/WxInquiry/WxInquiryAdd?id='+ this.inquiryId + '&name=copyInquiryRelease');
    }

    /**
     * 前往该询价单
     */
    linkToInquiryDetail() {
        router.go('/WxInquiry/WxInquiryDetail?id=' + this.inquiryChildIdLinkTo);
    }

    

    package: string = 'vue-typescript';
    repo: string = 'https://github.com/itsFrank/vue-typescript';
}