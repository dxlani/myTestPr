import { Prop,VueComponent } from 'vue-typescript'
import {dataService} from '../../service/dataService'
import '../../img/daquan.png'
import '../../img/wode.png'
import '../../img/noValide.png'
import '../../img/daquanLocateIcon.png';
import '../../img/sino-er.png'
import '../../img/csp-er.png'
import '../../img/ccp-er.png'

@VueComponent({
    template: require('./daquanOrderLocation.html'),
    style: require('./daquanOrderLocation.scss')
})

export class DaquanOrderLocation extends Vue {
    el:'#DaquanOrderLocation'

    /* 当前用户是否有效 */
    isValide:boolean = false;
    /**用户Logo */
    userLogo:string = "";
    /* 车辆列表 */
    carList = [];
    /* 订单id */
    orderId:string = "";
    /* 订单编号 */
    orderNum:string = "";
    /* 车牌号 */
    carCode:string = "";
    /* 手机号 */
    phone:string = "";
    /* 北斗定位（内容） */
    bdLocation:string = "";
    /* 是否开通北斗定位 */
    isBdlocation:boolean = false;
    /* LBS定位按钮（内容） */
    lbsBtn:string = "";
    /* LBS按钮是否可点击 */
    isLbsdis:boolean = false;
    /* 是否开通lbs定位 */
    isLbsLocation:boolean = false;
    
    /* 定位时间 */
    locationTime:string = "";
    /* 当前位置 */
    nowArea:string = "";
    /* 定位按钮（内容） */
    locationText:string = "";
    /* 定位按钮是否可点击 */
    isLocationdis:boolean = false;
    /* 是否正在定位 */
    isLocating:boolean = false;

    /**
     * 订单追踪数据集合
     */
    orderLogList = [];
    /**
     * 订单追踪数据
     */
    orderLogItemList = [];

    /* 地图 */
    map:any;
    myGeo:any;
    /* 地图标记 */
    mapPoint:any;
    /* 用户token */
    userToken:string = "";
    /* 是否显示按钮 */
    // buttonIsshow:boolean = false;
    /* 向右点击次数 */
    clickNum: number = 0;
    /* 左边按钮是否可点 */
    leftIsdisabled: boolean = true;
    /* 右边按钮是否可点 */
    rightIsdisabled: boolean = false;
    /* 当前车辆订单短号 */
    carrierOrderCode: string = "";

    ready(){
        this.isValide = true;
        this.clickNum = 0;
        this.carList = [];
        this.userToken = this.$route.query.accountSID;
        this.orderId = this.$route.query.orderId;
        // this.userToken = "3f02b2188a8aa504162c50eb8544d4d5";
        // this.orderId = "08241401";
        if(this.userToken == "a26c15dcef031f4240fb3d8b23c16140"){
            this.userLogo = "../../img/daquan.png";
        }else if(this.userToken == "3f02b2188a8aa504162c50eb8544d4d5"){
            this.userLogo = "../../img/wode.png";
        }
        Vue.http.headers.common['accountSID'] = this.userToken;
        dataService().daquan.customerValide().then((res)=>{
            if(res.validationResult){
                this.isValide = true;
                this.initMap();
                this.myGeo = new BMap.Geocoder();
                this.mapPoint = [];
                this.carCode = "";
                this.phone = "";
                this.orderNum = "";
                this.bdLocation = "未开通";
                this.lbsBtn = "开通LBS定位";
                this.isLbsdis = false;
                this.locationTime = "";
                this.nowArea = "";
                this.locationText = "定位";
                this.isLocationdis = false;
                this.isLocating = false;
                this.orderLogList = [];
                dataService().daquan.getOrderInfo(this.orderId).then((res)=>{
                    if(res.list){
                        this.carList = res.list;
                        this.orderNum = this.carList[0].clientOrderId;
                        this.carCode = this.carList[0].carCode;
                        this.phone = this.carList[0].phoneNumber;
                        if(this.carList[0].beiDou){
                            this.isBdlocation = true;
                            this.bdLocation = "已开通";
                        }else{
                            this.isBdlocation = false;
                            this.bdLocation = "未开通";
                        }
                        if(this.carList[0].lbs){
                            this.isLbsLocation = true;
                            this.lbsBtn = "已开通";
                        }else{
                            this.isLbsLocation = false;
                            this.lbsBtn = "开通LBS定位";
                        }
                        if(this.carList[0].isArrival){
                            this.nowArea = "货已送达，该订单不再支持实时定位";
                            this.isLocationdis = true;
                        }else{
                            this.nowArea = "";
                            this.isLocationdis = false;
                        }
                    }else{
                        this.isLbsdis = true;
                        this.isLocationdis = true;
                    }
                }).then(()=>{
                    $("#tabs").width(this.carList.length * 103);
                    $("#tabs li:first").attr("class","tabs-li currentab");
                    $('.tabs-li').on('click',function(){
                        $(this).addClass('currentab').siblings('.tabs-li').removeClass('currentab');
                    });
                    this.leftIsdisabled = true;
                    var lcationtabWidth = $('#location-tabs').width();
                    var tabsWidth= $("#tabs").width();
                    if(lcationtabWidth <= tabsWidth){
                        this.rightIsdisabled = false;
                    }else{
                        this.rightIsdisabled = true;
                    }
                    /* 获取定位信息 */
                    dataService().daquan.getOrderTrackLocation(this.orderId).then((res)=>{
                        this.orderLogList = res.orderLocationList;
                        this.carrierOrderCode = this.carList[0].carrierOrderCode;
                        this.getOrderLocationList(this.carrierOrderCode,this.orderLogList);
                    }).then(()=>{
                        if($("#daquanOrderTimeline").find("li").length > 1){
                            $("#daquanOrderTimeline li:first").attr("class","firstStatus");
                            $("#daquanOrderTimeline li:last-child").attr("class","lastStatus");
                        }else if($("#daquanOrderTimeline").find("li").length == 1){
                            $("#daquanOrderTimeline li:last-child").attr("class","onlyStatus");
                        }
                    });  
                });
            }else{
                this.isValide = false;
            }
        });
    }

