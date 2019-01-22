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
    template: require('./SumaccountControlle.html'),
    style:require('./SumaccountControlle.scss')
})

export class SumaccountControlle extends Vue {
    el: '#SumaccountControlle'
    components: ({
        SumaccountControlle: any,  
    })

    /* 当前用户是否有效 */
    isValide: boolean = false;
    /**用户Logo */
    userLogo: string = "";
    /**客户单位名称 */
    userName: string = "";
    /* 用户token */
    userToken: string = "";

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
    /***
     * sid
     */
    SId:string = '';
    /**
     * 回单状态枚举
     */
    receiptStatusList=[
        {text:"全部", value:""},
        {text:"无回单", value:"1"},
        {text:"回单待回", value:"2"},
        {text:"回单部分已回", value:"3"},
        {text:"回单已回", value:"4"},
    ]
    /**
     * 查询条件
     */
    checkQuery = {
        startTime: '',
        endTime: '',
        // goodsType:'',
        // goodsName: '',
        originAddress: '',
        destinationAddress: '',
        orderNumber:'',
        receiptStatus:'',
    }
    
    ready() {
         this.userToken = this.$route.query.accountSID;
        window.sessionStorage.setItem("userToken", this.userToken);
        console.log(this.userToken);
        $('#sumaccount_startTime').datetimepicker();
        $('#sumaccount_endTime').datetimepicker();
        let routerName = this.$route.path;
        // if (this.userToken == "a26c15dcef031f4240fb3d8b23c16140") {
        //     this.userLogo = "../../img/daquan.png";
        // } else if (this.userToken == "3f02b2188a8aa504162c50eb8544d4d5") {
        //     this.userLogo = "../../img/wode.png";
        // }
        Vue.http.headers.common['accountSID'] = this.userToken;
        this.SId = this.userToken;
        console.log('sid',this.SId);
        dataService().daquan.customerValide().then((res) => {
            if (res.validationResult) {
                this.isValide = true;
                this.userLogo = res.logoUrl;
                this.userName = res.name;
            } else {
                this.isValide = false;
            }
        })
        if(window.localStorage.getItem(String(routerName))){
            this.checkQuery = JSON.parse(window.localStorage.getItem(String(routerName)))
        }else{
            var nowTime = new Date();
            var start = new Date(nowTime.getTime()-31 * 24 * 3600 * 1000);
            this.checkQuery.startTime = String(this.transformTime(new Date(start.getFullYear(), start.getMonth(), start.getDate(),start.getHours(), start.getMinutes()),"yyyy/MM/dd HH:mm"))
            this.checkQuery.endTime = String(this.transformTime(new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(),nowTime.getHours(), nowTime.getMinutes()),"yyyy/MM/dd HH:mm"))
            this.checkQuery.originAddress =  '',
            this.checkQuery.destinationAddress = '',
            this.checkQuery.orderNumber = '',
            this.checkQuery.receiptStatus = this.receiptStatusList[0].value
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

        
        var $table = $('#sumaccount_table').bootstrapTable({
            dataField: "rows",
            pagination: false,
            sidePagination: "client",
            buttonsAlign: "left",
            columns: [
                { field: "orderNumber", title: "发货单号", sortable: false, formatter:function operateFormatter(value,row,index){
                    var orderNumber;
                    if(!row.orderNumber){
                        orderNumber = "--";
                    }else{
                        orderNumber = row.orderNumber;
                    }
                    return orderNumber;
                }},
                { field: "deliveryTime", title: "发货日期", sortable: false, },
                { field: "originAddress", title: "发货地址", sortable: false, },
                { field: "destinationAddress", title: "送货地址", sortable: false, },
                { field: "freightTotalPrice", title: "运费总价", sortable: false, 
                    formatter:function operateFormatter(value,row,index){
                        var freightTotalPrice="";
                        if(row.freightTotalPrice == null){
                            freightTotalPrice = '--'
                        }else{
                            freightTotalPrice =row.freightTotalPrice + "元";
                        }
                        return freightTotalPrice;
                    }
                },
                { field: "intoWarehouseCost", title: "进仓费", sortable: false, formatter:function operateFormatter(value,row,index){
                    var intoWarehouseCost="";
                    if(row.intoWarehouseCost == null){
                        intoWarehouseCost = '--'
                    }else{
                        intoWarehouseCost =row.intoWarehouseCost + "元";
                    }
                    return intoWarehouseCost;
                }
                },
                { field: "unloadingCharge", title: "卸车费", sortable: false, formatter:function operateFormatter(value,row,index){
                    var unloadingCharge="";
                    if(row.unloadingCharge == null){
                        unloadingCharge = '--'
                    }else{
                        unloadingCharge =row.unloadingCharge + "元";
                    }
                    return unloadingCharge;
                }
                },
                { field: "shortBargeCost", title: "短驳费", sortable: false, formatter:function operateFormatter(value,row,index){
                    var shortBargeCost="";
                    if(row.shortBargeCost == null){
                        shortBargeCost = '--'
                    }else{
                        shortBargeCost =row.shortBargeCost + "元";
                    }
                    return shortBargeCost;
                }
                },
                { field: "extraCharge", title: "额外费用", sortable: false, formatter:function operateFormatter(value,row,index){
                    var extraCharge="";
                    if(row.extraCharge == null){
                        extraCharge = '--'
                    }else{
                        extraCharge =row.extraCharge + "元";
                    }
                    return extraCharge;
                }
                },
                { field: "other", title: "其他费用", sortable: false, formatter:function operateFormatter(value,row,index){
                    var other="";
                    if(row.other == null){
                        other = '--'
                    }else{
                        other =row.other + "元";
                    }
                    return other;
                }
                },
                { field: "totalPrice", title: "总费用", sortable: false, formatter:function operateFormatter(value,row,index){
                    var totalPrice="";
                    if(row.totalPrice == null){
                        totalPrice = '--'
                    }else{
                        totalPrice =row.totalPrice + "元";
                    }
                    return totalPrice;
                }},
                { field: "receiptStatus", title: "回单状态", sortable: false, },
                { field: "contractNumber", title: "电子回单", sortable: false, },
                {
                    field: 'template',
                    title: '查看费用详情',
                    formatter: function operateFormatter(value, row, index) {
                        var bb = `<a class="detailOrder" href="javascript:void(0)" title="查看详情"  ><i class='glyphicon glyphicon-eye-open text-info 	'></i></a>`
                        switch (row.status) {
                            default: return bb;
                        }
                    },
                    events: {
                        'click .detailOrder': function (e, value, row, index) {
                            router.go("SumaccountControlleDetail/?id=" + row.id + "&contractNumber=" + row.contractNumber);
                        },
                    },
                }
            ],
            data: [],
            locale: "zh-CN"//中文支持,
        });
        this.load(this.skip,this.count);
        this.loadtotal();
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
    /**
     * 查询
     */
    querySum = function () {
        this.seeks = true;
        this.skip = 0;
        this.currentPage = 1;
        this.$broadcast('reset');
        this.localHistory(this.$route);
        this.localPage(this.skip,this.count,this.currentPage);
        this.load(this.skip,this.count);
        this.loadtotal();
    }
    /**
     * 加载数据
     */
    load = function (skip, count) {
        dataService().CheckFinanceApiControlle.GetOrderFinceList(this.checkQuery.startTime, this.checkQuery.endTime, "", this.checkQuery.originAddress, this.checkQuery.destinationAddress,
            "",this.checkQuery.orderNumber,this.checkQuery.receiptStatus,skip, count).then((res) => {
                $('#sumaccount_table').bootstrapTable('load', res.data);
                var a = res.data;
                this.logisticsId = res.logisticsId;
                this.clientId = res.clientId;
                this.seeks = false;
                this.records = res.total == 0 ? 0.5 : res.total;
        }, function (rej) {
            this.seeks = false;
        });
    }
    
    //获取列表总费用
    loadtotal = function () {
        dataService().CheckFinanceApiControlle.GetPriceTotle(this.checkQuery.startTime, this.checkQuery.endTime, "", this.checkQuery.originAddress, this.checkQuery.destinationAddress,"",this.checkQuery.orderNumber,this.checkQuery.receiptStatus).then((res) => {
            this.priceTotal = res;
        }, function (rej) {
        });

    }

    //存储搜索条件
    localHistory = function(state){
        if(state){
            let routerName = state.path;
            if(routerName.search("SumaccountControlle")>0){
                window.localStorage.setItem(String(routerName),JSON.stringify(this.checkQuery));
            };
        }
    }

    //存储页数
    localPage = function(skip,count,currentPage){
        var routerName = this.$route.path;
        window.localStorage.setItem(String(routerName+'Page'),JSON.stringify({skip:skip,count:count,currentPage:currentPage}));
    }

    downExport = function () {
        dataService().CheckFinanceApiControlle.GetOrderFinceExport(this.logisticsId, this.clientId, this.checkQuery.startTime, this.checkQuery.endTime, "", this.checkQuery.originAddress, this.checkQuery.destinationAddress, "", this.checkQuery.orderNumber, this.checkQuery.receiptStatus, 0, this.records, this.SId);
        // window.location.href = dataService().baseUrl +  "CheckFinance/GetOrderFinceExport?LogisticsCompanyId=" + this.logisticsId +"&clientId="+ this.clientId+ "&startTime=" + this.checkQuery.startTime + "&endTime=" +this.checkQuery.endTime+ "&GoodsName=" + this.checkQuery.goodsName + "&OriginAddress=" + this.checkQuery.originAddress + "&DestinationAddress=" + this.checkQuery.destinationAddress + "&skip=" + 0 + "&count=" + this.records
        // }
    }
}