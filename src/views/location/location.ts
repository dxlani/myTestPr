import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import * as VueRouter from 'vue-router';
//import '../../img/location_start.png';
//import '../../img/location_end.png';
//import '../../img/car.png';

// import 'https://api.map.baidu.com/api?v=2.0&ak=7eGHQWZhEnRt28NiHnkgloKVb6n3A3MK&s=1'



var router = new VueRouter();

@VueComponent({
    template: require('./location.html'),
})

export class LocationComponent extends Vue {
    el:'#location'
    components:({
        vclienttable:any,
    })
   
    @Prop
    map:any;
    myGeo;
    locationText="定位"
    /* 订单编号 */
    orderId:string="";
    /**
     * 进入页面获取的信息
     */
    phone="";
    originAddress="";//定位所需参数
    destinationAddress=""//定位所需参数
    carCode="";

    //以下为定位后获取的数据
    creationTime=""//定位日期
    area=""//地点
    locationType=""//定位方式
    status=""
    /**发货地送货地数组 */
    adds = [];

    ready=function(){
        this.myGeo = new BMap.Geocoder();
        this.initMap();
        if(this.$route.query.carCode&&this.$route.query.carCode!="undefined"){
            this.carCode=this.$route.query.carCode
        }else{
            this.carCode="";
        }
        this.phone=this.$route.query.phone;
        this.orderId=this.$route.query.orderId;
        this.originAddress=this.$route.query.originAddress;
        this.destinationAddress=this.$route.query.destinationAddress;
        this.status="";
        this.creationTime="";
        this.area="";
        this.adds = [this.originAddress,this.destinationAddress];
        for (var i = 0; i < this.adds.length; ++i) {
            this.s_e(this.adds[i],i);
        }

    }
    ///////////////////////////////////////////下面是百度地图SDK中的方法/////////////////////
        initMap=function() {
            this.createMap(); //创建地图
            this.setMapEvent(); //设置地图事件
            this.addMapControl(); //向地图添加控件
        }

        //     //创建地图函数：
        createMap=function() {
            
            this.map = new BMap.Map("dituContent"); //在百度地图容器中创建一个地图
            var point = new BMap.Point(119.446448, 32.164418); //定义一个中心点坐标
            this.map.centerAndZoom(point, 7); //设定地图的中心点和坐标并将地图显示在地图容器中
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


        // 编写创建标注函数
        addMarker=function(point, label) {
            var marker = new BMap.Marker(point);
            this.map.addOverlay(marker);
            marker.setLabel(label);
        }

        //创建地图标记
        addMarkerPoint=function(point, label , icon) {
            var options={icon: icon};
            var marker = new BMap.Marker(point,options);  // 创建标注
            this.map.addOverlay(marker);
            marker.setLabel(label);
        }

        //逆地址解析函数,起始点使用
        s_e=function(adds,index) {
            this.myGeo.getPoint(adds, (point)=> {
                // console.log(adds);
                if (point) {
                    if(index == "0"){
                        var address = new BMap.Point(point.lng, point.lat);
                        var startIcon = new BMap.Icon("./img/location_start.png", new BMap.Size(40, 49));;
                        this.addMarkerPoint(address, new BMap.Label(adds, {
                            offset: new BMap.Size(20, -10)}), startIcon);
                    }else if(index == "1"){
                        var address = new BMap.Point(point.lng, point.lat);
                        var startIcon = new BMap.Icon("./img/location_end.png", new BMap.Size(40, 49));;
                        this.addMarkerPoint(address, new BMap.Label(adds, {
                            offset: new BMap.Size(20, -10)}), startIcon);
                    }
                }
            });
        }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 返回按钮点击触发
     */
    goBack=function(){
        router.go('/app/order/OrderManageDelivered')
    }
    location=function(){
        if(!this.phone){
            bootbox.alert("暂未获取车辆电话");
            return;
        }
        this.locationText="定位中..."
        dataService().Location.getLocation(this.phone,this.orderId).then((res)=>{
            this.locationText="定位"
            //如果返回数据时已经跳出定位页面，则不做任何操作
            if(window.location.hash.indexOf("order/location")==-1){
                return;
            }
            //获取数据后执行
            if(!(res&&res.latitude)){
                bootbox.alert("定位失败或该车辆未开通定位");
                this.status="定位失败"
                return;
            }
            this.status="定位成功";
            this.creationTime=res.creationTime;
            this.area=res.area;
            /**创建地图标记 */
            var p0 = res.longitude;
            var p1 = res.latitude;
            var pt = new BMap.Point(p0, p1);
            this.addMarker(pt, new BMap.Label(this.area, { offset: new BMap.Size(20, -10) }));
        },()=>{this.locationText="定位"})
    }

}
