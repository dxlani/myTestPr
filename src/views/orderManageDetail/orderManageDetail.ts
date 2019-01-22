import { VueComponent, Prop } from 'vue-typescript'
import { AboutComponent } from '../../views/about/about'
import { dataService } from '../../service/dataService'

declare var $: any;
var orderTimer:any;

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
    template: require('./orderManageDetail.html'),
    style: require('./orderManagerDetail.scss')
})

export class OrderManageDetailComponent extends Vue {
    el: '#orderManageDetail'
    components: ({
        AboutComponent: AboutComponent,
        orderManageDetailTable: any,
        vclienttable: any
    })

    //v-model初始化
    //详情页id
    id: string;
    //订单编号
    orderId: string = '';
    //销售编号
    clientOrderId: string = '';
    //发货发布时间
    orderTime: string = '';
    //紧急程度
    urgency: string = '';
    urgencyUnit: string = '';
    //发货计划人
    consignor: string = '';
    //发货计划热电话
    consignorPhone: string = '';
    //发布内容
    content: string = '';
    //所需车型
    carType: string = '';
    //所需车长
    carLength: string = '';
    //承运方式
    carrierCategory: string = '';
    //装车效果
    loadingEffect: string = '';

    //获取订单详情数据
    orderDetail = [];
    //总线路列表处获取到的省市区信息
    shipProvinceW: string = '';
    shipCityW: string = '';
    shipAreaW: string = '';
    endProvinceW: string = '';
    endCityW: string = '';
    endAreaW: string = '';

    //总线路查看详情中数据
    //弹框中的
    OData = {};
    goodsNumUnit2: string = '';
    goodsNumUnit1: string = '';
    viaAddressDe: string = '';
    //详情时获取的
    viaAdd: string = '';
    orderDate = {};
    goodsUnitO: string = '';//货物数量单位
    goodsUnitT: string = '';
    //总线路详情中的省市区下拉数据
    shipProvinceList = [];
    shipCityList = [];
    shipAreaList = [];
    endProvinceList = [];
    endCityList = [];
    endAreaList = [];

    //子线路查看详情中数据
    childDate = [];
    CDate = {};
    //详情时获得的
    childGoodsUnit: string = '';//获取数量单位
    childGoodsUnit2: string = ''
    receivablePriceU: string = '';
    projectUnit: string = '';
    viaAddressChild: string = '';
    settleWay: string = '';
    includeTax: string = ''

    //弹框中获取的
    receivablePriceUnit: string = '';
    projectU: string = '';
    viaAddressC: string = '';
    settleWayC: string = '';
    includeTaxC: string = ''
    //省市区
    //子线路详情中的省市区下拉数据
    shipProvinceList2 = [];
    shipCityList2 = [];
    shipAreaList2 = [];
    endProvinceList2 = [];
    endCityList2 = [];
    endAreaList2 = [];
    //子线路列表处获取到的省市区信息
    shipProvinceW2: string = '';
    shipCityW2: string = '';
    shipAreaW2: string = '';
    endProvinceW2: string = '';
    endCityW2: string = '';
    endAreaW2: string = '';


    //货物数量单位
    childUnit: string = '';
    childUnit2: string = '';


    //承运商车辆信息 显示，隐藏
    carriershow: boolean = true;
    status: string = "";

    //承运商车辆信息
    carrierCarCode: string = '';
    carrierCarLength: string = '';
    carrierCarType: string = '';
    //回单信息显示隐藏
    receiptshow:boolean = false;
    /**
     * 回单照片
     */
    receiptPicList = [];
    picPath:string = '';
    /**
     * 订单追踪是否过期
     */
    isPass:boolean=false;
    /**
     * 确认发货
     */
    isDelivery:boolean=false;
    /**
     * 确认发货按钮名
     */
    isDeliveryName:string="";
    /**
     * 确认收货
     */
    isReceipt:boolean=false;
    /**
     * 确认收货按钮名
     */
    isReceiptName:string="";
    /**
     * 订单追踪数据
     */
    orderLogList = [];
    /**
     * 耗时（显示数据）
     */
    ordertrackTime:string="";
    /**
     * 派车时间
     */
    trackTime:string="";
    /**
     * 货已送达时间（订单跟踪）
     */
    arriveTime:string;
    /**专属客服ID */
    clientId = "";
    /**专属客服号码 */
    telNumber = "";
    //总线路货物信息
    columns = ['shipAddress', 'viaAddress', 'deliveryAddress', 'shipTime', 'arriveTime', 'mileage', 'goodsTypeName', 'goodsName', 'goodsNum', 'operation']
    totalData1 = []
    options = {
        texts: {
            noResults: '暂无数据',
        },
        headings: {
            shipAddress: "发货地址",
            viaAddress: "中转地",
            deliveryAddress: "送货地址",
            shipTime: "发货时间",
            arriveTime: "到货时间",
            mileage: "里程数",
            goodsTypeName: "货物类别",
            goodsName: "货物名称",
            goodsNum: "货物数量",
            operation: '操作'
        },
        templates: {
            operation: function (row) {
                return `<a data-toggle="modal" data-target="#orderTotal"  @click='$parent.orderTotal(${row.id})'  title="查看详情"  class="glyphicon glyphicon-eye-open  text-info"></a>`
            }
        },

    };

