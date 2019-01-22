import { VueComponent, Prop, Watch } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'
import { aliupload } from '../../service/OssUploadService';

declare var $: any;

Vue.use(VueRouter);
var router = new VueRouter();
var moment = require('moment');
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
@VueComponent({
    template: require('./inquiryEdit.html'),
    style: require('./inquiryEdit.scss')
})
export class InquiryEditComponent extends Vue {
    el: '#inquiryEdit'
    components: ({
        vclienttable: any,
    })

    //v-model初始化
    inquiryChildCode: string = ''
    inquiryTime: string = ''
    urgency: string = '';
    urgencyUnit: string = '';
    consignor: string = '';
    consignorPhone: string = '';
    content: string = '';
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
    goodsTypeId: string = "";
    goodsId: string = '';
    goodsName: string = '';
    goodsQuantity: string = ''
    goodsQuantityUnit: string = ''
    carType: string = ''
    carLength: string = ''
    carrierCategory: string = ''
    loadingEffect: string = ''
    attachmentDetails: string = ''
    mileage: string='';
    startPoint: string="";/* 起始地址 */
    endPoint: string="";/* 终点地址 */
    pointA={};/* 起始坐标 */
    pointB={};/* 终点坐标 */
    //设置禁用（详情）
    titleInquiry: string = ''
    starProvinceList = [];
    starCityList = [];
    starAreaList = [];
    endProvinceList = [];
    endCityList = [];
    endAreaList = [];
    goodsQuantityUnitDropDown = [{ "text": "吨", "value": "1" }, 
                                { "text": "立方", "value": "2" }, 
                                { "text": "车", "value": "3" }, 
                                { "text": "件", "value": "4" },
                                { "text": "托", "value": "5" }, 
                                { "text": "台", "value": "6" }, 
                                { "text": "其他", "value": "7" }]
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
    carLengthDropDown = [{ "text": "4.2米", "value": "1" }, 
                        { "text": "5.8米", "value": "2" }, 
                        { "text": "6米", "value": "3" }, 
                        { "text": "6.2米", "value": "4" }, 
                        { "text": "6.5米", "value": "5" }, 
                        { "text": "6.8米", "value": "6" }, 
                        { "text": "7.6米", "value": "7" }, 
                        { "text": "8.6米", "value": "8" }, 
                        { "text": "8.7米", "value": "9" }, 
                        { "text": "9.6米", "value": "10" }, 
                        { "text": "13米", "value": "11" }, 
                        { "text": "13.5米", "value": "12" }, 
                        { "text": "16米", "value": "13" }, 
                        { "text": "17.5米", "value": "14" }, 
                        { "text": "其他", "value": "15" }]
    carrierCategoryDropDown = [{ "text": "整车", "value": "1" }, 
                            { "text": "零担", "value": "2" },
                            { "text": "整车/零担", "value": "3" }]
    urgencyUnitDropDown = [{ text: "天", value: "1" }, 
                        { text: "时", value: "2" }, 
                        { text: "分", value: "3" }];
    goodsTypeDropDown = [];
    consignorDropDown = [];
    /**图片列表 */
    imageLists = [];
    //提交的图片数据
    submitImageLists = [];
    imageColumns = ['image', 'name', 'size', 'rate', 'state', 'operation'];
    imageOptions = {
        texts: {
            noResults: '暂无数据',
        },
        headings: {
            image: '图片',
            name: "名称",
            size: "大小",
            rate: "进度",
            state: "状态",
            operation: '操作'
        },
        templates: {
            operation: (row) => {
                var operationDelTemple = `<a title='删除' href='javascript:void(0);' @click='$parent.deleteImage(${row.id})' class="btn deleteDisabledStatus"><i class='glyphicon glyphicon-trash  primary text-danger m-l-xs'></i></a>`
                var operationUploadTemple = `<a class='btn' title='上传' id="${row.id}uploadDisabledStatus" href='javascript:void(0);' @click='$parent.uploadImage(${row.id})'><i class='glyphicon glyphicon-upload'></i></a>`;
                var operationDownloadTemple = `<a class='btn' title='下载' href='javascript:void(0);'  @click='$parent.downloadImage(${row.id})'><i class='glyphicon glyphicon-download text-success'></i></a>`
                if (row.showStatus) {
                    if (this.submitImageLists.length > 0) {
                        if (this.submitImageLists.filter(t => t.id == row.id).length > 0) {
                            if (this.submitImageLists.filter(t => t.id == row.id)[0].submitUrl) {
                                return operationDelTemple +
                                    `<a class='btn' title='上传' id="${row.id}uploadDisabledStatus" href='javascript:void(0);' @click='$parent.uploadImage(${row.id})' disabled="disabled"><i class='glyphicon glyphicon-upload'></i></a>`
                            }
                        } else { return operationDelTemple + operationUploadTemple; }
                    } else { return operationDelTemple + operationUploadTemple; }
                } else {
                    return operationDownloadTemple + operationDelTemple
                }
            },
            image: (row) => {
                if (row.showStatus) {
                    if (row.type.indexOf("image") >= 0) {
                        return `<div class="img-thumbnail" style="position:relative">
                            <img class="img-responsive" src="${row.path}" style="max-width:266px" />
                        </div>`;
                    } else {
                        return `<i>${row.name}<i>`;
                    }
                } else {
                    if (!/gif|jpeg|jpg|png|bmp/gi.test(row.path.substring(row.path.indexOf(".")))) {
                        var test = row.path.split("/");
                        var fileName = test[(test.length) - 1];
                        return `<i>${fileName}<i>`;
                    } else {
                        return `<div class="img-thumbnail" style="position:relative">
                            <img class="img-responsive" src="${row.path}" style="width:236px;height:298px" />
                        </div>`;
                    }
                }
            },
            state: (row) => {
                var stateTemple = `<span class='glyphicon glyphicon-remove text-danger' id="${row.id}"  title='状态显示'></span>`;
                var stateTempleSuccess = `<span class='glyphicon glyphicon-ok text-success' id="${row.id}"  title='状态显示'></span>`;
                if (row.showStatus) {
                    if (this.submitImageLists.length > 0) {
                        if (this.submitImageLists.filter(t => t.id == row.id).length > 0) {
                            if (this.submitImageLists.filter(t => t.id == row.id)[0].submitUrl) { return stateTempleSuccess; }
                        } else { return stateTemple; }
                    } else { return stateTemple; }
                } else { return stateTempleSuccess; }
            },
            rate: (row) => {
                var rateTemple = `<div class="progress"><div class="progress-bar progress-bar-uploadFile" id='${row.id}progressBar' role="progressbar"></div></div>`;
                var rateTempleSuccess = `<div class="progress"><div class="progress-bar progress-bar-uploadFile" id='${row.id}progressBar' role="progressbar" style="width:100.00%"></div></div>`;
                if (row.showStatus) {
                    if (this.submitImageLists.length > 0) {
                        if (this.submitImageLists.filter(t => t.id == row.id).length > 0) {
                            if (this.submitImageLists.filter(t => t.id == row.id)[0].submitUrl) { return rateTempleSuccess; }
                        } else { return rateTemple; }
                    } else { return rateTemple; }
                } else { return rateTempleSuccess; }
            }
        },
    };
    //下载附件
    downloadImage = function (index) {
        var url = this.imageLists.filter(t => t.id == index)[0].key;
        window.location.href = dataService().baseUrl + "Attachment/getAttachment/" + url;
    }
    //删除附件
    deleteImage = function (index) {
        var itemDel = this.imageLists.filter(t => t.id == index)
        var submitItemDel = this.submitImageLists.filter(t => t.id == index);
        this.imageLists.$remove(itemDel[0]);
        this.submitImageLists.$remove(submitItemDel[0]);
        // if (this.imageLists.length <= 0) {
        //     $('#inquiryEdit_uploadAll').attr('disabled', 'true');
        // }
    }
    //上传附件
    uploadImage = function (id) {
        var uploadDisabledStatus = $("#" + id + 'uploadDisabledStatus').attr('disabled');
        if (uploadDisabledStatus !== 'disabled') {
            var submitUrl = '';
            var itemUpload = this.imageLists.filter(t => t.id == id);
            var today = new Date();
            var formatDate = moment().format('YYYYMMDDHHmm');
            var rr = itemUpload[0].name.indexOf(".");
            var nameimg = formatDate + Math.round(Math.random() * 10000).toString() + itemUpload[0].name.substring(rr);
            /** 禁用上传按钮*/
            $("#" + itemUpload[0].id + 'uploadDisabledStatus').attr('disabled', 'disabled');
            /**调用上传方法 */
            aliupload().upload(itemUpload[0], nameimg, (res) => {
                if (res.res.statusCode == "200") {
                    var imageUriSubmit = res.res.requestUrls[0].split('?')[0];
                    itemUpload[0].fileName = nameimg;
                    itemUpload[0].submitUrl = imageUriSubmit;
                    $("#" + itemUpload[0].id + 'progressBar').attr({ style: "width:" + "100" + '%' });
                    $("#" + itemUpload[0].id).attr("class", "glyphicon glyphicon-ok text-success");
                    this.submitImageLists.push(itemUpload[0]);
                } else {
                    $("#" + itemUpload[0].id + 'uploadDisabledStatus').removeAttr("disabled");
                }
            });
            // aliupload().progress((res) => {
            //     console.log(res);
            // })
        }
    }

