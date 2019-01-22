import { VueComponent,Prop } from 'vue-typescript'
import * as VueRouter from 'vue-router'
import {dataService} from '../../service/dataService'
Vue.use(VueRouter);
var router = new VueRouter();

declare var $:any;
declare var bootstrapTable: JQueryStatic;;

@VueComponent({
    template: require('./newInquiryReleaseManage.html'),
    style: require('./newInquiryReleaseManage.scss')
})
export class NewInquiryReleaseManageComponent extends Vue {
    el:'#inquiryReleaseManage'
    components:({
        vclienttable:any,
    })
    @Prop
    Records=1;
    showRecords=true;

    skip:number;
    count:number;
    currentPage:number;
    seeks = true;
    bseeks = true;
    down:boolean = false;
    startT:boolean=false; 
    endT:boolean=false; 
    startA:boolean=false;
    endA:boolean=false;
    inquiryS:boolean=false;
    stateDropDown=[{text:'全部',value:''},{text:'待受理',value:"0"},{text:'已受理',value:"1"},{text:'终结',value:"2"}];
    /* 概述区域 */
    untreated:number=null;
    processed:number=null;
    end:number=null;
    /* 查询 */
    query = {
        inquiryId:'',
        inquiryChildId:'',
        startTime:'',
        endTime:'',
        startAddress:'',
        endAddress:'',
        inquiryState:this.stateDropDown[0].value,
    }
    /**列表数据 */
    inquiryReleaseData=[];
    /**
     * 是否是管理员
     */
    isAdmin:string = "";
    /**
     * web权限
     */
    webAuthorize:string = "";
    
