import { VueComponent } from 'vue-typescript'
import { dataService } from '../../../service/dataService'
import * as VueRouter from 'vue-router'

declare var $: any;
Vue.use(VueRouter);

var router = new VueRouter();

@VueComponent({
    template: require('./WxDeliveryDetail.html'),
    style: require('./WxDeliveryDetail.scss')
})
export class ShowWxDeliveryDetailComponent extends Vue {
    el: '#showDeliveryDetail';
    /**
     * 是否确认发货
     */
    isConfirm:boolean=false;
    /**
     * 按钮名字
     */
    buttonMessage:string="";
    /**
     * 收发货人
     */
    status:string="";

    ready(){
        document.getElementsByTagName("body")[0].setAttribute("style", "height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.buttonMessage = "确认发货";
            if(this.$route.query.userState == "0"){
                this.status = "收货人";
                this.isConfirm = false;
            }
            else if(this.$route.query.userState == "1"){
                this.status = "发货人";
                this.isConfirm = false;
            }
        
    }

    /**确认已发货 */
    confirmDeliver(){
                $.toast("已确认");
                this.isConfirm = true;
                this.buttonMessage = "已确认发货";
        };
}
