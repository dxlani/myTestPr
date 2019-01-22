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
    template: require('./newOrderReleaseManage.html'),
    style: require('./newOrderReleaseManage.scss')
})

 export class newOrderReleaseManageComponent extends Vue {
    el:'#newOrderReleaseManage'
    components:{
       orderReleaseManageTable:any
    }

    /**
     * 订单状态下拉
     */
    orderStatusList = [
        {'text':'全部','value':''},
        {"text":"未处理",'value':'0'},
        {"text":"已处理",'value':'1'},
        {"text":"订单终结",'value':'2'},

    ] 
    
    //v-model初始化
    @Prop
    Records=1;
    showRecords=true;
    skip:number;
    count:number;
    seeks = true;
    bseeks = true;
    down:boolean = false;
    startT:boolean=false; 
    endT:boolean=false; 
    startA:boolean=false;
    endA:boolean=false;
    clientN:boolean=false;
    orderS:boolean=false;
    /* 概述区域 */
    untreated:number=null;
    processed:number=null;
    end:number=null;
    query = {
        orderId:'',
        startTime:'',
        endTime:'',
        startAddress:'',
        endAddress:'',
        clientOrderId:'',
        orderStatus:this.orderStatusList[0].value,
    }
    /**列表数据 */
    orderReleaseData=[];
    ready=function(){
        this.down = false;
        $('#selectList').hide();
        let routerName = this.$route.path;
        this.orderReleaseData = [];
        if(window.localStorage.getItem(String(routerName))){
            this.query = JSON.parse(window.localStorage.getItem(String(routerName)));
        }else{
            this.query = {
                orderId:'',
                startTime:'',
                endTime:'',
                startAddress:'',
                endAddress:'',
                clientOrderId:'',
                orderStatus:this.orderStatusList[0].value
            }
        }
        if(window.localStorage.getItem(String(routerName + 'Boolean'))){
            let showData = JSON.parse(window.localStorage.getItem(String(routerName + 'Boolean')));
            this.startT = showData.startT;
            this.endT = showData.endT;
            this.startA = showData.startA;
            this.endA = showData.endA;
            this.clientN = showData.clientN;
            this.orderS = showData.orderS;
        }else{
            this.startT = false;
            this.endT = false;
            this.startA = false;
            this.endA = false;
            this.clientN = false;
            this.orderS = false;
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

        $('#orderReleaseManage_startTime').datetimepicker();
        $('#orderReleaseManage_endTime').datetimepicker();

        var $table = $('#orderReleaseManage_table').bootstrapTable({
            dataField: "rows",
            sidePagination: "client",
            buttonsAlign: "right",
            showAllColumns:true,
            showColumns:true,
            columns: [
                {field: "cspOrderId",title: "订单编号", sortable: true,order: "desc",align: "center"},
                {
                    field: 'template1',
                    title: '发货地址',
                    formatter: function operateFormatter(value, row, index) {
                        var st:string=row.startAddress;
                        if(st.length>10){
                            var bb=st.substr(0,10)+"..."
                            var aa=`<a href="javascript:;" data-toggle="tooltip" title="${st}">${bb}</a>`
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
                        var st:string=row.endAddress;
                        if(st.length>10){
                            var bb=st.substr(0,10)+"..."
                            var aa=`<a href="javascript:;" data-toggle="tooltip" title="${st}">${bb}</a>`
                        }else{
                            var aa=`${st}`;
                        }
                        return aa
                    },
                    events: {
                    },
                },
                {field: "goodsName",title: "货物名称",align: "center"},
                {field: "goodsNum",title: "货物数量",align: "center"},
                {field: "carLength",title: "所需车长",align: "center"},
                {field: "cspOrderTime",title: "发货发布时间",sortable: true,align: "center",},
                {field: "responseTime",title: "紧急程度",sortable: true,align: "center",},
                {
                    field: 'template3',
                    title: '订单状态',
                    sortable: true,
                    align: "center",
                    formatter: function operateFormatter(value, row, index) {
                        var st=row.status;
                        if(st=="未处理"){
                          return `<div><span class="redPoint"></span>未处理</div>`
                        }else if(st=="已处理"){
                            return `<div><span class="greenPoint"></span>已处理</div>`
                        }else if(st=="订单终结"){
                            return `<div><span class="orangePoint"></span>订单终结</div>`
                        }
                    },
                    events: {
                    },
                },
                // {field: "clientOrderId",title: "销售编号",align: "center"},
                {
                    field: 'template',
                    title: '操作',
                    align: "center",
                    formatter: function operateFormatter(value, row, index) {
                        var bb=`<a class="detailOrder" href='javascript:void(0);' title="查看详情"><i class='glyphicon glyphicon-eye-open text-info m-l-xs'></i></a>`;
                        var cc=`<a class="editOrder" href='javascript:void(0);' title='跳转'><i class='glyphicon glyphicon-edit text-info m-l-xs'></i></a>`;
                        var ee=`<div class="operate" unselectable="on" onselectstart="return false;" style="-moz-user-select:none;">
                        <a title='更多操作'><i class='glyphicon glyphicon-option-horizontal text-danger m-l-xs'></i></a>
                        <ul id="menu${index}" class="menuitem" >
                        <li class="remove"><span>删除</span></li>
                        <li class="endOrder"><span>终结</span></li>
                        <li class="copyOrder"><span>复制</span></li>
                        </ul>
                        </div>`;
                        var ff=`<div class="operate" unselectable="on" onselectstart="return false;" style="-moz-user-select:none;">
                        <a title='更多操作' ><i class='glyphicon glyphicon-option-horizontal text-danger m-l-xs'></i></a>
                        <ul id="menu${index}" class="menuitem" >
                        <li class="copyOrder"><span>复制</span></li>
                        </ul>
                        </div>`;
                        switch(row.status){
                            case'未处理':return bb+ee;
                            case'已处理':return cc+ff;
                            default:return bb+ff;
                        }
                        
                    },
                    events: {
                        /**
                         * 显隐菜单
                         */
                        'click .operate': (e, value, row, index) =>{
                            for(var i=0;i<this.count;i++){
                                if(i==Number(index)){
                                 $(`#menu${index}`).toggle();
                                }else{
                                 $(`#menu${i}`).hide();
                                }
                            }
                            if(index>=(this.count-2) && row.status=="未处理"){
                                $('.menuitem').addClass('menuitemtop')
                            }else{
                                $('.menuitem').removeClass('menuitemtop')
                            }
                        },
                       
                        /**
                         * 订单终结
                         */
                        'click .endOrder': (e, value, row, index) =>{
                            bootbox.confirm("确认终结该订单吗？",(result)=>{
                                if(result){
                                    dataService().CspOrder.editCspOrder(row.id).then((res)=>{
                                        this.$broadcast('reset');
                                        this.load(this.skip,this.count);
                                    });
                                }else{
                                    return;
                                }
                            });
                        },
                        /**
                         * 生成订单
                         */
                        'click .generateOrder': (e, value, row, index) =>{
                            router.go('orderReleaseAdd/?id='+'&name=add');
                        },
                        /**
                         * 复制订单
                         */
                        'click .copyOrder': (e, value, row, index) =>{
                            router.go('orderReleaseAdd/?id='+ row.id+'&name=copy');
                        },

                        /**
                         * 查看详情
                         */
                       'click .detailOrder':(e,value,row,index)=>{
                            router.go('orderReleaseDetail/?id='+row.id+'&status='+row.status+'&name=detail');
                        },

                        'click .editOrder':(e,value,row,index)=>{
                            router.go('orderReleaseDetail/?id='+row.id+'&status='+row.status+'&name=edit');
                        },

                        /**
                         * 删除订单
                         */
                        'click .remove':(e,value,row,index)=>{
                            bootbox.confirm("确认删除该订单吗？",(result)=>{
                                if(result){
                                    dataService().CspOrder.deleteCspOrder(row.id).then((res)=>{
                                        if(res.success){
                                            if(this.orderReleaseData.length == 1){
                                                console.log(this.currentPage);
                                                this.currentPage = this.currentPage -1;
                                                this.$broadcast('changeCurrentPage',{currentPage:this.currentPage});
                                                this.skip = (this.currentPage - 1)*10;
                                                this.load(this.skip,this.count);
                                            }else{
                                                this.load(this.skip,this.count);
                                            }
                                        }
                                    });
                                }else{
                                    return;
                                }
                            })
                        },
                    },
                }
            ],
            data: [],
            onClickRow: function(row, $element) {
                //$element是当前tr的jquery对象
                // $element.css("background-color", "green");
            },//单击row事件
            actionFormatter:function(value, row, index){
                console.info('tyv')
            },
            locale: "zh-CN"//中文支持,
        });
        /**
         * 加载数据
         */
        this.load(this.skip,this.count);
        this.getCspOrderCount();

    }

    /* 获取概述区域数据 */
    getCspOrderCount = function(){
        dataService().CspOrder.getCspOrderCount().then((res)=>{
            this.untreated = res.untreated;
            this.processed = res.processed;
            this.end = res.end;
        });
    }

    /**
     * 请求数据
     */
    load = function(skip,count){
        dataService().CspOrder.getCspOrderList(this.query.orderId,this.query.orderStatus,this.query.startTime,this.query.endTime,this.query.startAddress,this.query.endAddress,skip,count,this.query.clientOrderId).then((res)=>{            
            this.orderReleaseData = res.data;
            $('#orderReleaseManage_table').bootstrapTable('load', this.orderReleaseData);
            this.seeks=false;
            this.bseeks = false;
            var totalItems=res.total;
            this.Records= totalItems==0?0.5:totalItems;
            this.showRecords=totalItems==0?false:true;
        },function(rej){
            this.seeks = false;
            this.bseeks = false;
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

    /**重置 */
    resetQuery = function(){
        this.query.startTime='',
        this.query.endTime='',
        this.query.startAddress='',
        this.query.endAddress='',
        this.query.clientOrderId='',
        this.query.orderStatus=this.orderStatusList[0].value;
    }
    
  
    /**
     * 查询1
     */
    queryOrderRelease= function(){
        this.seeks=true;
        this.$broadcast('reset');
        this.skip = 0;
        this.currentPage = 1; 
        this.localHistory(this.$route);
        this.resetQuery();
        this.localPage(this.skip,this.count,this.currentPage);
        this.load(this.skip,this.count);
    }
  /**
     * 查询2
     */
    QueryOrderRelease= function(){
       this.bseeks = true;
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
                window.localStorage.setItem(String(routerName+'Boolean'),JSON.stringify({
                    startT: this.startT,
                    endT: this.endT,
                    startA: this.startA,
                    endA: this.endA,
                    clientN: this.clientN,
                    orderS: this.orderS,
                }));
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
    LinkToOrderReleaseAdd=()=>{
        var rowSelected;
        rowSelected=$('#orderReleaseManage_table').bootstrapTable('getSelections')[0];
        if(rowSelected){
            router.go('orderReleaseAdd/?id='+ rowSelected.id+'&name=copy');
        }else{
            router.go('orderReleaseAdd/?id='+'&name=add');
        }
    }
       /* 跳转批量导入界面 */
       batchImport=()=>{
        router.go('batchImport');
    }

}

  