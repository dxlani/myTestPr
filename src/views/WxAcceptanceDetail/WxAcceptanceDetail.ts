import { VueComponent } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'
declare var $: any;
declare var html2canvas: any;
Vue.use(VueRouter);
interface FileReaderEventTarget extends EventTarget {
    result:string
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage():string;
}
var router = new VueRouter();

@VueComponent({
    template: require('./WxAcceptanceDetail.html'),
    style: require('./WxAcceptanceDetail.scss')
})
export class WxAcceptanceDetailComponent extends Vue {
    el: '#WxAcceptanceDetail';

    /**订单id */
    orderId:string="";
    /**收发货角色 */
    status:string="";
    /**到货时间 */
    endTime:string="";
    /**收货单位 */
    acceptCompany:string="";
    /**收货地址 */
    acceptAddress:string="";
    /**车牌号 */
    carCode:string="";
    /**驾驶员姓名 */
    driverName:string="";
    /**货物名称 */
    goodsName:string="";
    /**货物数量 */
    goodsNum:string="";
    /**备注信息 */
    remarks:string="";
    /**发货时间 */
    startTime:string="";
    /**发货单位 */
    deliverCompany:string="";
    /**发货地址 */
    deliverAddress:string="";
    /**发货联系人姓名 */
    deliverUserName:string="";
    /**发货联系人电话 */
    deliverPhone:string="";
    /* 截图url */
    signurl:string="";
    /* 是否确认 */
    isConfirm:boolean = true;
    /**签名图片 */
    autoImgpath:string = "";
    /**签名图片 */
    signUrl:string = "";
    /* 运单状态 */
    orderStatus:number;
    /* 地理围栏收货消息 */
    geoHash:boolean = false;
    /* 预计到达时间 */
    planArriveTime:string = "";
    ready(){
        /* 初始化签字区域 */
        $("#signature").jSignature({width:"100vw",height:180,color:"#000",lineWidth:2,"background-color":"#ddd"}); 
        document.getElementsByTagName("body")[0].setAttribute("style", "height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.signurl = "";
        this.isConfirm = false;
        this.geoHash = false;
        this.orderId = this.$route.query.carrierorderid;

        /* 详情接口 */
        dataService().Wxcsporders.getCspOrders(this.orderId).then((res)=>{
            this.orderStatus = res.status;
            /* 收货人 */
                this.startTime = res.deliveryTime;
                this.endTime = res.arrivalTime;
                this.acceptCompany = res.consigneeCompany;
                this.acceptAddress = res.destinationAddress;
                this.deliverCompany = res.consignorCompany;
                this.deliverAddress = res.originAddress;
                this.deliverUserName = res.consignorName;
                this.deliverPhone = res.consignorPhone;
                this.carCode = res.carCode;
                this.driverName = res.driver;
                this.goodsName = res.goodsName;
                this.goodsNum = res.realQuantityOfGoods + res.goodsUnit;
                this.remarks = res.remarks;
                this.autoImgpath = res.autographImgAddress;
        }).then(()=>{
            if(this.$route.query.userState == "0"){
                if(this.orderStatus == 2){
                    this.isConfirm = true;
                    this.status = "收货人已收货";
                }else{
                    if(this.$route.query.isgeoHash){
                        this.geoHash = true;
                        var timestamp=new Date().getTime();
                        timestamp += 3600;
                        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                        var Y = date.getFullYear() + '-';
                        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
                        this.planArriveTime = Y + M + D;
                    }else{
                        this.status = "收货人未收货";
                        $("#signature").bind('change', (e)=>{ 
                            var native= $("#signature").jSignature("getData","native");
                            if(native.length == 0){
                                this.isConfirm = false;
                                $('#reset').attr('disabled',true);
                            }else{
                                this.isConfirm = true;
                                $('#reset').removeAttr('disabled');
                            }
                        });
                    }
                }
            }else if(this.$route.query.userState == "1"){
                this.status = "发货人";
                this.isConfirm = true;
            }
        });
    }

    /* 重置签名 */
    reset=function(){
        $("#signature").jSignature("reset"); //重置画布，可以进行重新作画.
    }

    /* 确认签字、提交图片至OSS */
    confirmsign=function(){
        html2canvas(document.querySelector("#signature")).then(canvas => {
            this.uploadFile(this.convertBase64UrlToBlob(canvas.toDataURL("image/png")));   
        })
    }
    convertBase64UrlToBlob=function(urlData){
        var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
        //处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob( [ab] , {type : 'image/png'});
    }
  

    //二进制流上传给OSS
    uploadFile(blob){
        if(blob.size>0){
            var reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onload = (fre:any) =>{
                // 配置OSS
                var client = new OSS.Wrapper({
                    // region: 'oss-cn-beijing',
                    // accessKeyId: 'LTAIOZT53Uu0ykZO',
                    // accessKeySecret: 'TYxjx2Icu7zjbxQ7LstQewJ6ZlLMZR',
                    // bucket: 'sinostoragedev1'
                    region: 'oss-cn-hangzhou',
                    secure:true,
                    accessKeyId: 'LTAItKu8i5yJwbYy',
                    accessKeySecret: 'dLgecHvzUJg1MFy3nnzVzX5YgsxRSD',
                    bucket: dataService().ossB
                });
                // 文件名
                var date=new Date().getTime();
                var storeAs = 'signfiles/'+date+'-'+this.guidGenerate()+'.'+blob.type.split('/')[1];
                // arrayBuffer转Buffer
                var buffer = new OSS.Buffer(fre.target.result);
                // 上传OSS
                client.put(storeAs, buffer).then((result)=>{
                    if(result.res.statusCode=="200"){
                        // $.alert("上传成功,url:"+result.url);
                        // $.alert("上传成功");
                        this.signurl=result.url;
                        var obj = {
                            "carrierOrderId": this.orderId,
                            "autographImgAddress": this.signurl,
                        };
                        dataService().Wxcsporders.patchUpdateCspOrders(obj).then((res)=>{
                            if(res.success){
                                $.toast("已确认");
                                this.isConfirm = false;
                                $('.jSignature').hide();
                                $('.confirmblock').remove();
                                $('.signblock').remove();
                                $('.signUrl').show();
                                this.signUrl=this.signurl;
                            }else{
                                $.toast("确认失败");
                            }
                        });
                    }
                }).catch((err)=>{
                    console.log(err);
                });
             }
        }else{
            $.alert("签名生成失败");
        }
    }
    /**
     * 图片ID生成
     */
    guidGenerate() {
        return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    } 
}