    /**
     * 订单追踪
     */
    orderTrace = function(){
        if($("#orderTimeline").find("li").length > 1){
            $("#orderTimeline li:first").attr("class","firstStatus");
            $("#orderTimeline li:last-child").attr("class","lastStatus");
        }else if($("#orderTimeline").find("li").length == 1){
            $("#orderTimeline li:last-child").attr("class","onlyStatus");
        }
    }

    orderTotal = function () {
        this.OData = this.orderDate;
        //中转地
        this.viaAddressDe = this.getViaAddress(this.OData.viaAddressList)

    }

    //获取中转地
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


    //子线路货物信息
    columns2 = ['shipDetail', 'viaListData', 'deliverDetail', 'goodsTypeName', 'goodsName', 'tonnageRange', 'goodsNum', 'settle', 'settlementType', 'operation']
    @Prop
    orderChildData = []
    options2 = {
        texts: {
            noResults: '暂无数据',
        },
        headings: {
            shipDetail: "发货地址",
            viaListData: "中转地",
            deliverDetail: "送货地址",
            goodsTypeName: "货物类别",
            goodsName: "货物名称",
            tonnageRange: "吨位范围",
            goodsNum: "货物数量",
            settle: '结算单位',
            settlementType: '结算方式',
            operation: '操作'
        },
        templates: {
            operation: function (row) {
                return `<a data-toggle="modal" data-target="#orderChildren" @click='$parent.orderChildE(${row.index})'  title="查看详情" class="glyphicon glyphicon-eye-open  text-info"></a>`
            }
        },
    };
    //查看子单详情
    orderChildE = function (id) {
        this.CDate = this.childDate[id]
        //货物数量
        this.childUnit = this.CDate.goodsUnitStr
        this.childUnit2 = this.CDate.goodsUnitTwoStr
        // 单价单位 
        this.receivablePriceUnit = this.CDate.receivablePriceUnitStr
        //工程总量单位
        this.projectU = this.CDate.projectMaxUnitStr
        //中转地
        this.viaAddressC = this.getViaAddress(this.CDate.viaAddressList);
        //结算方式
        this.settleWayC = this.CDate.settlementTypeStr
        //含税
        this.includeTaxC = this.CDate.includeTaxStr

    }

    imageLists = [];
    object: { default: string } = { default: 'Default object property!' }; //objects as default values don't need to be wrapped into functions
    imageColumns = ['name', 'rate', 'state', 'operation'];//'image',//上传显示图片 'size',//
    imageOptions = {
        texts: {
            noResults: '暂无数据',
        },
        headings: {
            // image:'图片',
            name: "名称",
            rate: "进度",
            state: "状态",
            operation: '操作'
        },
        templates: {
            operation: function (row) {
                return `<button id="page_orderManagent_detail_Driveruploader" type="button" class="btn btn-primary btn-xs" @click="$parent.downLoad(${row.index})">
                            <span class="fa fa-cloud-download"></span> 下载
                        </button>`
            },
            // image:function(row){
            //     return `<div class="img-thumbnail" style="position:relative">
            //                 <img class="img-responsive" src="${row.path}" style="width:236px;height:298px"/>
            //             </div>`
            // }
            state: function (row) {
                return `<span class='glyphicon glyphicon-ok text-success' id="${row.id}" title='状态显示'></span>`;
            },
            rate: function (row) {
                return `<div class="progress" style="width:60%"><div class="progress-bar progress-bar-uploadFile" id='${row.id}progressBar' role="progressbar" style="width:100%"></div></div>`;
            }
        },
    };

