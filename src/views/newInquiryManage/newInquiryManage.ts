import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import * as VueRouter from 'vue-router'

var VueTables = require('vue-tables');
Vue.use(VueTables.client,{
    filterable:false,
    compileTemplates:true
});
var router = new VueRouter();

@VueComponent({
    template: require('./newInquiryManage.html'),
    style: require('./newInquiryManage.scss')
})

export class NewInquiryManageComponent extends Vue {
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
    bseeks = true;
    down:boolean = false;
    startT:boolean=false; 
    endT:boolean=false; 
    startA:boolean=false;
    endA:boolean=false;
    inquiryS:boolean=false;
    statusList=[
        {text:"全部",value:""},
        {text:"报价中",value:"2,4,5,6,7"},
        // {text:"退回下单",value:"3"},
        {text:"待确认",value:"8,11"},
        // {text:"已报价",value:"8"},
        {text:"已中标",value:"9"},
        {text:"未中标",value:"10"},
        // {text:"待确认",value:"11"},
        {text:"询价终结",value:"12"},
    ];
    /* 概述区域 */
    quote:number = null;
    successfulQuote:number = null;
    successfulBidder:number = null;
    unsuccessfulBidders:number = null;
    pending:number = null;
    end:number = null;
   
    inquiryParameter={
        inquiryId:"",
        inquiryChildId:'',
        status:this.statusList[0].value,
        startTime:"",
        endTime:"",
        sendAddress:"",
        receiveAddress:""
    }
     ready=function(){
        this.down = false;
        $('#selectList').hide();
        let routerName = this.$route.path;
        if(window.localStorage.getItem(String(routerName))){
            this.inquiryParameter = JSON.parse(window.localStorage.getItem(String(routerName)))
        }else{
            this.inquiryParameter={
                inquiryId:"",
                inquiryChildId:"",
                status:this.statusList[0].value,
                startTime:"",
                endTime:"",
                sendAddress:"",
                receiveAddress:""
            };
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

         var $table = $('#inquiryManage_table').bootstrapTable({
                // url: "index.php",//数据源
                dataField: "rows",//服务端返回数据键值 就是说记录放的键值是rows，分页时使用总记录数的键值为total
                clickToSelect:true,
                singleSelect:true,
                cardView:false,
                sidePagination: "client",//服务端分页
                buttonsAlign: "right",//按钮对齐方式 子询价编号 发货地址 送货地址 货物名称 货物数量 所需车长 询价时间 紧急程度 询价状态
                showAllColumns:true,
                showColumns:true,
                columns: [
                    
                    {field: "inquiryId",title: "总询价编号",width: 20,align: "center"},
                    {field: "inquiryChildId",title: "子询价编号", order: "desc",align: "center"},
                    {field: "originAddress",title: "发货地址",
                        formatter:function preferenceFormatter(value, row, index) {  
                            var nameString = ""; 
                            var area; 
                            if (value.length > 10) {  
                                nameString = value.substring(0,10) + '...';
                                area = `<a href="javascript:;" data-toggle="tooltip" title="${value}">${nameString}</a>`;
                            } else{  
                                area = `${value}`;  
                            }  
                            return area;  
                        }
                    },
                    {field: "destinationAddress",title: "送货地址",
                        formatter:function preferenceFormatter(value, row, index) {  
                            var nameString = ""; 
                            var area; 
                            if (value.length > 10) {  
                                nameString = value.substring(0,10) + '...';
                                area = `<a href="javascript:;" data-toggle="tooltip" title="${value}">${nameString}</a>`;
                            } else{  
                                area = `${value}`;  
                            }  
                            return area;  
                        }
                    },
                    {field: "goodsName",title: "货物名称",align: "center"},
                    {field: "quantityOfGoods",title: "货物数量",align: "center"},
                    {field: "carLength",title: "所需车长",align: "center"},
                    {field: "creationTime",title: "下单时间",align: "center"},
                    {field: "statusStr",title: "询价状态",align: "center"},
                    {field: "responseTime",title: "紧急程度",align: "center"},
                    {
                        field: 'template',
                        title: '操作',
                        align: "center",
                        formatter: function operateFormatter(value, row, index) {
                            var aa=` <a title='查看详情' href="javascript:void(0)" class='orderDetail'><i class='glyphicon glyphicon-eye-open text-info'></i></a>`;
                            var bb=`<a href="javascript:void(0)" title='编辑' class='editDetail'><i class='glyphicon glyphicon-edit text-info'></i></a>`;
                            switch(row.statusStr){
                                case'报价中':return aa;
                                case'已中标':return aa;
                                case'未中标':return aa;
                                case'询价终结':return aa;
                               default:return bb;
                            }
                        },
                        events: {
                            'click .orderDetail': function (e, value, row, index) {
                                router.go('inquiryCheck/?id=' + row.id + '&status=' + row.status);
                            },
                            'click .editDetail':function(e,value,row,index){
                                 router.go('inquiryCheck/?id=' + row.id + '&status=' + row.status);
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
                    // console.info('tyv')
                },
                locale: "zh-CN"//中文支持,
            });
        //表格 初始 加载数据
        this.load(this.inquiryParameter,this.skip,this.count);
        this.getInquiryCount();
    }

    /* 获取概述区域 */
    getInquiryCount = function(){
        dataService().Inquiry.getInquiryCount().then((res)=>{
            this.quote = res.quote;
            this.successfulQuote = res.successfulQuote;
            this.successfulBidder = res.successfulBidder;
            this.unsuccessfulBidders = res.unsuccessfulBidders;
            this.pending = res.pending;
            this.end = res.end;
        });
    }

    load=function(inquiryParameter,skip,count){
        dataService().Inquiry.getInquiryList(inquiryParameter.inquiryId,inquiryParameter.inquiryChildId,inquiryParameter.sendAddress,inquiryParameter.receiveAddress,inquiryParameter.status,inquiryParameter.startTime,inquiryParameter.endTime,skip,count).then(
            (res)=>{
                if(res.length==0){ this.seeks=true; return false}
                var data=res.data;
                for(var i=0;i<data.length;i++){
                    if(data[i].status=="3"){
                        data.splice(i,1);
                        i--;
                        continue;
                    }
                    var temp=this.statusList.filter(t=>t.value.indexOf(data[i].status)>-1)[0];
                    data[i].statusStr=temp?temp.text:"";
                }
                $('#inquiryManage_table').bootstrapTable('load', data);
                this.seeks=false;
                this.bseeks=false;
                var total=Number(res.total);
                this.Records=total==0?0.5:total;
                this.showRecords=total==0?false:true;
            },function(rej){
                this.seeks=false;
                this.bseeks=false;
            }
        );
    }

    /* 查询编号 */
    queryCode = function(){
        this.seeks=true;
        this.resetQuery();
        this.skip = 0;
        this.currentPage = 1;
        this.$broadcast('reset');
        this.localHistory(this.$route);
        this.localPage(this.skip,this.count,this.currentPage);
        this.load(this.inquiryParameter,this.skip,this.count);
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
    /* 查询 */
    query=function(){
       this.bseeks=true;
       this.skip = 0;
       this.currentPage = 1;
       this.$broadcast('reset');
       this.localHistory(this.$route);
       this.localPage(this.skip,this.count,this.currentPage);
       this.load(this.inquiryParameter,this.skip,this.count);
    }

    /**重置 */
    resetQuery = function(){
        this.inquiryParameter.status  = this.statusList[0].value,
        this.inquiryParameter.startTime  = "",
        this.inquiryParameter.endTime  = "",
        this.inquiryParameter.sendAddress  = "",
        this.inquiryParameter.receiveAddress = "";
    }

    //存储搜索条件
    localHistory = function(state){
        if(state){
            let routerName = state.path;
            if(routerName.search("inquiry")>0){
                window.localStorage.setItem(String(routerName),JSON.stringify(this.inquiryParameter));
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
   
    @Prop
    tableData=[];
}