    //全部上传
    attachmentUploader = () => {
        for (var i = 0; i < this.imageLists.length; i++) {
            this.uploadImage(this.imageLists[i].id);
        }
    }
    /**声明 */
    @Prop
    /**传给自动选中子组件 */
    goodsNameDropDown = [];
    settle:string="";
    settleId:string="";
    /**
     * 询价单id
     */
    inquiryId: string;
    customerUnit: string = '';
    enterpriseid: string;
    cspInquiryId:string="";
    /**
     * 编辑时间
     */
    lastModificationTime:string = "";

    map;
    

    /**初始化 */
    ready() {
        this.map = new BMap.Map("allmap");
        this.$on("eventName1",(event)=>{
            this.goodsName = event.name;
            this.goodsId = event.id;
            if(this.goodsId){
                return;
            }else{
                this.searchGoodsName(this.goodsName);
            }
        });

        //初始设置
        this.inquiryChildCode = '';
        this.inquiryTime = '';
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
        this.goodsId = '';
        this.goodsName = '';
        this.goodsQuantity = '';
        this.goodsQuantityUnit = '';
        this.carType = '';
        this.carLength = '';
        this.carrierCategory = '';
        this.loadingEffect = ''
        this.attachmentDetails = '';
        this.mileage="";
        this.startPoint="";
        this.endPoint="";
        this.pointA={};
        this.pointB={};
        this.submitImageLists.splice(0, this.submitImageLists.length);
        this.imageLists = [];
        this.customerUnit = JSON.parse(window.sessionStorage.getItem("userInfo")).realName;
        this.enterpriseid = '';
        this.inquiryId = this.$route.query.id;
        this.titleInquiry = '编辑询价单';

        this.getConsignorList();
        this.getGoodsTypeList();

        //获取省列表
        dataService().Area.getProvince().then((res) => {
            this.starProvinceList = res.list;
            this.endProvinceList = res.list;
        })

        //时间插件 初始化
        $('#inquiryEdit_plannedArrivalTime').datetimepicker();
        $("#inquiryEdit_plannedDeliveryTime").datetimepicker();
        // 获取询价详情
        dataService().CspInquiry.getCspInquiry(this.inquiryId).then((res) => {
            this.lastModificationTime = res.lastModificationTime;
            //子询价编号
            this.inquiryChildCode = res.cspInquiryChildCode;
            //询价发布时间
            this.inquiryTime = res.cspInquiryTime
            //客户单位
            this.customerUnit = res.clientName
            //发货计划人
            this.consignor = res.customerName
            //发货人电话
            this.consignorPhone = res.customerPhone
            //总询价内容
            this.content = res.content
            //发货目的地
            this.getAllAreaEnd(res.destinationProvince, res.destinationCity, true);
            this.endProvince = res.destinationProvince
            this.endCity = res.destinationCity
            this.endArea = res.destinationCounty
            this.endAddress = res.destinationDetails
            //发货起始地
            this.getAllAreaStart(res.originProvince, res.originCity, true);
            this.starProvince = res.originProvince
            this.starCity = res.originCity;
            this.starAreaCity = res.originCounty
            this.startAddress = res.originDetails
            //（到货时间）
            this.plannedDeliveryTime = res.foreDeliveryTime;
            //（发货时间）
            this.plannedArrivalTime = res.foreArrivalTime;
            //货物类别
            this.goodsTypeId = res.goodsTypeId;
            //货物名称id
            this.goodsId = res.goodsId;
            this.goodsName = res.goodsName;
            this.getGoodsTypeList();
            //货物数量
            this.goodsQuantity = res.quantityOfGoods
            //货物数量单位
            this.goodsQuantityUnit = res.goodsUnit
            //车型
            this.carType = res.vehicleType
            //车长
            this.carLength = res.carLength
            //承运发式
            this.carrierCategory = res.carriageWay
            //装车效果
            this.loadingEffect = res.loadingEffect
            //附件备注
            this.attachmentDetails = res.attachmentRemarks
            //紧急程度
            this.urgency = res.responseTime;
            //紧急程度单位
            this.urgencyUnit = res.responseTimeUnit;
            this.mileage=res.mileage;
            //附件列表
            this.cspInquiryId = res.cspInquiryId;
            if (res.attachmentList) {
                res.attachmentList.forEach((item, index) => {
                    item.key = item.id;
                    item.id = index.toString();
                    item.showStatus = false;
                    this.imageLists.push(item);
                    this.submitImageLists.push({
                        id: item.id,
                        fileName: item.name,
                        submitUrl: item.path,
                    })
                })
            }
        }, (rej) => { })
    }

