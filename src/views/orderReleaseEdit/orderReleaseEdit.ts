import { VueComponent,Prop,Watch } from 'vue-typescript'
// import { azureBlob } from '../../service/azure-blob-upload'
import {dataService} from '../../service/dataService'
import * as VueRouter from 'vue-router'
import { aliupload } from '../../service/OssUploadService';

declare var $:any;

Vue.use(VueRouter);
var moment = require('moment');
var VueTables = require('vue-tables');
var router = new VueRouter();

Vue.use(VueTables.client,{
    filterable:false,
    compileTemplates:true,
    pagination: {
     dropdown:false,
    },
    texts:{
     count:'{count} 条'
    }
});

@VueComponent({
    template: require('./orderReleaseEdit.html'),
    style:require('./orderReleaseEdit.scss')
})

export class OrderReleaseEditComponent extends Vue {
    el:'#orderReleaseEdit'
    components:({
        vclienttable:any,
    })

    @Prop
    //v-model初始化
    map;
    orderId="";
    clientOrderId="";
    addOrderTime="";
    urgency="";
    urgencyUnit="";
    clientName="";
    consignorId="";
    consignorPhone="";
    shipPriceContent="";
    startProvince="";
    startCity="";
    startArea="";
    startAddress="";
    endProvince="";
    endCity="";
    endArea="";
    endAddress="";
    addressA:string = "";
    addressB:string = "";
    pointA;
    pointB;
    viaProvince="";
    viaCity="";
    viaArea="";
    viaList = [];
    //提交的中转地list
    submitViaList=[];
    startTime="";
    arrivalTime="";
    mileage = null;
    goodsTypeId="";
    goodsTypeName="";
    goodsId="";
    goodsName="";
    tonRange="";
    goodsNum="";
    goodsNumUnit="";
    goodsNumTwo="";
    goodsNumTwoUnit="";
    receivablePrice=null;
    receivablePriceUnit="";
    receivableTotal=null;
    settleType="";
    includeTax="";
    receivableRemarks="";
    settleId="";
    settle="";
    projectName="";
    projectCode="";
    projectTotal="";
    projectTotalUnit="";
    takeGoodsCompanyName="";
    consignee="";
    consigneePhone="";
    shipOrderId="";
    carType="";
    carLength="";
    carriageWay="";
    loadingEffect="";
    imageLists = [];
    orderRemarks="";
    //新增总线路按钮显示，隐藏
    isAddLine:boolean = true; 
    //新增子线路按钮显示，隐藏
    isAddChildLine:boolean = true;
    /* 上次修改时间 */
    lastModificationTime:string="";
    //下拉列表
    consignorNameList = [];
    provinceList =[];
    startCityList = [];
    startAreaList = [];
    endCityList = [];
    endAreaList = [];
    viaCityList = [];
    viaAreaList = [];
    projectNameList = [];
    goodsTypeList = [];
    goodsNameList = [];
    tonRangeList = [
        {"text": "其他","value": "其他"},
    ];
    priceUnitList = [
        {"text": "元/车","value": "1"},
        {"text": "元/吨","value": "2"},
        {"text": "元/立方", "value": "3"},
        {"text": "元/件","value": "4"},
        {"text": "元/公里","value": "5"},
        {"text": "元/工程","value": "6"},
        {"text": "元/吨*公里","value": "7"},
        {"text": "元/托","value": "8"},
        {"text": "元/台","value": "10"},
        {"text": "价格待定","value": "9"}
    ];
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
    settleList = [];
    projectTotalUnitList=[{"text": "吨","value": "1"},{"text": "立方","value": "2"},{ "text": "车","value": "3"},{"text": "件","value": "4"},{"text": "托","value": "5"},{"text": "台","value": "6"},{"text": "其他","value": "7"}]
    urgencyUnitList=[
        {"text":"天","value":"1"},
        {"text":"小时","value":"2"},
        {"text":"分钟","value":"3"}
    ];
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