    /* 获取订单追踪信息 */
    getOrderLocationList(carrierOrderCode,list){
        this.orderLogItemList = [];
        if(carrierOrderCode == null || carrierOrderCode == undefined){
            this.orderLogItemList = list[0].orderLocationItemList;
            setTimeout(()=>{
                if($("#daquanOrderTimeline").find("li").length > 1){
                    $("#daquanOrderTimeline li:first").attr("class","firstStatus");
                    $("#daquanOrderTimeline li:last-child").attr("class","lastStatus");
                }else if($("#daquanOrderTimeline").find("li").length == 1){
                    $("#daquanOrderTimeline li:last-child").attr("class","onlyStatus");
                }
            },50)
        }else{
            // console.log(list.filter(item=>item.carrierOrderCode == carrierOrderCode))
            this.orderLogItemList = list.filter(item=>item.carrierOrderCode == carrierOrderCode)[0].orderLocationItemList;
            setTimeout(()=>{
                if($("#daquanOrderTimeline").find("li").length > 1){
                    $("#daquanOrderTimeline li:first").attr("class","firstStatus");
                    $("#daquanOrderTimeline li:last-child").attr("class","lastStatus");
                }else if($("#daquanOrderTimeline").find("li").length == 1){
                    $("#daquanOrderTimeline li:last-child").attr("class","onlyStatus");
                }
            },50)
        }
    }

    /* 向左滑动 */
    goLeft(){
        this.rightIsdisabled = false;
        this.clickNum = this.clickNum - 1;
        if(this.clickNum == 0){
            this.leftIsdisabled = true;
        }else{
            this.leftIsdisabled = false;
        }
        $('#tabs').animate({
            'margin-left': (-103)*this.clickNum
        });
    }

    /* 向右滑动 */
    goRight(){
        this.leftIsdisabled = false;
        this.rightIsdisabled = true;
        this.clickNum = this.clickNum + 1;
        $('#tabs').animate({
            'margin-left': (-103)*this.clickNum
        },500,()=>{
            var marginl = parseFloat($('#tabs').css('margin-left'));
            var lcationtabWidth = $('#location-tabs').width();
            var tabsWidth= $("#tabs").width();
            // console.log('marginl',marginl);
            // console.log('lcationtabWidth',lcationtabWidth)
            // console.log('tabsWidth',tabsWidth)
            if(-(tabsWidth-lcationtabWidth) >= marginl){
                this.rightIsdisabled = true;
            }else{
                this.rightIsdisabled = false;
            }
        });
    }

    /* 获取当前车辆信息 */
    getCar(item){
        this.orderNum = item.clientOrderId;
        this.carCode = item.carCode;
        this.phone = item.phoneNumber;
        if(item.beiDou){
            this.isBdlocation = true;
            this.bdLocation = "已开通";
        }else{
            this.isBdlocation = false;
            this.bdLocation = "未开通";
        }
        if(item.lbs){
            this.isLbsLocation = true;
            this.lbsBtn = "已开通";
        }else{
            this.isLbsLocation = false;
            this.lbsBtn = "开通LBS定位";
        }
        this.locationTime = "";
        if(item.isArrival){
            this.nowArea = "货已送达，该订单不再支持实时定位";
            this.isLocationdis = true;
        }else{
            this.nowArea = "";
            this.isLocationdis = false;
        }
        this.carrierOrderCode = item.carrierOrderCode
        this.getOrderLocationList(this.carrierOrderCode,this.orderLogList);
        this.initMap();
        this.myGeo = new BMap.Geocoder();
        this.mapPoint = [];
    }

