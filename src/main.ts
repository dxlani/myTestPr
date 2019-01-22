import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import * as jquery from 'jquery'
import * as echarts from "echarts"
import './vendor' //bootstrap
require('./main.scss'); //global css
require('./libs/_bsp.scss')
require('./libs/lgsm.scss')
require('./libs/alibabaIcon.css')
require('./favicon.ico');
require('./img/loading.png');
var VueResource = require('vue-resource');
Vue.use(VueResource);

var VueValidator = require('vue-validator');
Vue.use(VueValidator);


import './components/navbar/navbar'
import './components/pagination/paginationCom'
import './components/showHomeButton/showHomeButton'
import './components/autoComplete/autocomplete'

import './components/WxHead/WxHeadCom'
import './components/WxFoot/WxFootCom'

import './views/feedback/feedback'

import {appContent} from './app-content/app-content';
import { HomeComponent } from './views/home/home'
import { AboutComponent } from './views/about/about'
import {InquiryReleaseManageComponent} from './views/inquiryReleaseManage/inquiryReleaseManage'
import {InquiryAddComponent} from './views/inquiryAdd/inquiryAdd'
import {InquiryEditComponent} from './views/inquiryEdit/inquiryEdit'
import {InquiryManageComponent} from './views/inquiryManage/inquiryManage'
import {InquiryConfirmManageComponent} from './views/inquiryConfirmManage/inquiryConfirmManage'
import {InquiryCheckComponent} from './views/inquiryCheck/inquiryCheck'
import {NewInquiryReleaseManageComponent} from './views/newInquiryReleaseManage/newInquiryReleaseManage'
import {NewInquiryManageComponent} from './views/newInquiryManage/newInquiryManage'

import {OrderReleaseManageComponent} from './views/orderReleaseManage/orderReleaseManage'
import {newOrderReleaseManageComponent} from './views/newOrderReleaseManage/newOrderReleaseManage'/* 新订单发布管理 */
import {batchImportComponent} from './views/batchImport/batchImport'/* 批量导入 */
import {OrderReleaseDetailComponent} from './views/orderReleaseDetail/orderReleaseDetail'
import {OrderReleaseAddComponent} from './views/orderReleaseAdd/orderReleaseAdd'
import {OrderReleaseEditComponent} from './views/orderReleaseEdit/orderReleaseEdit'
import {OrderManageComponent} from './views/orderManage/orderManage'
import {newOrderManageComponent} from './views/newOrderManage/newOrderManage'/* 新订单管理 */
import {OrderManageDetailComponent} from './views/orderManageDetail/orderManageDetail'
import {OrderManageDelivered} from './views/OrderManageDelivered/orderManageDelivered'

import {Sumaccount} from './views/Sumaccount/Sumaccount'
import {newSumaccount} from './views/newSumaccount/newSumaccount'/* 新财务对账 */
import {SumaccountDetailComponent} from './views/SumaccountDetail/SumaccountDetail'

import { DataAnalysisRequirement } from './views/dataAnalysisRequirement/dataAnalysisRequirement'
import { dataanalysiscostComponent } from './views/dataAnalysisCost/dataAnalysisCost'
import { qualitywaveComponent } from './views/qualityWave/qualityWave'
import { FeeManageComponent } from './views/feeManage/feeManage'
import { AuthorityManageComponent } from './views/authorityManage/authorityManage'
import { AuthorityDetailComponent } from './views/authorityDetail/authorityDetail'

import './views/updateTip/updateTip'

import {UserInfoComponent} from './views/userInfo/userInfo'
import {LoginComponent} from './views/login/login'
import {LocationComponent} from './views/location/location'
import {LocktoollocationComponent} from './views/locktoollocation/locktoollocation'
import {BDNPLocationComponent} from './views/BDNPLocation/BDNPLocation'


