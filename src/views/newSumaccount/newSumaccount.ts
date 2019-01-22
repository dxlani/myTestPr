import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService'
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
    template: require('./newSumaccount.html'),
    style:require('./newSumaccount.scss')
})

export class newSumaccount extends Vue {
    el: '#newSumaccount'
    components: ({
        newSumaccount: any,  
    })

    @Prop
    records:number ;
    skip:number;
    count:number;
    seeks = true;
    /**
     * 总计费用
     */
    priceTotal: number = 0;
    /**
     * 物流公司编号
     */
    logisticsId:string='';
    /**
     * 客户单位id
     */ 
    clientId:string='';
    /**
     * 回单状态枚举
     */
    receiptStatusList=[
        {text:"全部", value:""},
        {text:"无回单", value:"1"},
        {text:"回单待回", value:"2"},
        {text:"回单部分已回", value:"3"},
        {text:"回单已回", value:"4"},
    ];
    /**概述区域 */
    totalFee:number=null;
    freight:number=null;
    intoWarehouseCost:number=null;
    unloadingCharge:number=null;
    shortBargeCost:number=null;
    extraCharge:number=null;
    other:number=null;
    /**
     * 查询条件
     */
    checkQuery = {
        startTime: '',
        endTime: '',
        goodsType:'',
        goodsName: '',
        originAddress: '',
        destinationAddress: '',
        orderNumber:'',
        receiptStatus:'',
    }
    bseeks = true;
    down:boolean = false;
    startTime:boolean=false;
    endTime:boolean=false;
    goodsType:boolean=false;
    goodsName:boolean=false;
    originAddress:boolean=false;
    destinationAddress:boolean=false;
    receiptStatus:boolean=false;
    ready = function () {
        this.down = false;
        $('#selectList').hide();
        let routerName = this.$route.path;
        if(window.localStorage.getItem(String(routerName))){
            this.checkQuery = JSON.parse(window.localStorage.getItem(String(routerName)))
        }else{
            this.checkQuery = {
                startTime: '',
                endTime: '',
                goodsType:'',
                goodsName: '',
                originAddress: '',
                destinationAddress: '',
                orderNumber:'',
                receiptStatus:this.receiptStatusList[0].value
            }
        }
        if(window.localStorage.getItem(String(routerName + 'Boolean'))){
            let showData = JSON.parse(window.localStorage.getItem(String(routerName + 'Boolean')));
            this.startTime = showData.startTime;
            this.endTime = showData.endTime;
            this.goodsType = showData.goodsType;
            this.goodsName = showData.goodsName;
            this.originAddress = showData.originAddress;
            this.destinationAddress = showData.destinationAddress;
            this.receiptStatus = showData.receiptStatus;
        }else{
            this.startTime = false;
            this.endTime = false;
            this.goodsType = false;
            this.goodsName = false;
            this.originAddress = false;
            this.destinationAddress = false;
            this.receiptStatus = false;
        }
        if(window.localStorage.getItem(String(routerName + 'Page'))){
            let pageData = JSON.parse(window.localStorage.getItem(String(routerName + 'Page')));
            this.skip = pageData.skip;
            this.count = pageData.count;
        }else{
            this.skip = 0;
            this.count = 10;
        } 
       
        this.$on('pageIndexChange', function (event) {
            this.count = event.pageSize;
            this.skip = event.pageIndex;
            this.currentPage = event.currentPage;
            this.localPage(this.skip,this.count,this.currentPage)
            this.load(this.skip, this.count);
        });

        $('#sumaccount_startTime').datetimepicker();
        $('#sumaccount_endTime').datetimepicker();

        var $table = $('#sumaccount_table').bootstrapTable({
            dataField: "rows",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
            pagination: false,//是否分页
            sidePagination: "client",//服务端分页
            buttonsAlign: "right",
            showAllColumns:true,
            showColumns:true,
            fixedColumns: true,
            fixedNumber: 3,
            columns: [
                { field: "deliveryTime", title: "发货日期", sortable: false,align: "center", },
                // { field: "originAddress", title: "发货地址", sortable: false, },
                // { field: "destinationAddress", title: "送货地址", sortable: false, },
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
                { field: "goodsTypeName", title: "货物类别", sortable: false,align: "center", },
                { field: "goodsName", title: "货物名称", sortable: false,align: "center", },
                { field: "realQuantityOfGoods", title: "货物数量", sortable: false,align: "center", },
                { field: "orderNumber", title: "发货单号", sortable: false,align: "center", formatter:function operateFormatter(value,row,index){
                    var orderNumber;
                    if(!row.orderNumber){
                        orderNumber = "--";
                    }else{
                        orderNumber = row.orderNumber;
                    }
                    return orderNumber;
                }},
                { field: "receiptStatus", title: "回单状态", sortable: false,align: "center", },
                { field: "carCode", title: "车牌号", sortable: false,align: "center", },
                { field: "carLength", title: "车长", sortable: false,align: "center", },
                {field:"freightinglePr",title:"运费单价",align: "center",formatter:function operateFormatter(value,row,index){
                    var freightinglePr="";
                    if(row.freightinglePrice == 0){
                        freightinglePr = '--'
                    }else{
                        freightinglePr =row.freightinglePrice+row.freightinglePriceUnit;
                    }
                    return freightinglePr;
                }},
                { field: "freightTotalPrice", title: "运费总价",align: "center", sortable: false, formatter:function operateFormatter(value,row,index){
                    var freightTotalPrice="";
                    if(row.freightTotalPrice == null){
                        freightTotalPrice = '--'
                    }else{
                        freightTotalPrice =row.freightTotalPrice + "元";
                    }
                    return freightTotalPrice;
                }
                },
                { field: "intoWarehouseCost", title: "进仓费",align: "center", sortable: false, formatter:function operateFormatter(value,row,index){
                    var intoWarehouseCost="";
                    if(row.intoWarehouseCost == null){
                        intoWarehouseCost = '--'
                    }else{
                        intoWarehouseCost =row.intoWarehouseCost + "元";
                    }
                    return intoWarehouseCost;
                }
                },
                { field: "unloadingCharge", title: "卸车费",align: "center", sortable: false, formatter:function operateFormatter(value,row,index){
                    var unloadingCharge="";
                    if(row.unloadingCharge == null){
                        unloadingCharge = '--'
                    }else{
                        unloadingCharge =row.unloadingCharge + "元";
                    }
                    return unloadingCharge;
                }
                },
                { field: "shortBargeCost", title: "短驳费",align: "center", sortable: false, formatter:function operateFormatter(value,row,index){
                    var shortBargeCost="";
                    if(row.shortBargeCost == null){
                        shortBargeCost = '--'
                    }else{
                        shortBargeCost =row.shortBargeCost + "元";
                    }
                    return shortBargeCost;
                }
                },
                { field: "extraCharge", title: "额外费用",align: "center", sortable: false, formatter:function operateFormatter(value,row,index){
                    var extraCharge="";
                    if(row.extraCharge == null){
                        extraCharge = '--'
                    }else{
                        extraCharge =row.extraCharge + "元";
                    }
                    return extraCharge;
                }
                },
                { field: "other", title: "其他费用", sortable: false,align: "center", formatter:function operateFormatter(value,row,index){
                    var other="";
                    if(row.other == null){
                        other = '--'
                    }else{
                        other =row.other + "元";
                    }
                    return other;
                }
                },
                { field: "totalPrice", title: "总费用", sortable: false,align: "center", formatter:function operateFormatter(value,row,index){
                    var totalPrice="";
                    if(row.totalPrice == null){
                        totalPrice = '--'
                    }else{
                        totalPrice =row.totalPrice + "元";
                    }
                    return totalPrice;
                }},
                {
                    field: 'template',
                    title: '查看费用详情',
                    align: "center",
                    formatter: function operateFormatter(value, row, index) {
                        var bb = `<a class="detailOrder" href="javascript:void(0)" title="查看详情"  ><i class='glyphicon glyphicon-eye-open text-info 	'></i></a>`
                        switch (row.status) {
                            default: return bb;
                        }
                    },
                    events: {
                        'click .detailOrder': function (e, value, row, index) {
                            router.go('SumaccountDetail/?id=' + row.id);
                        },
                    },
                }
            ],
            data: [],
            locale: "zh-CN"//中文支持,
        });
        this.load(this.skip,this.count);
        this.getReceiveableFee();
        // this.loadtotal();

        /* 重置表格尺寸 */
        window.addEventListener("resize", function () {
            $('#sumaccount_table').bootstrapTable('resetView');;
        });
        /* 禁止前三列表头的筛选 */
        $('#newSumaccount .dropdown-menu li:nth-child(1)').hide();
        $('#newSumaccount .dropdown-menu li:nth-child(2)').hide();
        $('#newSumaccount .dropdown-menu li:nth-child(3)').hide();
     
    }

