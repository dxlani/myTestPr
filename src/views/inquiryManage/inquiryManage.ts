import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import * as VueRouter from 'vue-router'
var VuePagination = require('v-pagination');
Vue.use(VuePagination);
var VueTables = require('vue-tables');
Vue.use(VueTables.client,{
    filterable:false,
    compileTemplates:true
});
var router = new VueRouter();

@VueComponent({
    template: require('./inquiryManage.html'),
})

export class InquiryManageComponent extends Vue {
    el:'#inquiryManage'
    components:({
        vclienttable:any,
    })
    @Prop
    Records=1;
    showRecords=true;
    skip=0;
    count=10;
    currentPage = 1;
    seeks=true;
   
    inquiryParameter={
        code:"",
        childCode:"",
        startTime:"",
        endTime:"",
        sendAddress:"",
        receiveAddress:""
    }
    /**
     * 询价单是否可以复制新增
     */
    // canAdd:boolean = false;

    ready(){
        let routerName = this.$route.path;
        if(window.localStorage.getItem(String(routerName))){
            this.inquiryParameter = JSON.parse(window.localStorage.getItem(String(routerName)))
        }else{
            this.inquiryParameter={
                code:"",
                childCode:"",
                startTime:"",
                endTime:"",
                sendAddress:"",
                receiveAddress:""
            };
        }
        if(window.localStorage.getItem(String(routerName + 'Page'))){
            let pageData = JSON.parse(window.localStorage.getItem(String(routerName + 'Page')));
            this.skip = pageData.skip;
            this.count = pageData.count;
        }else{
            this.skip = 0;
            this.count = 10;
        }
    
        $('p').remove('.VuePagination__count');
        $('#inquiryManage_inquiryStartTime').datetimepicker();
        $("#inquiryManage_inquiryEndTime").datetimepicker();

        this.$on('pageIndexChange', function(event) {
            this.count = event.pageSize;
            this.skip = event.pageIndex;
            this.currentPage = event.currentPage;
            this.localPage(this.skip,this.count,this.currentPage)
            this.load(this.inquiryParameter,this.skip,this.count);
        });

        $('#inquiryManage_table').bootstrapTable({
            dataField: "rows",
            clickToSelect:true,
            singleSelect:true,
            cardView:false,
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
                        var aa=` <a title='查看详情' href="javascript:void(0)" class='orderDetail'><i class='glyphicon glyphicon-eye-open text-info'></i></a>`;
                        return aa;
                    },
                    events: {
                        'click .orderDetail': function (e, value, row, index) {
                            router.go('inquiryCheck/?id=' + row.id + '&status=' + row.status);
                        },
                    },
                }
            ],
            data: [],
            //选中row事件
            onCheck: (row, $element) =>{
                // this.canAdd = true;
            },
            //取消选中事件
            onUncheck:(row)=>{
                // this.canAdd = false;
            },
            actionFormatter:function(value, row, index){
                
            },
            locale: "zh-CN"
        });
        this.load(this.inquiryParameter,this.skip,this.count);
    }
    /**
     * 加载数据
     */
    load(inquiryParameter,skip,count){
        // this.canAdd = false;
        dataService().Inquiry.getInquiryList(inquiryParameter.code,inquiryParameter.childCode,inquiryParameter.sendAddress,inquiryParameter.receiveAddress,"8,11",inquiryParameter.startTime,inquiryParameter.endTime,skip,count).then(
            (res)=>{
                if(res.length==0){ 
                    this.seeks=true; 
                    return
                }
                res.data.forEach((item) => {
                    if(item.statusStr == "中标待定" || item.statusStr== "已审核"){
                        item.statusStr = "待确认";
                    }
                });
                var data=res.data;
                $('#inquiryManage_table').bootstrapTable('load', data);
                this.seeks=true;
                var total=Number(res.total);
                this.Records=total==0?0.5:total;
                this.showRecords=total==0?false:true;
            },function(rej){
                this.seeks=true;
            }
        );
    }
    query=function(){
       this.seeks=false;
       this.skip = 0;
       this.currentPage = 1;
       this.$broadcast('reset');
       this.localHistory(this.$route);
       this.localPage(this.skip,this.count,this.currentPage);
       this.load(this.inquiryParameter,this.skip,this.count);
    }

    //存储搜索条件
    localHistory = function(state){
        if(state){
            let routerName = state.path;
            if(routerName.search("inquiry")>0){
                window.localStorage.setItem(String(routerName),JSON.stringify(this.inquiryParameter));
            };
        }
    }

    //存储页数
    localPage = function(skip,count,currentPage){
        var routerName = this.$route.path;
        window.localStorage.setItem(String(routerName+'Page'),JSON.stringify({skip:skip,count:count,currentPage:currentPage}));
    }
    /**
     * 询价单新增
     */
    LinckToInquiryAdd=function(){
        var rowSelected;
        rowSelected=$('#inquiryManage_table').bootstrapTable('getSelections')[0];
        if($('#inquiryManage_table').bootstrapTable('getSelections').length>0){
            router.go('inquiryAdd/?id=' + rowSelected.id + '&name=copyInquiry' + '&listName=manageList');
        }else{
            router.go('inquiryAdd/?id=' + '&name=add'+'&listName=manageList');
        }
    }
}