//wechat
import {WxLoginComponent} from './views/Wxlogin/Wxlogin'
import {WxIndexComponent} from './views/WxIndex/WxIndex'
import {WxInquiryAddComponent} from './views/WxInquiryAdd/WxInquiryAdd'
import {WxInquiryManageComponent} from './views/WxInquiryManage/WxInquiryManage'
import {WxInquiryDetailComponent} from './views/WxInquiryDetail/WxInquiryDetail'
import {WxInquiryReleaseManageComponent} from './views/WxInquiryReleaseManage/WxInquiryReleaseManage'
import {WxInquiryReleaseDetailComponent} from './views/WxInquiryReleaseDetail/WxInquiryReleaseDetail'
import {WxOrderAddComponent} from './views/WxOrderAdd/WxOrderAdd'
import {WxOrderReleaseManageComponent} from './views/WxOrderReleaseManage/WxOrderReleaseManage'
import {WxOrderReleaseDetailComponent} from './views/WxOrderReleaseDetail/WxOrderReleaseDetail'
import {WxOrderManageComponent} from './views/WxOrderManage/WxOrderManage'
import {WxOrderManageDetailComponent} from './views/WxOrderManageDetail/WxOrderManageDetail'
import {WxdataAnalysisCostComponent} from './views/WxdataAnalysisCost/WxdataAnalysisCost'
import {WxDataAnalysisRequirement} from './views/WxdataAnalysis/WxDataAnalysisRequirement'
import {WxqualityWaveComponent} from './views/WxqualityWave/WxqualityWave'
import {onroadComponent} from './views/onroad/onroad'
import {WxonroadDetailComponent} from './views/WxonroadDetail/WxonroadDetail'
import{WxSettingComponent}from './views/WxSetting/WxSetting'   /* 微信端我 */
import{WxorderComponent}from './views/Wxorder/Wxorder'   /* 微信端订单 */
import{wxFeedBackComponent}from './views/wxFeedBack/wxFeedBack'   /* 微信端意见反馈 */
import{wxFeedBackDetailComponent}from './views/wxFeedBackDetail/wxFeedBackDetail'   /* 微信端意见反馈 */
import{wxFeedBackAddComponent}from './views/wxFeedBackAdd/wxFeedBackAdd'   /* 微信端意见反馈 */
import { wxFeeManageComponent } from './views/wxFeeManage/wxFeeManage'   /* 微信端费用管理 */

import {wxContent} from './wx-content/wx-content';
import {WxConfirmLoginComponent} from './views/WxConfirmLogin/WxConfirmLogin'
import {WxAcceptanceListComponent} from './views/WxAcceptanceList/WxAcceptanceList'
import {WxAcceptanceDetailComponent} from './views/WxAcceptanceDetail/WxAcceptanceDetail'
import {WxDeliveryListComponent} from './views/WxDeliveryList/WxDeliveryList'
import {WxDeliveryDetailComponent} from './views/WxDeliveryDetail/WxDeliveryDetail'
import {WxDriverArriveComponent} from './views/WxDriverArrive/WxDriverArrive'
import {wxfooter} from './components/wxfooter/wxfooter'

// import {orderTimer} from'./views/onroad/onroad'

import {ShowHomeComponent} from './views/showRoom/showHome/showHome'
import {ShowOnroadComponent} from './views/showRoom/onroad/onroad'
import {cspWxonroadDetailComponent} from './views/showRoom/WxonroadDetail/WxonroadDetail'
import {cspWxOrderManageDetailComponent} from './views/showRoom/WxOrderManageDetail/WxOrderManageDetail'
import {ShowWxdataAnalysisComponent} from './views/showRoom/WxdataAnalysis/WxDataAnalysisRequirement'
import {ShowWxdataAnalysisCostComponent} from './views/showRoom/WxdataAnalysisCost/WxdataAnalysisCost'
import {ShowWxqualityWaveComponent} from './views/showRoom/WxqualityWave/WxqualityWave'
import {ShowMessageComponent} from './views/showRoom/showMessage/showMessage'
import {ShowSenderMessage} from './views/showRoom/senderMessage/senderMessage'
import {ShowWxDeliveryDetailComponent} from './views/showRoom/WxDeliveryDetail/WxDeliveryDetail'
import {ShowConsignorMessage} from './views/showRoom/consignorMessage/consignorMessage'
import {ShowWxAcceptanceDetailComponent} from './views/showRoom/WxAcceptanceDetail/WxAcceptanceDetail'
import {AiComponent} from './views/Ai/ai'
import {cspShow} from './views/showRoom/cspShow/cspShow'
import {aiShow} from './views/showRoom/aiShow/aiShow'
/* 大全订单定位 */
import {DaquanOrderLocation} from './views/daquanOrderLocation/daquanOrderLocation'
/** SA010 数据分析 */
import { DataAnalysisControlle } from "./views/DataAnalysisControlle/DataAnalysisControlle";
/** SA011 财务对账 */
import { SumaccountControlle } from "./views/SumaccountControlle/SumaccountControlle";
import { SumaccountControlleDetail } from "./views/SumaccountControlleDetail/SumaccountControlleDetail";



