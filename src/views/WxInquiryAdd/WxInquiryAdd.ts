import { VueComponent, Prop, Watch } from 'vue-typescript'

import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router';
//import '../../favicon.ico';
declare var $: any;

Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxInquiryAdd.html'),
    style: require('./WxInquiryAdd.scss')
})
export class WxInquiryAddComponent extends Vue {
    el: '#wxInquiryAdd';
    components: ({
        vclienttable: any,
    })

    //v-model初始化
    cspInquiryId:string='';
    /**紧急程度 */
    urgency: string = '';
    /**紧急程度单位 */
    urgencyUnit: string = '';
    /**发货计划人姓名 */
    consignor: string = '';
    /**发货计划人电话 */
    consignorPhone: string = '';
    /**总询价内容 */
    content: string = '';
    /**发货地址省 */
    starProvince: string = '';
    starCity: string = '';
    starAreaCity: string = '';
    startAddress: string = '';
    /**送货地址省 */
    endProvince: string = '';
    endCity: string = '';
    endArea: string = '';
    endAddress: string = '';
    /**预计发货时间 */
    plannedArrivalTime: string = "";
    /**预计到货时间 */
    plannedDeliveryTime: string = '';
    /**货物类别id */
    goodsTypeId: string = "";
    /**搜索货物名称 */
    goodsName: string = '';
    /**货物id */
    goodsId: string = '';
    /**货物数量 */
    goodsQuantity: string = ''
    /**货物数量单位 */
    goodsQuantityUnit: string = ''
    /**车型 */
    carType: string = ''
    /**车长 */
    carLength: string = ''
    /**承运方式 */
    carrierCategory: string = ''
    /**装车效果 */
    loadingEffect: string = ''
    /**附件备注 */
    attachmentDetails: string = ''
    /**公里数 */
    mileage: string = ''
    startPoint: string="";/* 起始地址 */
    endPoint: string="";/* 终点地址 */
    pointA={};/* 起始坐标 */
    pointB={};/* 终点坐标 */