    //下载附件
    downLoad = function (index) {
        var imageID = this.imageLists.filter(t => t.index == index)[0].id;
        window.location.href = dataService().baseUrl + "Attachment/getAttachment/" + imageID;
    }

    //点击并缩放图片
    bigPic = function(picFile){
        this.picPath = "";
        this.picPath = picFile.path;
        this.bbImg();
    }
    //回单图片放大缩小
    bbImg = function(){
        var oImg=document.getElementById("orderManageDetail_receiptPic");
        // console.log("informationImg",oImg)
        fnWheel(oImg,function (down,oEvent){
            var oldWidth=this.offsetWidth;
            var oldHeight=this.offsetHeight;
            var oldLeft=this.offsetLeft;
            var oldTop=this.offsetTop;

            var scaleX=(oEvent.clientX-oldLeft)/oldWidth;//比例
            var scaleY=(oEvent.clientY-oldTop)/oldHeight;

            if (down){
                this.style.width=this.offsetWidth*0.9+"px";
                this.style.height=this.offsetHeight*0.9+"px";
            }
            else{
                this.style.width=this.offsetWidth*1.1+"px";
                this.style.height=this.offsetHeight*1.1+"px";
            }
            var newWidth=this.offsetWidth;
            var newHeight=this.offsetHeight;
            this.style.left=oldLeft-scaleX*(newWidth-oldWidth)+"px";
            this.style.top=oldTop-scaleY*(newHeight-oldHeight)+"px";
        });
        function fnWheel(obj,fncc){
            obj.onmousewheel = fn;
        //  console.log("obj.onmousewheel = fn;",obj.onmousewheel)
            if(obj.addEventListener){
                obj.addEventListener('DOMMouseScroll',fn,false);
            }
            function fn(ev){
                var oEvent = ev || window.event;
                var down = true;
                if(oEvent.detail){
                    down = oEvent.detail>0
                }else{
                    down = oEvent.wheelDelta<0
                }
                if(fncc){
                    fncc.call(this,down,oEvent);
                }
                if(oEvent.preventDefault){
                    oEvent.preventDefault();
                }
                return false;
            }
        }
    }
    
    //下载回单照片
    downLoadReceiptPic = function (imgId) {
        window.location.href = dataService().baseUrl+ "Attachment/getAttachment/"+ imgId;
        // window.location.href = path
    }
    /* 跟踪时间流 */
    timeGo=function(){
        if(this.status=='7'){
            this.timeElapse(this.arriveTime,this.trackTime);
        }else{
            orderTimer = setInterval(()=>{
                this.timeElapse(Date(),this.trackTime);
            },1000)
        }
    }

    timeElapse = function(current,date){
        var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
        var days = Math.floor(seconds / (3600 * 24));
        seconds = seconds % (3600 * 24);
        var hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let H = hours<10?'0'+hours:hours;
        let M = minutes<10?'0'+minutes:minutes;
        let S = seconds<10?'0'+seconds:seconds;
        this.ordertrackTime = days+'天'+ H+'小时'+M+'分'+S+'秒';
    }
    
    @Prop
    customerUnit: string;
    enterpriseid: string;

