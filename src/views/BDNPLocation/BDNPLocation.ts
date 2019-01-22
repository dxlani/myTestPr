import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import {LoginComponent} from '../login/login'
import * as VueRouter from 'vue-router'
import '../../img/location_start.png';
import '../../img/location_end.png';
import '../../img/car.png';

var router = new VueRouter();

@VueComponent({
    template: require('./BDNPLocation.html'),
    style: require('./BDNPLocation.scss')
})

export class BDNPLocationComponent extends Vue {
    el:'#BDNPLocation'
    components:({
        vclienttable:any,
        componentA: LoginComponent,
    })
   
    @Prop
    map:any;
    myGeo;
    /* 订单编号 */
    orderId:string="";
    /**车牌号 */
    carCode: string = "";
    /**发货地址 */
    originAddress: string = "";
    /**送货地址 */
    destinationAddress: string = "";
    /**定位情况 */
    status: string = "";
    /**定位日期 */
    creationTime: string = "";
    /**位置信息 */
    area: string = "";
    /**定位按钮 */
    locationText:string ="";
    /**历史定位日期 */
    historyCreationTime: string = "";
    /**历史位置信息 */
    historyArea: string = "";

    /**起始地目的地名称数组 */
    adds = [];
  
    ready=function(){
        this.myGeo = new BMap.Geocoder();
        this.initMap();
        this.locationText = "定位";
        this.originAddress=this.$route.query.originAddress;
        this.destinationAddress=this.$route.query.destinationAddress;
        this.carCode=this.$route.query.carCode;
        this.orderId=this.$route.query.orderId;
        this.status="";
        this.creationTime="";
        this.area="";
        this.historyCreationTime = "";
        this.historyArea = "";
        this.adds = [this.originAddress,this.destinationAddress];
        for (var i = 0; i < this.adds.length; ++i) {
            this.s_e(this.adds[i],i);
        }
    }

    /**定位 */
    location = function(){
        this.locationText="定位中..."
        //获取北斗定位信息
        dataService().Location.getBDNPLotion(this.carCode,this.orderId).then((res)=>{
            this.locationText="定位";
            /**获取历史定位信息 */
            dataService().Location.getHistoryPosition(this.carCode).then((resH)=>{
                if(resH){
                    this.historyArea = resH.address;
                    this.historyCreationTime = resH.time;
                }else{
                    this.historyArea = "";
                    this.historyCreationTime = "";
                }
                
            });

            if(!(res&&res.latitude)){
                bootbox.alert("定位失败或该车辆未开通定位");
                this.status="定位失败";
                return;
            }
            this.status="定位成功";
            this.creationTime=res.creationTime;
            this.area=res.area;
            //绘制定位点
            var p0 = parseFloat(res.longitude) / 600000;
            var p1 = parseFloat(res.latitude) / 600000;
            var pt = new BMap.Point(p0, p1);
            var trainIcon = new BMap.Icon("./img/car.png", new BMap.Size(48,28));;
            this.addMarkerPoint(pt, new BMap.Label(this.area, { offset: new BMap.Size(20, -10)}), trainIcon);
            
        },()=>{this.locationText="定位"})
    }
    /**返回按钮 */
    goBack=function(){
        router.go('/app/order/OrderManageDelivered')
    }

    /**创建地图 */
    initMap=function() {
        this.createMap(); 
        this.setMapEvent(); //设置地图事件
        this.addMapControl(); //向地图添加控件
    }

    //创建地图函数：
    createMap=function() {
        this.map = new BMap.Map("BDNPdituContent"); //在百度地图容器中创建一个地图
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
    addMarkerPoint=function(point, label , icon) {
        var options={icon: icon};
        var marker = new BMap.Marker(point,options);  // 创建标注
        this.map.addOverlay(marker);
        marker.setLabel(label);
        this.map.centerAndZoom(point, 11);
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
}