    /**获取概述区域数据 */
    getReceiveableFee = function(){
        dataService().CheckFinance.getReceiveableFee().then((res)=>{
            this.totalFee = res.totalFee,
            this.freight = res.freight;
            this.intoWarehouseCost = res.intoWarehouseCost;
            this.unloadingCharge = res.unloadingCharge;
            this.shortBargeCost = res.shortBargeCost;
            this.extraCharge = res.extraCharge;
            this.other = res.other;
        });
    }

    /* 点击高级搜索按钮 */
    selectButton = function(){
        $('#selectList').toggle();
        if($('#selectList').css("display") == "none"){
            this.down = false;
        }else{
            this.down = true;
        } 
    }
    
   
    //查询调用1
    queryUsers=function(){
        this.seeks=true;
        this.skip = 0;
        this.currentPage = 1;
        this.resetQuery();
        this.$broadcast('reset');
        this.localHistory(this.$route);
        this.localPage(this.skip,this.count,this.currentPage);
        this.load(this.skip,this.count);
    }
    //查询调用2
    QueryUsers=function(){
        this.bseeks = true;
        this.skip = 0;
        this.currentPage = 1;
        this.$broadcast('reset');
        this.localHistory(this.$route);
        this.localPage(this.skip,this.count,this.currentPage);
        this.load(this.skip,this.count);
    }

