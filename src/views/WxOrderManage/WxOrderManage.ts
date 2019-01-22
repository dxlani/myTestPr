import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import * as VueRouter from 'vue-router';
import '../../favicon.ico';
import '../../img/location_img@3x.png';
import '../../components/WxFoot/WxFootCom';
declare var $:any;

Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxOrderManage.html'),
    style: require('./WxOrderManage.scss')
})
export class WxOrderManageComponent extends Vue{
    el:'#WxOrderManagent';
    components:({
        vclienttable:any,
    });


    @Prop
     /**是否显示暂无数据 */
    IsData: boolean = false;
    /**是否显示正在加载 */
    IsLoad: boolean = false;

    /**地图 */
    map:any;
    myGeo;

    /**定位页面所需参数 */
    /**用于定位的手机号 */
    locationPhone='';
    /**车牌号 */
    locationCarCode='';
    /**发货地址 */
    locationOriginAddress='';
    /**送货地址 */
    locationDestinationAddress='';
    /**定位情况 */
    locationStatus='';
    /**定位日期 */
    locationTime='';
    /**位置信息 */
    locationArea='';
    /**定位按钮 */
    locationText='';
    

    /**查询 */
    /**订单编号 */
    searchOrderId='';
    /**订单状态 */
    searchOrderStatus='';
    /**发货地址 */
    searchStartAddress='';
    /**送货地址 */
    searchEndAddress='';

    /**是否显示订单按钮 */
    isShowLocation = true;


    /**订单状态下拉列表*/
    orderStatusList = [{text:"全部", value:"1,3,4,5,6,7,8"},
                        {text:"派车中",value:"1,4"},
                        {text:"已派车",value:"3"},
                        {text:"待发货",value:"5"},
                        {text:"已发货",value:"6"},
                        {text:"货已送达",value:"7"},
                        {text:"订单终结",value:"8"}];
    /**订单列表 */
    orderManageList=[];



    ready(){
        /**移除滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style","");
        /**是否显示暂无数据 */
        this.IsData = false;
        /**是否显示正在加载 */
        this.IsLoad = true;
        this.searchOrderId = "";
        this.searchOrderStatus="1,3,4,5,6,7,8";
        this.searchStartAddress="";
        this.searchEndAddress="";
        this.orderManageList = [];
        this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,0,10);