    //获取路由中的参数值
    sasUrl:string="";  //获取sasUrl
    id:string;   //所选订单id
    name:string;    //新增方式
    orderLine = {};  //存储总线路信息
    orderChildLine = [];  //存储子线路信息
    consignorName:string="";   //发货计划人
    consigneeCompanyId:string;  //收货单位id
    selChildLineIndex;  //存储编辑选中的子线路的index
    submitImageLists = [];  //发货发布提交的附件列表
    /**用于存放转换后的货物名称列表 */
    goodsList = [];
    myGeo;
    @Prop
    settleNameDropDown = [];   //结算单位
    ready(){
        this.map = new BMap.Map("allmap");
        this.myGeo = new BMap.Geocoder();
        this.addressA = "";
        this.addressB = "";
        this.pointA="";
        this.pointB="";
        this.$on("eventName1",(event)=>{
            this.goodsName = event.name;
            this.goodsId = event.id;
            if(this.goodsId){
                return;
            }else{
                this.searchGoodsName();
            }
        });
        this.$on("eventName2",(event)=>{
            this.settle = event.name;
            this.settleId = event.id;
            this.searchSettleName();
        });

        $('#dataTimeStart').datetimepicker();
        $('#dataTimeEnd').datetimepicker();
        this.id = this.$route.query.id;
        this.name = this.$route.query.name;
        this.submitImageLists.splice(0,this.submitImageLists.length);

        this.orderId="";
        this.clientOrderId="";
        this.addOrderTime="";
        this.urgency="";
        this.urgencyUnit="";
        this.clientName="";
        this.consignorId="";
        this.consignorPhone="";
        this.shipPriceContent="";
        this.startProvince="";
        this.startCity="";
        this.startArea="";
        this.startAddress="";
        this.endProvince="";
        this.endCity="";
        this.endArea="";
        this.endAddress="";
        this.viaProvince="";
        this.viaCity="";
        this.viaArea="";
        this.viaList = [];
        //提交的中转地list
        this.submitViaList=[];
        this.startTime="";
        this.arrivalTime="";
        this.mileage= null;
        this.goodsTypeId="";
        this.goodsTypeName="";
        this.goodsId="";
        this.goodsName="";
        this.tonRange = this.tonRangeList[0].value;
        this.goodsNum="";
        this.goodsNumUnit= "";
        this.goodsNumTwo="";
        this.goodsNumTwoUnit= "";
        this.receivablePrice=null;
        this.receivablePriceUnit="";
        this.receivableTotal=null;
        this.settleType= "";
        this.includeTax=this.includeTaxList[0].value;
        this.receivableRemarks="";
        this.settleId="";
        this.settle="";
        this.projectName="";
        this.projectCode="";
        this.projectTotal="";
        this.projectTotalUnit="";
        this.takeGoodsCompanyName="";
        this.consignee="";
        this.consigneePhone="";
        this.shipOrderId="";
        this.carType="";
        this.carLength="";
        this.carriageWay="";
        this.loadingEffect="";
        this.imageLists = [];
        this.orderRemarks="";
        //总线路，子线路列表清空
        this.tableData = [];
        this.tableData2 = [];
        this.isAddLine = true; 
        this.isAddChildLine = true;
       if(this.name == "edit"){        //复制新增获取订单数据
            dataService().CspOrder.getCspOrder(this.id).then((res)=>{
                this.clientOrderId = res.clientOrderId;
                this.addOrderTime= res.cspOrderTime;
                this.urgency = res.responseTime;
                this.urgencyUnit = res.responseTimeUnit;
                this.clientName = res.clientName;
                this.consignorPhone = res.consignorPhone;
                this.shipPriceContent = res.content;
                this.startProvince = res.originProvince;
                this.startCity = res.originCity;
                this.startArea = res.originCounty;
                this.startAddress = res.originDetails;
                this.endProvince = res.destinationProvince;
                this.endCity = res.destinationCity;
                this.endArea = res.destinationCounty;
                this.endAddress = res.destinationDetails;
                this.getAllAreaStart(res.originProvince,res.originCity,true);
                this.getAllAreaEnd(res.destinationProvince,res.destinationCity,true);
                this.getGoodsTypeList();
                this.goodsTypeId = res.goodsTypeId;
                dataService().CustomerRepresentative.getCustomerList("",0,-1).then((resConsignor)=>{
                    this.consignorNameList = resConsignor.data;
                    this.consignorName = res.consignorName;
                });
                this.viaList = res.viaAddressList;
                // this.setShipAndArriveTime();
                this.startTime = res.deliveryTime;
                this.arrivalTime = res.arrivalTime;
                this.mileage = res.mileage;
                if(this.mileage==""){
                    $('#releaseAdd_mileage').removeClass('pristine').addClass('dirty');
                }
                this.goodsId = res.goodsId;
                this.goodsName = res.goodsName;
                this.searchGoodsName();              
                this.tonRange = res.tonnageRange;
                this.goodsNum = res.quantityOfGoods;
                this.goodsNumUnit = res.goodsUnit;
                this.goodsNumTwo = res.quantityOfGoodsTwo;
                this.goodsNumTwoUnit = res.goodsUnitTwo;
                this.receivablePrice = res.items[0].receivablePrice;
                this.receivablePriceUnit = res.items[0].receivablePriceUnit;
                this.receivableTotal = res.items[0].receivableTotalPrice;
                this.settleType = res.items[0].settlementType;
                this.includeTax = res.items[0].includeTax;
                this.receivableRemarks = res.items[0].receivableSummary;
                this.settleId = res.items[0].settleId;
                this.settle = res.items[0].settle;
                this.searchSettleName();
                this.projectName = res.items[0].projectName;
                this.projectCode = res.items[0].projectCode;
                this.projectTotal = res.items[0].projectMax;
                this.projectTotalUnit = res.items[0].projectMaxUnit;
                this.takeGoodsCompanyName = res.items[0].consigneeCompany;
                this.consignee = res.items[0].consignee;
                this.consigneePhone = res.items[0].consigneePhone;
                this.shipOrderId = res.items[0].orderNumber;
                this.carType = res.vehicleType;
                this.carLength = res.carLength;
                this.carriageWay = res.carriageWay;
                this.loadingEffect = res.loadingEffect;
                this.orderRemarks = res.remarks;
                this.goodsName = res.goodsName;
                this.goodsTypeName = res.goodsTypeName;
                this.lastModificationTime=res.lastModificationTime;
                //总线路列表数据
                var goodsUnit = this.goodsNumUnitList.filter(t=>t.value == res.goodsUnit)[0].text;
                var orderViaList = this.getViaAddress(res.viaAddressList);
                //var orderViaList = res.viaAddressList[0].province + res.viaAddressList[0].city + res.viaAddressList[0].county +"";
                var orderLineList = null;
                var orderLineIndex = this.tableData.length +1;
                orderLineList={
                    shipAddress:res.originAddress,
                    viaAddress:orderViaList,
                    deliveryAddress:res.destinationAddress,
                    shipTime:res.deliveryTime,
                    arriveTime:res.arrivalTime,
                    mileage:res.mileage,
                    goodsTypeName:res.goodsTypeName,
                    goodsName:res.goodsName,
                    goodsNum:res.quantityOfGoods + goodsUnit,
                    edit:{
                        startProvince:this.startProvince,
                        startCity:this.startCity,
                        startArea:this.startArea,
                        startAddress:this.startAddress,
                        endProvince:this.endProvince,
                        endCity:this.endCity,
                        endArea:this.endArea,
                        endAddress:this.endAddress,
                        viaProvince:this.viaProvince,
                        viaCity:this.viaCity,
                        viaArea:this.viaArea,
                        viaList:res.viaAddressList,
                        startTime:this.startTime,
                        arrivalTime:this.arrivalTime,
                        mileage:this.mileage,
                        goodsTypeId:this.goodsTypeId,
                        goodsTypeName:res.goodsTypeName,
                        goodsId:this.goodsId,
                        goodsName:res.goodsName,
                        tonRange:this.tonRange,
                        goodsNum :this.goodsNum,
                        goodsNumUnit:this.goodsNumUnit,
                        goodsNumTwo:this.goodsNumTwo,
                        goodsNumTwoUnit:this.goodsNumTwoUnit,
                    },
                    index:orderLineIndex,
                }
                this.tableData.push(orderLineList);
                //console.info('tableData',this.tableData);
                //子线路列表数据
                var childLineList = res.items;
                var orderChildList=null;
                var childViaList = [];
                childLineList.forEach((item,index)=>{
                    var childGoodsUnit = this.goodsNumUnitList.filter(t=>t.value== item.goodsUnit)[0].text;
                    childViaList = item.viaAddressList;
                    var receivablePrice;
                    if(item.receivablePriceUnit == ""){
                        receivablePrice = "";
                    }else{
                        receivablePrice = item.receivablePrice + this.priceUnitList.filter(t=>t.value==item.receivablePriceUnit)[0].text;            
                    }
                    orderChildList={
                        shipDetail:item.originAddress,
                        viaListData:this.getViaAddress(childViaList),
                        deliverDetail:item.destinationAddress,
                        goodsTypeName:item.goodsTypeName,
                        goodsName:item.goodsName,
                        goodsNum:item.quantityOfGoods + childGoodsUnit,
                        receivablePrice:receivablePrice,
                        receivableTotal: (item.receivableTotalPrice)?item.receivableTotalPrice+'元':null,
                        settle:item.settle,
                        edit:{
                            "consignee": item.consignee,
                            "consigneeCompanyId": "",//传不了
                            "consigneeCompany": item.consigneeCompany,
                            "consigneePhone": item.consigneePhone,

                            "deliveryTime": item.deliveryTime,
                            "arrivalTime": item.arrivalTime,
                            "goodsId":item.goodsId,
                            "goodsName": item.goodsName,
                            "goodsTypeId": item.goodsTypeId,
                            "goodsTypeName": item.goodsTypeName,
                            "goodsUnit": item.goodsUnit,
                            "mileage": item.mileage,

                            "destination": {
                                "province": item.destinationProvince,
                                "city": item.destinationCity,
                                "county": item.destinationCounty,
                                "details": item.destinationDetails,
                            },
                            "origin": {
                                "province": item.originProvince,
                                "city": item.originCity,
                                "county": item.originCounty,
                                "details": item.originDetails,
                            },
                            "viaList": item.viaAddressList,
                            //传不了projectId
                            "projectId": "",
                            "projectCode": item.projectCode,
                            "projectMax": item.projectMax,
                            "projectMaxUnit": item.projectMaxUnit,
                            "projectName": item.projectName,
                            "quantityOfGoods": item.quantityOfGoods,
                            "quantityOfGoodsTwo": item.quantityOfGoodsTwo,
                            "goodsUnitTwo": item.goodsUnitTwo,
                            "tonnageRange": item.tonnageRange,
                            "settleId": item.settleId,
                            "settle": item.settle,
                            "settlementType": item.settlementType,
                            "receivableTotalPrice": item.receivableTotalPrice,
                            "receivableSummary": item.receivableSummary,
                            "receivablePriceUnit": item.receivablePriceUnit,
                            "receivablePrice": item.receivablePrice,
                            "includeTax": item.includeTax,
                            "orderNumber": item.orderNumber
                        },
                        index:index
                    }
                    this.tableData2.push(orderChildList);
                });
                
                    // 获取附件
                this.imageLists=[];
                if(res.attachmentList){
                    res.attachmentList.forEach((item,index)=>{
                        item.key = item.id;
                        item.id = index.toString();
                        item.showStatus = true;
                        item.index=index;
                        this.imageLists.push(item);
                        /* 增加元图片数据 */
                        this.submitImageLists.push(
                            {
                                "id": index.toString(),
                                "fileName": item.name,
                                "submitUrl": item.path,
                                "tag": null
                            }
                        )
                    })
                  
                };
            }).then(()=>{
                dataService().CspOrder.getAddOrderAuthAndSettleIsExis(this.settle).then((res)=>{
                    if(!res.settleIsExis){
                        this.settleId = "";
                        this.settle = "";
                        bootbox.alert("请重新选定结算单位");
                    }
                });
            });
        }
        if(this.name =="edit"){
            this.clientName = JSON.parse(window.sessionStorage.getItem("userInfo")).realName;
            this.getConsignorList();
            this.getGoodsTypeList();
            this.getProvinceList();
            this.searchSettleName();
            this.setShipAndArriveTime();
        }
    }