    /* 开通LBS定位 */
    openLocation(){
        this.isLbsdis = true;
        this.lbsBtn = "短信已发送";
        dataService().daquan.registerLBS(this.carCode,this.phone).then((res)=>{
            if(res.registerStatus){
                bootbox.alert({ 
                    title: "开通LBS定位",
                    message: "请求开通定位短信已发送给司机</br>请等待司机同意后，刷新页面重新定位",
                    buttons: {
                        ok: {
                            label: '知道了',
                        }
                    },
                    className:"alert-content", 
                })
            }else{
                bootbox.alert({ 
                    title: "",
                    message: res.registerMsg,
                    buttons: {
                        ok: {
                            label: '知道了',
                        }
                    },
                    className:"alert-content", 
                })
                return;
            }
        }).then(()=>{
            setTimeout(()=>{
                this.isLbsdis = false;
                this.lbsBtn = "开通LBS定位";
            },300000)
        });
    }
    
    /* 定位 */
    location(){
        this.locationText = "定位中...";
        this.isLocating = true;
        this.isLocationdis = true;
        dataService().daquan.lbsLocation(this.carCode,this.phone).then((res)=>{
            if(res.locationSuccess){
                this.locationTime = res.locationDateTime;
                this.nowArea = res.locationAddress;
                var p0 = res.longitude;
                var p1 = res.latitude;
                var pt = new BMap.Point(p0, p1);
                this.addMarkerPoint(pt);
                dataService().daquan.getOrderTrackLocation(this.orderId).then((res)=>{
                    this.orderLogList = res.orderLocationList;
                    this.getOrderLocationList(this.carrierOrderCode,this.orderLogList);
                }).then(()=>{
                    if($("#daquanOrderTimeline").find("li").length > 1){
                        $("#daquanOrderTimeline li:first").attr("class","firstStatus");
                        $("#daquanOrderTimeline li:last-child").attr("class","lastStatus");
                    }else if($("#daquanOrderTimeline").find("li").length == 1){
                        $("#daquanOrderTimeline li:last-child").attr("class","onlyStatus");
                    }
                });  
            }else{
                this.locationTime = res.locationDateTime;
                this.nowArea = "定位失败或车辆暂未开通定位";
            }
        }).then(()=>{
            this.locationText = "定 位";
            this.isLocating = false;
            this.isLocationdis = false;
        });
    }

    /* 初始化地图 */
    initMap=function() {
        this.createMap();
        this.setMapEvent();
        // this.addMapControl();
    }

    /* 创建地图函数 */
    createMap=function() {
        this.map = new BMap.Map("dituContent");
        var point = new BMap.Point(119.446448, 32.164418);
        this.map.centerAndZoom(point, 9); 
        window['map'] = this.map;
    }

    /* 地图事件设置函数 */
    setMapEvent=function() {
        this.map.enableScrollWheelZoom();
    }

    // 地图控件添加函数：
    // addMapControl=function() {
    //     var ctrl_nav = new BMap.NavigationControl({
    //         anchor: BMAP_ANCHOR_TOP_LEFT,
    //         type: BMAP_NAVIGATION_CONTROL_LARGE
    //     });
    //     this.map.addControl(ctrl_nav);
    //     var ctrl_sca = new BMap.ScaleControl({
    //         anchor: BMAP_ANCHOR_BOTTOM_LEFT
    //     });
    //     this.map.addControl(ctrl_sca);
    // }

    // 编写创建标注函数
    // addMarker(point, label) {
    //     var marker = new BMap.Marker(point);
    //     this.map.addOverlay(marker);
    //     marker.setLabel(label);
    // }

    //创建地图标记
    addMarkerPoint=function(point) {
        if(this.mapPoint.length > 0){
            this.map.removeOverlay(this.mapPoint[0]);
            this.mapPoint = [];
        }
        var locationIcon = new BMap.Icon("./img/daquanLocateIcon.png", new BMap.Size(30, 30));
        var options={icon: locationIcon};
        var marker = new BMap.Marker(point,options);
        var label = this.nowArea;
        marker.setLabel(this.setLabelStyle(label));
        this.map.addOverlay(marker);
        this.map.panTo(point);
        this.mapPoint = this.map.getOverlays();
        // console.log(this.mapPoint );
    }

    /* 设置坐标点弹框 */
    setLabelStyle(label) {
        var offsetSize = new BMap.Size(-15, -65);
        var labelStyle = {
            color: "#333",
            backgroundColor: "#fff",
            border: "0",
            fontSize : "14px",
            width:"200px",
            verticalAlign:"center",
            borderRadius: "2px",
            whiteSpace:"normal",
            wordWrap:"break-word",
            padding:"7px",
        };
        var spanA="<span class='angle'><span>"
        // var num = (label.length/10) ;
        // switch(num) {
        //     case 0:
        //         offsetSize = new BMap.Size(-15, 30);
        //         break;
        //     case 1:
        //         offsetSize = new BMap.Size(-15, 50);
        //         break;
        //     case 2:
        //         offsetSize = new BMap.Size(-15, 70);
        //         break;
        //     case 3:
        //         offsetSize = new BMap.Size(-15, 90);
        //         break;
        //     default:
        //         break;
        // }
        var label = new BMap.Label(label + spanA, {
            offset: offsetSize
        });
        label.setStyle(labelStyle);
        return label;
    }
}