var VuePagination = require('v-pagination');
Vue.use(VuePagination);

Vue.use(VueRouter);
// Vue.use(VueResource);
var app = Vue.extend({});


Vue.http.interceptors.push(function(request,next){
    var token=JSON.parse(window.sessionStorage.getItem("userInfo"))?JSON.parse(window.sessionStorage.getItem("userInfo")).jwtToken:""
    if(!!token){
        
        request.headers.set('Authorization', 'Bearer '+token);
    }
    next(function(response) {
      if(!response.body){
          response.body={data:{}};
    }

  });
});


var router = new VueRouter();
router.map({
  '/':{component: LoginComponent},
  '/login':{component: LoginComponent,alias: '/b'},
  '/app/':{component: appContent,
      subRoutes:{
        'home' : {component: HomeComponent},
        'about/se' : {component: AboutComponent},
        'inquiry/inquiryReleaseManage':{component : InquiryReleaseManageComponent},
        'inquiry/newInquiryReleaseManage':{component : NewInquiryReleaseManageComponent},/* 新询价发布管理 */
        'inquiry/newInquiryManage':{component : NewInquiryManageComponent},/* 新询价单管理 */
        'inquiry/inquiryAdd':{component:InquiryAddComponent},
        'inquiry/inquiryEdit':{component:InquiryEditComponent},
        'inquiry/inquiryManage':{component:InquiryManageComponent},
        'inquiry/inquiryConfirmManage':{component:InquiryConfirmManageComponent},
        'inquiry/inquiryCheck':{component:InquiryCheckComponent},
        'order/orderReleaseManage':{component:OrderReleaseManageComponent},
        'order/batchImport':{component:batchImportComponent},/* 批量导入*/
        'order/newOrderReleaseManage':{component:newOrderReleaseManageComponent},/* 新订单发布管理 */
        'order/newOrderManage':{component:newOrderManageComponent},/* 新订单管理 */
        'order/orderReleaseDetail':{component:OrderReleaseDetailComponent},
        'order/orderReleaseAdd':{component:OrderReleaseAddComponent},
        'order/orderReleaseEdit':{component:OrderReleaseEditComponent},
        'order/orderManage':{component:OrderManageComponent},
        'order/OrderManageDelivered':{component:OrderManageDelivered},
        'order/orderManageDetail':{component:OrderManageDetailComponent},
        'userInfo':{component:UserInfoComponent},
        'order/location':{component:LocationComponent},
        'order/locktoollocation':{component:LocktoollocationComponent},
        'order/BDNPLocation':{component:BDNPLocationComponent},
        'Sumaccount':{component:Sumaccount},
        'newSumaccount':{component:newSumaccount},/* 新财务对账 */
        'SumaccountDetail':{component:SumaccountDetailComponent},
        'dataAnalysis':{component:DataAnalysisRequirement},
        'dataAnalysisCost':{component:dataanalysiscostComponent},
        'qualityWave':{component:qualitywaveComponent},
        'feeManage':{component:FeeManageComponent},
        'authorityManage':{component:AuthorityManageComponent},
        'authorityDetail':{component:AuthorityDetailComponent},
        
    } 
  },
  '/wechatConfirm/':{component: wxContent,
    subRoutes:{
      'login' : {component: WxConfirmLoginComponent,name:'历史收发'},
      'wxAcceptanceList' : {component: WxAcceptanceListComponent,name:'历史收发'},
      'wxAcceptanceDetail':{component:WxAcceptanceDetailComponent,name:'收货通知详情'},
      'wxDeliveryList':{component:WxDeliveryListComponent,name:'历史收发'},
      'wxDeliveryDetail':{component:WxDeliveryDetailComponent,name:'发货通知详情'},
      'wxDriverArrive':{component:WxDriverArriveComponent,name:'司机到场提醒详情'}
    } 
  },
  '/WxLogin/Login':{component:WxLoginComponent,name:'智能管家'},
  '/wechat/':{component: wxfooter,
    subRoutes:{
      'onroad' : {component:onroadComponent,name:'智能管家'},
      'WxdataAnalysis' : {component: WxDataAnalysisRequirement,name:'智能管家'},
      'WxdataAnalysisCost' : {component: WxdataAnalysisCostComponent,name:'智能管家'},
      'WxqualityWave' : {component: WxqualityWaveComponent,name:'智能管家'},
      'WxInquiryReleaseManage':{component:WxInquiryReleaseManageComponent,name:'智能管家'},
      'Wxorder':{component:WxorderComponent,name:'智能管家'},
      'WxSetting':{component:WxSettingComponent,name:'智能管家'},
      
   }
  },
  '/wxFeeManage':{component:wxFeeManageComponent,name:'费用管理'},
  '/wxFeedBack':{component:wxFeedBackComponent,name:'意见反馈'},
  '/wxFeedBackDetail':{component:wxFeedBackDetailComponent,name:"意见反馈详情"},
  '/wxFeedBackAdd':{component:wxFeedBackAddComponent,name:"新增意见反馈"},
  '/WxonroadDetail':{component:WxonroadDetailComponent,name:"订单详情"},
  '/WxIndex/Index':{component:WxIndexComponent,name:'智能管家'},
  '/WxInquiry/WxInquiryAdd':{component:WxInquiryAddComponent,name:'发布询价单'},
  '/WxInquiry/WxInquiryDetail':{component:WxInquiryDetailComponent,name:'询价单详情'},
  '/WxInquiry/WxInquiryReleaseDetail':{component:WxInquiryReleaseDetailComponent,name:'询价单详情'},
  '/WxOrder/WxOrderAdd':{component:WxOrderAddComponent,name:'发布订单'},
  '/WxOrder/WxOrderReleaseDetail':{component:WxOrderReleaseDetailComponent,name:'发货单详情'},
  '/WxOrder/WxOrderManageDetail':{component:WxOrderManageDetailComponent,name:'发货单详情'},
   '/WxAnalysis/WxdataAnalysisCost':{component:WxdataAnalysisCostComponent,name:'智能管家'},
   '/WxAnalysis/WxdataAnalysis':{component:WxDataAnalysisRequirement,name:'智能管家'},
   '/WxAnalysis/WxqualityWave':{component:WxqualityWaveComponent,name:'智能管家'},

   /* 展厅 */
   '/cspShow':{component: ShowHomeComponent,name:"智能管家"},
    '/cspOnroad':{component: ShowOnroadComponent,name:'智能管家'},
    '/cspWxdataAnalysis':{component: ShowWxdataAnalysisComponent,name:'智能管家'},
    '/cspWxdataAnalysisCost':{component: ShowWxdataAnalysisCostComponent,name:'智能管家'},
    '/cspWxqualityWave':{component: ShowWxqualityWaveComponent,name:'智能管家'},
    '/cspWxonroadDetail':{component: cspWxonroadDetailComponent,name:'智能管家'},
    '/cspWxOrderManageDetail':{component:cspWxOrderManageDetailComponent,name:'发货单详情'},
    '/cspShowMessage':{component:ShowMessageComponent,name:"收发货"},
    '/cspSenderMessage':{component:ShowSenderMessage,name:"诺得物流"},
    '/cspDeliveryDetail':{component:ShowWxDeliveryDetailComponent,name:"发货通知详情"},
    '/cspConsignorMessage':{component:ShowConsignorMessage,name:"诺得物流"},
    '/cspAcceptDetail':{component:ShowWxAcceptanceDetailComponent,name:"收货通知详情"},

    /* AI */
    '/csp/ai':{component: AiComponent,name:"AI助手"},
    '/csp/cspShow':{component: cspShow,name:"AI物流助手"},
    'csp/aiShow':{component: aiShow,name:"智能管家"},

    '/daquan/orderLocation':{component:DaquanOrderLocation,name:'订单定位'},

    '/DataAnalysisControlle': { component: DataAnalysisControlle, name: '数据分析' },
    '/SumaccountControlle': { component: SumaccountControlle, name: '财务对账' },
    '/SumaccountControlleDetail': { component: SumaccountControlleDetail, name: '财务对账详情' },


});



router.beforeEach((transition)=> {
  if (transition.to.name) {
    document.title = transition.to.name
  }
  transition.next()
})

router.start(app, '#app-main');

var _czc = _czc || [];
