import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import * as VueRouter from 'vue-router';
//import '../../favicon.ico';
import '../../components/WxFoot/WxFootCom'
declare var $:any;

Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxOrderReleaseManage.html'),
    style: require('./WxOrderReleaseManage.scss')
})
export class WxOrderReleaseManageComponent extends Vue{
    el:'#WxOrderReleaseManagent';
    components:({
        vclienttable:any,
    });


    @Prop
     /**是否显示暂无数据 */
    IsData: boolean = false;
    /**是否显示正在加载 */
    IsLoad: boolean = false;

    /**订单编号 */
    searchOrderId=''; 
    /**订单状态 */
    searchOrderStatus='';
    /**发货地址*/
    searchStartAddress='';
    /**送货地址*/
    searchEndAddress='';

    skip=0;
    count=10;


    /**订单状态下拉列表*/
    orderStatusList = [{value:"",text:"全部"},
                       {value:"0",text:"未处理"},
                       {value:"1",text:"已处理"},
                       {value:"2",text:"订单终结"}];
    /**订单列表 */
    orderReleaseManageList=[];
    /**存放转换的订单列表 */
    orderList = [];

    /**初始化 */
    ready(){
        /**移除滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style","");
        /**是否显示暂无数据 */
        this.IsData = false;
        /**是否显示正在加载 */
        this.IsLoad = true;

        this.searchOrderId=""; 
        this.searchOrderStatus="";
        this.searchStartAddress="";
        this.searchEndAddress="";
        
        this.orderReleaseManageList = [];
        //加载初始数据
        this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,0,10);

        //上拉滚动加载
        // console.log($(".wx-top-k"));
        var loading = false;  //状态标记
        $(".wx-top-rm").infinite(50).on("infinite",() => {
            if (loading) return;
            loading = true;
            setTimeout(()=> {
                var DataSkip = this.orderReleaseManageList.length / 10;
                this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,DataSkip * 10,10);
                loading = false;
            }, 1500);   //模拟延迟
        });
        
        //下拉刷新
        $(".wx-top-rm").pullToRefresh().on("pull-to-refresh", ()=> {
            setTimeout(()=> {
                this.queryOrder();
                $(".wx-top-rm").pullToRefreshDone();
            }, 2000);
        });

    }

    //获取列表数据
    load = function(orderId,orderStatus,startAddress,endAddress,skip,count){
        dataService().CspOrder.getCspOrderList(orderId,orderStatus,"","",startAddress,endAddress,skip,count,"").then((res)=>{
            // console.log(res.data);
            this.orderList = [];
            if (res.data.length == 0) {
                this.IsData = true;
                    $(".wx-top-rm").destroyInfinite();
            } else {
                this.IsData = false;
                $(".wx-top-rm").infinite();
            }
            if (res.data.length < 3) {
                this.IsLoad = false;
                $(".wx-top-rm").destroyInfinite();
            } else {
                this.IsLoad = true;
                $(".wx-top-rm").infinite();
            }
            /**判断是否有车长*/
            this.orderList = res.data;
            this.orderList.forEach((item) => {
                if(item.carLength == ""){
                    item.carLength = "无"
                }
            });
            var DataLengths = this.orderList;
            if (DataLengths.length > 0) {
                for (var j = 0; j < DataLengths.length; j++) {
                    this.orderReleaseManageList.push(DataLengths[j]);
                }
            } else {
                /**销毁下拉滚动加载 */
                $(".wx-top-rm").destroyInfinite();
            }
            $.hideLoading();
        });
    }

    /**查询 */
    queryOrder = function(){
        this.orderReleaseManageList = [];
        this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,this.skip,this.count);
    }

    /**获取订单详情 */
    goOrderReleasedetail = function(item){
        router.go("/WxOrder/WxOrderReleaseDetail?id="+item.id+'&status='+item.status);
        // console.log(item.cspOrderId);
    }

    /**切换列表页面 */
    changeList = function(){
        $.actions({
            onClose: function() {
                // console.log("close");
            },
            actions: [
                {
                    text: "发货单查询",
                    className: "color-primary",
                    onClick: function() {
                        router.go("/WxOrder/WxOrderReleaseManage");
                    }
                },
                {
                    text: "已处理订单查询",
                    className: "color-warning",
                    onClick: function() {
                        router.go("/WxOrder/WxOrderManage");
                    }
                }
            ]
        });
    }

    hasOrderList = function(){
        router.go("/WxOrder/WxOrderReleaseManage");
    }
    hasHandleList = function(){
        router.go("/WxOrder/WxOrderManage");
    }
    package:string = 'vue-typescript';
    repo:string = 'https://github.com/itsFrank/vue-typescript';
}