import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import * as VueRouter from 'vue-router'

import '../../img/location_start.png'
import '../../img/location_end.png'
import '../../img/location_onway.png'
import '../../img/car.png'

// import 'https://api.map.baidu.com/api?v=2.0&ak=7eGHQWZhEnRt28NiHnkgloKVb6n3A3MK&s=1'



var router = new VueRouter();

@VueComponent({
    template: require('./locktoollocation.html'),
    // style: require('./home.scss')
})

export class LocktoollocationComponent extends Vue {
    el:'#locktoollocation'
    components:({
        vclienttable:any,
    })
   
    @Prop
    
   
    map:any;
    myGeo;
    locationText="定位"
    /**
     * 进入页面获取的信息
     */
    id=""//硬件定位的id
    originAddress="";//硬件定位的起始地
    destinationAddress=""//硬件定位的终点地
    orderStatus="";//
    carCode="";
    gpsDeviceID = ""//定位器编码
    locationTime = ""//定位时间
    locationDetail = "" //定位信息
    locationInfo = []//定位器沿途数组
    locationstatus = ""//定位状态

    //以下为定位后获取的数据
    creationTime=""//定位日期
    area=""//地点
    locationType=""//定位方式
    status=""

    // jiashuju = [];
    

    ready=function(){
        // this.jiashuju = {
        //         "gpsDeviceID": "定位器编号1",
        //         "info": [
        //             {gps_info: "江苏省 镇江市 丹徒区 谷阳镇 楚桥路296号 楚桥路 卯岗子北319米", gps_lat: "32.14607", gps_lng: "119.516235",gps_time:"2018-02-22 13:42:55"},
        //             {gps_info:"江苏省 镇江市 京口区 丁卯街道 智慧大道550号 智慧大道 镇江科技新城实验学校西南114米", gps_lat:"32.1654",gps_lng:"119.50839",gps_time:"2018-02-22 13:11:10"}
        //         ]
        //     }
        this.id=this.$route.query.id;
        this.originAddress=this.$route.query.originAddress;
        this.destinationAddress=this.$route.query.destinationAddress;
        this.orderStatus=this.$route.query.orderStatus;
        this.creationTime="";
        this.area="";
        this.myGeo = new BMap.Geocoder();
        this.initMap();
    }
    ///////////////////////////////////////////下面是百度地图SDK中的方法/////////////////////
        initMap=function() {
            this.createMap(); //创建地图
            this.setMapEvent(); //设置地图事件
            this.addMapControl(); //向地图添加控件
            this.StartAndEnd();
            this.Halfway();
        }
        //创建地图函数：
        createMap=function() {
            this.map = new BMap.Map("dituContents"); //在百度地图容器中创建一个地图
            this.myGeo.getPoint((this.originAddress),(point)=>{
                var address = new BMap.Point(point.lng, point.lat);
                this.map.centerAndZoom(point, 7); //设定地图的中心点和坐标并将地图显示在地图容器中
            });
           
            window['map'] = this.map; //将map变量存储在全局
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
        //编写创建标注函数
        addMarker=function(point, label, icon) {
            var marker = new BMap.Marker(point);
            this.map.addOverlay(marker);
            marker.setIcon(icon);
            marker.setLabel(label);
        }
        //逆地址解析函数
        s_e=function(adds, index) {
            this.myGeo.getPoint(adds, (point)=> {
                if (point) {
                    if(index == 0){
                        var address = new BMap.Point(point.lng, point.lat);
                        var startIcon = new BMap.Icon("../../img/location_start.png",new BMap.Size(40,49));
                        this.addMarker(address, new BMap.Label(adds, {offset: new BMap.Size(20, -10)}),startIcon);
                    }
                    if(index == 1){
                        var address = new BMap.Point(point.lng, point.lat);
                        var endIcon = new BMap.Icon("../../img/location_end.png",new BMap.Size(40,49));
                        this.addMarker(address, new BMap.Label(adds, {offset: new BMap.Size(20, -10)}),endIcon);
                    }
                }
            });
        }
        /**
         * 起始和终点定位点
         */
        StartAndEnd = function(){
            var address = [this.originAddress,this.destinationAddress];
            for(var i = 0; i<address.length; i++){
                this.s_e(address[i], i);
            }
        }
        /**
         * 沿途定位点
         */
        Halfway = function(){
            dataService().Location.GetLocationList(this.id).then((res)=>{
                if (res.info == null || res.extData == false){
                    this.locationstatus = "定位失败";
                    return;
                }else{
                    this.locationstatus = "定位成功"
                    // this.locationInfo = this.jiashuju.info;
                    // this.gpsDeviceID = this.jiashuju.gpsDeviceID;
                    this.locationInfo = res.info;
                    this.gpsDeviceID = res.gpsDeviceID;
                    this.locationInfo.forEach((item,index) => {
                        if( index == 0 ){
                            this.locationTime = this.locationInfo[0].gps_time;
                            this.locationDetail = this.locationInfo[0].gps_info;
                            var p0 = item.gps_lng;
                            var p1 = item.gps_lat;
                            var pointOnWay = new BMap.Point(p0,p1);
                            var onwayIcon = new BMap.Icon("../../img/car.png",new BMap.Size(40,49));
                            this.addMarker(pointOnWay, new BMap.Label(item.gps_info, {offset: new BMap.Size(20, -10)}),onwayIcon);
                        } else {
                            this.locationTime = this.locationInfo[0].gps_time;
                            this.locationDetail = this.locationInfo[0].gps_info;
                            var p0 = item.gps_lng;
                            var p1 = item.gps_lat;
                            var pointOnWay = new BMap.Point(p0,p1);
                            var onwayIcon = new BMap.Icon("../../img/location_onway.png",new BMap.Size(40,49));
                            this.addMarker(pointOnWay, new BMap.Label(item.gps_info, {offset: new BMap.Size(20, -10)}),onwayIcon);
                        }
                    })
                }
            })
        }
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 返回按钮点击触发
     */
    goBack=function(){
        router.go('/app/order/OrderManageDelivered')
    }
    

}
