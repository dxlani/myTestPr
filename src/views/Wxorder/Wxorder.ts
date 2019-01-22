import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router';
import '../../favicon.ico';
import "../../img/plus.png";
import "../../img/locationtip.png";
declare var $: any;
Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./Wxorder.html'),
    style: require('./Wxorder.scss')
})
export class WxorderComponent extends Vue {
    el: '#wxorder';
      /**订单编号 */
      searchOrderId=''; 
      /**订单状态 */
      searchOrderStatus='';
      /**发货地址*/
      searchStartAddress='';
      /**送货地址*/
      searchEndAddress='';
    /* 总询价编号 */
    /**订单列表 */
    orderData = [];
    /* 判断列表是否空 */
    notnull:boolean=true;

    tab1:boolean=true;
    tab2:boolean=false;
    tab3:boolean=false;
    /* 两种列表切换 */
    showList:boolean=true;
    totalCount:number=0;

    
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
    

    orderStatuslist1 = 
    [{value:"0",text:"待接单"},
    {value:"1,2,3,4",text:"派车中"},
    {value:"2",text:"已终结"}];

    orderStatuslist2 =
    [{text:"已发货",value:"6"},
    {text:"已送达",value:"7"}]; 
    /* 正在加载 */
    loading:boolean=false;
    /* 切换列表 */
    liststatus="";
    isAdmin="";
    weChatAuthorize="";
    showTemp:boolean=true;
    ready() {
   
        this.orderData=[];
        this.isAdmin=sessionStorage.getItem("isAdmin");
        this.weChatAuthorize=sessionStorage.getItem("weChatAuthorize");
        if(this.weChatAuthorize.indexOf('4')>-1 || this.isAdmin=='true'){
            this.showTemp=true;

       $(".bd_content").scroll(()=>{
            /* 保存总数 */
            let scrollTop= document.querySelector('.bd_content').scrollTop;
            console.log('scrollTop',scrollTop);
            window.sessionStorage.setItem('orderQueryTotal',JSON.stringify({
                totalCount:this.totalCount,
                scrollTop:scrollTop,
            }));
        });
        if(window.sessionStorage.getItem('orderQuery')){
            let orderQuery = JSON.parse(window.sessionStorage.getItem('orderQuery'));
            this.searchOrderId = orderQuery.searchOrderId;
            this.searchStartAddress = orderQuery.searchStartAddress;
            this.searchEndAddress = orderQuery.searchEndAddress;
            this.searchOrderStatus = orderQuery.searchOrderStatus;
            this.tab1=orderQuery.tab1;
            this.tab2=orderQuery.tab2;
            this.tab3=orderQuery.tab3;
                if(this.tab1){
                    $('.weui-flex__item').eq(0).addClass('fontstyle');
                    var init_px=$('.weui-flex__item').eq(0).children('a').offset().left;
                    $('.bottomline').css('left',init_px+'px');
                }else if (this.tab2){
                    $('.weui-flex__item').eq(1).addClass('fontstyle');
                    var init_px=$('.weui-flex__item').eq(1).children('a').offset().left;
                    $('.bottomline').css('left',init_px+'px');
                }else if(this.tab3){
                    $('.weui-flex__item').eq(2).addClass('fontstyle');
                    var init_px=$('.weui-flex__item').eq(2).children('a').offset().left;
                    $('.bottomline').css('left',init_px+'px');
                }
        }else{ 
            //初始值为空
            this.searchOrderId = '';
            this.searchStartAddress='';
            this.searchEndAddress='';
            this.searchOrderStatus = '0';
            this.tab1=true;
            this.tab2=false;
            this.tab3=false;
            /* 控制初始化列表 */
            this.showList=true;
             /* 初始化顶部样式 */
            $('.weui-flex__item').eq(0).addClass('fontstyle');
            var init_px=$('.weui-flex__item').eq(0).children('a').offset().left;
            $('.bottomline').css('left',init_px+'px');
        }
        if(window.sessionStorage.getItem('orderQueryTotal')){
            let orderQueryTotal = JSON.parse(window.sessionStorage.getItem('orderQueryTotal'));
            this.load2(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,orderQueryTotal);
        }else{
            this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,0,10);
        }
        // this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,0,10);
        $('.weui-flex__item').eq(0).click(function(){
            var px=$(this).children('a').offset().left;
            $('.bottomline').css('left',px+'px');
            $(this).addClass('fontstyle').siblings('.weui-flex__item').removeClass('fontstyle');
        });
        $('.weui-flex__item').eq(1).click(function(){
            var px=$(this).children('a').offset().left;
            $('.bottomline').css('left',px+'px');
            $(this).addClass('fontstyle').siblings('.weui-flex__item').removeClass('fontstyle');
        });
        $('.weui-flex__item').eq(2).click(function(){
            var px=$(this).children('a').offset().left;
            $('.bottomline').css('left',px+'px');
            $(this).addClass('fontstyle').siblings('.weui-flex__item').removeClass('fontstyle');
        });
        /* 搜索模态框 */
        $('.search').click(function(){
            if($('.searchPop').css('top')=='-165px'){
                $('.searchModal').show();
                $('.searchPop').animate({top:'50px'},500);
            }else if ($('.searchPop').css('top')=='50px'){
                $('.searchPop').animate({top:'-165px'},500,function(){
                    $('.searchModal').hide();
                });
             }
            $('.searchPop').click(function(e){
                e.stopPropagation();
            })
        })
        $('.searchModal').click(function(){
            $('.searchPop').animate({top:'-165px'},500,function(){
                $('.searchModal').hide();
            });
        })
        
        
        
        /* 下拉刷新 */
        $(".bd_content").pullToRefresh({
            distance: 60,
            onRefresh: ()=>{
                setTimeout(()=>{
                    this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,0,10);
                    $(".bd_content").pullToRefreshDone();
                }, 1500);
            },
            onPull: function (percent) {
                if (percent > 100) percent = 100;
                $(".circle").html(percent);
                $(".circle").css('background-image', 'linear-gradient(0deg, #6cbdf7 ' + percent + '%, #6cbdf7 ' + percent + '%, transparent 50%, transparent 100%)')
            }
        });
        /* 滚动加载 */
        $(".bd_content").infinite(53).on("infinite", ()=> {
            if(this.loading) return;
            this.loading = true;
            setTimeout(()=> {
                this.totalCount = this.orderData.length;
                this.load1(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,this.totalCount,10);
                this.loading = false;
            }, 1000);
        });
        }else{
            this.showTemp=false;
        }
    }

    //请求数据
    load(orderId,orderStatus,startAddress,endAddress,skip,count) {
        $.showLoading('加载中...');
            if(orderStatus=="0" || orderStatus=="2"){
                this.showList=true;
                dataService().CspOrder.getCspOrderList(orderId,orderStatus,"","",startAddress,endAddress,skip,count,"").then((res)=>{
                    if(res.data.length>0){
                        this.orderData=res.data;
                        this.orderData.forEach((item) => {
                            if(item.goodsName.length>7){
                                item.goodsName=item.goodsName.substr(0,7)+"..."
                            }
                        });
                        this.notnull=true;
                       if(res.data.length<10){
                            $('.weui-loadmore__tips').html('没有更多订单可加载...');
                            $('.weui-loading').hide();
                            $(".bd_content").destroyInfinite();
                        }else{
                            $('.weui-loadmore__tips').html('正在加载...');
                            $('.weui-loading').show();
                            $(".bd_content").infinite(53);
                        }
                    }else{
                        this.notnull=false;
                    }
                    $.hideLoading();
                }, function (rej) {});
            }else{
                this.showList=false;
                dataService().Order.getOrderList(orderId,orderStatus,"","","","",startAddress,endAddress,skip,count,0,"").then((res)=>{
                    if(res.data.length>0){
                        this.orderData=res.data;
                        this.orderData.forEach((item) => {
                            if(item.goodsName.length>7){
                                item.goodsName=item.goodsName.substr(0,7)+"..."
                            }
                        });
                        this.notnull=true;
                       if(res.data.length<10){
                            $('.weui-loadmore__tips').html('没有更多订单可加载...');
                            $('.weui-loading').hide();
                            $(".bd_content").destroyInfinite();
                        }else{
                            $('.weui-loadmore__tips').html('正在加载...');
                            $('.weui-loading').show();
                            $(".bd_content").infinite(53);
                        }
                    }else{
                        this.notnull=false;
                    }
                    $.hideLoading();
                }, function (rej) {});
            }
    }

    load1(orderId,orderStatus,startAddress,endAddress,skip,count){
        $.showLoading('加载中...');
        if(orderStatus=="0" || orderStatus=="2"){
            this.showList=true;
            dataService().CspOrder.getCspOrderList(orderId,orderStatus,"","",startAddress,endAddress,skip,count,"").then((res)=>{
                var list = res.data;
                list.forEach((item) => {
                    if(item.goodsName.length>7){
                        item.goodsName=item.goodsName.substr(0,7)+"..."
                    }
                });
                if(list.length>0){
                    for (var j = 0; j <list.length; j++) {
                        this.orderData.push(list[j]);
                    }
                    if(list.length<10){
                        $('.weui-loadmore__tips').html('没有更多订单可加载...');
                        $('.weui-loading').hide();
                        $(".bd_content").destroyInfinite();
                    }else{
                        $('.weui-loadmore__tips').html('正在加载...');
                        $('.weui-loading').show();
                        $(".bd_content").infinite(53);
                    }
                }
                $.hideLoading();
            }, function (rej) {});
        }else{
            this.showList=false;
            dataService().Order.getOrderList(orderId,orderStatus,"","","","",startAddress,endAddress,skip,count,0,"").then((res)=>{
                var list = res.data;
                list.forEach((item) => {
                    if(item.goodsName.length>7){
                        item.goodsName=item.goodsName.substr(0,7)+"..."
                    }
                });
                if(list.length>0){
                    for (var j = 0; j <list.length; j++) {
                        this.orderData.push(list[j]);
                    }
                    if(list.length<10){
                        $('.weui-loadmore__tips').html('没有更多订单可加载...');
                        $('.weui-loading').hide();
                        $(".bd_content").destroyInfinite();
                    }else{
                        $('.weui-loadmore__tips').html('正在加载...');
                        $('.weui-loading').show();
                        $(".bd_content").infinite(53);
                    }
                }
                $.hideLoading();
            }, function (rej) {});
        }
    }

    //请求数据
    load2(orderId,orderStatus,startAddress,endAddress,orderQueryTotal) {
        $.showLoading('加载中...');
            if(orderStatus=="0" || orderStatus=="2"){
                this.showList=true;
                dataService().CspOrder.getCspOrderList(orderId,orderStatus,"","",startAddress,endAddress,0,orderQueryTotal.totalCount+10,"").then((res)=>{
                    if(res.data.length>0){
                        this.orderData=res.data;
                        this.orderData.forEach((item) => {
                            if(item.goodsName.length>7){
                                item.goodsName=item.goodsName.substr(0,7)+"..."
                            }
                        });
                        this.notnull=true;
                       if(res.data.length<10){
                            $('.weui-loadmore__tips').html('没有更多订单可加载...');
                            $('.weui-loading').hide();
                            $(".bd_content").destroyInfinite();
                        }else{
                            $('.weui-loadmore__tips').html('正在加载...');
                            $('.weui-loading').show();
                             $(".bd_content").infinite(53);
                        }
                    }else{
                        this.notnull=false;
                    }
                    $.hideLoading();
                }).then(()=>{
                    $('.bd_content').scrollTop(orderQueryTotal.scrollTop);
                })
            }else{
                this.showList=false;
                dataService().Order.getOrderList(orderId,orderStatus,"","","","",startAddress,endAddress,0,orderQueryTotal.totalCount+10,0,"").then((res)=>{
                    if(res.data.length>0){
                        this.orderData=res.data;
                        this.orderData.forEach((item) => {
                            if(item.goodsName.length>7){
                                item.goodsName=item.goodsName.substr(0,7)+"..."
                            }
                        });
                        this.notnull=true;
                       if(res.data.length<10){
                            $('.weui-loadmore__tips').html('没有更多订单可加载...');
                            $('.weui-loading').hide();
                            $(".bd_content").destroyInfinite();
                        }else{
                            $('.weui-loadmore__tips').html('正在加载...');
                            $('.weui-loading').show();
                            $(".bd_content").infinite(53);
                        }
                    }else{
                        this.notnull=false;
                    }
                    $.hideLoading();
                }).then(()=>{
                    $('.bd_content').scrollTop(orderQueryTotal.scrollTop);
                })
            }

    }

    //查询调用
    query = function() {
        $(".bd_content").destroyInfinite();
        this.orderData=[];
        this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,0,10);
        $('.searchPop').animate({top:'-165px'},500,function(){
            $('.searchModal').hide();
        });
        this.localCriteria();
    }
    //派车中切换列表
    querylist = function() {
        this.orderData=[];
        this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,0,10);
    }
    /* 重置 */
    reset=function(){
        this.searchOrderId = '';
        if(this.tab1){
            this.searchOrderStatus = '0';
        }else if(this.tab2){
            this.searchOrderStatus = '5';
        }else if(this.tab3){
            this.searchOrderStatus = '6,7';
        }
        if(this.searchOrderStatus=='0' || this.searchOrderStatus=='2'){
            this.showList=true;
        }else{
            this.showList=false;
        }
        this.searchStartAddress='';
        this.searchEndAddress='';
    }

    /* 待处理 */
    hasorder = function(){
        $(".bd_content").destroyInfinite();
        this.orderData = [];
        this.tab1=true;
        this.tab2=false;
        this.tab3=false;
        this.searchOrderStatus = '0';
        this.totalCount = 0;
        this.reset();
        this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,0,10);
        this.localCriteria();
    }

    /* 待发货 */
    waitdeliever = function(){
        $(".bd_content").destroyInfinite();
        this.orderData = [];
        this.tab2=true;
        this.tab1=false;
        this.tab3=false;
        this.searchOrderStatus = '5';
        this.totalCount = 0;
        this.reset();
        console.log(this.tab1,this.tab2,this.tab3,this.showList);
        this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,0,10);
        this.localCriteria();
    }
    /* 已发货 */
    hasdeliever = function(){
        $(".bd_content").destroyInfinite();
        this.orderData = [];
        this.tab3=true;
        this.tab1=false;
        this.tab2=false;
        this.searchOrderStatus = '6,7';
        this.totalCount = 0;  
        this.reset();
        console.log(this.tab1,this.tab2,this.tab3,this.showList);
        this.load(this.searchOrderId,this.searchOrderStatus,this.searchStartAddress,this.searchEndAddress,0,10);
        this.localCriteria();
    }


    /**获取订单详情 */
    goOrderdetail = function(item){
        router.go("/WxOrder/WxOrderManageDetail?id="+item.id+'&status='+item.status);
    }

    /**获取订单详情 */
    goOrderReleasedetail = function(item){
        router.go("/WxOrder/WxOrderReleaseDetail?id="+item.id+'&status='+item.status);
    }
    /* 发货订单 */
    orderAdd = function(){
        router.go("/WxOrder/WxOrderAdd");
    }

    /**显示定位页面 获取订单数据*/
    showLoaction = function(item){
        setTimeout(()=>{this.initMap();},50);
        this.myGeo = new BMap.Geocoder();
        this.locationPhone = item.driverPhone;
        this.locationCarCode = item.carrierCarCode;
        this.locationOriginAddress = item.originAddress;
        this.locationDestinationAddress = item.destinationAddress;
        this.locationStatus="暂无定位信息";
        this.locationTime="";
        this.locationArea="";
        this.locationText="定位";
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
        //     //获取数据后执行
        //     if(!(res && res.latitude)){
        //         this.locationStatus="定位失败或该车辆未开通定位";
        //         this.locationTime="";
        //         this.locationArea="";
        //         return;
        //     }
        //     this.locationStatus="";
        //     this.locationTime=res.creationTime;
        //     this.locationArea=res.area;

        //     var p0 = res.longitude;
        //     var p1 = res.latitude;
        //     var pt = new BMap.Point(p0, p1);
        //     var startIcon = new BMap.Icon("./img/locationtip.png", new BMap.Size(32,37));
        //     this.addMarkerPoint(pt, new BMap.Label(this.locationArea, { offset: new BMap.Size(14,-19) }),startIcon);
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

    // // 编写创建标注函数
    // addMarker=function(point, label) {
    //     var marker = new BMap.Marker(point);
    //     this.map.addOverlay(marker);
    //     marker.setLabel(label);
    // }

    // 编写创建标注函数
    addMarkerPoint=function(point, label,icon) {
        var options={icon: icon};
        var marker = new BMap.Marker(point,options);  // 创建标注
        this.map.addOverlay(marker);
        label.setStyle({
            color : "#2da1f4",
            fontSize : "12px",
            borderColor:'#2da1f4',
            fontFamily:"微软雅黑"
        });
        marker.setLabel(label);
    }

    //逆地址解析函数,起始点使用
    s_e=function(adds) {
        this.myGeo.getPoint(adds, (point)=> {
            if (point) {
                var address = new BMap.Point(point.lng, point.lat);
                var startIcon = new BMap.Icon("./img/locationtip.png", new BMap.Size(32,37));
                this.addMarkerPoint(address, new BMap.Label(adds, {
                    offset: new BMap.Size(20, -10)}), startIcon);
            }
        });
    }

    package:string = 'vue-typescript';
    repo:string = 'https://github.com/itsFrank/vue-typescript';


    /* 返回 */
    goback=function(){
        $.closePopup();
    }

    //存储订单查询条件
    localCriteria = function(){
        window.sessionStorage.setItem('orderQuery',JSON.stringify({
            searchOrderId:this.searchOrderId,
            searchOrderStatus:this.searchOrderStatus,
            searchStartAddress:this.searchStartAddress,
            searchEndAddress:this.searchEndAddress,
            tab1:this.tab1,
            tab2:this.tab2,
            tab3:this.tab3,
        }));
    }
}
