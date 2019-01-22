import { VueComponent } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'
import '../../img/plus.png';
declare var $: any;
Vue.use(VueRouter);

var router = new VueRouter();

@VueComponent({
    template: require('./wxFeedBack.html'),
    style: require('./wxFeedBack.scss')
})
export class wxFeedBackComponent extends Vue {
    el: '#wxFeedBack';
   
    skip:number=0;
    count:number=10;
    /* 订单列表 */
    feedbacklist=[];
    list=[];
    /** 
     * 回复状态
     */
    Status="0";
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
        this.feedbacklist=[];
        this.list=[];
      
        this.Status='0';
         $('.weui-flex__item').eq(0).addClass('fontstyle');
        /*顶部导航动画  */
        var init_px=$('.weui-flex__item').eq(0).children('a').offset().left;
        $('.bottomline').css('left',init_px+'px');
        $('.weui-flex__item').eq(0).click(function(){
            var px=$(this).children('a').offset().left;
            $('.bottomline').css('left',px+'px');
            $(this).addClass('fontstyle').siblings('.weui-flex__item').removeClass('fontstyle');
            this.Status='0';
        })
        $('.weui-flex__item').eq(1).click(function(){
            var px=$(this).children('a').offset().left;
            $('.bottomline').css('left',px+'px');
            $(this).addClass('fontstyle').siblings('.weui-flex__item').removeClass('fontstyle');
            this.Status='2';
        })
        $('.weui-flex__item').eq(2).click(function(){
            var px=$(this).children('a').offset().left;
            $('.bottomline').css('left',px+'px');
            $(this).addClass('fontstyle').siblings('.weui-flex__item').removeClass('fontstyle');
            this.Status='1';
        })


        /* 初始化全部列表 */
        this.load(this.skip,this.count,this.Status);

        /* 下拉刷新 */
        $(".bd_Content").pullToRefresh({
        distance: 60,
        onRefresh: ()=>{
            setTimeout(()=>{
            this.load(this.skip,this.count,this.Status);
            $(".bd_Content").pullToRefreshDone();
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
        $(".bd_Content").infinite(10).on("infinite", ()=> {
            if(loading) return;
            loading = true;
        setTimeout(()=> {
            var DataSkip = this.feedbacklist.length;
             this.load1(DataSkip,this.count,this.Status);
             loading = false;
        }, 1000);   //模拟延迟
        });


    }
    load(skip,count,Status){
        $.showLoading('加载中...');
        dataService().feedback.GetOpinionList(this.Status,skip,count).then((res)=>{
        if(res.length>0){
                this.notnull=true;
                this.feedbacklist=res;
            if(res.length<10){
                $('.weui-loadmore__tips').html('没有更多意见可加载...');
                $('.weui-loading').hide();
                $(".bd_Content").destroyInfinite();
                }else{
                $('.weui-loadmore__tips').html('正在加载...');
                $('.weui-loading').show();
                $(".bd_Content").infinite(10);
                }
            }else{
                this.notnull=false;
            }
            $.hideLoading();
        })
    }

    load1(DataSkip,count,Status){
        $.showLoading('加载中...');
       dataService().feedback.GetOpinionList(this.Status,DataSkip,count).then((res)=>{
            this.list=res;
            if(this.list.length>0){
                for (var j = 0; j <this.list.length; j++) {
                    this.feedbacklist.push(this.list[j]);
                }
                if(this.list.length<10){
                    $('.weui-loadmore__tips').html('没有更多意见可加载...')
                    $('.weui-loading').hide();
                    $(".bd_Content").destroyInfinite();
                }else{
                        $('.weui-loadmore__tips').html('正在加载...');
                        $('.weui-loading').show();
                        $(".bd_Content").infinite(10);
                }
            }else{
                $('.weui-loadmore__tips').html('没有更多意见可加载...')
                    $('.weui-loading').hide();
                    $(".bd_Content").destroyInfinite();
            }
            $.hideLoading();
        },function(rej){});
  
    }
    allStatus=function(){
        $(".bd_Content").destroyInfinite();
        this.orderlist=[];
        this.Status='0';
        this.load(this.skip,this.count,this.Status);
       
    }
    hasfeedBack=function(){
        $(".bd_Content").destroyInfinite();
        this.orderlist=[];
        this.Status='2';
        this.load(this.skip,this.count,this.Status);
    }
    nofeedBack=function(){
        $(".bd_Content").destroyInfinite();
        this.orderlist=[];
        this.Status='1';
        this.load(this.skip,this.count,this.Status);
    }
    addfeedBack=function(){
        router.go('/wxFeedBackAdd');
    }
}