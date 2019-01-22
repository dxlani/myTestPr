import { VueComponent,Prop } from 'vue-typescript'
import * as VueRouter from 'vue-router'
import {dataService} from '../../service/dataService'

var VuePagination = require('v-pagination');
Vue.use(VuePagination)

interface JQuery {
    bootstrapTable(options?: any): JQuery;
    bootstrapTable(name:string,any):JQuery;
}
declare var bootstrapTable: JQueryStatic;

Vue.use(VueRouter);
var router = new VueRouter();

var VueTables = require('vue-tables');
Vue.use(VueTables.client,{
    filterable:false,
    compileTemplates:true
});



@VueComponent({
    template: require('./orderReleaseManage.html')
})

 export class OrderReleaseManageComponent extends Vue {
    el:'#orderReleaseManage'
    components:{
       orderReleaseManageTable:any
    }

    /**
     * 订单状态下拉
     */
    orderStatusList = [
        {"text":"待接单",'value':'0'},
        {"text":"派车中",'value':'1,2,3,4'},
        {"text":"已终结",'value':'2'},
    ] 
    //回单状态枚举
    receiptStatusList=[
        {text:"全部", "value":""},
        {text:"无回单", "value":"1"},
        {text:"回单待回", "value":"2"},
        {text:"回单部分已回", "value":"3"},
        {text:"回单已回", "value":"4"},
    ]
    /**
     * 派车中切换
      */
     theOther:boolean=false;
    /**
     * 禁用复制新增按钮
      */
     couldAdd:boolean=true;
     /**
     * 物流公司编号
     */
    logisticsId:string='';
    /**
     * 客户单位id
     */ 
    clientId:string='';
    /**
     * 列表
     */ 
    table:string='';

    /**
     * 定位器
     */
    islocating = ""//是否绑定定位器
    id=""//硬件定位的id;
    locationPhone=""//定位所需参数，
    originAddress="";//定位所需参数，
    destinationAddress=""//定位所需参数
    orderStatus=""
    carCode="";
    //v-model初始化
    @Prop
    Records=1;
    showRecords=true;
    skip:number;
    count:number;
    seeks = true; 
    query = {
        orderId:'',
        orderStatus:this.orderStatusList[0].value,
        deliveryStartTime: '',
        deliveryEndTime: '',
        clientOrderId:'',
        startAddress:'',
        endAddress:'',
        startTime:'',
        endTime:'',
        receiptStatus: this.receiptStatusList[0].value,
    }
    /**列表数据 */
    orderReleaseData=[];
    ready=function(){
        let routerName = this.$route.path;
        this.orderReleaseData = [];
        if(window.localStorage.getItem(String(routerName))){
            this.query = JSON.parse(window.localStorage.getItem(String(routerName)));
        }else{
            this.query = {
                orderId:'',
                orderStatus:this.orderStatusList[0].value,
                deliveryStartTime: '',
                deliveryEndTime: '',
                clientOrderId:'',
                startAddress:'',
                endAddress:'',
                startTime:'',
                endTime:'',
                receiptStatus: this.receiptStatusList[0].value,
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
        
        
        //删除分页里的总行数统计（英文的）
        $('p').remove(".VuePagination__count")

        this.$on('pageIndexChange', function(event) {
            this.count = event.pageSize;
            this.skip = event.pageIndex;
            this.currentPage = event.currentPage;
            this.localPage(this.skip,this.count,this.currentPage)
            this.load(this.skip,this.count);
        });

        $('#orderReleaseManage_startTime').datetimepicker();
        $('#orderReleaseManage_endTime').datetimepicker();
        $('#orderManage_ApplicationStartTime').datetimepicker();
        $('#orderManage_ApplicationEndTime').datetimepicker();
        /**
         * 加载数据
         */
        this.load(this.skip,this.count);
    }
    table1={
        // url: "index.php",//数据源
        dataField: "rows",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
        // height: tableHeight(),
        clickToSelect:true, //选中的数据增加样式
        singleSelect:true,  //选中数据
        sidePagination: "client",//服务端分页
        buttonsAlign: "left",//按钮对齐方式 子询价编号 发货地址 送货地址 货物名称 货物数量 所需车长 询价时间 紧急程度 询价状态
        columns: [
            {field: "select",title: "",checkbox: true,width: 20,align: "center",valign: "middle"},
            {field: "cspOrderId",title: "订单编号", sortable: true,order: "desc"},
            {field: "startAddress",title: "发货地址",sortable: true,titleTooltip: "this is name"},
            {field: "endAddress",title: "送货地址",sortable: true,},
            {field: "goodsName",title: "货物名称",sortable: true,},
            {field: "goodsNum",title: "货物数量",sortable: true,},
            {field: "carLength",title: "所需车长",sortable: true,},
            {field: "cspOrderTime",title: "发货发布时间",sortable: true,},
            {field: "responseTime",title: "紧急程度",sortable: true,},
            {
                field: 'template1',
                title: '订单状态',
                formatter: function operateFormatter(value, row, index) {
                    switch(row.status) {
                        case '未处理': return '待接单'; 
                        case '订单终结':return '已终结'; 
                        default:row.status;
                    }
                },
            },
            {
                field: 'template',
                title: '操作',
                formatter: function operateFormatter(value, row, index) {
                    var bb=`<a class="detailOrder" href='javascript:void(0);' title="查看详情"><i class='glyphicon glyphicon-eye-open text-info m-l-xs'></i></a>`;
                    return bb;
                },
                events: {
                    /**
                     * 查看详情
                     */
                   'click .detailOrder':(e,value,row,index)=>{
                        router.go('orderReleaseDetail/?id='+row.id+'&name=detail'+'&orderStatus='+row.status);
                    },
                },
            }
        ],
        data: [],
        onCheck: (row, $element) =>{
        },
        onClickRow: function(row, $element) {
            //$element是当前tr的jquery对象
            // $element.css("background-color", "green");
        },//单击row事件
        actionFormatter:function(value, row, index){
            console.info('tyv')
        },
        locale: "zh-CN"//中文支持,
    }
    table2={
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
                    {
                        field: 'template1',
                        title: '订单状态',
                        formatter: function operateFormatter(value, row, index) {
                            switch(row.statusStr) {
                                case '已派车':return '派车中';
                                case '退回派车':return '派车中';
                                case '退回下单':return '派车中';
                                case '派车中':return '派车中';
                                default:row.statusStr;
                            }
                        },
                    },
                    {field: "receiptStatusStr",title: "回单状态",sortable: false,},              
                    {
                        field: 'template',
                        title: '操作',
                        formatter: function operateFormatter(value, row, index) {
                            var bb=`<a class="detailOrder" href='javascript:void(0);' title="查看详情"><i class='glyphicon glyphicon-eye-open text-info m-l-xs'></i></a>`;
                            return bb;
                        },
                        events: {
                            /**
                             * 查看详情
                             */
                           'click .detailOrder':(e,value,row,index)=>{
                                router.go('orderManageDetail/?id='+row.id+'&name=detail'+'&status='+row.status);
                            },
                        },
                    }
                ],
                data: [],
                //选中row事件
                onCheck: (row, $element) =>{
                    dataService().Location.CheckOrderIsLocating(this.id).then((res)=>{
                        this.islocating = res.extData;
                        //判断硬件定位按钮是否显示
                        if(this.islocating == "true") {
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
                    if($('#orderReleaseManage_table').bootstrapTable('getSelections').length==0){
                         $('#location').attr("disabled","true");
                         $('#locktoollocation').attr("disabled","true");    
                         $('#BDNPlocation').attr("disabled","true");
                    }
                },
                onClickRow: function(row, $element) {
                    //$element是当前tr的jquery对象
                    // $element.css("background-color", "green");
                },//单击row事件
                actionFormatter:function(value, row, index){
                    
                },
                locale: "zh-CN"//中文支持,
    }
    /**
     * 请求数据
     */
    load = function(skip,count){
        if(this.query.orderStatus=='1,2,3,4'){
            this.table="2";
            $('#orderReleaseManage_table').bootstrapTable(this.table2);
            dataService().Order.getOrderList(this.query.orderId,this.query.orderStatus,this.query.startTime,this.query.endTime,this.query.deliveryStartTime,this.query.deliveryEndTime,this.query.startAddress,
                this.query.endAddress,skip,count,this.query.receiptStatus,this.query.clientOrderId).then((res)=>{
                    this.logisticsId = res.logisticsId;
                    this.clientId = res.clientId;
                    $('#orderReleaseManage_table').bootstrapTable('load', res.data); 
                    this.seeks= false ;
                    this.Records = res.total==0?0.5:res.total;
                },function(rej){
                    this.seeks=false;
                });

        }else{
              this.table="1";
                $('#orderReleaseManage_table').bootstrapTable(this.table1);
                dataService().CspOrder.getCspOrderList(this.query.orderId,this.query.orderStatus,this.query.deliveryStartTime,this.query.deliveryEndTime,this.query.startAddress,this.query.endAddress,skip,count,this.query.clientOrderId).then((res)=>{            
                    this.logisticsId = res.logisticsId;
                    this.clientId = res.clientId;
                    this.orderReleaseData = res.data;
                    $('#orderReleaseManage_table').bootstrapTable('load', this.orderReleaseData);
                    this.seeks=false;
                    var totalItems=res.total;
                    this.Records= totalItems==0?0.5:totalItems;
                    this.showRecords=totalItems==0?false:true;
                },function(rej){
                    this.seeks = false;
                });
        }
    }
    
    /**
     * 查询
     */
    queryOrderRelease= function(){
       $('#orderReleaseManage_table').bootstrapTable('destroy');
       this.seeks=true;
       this.$broadcast('reset');
       this.skip = 0;
       this.currentPage = 1; 
       this.localHistory(this.$route);
       this.localPage(this.skip,this.count,this.currentPage);
       this.load(this.skip,this.count);
    }

    /**
     * 存储搜索条件 
     */
    localHistory = function(state){
        if(state){
            let routerName = state.path;
            if(routerName.search("order")>0){
                window.localStorage.setItem(String(routerName),JSON.stringify(this.query));

            };
        }
    }
    
    /**
     * 存储页数
     */
    localPage = function(skip,count,currentPage){
        var routerName = this.$route.path;
        window.localStorage.setItem(String(routerName+'Page'),JSON.stringify({skip:skip,count:count,currentPage:currentPage}));
    }

   /**
    * 跳转订单新增页面
    */
    LinkToOrderReleaseAdd(){
        var rowSelected;
        rowSelected=$('#orderReleaseManage_table').bootstrapTable('getSelections')[0];
        dataService().CspOrder.getAddOrderAuthAndSettleIsExis("").then((res)=>{
            if(res.addOrderAuth){
                if(rowSelected){
                    router.go('orderReleaseAdd/?id='+ rowSelected.id+'&name=copy&table='+this.table);
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
      /**
     * 报表导出
     */
    excel = function(){
        if(this.query.orderStatus=="1,2,3,4"){
            dataService().Order.getOrderListExport(this.logisticsId,this.clientId,this.query.orderId,this.query.orderStatus,this.query.startTime,this.query.endTime,this.query.startAddress,
                this.query.endAddress,this.query.deliveryStartTime,this.query.deliveryEndTime,0,this.Records,this.query.receiptStatus,this.query.clientOrderId);
        }else{
                dataService().Order.getCspOrderListExport(this.logisticsId,this.clientId,this.query.orderId,this.query.orderStatus,this.query.deliveryStartTime,this.query.deliveryEndTime,this.query.startAddress,
                    this.query.endAddress,0,this.Records,this.query.clientOrderId);
            }
    }
}

  