import { VueComponent,Prop} from 'vue-typescript'
import { AboutComponent } from '../../views/about/about'
// import { azureBlob } from '../../service/azure-blob-upload'
import * as VueRouter from 'vue-router'
import {dataService} from '../../service/dataService';
Vue.use(VueRouter);

var router = new VueRouter();

var VueTables = require('vue-tables');
Vue.use(VueTables.client,{
    filterable:false,
    compileTemplates:true,
    pagination: {
     dropdown:false,
    },
    texts:{
     count:'{count} 条',
    }  
});

@VueComponent({
    template: require('./orderReleaseDetail.html'),
    style:require('./orderReleaseDetail.scss')
})

 export class OrderReleaseDetailComponent extends Vue {
    el:'#orderReleaseDetail'
    components:({
        AboutComponent:AboutComponent,
        orderReleaseManageTable:any
    })
    @Prop
    testt='';
    goodsQuantityUnitDropDown=[{"text": "吨","value": "1"},{"text": "立方","value": "2"},{ "text": "车","value": "3"},{"text": "件","value": "4"},{"text": "托","value": "5"},{"text": "台","value": "6"},{"text": "其他","value": "7"}]
    // carTypeDropDown=[{"text": "厢车","value": "1"},{"text": "飞翼","value": "2"},{"text": "半挂","value": "3"},{"text": "标厢","value": "4"}, {"text": "大平板","value": "5"},{"text": "平板","value": "6"},{"text": "高低板","value": "7"},{"text": "高栏平板","value": "8"},{"text": "高栏高低板", "value": "9"},{"text": "大件车抽拉板", "value": "10"},{ "text": "大件车超低板", "value": "11"},{"text": "自卸车","value": "12"},{"text": "单车","value": "13"},{"text": "其他", "value": "14" }]
    carLengthDropDown=[{ "text": "4.2米","value": "1"},{"text": "5.8米","value": "2"}, {"text": "6米","value": "3"}, { "text": "6.2米","value": "4" }, { "text": "6.5米", "value": "5"},  {"text": "6.8米","value": "6" }, {"text": "7.6米","value": "7"},{"text": "8.6米","value": "8"},{ "text": "8.7米","value": "9"},{"text": "9.6米","value": "10"},{ "text": "13米", "value": "11"},{"text": "13.5米","value": "12" },{"text": "16米","value": "13"},{"text": "17.5米","value": "14" }, {"text": "其他","value": "15"}]
    carrierCategoryDropDown=[{"text": "整车","value": "1"},{"text": "零担", "value": "2" }, {"text": "整车/零担","value": "3"}] 
    urgencyUnitDropDown=[{text:"天",value:"1"},{text:"时",value:"2"},{text:"分",value:"3"}];
    settlleWayDropDown=[{"text": "配送结算","value": "1"},{"text": "到付结算","value": "2"},{"text": "公里数结算","value": "3"}]
    taxDropDown=[{"text": "未开票","value": "1"},{"text": "不含税","value": "2"},{"text": "已开票","value": "3"}]
    
    proList=[];
    originCityList=[];
    originCouList=[];
    destCityList=[];
    destCountryList=[];
    originCountyStr="";
    orderInfo={
        originProvinceStr:"",
        destinationProvinceStr:"",
        originCityStr:"",
        destinationCityStr:"",
        originCountyStr:"",
        destinationCountyStr:"",

        originCity:"",
        destinationCity:"",
        originCounty:"",
        destinationCounty:"",
        originDetails:"",
        destinationDetails:"",
        cspOrderId:"",
        
        viaAddressList:"",
         deliveryTime:"",
         arrivalTime:"",
         mileage:"",
        goodsTypeName:"",
        goodsName:"",
        goodsNum:"",
    };
    originProvinceStr="";
    destinationProvinceStr="";
    originCityStr="";
    destinationCityStr="";
    originCountryStr="";
    destinationCountyStr="";
    viaAddress="";
    //子单地址
    childOpro="";
    childOcity="";
    childOcou="";

    childDpro="";
    childDcity="";
    childDcou="";
    childOcityList=[];
    childOcouList=[]
    childDcityList=[];
    childDcouList=[];

    //总线路货物信息
    columns=['shipAddress','viaAddress','deliveryAddress','shipTime','arriveTime','mileage','goodsTypeName','goodsName','goodsNum','operation'];

    tableData= [];
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
            return `<a data-toggle="modal"  data-target="#orderTotal" title="查看详情" class="glyphicon glyphicon-eye-open  text-info" ></a>`
            }
        },
    };
    
    //子线路货物信息
    columns2=['shipDetail','viaListData','deliverDetail','goodsTypeName','goodsName','goodsNum','receivablePrice','receivableTotal','reckoner','operation']
    tableData2= [];
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
            reckoner:"结算单位",
            operation:'操作'
        },
        templates: {
            operation: function(row) {
            return `<a data-toggle="modal" data-target="#orderChildren" title="查看详情" class="glyphicon glyphicon-eye-open  text-info" @click=$parent.getChildDetail(${row.index})></a>`
            }
        },
    };
    //获取子单详情
    childViaAddress=""
    getChildDetail=function(index){
        this.orderChildDetail=this.childDetailList[index];
        this.childViaAddress=this.getViaAddress(this.orderChildDetail.viaAddressList)
    }

    router=new VueRouter();

    package:string = 'vue-typescript';
    repo:string = 'https://github.com/itsFrank/vue-typescript';

    // 下拉选择框 select onChange
    goodsTypeSelect(event, item) {
        item.drug_id = parseInt(event.target.value) 
    }
   
    
    id="";
    //
    orderStatus=""
    btnShow:boolean = true;
    OrderId=""
    cspOrderStatus=""

    //子单列表
    childDetailList=[];

    
    //子单详情
    orderChildDetail={};
    ready(){
        this.id=this.$route.query.id;
        this.orderStatus=this.$route.query.orderStatus;
        dataService().CspOrder.getCspOrder(this.id).then((res)=>{
            this.orderInfo=res;
            this.originCountyStr=res.originCountyStr
            this.OrderId = res.orderId;
            //总线路货物信息
            this.viaAddress=this.getViaAddress(this.orderInfo.viaAddressList)
            var mainRootData={
                shipAddress:res.originAddress,
                viaAddress:this.viaAddress,
                deliveryAddress:res.destinationAddress,
                shipTime:this.orderInfo.deliveryTime,
                arriveTime:this.orderInfo.arrivalTime,
                mileage:this.orderInfo.mileage,
                goodsTypeName:this.orderInfo.goodsTypeName,
                goodsName:this.orderInfo.goodsName,
                goodsNum:res.quantityOfGoods+res.goodsUnitStr,
            }
            // this.orderInfo.mileage=this.orderInfo.mileage?this.orderInfo.mileage+'公里':"";
            this.tableData=[mainRootData];

            this.childDetailList=res.items;
            
            var len=res.items.length;
            var rootData=[];
            for(var i=0;i<len;i++){
               
                var temp=res.items[i];
                var receivablePrice = "";
                if(temp.receivablePrice == null || temp.receivablePrice == ""){
                    receivablePrice = "";
                }else{
                    receivablePrice = temp.receivablePrice + temp.receivablePriceUnitStr
                }
                rootData[i]={
                    shipDetail:temp.originAddress,
                            
                    viaListData:this.getViaAddress(temp.viaAddressList),
                    deliverDetail:temp.destinationAddress,
                    
                    goodsTypeName:temp.goodsTypeName,
                    goodsName:temp.goodsName,
                    goodsNum:temp.quantityOfGoods+temp.goodsUnitStr,
                    receivablePrice:receivablePrice,
                    receivableTotal:temp.receivableTotalPrice,
                    reckoner:temp.settle,
                    index:i
                }
            }

            this.tableData2=rootData;
             // 获取附件
             this.imageLists=[];
            if(res.attachmentList){
                res.attachmentList.forEach((item,index)=>{
                    item.index=index;
                    this.imageLists.push(item)
                })
            };
        },(rej)=>{
        });
        // this.testFun();
        
    }
    /* 编辑订单 */
    editOrder(){
        dataService().CspOrder.getAddOrderAuthAndSettleIsExis("").then((res)=>{
            if(res.addOrderAuth){
                this.$router.go('/app/order/orderReleaseEdit?id='+this.id+'&name=edit')
            }else{
                bootbox.alert("订单编辑失败，请先联系对应商务人员与诺得签订有效托运合同！");
            }
        });
    }
    /* 终结订单 */
    endOrder(){
        bootbox.confirm("确认终结该订单吗？",(result)=>{
            if(result){
                dataService().CspOrder.editCspOrder(this.id).then((res)=>{
                    console.log(res)
                    if(res.success){
                        bootbox.alert({
                            message: "终结订单成功",
                            callback: ()=>  {
                               this.$router.go('/app/order/orderReleaseManage')
                            }
                        })
                    }else{
                        if(res.errorCode=="2002"){
                            bootbox.alert("操作失败，该订单已被受理",()=>{
                            })
                        }
                    }
                });
            }else{
                return;
            }
        });
    }
    /* 删除订单*/
    deleteOrder(){
        bootbox.confirm("确认删除该订单吗？",(result)=>{
            if(result){
                dataService().CspOrder.deleteCspOrder(this.id).then((res)=>{
                    if(res.success){
                        bootbox.alert({
                            message: "删除订单成功",
                            callback:  ()=> {
                               this.$router.go('/app/order/orderReleaseManage')
                            }
                        })
                    }else{
                        if(res.errorCode=="2002"){
                            bootbox.alert("操作失败，该订单已被受理",()=>{
                            })
                        }
                    }
                });
            }else{
                return;
            }
        })
    }
    getViaAddress=function(viaAddressList){
        var address="";
        if(!viaAddressList){
            return address;
        }
        if(viaAddressList.length > 1){
            for(var i=0;i<viaAddressList.length;i++){
                address=address+viaAddressList[i].province+viaAddressList[i].city+viaAddressList[i].county+";";
            };
        }else if(viaAddressList.length == 1){
            address=address+viaAddressList[0].province+viaAddressList[0].city+viaAddressList[0].county;
        }
        return address;
    }
    //附件下载
     //uploade img
    download=function(index){
        var url=this.imageLists.filter(t=>t.index==index)[0].id; 
        window.location.href = dataService().baseUrl+ "Attachment/getAttachment/"+ url;
    }
   
    // sasUrl:string='https://sinostoragedev.blob.core.chinacloudapi.cn/avatar-container?sv=2016-05-31&sr=c&sig=nUNfvCUrZ%2F%2Bjuc%2Fesjjl0tXw7nY4E4JJJ8jD7PBSUjI%3D&st=2017-01-26T06%3A19%3A15Z&se=2017-01-27T06%3A24%3A15Z&sp=racwl';
    imageLists=[];
    object:{default:string} = {default: 'Default object property!'}; //objects as default values don't need to be wrapped into functions
    imageColumns =['image','name','rate','state','operation'];
    imageOptions= {
        texts:{
            noResults:'暂无数据',
        },
        headings:{
            image:'图片',
            name:"名称",
            // size:"大小",
            rate:"进度",
            state:"状态",
            operation:'操作'
        },
        templates: {
            operation: function(row) { 
                
                return `<button  type="button" class="btn btn-primary btn-xs btnDownLoad" @click="$parent.download(${row.index})">
                            <span class="fa fa-cloud-download"></span> 下载
                        </button>`
            },
            image:function(row){
                if(!/gif|jpeg|jpg|png|bmp/gi.test(row.path.substring(row.path.indexOf(".")))){
                    var test= row.path.split("/");
                    var fileName=test[(test.length)-1];
                    return `<i>${fileName}<i>`;
                }else{
                    return `<div class="img-thumbnail" style="position:relative">
                        <img class="img-responsive" id="${row.id}" src="${row.path}" style="max-width:266px;" />
                    </div>`
                }
            },
            state:function(row){
                return `<span class='glyphicon glyphicon-ok text-success' id="${row.id}" title='状态显示'></span>`;
            },
            rate:function(row){
                return `<div class="progress" style="width:60%"><div class="progress-bar progress-bar-uploadFile" id='${row.id}progressBar' role="progressbar" style="width:100%"></div></div>`;
            }
        },
    };
    

}

  

 