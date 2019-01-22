import { VueComponent } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'

declare var $: any;
Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxDeliveryList.html'),
    style: require('./WxDeliveryList.scss')
})
export class WxDeliveryListComponent extends Vue {
    el: '#WxDeliveryList';

    
    openid:string="";
    /* 收货时间 */
    arrivalTime:string="";
    /* 发货时间 */
    deliveryTime:string="";
    /* 发货单位 */
    consignorCompany:string="";
    /* 收货单位 */
    consigneeCompany:string="";
    /* 货物名称 */
    goodsName:string="";
    /* 货物数量 */
    realQuantityOfGoods:string="";
    /* 货物单位 */
    goodsUnit:string="";
    /* 收发货状态 */
    status:string="";
    /* 运单ID */
    carrierOrderId:string="";
  
    /* 运单数组 */
    consignorList=[];
    /* 列表状态 */
    liststatus:boolean=false;

    ready = function () {
        this.openid=window.sessionStorage.getItem('openid');
        this.querylist();

        /* 下拉刷新 */
        $(".wx-top-k").pullToRefresh().on("pull-to-refresh", ()=> {
            setTimeout(()=> {
                this.querylist();
                $(".wx-top-k").pullToRefreshDone();
            }, 2000);
        });
    }

    /* 列表 */
    querylist=function(){
        dataService().Wxcsporders.getUserOrderList(this.openid).then((res) => {
            this.consignorList=res.consignorList;
            if( this.consignorList.length){
                this.liststatus=true;   
            }else{
                this.liststatus=false;
            }
        
        })
    }

    /* 获取详情 */
    getDetail(orderId,orderStatus){
        if(orderStatus == 0 || orderStatus == 1){
            router.go('wxDeliveryDetail?carrierorderid='+ orderId + '&userState=1');
        }else if(orderStatus == 2 ){
            router.go('wxAcceptanceDetail?carrierorderid=' + orderId + '&userState=1');
        }
    }

}
