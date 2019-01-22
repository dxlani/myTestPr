import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router'

declare var $: any;
Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxFoot.html'),
    style: require('./WxFoot.scss')
})



export class WxFootCom extends Vue {

    @Prop

    ready() {


    }
}