        //上拉滚动加载
        var loading = false;  //状态标记
        $(".wx-top-ml").infinite(50).on("infinite",() => {
            if (loading) return;
            loading = true;
            setTimeout(()=> {
                var DataSkip = this.orderManageList.length / 10;
                this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress, DataSkip * 10,10);
                loading = false;
            }, 1500);   //模拟延迟
        });
        
        //下拉刷新
        $(".wx-top-ml").pullToRefresh().on("pull-to-refresh", ()=> {
            setTimeout(()=> {
                this.queryOrder();
                $(".wx-top-ml").pullToRefreshDone();
            }, 2000);
        });

    }

    /**请求数据 */
    load = function(orderId,orderStatus,startAddress,endAddress,skip,count){
        dataService().Order.getOrderList(orderId,orderStatus,"","","","",startAddress,endAddress,skip,count,0,"").then((res)=>{
            // console.log('res',res);
            for(var i=0;i<res.data.length;i++) {
                res.data[i].statusStr=this.orderStatusList.filter(t=>t.value.indexOf(res.data[i].status)>-1&&t.text!="全部")[0].text;
            }
            if (res.data.length == 0) {
                this.IsData = true;
                    $(".wx-top-ml").destroyInfinite();
            } else {
                this.IsData = false;
                $(".wx-top-ml").infinite();
            }
            if (res.data.length < 3) {
                this.IsLoad = false;
                $(".wx-top-ml").destroyInfinite();
            } else {
                this.IsLoad = true;
                $(".wx-top-ml").infinite();
            }
            var DataLengths = res.data;
            if (DataLengths.length > 0) {
                for (var j = 0; j < DataLengths.length; j++) {
                    this.orderManageList.push(DataLengths[j]);
                }
            } else {
                /**销毁下拉滚动加载 */
                $(".wx-top-ml").destroyInfinite();
            }
            $.hideLoading();
            
        });
    }

    /**查询 */
    queryOrder = function(){
        this.orderManageList = [];
        this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,0,10)
    }

    /**获取订单详情 */
    goOrderdetail = function(item){
        router.go("/WxOrder/WxOrderManageDetail?id="+item.id+'&status='+item.status);
    }

    /**显示定位页面 获取订单数据*/
    showLoaction = function(item){
        $("#WxOrderManagentHead").hide();
        this.myGeo = new BMap.Geocoder();
        setTimeout(()=>{this.initMap();},50);
        
        this.locationPhone = item.driverPhone;
        this.locationCarCode = item.carrierCarCode;
        this.locationOriginAddress = item.originAddress;
        this.locationDestinationAddress = item.destinationAddress;
        this.locationStatus="";
        this.locationTime="";
        this.locationArea="";
        this.locationText="定位";
    }

    /**关闭定位页面时显示查询 */
    showHead = function(){
        $("#WxOrderManagentHead").show();
    }

    /**切换列表页面 */

    hasOrderList = function(){
        router.go("/WxOrder/WxOrderReleaseManage");
    }
    hasHandleList = function(){
        router.go("/WxOrder/WxOrderManage");
    }

    /**定位 */
    location = function(){
        if(!this.locationPhone){
            $.alert("暂未获取车辆电话");
            return;
        }
        //  console.info("location",window.location)
        this.locationText="定位中..."
        // dataService().Location.getLocation(this.locationPhone).then((res)=>{
        //     // console.log(res);

        //     this.locationText="定位";
        //     //如果返回数据时已经跳出定位页面，则步做任何操作
        //     // if(window.location.hash.indexOf("order/location")==-1){
        //     //     return;
        //     // }
        //     //获取数据后执行
        //     if(!(res && res.latitude)){
        //         $.alert("定位失败或该车辆未开通定位");
        //         this.locationStatus="定位失败"
        //         return;
        //     }
        //     this.locationStatus="定位成功";
        //     this.locationTime=res.creationTime;
        //     this.locationArea=res.area;

        //     var p0 = res.longitude;
        //     var p1 = res.latitude;
        //     var pt = new BMap.Point(p0, p1);
        //     this.addMarker(pt, new BMap.Label(this.locationArea, { offset: new BMap.Size(20, -10) }));
        // },()=>{this.locationText="定位"})
    }

    ///////////////////////////////////////////下面是百度地图SDK中的方法/////////////////////
    initMap=function() {
        this.createMap(); //创建地图
        this.setMapEvent(); //设置地图事件
        this.addMapControl(); //向地图添加控件
    }

    //     //创建地图函数：
    createMap=function() {
        //  if(window['map']){
        //     this.map=window['map']
        // }else{
        //     this.map = new BMap.Map("mapContent"); //在百度地图容器中创建一个地图
        //     window['map'] = this.map; //将map变量存储在全局
        // }
        // var point = new BMap.Point(119.446448, 32.164418); //定义一个中心点坐标
        // this.map.centerAndZoom(point, 7); //设定地图的中心点和坐标并将地图显示在地图容器中
        this.map = new BMap.Map("mapContent"); //在百度地图容器中创建一个地图
        var point = new BMap.Point(119.446448, 32.164418); //定义一个中心点坐标
        this.map.centerAndZoom(point, 7); //设定地图的中心点和坐标并将地图显示在地图容器中
        window['map'] = this.map; //将map变量存储在全局
        // console.log(window['map']);
        
    }

    //地图事件设置函数：
    setMapEvent=function() {
        this.map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
    }

    // 地图控件添加函数：
    addMapControl=function() {
        //向地图中添加缩放控件
        var ctrl_nav = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_LEFT,
            type: BMAP_NAVIGATION_CONTROL_LARGE
        });
        this.map.addControl(ctrl_nav);
        //向地图中添加比例尺控件
        var ctrl_sca = new BMap.ScaleControl({
            anchor: BMAP_ANCHOR_BOTTOM_LEFT
        });
        this.map.addControl(ctrl_sca);
    }


    //创建InfoWindow
    createInfoWindow =function(i){
        var json = markerArr[i];
        var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>" + json.content + "</div>");
        return iw;
    }


    // 编写创建标注函数
    addMarker=function(point, label) {
        var marker = new BMap.Marker(point);
        this.map.addOverlay(marker);
        marker.setLabel(label);
    }

    //逆地址解析函数,起始点使用
    s_e=function(adds) {
        this.myGeo.getPoint(adds, (point)=> {
            if (point) {
                var address = new BMap.Point(point.lng, point.lat);
                this.addMarker(address, new BMap.Label(adds, {
                    offset: new BMap.Size(20, -10)
                }));
            }
        });
    }

    package:string = 'vue-typescript';
    repo:string = 'https://github.com/itsFrank/vue-typescript';
}