    ready(){
        this.down = false;
        $('#selectList').hide();
        let routerName = this.$route.path;
        this.isAdmin = sessionStorage.getItem("isAdmin");
        this.webAuthorize = sessionStorage.getItem("webAuthorize");
        if(window.localStorage.getItem(String(routerName))){
            this.query = JSON.parse(window.localStorage.getItem(String(routerName)));
        }else{
            this.query = {
                inquiryId:'',
                inquiryChildId:'',
                startTime:'',
                endTime:'',
                startAddress:'',
                endAddress:'',
                inquiryState:this.stateDropDown[0].value,
            }
            
        }
        if(window.localStorage.getItem(String(routerName + 'Boolean'))){
            let showData = JSON.parse(window.localStorage.getItem(String(routerName + 'Boolean')));
            this.startT = showData.startT;
            this.endT = showData.endT;
            this.startA = showData.startA;
            this.endA = showData.endA;
            this.inquiryS = showData.inquiryS;
        }else{
            this.startT = false;
            this.endT = false;
            this.startA = false;
            this.endA = false;
            this.inquiryS = false;
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
        
        $('#inquiryReleaseManage_startTime').datetimepicker();
        $("#inquiryReleaseManage_endTime").datetimepicker();
        var $table = $('#inquiryReleaseManage_table').bootstrapTable({
                dataField: "rows",
                sidePagination: "client",
                buttonsAlign: "right",
                showAllColumns:true,
                showColumns:true,
                columns: [
                    {field: "cspInquiryId",title: "总询价编号", sortable: true,align: "center",order: "desc"},
                    {field: "cspInquiryChildId",title: "子询价编号",align: "center",sortable: true},
                    {field: "startAddress",title: "发货地址",
                        formatter:function preferenceFormatter(value, row, index) {  
                            var nameString = "";
                            var area;
                            if (value.length > 10) {  
                                nameString = value.substring(0,10) + '...';
                                area = `<a href="javascript:;" title="${value}">${nameString}</a>`;
                            } else{  
                                area = `${value}`;
                            }  
                            return area;
                        }
                    },
                    {field: "endAddress",title: "送货地址",
                        formatter:function preferenceFormatter(value, row, index) {  
                            var nameString = ""; 
                            var area; 
                            if (value.length > 10) {  
                                nameString = value.substring(0,10) + '...';
                                area = `<a href="javascript:;" title="${value}">${nameString}</a>`;
                            } else{  
                                area = `${value}`;  
                            }  
                            return area;  
                        }
                    },
                    {field: "goodsName",title: "货物名称",align: "center",},
                    {field: "goodsNum",title: "货物数量",align: "center"},
                    {field: "carLength",title: "所需车长",align: "center"},
                    {field: "cspInquiryTime",title: "询价时间",sortable: true,align: "center",},
                    {field: "responseTime",title: "紧急程度",sortable: true,align: "center",},
                    {
                        field: 'template3',
                        title: '订单状态',
                        sortable: true,
                        align: "center",
                        formatter: function operateFormatter(value, row, index) {
                            var st=row.status;
                            if(st=="未处理"){
                              return `<div><span class="redPoint"></span>待受理</div>`
                            }else if(st=="已处理"){
                                return `<div><span class="greenPoint"></span>已受理</div>`
                            }else if(st=="询价终结"){
                                return `<div><span class="orangePoint"></span>询价终结</div>`
                            }
                        },
                        events: {
                        },
                    },
                    {
                        field: 'template',
                        title: '操作',
                        align: "center",
                        formatter: (value, row, index) => {
                            var bb=`<a class="detailOrder" href='#!/app/inquiry/inquiryAdd/?id=${row.id}&name=detail' title='详情'><i class='glyphicon glyphicon-eye-open m-l-xs primary text-info'></i></a>`;
                            var cc=`<a href='#!/app/inquiry/inquiryAdd/?id=${row.id}&name=edit' title='编辑'><i class='glyphicon glyphicon-edit m-l-xs primary text-info'></i></a>`;
                            var ee=`<div class="operate" unselectable="on" onselectstart="return false;" style="-moz-user-select:none;">
                            <a title='更多操作'><i class='glyphicon glyphicon-option-horizontal text-danger m-l-xs'></i></a>
                            <ul id="menu${index}" class="menuitem" >
                            <li class="remove"><span>删除</span></li>
                            <li class="endOrder"><span>终结</span></li>
                            <li class="copyInquiry"><span>复制</span></li>
                            <li class="copyOrder"><span>生成订单</span></li>
                            </ul>
                            </div>`;
                            var eee=`<div class="operate" unselectable="on" onselectstart="return false;" style="-moz-user-select:none;">
                            <a title='更多操作'><i class='glyphicon glyphicon-option-horizontal text-danger m-l-xs'></i></a>
                            <ul id="menu${index}" class="menuitem" >
                            <li class="remove"><span>删除</span></li>
                            <li class="endOrder"><span>终结</span></li>
                            <li class="copyInquiry"><span>复制</span></li>
                            </ul>
                            </div>`;
                            var ff=`<div class="operate" unselectable="on" onselectstart="return false;" style="-moz-user-select:none;">
                            <a title='更多操作' ><i class='glyphicon glyphicon-option-horizontal text-danger m-l-xs'></i></a>
                            <ul id="menu${index}" class="menuitem" >
                            <li class="copyInquiry"><span>复制</span></li>
                            <li class="copyOrder"><span>生成订单</span></li>
                            </ul>
                            </div>`;
                            var fff=`<div class="operate" unselectable="on" onselectstart="return false;" style="-moz-user-select:none;">
                            <a title='更多操作' ><i class='glyphicon glyphicon-option-horizontal text-danger m-l-xs'></i></a>
                            <ul id="menu${index}" class="menuitem" >
                            <li class="copyInquiry"><span>复制</span></li>
                            </ul>
                            </div>`;
                            if(this.webAuthorize.indexOf('2')>-1 || this.isAdmin == 'true'){
                                switch(row.status){
                                    case'未处理':return bb+ee;
                                    case'已处理':return cc+ff;
                                    default:return bb+ff;
                                }
                            }else{
                                switch(row.status){
                                    case'未处理':return bb+eee;
                                    case'已处理':return cc+fff;
                                    default:return bb+fff;
                                }
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
                                // .operate .itemtop{
                                //     top:-37px;
                                // }
                                
                                // .operate .itemTop{
                                //     top:-91px;
                                // }
                                if(index>=(this.count-3)){
                                    if(row.status == '未处理'){
                                        $('.menuitem').removeClass('itemtop')
                                        $('.menuitem').addClass('itemTop')
                                    }else{
                                        $('.menuitem').removeClass('itemTop')
                                        $('.menuitem').addClass('itemtop')
                                    }
                                }else{
                                    $('.menuitem').removeClass('itemtop')
                                    $('.menuitem').removeClass('itemTop')
                                }
                            },
                            'click .endOrder':  (e, value, row, index)=> {
                                bootbox.confirm("确认终结该订单吗？",(bootboxResult)=>{
                                    if(bootboxResult){
                                        dataService().CspInquiry.editCspInquiry(row.id).then((res)=>{
                                            this.load(this.skip,this.count);
                                        },(rej)=>{});
                                    }else{
                                        return;
                                    }
                                })
                            },
                            'click .remove':(e,value,row,index)=>{
                                bootbox.confirm("确认删除该订单吗？",(bootboxResult)=>{
                                    if(bootboxResult){
                                        dataService().CspInquiry.deleteCspInquiry(row.id).then((res)=>{
                                            if(res.success){
                                                if(this.inquiryReleaseData.length == 1){
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
                            /**
                             * 复制
                             */
                            'click .copyInquiry': (e, value, row, index) =>{
                                router.go('inquiryAdd/?id='+row.id+'&name=copy');
                            },
                            /**
                             * 生成订单
                             */
                            'click .copyOrder': (e, value, row, index) =>{
                                router.go('../../app/order/orderReleaseAdd/?id='+row.id+'&name=copyInquiryRelease');
                            },
                        },
                    }
                ],
                data: [],
                //单击row事件
                onClickRow: (row, $element)=> {
                    // if(!row["select"]){
                    //     $('#inquiryReleaseManage_toOrderAdd').removeAttr('disabled');
                    // }else{
                    //     $('#inquiryReleaseManage_toOrderAdd').attr('disabled', 'true');
                    // }
                },
                //单击单选框时触发的操作
                onCheck:function(row){
                    // $('#inquiryReleaseManage_toOrderAdd').removeAttr('disabled');
                },
                //取消单选框
                onUncheck:function(row){
                    // $('#inquiryReleaseManage_toOrderAdd').attr('disabled', 'true');
                },
                actionFormatter:function(value, row, index){
                    // console.info('tyv')
                },
                locale: "zh-CN"//中文支持,
            });
        //表格 初始 加载数据 'MM/YYYY':
        this.load(this.skip,this.count);
        this.getCspInquiryCount();
     }

     /* 获取概述区域 */
     getCspInquiryCount = function(){
        dataService().CspInquiry.getCspInquiryCount().then((res)=>{
            this.untreated = res.untreated;
            this.processed = res.processed;
            this.end = res.end;
        });
     }
   
    //请求数据
    load=function(skip,count){
        dataService().CspInquiry.getCspInquiryList(this.query.inquiryId,this.query.inquiryChildId,this.query.inquiryState,this.query.startTime,this.query.endTime,this.query.startAddress,this.query.endAddress,skip,count).then((res)=>{
            this.inquiryReleaseData = res.data;       
            $('#inquiryReleaseManage_table').bootstrapTable('load', this.inquiryReleaseData);
            this.seeks=false;
            this.bseeks = false;
            var totalItems=res.total;
            this.Records= totalItems==0?0.5:totalItems;
            this.showRecords=totalItems==0?false:true;
        },function(rej){
            this.seeks=false;
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

    /**查询 */
    queryCode = function(){
        this.seeks=true;
        this.resetQuery();
        this.skip = 0;
        this.currentPage = 1;
        this.$broadcast('reset');
        this.localHistory(this.$route);
        this.localPage(this.skip,this.count,this.currentPage);
        this.load(this.skip,this.count);
    }
    //高级查询调用
    queryUsers=function(){
        this.bseeks = true;
        this.skip = 0;
        this.currentPage = 1;
        this.$broadcast('reset');
        this.localHistory(this.$route);
        this.localPage(this.skip,this.count,this.currentPage);
        this.load(this.skip,this.count);
    }


    /**重置 */
    resetQuery = function(){
        this.query.startTime = '';
        this.query.endTime = '';
        this.query.startAddress = '';
        this.query.endAddress = '';
        this.query.inquiryState = this.stateDropDown[0].value;
    }

    //存储搜索条件
    localHistory = function(state){
        if(state){
            let routerName = state.path;
            if(routerName.search("inquiry")>0){
                window.localStorage.setItem(String(routerName),JSON.stringify(this.query));
                window.localStorage.setItem(String(routerName+'Boolean'),JSON.stringify({
                    startT: this.startT,
                    endT: this.endT,
                    startA: this.startA,
                    endA: this.endA,
                    inquiryS: this.inquiryS
                }));
            };
        }
    }

    //存储页数
    localPage = function(skip,count,currentPage){
        var routerName = this.$route.path;
        window.localStorage.setItem(String(routerName+'Page'),JSON.stringify({skip:skip,count:count,currentPage:currentPage}));
    }
    
    //询价单新增
    LinckToInquiryAdd=function(){
        router.go('inquiryAdd/?id='+'&name=add');
    }
    /* 询价单新增 */
    // LinckToInquiryAdd=function(){
    //     var rowSelected;
    //     rowSelected=$('#inquiryReleaseManage_table').bootstrapTable('getSelections')[0];
    //     if($('#inquiryReleaseManage_table').bootstrapTable('getSelections').length>0){
    //         router.go('inquiryAdd/?id='+rowSelected.id+'&name=copy');
    //     }else{
    //         router.go('inquiryAdd/?id='+'&name=add');
    //     }
    // }
    
    //订单新增按钮点击触发
    LinckToOrderAdd=function(){
        var rowSelectedToOrder;
        rowSelectedToOrder=$('#inquiryReleaseManage_table').bootstrapTable('getSelections')[0];
        if($('#inquiryReleaseManage_table').bootstrapTable('getSelections').length>0){
            router.go('../../app/order/orderReleaseAdd/?id='+rowSelectedToOrder.id+'&name=copyInquiryRelease');
        }
    }
}