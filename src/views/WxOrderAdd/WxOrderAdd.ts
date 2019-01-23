import { VueComponent, Prop ,Watch} from 'vue-typescript'
import {dataService} from '../../service/dataService';
import * as VueRouter from 'vue-router';
//import '../../favicon.ico';

declare var $:any;

Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxOrderAdd.html'),
    style: require('./WxOrderAdd.scss')
})
export class WxOrderAddComponent extends Vue {
    el:'#WxOrderAdd';
    components:({
       
        vclienttable:any,
    })

    @Prop
    /**销售编号 */
    clientOrderId : string;
    //v-model初始化
    startAddress='';
    endAddress='';
    //客户单位名称
    clientName="";
    orderId="";//货物编号id
    urgency='';
    urgencyUnit='';
    consignorName='';
    consignorPhone='';
    orderContent='';
    startProvince='';//发货地址
    startCity='';
    startArea='';
    startAddressDetail='';
    endProvince='';//送货地址
    endCity='';
    endArea='';
    endAddressDetail='';
    startTime='';
    arrivalTime='';
    goodsTypeId='';
    goodsId='';
    goodsName='';
    goodsNum='';
    goodsNumUnit='';
    totalPrice='';
    carType='';
    carLength='';
    carriageWay='';
    settleType='';
    includeTax='';
    settleId='';
    settle='';
    consignee='';
    consigneePhone="";
    mileage="";/* 公里数 */
    startPoint="";/* 起始地址 */
    endPoint="";/* 终点地址 */
    pointA={};/* 起始坐标 */
    pointB={};/* 终点坐标 */
    map;
    //下拉列表
    urgencyUnitList=[
        {"text":"天","value":"1"},
        {"text":"小时","value":"2"},
        {"text":"分钟","value":"3"}
    ];
    consignorNameList=[];
    goodsTypeList=[];
    goodsNameList=[];
    goodsNumUnitList=[
        {"text": "吨","value": "1"},
        {"text": "立方","value": "2"},
        { "text": "车","value": "3"},
        {"text": "件","value": "4"},
        {"text": "托","value": "5"},
        {"text": "台","value": "6"},
        {"text": "其他","value": "7"}
    ];
    carTypeList=[
        {"text": "厢车","value": "1"},
        {"text": "飞翼","value": "2"},
        {"text": "半挂","value": "3"},
        {"text": "标厢","value": "4"},
        {"text": "大平板","value": "5"},
        {"text": "平板","value": "6"},
        {"text": "高低板","value": "7"},
        {"text": "高栏平板","value": "8"},
        {"text": "高栏高低板", "value": "9"},
        {"text": "大件车抽拉板", "value": "10"},
        { "text": "大件车超低板", "value": "11"},
        {"text": "自卸车","value": "12"},
        {"text": "单车","value": "13"},
        {"text": "拖车（集装箱）","value":"15"},
        {"text": "其他", "value": "14" }
    ];
    carLengthList=[
        { "text": "4.2米","value": "1"},
        {"text": "5.8米","value": "2"},
        {"text": "6米","value": "3"},
        { "text": "6.2米","value": "4" },
        { "text": "6.5米", "value": "5"}, 
        {"text": "6.8米","value": "6" },
        {"text": "7.6米","value": "7"},
        {"text": "8.6米","value": "8"},
        { "text": "8.7米","value": "9"},
        {"text": "9.6米","value": "10"},
        { "text": "13米", "value": "11"},
        {"text": "13.5米","value": "12" },
        {"text": "16米","value": "13"},
        {"text": "17.5米","value": "14"},
        {"text": "其他","value": "15"}
    ];
    carrierCategoryList=[
        {"text": "整车","value": "1"},
        {"text": "零担", "value": "2" },
        {"text": "整车/零担","value": "3"}
    ];
    settleList=[];
    settleTypeList = [
        {"text": "配送结算","value": "1"},
        {"text": "到付结算","value": "2"},
        {"text": "公里数结算","value": "3"}
    ];
    includeTaxList = [
        {"text": "含税","value": "1"},
        {"text": "不含税","value": "2"},
        {"text": "未知","value": "3"},
    ];
    //后台获取的省市区下拉列表
    provinceList=[];
    provinceValueList=[];
    provinceTextList=[];
    startCityList=[];
    startAreaList=[];
    endCityList=[];
    endAreaList=[];
    /**用于存放转换后的货物名称列表 */
    goodsList = [];
    /**用于存放转换后的结算单位列表 */
    settleNameList = [];
    /* 上次修改时间 */
    lastModificationTime:string="";
    name:string;
    id:string;
    btnName:string;
    title:string;
    showBtn:boolean=true;
    ready(){
        this.map = new BMap.Map();
        /**添加滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style","height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.orderId = "";//货物编号id
        this.clientOrderId = "";//销售编号
        this.startAddress = "";
        this.clientName = JSON.parse(window.sessionStorage.getItem("userInfo")).realName;
        this.urgency='';
        this.urgencyUnit='';
        this.consignorName='';
        this.consignorPhone='';
        this.orderContent='';
        this.startProvince='';
        this.startCity='';
        this.startArea='';
        this.startAddressDetail='';
        this.endProvince='';
        this.endCity='';
        this.endArea='';
        this.endAddressDetail='';
        this.setShipAndArriveTime();
        this.goodsTypeId='';
        this.goodsId='';
        this.goodsName = '';
        this.goodsNum='';
        this.goodsNumUnit='';
        this.totalPrice='';
        this.carType='';
        this.carLength='';
        this.carriageWay='';
        this.settleType='';
        this.includeTax='';
        this.settleId='';
        this.settle='';
        this.consignee='';
        this.consigneePhone="";
        this.mileage="";
        this.startCityList=[];
        this.startAreaList=[];
        this.endCityList=[];
        this.endAreaList=[];
        this.goodsList = [];
        this.startPoint="";
        this.endPoint="";
        this.pointA="";
        this.pointB="";
        this.title=""
        this.btnName=""
        $('#orderAdd_dateTimeStart').datetimePicker({
            value:this.startTime,
        });
        $('#orderAdd_dateTimeEnd').datetimePicker({
            value:this.arrivalTime,
        });

        
        this.getCustomerList();
        this.getGoodsTypeList();
        this.getProvinceList();
        
        this.id = this.$route.query.id;
        this.name = this.$route.query.name;
        if(this.name=="copy" || this.name=="edit"){
            dataService().CspOrder.getCspOrder(this.id).then((res)=>{
                this.lastModificationTime=res.lastModificationTime;
                this.goodsId = res.goodsId;//货物编号
                this.clientOrderId = res.clientOrderId;
                this.settleId = res.items[0].settleId;//结算单位编号
                this.urgency = res.responseTime;//紧急程度
                this.urgencyUnit = res.responseTimeUnit;//紧急程度单位
                this.consignorName = res.consignorName;//发货计划人
                this.consignorPhone = res.consignorPhone;//发货人电话
                this.orderContent = res.content;
                this.mileage = res.mileage;
                //发货
                this.getAllAreaStart(res.originProvince,res.originCity,true);
                this.startProvince = res.originProvince;
                this.startCity=res.originCity;
                this.startArea=res.originCounty;
                this.startAddressDetail=res.originDetails;//详细地址
                //送货
                this.getAllAreaEnd(res.destinationProvince,res.destinationCity,true);// 
                this.endProvince= res.destinationProvince;
                this.endCity = res.destinationCity;
                this.endArea =res.destinationCounty;
                this.endAddressDetail=res.destinationDetails;//详细地址
                this.goodsTypeId = res.goodsTypeId;//货物类别
                this.goodsName = res.goodsName;//货物名称
                this.goodsNum = res.quantityOfGoods;//货物数量
                this.goodsNumUnit = res.goodsUnit;//货物数量单位
                //发货单详情没有期望运价
                this.carType = res.vehicleType;//车型
                this.carLength =res.carLength; //车长
                this.carriageWay = res.carriageWay;//承运方式
                this.settleType = res.items[0].settlementType;//结算方式
                this.includeTax = res.items[0].includeTax;//含税
                //新增没有装车效果
                this.settle = res.items[0].settle;//结算单位
                this.consignee = res.items[0].consignee;//收货人
                this.consigneePhone = res.items[0].consigneePhone;//收货人电话

                if(this.name=="edit"){
                    this.startTime=res.deliveryTime
                    this.arrivalTime=res.arrivalTime
                }
            },(rej)=>{});
        }else if(this.name=="copyInquiry"){
            dataService().Inquiry.getInquiry(this.id).then((res)=>{
                this.lastModificationTime=res.lastModificationTime;
                this.goodsId = res.goodsId;//货物编号
                this.clientOrderId = res.clientOrderId;

                this.urgency = parseFloat(res.responseTime).toString();//紧急程度
                //紧急程度单位
                if(res.responseTime.indexOf('天')>-1){
                    this.urgencyUnit = "1";
                }else  if(res.responseTime.indexOf('小时')>-1){
                    this.urgencyUnit = "2";
                }else  if(res.responseTime.indexOf('分钟')>-1){
                    this.urgencyUnit = "3";
                }else{
                    this.urgencyUnit = "0";
                }
                this.consignorName = res.customerName;//发货计划人
                this.consignorPhone = res.customerPhone;//发货人电话
                this.orderContent = res.content;
                this.mileage = res.mileage;
                //发货
                this.getAllAreaStart(res.originProvince,res.originCity,true);
                this.startProvince = res.originProvince;
                this.startCity=res.originCity;
                this.startArea=res.originCounty;
                this.startAddressDetail=res.originDetails;//详细地址
                //送货
                this.getAllAreaEnd(res.destinationProvince,res.destinationCity,true);// 
                this.endProvince= res.destinationProvince;
                this.endCity = res.destinationCity;
                this.endArea =res.destinationCounty;
                this.endAddressDetail=res.destinationDetails;//详细地址
                this.goodsTypeId = res.goodsTypeId;//货物类别
                this.goodsName = res.goodsName;//货物名称
                this.goodsNum = res.quantityOfGoods;//货物数量
                this.goodsNumUnit = res.goodsUnit;//货物数量单位
                //发货单详情没有期望运价
                this.carType = res.vehicleType;//车型
                this.carLength =res.carLength; //车长
                this.carriageWay = res.carriageWay;//承运方式
                //新增没有装车效果
                // this.consignee = res.items[0].consignee;//收货人
                // this.consigneePhone = res.items[0].consigneePhone;//收货人电话
                // this.settleId = res.items[0].settleId;//结算单位编号
                // this.settleType = res.items[0].settlementType;//结算方式
                // this.includeTax = res.items[0].includeTax;//含税
                // this.settle = res.items[0].settle;//结算单位
            },(rej)=>{});
        }else if(this.name=="copyOrder"){
            dataService().Order.getOrder(this.id).then((res)=>{
                this.lastModificationTime=res.lastModificationTime;
                this.goodsId = res.goodsId;//货物编号
                this.clientOrderId = res.clientOrderId;
                this.settleId = res.items[0].settleId;//结算单位编号
                this.urgency = res.responseTime;//紧急程度
                this.urgencyUnit = res.responseTimeUnit;//紧急程度单位
                this.consignorName = res.consignorName;//发货计划人
                this.consignorPhone = res.consignorPhone;//发货人电话
                this.orderContent = res.content;
                this.mileage = res.mileage;
                //发货
                this.getAllAreaStart(res.originProvince,res.originCity,true);
                this.startProvince = res.originProvince;
                this.startCity=res.originCity;
                this.startArea=res.originCounty;
                this.startAddressDetail=res.originDetails;//详细地址
                //送货
                this.getAllAreaEnd(res.destinationProvince,res.destinationCity,true);// 
                this.endProvince= res.destinationProvince;
                this.endCity = res.destinationCity;
                this.endArea =res.destinationCounty;
                this.endAddressDetail=res.destinationDetails;//详细地址
                this.goodsTypeId = res.goodsTypeId;//货物类别
                this.goodsName = res.goodsName;//货物名称
                this.goodsNum = res.quantityOfGoods;//货物数量
                this.goodsNumUnit = res.goodsUnit;//货物数量单位
                //发货单详情没有期望运价
                this.carType = res.vehicleType;//车型
                this.carLength =res.carLength; //车长
                this.carriageWay = res.carriageWay;//承运方式
                this.settleType = res.items[0].settlementType;//结算方式
                this.includeTax = res.items[0].includeTax;//含税
                //新增没有装车效果
                this.settle = res.items[0].settle;//结算单位
                this.consignee = res.items[0].consignee;//收货人
                this.consigneePhone = res.items[0].consigneePhone;//收货人电话
            },(rej)=>{});
        }
            

            if(this.name == 'copy' || this.name == 'copyInquiry'){
                this.title="发货发布";
                this.showBtn=true;
            }else if(this.name == 'edit'){
                this.title="编辑订单";
                this.showBtn=false;
            }else {
                this.title="编辑订单";
                this.showBtn=true;
            }
        
    }

    //选择工程名称获取详情，获取收货单位id
        changeProjectName = function(){
            //this.projectName = this.projectNameList.filter(t=>t.id==this.projectId)[0].projectName;
            dataService().Project.getProject(this.projectId).then((res)=>{
                this.projectName = res.data.projcetName;
                this.projectCode = res.data.projectCode;
                this.projectTotal = res.data.max;
                this.projectTotalUnit = res.data.maxUnit;
                this.takeGoodsCompanyName = res.data.settleName;
                this.consignee = res.data.settleContact;
                this.consigneePhone = res.data.settlePhone;
            });
        }
    /**
    * 默认时间当天下午四点，次日下午五点
    */
    setShipAndArriveTime = function() {
        let time = new Date();
        let defaultTime = new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1, 17, 0);
        this.startTime = String(this.transformTime(new Date(time.setHours(16, 0, 0)), "yyyy/MM/dd HH:mm"));
        this.arrivalTime = String(this.transformTime(defaultTime, "yyyy/MM/dd HH:mm"));
        }
    
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
    @Watch('[startCityList,endCityList,endAreaList,startAreaList,goodsNameList]')
    changeValid(){
        //验证
        this.validFun();
    }
    validFun=function() {
        var self = this;
        this.$validate('',true,  ()=> {});
    }
    //总Arealist start
    getAllAreaStart=function(p:string,c:string,t:boolean) {
        dataService().Area.getAllArea(p,c,t).then((resAreaStart)=>{
            //console.info('resAreastart',resAreaStart);
            this.provinceList=resAreaStart.province;
            this.startCityList  = resAreaStart.city;//市
            this.startAreaList = resAreaStart.county;//区
        })
    }
    // 总Arealist end 
    getAllAreaEnd=function(p:string,c:string,t:boolean) {
        dataService().Area.getAllArea(p,c,t).then((resArea)=>{
            //console.info('resArea',resArea);
            this.provinceList=resArea.province;
            this.endCityList = resArea.city;//市
            this.endAreaList= resArea.county;//区
        })
    }
    
