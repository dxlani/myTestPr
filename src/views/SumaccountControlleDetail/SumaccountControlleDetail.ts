import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'

import "../../img/daquan.png";
import "../../img/wode.png";
import "../../img/noValide.png";
import "../../img/daquanLocateIcon.png";
import "../../img/sino-er.png";
import "../../img/csp-er.png";
import "../../img/ccp-er.png";
import "../../img/default-avatar.png";

Vue.use(VueRouter);
var router = new VueRouter();
@VueComponent({
    template: require('./SumaccountControlleDetail.html'),
    style: require('./SumaccountControlleDetail.scss')
})

export class SumaccountControlleDetail extends Vue{
    el:'#SumaccountControlleDetail'
    components:({
        SumaccountControlleDetail:any,
    })
    /* 当前用户是否有效 */
    isValide: boolean = false;
    /**用户Logo */
    userLogo: string = "";
    /**客户单位名称 */
    userName: string = "";
    /* 用户token */
    userToken: string = "";

    //总线路货物信息
    columns = ['shipAddress', 'viaAddress', 'deliveryAddress', 'shipTime', 'arriveTime',  'goodsTypeName', 'goodsName', 'goodsNum']
    totalData1 = []
    options = {
        texts: {
            noResults: '暂无数据',
        },
        orderBy: {
            ascending:true      
        },
        headings: {
            shipAddress: "发货地址",
            viaAddress: "中转地",
            deliveryAddress: "送货地址",
            shipTime: "发货时间",
            arriveTime: "到货时间",
            goodsTypeName: "货物类别",
            goodsName: "货物名称",
            goodsNum: "货物数量",
        },
    }; 
    
    
    //子线路货物信息
    columns2 = ['shipAddress', 'viaAddress', 'deliveryAddress', 'shipTime', 'arriveTime',  'goodsType', 'goodsName', 'goodsNum']
    @Prop
    orderChildData = []
    options2 = {
        texts: {
            noResults: '暂无数据',
        },
        orderBy: {
            ascending:true      
        },
        headings: {
            shipAddress: "发货地址",
            viaAddress: "中转地",
            deliveryAddress: "送货地址",
            shipTime: "发货时间",
            arriveTime: "到货时间",
            goodsType: "货物类别",
            goodsName: "货物名称",
            goodsNum: "货物数量",
        },
    };

    //线路费用信息
    columns3 = ['goodsnumber', 'goodsType', 'oneprice', 'totalprice', 'arriveAddress',  'deliveryAddress', 'goodsName', 'goodsNum','goodsstatus']
    @Prop
    orderChildData2 = []
    options3 = {
        texts: {
            noResults: '暂无数据',
        },
        orderBy: {
            ascending:true      
        },
        headings: {
            goodsnumber: "费用编号",
            goodsType: "费用类别",
            oneprice: "单价",
            totalprice: "总价",
            arriveAddress: "发货地址",
            deliveryAddress: "送货地址",
            goodsName: "货物名称",
            goodsNum: "货物数量",
            goodsstatus: "结算状态",
        },
    };

    // 获取中转地
    getViaAddress = function (viaList) {
        var addre = "";
        if(viaList.length != 0){
            for (var i = 0; i < viaList.length; i++) {
                addre = addre + (viaList[i].province + viaList[i].city + viaList[i].county)
                if (i != viaList.length - 1) {
                    addre += "；";
                }
            }
            return addre;
        } else { return }
    }

    //点击并缩放图片
    bigPic = function(picFile){
        this.picPath = '';
        this.picPath = picFile.path; 
        this.bbImg();
    } 
    //回单图片放大缩小
    bbImg = function(){
        var oImg=document.getElementById("orderManageDetail_receiptPic");
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
    }

    /* 下载电子回单合同 */
    downloadContract(){
        dataService().OrderExternalApiControlle.downloadContract(this.contractNumber).then((res)=>{
            window.location.href = res.data.path;
        })
    }
    //v-model初始化
    id: string ;
    orderDetail = [];
    viaAdd: string = '';
    status: string = "";  
    viaAddressChild: string = '';
    /** 回单信息显示隐藏*/
    receiptshow:boolean = false;
    /**
     * 回单照片
     */
    receiptPicList = [];
    picPath:string = '';

    /**电子回单信息 */
    /* 是否显示电子回单信息 */
    isShowContract:boolean = false;
    /* 电子回单编号 */
    contractNumber:string = "";
    /* 电子回单图片列表 */
    contractImgList = [];
    
