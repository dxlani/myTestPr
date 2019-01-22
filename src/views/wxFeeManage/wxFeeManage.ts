import { VueComponent } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'
Vue.use(VueRouter);
var router = new VueRouter();
declare var $: any;

@VueComponent({
    template: require('./wxFeeManage.html'),
    style: require('./wxFeeManage.scss')
})
export class wxFeeManageComponent extends Vue {
    el: '#wxfeeManage';
    /**
     * 账户余额
     */
    accountBalance:string = "";
    /**
     * 月份下拉
     */
    monthDropDown = [];
    /**
     * 最小月份
     */
    minMonth:string="";
    /**
     * 当前所选月份的下一个月 
     */
    nextMonth:string = "";
    /**
     * 所选月份
     */
    month:string = "";
    /**
     * 当月扣款
     */
    deductionSum:string = "";
    /**
     * 当月充值
     */
    rechargeSum:string = "";
    /**
     * 费用明细列表
     */
    feeList = [];
    /**
     * 判断列表是否空
     */
    notnull:boolean=true;


    ready() {
        document.getElementById("wxFeeList").style.height = (innerHeight - 196).toString() + "px";
        // document.getElementById("wxFeeList").style.width = innerWidth.toString() + "px";
        this.monthDropDown = [];
        this.month = "";
        this.minMonth = "";
        this.nextMonth = "";
        this.accountBalance = "";
        this.deductionSum = "";
        this.rechargeSum = "";
        this.notnull = false;
        this.feeList = [];
        /**获取账户状态及余额 */
        dataService().feeManage.getAccountInfo().then((res)=>{
            if(res){
                 this.accountBalance = res.accountBalance;
            }else{
                this.accountBalance = ""
            }
        });
        dataService().feeManage.getEarlyMonth().then((res)=>{
            this.minMonth = res.month + "-01";
        }).then(()=>{
            this.monthDropDown = this.getMonthDropDown(this.minMonth);
            this.month = this.monthDropDown[0].value;
            this.nextMonth = this.getNextMonth(this.month);
            this.load(this.month,this.nextMonth);
        });
    }
    /**加载数据 */
    load(nowMonth,nextMonth){
        $.showLoading('加载中...');
        /**获取费用列表 */
        dataService().feeManage.getFeeList("0",nowMonth,nextMonth,0,-1).then((res)=>{
            if(res){
                this.deductionSum = res.deductionSum;
                this.rechargeSum = res.rechargeSum;
                if(res.feeDetailList.length>0){
                    this.feeList = res.feeDetailList;
                    this.notnull = true;
                }else{
                    this.notnull = false;
                }
            }else{
                return
            }
            $.hideLoading();
        });
    }

    /**
     * 选择日期加载数据
     */
    selectMonth(){
        this.nextMonth = this.getNextMonth(this.month);
        this.load(this.month,this.nextMonth);
    }
    /**月份下拉 */
    getMonthDropDown(startDate) {
        var nowDate = new Date();
        var startM = new Date(Date.parse(startDate.replace(/-/g,"/")))
        var startMonth = startM.getMonth()+1;
        var startYear= startM.getFullYear();
        var nowMonth = nowDate.getMonth()+1;
        var nowYear = nowDate.getFullYear();
        var intervalYear = nowYear - startYear;
        var monthList = [];
        if(intervalYear==0){
            for(let i=startMonth;i<=nowMonth;i++){
                var monthValue = i < 10 ? "0" + i : i;
                monthList.push({
                    text: nowYear + "年" + i + "月",
                    value: nowYear + "-" + monthValue + "-" + "01",
                });
            }
        }else if(intervalYear>0){
            for(let i = 0;i<=intervalYear;i++){
                var j;
                var k;
                if(i==0){
                    j=startMonth;
                    k=12;
                }else if(i==intervalYear){
                    j=1;
                    k=nowMonth;
                }else{
                    j=1;
                    k=12;
                }
                for(j;j<=k;j++){
                    var monthValue1 = j < 10 ? "0" + j : j;
                    monthList.push({
                        text: startYear + "年" + j + "月",
                        value: startYear + "-" + monthValue1 + "-" + "01",
                    });
                }
                startYear++;
            }
        }
        // var intervalMonth = (nowDate.getFullYear()*12 + nowMonth) -(startM.getFullYear()*12 + startMonth);
        // var monthList = [];
        // var m1 = nowDate.getMonth() + 1;
        // var monthText1 = m1;
        // var monthValue1 = m1 < 10 ? "0" + m1 : m1;
        // monthList.push({
        //     text: nowDate.getFullYear() + "年" + monthText1 + "月",
        //     value: nowDate.getFullYear() + "-" + monthValue1 + "-" + "01",
        // });
        // for(var i = 0; i < intervalMonth; i++) {
        //     nowDate.setMonth(nowDate.getMonth() - 1);
        //     var m = nowDate.getMonth() + 1;
        //     var monthText = m;
        //     var monthValue = m < 10 ? "0" + m : m;
        //     monthList.push({
        //         text: nowDate.getFullYear() + "年" + monthText + "月",
        //         value: nowDate.getFullYear() + "-" + monthValue + "-" + "01",
        //     });
        // }
        // console.log(monthList)
        return monthList.reverse();
    }
    /**获取下一个月份 */
    getNextMonth(nowMonth){
        var arrayDate = nowMonth.split('-');
        var nextYear = "";
        var nextMonth = "";
        var nextDate = "";
        var year1 = arrayDate[0];
        var month1 = arrayDate[1];
        if ((parseInt(month1) + 1) == 13) {
            nextYear = String(parseInt(year1) + 1);
            nextMonth = String(1);
        }else{
            nextYear = String(parseInt(year1));
            if ((parseInt(month1) + 1) < 10) {
                nextMonth = '0' + String(parseInt(month1) + 1);
            }else{
                nextMonth = String(parseInt(month1) + 1);
            }
        }
        nextDate = String(nextYear) + '-' + nextMonth + '-' + '01';
        return nextDate;
    }
}