    //获取发货计划人列表
    getCustomerList=function(){
        dataService().CustomerRepresentative.getCustomerList("",0,-1).then((resConsignor)=>{
            this.consignorNameList = resConsignor.data;
        });
    }

    //获取货物类别列表
    getGoodsTypeList = function(){
            dataService().GoodsType.getDoodsTypeList("",0,-1).then((res)=>{
            this.goodsTypeList=res.data;
        });
    }

    //获取省列表
    getProvinceList = function(){
        dataService().Area.getProvince().then((res)=>{
            this.provinceList=res.list;
        });
    }
    //获取发货地址 市下拉
    getStartCityList = function(startProvince){
        dataService().Area.getCity(startProvince).then((res)=>{
            this.startCityList = res.list;
        })
    }
    //获取发货地址 区下拉
    getStartAreaList = function(startCity){
        dataService().Area.getCountry(startCity).then((res)=>{
            this.startAreaList = res.list;
        })
    }
    //获取送货地址 市下拉
    getEndCityList = function(endProvince){
        dataService().Area.getCity(endProvince).then((res)=>{
            this.endCityList = res.list;
        })
    }
    //获取送货地址 区下拉
    getEndAreaList = function(endCity){
        dataService().Area.getCountry(endCity).then((res)=>{
            this.endAreaList = res.list;
        })
    }

