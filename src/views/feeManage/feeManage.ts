import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'


Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./feeManage.html'),
    style:require('./feeManage.scss')
})

export class FeeManageComponent extends Vue {
    el: '#feeManage'

    @Prop
    records:number ;
    skip:number;
    count:number;
    seeks = true;
    /**
     * 账户状态
     */
    accountStatus:string = "";
    /**
     * 账户余额
     */
    accountBalance:string = "";
    /**
     * 充值总计
     */
    rechargeSum:string = "";
    /**
     * 扣款总计
     */
    deductionSum:string = "";
    /**
     * 查询条件
     */
    checkQuery = {
        feeProperty: '0',
        startTime: '',
        endTime: '',
    }
    /**
     * 费用起始时间
     */
    minMonth:string = "";
    /**
     * 费用属性下拉
     */
    feePropertyList = [
        {text:'全部',value:'0'},
        {text:'扣款',value:'1'},
        {text:'充值',value:'2'}
    ]
    
    ready() {
        let routerName = this.$route.path;
        if(window.localStorage.getItem(String(routerName))){
            this.checkQuery = JSON.parse(window.localStorage.getItem(String(routerName)))
        }else{
            this.checkQuery = {
                feeProperty: '0',
                startTime: '',
                endTime: '',
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
       
        this.$on('pageIndexChange', function (event) {
            this.count = event.pageSize;
            this.skip = event.pageIndex;
            this.currentPage = event.currentPage;
            this.localPage(this.skip,this.count,this.currentPage)
            this.load(this.skip, this.count);
        });

        $('#feeManage_startTime').datetimepicker();
        $('#feeManage_endTime').datetimepicker();
        // dataService().feeManage.getEarlyMonth().then((res)=>{
        //     var arr = res.month.split('-');
        //     var y = arr[0];
        //     var m = arr[1];
        //     this.minMonth = y + "/" + m + "/01";
        //     console.log(this.minMonth);
        // }).then(()=>{
        //     $('#feeManage_startTime').datetimepicker({
        //         timepicker : false,
        //         minDate:this.minMonth,
        //         maxDate:this.checkQuery.startTime,
        //         onSelectDate: (dateText, inst)=> {
        //             var m = dateText.getMonth()+ 1;
        //             var dateMonth = m < 10 ? "0" + m : m;
        //             var feeStartDate = dateText.getFullYear() + '/' + dateMonth + '/' + dateText.getDate();
        //             $('#feeManage_endTime').datetimepicker({
        //                 timepicker : false,
        //                 minDate:feeStartDate,
        //                 maxDate:this.checkQuery.endTime,
        //             });
        //             console.log(dateText);
        //         },
        //     });
        //     $('#feeManage_endTime').datetimepicker({
        //         timepicker : false,
        //         minDate:this.minMonth,
        //         maxDate:this.checkQuery.endTime,
        //     });
        // });


        var $table = $('#feeManage_table').bootstrapTable({
            dataField: "rows",
            pagination: false,
            sidePagination: "client",
            buttonsAlign: "left",
            columns: [
                { field: "creationTime", title: "费用时间", sortable: false,align: "center", },
                { field: "feeAttribute", title: "费用属性", sortable: false, align: "center",
                    formatter:function operateFormatter(value,row,index){
                        switch(row.feeAttribute){
                            case 1:return '扣款';
                            case 2:return '充值';
                        }
                    }
                },
                { field: "feeType", title: "费用类别", sortable: false, align: "center",
                    formatter:function operateFormatter(value,row,index){
                        switch(row.feeType){
                            case 1:return '运费支付';
                            case 2:return '服务费';
                            case 3:return '其他';
                            case 4:return '运费预充';
                            case 5:return '其他';
                        }
                    }
                },
                { field: "feeDetailNum", title: "费用明细（元）", sortable: false, align: "center",
                formatter:function operateFormatter(value,row,index){
                        if(row.feeDetailNum.indexOf('+')>-1){
                            return `<span style="color:red">${row.feeDetailNum}</span>`
                        }else if(row.feeDetailNum.indexOf('-')>-1){
                            return `<span style="color:#66CC00">${row.feeDetailNum}</span>`
                        }
                     }
                },
                { field: "remarks", title: "备注", sortable: false,align: "center",
                    formatter:function preferenceFormatter(value, row, index) {  
                        var nameString = ""; 
                        var remarks; 
                        if (value.length > 15) {  
                            nameString = value.substring(0,10) + '...';
                            remarks = `<a href="javascript:;" title="${value}">${nameString}</a>`;
                        } else{  
                            remarks = `${value}`;  
                        }  
                        return remarks;  
                    }
                },
                
            ],
            data: [],
            locale: "zh-CN"
        });
        
          dataService().feeManage.getAccountInfo().then((res) => {
              this.accountBalance=res.accountBalance;
              this.accountStatus=res.status?'开启':'关闭';
        }).then(()=>{
            this.load(this.skip,this.count);
        });
    }
    /**
     * 查询
     */
    queryFee = function () {
        this.seeks = true;
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
    load(skip, count) {
        dataService().feeManage.getFeeList(this.checkQuery.feeProperty,this.checkQuery.startTime, this.checkQuery.endTime,skip, count).then((res) => {
            $('#feeManage_table').bootstrapTable('load', res.feeDetailList);
            this.seeks = false;
            this.records = res.totalCount == 0 ? 0.5 : res.totalCount;
            this.rechargeSum=res.rechargeSum;
            this.deductionSum=res.deductionSum;
        }, function (rej) {
            this.seeks = false;
        });
    }

    //存储搜索条件
    localHistory = function(state){
        if(state){
            let routerName = state.path;
            if(routerName.search("Sumaccount")>0){
                window.localStorage.setItem(String(routerName),JSON.stringify(this.checkQuery));
            };
        }
    }

    //存储页数
    localPage = function(skip,count,currentPage){
        var routerName = this.$route.path;
        window.localStorage.setItem(String(routerName+'Page'),JSON.stringify({skip:skip,count:count,currentPage:currentPage}));
    }
}