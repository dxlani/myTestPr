import { VueComponent,Prop } from 'vue-typescript'
import * as VueRouter from 'vue-router'
import {dataService} from '../../service/dataService'
Vue.use(VueRouter);
var router = new VueRouter();

declare var bootstrapTable: JQueryStatic;;

@VueComponent({
    template: require('./inquiryReleaseManage.html')
})
export class InquiryReleaseManageComponent extends Vue {
    el:'#inquiryReleaseManage'
    components:({
        vclienttable:any,
    })
    @Prop
    Records=1;
    currentPage;
    
    skip:number;
    count:number;
    seeks = true;
    stateDropDown=[
        {text:'待接单',value:"0"},
        {text:'待报价',value:"2,4,5,6,7"},
        {text:'已终结',value:"2"}
    ] 

    query = {
        startTime:'',
        endTime:'',
        startAddress:'',
        endAddress:'',
        inquiryId:'',
        inquiryChildId:'',
        inquiryState:this.stateDropDown[0].value,
    }
    /**列表数据 */
    inquiryReleaseData=[];
    /**
     * 询价单是否可以复制新增
     */
    // canAdd:boolean = false;
    /**
     * 判断表格
     */
    tab:string = "";
    
    ready=function(){
        let routerName = this.$route.path;
        if(window.localStorage.getItem(String(routerName))){
            this.query = JSON.parse(window.localStorage.getItem(String(routerName)));
        }else{
            this.query = {
                startTime:'',
                endTime:'',
                startAddress:'',
                endAddress:'',
                inquiryId:'',
                inquiryChildId:'',
                inquiryState:this.stateDropDown[0].value,
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
        $('#inquiryReleaseManage_startTime').datetimepicker();
        $("#inquiryReleaseManage_endTime").datetimepicker();
        this.load(this.skip,this.count);
     }
   
    //请求数据
    load(skip,count){
        // this.canAdd = false;
        if(this.query.inquiryState == "0" || this.query.inquiryState == "2"){
            $('#inquiryReleaseManage_table').bootstrapTable({
                dataField: "rows",
                clickToSelect:true,
                singleSelect:true,
                sidePagination: "client",
                buttonsAlign: "left",
                columns: [
                    {field: "select",title: "",checkbox: true,width: 20,align: "center",valign: "middle"},
                    {field: "cspInquiryId",title: "总询价编号", sortable: true,order: "desc"},
                    {field: "cspInquiryChildId",title: "子询价编号",sortable: true},
                    {field: "startAddress",title: "发货地址",sortable: true,},
                    {field: "endAddress",title: "送货地址",sortable: true,},
                    {field: "goodsName",title: "货物名称",sortable: true,},
                    {field: "goodsNum",title: "货物数量",sortable: true,},
                    {field: "carLength",title: "所需车长",sortable: true,},
                    {field: "cspInquiryTime",title: "询价时间",sortable: true,},
                    {field: "responseTime",title: "紧急程度",sortable: true,},
                    {field: "status",title: "询价状态",sortable: true,},
                    {
                        field: 'template',
                        title: '操作',
                        formatter: function operateFormatter(value, row, index) {
                            var aa=`<a class="inquiryDetail" title='查看详情'><i class='glyphicon glyphicon-eye-open m-l-xs primary text-info'></i></a>`;
                            return aa;
                        },
                        events: {
                            'click .inquiryDetail': function (e, value, row, index) {
                                router.go('inquiryAdd/?id=' + row.id + '&status=' + row.status + '&name=' + 'detail');
                            },
                        },
                    }
                ],
                data: [],
                //选中row事件
                onCheck: (row, $element) =>{
                    this.tab = '1';
                 },
                 //取消选中事件
                 onUncheck:(row)=>{
                     this.tab = '';
                 },
                locale: "zh-CN"
            });
            dataService().CspInquiry.getCspInquiryList(this.query.inquiryId,this.query.inquiryChildId,this.query.inquiryState,this.query.startTime,this.query.endTime,this.query.startAddress,this.query.endAddress,skip,count).then((res)=>{
                this.inquiryReleaseData = res.data;
                this.inquiryReleaseData.forEach(item => {
                    if(item.status == "未处理"){
                        item.status = "待接单"
                    }else if(item.status == "询价终结"){
                        item.status = "已终结"
                    }
                });    
                $('#inquiryReleaseManage_table').bootstrapTable('load', this.inquiryReleaseData);
                this.seeks=false;
                var totalItems=res.total;
                this.Records= totalItems==0?0.5:totalItems;
                // this.showRecords=totalItems==0?false:true;
            },function(rej){
                this.seeks=false;
            });
        }else{
            $('#inquiryReleaseManage_table').bootstrapTable({
                dataField: "rows",
                clickToSelect:true,
                singleSelect:true,
                sidePagination: "client",
                buttonsAlign: "left",
                columns: [
                    {field: "select",title: "",checkbox: true,width: 20,align: "center",valign: "middle"},
                    {field: "inquiryId",title: "总询价编号",width: 20,align: "center"},
                    {field: "inquiryChildId",title: "子询价编号", order: "desc"},
                    {field: "originAddress",title: "发货地址",titleTooltip: "this is name"},
                    {field: "destinationAddress",title: "送货地址",},
                    {field: "goodsName",title: "货物名称",},
                    {field: "quantityOfGoods",title: "货物数量",},
                    {field: "carLength",title: "所需车长",},
                    {field: "creationTime",title: "下单时间",},
                    {field: "statusStr",title: "询价状态",},
                    {field: "responseTime",title: "紧急程度",},
                    {
                        field: 'template',
                        title: '操作',
                        formatter: function operateFormatter(value, row, index) {
                            var aa=` <a title='查看详情' href="javascript:void(0)" class='inquiryDetail'><i class='glyphicon glyphicon-eye-open text-info'></i></a>`;
                            return aa;
                        },
                        events: {
                            'click .inquiryDetail': function (e, value, row, index) {
                                router.go('inquiryCheck/?id=' + row.id + '&status=' + row.status);
                            },
                        },
                    }
                ],
                data: [],
                //选中row事件
                onCheck: (row, $element) =>{
                   this.tab = '2';
                },
                //取消选中事件
                onUncheck:(row)=>{
                    this.tab = '';
                },
                locale: "zh-CN"
            });
            dataService().Inquiry.getInquiryList(this.query.inquiryId,this.query.inquiryChildId,this.query.startAddress,this.query.endAddress,this.query.inquiryState,this.query.startTime,this.query.endTime,skip,count).then(
                (res)=>{
                    if(res.length==0){ 
                        this.seeks=false; 
                        return false
                    }
                    var data=res.data;
                    for(var i=0;i<data.length;i++){
                        var temp=this.stateDropDown.filter(t=>t.value.indexOf(data[i].status)>-1)[0];
                        data[i].statusStr=temp?temp.text:"";
                    }
                    $('#inquiryReleaseManage_table').bootstrapTable('load', data);
                    this.seeks=false;
                    var total=Number(res.total);
                    this.Records=total==0?0.5:total;
                    // this.showRecords=total==0?false:true;
                },function(rej){
                    this.seeks=false;
                }
            );
        }
    }
    //查询调用
    queryUsers=function(){
        $("#inquiryReleaseManage_table").bootstrapTable('destroy');
        this.seeks=true;
        this.skip = 0;
        this.currentPage = 1;
        this.$broadcast('reset');
        this.localHistory(this.$route);
        this.localPage(this.skip,this.count,this.currentPage);
        this.load(this.skip,this.count);
    }

    //存储搜索条件
    localHistory = function(state){
        if(state){
            let routerName = state.path;
            if(routerName.search("inquiry")>0){
                window.localStorage.setItem(String(routerName),JSON.stringify(this.query));

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
        var rowSelected;
        rowSelected=$('#inquiryReleaseManage_table').bootstrapTable('getSelections')[0];
        if($('#inquiryReleaseManage_table').bootstrapTable('getSelections').length>0){
            // dataService().Inquiry.getIsEnterprise().then((res)=>{
            //     console.log(res)
            // }).then(()=>{
                if(this.tab == '1'){
                    router.go('inquiryAdd/?id=' + rowSelected.id + '&name=copy' + '&listName=releaseList');
                }else if(this.tab == '2'){
                    router.go('inquiryAdd/?id=' + rowSelected.id + '&name=copyInquiry' + '&listName=releaseList');
                }
            // });
        }else{
            router.go('inquiryAdd/?id='+'&name=add'+'&listName=releaseList');
        }
    }

}