    /**
     * change事件
     */
    //发货地址 点击省 触发
    changeStarProvince=function(){
        this.startCity = "";
        this.startArea = "";
        this.startAreaList = [];
        dataService().Area.getCity(this.startProvince).then((res)=>{
            this.startCityList=res.list;
        },(rej)=>{console.error("areaApiService.provincecode error: ", rej);})
    }

    //发货地址 点击市 触发
    changeCity=function(){
        this.startArea = "";
        dataService().Area.getCountry(this.startCity).then((res)=>{
            this.startAreaList=res.list;
        },(rej)=>{console.error("areaApiService.provincecode error: ", rej);})
    }
    //收货地址 点击 省触发
    changeEndProvince=function(){
        this.endCity = "";
        this.endArea = "";
        this.endAreaList = [];
        dataService().Area.getCity(this.endProvince).then((res)=>{
            this.endCityList=res.list;
        },(rej)=>{console.error("areaApiService.provincecode error: ", rej);})
    }
    //收货地址点击市 触发
    changeEndCity=function(){
        this.endArea = "";
        dataService().Area.getCountry(this.endCity).then((res)=>{
            this.endAreaList=res.list;
        },(rej)=>{console.error("areaApiService.provincecode error: ", rej);})
    }
    //选中发货计划人，填充发货人电话
    changeConsignorName = function(){
        if(this.consignorName){
            this.consignorPhone=this.consignorNameList.filter(t=>t.realName==this.consignorName)[0].phoneNumber;
        }else{
            this.consignorPhone = "";
        }
    }

