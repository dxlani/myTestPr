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
    template: require('./newOrderManage.html'),
    style: require('./newOrderManage.scss')
})

export class newOrderManageComponent extends Vue {
    el:'#newOrderManage'
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
    ];
    itc:number=null;
    hsc:number=null;
    wftd:number=null;
    ship:number=null;
    tchbd:number=null;
    oend:number=null;
    
    orderQuery={
        orderId:'',
        startTime:'',
        endTime:'',
        startAddress:'',
        endAddress:'',
        deliveryStartTime:'',
        deliveryEndTime:'',
        clientOrderId:'',
        orderStatus:this.orderStatusList[0].value,
        receiptStatus:this.receiptStatusList[0].value,
    }
    @Prop
    seeks = true;
    bseeks = true;
    down:boolean = false;
    startT:boolean=false; 
    endT:boolean=false; 
    startA:boolean=false;
    endA:boolean=false;
    dStartT:boolean= false;
    dEndT:boolean=false;
    clientN:boolean=false;
    orderS:boolean=false;
    receiptS:boolean=false;
    /* 定位 */
    locationPhone="";
    originAddress="";
    destinationAddress="";
    carCode="";

    status:string=''
    
    ready=function(){
        this.down = false;
        $('#selectList').hide(); 
        let routerName = this.$route.path;
        if(window.localStorage.getItem(String(routerName))){
            this.orderQuery = JSON.parse(window.localStorage.getItem(String(routerName)))
        }else{
            this.orderQuery = {
                orderId:'',
                startTime:'',
                endTime:'',
                startAddress:'',
                endAddress:'',
                deliveryStartTime:'',
                deliveryEndTime:'',
                clientOrderId:'',
                orderStatus:this.orderStatusList[0].value,
                receiptStatus:this.receiptStatusList[0].value,
            }
        }
        if(window.localStorage.getItem(String(routerName + 'Boolean'))){
            let showData = JSON.parse(window.localStorage.getItem(String(routerName + 'Boolean')));
            this.startT = showData.startT;
            this.endT = showData.endT;
            this.startA = showData.startA;
            this.endA = showData.endA;
            this.dStartT = showData.dStartT;
            this.dEndT = showData.dEndT;
            this.clientN = showData.clientN;
            this.orderS = showData.orderS;
            this.receiptS = showData.receiptS;
        }else{
            this.startT = false;
            this.endT = false;
            this.startA = false;
            this.endA = false;
            this.dStartT = false;
            this.dEndT = false;
            this.clientN = false;
            this.orderS = false;
            this.receiptS = false;
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
            // clickToSelect:true,
            // singleSelect:true,
                dataField: "rows",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
                pagination: false,//是否分页
                sidePagination: "client",//服务端分页
                buttonsAlign: "right",//按钮对齐方式 子询价编号 发货地址 送货地址 货物名称 货物数量 所需车长 询价时间 紧急程度 询价状态
                showAllColumns:true,
                showColumns:true,
                columns: [
                    {field: "orderId",title: "订单编号", sortable: false,order: "desc",align: "center"},
                    {
                        field: 'template1',
                        title: '发货地址',
                        formatter: function operateFormatter(value, row, index) {
                            var st:string=row.originAddress;
                            if(st.length>10){
                                var bb=st.substr(0,10)+"..."
                                var aa=`<a href="javascript:;" title="${st}">${bb}</a>`
                            }else{
                                var aa=`${st}`;
                            }
                            return aa
                        },
                        events: {
                        },
                    },
                    {
                        field: 'template2',
                        title: '送货地址',
                        formatter: function operateFormatter(value, row, index) {
                            var st:string=row.destinationAddress;
                            if(st.length>10){
                                var bb=st.substr(0,10)+"..."
                                var aa=`<a href="javascript:;" title="${st}">${bb}</a>`
                            }else{
                                var aa=`${st}`;
                            }
                            return aa
                        },
                        events: {
                        },
                    },
                    {field: "goodsName",title: "货物名称",sortable: false,align: "center",},
                    {field: "quantityOfGoods",title: "货物数量",sortable: false,align: "center",},
                    {field: "carLength",title: "所需车长",sortable: false,align: "center",},
                    {field: "creationTime",title: "下单时间",sortable: false,align: "center",},
                    {field: "deliveryTime",title: "发货时间",sortable: false,align: "center",},
                    {field: "responseTime",title: "紧急程度",sortable: false,align: "center",},
                    {field: "statusStr",title: "订单状态",sortable: false,align: "center",},
                    {field: "receiptStatusStr",title: "回单状态",sortable: false,align: "center",},              
                    // {field: "clientOrderId",title: "销售编号",sortable: false,align: "center",},              
                    {
                        field: 'template',
                        title: '操作',
                        align: "center",
                        formatter: function operateFormatter(value, row, index) {
                            var bb=`<a class="detailOrder" href="javascript:void(0)" title="查看详情"><i class='glyphicon glyphicon-eye-open text-info'></i></a>`
                            var ff=`<div class="operate" unselectable="on" onselectstart="return false;" style="-moz-user-select:none;">
                            <a title='更多操作' ><i class='glyphicon glyphicon-option-horizontal text-danger m-l-xs'></i></a>
                            <ul id="menu${index}" class="menuitem" >
                            <li class="dingwei"><span>定位</span></li>
                            <li class="beidou"><span>北斗定位</span></li>
                            </ul>
                            </div>`;
                            if(row.status=="1"||row.status=="8"){
                                return bb;
                            }else{
                                return bb+ff;
                            }
                        },
                        events: {
                             /**
                             * 显隐菜单
                             */
                            'click .operate': (e, value, row, index) =>{
                                this.id = row.id;
                                dataService().Location.CheckOrderIsLocating(this.id).then((res)=>{
                                    this.islocating = res.extData;
                                    //判断硬件定位按钮是否显示
                                    if(this.islocating == true) {
                                        $(`#menu${index}`).append(`<li class="yingjian"><a href='#!/app/order/locktoollocation?id=${row.id}&orderStatus=${row.status}&originAddress=${row.originAddress}&destinationAddress=${row.destinationAddress}'>硬件定位</a></li>`);
                                    }else{
                                    }
                                })
                                for(var i=0;i<this.count;i++){
                                    if(i==Number(index)){
                                    $(`#menu${index}`).toggle();
                                    }else{
                                    $('.yingjian').remove();
                                    $(`#menu${i}`).hide();
                                    }
                                }
                                if(index>=(this.count-2)){
                                    if(this.islocating == true){
                                        $('.menuitem').removeClass('menuitemTop')
                                        $('.menuitem').addClass('menuitemtop')
                                    }else{
                                        $('.menuitem').removeClass('menuitemtop')
                                        $('.menuitem').addClass('menuitemTop')
                                    }
                                }else{
                                    $('.menuitem').removeClass('menuitemtop')
                                    $('.menuitem').removeClass('menuitemTop')
                                }
                            },
                            
                            /* 查看详情 */
                            'click .detailOrder':function(e,value,row,index){
                                router.go('orderManageDetail/?id='+row.id+'&orderId='+ row.orderId +'&status='+row.status+'&name=detail');
                            },
                            /* 定位 */
                            'click .dingwei':function(e,value,row,index){
                                router.go("./location?phone="+row.driverPhone+"&carCode="+row.carrierCarCode+"&originAddress="+row.originAddress+"&destinationAddress="+row.destinationAddress)
                            },
                            /* 北斗定位 */
                            'click .beidou':function(e,value,row,index){
                                router.go("/app/order/BDNPLocation?carCode="+row.carrierCarCode+"&originAddress="+row.originAddress+"&destinationAddress="+row.destinationAddress);
                            },
                        },
                    }
                ],
                data: [],
                //选中row事件
                onCheck: (row, $element) =>{
                   
                },
                //取消选中事件
                onUncheck:function(row){                 
                  
                },
              
                actionFormatter:function(value, row, index){
                    
                },
                locale: "zh-CN"//中文支持,
        });

        //表格 初始 加载数据
        this.load(this.skip,this.count);
        this.getOrderCount();
    }

    /* 获取概述区域 */
    getOrderCount = function(){
        dataService().Order.getOrderCount().then((res)=>{
            this.itc = res.itc;
            this.hsc = res.hsc;
            this.wftd = res.wftd;
            this.ship = res.ship;
            this.tchbd = res.tchbd;
            this.oend = res.oend;
        });
    }

    //存储搜索条件
    localHistory = function(state){
        if(state){
            let routerName = state.path;
            if(routerName.search("orderManage")>0){
                window.localStorage.setItem(String(routerName),JSON.stringify(this.orderQuery));
                window.localStorage.setItem(String(routerName+'Boolean'),JSON.stringify({
                    startT: this.startT,
                    endT: this.endT,
                    startA: this.startA,
                    endA: this.endA,
                    dStartT: this.dStartT,
                    dEndT: this.dEndT,
                    clientN: this.clientN,
                    orderS: this.orderS,
                    receiptS: this.receiptS,
                }));
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
            this.bseeks = false;
            this.records = res.total==0?0.5:res.total;

        },function(rej){
            this.seeks=false;
            this.bseeks = false;
        });
    }

    /* 高级搜索 */
    selectButton = function(){
        $('#selectList').toggle();
        if($('#selectList').css("display") == "none"){
            this.down = false;
        }else{
            this.down = true;
        } 
    }

    //查询1
    queryOrder=function(){
        this.seeks=true;
        this.$broadcast('reset');
        this.skip = 0;
        this.currentPage = 1;
        this.resetQuery();
        this.localHistory(this.$route);
        this.localPage(this.skip,this.count,this.currentPage);
        this.load(this.skip,this.count);
    }
    //查询2
    QueryOrder=function(){
        this.bseeks = true;
        this.$broadcast('reset');
        this.skip = 0;
        this.currentPage = 1;
        this.localHistory(this.$route);
        this.localPage(this.skip,this.count,this.currentPage);
        this.load(this.skip,this.count);
    }

    /**重置 */
    resetQuery = function(){   
        this.orderQuery.startTime='',
        this.orderQuery.endTime='',
        this.orderQuery.startAddress='',
        this.orderQuery.endAddress='',
        this.orderQuery.deliveryStartTime='',
        this.orderQuery.deliveryEndTime='',
        this.orderQuery.clientOrderId='',
        this.orderQuery.orderStatus=this.orderStatusList[0].value,
        this.orderQuery.receiptStatus=this.receiptStatusList[0].value;
    }

    //定位
    location = function(){
        //如果选中了多行信息，则弹出该提醒
        if($('#table').bootstrapTable('getSelections').length>1){
            bootbox.alert("请只选择一条信息进行定位");
            return;
        }    
        router.go("./location?phone="+this.locationPhone+"&carCode="+this.carCode+"&originAddress="+this.originAddress+"&destinationAddress="+this.destinationAddress)
    }
    /**
     * 硬件定位
     */
    locktoollocation=function(){
        router.go("./locktoollocation?id="+this.id+"&orderStatus="+this.orderStatus +"&originAddress="+this.originAddress+"&destinationAddress="+this.destinationAddress);
    }

    /**
     * 北斗定位
     */
    getBDNPLocation = function(){
        router.go("/app/order/BDNPLocation?carCode="+this.carCode+"&originAddress="+this.originAddress+"&destinationAddress="+this.destinationAddress);
    }

    /**
     * 报表导出
     */
    excel = function(){
        dataService().Order.getOrderListExport(this.logisticsId,this.clientId,this.orderQuery.orderId,this.orderQuery.orderStatus,this.orderQuery.startTime,this.orderQuery.endTime,this.orderQuery.startAddress,
            this.orderQuery.endAddress,this.orderQuery.deliveryStartTime,this.orderQuery.deliveryEndTime,0,this.records,this.orderQuery.receiptStatus,this.orderQuery.clientOrderId);
        
    }
}
