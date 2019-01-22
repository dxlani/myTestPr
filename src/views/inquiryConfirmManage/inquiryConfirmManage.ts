import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import * as VueRouter from 'vue-router'
var router = new VueRouter();

@VueComponent({
    template: require('./inquiryConfirmManage.html'),
    style: require('./inquiryConfirmManage.scss')
})

export class InquiryConfirmManageComponent extends Vue {
    el:'#inquiryConfirmManage'
    @Prop
    Records=1;
    skip:number;
    count:number;
    seeks = true;
    showRecords=true;
    currentPage;
    /**
     * 是否是管理员
     */
    isAdmin:string = "";
    /**
     * web权限
     */
    webAuthorize:string = "";
    /**
     * 询价状态下拉
     */
    statusList=[
        {text:"全部",value:"9,10"},
        {text:"已中标",value:"9"},
        {text:"未中标",value:"10"}];
    /**
     * 查询条件
     */
    queryParam = {
        startTime:'',
        endTime:'',
        startAddress:'',
        endAddress:'',
        inquiryId:'',
        inquiryChildId:'',
        inquiryState:this.statusList[0].value,
    }
    /**
     * 列表数据 
     */
    inquiryConfirmData=[];
    /**
     * 询价单是否可以复制新增
     */
    // canAdd:boolean = false;

    ready(){
        let routerName = this.$route.path;
        this.isAdmin=sessionStorage.getItem("isAdmin");
        this.webAuthorize=sessionStorage.getItem("webAuthorize");
        if(window.localStorage.getItem(String(routerName))){
            this.queryParam = JSON.parse(window.localStorage.getItem(String(routerName)));
        }else{
            this.queryParam = {
                startTime:'',
                endTime:'',
                startAddress:'',
                endAddress:'',
                inquiryId:'',
                inquiryChildId:'',
                inquiryState:this.statusList[0].value,
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
        $('#inquiryConfirmManage_startTime').datetimepicker();
        $("#inquiryConfirmManage_endTime").datetimepicker();
        $('#inquiryConfirmManage_table').bootstrapTable({
            dataField: "rows",
            clickToSelect:true,
            singleSelect:true,
            buttonsAlign: "center",
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
                        var bb=`<a class="detailOrder" href='#!/app/inquiry/inquiryCheck/?id=${row.id}&status=${row.status}' title='查看详情'><i class='glyphicon glyphicon-eye-open m-l-xs primary text-info'></i></a>`;
                        return bb;
                    },
                }
            ],
            data: [],
            //选中row事件
            onCheck: (row, $element) =>{
                // this.canAdd = true;
                // bootbox.alert('当前询价单状态不可复制新增询价单')
            },
            //取消选中事件
            onUncheck:(row)=>{
                // this.canAdd = false;
            },
            locale: "zh-CN"
        });
        this.load(this.skip,this.count);
    }
    /**
     * 加载数据
     */
    load(skip,count){
        // this.canAdd = false;
        dataService().Inquiry.getInquiryList(this.queryParam.inquiryId,this.queryParam.inquiryChildId,this.queryParam.startAddress,this.queryParam.endAddress,this.queryParam.inquiryState,this.queryParam.startTime,this.queryParam.endTime,skip,count).then((res)=>{
            this.inquiryConfirmData = res.data;
            $('#inquiryConfirmManage_table').bootstrapTable('load', this.inquiryConfirmData);
            this.seeks=false;
            var totalItems=res.total;
            this.Records= totalItems==0?0.5:totalItems;
        },function(rej){
            this.seeks=false;
        });

    }
    /**
     * 查询
     */
    query(){
       this.load(this.skip,this.count);
    }
    /**
     * 存储搜索条件
     */
    localHistory(state){
        if(state){
            let routerName = state.path;
            if(routerName.search("inquiry")>0){
                window.localStorage.setItem(String(routerName),JSON.stringify(this.queryParam));
            };
        }
    }

    /**
     * 存储页数
     */
    localPage(skip,count,currentPage){
        var routerName = this.$route.path;
        window.localStorage.setItem(String(routerName+'Page'),JSON.stringify({skip:skip,count:count,currentPage:currentPage}));
    }

    /**
     * 询价单新增
     */
    LinckToInquiryAdd=function(){
        var rowSelected;
        rowSelected=$('#inquiryConfirmManage_table').bootstrapTable('getSelections')[0];
        if($('#inquiryConfirmManage_table').bootstrapTable('getSelections').length>0){
            router.go('inquiryAdd/?id=' + rowSelected.id + '&name=copyInquiry'+'&listName=confirmList');
        }else{
            router.go('inquiryAdd/?id='+'&name=add'+'&listName=confirmList');
        }
    }
}