    //选中货物类别
    changeGoodsType=function() {
        this.goodsId = "";
        this.goodsName = "";
    }

    /**搜索货物名称*/
    openGoodsSearch = function(){
        /**移除滚动条 */
        // document.getElementsByTagName("body")[0].setAttribute("style","");
        $('#orderAdd_goodsSearchInput').autocomplete({
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
                $("#orderAdd_goodsSearchInput").val(ui.item.label);
                this.goodsName = ui.item.label;
                this.goodsId = ui.item.value;
                $.closePopup();
                $("#orderAdd_goodsSearchInput").val("");
                return false;
            }
        });
    }

    /**搜索结算单位*/
    openSettleSearch = function(){
        /**移除滚动条 */
        // document.getElementsByTagName("body")[0].setAttribute("style","");
        $('#settleSearchInput').autocomplete({
            source:(request, response)=>{
                dataService().Settle.getSettleList(request.term,0,30).then((res)=>{
                    /**清空*/
                    this.settleNameList = [];
                    res.data.forEach((item) => {
                        this.settleNameList.push({
                            "label":item.name,
                            "value":item.id,
                        });
                    });
                }).then(()=>{
                    response(this.settleNameList);
                });
            },
            open: (event, ui) => {
                $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
            },
            select: (event, ui)=>{
                $("#settleSearchInput").val(ui.item.label);
                this.settle = ui.item.label;
                this.settleId = ui.item.value;
                $.closePopup();
                $("#settleSearchInput").val("");
                return false;
            }
        });
    }

    //判断发货时间是否小于到货时间 
    timeJudge = function(startTime,arrivalTime){
        var dTime = new Date(startTime);
        var endTime = new Date(arrivalTime);
        dTime = dTime.getFullYear() > 0 ? dTime : new Date(Date.parse(startTime.replace(/-/g, "/")));
        endTime = endTime.getFullYear() > 0 ? endTime : new Date(Date.parse(arrivalTime.replace(/-/g, "/")));
        if (dTime < endTime) {
            return true;
        } else {
            $.alert("发货时间必须小于到货时间！");
            return false;
        }
    }

    //发货单新增
    addOrderSave = function (valid){
        if(valid){
            $.confirm("确认发布此订单？", ()=> {
                if(!this.timeJudge(this.startTime,this.arrivalTime)){
                    return;
                }else{
                    var consignorIdSubmit=this.consignorNameList.filter(t=>t.realName==this.consignorName)[0].id;
                    var goodsTypeName = this.goodsTypeList.filter(t=>t.id==this.goodsTypeId)[0].name;
                    var submitChildLine = [{
                        "consignee": this.consignee,
                        "consigneeCompanyId": "",
                        "consigneeCompany": "",
                        "consigneePhone": this.consigneePhone,
                        "clientOrderId": this.clientOrderId,

                        "deliveryTime": this.startTime,
                        "arrivalTime": this.arrivalTime,
                        "goodsId":this.goodsId,
                        "goodsName": this.goodsName,
                        "goodsTypeId": this.goodsTypeId,
                        "goodsTypeName": goodsTypeName,
                        "goodsUnit": this.goodsNumUnit,
                        "mileage": this.mileage,

                        "destination": {
                            "province": this.endProvince,
                            "city": this.endCity,
                            "county": this.endArea,
                            "details": this.endAddressDetail,
                        },
                        "origin": {
                            "province": this.startProvince,
                            "city": this.startCity,
                            "county": this.startArea,
                            "details": this.startAddressDetail,
                        },
                        "viaList": [],
                        "projectId": "",
                        "projectCode": "",
                        "projectMax": "",
                        "projectMaxUnit": "",
                        "projectName": "",
                        "quantityOfGoods": this.goodsNum,
                        "quantityOfGoodsTwo": "",
                        "goodsUnitTwo": "",
                        "tonnageRange": "其他",
                        "settleId": this.settleId,
                        "settle": this.settle,
                        "settlementType": this.settleType,
                        "receivableTotalPrice": this.totalPrice,
                        "receivableSummary": "",
                        "receivablePriceUnit": "",
                        "receivablePrice": null,
                        "includeTax": this.includeTax,
                        "orderNumber": "",
                    }];
                    var addOrderData = {
                        // "cspOrderTime":this.addOrderTime,
                        "urgency": this.urgency,
                        "urgencyUnit": this.urgencyUnit,
                        "clientName": this.clientName,
                        "consignorId": consignorIdSubmit,
                        "content": this.orderContent,
                        "carLength": this.carLength,
                        "carriageWay": this.carriageWay,
                        "vehicleType": this.carType,
                        "loadingEffect": "",
                        "clientOrderId": this.clientOrderId,//销售编号
                        

                        "destination": {
                            "province": this.endProvince,
                            "city": this.endCity,
                            "county": this.endArea,
                            "details": this.endAddressDetail,
                        },
                        "origin": {
                            "province": this.startProvince,
                            "city": this.startCity,
                            "county": this.startArea,
                            "details": this.startAddressDetail,
                        },
                        "viaList": [],
                        "deliveryTime": this.startTime,
                        "arrivalTime": this.arrivalTime,
                        "mileage": this.mileage,
                        "goodsId":this.goodsId,
                        "goodsName": this.goodsName,
                        "goodsTypeId": this.goodsTypeId,
                        "goodsTypeName": goodsTypeName,

                        "quantityOfGoods": this.goodsNum,
                        "goodsUnit": this.goodsNumUnit,
                        "quantityOfGoodsTwo": "",
                        "goodsUnitTwo": "",
                        "tonnageRange": "其他",
                        "childs": submitChildLine,  
                        "remarks": "",
                        "attachmentList": [],
                    }
                    console.log(addOrderData);
                    dataService().CspOrder.addCspOrder(addOrderData).then((res) =>{
                        //console.info(res);
                        if(res.success){
                            $.alert("发布成功！您可点击发布按钮再次下单");
                            // router.go("/WxOrder/WxOrderReleaseManage");
                        }else{
                            $.alert("发布失败！请重新下单");
                        }
                    });
                }
            },() => {
                return;
            });
                
            }
        
        
    }
    //编辑发货单
    editOrder = function (valid){
        if(valid){
            $.confirm("确认编辑此订单？", ()=> {
                if(!this.timeJudge(this.startTime,this.arrivalTime)){
                    return;
                }else{
                    var consignorIdSubmit=this.consignorNameList.filter(t=>t.realName==this.consignorName)[0].id;
                    var goodsTypeName = this.goodsTypeList.filter(t=>t.id==this.goodsTypeId)[0].name;
                    var submitChildLine = [{
                        "consignee": this.consignee,
                        "consigneeCompanyId": "",
                        "consigneeCompany": "",
                        "consigneePhone": this.consigneePhone,
                        "clientOrderId": this.clientOrderId,

                        "deliveryTime": this.startTime,
                        "arrivalTime": this.arrivalTime,
                        "goodsId":this.goodsId,
                        "goodsName": this.goodsName,
                        "goodsTypeId": this.goodsTypeId,
                        "goodsTypeName": goodsTypeName,
                        "goodsUnit": this.goodsNumUnit,
                        "mileage": this.mileage,

                        "destination": {
                            "province": this.endProvince,
                            "city": this.endCity,
                            "county": this.endArea,
                            "details": this.endAddressDetail,
                        },
                        "origin": {
                            "province": this.startProvince,
                            "city": this.startCity,
                            "county": this.startArea,
                            "details": this.startAddressDetail,
                        },
                        "viaList": [],
                        "projectId": "",
                        "projectCode": "",
                        "projectMax": "",
                        "projectMaxUnit": "",
                        "projectName": "",
                        "quantityOfGoods": this.goodsNum,
                        "quantityOfGoodsTwo": "",
                        "goodsUnitTwo": "",
                        "tonnageRange": "其他",
                        "settleId": this.settleId,
                        "settle": this.settle,
                        "settlementType": this.settleType,
                        "receivableTotalPrice": this.totalPrice,
                        "receivableSummary": "",
                        "receivablePriceUnit": "",
                        "receivablePrice": null,
                        "includeTax": this.includeTax,
                        "orderNumber": "",
                    }];
                    var editOrderData = {
                        // "cspOrderTime":this.addOrderTime,
                        'id':this.id,
                        "urgency": this.urgency,
                        "urgencyUnit": this.urgencyUnit,
                        "clientName": this.clientName,
                        "consignorId": consignorIdSubmit,
                        "content": this.orderContent,
                        "carLength": this.carLength,
                        "carriageWay": this.carriageWay,
                        "vehicleType": this.carType,
                        "loadingEffect": "",
                        "clientOrderId": this.clientOrderId,//销售编号
                        "lastModificationTime":this.lastModificationTime,
                        "destination": {
                            "province": this.endProvince,
                            "city": this.endCity,
                            "county": this.endArea,
                            "details": this.endAddressDetail,
                        },
                        "origin": {
                            "province": this.startProvince,
                            "city": this.startCity,
                            "county": this.startArea,
                            "details": this.startAddressDetail,
                        },
                        "viaList": [],
                        "deliveryTime": this.startTime,
                        "arrivalTime": this.arrivalTime,
                        "mileage": this.mileage,
                        "goodsId":this.goodsId,
                        "goodsName": this.goodsName,
                        "goodsTypeId": this.goodsTypeId,
                        "goodsTypeName": goodsTypeName,

                        "quantityOfGoods": this.goodsNum,
                        "goodsUnit": this.goodsNumUnit,
                        "quantityOfGoodsTwo": "",
                        "goodsUnitTwo": "",
                        "tonnageRange": "其他",
                        "childs": submitChildLine,  
                        "remarks": "",
                        "attachmentList": [],
                    }
                    dataService().CspOrder.EditCspOrder(editOrderData).then((res) =>{
                        if(res.success){
                            if(res.data=="0"){
                                $.alert("保存成功！",function(){
                                router.go("/wechat/Wxorder");
                                });
                            }else if(res.data=="1"){
                                $.alert("订单编辑失败,此订单已被受理",function(){
                                router.go("/wechat/Wxorder");
                                });
                            } else if(res.data=="2"){
                                $.alert("子线路信息编辑失败",function(){
                                router.go("/wechat/Wxorder");
                                });
                            } else if(res.data=="3"){
                                $.alert("订单内容已变化，请刷新页面",function(){
                                router.go("/wechat/Wxorder");
                                });
                            }
                        }else{
                            $.alert("保存失败");
                        }
                    });
                }
            },() => {
                return;
            });
                
            }
        
        
    }
    getDistance=function(){
        this.startPoint=$('#wxStartProvince option:selected').text()+ $('#wxStartCity option:selected').text()+$('#wxStartArea option:selected').text();
        this.endPoint=$('#wxEndProvince option:selected').text()+ $('#wxEndCity option:selected').text()+$('#wxEndArea option:selected').text();
        console.log("1",this.startPoint,this.endPoint);
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
    returnBack(){
        // this.$router.go(-1)
        history.back();
    }
    
    package:string = 'vue-typescript';
    repo:string = 'https://github.com/itsFrank/vue-typescript';
   
}