    /**
     * 加载数据
     */
    load = function (skip, count) {
        dataService().CheckFinance.GetOrderFinceList(this.checkQuery.startTime, this.checkQuery.endTime, this.checkQuery.goodsName, this.checkQuery.originAddress, this.checkQuery.destinationAddress,
            this.checkQuery.goodsType,this.checkQuery.orderNumber,this.checkQuery.receiptStatus,skip, count).then((res) => {
            $('#sumaccount_table').bootstrapTable('load', res.data);
            var a = res.data;
            this.logisticsId = res.logisticsId;
            this.clientId = res.clientId;
            this.seeks = false;
            this.bseeks = false;
            this.records = res.total == 0 ? 0.5 : res.total;
        }, function (rej) {
            this.seeks = false;
            this.bseeks = false;
        });
    }
        /**重置 */
        resetQuery = function(){
                this.checkQuery.startTime='',
                this.checkQuery.endTime='',
                this.checkQuery.goodsType='',
                this.checkQuery.goodsName='',
                this.checkQuery.originAddress= '',
                this.checkQuery.destinationAddress='',
                this.checkQuery.receiptStatus=this.receiptStatusList[0].value;
        }
    //获取列表总费用
    // loadtotal = function () {
    //     dataService().CheckFinance.GetPriceTotle(this.checkQuery.startTime, this.checkQuery.endTime, this.checkQuery.goodsName, this.checkQuery.originAddress, this.checkQuery.destinationAddress,this.checkQuery.goodsType,this.checkQuery.orderNumber,this.checkQuery.receiptStatus).then((res) => {
    //         this.priceTotal = res;
    //     }, function (rej) {
    //     });
    // }

    //存储搜索条件
    localHistory = function(state){
        if(state){
            let routerName = state.path;
            if(routerName.search("Sumaccount")>0){
                window.localStorage.setItem(String(routerName),JSON.stringify(this.checkQuery));
                window.localStorage.setItem(String(routerName+'Boolean'),JSON.stringify({
                    startTime: this.startTime,
                    endTime: this.endTime,
                    goodsType: this.goodsType,
                    goodsName: this.goodsName,
                    originAddress: this.originAddress,
                    destinationAddress: this.destinationAddress,
                    receiptStatus: this.receiptStatus,
                }));
            };
        }
    }

    //存储页数
    localPage = function(skip,count,currentPage){
        var routerName = this.$route.path;
        window.localStorage.setItem(String(routerName+'Page'),JSON.stringify({skip:skip,count:count,currentPage:currentPage}));
    }

    downExport = function () {
        dataService().CheckFinance.GetOrderFinceExport(this.logisticsId,this.clientId,this.checkQuery.startTime, this.checkQuery.endTime, this.checkQuery.goodsName, this.checkQuery.originAddress, this.checkQuery.destinationAddress,this.checkQuery.goodsType,this.checkQuery.orderNumber,this.checkQuery.receiptStatus,0, this.records);
        // window.location.href = dataService().baseUrl +  "CheckFinance/GetOrderFinceExport?LogisticsCompanyId=" + this.logisticsId +"&clientId="+ this.clientId+ "&startTime=" + this.checkQuery.startTime + "&endTime=" +this.checkQuery.endTime+ "&GoodsName=" + this.checkQuery.goodsName + "&OriginAddress=" + this.checkQuery.originAddress + "&DestinationAddress=" + this.checkQuery.destinationAddress + "&skip=" + 0 + "&count=" + this.records
        // }
    }
}