     ready() {
         this.userToken = window.sessionStorage.getItem("userToken")
         dataService().daquan.customerValide().then((res) => {
             if (res.validationResult) {
                 this.isValide = true;
                 this.userLogo = res.logoUrl;
                 this.userName = res.name;
             } else {
                 this.isValide = false;
             }
         })
        this.id = this.$route.query.id;
        this.contractNumber = this.$route.query.contractNumber;
        this.contractImgList = [];
        if(this.contractNumber != ""){
            dataService().OrderExternalApiControlle.getContractDetail(this.contractNumber).then((res)=>{
                if(res.imgList.length > 0){
                    this.isShowContract = true;
                    this.contractImgList = res.imgList;
                }else{
                    this.isShowContract = false;
                }
            })
        }else{
            this.isShowContract = false;
        }
        /**是否显示回单附件图片 */
        this.receiptshow = false;
        this.receiptPicList = [];
        
         dataService().OrderExternalApiControlle.getOrder(this.id).then((res) => {
            //订单数据
            this.orderDetail = res;
            //总线路列表数据          
            this.viaAdd = this.getViaAddress(res.viaAddressList);
            var orderTotalList = {
                shipAddress: res.originAddress,
                viaAddress: this.viaAdd,
                // deliveryAddress: res.destinationAddress,
                deliveryAddress: res.destinationAddress,
                shipTime: res.deliveryTime,
                arriveTime: res.arrivalTime,
                goodsTypeName: res.goodsTypeName,
                goodsName: res.goodsName,
                goodsNum: res.quantityOfGoods + res.goodsUnitStr,
            }
            this.totalData1 = [orderTotalList]
            //回单照片
            //回单信息显示隐藏         
            res.items.forEach((item, index) => {
                var receiptPicSave = [];
                if(item.receiptList.length>0){
                    item.receiptList.forEach((itemC, indexC) => {
                        /**后台是否能访问isExists */
                        if(itemC.isExists){
                            receiptPicSave.push(itemC);
                        }
                    });
                    if(receiptPicSave.length>0){
                        /**是否显示回单附件图片 */
                        this.receiptshow = true;
                    }
                }
                this.receiptPicList.push(receiptPicSave);
            })


            //子线路列表数据
            var orderChildList = [];
            for (var i = 0; i < res.items.length; i++) {
                var orderChild = res.items[i];
                orderChildList[i] = {
                    shipAddress: orderChild.originAddress,
                    viaAddress: this.getViaAddress(orderChild.viaAddressList),
                    deliveryAddress: orderChild.destinationAddress,
                    shipTime: orderChild.deliveryTime,
                    arriveTime: orderChild.arrivalTime,
                    goodsType: orderChild.goodsTypeName ,
                    goodsName: orderChild.goodsName,
                    goodsNum: orderChild.quantityOfGoods + orderChild.goodsUnitStr,
                }
            }
            this.orderChildData = orderChildList;
        }, (rej) => {});

         dataService().CheckFinanceApiControlle.GetOrderReceivableList(this.id).then((res) => {
            var receiveList =[];
            for (var j = 0; j < res.data.length; j++) {
                var goodsNum = res.data[j].realQuantityOfGoods;
                var goods = "";
                if(goodsNum){
                    goods = goodsNum.replace(/\.?0{1,5}$/,'')+res.data[j].goodsUnit;
                }
                var priceUnit = res.data[j].receivablePriceUnit;
                if(priceUnit === "未知"){
                    priceUnit = "";
                }
                receiveList[j] = {
                    goodsnumber : res.data[j].receivableCode,
                    goodsType : res.data[j].feeType,
                    oneprice :  res.data[j].receivablePrice == null?'--':res.data[j].receivablePrice + priceUnit, 
                    totalprice : res.data[j].receivableTotalPrice == null?'--':res.data[j].receivableTotalPrice +"元",
                    arriveAddress :res.data[j].originAddress,
                    deliveryAddress : res.data[j].destinationAddress,
                    goodsName : res.data[j].goodsName,
                    goodsNum : goods,
                    goodsstatus : res.data[j].settleStatus
                };
                this.orderChildData2 = receiveList;
            }
        },(rej) => {})
    }

   /**返回 */
    goBack = function() {
        router.go("/SumaccountControlle?accountSID=" + this.userToken);
    }
}