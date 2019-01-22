import { VueComponent } from 'vue-typescript'
import { dataService } from '../../../service/dataService'
import * as VueRouter from 'vue-router'
import '../../../img/search.png';
import '../../../img/route_img@3x.png';
declare var $: any;
declare var results: any;
declare var getDuration: any;
Vue.use(VueRouter);

var router = new VueRouter();

@VueComponent({
    template: require('./onroad.html'),
    style: require('./onroad.scss'),
})
export class ShowOnroadComponent extends Vue {
    el: '#cspOnroad';
    /**  订单编号*/
    orderID:string='';
    /** 发货地址 */
    startAddress:string='';
    /** 收货地址 */
    endAddress:string='';
    /** 订单状态 */
    orderStatus:string='';
    skip:number=0;
    count:number=10;
    /* 订单列表 */
    orderlist=[];
    orderList=[];
    list=[];
    /* 滚动加载 */
    loading:boolean=false;
    /* 判断列表是否空 */
    notnull:boolean=true;
    transit:any;
    plan:any;
    myGeo:any;
    startlng:any;
    startlat:any;
    endlng:any;
    endlat:any;
    searchComplete:any;
    Progress="";
    ready () {
        this.orderlist=[];
        this.orderList=[];
        /* 地图初始化 */
        //  this.mapInit();
        this.myGeo = new BMap.Geocoder(); // 创建地址解析器实例  
        
         $('.weui-flex__item').eq(0).addClass('fontstyle');
        /*顶部导航动画  */
        var init_px=$('.weui-flex__item').eq(0).children('a').offset().left;
        $('.bottomline').css('left',init_px+'px');
        $('.weui-flex__item').eq(0).click(function(){
            var px=$(this).children('a').offset().left;
            $('.bottomline').css('left',px+'px');
            $(this).addClass('fontstyle').siblings('.weui-flex__item').removeClass('fontstyle');
            this.orderStatus='5,6,7';
        })
        $('.weui-flex__item').eq(1).click(function(){
            var px=$(this).children('a').offset().left;
            $('.bottomline').css('left',px+'px');
            $(this).addClass('fontstyle').siblings('.weui-flex__item').removeClass('fontstyle');
            this.orderStatus='5';
        })
        $('.weui-flex__item').eq(2).click(function(){
            var px=$(this).children('a').offset().left;
            $('.bottomline').css('left',px+'px');
            $(this).addClass('fontstyle').siblings('.weui-flex__item').removeClass('fontstyle');
            this.orderStatus='6';
        });
        $('.weui-flex__item').eq(3).click(function(){
            var px=$(this).children('a').offset().left;
            $('.bottomline').css('left',px+'px');
            $(this).addClass('fontstyle').siblings('.weui-flex__item').removeClass('fontstyle');
            this.orderStatus='7';
        })

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

        /* 初始化全部列表 */
        this.orderStatus='5,6,7';
        this.load(this.skip,this.count,this.orderStatus);

        /* 下拉刷新 */
        $(".bd_content").pullToRefresh({
        distance: 60,
        onRefresh: ()=>{
            setTimeout(()=>{
            this.load(this.skip,this.count,this.orderStatus);
            $(".bd_content").pullToRefreshDone();
            }, 1500);
        },
        onPull: function (percent) {
            if (percent > 100) percent = 100
            $(".circle").html(percent);
            $(".circle").css('background-image', 'linear-gradient(0deg, #6cbdf7 ' + percent + '%, #6cbdf7 ' + percent + '%, transparent 50%, transparent 100%)')
        }
        });
    
        var loading = false;
        /* 滚动加载 */
        $(".bd_content").infinite(0).on("infinite", ()=> {
            if(loading) return;
            loading = true;
        setTimeout(()=> {
            var DataSkip = this.orderlist.length;
             this.load1(DataSkip,this.count,this.orderStatus);
             loading = false;
        }, 1000);   //模拟延迟
        });


    }
    load(skip,count,orderStatus){
        dataService().Order.getOnWayOrderList(this.orderID,orderStatus,this.startAddress,this.endAddress,skip,count).then((res)=>{
        if(res.length>0){
                this.notnull=true;
                this.orderlist=res;
                res.forEach((item) => {
                    if(item.goodsName.length>7){
                        item.goodsName=item.goodsName.substr(0,7)+"..."
                    }
                });
               
            if(res.length<10){
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
        })
        // .then(()=>{
        //     if(this.orderlist){
        //         this.orderlist.forEach((item,index) => {
        //             if(item.status=='已发货' && item.driverLon!=null && item.driverLat!=null){
        //              console.log(index,item.originLon,item.destinationLon);
                    

        //             }
        //         })
        //         console.log('this.orderlist2',this.orderlist);
        //     }
        // });
    }

    load1(DataSkip,count,orderStatus){
        $.showLoading('加载中...');
        dataService().Order.getOnWayOrderList(this.orderID,orderStatus,this.startAddress,this.endAddress,DataSkip,count).then((res)=>{
            res.forEach((item) => {
                if(item.goodsName.length>7){
                    item.goodsName=item.goodsName.substr(0,7)+"..."
                }
            });
            this.list=res;
            if(this.list.length>0){
                for (var j = 0; j <this.list.length; j++) {
                    this.orderlist.push(this.list[j]);
                }
                if(this.list.length<10){
                    $('.weui-loadmore__tips').html('没有更多订单可加载...')
                    $('.weui-loading').hide();
                    $(".bd_content").destroyInfinite();
                }else{
                        $('.weui-loadmore__tips').html('正在加载...');
                        $('.weui-loading').show();
                        $(".bd_content").infinite(53);
                }
            }
            $.hideLoading();
        },function(rej){});
  
    }
    allStatus=function(){
        $(".bd_content").destroyInfinite();
        this.orderlist=[];
        this.orderStatus='5,6,7';
        this.load(this.skip,this.count,this.orderStatus);
       
    }
    waitDelive=function(){
        $(".bd_content").destroyInfinite();
        this.orderlist=[];
        this.orderStatus='5';
        this.load(this.skip,this.count,this.orderStatus);
    }
    hasDelive=function(){
        $(".bd_content").destroyInfinite();
        this.orderlist=[];
        this.orderStatus='6';
        this.load(this.skip,this.count,this.orderStatus);
    }
    hasResive=function(){
        $(".bd_content").destroyInfinite();
        this.orderlist=[];
        this.orderStatus='7';
        this.load(this.skip,this.count,this.orderStatus);
    }


    /* 重置 */
    reset=function(){
        this.orderID='';
        this.startAddress='';
        this.endAddress='';
    }
    /* 搜索查询 */
    searchOrder=function(){
        this.load(this.skip,this.count,this.orderStatus);
        $('.searchPop').animate({top:'-165px'},500,function(){
            $('.searchModal').hide();
        });
    }


   
}