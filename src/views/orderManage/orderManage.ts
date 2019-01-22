import { VueComponent,Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService'
import * as VueRouter from 'vue-router'

var VuePagination = require('v-pagination');
Vue.use(VuePagination)

Vue.use(VueRouter);
var router = new VueRouter();

var VueTables = require('vue-tables');
Vue.use(VueTables.client,{
    filterable:false,
    compileTemplates:true,
    highlightMatches:true
});

interface JQuery {
    bootstrapTable(options?: any): JQuery;
    bootstrapTable(name:string,any):JQuery;
}
declare var bootstrapTable: JQueryStatic;

@VueComponent({
    template: require('./orderManage.html'),
})

export class OrderManageComponent extends Vue {
    el:'#orderManage'
    components:({
        vclienttable:any,
    })

    @Prop
    records:number=1;
    PerPage=10;
    skip:number;
    count:number;
    /**
     * 物流公司编号
     */
    logisticsId:string='';
    /**
     * 客户单位id
     */ 
    clientId:string='';
   

    /**
     * 定位器
     */
    islocating = ""//是否绑定定位器
    id=""//硬件定位的id;

    //订单状态枚举
    orderStatusList=[
        {text:"全部", "value":""},
        {text:"派车中","value":"1,4"},
        {text:"已派车","value":"3"},
        {text:"待发货","value":"5"},
        {text:"已发货","value":"6"},
        {text:"货已送达","value":"7"},
        {text:"订单终结","value":"8"}
    ];
    //回单状态枚举
    receiptStatusList=[
        {text:"全部", "value":""},
        {text:"无回单", "value":"1"},
        {text:"回单待回", "value":"2"},
        {text:"回单部分已回", "value":"3"},
        {text:"回单已回", "value":"4"},
    ]
    orderQuery={
        orderId:'',
        orderStatus:'5',
        startAddress:'',
        endAddress:'',
        startTime:'',
        endTime:'',
        deliveryStartTime:'',
        deliveryEndTime:'',
        receiptStatus:this.receiptStatusList[0].value,
        clientOrderId:''
    }

    status:string=''
    
    ready=function(){ 
        let routerName = this.$route.path;
        if(window.localStorage.getItem(String(routerName))){
            this.orderQuery = JSON.parse(window.localStorage.getItem(String(routerName)))
        }else{
            this.orderQuery = {
                orderId: '',
                orderStatus: '5',
                startTime: '',
                endTime: '',
                startAddress: '',
                endAddress: '',
                deliveryStartTime: '',
                deliveryEndTime: '',
                receiptStatus: this.receiptStatusList[0].value,
                clientOrderId:''
            }
        }
        if(window.localStorage.getItem(String(routerName + 'Page'))){
            let pageData = JSON.parse(window.localStorage.getItem(String(routerName + 'Page')));
            this.skip = pageData.skip;
            this.count = pageData.count;
        }else{
            this.skip = 0;
            this.count = 10;
        } 
        this.$on('pageIndexChange', function(event) {
            this.count = event.pageSize;
            this.skip = event.pageIndex;
            this.currentPage = event.currentPage;
            this.localPage(this.skip,this.count,this.currentPage)
            this.load(this.skip,this.count);
        });
        $('#orderManage_ApplicationStartTime').datetimepicker();
        $('#orderManage_ApplicationEndTime').datetimepicker();
        $('#orderManage_DeliveryStartTime').datetimepicker();
        $('#orderManage_DeliveryEndTime').datetimepicker();
        $('#location').attr("disabled","true");
        $('#locktoollocation').attr("disabled","true");
        $('#BDNPlocation').attr("disabled","true");

        var $table = $('#table').bootstrapTable({
            //选中列表中的一条数据
            clickToSelect:true,
            singleSelect:true,
                dataField: "rows",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
                pagination: false,//是否分页
                sidePagination: "client",//服务端分页
                buttonsAlign: "left",//按钮对齐方式 子询价编号 发货地址 送货地址 货物名称 货物数量 所需车长 询价时间 紧急程度 询价状态
                columns: [
                    {field: "select",title: "",checkbox: true,width: 20,align: "center",valign: "middle"},
                    {field: "orderId",title: "订单编号", sortable: false,order: "desc"},
                    {field: "originAddress",title: "发货地址",sortable: false,titleTooltip: "this is name"},
                    {field: "destinationAddress",title: "送货地址",sortable: false,},
                    {field: "goodsName",title: "货物名称",sortable: false,},
                    {field: "quantityOfGoods",title: "货物数量",sortable: false,},
                    {field: "carLength",title: "所需车长",sortable: false,},
                    {field: "creationTime",title: "下单时间",sortable: false,},
                    {field: "deliveryTime",title: "发货时间",sortable: false,},
                    {field: "responseTime",title: "紧急程度",sortable: false,},
                    {field: "statusStr",title: "订单状态",sortable: false,},
                    {field: "receiptStatusStr",title: "回单状态",sortable: false,},              
                    {
                        field: 'template',
                        title: '操作',
                        formatter: function operateFormatter(value, row, index) {
                            var bb=`<a class="detailOrder" href="javascript:void(0)" title="查看详情"><i class='glyphicon glyphicon-eye-open text-info'></i></a>`
                            switch(row.status){
                                default:return bb;
                            }
                        },
                        events: {
                            'click .detailOrder':function(e,value,row,index){
                                router.go('orderManageDetail/?id='+row.id + '&orderId='+ row.orderId +'&status='+row.status+'&name=detail');
                            },
                        },
                    }
                ],
                data: [],
                //选中row事件
                onCheck: (row, $element) =>{
                    this.id = row.id;
                    dataService().Location.CheckOrderIsLocating(this.id).then((res)=>{
                        this.islocating = res.extData;
                        //判断硬件定位按钮是否显示
                        if(this.islocating == true) {
                            $('#locktoollocation').removeAttr("disabled");
                        }else{
                            $('#locktoollocation').attr("disabled","true"); 
                        }
                    })
                    
                    //判断定位按钮，北斗按钮以及是否需要调沿途地址接口
                    if(row.status=="1"||row.status=="8"){
                        $('#location').attr("disabled","true");
                        $('#BDNPlocation').attr("disabled","true");        
                    }else{
                        $('#location').removeAttr("disabled");
                        $('#BDNPlocation').removeAttr("disabled");
                    }
                    this.locationPhone=row.driverPhone;
                    this.originAddress=row.originAddress;
                    this.destinationAddress=row.destinationAddress;
                    this.carCode=row.carrierCarCode;
                    this.orderStatus = row.status;
                },
                //取消选中事件
                onUncheck:(row)=>{ 
                    if($('#table').bootstrapTable('getSelections').length==0){
                         $('#location').attr("disabled","true");
                         $('#locktoollocation').attr("disabled","true");    
                         $('#BDNPlocation').attr("disabled","true");
                    }
                },
              
                actionFormatter:function(value, row, index){
                    
                },
                locale: "zh-CN"//中文支持,
        });

        //表格 初始 加载数据
        this.load(this.skip,this.count);
    }

    @Prop
    seeks = true; 
    locationPhone=""//定位所需参数，addedBy 李志军
    originAddress="";//定位所需参数，addedBy 李志军;
    destinationAddress=""//定位所需参数，addedBy 李志军;
    carCode="";

  
    //存储搜索条件
    localHistory = function(state){
        if(state){
            let routerName = state.path;
            if(routerName.search("orderManage")>0){
                window.localStorage.setItem(String(routerName),JSON.stringify(this.orderQuery));
            };
        }
    }
    //存储页数
    localPage = function(skip,count,currentPage){
        var routerName = this.$route.path;
        window.localStorage.setItem(String(routerName+'Page'),JSON.stringify({skip:skip,count:count,currentPage:currentPage}));
    }



    //请求数据  this.orderQuery.receiptStatus,
    load=function(skip,count){
        dataService().Order.getOrderList(this.orderQuery.orderId,this.orderQuery.orderStatus,this.orderQuery.startTime,this.orderQuery.endTime,this.orderQuery.deliveryStartTime,this.orderQuery.deliveryEndTime,this.orderQuery.startAddress,
        this.orderQuery.endAddress,skip,count,this.orderQuery.receiptStatus,this.orderQuery.clientOrderId).then((res)=>{
            this.logisticsId = res.logisticsId;
            this.clientId = res.clientId;
            $('#table').bootstrapTable('load', res.data); 
            this.seeks= false ;
            this.records = res.total==0?0.5:res.total;

        },function(rej){
            this.seeks=false;
        });
    }

    //查询
    queryOrder=function(){
        this.seeks=true;
        this.$broadcast('reset');
        this.skip = 0;
        this.currentPage = 1;
        this.localHistory(this.$route);
        this.localPage(this.skip,this.count,this.currentPage);
        this.load(this.skip,this.count);
    }

    /**
     * 报表导出
     */
    excel = function(){
        dataService().Order.getOrderListExport(this.logisticsId,this.clientId,this.orderQuery.orderId,this.orderQuery.orderStatus,this.orderQuery.startTime,this.orderQuery.endTime,this.orderQuery.startAddress,
            this.orderQuery.endAddress,this.orderQuery.deliveryStartTime,this.orderQuery.deliveryEndTime,0,this.records,this.orderQuery.receiptStatus,this.orderQuery.clientOrderId);
        
    }
     /**
    * 跳转订单新增页面
    */
   LinkToOrderReleaseAdd=()=>{
        var rowSelected;
        rowSelected=$('#table').bootstrapTable('getSelections')[0];
        dataService().CspOrder.getAddOrderAuthAndSettleIsExis("").then((res)=>{
            if(res.addOrderAuth){
                if(rowSelected){
                    router.go('orderReleaseAdd/?id='+ rowSelected.id+'&name=copy&table=2');
                }else{
                    router.go('orderReleaseAdd/?id='+'&name=add');
                }
            }else{
                if(rowSelected){
                    bootbox.alert("订单复制失败，请先联系对应商务人员与诺得签订有效托运合同！");
                }else{
                    bootbox.alert("订单新增失败，请先联系对应商务人员与诺得签订有效托运合同！");
                }
            }
        });
    
    }
    /* 跳转批量导入界面 */
    batchImport=()=>{
        dataService().CspOrder.getAddOrderAuthAndSettleIsExis("").then((res)=>{
            if(res.addOrderAuth){
                router.go('batchImport');
            }else{
                bootbox.alert("批量导入失败，请先联系对应商务人员与诺得签订有效托运合同！");
            }
        });
    }
}
