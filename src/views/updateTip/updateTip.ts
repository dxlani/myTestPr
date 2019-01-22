import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import {routeService} from '../../service/routeService';
import * as VueRouter from 'vue-router';

var wilddog = require('wilddog');

@VueComponent({
    template: require('./updateTip.html'),
    style: require('./updateTip.scss')
})
export class updatetipComponent extends Vue {
    el: '#updatetip';
    components: ({
        vclienttable: any,
    })
    @Prop
    /**更新内容 */
    updateContentArr=[];

    ready(){
        document.getElementById("updatetip_close").setAttribute("class", "upShow");

        $('#updatetip_close').on('click',()=>{
            if($('#updatetip_close').hasClass('upShow')){
                $("#updatetip").removeClass("tip2");
                $("#updatetip").addClass("tip1"); //切换style为 tip1
                $('#updatetip_close').removeClass('upShow').addClass('downShow');
            }else if($('#updatetip_close').hasClass('downShow')){
                $("#updatetip").removeClass("tip1");
                $("#updatetip").addClass("tip2");//切换style为 tip2
                $('#updatetip_close').removeClass('downShow').addClass('upShow');
            }
        });
        

        // 更新内容
        this.updateContentArr=[
            'web端：',
            '1.通报异常提示修改，并记录投诉次数，下发短信通知客服总监；',
            '微信端：',
            '1.新增订单定位偏离正常行驶区域提示；',
            '2.AI助手问题扩充：增加客户投诉类、使用说明类问题；',
            '3.修改AI助手授权允许录音提示触发环境。',
        ]
    }
}