    /**
     * 发货和到货时间为当前下午4点和次日下午5点
     */
    setShipAndArriveTime = function() {
        let time = new Date();
        let defaultTime = new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1, 17, 0);
        this.startTime = String(this.transformTime(new Date(time.setHours(16, 0, 0)), "yyyy/MM/dd HH:mm"));
        this.arrivalTime = String(this.transformTime(defaultTime, "yyyy/MM/dd HH:mm"));
    }

    /**
     * 转换时间
     */
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
    
    //总线路货物列表
    columns=['shipAddress','viaAddress','deliveryAddress','shipTime','arriveTime','mileage','goodsTypeName','goodsName','goodsNum','operation']
    tableData= []
    options= {
        texts:{
            noResults:'暂无数据',
        },
        headings:{
            shipAddress:"发货地址",
            viaAddress:"中转地",
            deliveryAddress:"送货地址",
            shipTime:"发货时间",
            arriveTime:"到货时间",
            mileage:"里程数",
            goodsTypeName:"货物类别",
            goodsName:"货物名称",
            goodsNum:"货物数量",
            operation:'操作'
        },
        templates: {
            operation: function(row) {
            return `<a data-toggle="modal" data-target="#orderTotal" title="编辑" class="glyphicon glyphicon-edit m-l-xs  primary text-info" title='编辑' @click="$parent.editOrderLine()"></a> 
            <a class='glyphicon glyphicon-trash m-l-xs primary text-info' title='删除' href='javascript:void(0);' @click='$parent.deleteOrderLine()'></a>`
            }
        },
    };


    //子线路货物列表
    columns2=['shipDetail','viaListData','deliverDetail','goodsTypeName','goodsName','goodsNum','receivablePrice','receivableTotal','settle','operation']
    tableData2= [] 
    options2= {
        texts:{
            noResults:'暂无数据',
        },
        headings:{
            shipDetail:"发货地址",
            viaListData:"中转地",
            deliverDetail:"送货地址",
            goodsTypeName:"货物类别",
            goodsName:"货物名称",
            goodsNum:"货物数量",
            receivablePrice:"应收单价",
            receivableTotal:"应收总价",
            settle:"结算单位",
            operation:'操作'
        },
        templates: {
            operation: function(row) {
            return `<a data-toggle="modal" data-target="#orderTotal" title="编辑" class="glyphicon glyphicon-edit m-l-xs  primary text-info" title='编辑' @click="$parent.editChildOrderLine(${row.index})"></a>
                <a class='glyphicon glyphicon-trash m-l-xs primary text-info' title='删除' href='javascript:void(0);' @click='$parent.deleteChildOrderLine(${row.index})'></a>`
            }
        },
    };
    sortable=[];

    // sasUrl:string='https://sinostoragedev.blob.core.chinacloudapi.cn/avatar-container?sv=2016-05-31&sr=c&sig=nUNfvCUrZ%2F%2Bjuc%2Fesjjl0tXw7nY4E4JJJ8jD7PBSUjI%3D&st=2017-01-26T06%3A19%3A15Z&se=2017-01-27T06%3A24%3A15Z&sp=racwl';
    
    object:{default:string} = {default: 'Default object property!'}; //objects as default values don't need to be wrapped into functions
    imageColumns =['image','name','size','rate','state','operation'];
    imageOptions= {
        texts:{
            noResults:'暂无数据',
        },
        headings:{
            image:'图片',
            name:"名称",
            size:"大小",
            rate:"进度",
            state:"状态",
            operation:'操作'
        },
        templates: {
            operation: (row)=> {
                var oldOprationTemple =`<button type="button" id="downloadImage" class="btn btn-primary btn-xs" @click='$parent.downloadImage(${row.id})' >
                        <span class="fa fa-cloud-download"></span> 下载</button>
                        <button type="button" class="btn btn-danger btn-xs" @click='$parent.deleteImage(${row.id})'>
                        <span class="glyphicon glyphicon-trash"></span> 删除</button>`
                var oprationTemple =`<button type="button" id="${row.id}uploadDisabledStatus" class="btn btn-success btn-xs" @click='$parent.uploadImage(${row.id})' >
                        <span class="glyphicon glyphicon-upload"></span> 上传</button>
                        <button type="button" class="btn btn-danger btn-xs" @click='$parent.deleteImage(${row.id})'>
                        <span class="glyphicon glyphicon-trash"></span> 删除</button>`
                    if(row.showStatus){
                        return oldOprationTemple;
                    } else{
                        if(this.submitImageLists.length>0){
                            if(this.submitImageLists.filter(t=>t.id==row.id).length>0){
                                if(this.submitImageLists.filter(t=>t.id == row.id)[0].submitUrl){
                                    return `<button type="button" id="${row.id}uploadDisabledStatus" class="btn btn-success btn-xs" @click='$parent.uploadImage(${row.id})' disabled="disabled">
                                            <span class="glyphicon glyphicon-upload"></span> 上传</button>
                                            <button type="button" class="btn btn-danger btn-xs" @click='$parent.deleteImage(${row.id})'>
                                            <span class="glyphicon glyphicon-trash"></span> 删除</button>`
                                }
                            }else{
                                return oprationTemple;
                            }
                        }else{
                            return oprationTemple;
                        }
                    } 
              
            },
            image:function(row){
                return `<div class="img-thumbnail" style="position:relative">
                            <img class="img-responsive" src="${row.path}" style="max-width:266px;" />
                        </div>`
            },
            state:(row)=>{
                var oldOprationTemple = `<span class='glyphicon glyphicon-ok text-success' id="${row.id}"  title='状态显示'></span>`;
                var stateTemple = `<span class='glyphicon glyphicon-remove text-danger' id="${row.id}"  title='状态显示'></span>`;
                if(row.showStatus){
                    return oldOprationTemple;
                } else{
                if(this.submitImageLists.length>0){
                    if(this.submitImageLists.filter(t=>t.id==row.id).length>0){
                        if(this.submitImageLists.filter(t=>t.id==row.id)[0].submitUrl){
                            return `<span class='glyphicon glyphicon-ok text-success' id="${row.id}"  title='状态显示'></span>`;
                        }
                    }else{
                        return stateTemple;
                    }
                }else{
                    return stateTemple;
                }
              }
            },
            rate:(row)=>{
                var oldOprationTemple = `<div class="progress"><div class="progress-bar progress-bar-uploadFile" id='${row.id}progressBar' role="progressbar" style="width:100.00%"></div></div>`;
                var rateTemple = `<div class="progress"><div class="progress-bar progress-bar-uploadFile" id='${row.id}progressBar' role="progressbar"></div></div>`;
                if(row.showStatus){
                    return oldOprationTemple;
                } else{
                if(this.submitImageLists.length>0){
                    if(this.submitImageLists.filter(t=>t.id==row.id).length>0){
                        if(this.submitImageLists.filter(t=>t.id==row.id)[0].submitUrl){
                            return `<div class="progress"><div class="progress-bar progress-bar-uploadFile" id='${row.id}progressBar' role="progressbar" style="width:100.00%"></div></div>`;
                        }
                    }else{
                        return rateTemple;
                    }
                }else{
                    return rateTemple;
                }
            }
            },
        },
    };
        //del img
    deleteImage=function(index){
        var itemDel = this.imageLists.filter(t => t.id == index);
        var itemSubDel = this.submitImageLists.filter(t => t.id == index);
        this.imageLists.$remove(itemDel[0]);
        this.submitImageLists.$remove(itemSubDel[0]);
        if(this.imageLists.length<=0){
            $('#orderAdd_uploadAll').attr('disabled', 'true');
        }
    }
     
    //下载附件
    downloadImage = function (index) {
        var url = this.imageLists.filter(t => t.id == index)[0].key;
        window.location.href = dataService().baseUrl + "Attachment/getAttachment/" + url;
    }
    //uploade img
    uploadImage=function(id){
        // $(id+'uploadDisabledStatus').attr("disabled","disabled");
        var uploadDisabledStatus = $("#"+id+'uploadDisabledStatus').attr('disabled');
        if(uploadDisabledStatus!=='disabled'){
            var submitUrl='';
            var itemUpload =this.imageLists.filter(t => t.id == id);

            var today = new Date();
            var formatDate=moment().format('YYYYMMDDHHmm');
            var rr = itemUpload[0].name.indexOf(".");
            var nameimg = formatDate + Math.round(Math.random() * 10000).toString() + itemUpload[0].name.substring(rr);
            /** 禁用上传按钮*/
            $("#" + itemUpload[0].id + 'uploadDisabledStatus').attr('disabled', 'disabled');
            /**调用上传方法 */
            aliupload().upload(itemUpload[0], nameimg, (res) => {
                
                if (res.res.statusCode == "200") {
                    /**图片path */
                    var imageUriSubmit = res.res.requestUrls[0].split('?')[0];
                    itemUpload[0].fileName = nameimg;
                    itemUpload[0].submitUrl = imageUriSubmit;
                    $("#" + itemUpload[0].id + 'progressBar').attr({ style: "width:" + "100" + '%' });
                    $("#" + itemUpload[0].id).attr("class", "glyphicon glyphicon-ok text-success");
                    
                    this.submitImageLists.push(itemUpload[0]);
                }else{
                    $("#" + itemUpload[0].id + 'uploadDisabledStatus').removeAttr("disabled");
                }
                // console.log(res);
            });
        }
    }
    //全部上传
    attachmentUploader=()=>{
        for(var i=0;i<this.imageLists.length;i++){
            this.uploadImage(this.imageLists[i].id);
        }
        
    }

    //选择图片文件按钮触发
    onFileChange=function(e) {
        //console.info('testImageUpload:',e);
        var files = e.target.files;
        if (files.length > 0) {
            for(var i=0;i<files.length;i++){
                var selectedFileVehicleLicense = files[i];
                var imageName=Math.round(Math.random() * 10000).toString();
                var objUrl = this.getObjectURL(files[i]);;
                files[i].id=imageName;
                files[i].path=objUrl;
                this.imageLists.push(files[i]);
                if(this.imageLists.length>0){
                    $('#orderAdd_uploadAll').removeAttr('disabled');
                }
            }
        }//end if 是否已选择文件控制
        $("#releaseAdd_upLoader").val("");   //清空文件地址，文件地址相同则不作任何操作
    }
    //获取发货计划人列表
    getConsignorList = function(){
        dataService().CustomerRepresentative.getCustomerList("",0,-1).then((res)=>{
            this.consignorNameList = res.data;
        });
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

    //获取货物类别列表
    getGoodsTypeList = function(){
            dataService().GoodsType.getDoodsTypeList("",0,-1).then((res)=>{
            this.goodsTypeList=res.data;
        });
    }
    //获取工程名称列表
    getProjectNameList = function(){
        dataService().Project.getProjectList(this.projectName,0,-1).then((res)=>{
            this.projectNameList = res.list;
        });
    }

    /**货物名称模糊搜索 */
    searchGoodsName = function(){
        this.goodsList = [];
        if(this.goodsTypeId == ""){
            return;
        }
        dataService().Goods.getDoodsList(this.goodsTypeId,0,30,this.goodsName).then((res)=>{
            this.goodsList = res.data
        })
    }
    //结算单位模糊查询
    searchSettleName = function(){
        this.settleNameDropDown = [];
        dataService().Settle.getSettleList(this.settle,0,30).then((res)=>{
            this.settleNameDropDown = res.data;
        })
    }

    /**
     * change事件
     */
    //选中发货计划人，填充发货人电话
    changeConsignorName = function(){
        if(this.consignorName){
            this.consignorPhone=this.consignorNameList.filter(t=>t.realName==this.consignorName)[0].phoneNumber;
        }else{
            this.consignorPhone = "";
        }
    }
    //选中货物类别 获取货物列表
    changeGoodsType=function() {
        this.goodsId = "";
        this.goodsName = "";
        this.$refs.goodsname.changeStyle()  //调用组件的方法，选择其他货物类别时，货物名称为红框
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

    //发货地址 点击省 触发
    changeStarProvince=function(){
        this.startCity = "";
        this.startArea = "";
        this.startAreaList = [];
        dataService().Area.getCity(this.startProvince).then((res)=>{
            this.startCityList=res.list;
        },(rej)=>{
        })
    }

    //发货地址 点击市 触发
    changeCity=function(){
        this.startArea = "";
        dataService().Area.getCountry(this.startCity).then((res)=>{
            this.startAreaList=res.list;
        },(rej)=>{
        })
    }
    //收货地址 点击 省触发
    changeEndProvince=function(){
        this.endCity = "";
        this.endArea = "";
        this.endAreaList = [];
        dataService().Area.getCity(this.endProvince).then((res)=>{
            this.endCityList=res.list;
        },(rej)=>{
        })
    }
    //收货地址点击市 触发
    changeEndCity=function(){
        this.endArea = "";
        dataService().Area.getCountry(this.endCity).then((res)=>{
            this.endAreaList=res.list;
        },(rej)=>{
        })
    }

    /**
     * 获取里程数
     */
    getMileage(){
        this.addressA = $('#releaseAdd_startProvince option:selected').text()+ $('#releaseAdd_startCity option:selected').text()+$('#releaseAdd_startArea option:selected').text();
        this.addressB = $('#releaseAdd_endProvince option:selected').text()+ $('#releaseAdd_endCity option:selected').text()+$('#releaseAdd_endArea option:selected').text();
        if (this.addressA.indexOf('请选择') == -1 && this.addressB.indexOf('请选择') == -1) {
            if(this.addressA == this.addressB){
                this.mileage=5;
            }else{
                this.myGeo.getPoint(this.addressA,(point)=>{
                    this.pointA = point;
                    if(this.pointB){
                        this.mileage = Math.round(this.map.getDistance(this.pointA, this.pointB) / 1000);
                    }
                });
                let addressB=this.addressB
                this.myGeo.getPoint(addressB,(point)=>{
                    this.pointB = point;
                    if(this.pointA){
                        this.mileage = Math.round(this.map.getDistance(this.pointA, this.pointB) / 1000);
                    }
    
                });
            }
            
        }   

    }
    @Watch('[startCityList,endCityList,endAreaList,startAreaList,goodsTypeList]')
    changeValid(){
        //验证
        this.validFun();
    }
    validFun=function() {
        var self = this;
        this.$validate('',true,  ()=> {
            if (this.$validation.valid) {
                // console.info('self.$validation.valid',self.$validation.valid);
            }
        });
    }

    //中转地点击省触发
    changeViaProvince = function(){
        this.viaCity = "";
        this.viaArea = "";
        this.viaAreaList = [];
        dataService().Area.getCity(this.viaProvince).then((res)=>{
            this.viaCityList=res.list;
        },(rej)=>{})
    }

    //中转地点击市 触发
    changeViaCity=function(){
        dataService().Area.getCountry(this.viaCity).then((res)=>{
            this.viaAreaList=res.list;
        },(rej)=>{console.error("areaApiService.provincecode error: ", rej);})
    }
    //获取中转地
    getViaAddress=function(viaList){
        var addre="";
        if(!viaList){
            return addre;
        }
        if(viaList.length > 1){
            for(var i=0;i<viaList.length;i++){
                addre=addre+viaList[i].province+viaList[i].city+viaList[i].county+";";
            };
        }else if(viaList.length == 1){
            addre=addre+viaList[0].province+viaList[0].city+viaList[0].county;
        }
        return addre;
    }
    //添加中转地
    addVia = function(){
        if (this.viaProvince == "" || this.viaCity == "" || this.viaArea == "") {
            bootbox.alert("请填写完整的中转地!");
            return;
        }

        let index = this.viaList.length + 1;
        var viaProvince =this.provinceList.filter(t=>t.value==this.viaProvince)[0].text;
        var viaCity = this.viaCityList.filter(t=>t.value==this.viaCity)[0].text;
        var viaArea =this.viaAreaList.filter(t=>t.value==this.viaArea)[0].text;
        this.viaList.push({
            province:  viaProvince,
            city: viaCity,
            county: viaArea,
            index:index++
        });
        this.submitViaList.push({
            province:viaProvince,
            city:viaCity,
            county:viaArea,
            details:''
        });
    }

    /**
     * 删除中转地
     */
    deleteVia = function(index: number){
        // this.viaList.splice(index - 1, 1);
        var itemDel = this.viaList.filter(t => t.index == index);
        this.viaList.$remove(itemDel[0]);
    }
    //新增总线路
    addOrderLine = function(totalValide){
        // console.info('this.$validation:',this.$validation);
        if(totalValide){
            if (this.tableData.length > 0) {
                bootbox.alert("只能添加一条总线路信息");
                return;
            }
            this.addLine();
        }    
    }

    addLine = function(){
        if(!this.timeJudge(this.startTime,this.arrivalTime)){
            return;
        }else {
            if(this.goodsId == undefined || this.goodsId == ""){
                bootbox.alert("请选择货物名称！");
            }else{
            var originAddress = this.provinceList.filter(t => t.value == this.startProvince)[0].text+this.startCityList.filter(t=>t.value==this.startCity)[0].text+this.startAreaList.filter(t => t.value == this.startArea)[0].text+this.startAddress;
            var via = [];
            this.viaList.forEach((item)=>{
                via.push(
                    item.province + item.city + item.county
                ); 
            });
            var destinationAddress = this.provinceList.filter(t=>t.value==this.endProvince)[0].text+this.endCityList.filter(t=>t.value==this.endCity)[0].text+this.endAreaList.filter(t=>t.value==this.endArea)[0].text+this.endAddress;
            var goodsTypeName = this.goodsTypeList.filter(t=>t.id==this.goodsTypeId)[0].name; 
            var goodsNum = this.goodsNum + this.goodsNumUnitList.filter(t=>t.value==this.goodsNumUnit)[0].text;
            var indexList=this.tableData.length;
            this.orderLine = {
                "shipAddress": originAddress,
                "viaAddress": via,
                "deliveryAddress": destinationAddress,
                "shipTime": this.startTime,
                "arriveTime": this.arrivalTime,
                "mileage": this.mileage,
                "goodsTypeName": goodsTypeName,
                "goodsName": this.goodsName,
                "goodsNum": goodsNum,
                "edit":{
                    startProvince:this.startProvince,
                    startCity:this.startCity,
                    startArea:this.startArea,
                    startAddress:this.startAddress,
                    endProvince:this.endProvince,
                    endCity:this.endCity,
                    endArea:this.endArea,
                    endAddress:this.endAddress,
                    viaList:[],
                    startTime:this.startTime,
                    arrivalTime:this.arrivalTime,
                    mileage:this.mileage,
                    goodsTypeId:this.goodsTypeId,
                    goodsTypeName:goodsTypeName,
                    goodsId:this.goodsId,
                    goodsName:this.goodsName,
                    tonRange:this.tonRange,
                    goodsNum :this.goodsNum,
                    goodsNumUnit:this.goodsNumUnit,
                    goodsNumTwo:this.goodsNumTwo,
                    goodsNumTwoUnit:this.goodsNumTwoUnit,
                },
            };
            this.orderLine.edit.viaList=this.orderLine.edit.viaList.concat(this.viaList);
            this.tableData.push(this.orderLine);
            }
        }
    }

    //编辑总线路
    editOrderLine = function(){
        this.isAddLine = false;
        var ol = this.tableData[0].edit;
        //console.info(ol);
        this.startProvince = ol.startProvince;
        this.getStartCityList(this.startProvince);
        this.startCity = ol.startCity;
        this.getStartAreaList(this.startCity);
        this.startArea = ol.startArea;
        this.startAddress = ol.startAddress;
        this.endProvince = ol.endProvince;
        this.getEndCityList(this.endProvince);
        this.endCity = ol.endCity;
        this.getEndAreaList(this.endCity);
        this.endArea = ol.endArea;
        this.endAddress = ol.endAddress;
        var orederViaLine = ol.viaList;
        this.viaList=orederViaLine;
        this.startTime = ol.startTime;
        this.arrivalTime = ol.arrivalTime;
        this.mileage = ol.mileage;
        this.goodsTypeId = ol.goodsTypeId;
        this.goodsId = ol.goodsId;
        this.goodsName = ol.goodsName;
        this.searchGoodsName();
        this.tonRange = ol.tonRange;
        this.goodsNum = ol.goodsNum;
        this.goodsNumUnit = ol.goodsNumUnit;
        this.goodsNumTwo = ol.goodsNumTwo;
        this.goodsNumTwoUnit = ol.goodsNumTwoUnit;
    }
    //删除总线路
    deleteOrderLine = function(){
        //本地删除总线路
        this.tableData = [];
        this.orderLine={};
        this.isAddLine = true;
    }

    //保存总线路
    saveOrderLine = function(totalValidate){
        if(totalValidate){
            this.tableData = [];
            this.addLine();
            this.isAddLine = true;
        }
    }
    //新增子线路
    addChildOrderLine = function(childValide){
        if(childValide){
            if (this.settleId == "" || this.settleId == undefined) {
                bootbox.alert("请选择结算单位!");
                return;
            }
            if (this.goodsId == "") {
                bootbox.alert("请填写货物名称!"); 
                return;
            };
            this.addChildLine();
        }
    }
    getMaxIndex=function(list){
        var max=0;
        for(var i=0;i<list.length;i++){
            if(max<list[i].index){
                max=list[i].index
            }
        };
        return max;
    }
    addChildLine = function(){
        if(!this.timeJudge(this.startTime,this.arrivalTime)){
            return;
        }else{
            var originAddress = this.provinceList.filter(t => t.value == this.startProvince)[0].text+this.startCityList.filter(t=>t.value==this.startCity)[0].text+this.startAreaList.filter(t => t.value == this.startArea)[0].text+this.startAddress;
            //var via = this.provinceList.filter(t=>t.value==this.viaProvince)[0].text+this.viaCityList.filter(t=>t.value==this.viaCity)[0].text+this.viaAreaList.filter(t=>t.value==this.viaArea)[0].text + "";
            var via = [];
            this.viaList.forEach((item)=>{
                via.push(
                    item.province + item.city + item.county
                ); 
            });
            var destinationAddress = this.provinceList.filter(t=>t.value==this.endProvince)[0].text+this.endCityList.filter(t=>t.value==this.endCity)[0].text+this.endAreaList.filter(t=>t.value==this.endArea)[0].text+this.endAddress;
            var goodsTypeName = this.goodsTypeList.filter(t=>t.id==this.goodsTypeId)[0].name;
            var goodsNum = this.goodsNum + this.goodsNumUnitList.filter(t=>t.value==this.goodsNumUnit)[0].text;
            var receivablePrice;
            if(this.receivablePrice && this.receivablePriceUnit !== ""){
                receivablePrice = this.receivablePrice + this.priceUnitList.filter(t=>t.value==this.receivablePriceUnit)[0].text;            
            }else if(!this.receivablePrice && this.receivablePriceUnit == ""){
                receivablePrice = "";
            }else if(!this.receivablePrice && this.receivablePriceUnit !==""){
                receivablePrice = this.priceUnitList.filter(t=>t.value==this.receivablePriceUnit)[0].text;
            }else{
                receivablePrice = this.receivablePrice;
            }
            var receivableTotal;
            if(this.receivableTotal == null || this.receivableTotal == "" || this.receivableTotal == undefined){
                receivableTotal = "";
            }else{
                receivableTotal = this.receivableTotal+'元';
            }
            var index = 0;
            if(this.tableData2.length==0){
                index=0;
            }else{
                index=this.getMaxIndex(this.tableData2)+1;
            }
            this.submitViaList=[];
            this.viaList.forEach((item)=>{
                this.submitViaList.push({
                    province:item.province,
                    city:item.city,
                    county:item.county,
                    details:''
                });
            });

            this.tableData2.push({
                'shipDetail':originAddress,
                'viaListData':via,
                'deliverDetail':destinationAddress,
                'goodsTypeName':goodsTypeName,
                'goodsName':this.goodsName,
                'goodsNum':goodsNum,
                'receivablePrice':receivablePrice,
                'receivableTotal':receivableTotal,
                'settle':this.settle,
                'edit':{
                    "consignee": this.consignee,
                    "consigneeCompanyId": "",//传不了
                    "consigneeCompany": this.takeGoodsCompanyName,
                    "consigneePhone": this.consigneePhone,

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
                        "details": this.endAddress,
                    },
                    "origin": {
                        "province": this.startProvince,
                        "city": this.startCity,
                        "county": this.startArea,
                        "details": this.startAddress,
                    },
                    "viaList": [].concat(this.submitViaList),
                    //传不了projectId
                    "projectId": "",
                    "projectCode": this.projectCode,
                    "projectMax": this.projectTotal,
                    "projectMaxUnit": this.projectTotalUnit,
                    "projectName": this.projectName,
                    "quantityOfGoods": this.goodsNum,
                    "quantityOfGoodsTwo": this.goodsNumTwo,
                    "goodsUnitTwo": this.goodsNumTwoUnit,
                    "tonnageRange": this.tonRange,
                    "settleId": this.settleId,
                    "settle": this.settle,
                    "settlementType": this.settleType,
                    "receivableTotalPrice": this.receivableTotal,
                    "receivableSummary": this.receivableRemarks,
                    "receivablePriceUnit": this.receivablePriceUnit,
                    "receivablePrice": this.receivablePrice,
                    "includeTax": this.includeTax,
                    "orderNumber": this.shipOrderId
                },
                index:index,
            });
            this.orderChildLine = this.tableData2;
            // this.tableData2 = this.orderChildLine;
        }
    }
    //编辑子线路
    editChildOrderLine = function(index){
        //bootbox.alert("编辑子线路"+index)
        this.viaList = [];
        this.isAddChildLine = false;
        this.selChildLineIndex = index;
        this.tableData2.forEach((itemC)=>{
            if(index == itemC.index){
                this.startProvince = itemC.edit.origin.province;
                this.getStartCityList(this.startProvince);
                this.startCity = itemC.edit.origin.city;
                this.getStartAreaList(this.startCity);
                this.startArea = itemC.edit.origin.county;
                this.startAddress = itemC.edit.origin.details;

                this.endProvince = itemC.edit.destination.province;
                this.getEndCityList(this.endProvince);
                this.endCity = itemC.edit.destination.city;
                this.getEndAreaList(this.endCity);
                this.endArea = itemC.edit.destination.county;
                this.endAddress = itemC.edit.destination.details;

                // this.viaList = itemC.edit.viaList;
                this.startTime = itemC.edit.deliveryTime;
                this.arrivalTime = itemC.edit.arrivalTime;
                this.mileage = itemC.edit.mileage;
                this.goodsTypeId = itemC.edit.goodsTypeId;
                this.goodsId = itemC.edit.goodsId;
                this.goodsName = itemC.edit.goodsName;
                this.searchGoodsName();
                this.tonRange = itemC.edit.tonnageRange;
                this.goodsNum = itemC.edit.quantityOfGoods;
                this.goodsNumUnit = itemC.edit.goodsUnit;
                this.goodsNumTwo = itemC.edit.quantityOfGoodsTwo;
                this.goodsNumTwoUnit = itemC.edit.goodsUnitTwo;
                this.receivablePrice = itemC.edit.receivablePrice;
                this.receivablePriceUnit = itemC.edit.receivablePriceUnit;
                this.receivableTotal = itemC.edit.receivableTotalPrice;
                this.settleType = itemC.edit.settlementType;
                this.includeTax = itemC.edit.includeTax;
                this.receivableRemarks = itemC.edit.receivableSummary;
                this.settleId = itemC.edit.settleId;
                this.settle = itemC.edit.settle;
                this.projectName = itemC.edit.projectName;
                this.projectCode = itemC.edit.projectCode;
                this.projectTotal = itemC.edit.projectMax;
                this.projectTotalUnit = itemC.edit.projectMaxUnit;
                this.takeGoodsCompanyName = itemC.edit.consigneeCompany;
                this.consignee = itemC.edit.consignee;
                this.consigneePhone = itemC.edit.consigneePhone;
                this.shipOrderId = itemC.edit.orderNumber;
                // this.viaList = [];
                this.viaList = [].concat(itemC.edit.viaList);
            }
            
            
        });
    }

    //保存子线路
    saveChildOrderLine = function(childValide){
        if(childValide){
            if(!this.timeJudge(this.startTime,this.arrivalTime)){
                return;
            }else{
                this.tableData2.forEach((item)=>{
                    if(this.selChildLineIndex == item.index){
                        var index=item.index;
                        //bootbox.alert("保存子线路到"+item.index)
                        var td=item;
                        
                        var originAddress = this.provinceList.filter(t => t.value == this.startProvince)[0].text+this.startCityList.filter(t=>t.value==this.startCity)[0].text+this.startAreaList.filter(t => t.value == this.startArea)[0].text+this.startAddress;
                        var via = [];
                        this.viaList.forEach((item)=>{
                            via.push(
                                item.province + item.city + item.county
                            ); 
                        });
                        this.submitViaList=[];
                        this.viaList.forEach((item)=>{
                            this.submitViaList.push({
                                province:item.province,
                                city:item.city,
                                county:item.county,
                                details:''
                            })

                        });
                        //var via = this.provinceList.filter(t=>t.value==this.viaProvince)[0].text+this.viaCityList.filter(t=>t.value==this.viaCity)[0].text+this.viaAreaList.filter(t=>t.value==this.viaArea)[0].text + "";
                        var destinationAddress = this.provinceList.filter(t=>t.value==this.endProvince)[0].text+this.endCityList.filter(t=>t.value==this.endCity)[0].text+this.endAreaList.filter(t=>t.value==this.endArea)[0].text+this.endAddress;
                        var goodsTypeName = this.goodsTypeList.filter(t=>t.id==this.goodsTypeId)[0].name;
                        // var goodsName = this.goodsNameList.filter(t=>t.id==this.goodsId)[0].name;
                        var goodsNum = this.goodsNum + this.goodsNumUnitList.filter(t=>t.value==this.goodsNumUnit)[0].text;
                        var receivablePrice;
                        if(this.receivablePriceUnit == ""){
                            receivablePrice = "";
                        }else{
                            receivablePrice = this.receivablePrice + this.priceUnitList.filter(t=>t.value==this.receivablePriceUnit)[0].text;            
                        }
                        var receivableTotal;
                        if(this.receivableTotal == null || this.receivableTotal == "" || this.receivableTotal == undefined){
                            receivableTotal = "";
                        }else{
                            receivableTotal = this.receivableTotal+'元';
                        }
                        td.shipDetail=originAddress;
                        td.viaListData=via;
                        td.deliverDetail=destinationAddress;
                        td.goodsTypeName=goodsTypeName;
                        td.goodsName=this.goodsName;
                        td.goodsNum=goodsNum;
                        td.receivablePrice=receivablePrice;
                        td.receivableTotal=receivableTotal;
                        td.settle=this.settle;
                        td.edit.consignee= this.consignee;
                        td.edit.consigneeCompanyId= "";//传不了
                        td.edit.consigneeCompany= this.takeGoodsCompanyName;
                        td.edit.consigneePhone= this.consigneePhone;

                        td.edit.deliveryTime= this.startTime;
                        td.edit.arrivalTime= this.arrivalTime;
                        td.edit.goodsId=this.goodsId;
                        td.edit.goodsName= this.goodsName;
                        td.edit.goodsTypeId= this.goodsTypeId;
                        td.edit.goodsTypeName= goodsTypeName;
                        td.edit.goodsUnit= this.goodsNumUnit;
                        td.edit.mileage= this.mileage;

                        td.edit.origin.province= this.startProvince;
                        td.edit.origin.city= this.startCity;
                        td.edit.origin.county=this.startArea;
                        td.edit.origin.details= this.startAddress;
                        td.edit.destination.province= this.endProvince;
                        td.edit.destination.city= this.endCity;
                        td.edit.destination.county= this.endArea;
                        td.edit.destination.details= this.endAddress;
                        td.edit.viaList=[];
                        td.edit.viaList= [].concat(this.submitViaList);
                        td.edit.projectId= "";
                        td.edit.projectCode=this.projectCode;
                        td.edit.projectMax= this.projectTotal;
                        td.edit.projectMaxUnit= this.projectTotalUnit;
                        td.edit.projectName= this.projectName;
                        td.edit.quantityOfGoods= this.goodsNum;
                        td.edit.quantityOfGoodsTwo= this.goodsNumTwo;
                        td.edit.goodsUnitTwo= this.goodsNumTwoUnit;
                        td.edit.tonnageRange= this.tonRange;
                        td.edit.settleId= this.settleId;
                        td.edit.settle= this.settle;
                        td.edit.settlementType= this.settleType;
                        td.edit.receivableTotalPrice= this.receivableTotal;
                        td.edit.receivableSummary= this.receivableRemarks;
                        td.edit.receivablePriceUnit= this.receivablePriceUnit;
                        td.edit.receivablePrice= this.receivablePrice;
                        td.edit.includeTax= this.includeTax;
                        td.edit.orderNumber= this.shipOrderId;
                        // td.index=item.index;
                    }
                });
                this.isAddChildLine = true;
            }
            
        }
    }   

    //删除子线路
    deleteChildOrderLine = function(index){
        //本地删除子线路
        //bootbox.alert("删除子线路"+index)
        var itemDel = this.tableData2.filter(t => t.index == index)
        this.tableData2.$remove(itemDel[0]);

        // this.tableData2.forEach((itemC,indexC)=>{
        //     itemC.index=indexC
        // });
        this.orderChildLine=this.tableData2
        this.isAddChildLine = true;
        // var orderChildLine=this.orderChildLine.filter(t=>t.index==index);//attention 这里直接把this.orderChildLine=this.tableData2就可以了吧
        // this.orderChildLine.$remove(orderChildLine[0]);
    }
    //判断发货时间是否小于到货时间
    timeJudge = function(startTime,arrivalTime){
        var startDate = new Date(startTime);
        var arrivalDate = new Date(arrivalTime);
        if(arrivalDate.getTime() <= startDate.getTime()){
            bootbox.alert("发货时间必须小于到货时间");
            return false;
        }else{
            return true;
        }
    }
    //发货发布
    editOrderSave = function(isValid){
        if(isValid){
            bootbox.confirm("确定编辑此单？",(result)=>{
                if(result){
                    if(this.tableData.length == 0){
                        bootbox.alert("必须存在一条总线路");
                        return;
                    }else if(this.tableData2.length == 0){
                        bootbox.alert("必须存在一条子线路");
                        return;
                    }else{
                        var submitChildLine=[];
                        this.tableData2.forEach((index,item)=>{
                            submitChildLine.push(index.edit)
                        });
                        var consignorIdSubmit=this.consignorNameList.filter(t=>t.realName==this.consignorName)[0].id
                        var submitUploadedFiles=[];
                        this.submitImageLists.forEach((item)=>{
                            submitUploadedFiles.push(
                                {
                                    "id": null,
                                    "name": item.fileName,
                                    "path": item.submitUrl,
                                    "tag": null
                                }
                            )
                        })
                        var editOrderData = {
                            // "cspOrderTime":this.addOrderTime,
                            'id':this.id,
                            "urgency": this.urgency,
                            "urgencyUnit": this.urgencyUnit,
                            "clientName": this.clientName,
                            "consignorId": consignorIdSubmit,
                            "content": this.shipPriceContent,
                            "carLength": this.carLength,
                            "carriageWay": this.carriageWay,
                            "vehicleType": this.carType,
                            "loadingEffect": this.loadingEffect,
                            "lastModificationTime":this.lastModificationTime,
                            "destination": {
                                "province": this.tableData[0].edit.endProvince,
                                "city": this.tableData[0].edit.endCity,
                                "county": this.tableData[0].edit.endArea,
                                "details": this.tableData[0].edit.endAddress,
                            },
                            "origin": {
                                "province": this.tableData[0].edit.startProvince,
                                "city": this.tableData[0].edit.startCity,
                                "county": this.tableData[0].edit.startArea,
                                "details": this.tableData[0].edit.startAddress,
                            },
                            "viaList": this.tableData[0].edit.viaList,
                            "deliveryTime": this.tableData[0].edit.startTime,
                            "arrivalTime": this.tableData[0].edit.arrivalTime,
                            "mileage": this.tableData[0].edit.mileage,
                            "goodsId":this.tableData[0].edit.goodsId,
                            "goodsName": this.tableData[0].edit.goodsName,
                            "goodsTypeId": this.tableData[0].edit.goodsTypeId,
                            "goodsTypeName": this.tableData[0].edit.goodsTypeName,
    
                            "quantityOfGoods": this.tableData[0].edit.goodsNum,
                            "goodsUnit": this.tableData[0].edit.goodsNumUnit,
                            "quantityOfGoodsTwo": this.tableData[0].edit.goodsNumTwo,
                            "goodsUnitTwo": this.tableData[0].edit.goodsNumTwoUnit,
                            "tonnageRange": this.tableData[0].edit.tonRange,
                            "childs": submitChildLine,
                            "remarks": this.orderRemarks,
                            "attachmentList": submitUploadedFiles,
                            "clientOrderId":this.clientOrderId
                        }
                        dataService().CspOrder.EditCspOrder(editOrderData).then((res) =>{
                            if(res.success){
                                if(res.data=="0"){
                                    bootbox.alert("编辑成功！",function(){
                                        router.go("/app/order/orderReleaseManage");
                                    });
                                }else if(res.data=="1"){
                                    bootbox.alert("订单编辑失败,此订单已被受理",function(){
                                        router.go("/app/order/orderReleaseManage");
                                    });
                                } else if(res.data=="2"){
                                    bootbox.alert("子线路信息编辑失败",function(){
                                        router.go("/app/order/orderReleaseManage");
                                    });
                                } else if(res.data=="3"){
                                    bootbox.alert("订单内容已变化，请刷新页面",function(){
                                        router.go("/app/order/orderReleaseManage");
                                    });
                                }
                               
                            }else{
                                var errorMess:string = res.errorMessage;
                                bootbox.alert(errorMess);
                            }
                        });
                    }
                }else{
                    return;
                }
            });
        }
        else{
            return;
        }
    }

    //建立一個可存取到該file的url
    getObjectURL=(file)=> {
        var urlImg = null;
        if (window.URL != undefined) { // mozilla(firefox)
            urlImg = window.URL.createObjectURL(file);
        } 
        return urlImg;
    }

}