    //获取发货计划人列表
    getConsignorList = function () {
        dataService().CustomerRepresentative.getCustomerList("", 0, -1).then((res) => {
            this.consignorDropDown = res.data;
        });
    }

    //获取货物类别列表
    getGoodsTypeList = function () {
        dataService().GoodsType.getDoodsTypeList("", 0, -1).then((res) => {
            this.goodsTypeDropDown = res.data;
        });
    }

    //选择发货计划人 触发
    changeConsignor = function () {
        if (this.consignor) {
            this.consignorPhone = this.consignorDropDown.filter(t => t.realName == this.consignor)[0].phoneNumber;
        } else {
            this.consignorPhone = "";
        }
    }
    //选中货物类别 触发 货物列表
    goodsTypeSelect = function () {
        this.goodsId = "";
        this.goodsName = "";
        this.$refs.goodsname.changeStyle()
    }

    /**获取货物名称 */
    searchGoodsName = function(goodsName){
        this.goodsNameDropDown = [];
        if(this.goodsTypeId == ""){
            return;
        }
        dataService().Goods.getDoodsList(this.goodsTypeId, 0, 30, goodsName).then((res) => {
            /**清空*/
            this.goodsNameDropDown = res.data;
        })
    }

    //总Arealist start
    getAllAreaStart = function (p: string, c: string, t: boolean) {
        dataService().Area.getAllArea(p, c, t).then((resAreaStart) => {
            this.starProvinceList = resAreaStart.province;
            this.starCityList = resAreaStart.city;
            this.starAreaList = resAreaStart.county;
        })
    }
    // 总Arealist end 
    getAllAreaEnd = function (p: string, c: string, t: boolean) {
        dataService().Area.getAllArea(p, c, t).then((resArea) => {
            this.endProvinceList = resArea.province;
            this.endCityList = resArea.city;
            this.endAreaList = resArea.county;
        })
    }
    //发货地址 点击省 触发
    changeStarProvince = function () {
        this.getStarProvinceList();
    }
    getStarProvinceList = function () {
        this.starCity = "";
        this.starAreaCity = "";
        this.starAreaList = [];
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
        this.endCity = "";
        this.endArea = '';
        this.endAreaList = [];
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
        }, (rej) => {
        })
    }

    @Watch('[starCityList,endCityList,endAreaList,starAreaList]')
    changeValid() {
        this.validFun();
    }
    validFun = function () {
        var self = this
        this.$validate(true, () => {
            if (this.$validation.valid) {
            }
        });
    }
    /**
     * 编辑保存询价单
     */
    editSaveInquiry(isValid){
        // if(isValid){
            var startTime = new Date(this.plannedArrivalTime);
            var endTime = new Date(this.plannedDeliveryTime);
            if (startTime.getTime() >= endTime.getTime()) {
                bootbox.alert("发货时间需小于到货时间！");
            } else if (this.goodsId == undefined || this.goodsId == "") {
                bootbox.alert("请选择货物名称！");
            }else{
                var submitUploadedFiles = [];
                var customerId = this.consignorDropDown.filter(t => t.realName == this.consignor)[0].id;
                var destinationAddress = this.endProvinceList.filter(t => t.value == this.endProvince)[0].text + this.endCityList.filter(t => t.value == this.endCity)[0].text + this.endAreaList.filter(t => t.value == this.endArea)[0].text + this.endAddress
                var originAddress = this.starProvinceList.filter(t => t.value == this.starProvince)[0].text + this.starCityList.filter(t => t.value == this.starCity)[0].text + this.starAreaList.filter(t => t.value == this.starAreaCity)[0].text + this.startAddress;
                var goodsTypeName = this.goodsTypeDropDown ? this.goodsTypeDropDown.filter(t => t.id == this.goodsTypeId)[0].name : "";
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
                var updateInquiry = {
                    "id":this.inquiryId,
                    "urgency": this.urgency,
                    "urgencyUnit": this.urgencyUnit,
                    "customerId": customerId,
                    "attachmentRemarks": this.attachmentDetails,
                    "content": this.content,
                    "attachmentList": submitUploadedFiles,
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
                bootbox.confirm("确认保存修改该询价吗?", (bootboxResult) => {
                    if (bootboxResult) {
                        dataService().CspInquiry.updateCspInquiry(updateInquiry).then((res) => {
                            if (res.success) {
                                bootbox.alert("修改成功！",function(){
                                    router.go('/app/inquiry/inquiryReleaseManage');
                                });
                            } else {
                                var error: string = res.errorMessage;
                                bootbox.alert(error,function(){
                                    router.go('/app/inquiry/inquiryReleaseManage');
                                });
                            }
                        }, (err) => {})
                    } else {
                        return;
                    }
                });
            }
        // }else{
        //     return;
        // }
    }

    //选择文件
    onFileChange = function (e) {
        var files = e.target.files;
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var selectedFileVehicleLicense = files[i];
                var imageName = Math.round(Math.random() * 10000).toString();
                var objUrl = this.getObjectURL(files[i]);;
                files[i].id = imageName;
                files[i].path = objUrl;
                files[i].showStatus = true;
                files[i].uploadState = false;
                this.imageLists.push(files[i]);
            }
        }
        $("#upLoader").val("");
    }

    //建立一個可存取到該file的url
    getObjectURL = (file) => {
        var urlImg = null;
        if (window.URL != undefined) { // mozilla(firefox)
            urlImg = window.URL.createObjectURL(file);
        }
        return urlImg;
    }
    /**
     * 获取里程数
     */
    getDistance=function(){
        this.startPoint=$('#inquiryEdit_popupProvince option:selected').text()+ $('#inquiryEdit_popupCity option:selected').text()+$('#inquiryEdit_popupCounty option:selected').text();
        this.endPoint=$('#inquiryEdit_receiveProvince option:selected').text()+ $('#inquiryEdit_receiveCity option:selected').text()+$('#inquiryEdit_receiveCounty option:selected').text();
        if(this.startPoint.indexOf('请选择') == -1 && this.endPoint.indexOf('请选择') == -1){
            if(this.startPoint == this.endPoint){
                this.mileage=5;
            }else{
                var myGeo = new BMap.Geocoder();
                myGeo.getPoint(this.startPoint,(point)=> {
                    this.pointA=point;
                    if(this.pointB){
                    this.mileage=Math.round(this.map.getDistance(this.pointA, this.pointB) / 1000);
                    }
                })
                myGeo.getPoint(this.endPoint,(point)=> {
                    this.pointB=point;
                    if(this.pointA){
                        this.mileage=Math.round(this.map.getDistance(this.pointA, this.pointB) / 1000)
                    }
                })
            }
            
        }
    }
}