    @Prop
    tableData = []
    inquiryChildList = [];
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
    carTypeDropDown = [{ "text": "厢车", "value": "1" }, 
                    { "text": "飞翼", "value": "2" }, 
                    { "text": "半挂", "value": "3" }, 
                    { "text": "标厢", "value": "4" }, 
                    { "text": "大平板", "value": "5" }, 
                    { "text": "平板", "value": "6" }, 
                    { "text": "高低板", "value": "7" }, 
                    { "text": "高栏平板", "value": "8" }, 
                    { "text": "高栏高低板", "value": "9" }, 
                    { "text": "大件车抽拉板", "value": "10" }, 
                    { "text": "大件车超低板", "value": "11" }, 
                    { "text": "自卸车", "value": "12" }, 
                    { "text": "单车", "value": "13" },
                    {"text": "拖车（集装箱）","value":"15"},
                    { "text": "其他", "value": "14" }]
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
    /** */
    customerUnit: string = '';
    /** */
    enterpriseid: string;
    //提交的图片数据
    submitImageLists = [];
    /**用于存放转换后的货物名称列表 */
    goodsList = [];
     /** 询价单id(路由获取) */
     inquiryId: string;
     /**新增类型（路由获取） */
     name: string;
     /**
      * 是否为编辑询价单
      */
    isEdit:boolean = false;
    /**
     * 编辑时间
     */
    lastModificationTime:string = "";
    ready() {
        /**添加滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style", "height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.inquiryId = this.$route.query.id;
        this.name = this.$route.query.name;
        this.getConsignorList();
        this.getGoodsTypeList();
        if(this.name == "add"){
            this.isEdit = false;
            this.urgency = '';
            this.urgencyUnit = '';
            this.consignor = '';
            this.consignorPhone = '';
            this.content = '';
            this.starProvince = '';
            this.starCity = '';
            this.starAreaCity = '';
            this.startAddress = '';
            this.endProvince = '';
            this.endCity = '';
            this.endArea = '';
            this.endAddress = '';
            this.plannedArrivalTime = '';
            this.plannedDeliveryTime = '';
            this.goodsTypeId = '';
            this.goodsName = '';
            this.goodsId = '';
            this.goodsQuantity = '';
            this.goodsQuantityUnit = '';
            this.carType = '';
            this.carLength = '';
            this.carrierCategory = '';
            this.loadingEffect = ''
            this.attachmentDetails = '';
            this.mileage = '';
            this.startPoint="";/* 起始地址 */
            this.endPoint="";/* 终点地址 */
            this.pointA={};/* 起始坐标 */
            this.pointB={};/* 终点坐标 */
            //发布提交 子询价列表 初始设置 空
            this.inquiryChildList = [];
            //发布提交 附件列表 初始设置 空
            this.submitImageLists.splice(0, this.submitImageLists.length);
            //子询价列表 初始显示 空
            this.tableData = [];
            /** 发货地址市初始化为空 */
            this.starCityList = [];
            /** 发货地址区初始化为空 */
            this.starAreaList = [];
            /** 送货地址市初始化为空 */
            this.endCityList = [];
            /** 送货地址区初始化为空 */
            this.endAreaList = [];
            this.setShipAndArriveTime();
            $("#wxInquiryAdd_plannedArrivalTime").datetimePicker({
                title: '预计发货时间',
                value: this.plannedArrivalTime,
            });
            $("#wxInquiryAdd_plannedDeliveryTime").datetimePicker({
                title: '预计到货时间',
                value: this.plannedDeliveryTime,
            });
        }else if(this.name=='copyInquiryRelease' ||this.name == "edit"){
            if(this.name=='copyInquiryRelease'){
                this.isEdit = false;
            }else{
                this.isEdit = true;
            }
            dataService().CspInquiry.getCspInquiry(this.inquiryId).then((res)=>{
                /**询价单编辑时间 */
                this.lastModificationTime = res.lastModificationTime;
                this.cspInquiryId = res.cspInquiryId
                //紧急程度
                this.urgency=res.responseTime;
                //紧急程度单位
                this.urgencyUnit=res.responseTimeUnit;
                //客户单位
                this.customerUnit=res.clientName;
                //发货计划人
                this.consignor=res.customerName;
                //发货人电话
                this.consignorPhone=res.customerPhone;
                //总询价内容
                this.content=res.content;
                //发货目的地
                this.getAllAreaEnd(res.destinationProvince,res.destinationCity,true);
                this.endProvince=res.destinationProvince;
                this.endCity=res.destinationCity;
                this.endArea=res.destinationCounty;
                this.endAddress=res.destinationDetails;
                //发货起始地
                this.getAllAreaStart(res.originProvince,res.originCity,true);
                this.starProvince=res.originProvince;
                this.starCity=res.originCity;
                this.starAreaCity=res.originCounty;
                this.startAddress=res.originDetails;
                
                //（到货时间）
                this.plannedDeliveryTime= res.foreDeliveryTime;//到货
                //（发货时间）
                this.plannedArrivalTime= res.foreArrivalTime;//发货
                //货物类别
                this.goodsTypeId=res.goodsTypeId;
                //货物名称id
                this.goodsId=res.goodsId;
                this.goodsName = res.goodsName;
                //货物数量
                this.goodsQuantity=res.quantityOfGoods
                //货物数量单位
                this.goodsQuantityUnit=res.goodsUnit
                //车型
                this.carType=res.vehicleType
                //车长
                this.carLength=res.carLength
                //承运发式
                this.carrierCategory=res.carriageWay
                //装车效果
                this.loadingEffect=res.loadingEffect
                //附件备注
                this.attachmentDetails=res.attachmentRemarks
                this.mileage=res.mileage;
                if(this.name == 'copyInquiryRelease'){
                    this.setShipAndArriveTime();
                    $("#wxInquiryAdd_plannedArrivalTime").datetimePicker({
                        title: '预计发货时间',
                        value: this.plannedArrivalTime,
                    });
                    $("#wxInquiryAdd_plannedDeliveryTime").datetimePicker({
                        title: '预计到货时间',
                        value: this.plannedDeliveryTime,
                    });
                }else{
                    $("#wxInquiryAdd_plannedArrivalTime").datetimePicker({
                        title: '预计发货时间',
                        value: this.plannedArrivalTime,
                    });
                    $("#wxInquiryAdd_plannedDeliveryTime").datetimePicker({
                        title: '预计到货时间',
                        value: this.plannedDeliveryTime,
                    });
                }
            },(rej)=>{})
        }else if(this.name == 'copyInquiry'){
            this.isEdit = false;
            dataService().Inquiry.getInquiry(this.inquiryId).then((res)=>{
                //紧急程度
                this.urgency=res.responseTime;
                //紧急程度单位
                this.urgencyUnit=res.responseTimeUnit;
                //客户单位
                this.customerUnit=res.clientName;
                //发货计划人
                this.consignor=res.customerName;
                //发货人电话
                this.consignorPhone=res.customerPhone;
                //总询价内容
                this.content=res.content;
                //发货目的地
                this.getAllAreaEnd(res.destinationProvince,res.destinationCity,true);
                this.endProvince=res.destinationProvince;
                this.endCity=res.destinationCity;
                this.endArea=res.destinationCounty;
                this.endAddress=res.destinationDetails;
                //发货起始地
                this.getAllAreaStart(res.originProvince,res.originCity,true);
                this.starProvince=res.originProvince;
                this.starCity=res.originCity;
                this.starAreaCity=res.originCounty;
                this.startAddress=res.originDetails;
                
                //（到货时间）
                this.plannedDeliveryTime= res.foreDeliveryTime;//到货
                //（发货时间）
                this.plannedArrivalTime= res.foreArrivalTime;//发货
                //货物类别
                this.goodsTypeId=res.goodsTypeId;
                //货物名称id
                this.goodsId=res.goodsId;
                this.goodsName = res.goodsName;
                //货物数量
                this.goodsQuantity=res.quantityOfGoods
                //货物数量单位
                this.goodsQuantityUnit=res.goodsUnit
                //车型
                this.carType=res.vehicleType
                //车长
                this.carLength=res.carLength
                //承运发式
                this.carrierCategory=res.carriageWay
                //装车效果
                this.loadingEffect=res.loadingEffect
                //附件备注
                this.attachmentDetails=res.attachmentRemarks
                this.mileage=res.mileage;
                this.setShipAndArriveTime();
                $("#wxInquiryAdd_plannedArrivalTime").datetimePicker({
                    title: '预计发货时间',
                    value: this.plannedArrivalTime,
                });
                $("#wxInquiryAdd_plannedDeliveryTime").datetimePicker({
                    title: '预计到货时间',
                    value: this.plannedDeliveryTime,
                });
            });
        }
        