    ready() {
        this.status = this.$route.query.status;
        this.id = this.$route.query.id;
        this.clientId = JSON.parse(window.sessionStorage.getItem("userInfo")).clientId;
        //订单编号
        clearInterval(orderTimer);
        // this.orderId = this.$route.query.orderId;
        this.receiptshow = false;
        this.trackTime = "";
        this.arriveTime = "";
        this.ordertrackTime = "";
        this.receiptPicList = [];
        this.orderLogList = [];
             
        //订单详情的数据
        dataService().Order.getOrder(this.id).then((res) => {
            this.isReceipt=res.isReceipt;
            this.isDelivery=res.isDelivery;
            this.isDeliveryName=this.isDelivery?'已确认发货':'确认发货';
            this.isReceiptName=this.isReceipt?'已确认收货':'确认收货';
            //订单数据
            this.orderDetail = res;
            this.orderId = res.orderId;
            this.clientOrderId = res.clientOrderId;
            //下单时间
            this.orderTime = res.creationTime;
            //紧急程度
            this.urgency = res.responseTimeStr;
            // //紧急程度单位
            // this.urgencyUnit = res.responseTimeUnit;
            //客户单位初始化
            this.customerUnit = res.clientName;
            //发货计划人
            this.consignor = res.consignorName;
            //发货人电话
            this.consignorPhone = res.consignorPhone;
            //发货内容
            this.content = res.content;
            //总线路列表数据          
            this.viaAdd = this.getViaAddress(res.viaAddressList);
            var orderTotalList = {
                shipAddress: res.originAddress,
                viaAddress: this.viaAdd,
                deliveryAddress: res.destinationAddress,
                shipTime: res.deliveryTime,
                arriveTime: res.arrivalTime,
                mileage: res.mileage,
                goodsTypeName: res.goodsTypeName,
                goodsName: res.goodsName,
                goodsNum: res.quantityOfGoods + res.goodsUnitStr
            }
            this.totalData1 = [orderTotalList]
            //总线路查看详情里的数据(在获取详情时得到的数据)
            this.orderDate = res;
            this.goodsUnitO = res.goodsNumUnit;
            this.goodsUnitT = res.goodsNumUnitTwo
            this.shipProvinceW = res.originProvinceStr;
            this.shipCityW = res.originCityStr;
            this.shipAreaW = res.originCountyStr;
            this.endProvinceW = res.destinationProvinceStr;
            this.endCityW = res.destinationCityStr;
            this.endAreaW = res.destinationCountyStr
            //子线路列表数据
            this.childDate = res.items;
            var orderChildList = [];
            for (var i = 0; i < res.items.length; i++) {
                var orderChild = res.items[i];
                this.childGoodsUnit = orderChild.goodsUnit;//传给弹框中的数量单位
                this.childGoodsUnit2 = orderChild.goodsUnitTwo;
                this.receivablePriceU = orderChild.receivablePriceUnit;
                this.projectUnit = orderChild.projectMaxUnit
                this.viaAddressChild = orderChild.viaAddressList

                this.settleWay = orderChild.settlementTypeStr
                this.includeTax = orderChild.includeTaxStr

                this.shipProvinceW2 = orderChild.originProvinceStr;
                this.shipCityW2 = orderChild.originCityStr;//Str
                this.shipAreaW2 = orderChild.originCountyStr;
                this.endProvinceW2 = orderChild.destinationProvinceStr;
                this.endCityW2 = orderChild.destinationCityStr;
                this.endAreaW2 = orderChild.destinationCountyStr

                orderChildList[i] = {
                    shipDetail: orderChild.originAddress,
                    viaListData: this.getViaAddress(this.viaAddressChild),
                    deliverDetail: orderChild.destinationAddress,
                    goodsTypeName: orderChild.goodsTypeName,
                    goodsName: orderChild.goodsName,
                    tonnageRange: orderChild.tonnageRange,
                    goodsNum: orderChild.quantityOfGoods + orderChild.goodsUnitStr,
                    settle: orderChild.settle,
                    settlementType: this.settleWay,
                    index: i
                }
            }
            this.orderChildData = orderChildList;
            //所需车辆信息
            this.carType = res.vehicleTypeStr;
            this.carLength = res.carLengthStr;
            this.carrierCategory = res.carriageWayStr;
            this.loadingEffect = res.loadingEffect;
            //附件列表
            this.imageLists = [];
            if (res.attachmentList) {
                res.attachmentList.forEach((item, index) => {
                    item.index = index;
                    this.imageLists.push(item);
                })
            }
            //承运商车辆信息
            //承运商车辆信息 显示，隐藏(已派车、待发货、已发货、货已送达显示;  派车中，订单终结不显示)  
            if (res.orderStatus == "1" || res.orderStatus == "4" || res.orderStatus == "8") {
                this.carriershow = false
            } else {
                this.carriershow = true
            }
            this.carrierCarCode = res.carrierCarCode
            this.carrierCarLength = res.carrierCarLengthStr
            this.carrierCarType = res.carrierVehicleTypeStr;
            //回单照片
            //回单信息显示隐藏
            res.items.forEach((item, index) => {
                var receiptPicSave = [];
                if(item.receiptList.length>0){
                    item.receiptList.forEach((itemC, indexC) => {
                        if(itemC.isExists){
                            receiptPicSave.push(itemC);
                        }
                    });
                    if(receiptPicSave.length>0){
                        this.receiptshow = true;
                    }
                }
                this.receiptPicList.push(receiptPicSave);
            })
        }).then(()=>{
            if(this.status=='3' || this.status=='4' || this.status=='5' || this.status=='6' || this.status=='7'){
                /**
                 * 判断订单是否超过3个月
                 */
                var current = Date();
                var seconds = Date.parse(current) - Date.parse(this.orderTime);
                if(seconds>7776000000){
                    this.isPass = true;
                }else{
                    dataService().Order.getOrderLogList(this.orderId).then((res)=>{
                        if(res.data.length>0){
                            this.isPass = false;
                            this.orderLogList = res.data.reverse();
                            this.orderLogList.forEach((item)=>{
                                if(item.orderStatus == "派车中"){
                                    this.trackTime=item.operatorTime;
                                }
                                if(item.orderStatus == "货已送达"){
                                    this.arriveTime = item.operatorTime;
                                }
                            });
                            this.timeGo();
                        }else{
                            this.isPass = true;
                            this.orderLogList = [];
                        }
                    });
                }
            }
        });
        this.GetClientServiceOfficer();
    }
    beforeDestroy() {
        clearInterval(orderTimer);
    }
    returnBack(){
        if(this.status=='1' || this.status=='2' || this.status=='3' || this.status=='4'){
            this.$router.go('/app/order/orderReleaseManage')
        }else if(this.status=='5'){
            this.$router.go('/app/order/orderManage')
        }else if(this.status=='6' || this.status=='7'){
            this.$router.go('/app/order/OrderManageDelivered')
        }
    }
    /*确认发货  */
    comfirmDeliver(){
        bootbox.confirm("确认发货吗？",(result)=>{
            if(result){
                dataService().Order.updateIsDelivery(this.id).then((res)=>{
                    if(res.success){
                        this.isDelivery=true;
                        bootbox.alert({
                            message: "确认发货成功",
                            callback:  ()=> {
                                this.$router.go('/app/order/orderManage')
                            }
                        })
                    }
                });
            }else{
                return;
            }
        })
    };
    /*确认收货  */
    comfirmAccept(){
        bootbox.confirm('确认收货吗？',result=>{
            if(result){
                dataService().Order.getUpdateIsReceipt(this.id).then((res)=>{
                    if(res.success){
                        this.isReceipt=true;
                        bootbox.alert({
                            message: "确认收货成功",
                            callback:  ()=> {
                                this.$router.go('/app/order/OrderManageDelivered')
                            }
                        })
                    }
                });
            }else{
                return
            }
        })
    };
    /*终结  */
    falseEndOrder(){
        dataService().Order.getCustomerServicePhone(this.id).then((res)=>{
            bootbox.confirm({
                title: "联系客服",
                message: `如需终结订单，请拨打客服电话：<span style="color:#36a9ce">${res.phoneNumber}</span>，诺得物流竭诚为您服务！`,
                callback: function (result) {
                }
          })
        });
    };
    /* 申请撤回 */
    recall(){
        dataService().Order.getCustomerServicePhone(this.id).then((res)=>{
            bootbox.confirm({
                title: "联系客服",
                message: `如需申请撤回，请拨打客服电话：<span style="color:#36a9ce">${res.phoneNumber}</span>，诺得物流竭诚为您服务！`,
                callback: function (result) {
                }
          })
        });
    };
    /* 通报异常 */
    unusual(){
        dataService().Order.setOrderError(this.id).then((res)=>{
            bootbox.confirm({
                title: "联系客服",
                message: `您的订单:${this.orderId}已报障成功，我们将在2小时内为您处理并反馈。如有其他问题，请拨打客服电话：<span style="color:#36a9ce">${this.telNumber}</span>，诺得物流竭诚为您服务！`,
                callback: function (result) {
                }
          })
        });
    };

    /**获取专属客服信息 */
    GetClientServiceOfficer() {
        dataService().Order.getCustomerServicePhone(this.id).then((res)=>{
            this.telNumber = res.phoneNumber;
        });
    }

    package: string = 'vue-typescript';
    repo: string = 'https://github.com/itsFrank/vue-typescript';


}