        //客户单位初始化
        this.customerUnit = JSON.parse(window.sessionStorage.getItem("userInfo")).realName;
        this.enterpriseid = '';
        //获取省列表
        dataService().Area.getProvince().then((res) => {
            this.starProvinceList = res.list;
            this.endProvinceList = res.list;
        })
    }

    /**
    * 默认时间当天下午四点，次日下午五点
    */
   setShipAndArriveTime = function() {
        let time = new Date();
        let defaultTime = new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1, 17, 0);
        this.plannedArrivalTime = String(this.transformTime(new Date(time.setHours(16, 0, 0)), "yyyy-MM-dd HH:mm"));
        this.plannedDeliveryTime = String(this.transformTime(defaultTime, "yyyy-MM-dd HH:mm"));
    }
    /**
    * 默认时间
    */
//    setShipAndArriveTime = function() {
//         let time = new Date();
//         // let defaultTime = new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1,time.getHours(),time.getMinutes(),time.getSeconds());
//         this.plannedArrivalTime = String(this.transformTime(time, "yyyy-MM-dd HH:mm"));
//         this.plannedDeliveryTime = String(this.transformTime(time, "yyyy-MM-dd HH:mm"));
//     }
    transformTime = function(time, type){
        var t = time;
        var tf = function (i) { return (i < 10 ? '0' : '') + i };
        return type.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                case 'MM':
                    return tf(t.getMonth() + 1);
                case 'mm':
                    return tf(t.getMinutes());
                case 'dd':
                    return tf(t.getDate());
                case 'HH':
                    return tf(t.getHours());
                case 'ss':
                    return tf(t.getSeconds());
            }
        });
    }

    //获取发货计划人列表
    getConsignorList = function(){
        dataService().CustomerRepresentative.getCustomerList('', 0, -1).then((res) => {
            this.consignorDropDown = res.data;
        })
    }

    //获取货物类别列表
    getGoodsTypeList = function(){
        dataService().GoodsType.getDoodsTypeList("", 0, -1).then((res) => {
            this.goodsTypeDropDown = res.data;
        })
    }

    //选择发货计划人 触发
    changeConsignor = function () {
        if(this.consignor){
            this.consignorPhone = this.consignorDropDown.filter(t => t.realName == this.consignor)[0].phoneNumber;
        }else{
            this.consignorPhone="";
        }
    }
    //选中货物类别 触发 货物列表
    // 下拉选择框 select onChange
    goodsTypeSelect = function () {
        if (this.goodsTypeId) {
            this.goodsId = "";
            this.goodsName = "";
        }
    }
    //总Arealist start
    getAllAreaStart = function (p: string, c: string, t: boolean) {
        dataService().Area.getAllArea(p, c, t).then((resAreaStart) => {
            this.starProvinceList = resAreaStart.province;
            this.starCityList = resAreaStart.city;//市
            this.starAreaList = resAreaStart.county;//区
        })
    }
    // 总Arealist end 
    getAllAreaEnd = function (p: string, c: string, t: boolean) {
        dataService().Area.getAllArea(p, c, t).then((resArea) => {
            this.endProvinceList = resArea.province;
            this.endCityList = resArea.city;//市
            this.endAreaList = resArea.county;//区
        })
    }
    //发货地址 点击省 触发
    changeStarProvince = function () {
        this.getStarProvinceList();
    }
    getStarProvinceList = function () {
        this.starCity = "";//市
        this.starAreaCity = "";//区
        this.starAreaList = [];//区列表为空 
        if (this.starProvince === null || this.starProvince == "" || this.starProvince == undefined) {
            this.starProvince = -1;
        }
        dataService().Area.getCity(this.starProvince).then((res) => {
            this.starCityList = res.list;
        }, (rej) => {})
    }
    //发货地址 点击市 触发
    changeCity = function () {
        this.getCityList();
    }
    getCityList = function () {
        this.starAreaCity = '';
        if (this.starCity === null || this.starCity == "" || this.starCity == undefined) {
            this.starCity = -1;
        }
        dataService().Area.getCountry(this.starCity).then((res) => {
            this.starAreaList = res.list;
        }, (rej) => {})
    }
    //收货地址 点击 省触发
    changeEndProvince = function () {
        this.getEndProvinceList();
    }
    getEndProvinceList = function () {
        this.endCity = "";//市
        this.endArea = '';//区
        this.endAreaList = [];//区列表为空
        if (this.endProvince === null || this.endProvince == "" || this.endProvince == undefined) {
            this.endProvince = -1;
        }
        dataService().Area.getCity(this.endProvince).then((res) => {
            this.endCityList = res.list;
        }, (rej) => {})
    }
    //收货地址点击市 触发
    changeEndCity = function () {
        this.getEndCityList();
    }
    getEndCityList = function () {
        this.endArea = '';
        if (this.endCity === null || this.endCity == "" || this.endCity == undefined) {
            this.endCity = -1;
        }
        dataService().Area.getCountry(this.endCity).then((res) => {
            this.endAreaList = res.list;
        }, (rej) => {})
    }

    /**监听事件验证 */
    @Watch('[starCityList,endCityList,endAreaList,starAreaList,goodsNameDropDown]')
    changeValid() {
        //验证
        this.validFun();
    }
    validFun = function () {
        var self = this
        this.$validate(true, () => {
            if (this.$validation.valid) {}
        });
    }
    /**搜索货物名称*/
    inquiryOpenGoodsSearch = function(){
        $('#wxInquiryAdd_searchGoodsInput').autocomplete({
            source:(request, response)=>{
                dataService().Goods.getDoodsList(this.goodsTypeId,0,30,request.term).then((res)=>{
                    /**清空*/
                    this.goodsList = [];
                    res.data.forEach((item) => {
                        this.goodsList.push({
                            "label":item.name,
                            "value":item.id,
                        });
                    });
                }).then(()=>{
                    response(this.goodsList);
                });
            },
            open: (event, ui) => {
                $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
            },
            select: (event, ui)=>{
                $("#wxInquiryAdd_searchGoodsInput").val(ui.item.label);
                this.goodsName = ui.item.label;
                this.goodsId = ui.item.value;
                $.closePopup();
                $("#wxInquiryAdd_searchGoodsInput").val("");
                return false;
            }
        });
    }

    //判断发货时间是否小于到货时间
    timeJudge = function (plannedArrivalTime, plannedDeliveryTime) {
        var startTime = new Date(plannedArrivalTime);
        var endTime = new Date(plannedDeliveryTime);
        startTime = startTime.getFullYear() > 0 ? startTime : new Date(Date.parse(plannedArrivalTime.replace(/-/g, "/")));
        endTime = endTime.getFullYear() > 0 ? endTime : new Date(Date.parse(plannedDeliveryTime.replace(/-/g, "/")));
        if (startTime < endTime) {
            return true;
        } else {
            $.alert("发货时间必须小于到货时间！");
            return false;
        }
    }

    /**
     * 编辑保存询价单
     */
    editInquiry(childValid){
        if (childValid) {
            $.confirm("确认保存修改该询价吗?", () => {
                if (!this.timeJudge(this.plannedArrivalTime, this.plannedDeliveryTime)) {
                    return;
                } else {
                    var customerId = this.consignorDropDown.filter(t => t.realName == this.consignor)[0].id;
                    var destinationAddress = this.endProvinceList.filter(t => t.value == this.endProvince)[0].text + this.endCityList.filter(t => t.value == this.endCity)[0].text + this.endAreaList.filter(t => t.value == this.endArea)[0].text + this.endAddress
                    var originAddress = this.starProvinceList.filter(t => t.value == this.starProvince)[0].text + this.starCityList.filter(t => t.value == this.starCity)[0].text + this.starAreaList.filter(t => t.value == this.starAreaCity)[0].text + this.startAddress;
                    var goodsTypeName = this.goodsTypeDropDown ? this.goodsTypeDropDown.filter(t => t.id == this.goodsTypeId)[0].name : "";
                    var updateInquiry = {
                        "id":this.inquiryId,
                        "urgency": this.urgency,
                        "urgencyUnit": this.urgencyUnit,
                        "customerId": customerId,
                        "attachmentRemarks": this.attachmentDetails,
                        "content": this.content,
                        "attachmentList": [],
                        "destination": {
                            "province": this.endProvince,
                            "city": this.endCity,
                            "county": this.endArea,
                            "details": this.endAddress
                        },
                        "destinationAddress": destinationAddress,
                        "origin": {
                            "province": this.starProvince,
                            "city": this.starCity,
                            "county": this.starAreaCity,
                            "details": this.startAddress
                        },
                        "originAddress": originAddress,
                        "foreArrivalTime": this.plannedArrivalTime,
                        "foreDeliveryTime": this.plannedDeliveryTime,
                        "goodsTypeId": this.goodsTypeId,
                        "goodsTypeName": goodsTypeName,
                        "goodsId": this.goodsId,
                        "goodsName": this.goodsName,
                        "quantityOfGoods": this.goodsQuantity,
                        "goodsUnit": this.goodsQuantityUnit,
                        "vehicleType": this.carType,
                        "carLength": this.carLength,
                        "carriageWay": this.carrierCategory,
                        "loadingEffect": this.loadingEffect,
                        'mileage':this.mileage,
                        "cspInquiryId": this.cspInquiryId,
                        "lastModificationTime":this.lastModificationTime,
                    }
                    dataService().CspInquiry.updateCspInquiry(updateInquiry).then((res) => {
                        if (res.success) {
                            $.alert("修改成功！",function(){
                                router.go("/wechat/WxInquiryReleaseManage");
                            });
                        } else {
                            var error: string = res.errorMessage;
                            $.alert(error,function(){
                                router.go("/wechat/WxInquiryReleaseManage");
                            });
                        }
                    }, (err) => {})
                }
            }, () => {
                return;
            });
        }else{
            return
        }
    }
    /**
     * 编辑保存取消
     */
    editCancel(){
        history.back();
    }

    /**新增询价单 */
    addInquiryChild = function (childValid) {
        if (childValid) {
            $.confirm("确认发布询价吗？", () => {
                if (!this.timeJudge(this.plannedArrivalTime, this.plannedDeliveryTime)) {
                    return;
                } else {
                    var itemIndex = Math.round(Math.random() * 10000).toString();
                    var destinationAddress = this.endProvinceList.filter(t => t.value == this.endProvince)[0].text + this.endCityList.filter(t => t.value == this.endCity)[0].text + this.endAreaList.filter(t => t.value == this.endArea)[0].text + this.endAddress
                    var originAddress = this.starProvinceList.filter(t => t.value == this.starProvince)[0].text + this.starCityList.filter(t => t.value == this.starCity)[0].text + this.starAreaList.filter(t => t.value == this.starAreaCity)[0].text + this.startAddress;
                    var goodsTypeName = this.goodsTypeDropDown ? this.goodsTypeDropDown.filter(t => t.id == this.goodsTypeId)[0].name : "";
                    var carType = this.carTypeDropDown.filter(t => t.value == this.carType)[0].text;
                    var carLength = this.carLengthDropDown.filter(t => t.value == this.carLength)[0].text;
                    var goodsQuantity = this.goodsQuantityUnitDropDown.filter(t => t.value == this.goodsQuantityUnit)[0].text
                    this.inquiryChildList = [{
                        "destination": {
                            "province": this.endProvince,
                            "city": this.endCity,
                            "county": this.endArea,
                            "details": this.endAddress
                        },
                        "destinationAddress": destinationAddress,//
                        "origin": {
                            "province": this.starProvince,
                            "city": this.starCity,
                            "county": this.starAreaCity,
                            "details": this.startAddress
                        },
                        "originAddress": originAddress,//
                        "foreArrivalTime": this.plannedArrivalTime,//发货
                        "foreDeliveryTime": this.plannedDeliveryTime,//到货
                        "goodsTypeId": this.goodsTypeId,
                        "goodsTypeName": goodsTypeName,//
                        "goodsId": this.goodsId,
                        "goodsName": this.goodsName,//
                        "quantityOfGoods": this.goodsQuantity,
                        "goodsUnit": this.goodsQuantityUnit,
                        "vehicleType": this.carType,
                        "carLength": this.carLength,
                        "carriageWay": this.carrierCategory,
                        "loadingEffect": this.loadingEffect,
                        "mileage": this.mileage,
                        "index": itemIndex
                    }]

                    var inquiryChildItem = {
                        shipAddress: originAddress,
                        deliveryAddress: destinationAddress,
                        goodsName: this.goodsName,
                        goodsQuantity: this.goodsQuantity + goodsQuantity,
                        plannedDeliveryTime: this.plannedArrivalTime,
                        plannedArrivalTime: this.plannedDeliveryTime,
                        carType: carType,
                        carLength: carLength,
                        index: itemIndex
                    };
                    this.tableData = inquiryChildItem;
                    /**询价单发布 */
                    this.inquirySave();
                }
            }, () => {
                return;
            });
        }else{
            return
        }
    }


    /**询价发布 */
    inquirySave = function () {
        var submitUploadedFiles = [];
        var customerId = this.consignorDropDown.filter(t => t.realName == this.consignor)[0].id;
        this.submitImageLists.forEach((item) => {
            submitUploadedFiles.push(
                {
                    "id": null,
                    "name": item.fileName,
                    "path": item.submitUrl,
                    "tag": null
                }
            )
        })
        var submitInquiry = {
            "urgency": this.urgency,
            "urgencyUnit": this.urgencyUnit,
            "clientId": this.enterpriseid,
            "clientName": this.customerUnit,
            "customerId": customerId,
            "attachmentRemarks": this.attachmentDetails,
            "items": this.inquiryChildList,
            "content": this.content,
            "attachmentList": submitUploadedFiles,
            "operatorId": 0
        }
        for (var i = 0; i < this.inquiryChildList.length; i++) {
            delete this.inquiryChildList[i].index;
        }
        $.showLoading('发布中...');
        dataService().CspInquiry.addCspInquiry(submitInquiry).then((res) => {
            if (res.success) {
                $.hideLoading();
                $.alert("发布成功！您可再次点击发布按钮再次下单!");

            } else {
                $.hideLoading();
                var error: string = res.errorMessage;
                $.alert("发布失败！请重新下单!", error);
            }
        }, (err) => {
            // console.info('error:',err);
        })

        // },  ()=> {
        //     return;
        //     //取消操作
        // });

    }
    getDistance=function(){
        this.startPoint=$('#wxInquiryAdd_starProvince option:selected').text()+ $('#wxInquiryAdd_starCity option:selected').text()+$('#wxInquiryAdd_starAreaCity option:selected').text();
        this.endPoint=$('#wxInquiryAdd_endProvince option:selected').text()+ $('#wxInquiryAdd_endCity option:selected').text()+$('#wxInquiryAdd_endArea option:selected').text();
        if(this.startPoint.indexOf('请选择') == -1 && this.endPoint.indexOf('请选择') == -1){
            if(this.startPoint == this.endPoint){
                this.mileage=5;
            }else{
                var map = new BMap.Map()
                var myGeo = new BMap.Geocoder();
                myGeo.getPoint(this.startPoint,(point)=> {
                    this.pointA=point;
                    if(this.pointB){
                    this.mileage=Math.round(map.getDistance(this.pointA, this.pointB) / 1000);
                    }
                })
                myGeo.getPoint(this.endPoint,(point)=> {
                    this.pointB=point;
                    if(this.pointA){
                        this.mileage=Math.round(map.getDistance(this.pointA, this.pointB) / 1000)
                    }
                })
            }
            
        }
    }

    package: string = 'vue-typescript';
    repo: string = 'https://github.com/itsFrank/vue-typescript';

}
