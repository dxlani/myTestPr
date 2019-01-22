import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router';
import '../../favicon.ico';
import "../../img/plus.png";
declare var $: any;
Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxInquiryReleaseManage.html'),
    style: require('./WxInquiryReleaseManage.scss')
})
export class WxInquiryReleaseManageComponent extends Vue {
    el: '#wxInquiry';
    skip = 0;
    /* 总询价编号 */
    searchingInquiryId: string = '';
    /**询价状态 */
    searchingState: string = ''
    /**
     * 待反馈询价单下拉
     */
    inquiryStatusList = [
        {text:'待接单',value:"0"},
        {text:'待报价',value:"2,4,5,6,7"},
        {text:'已终结',value:"2"}]
    /**
     * 询价单列表 
     */
    InquiryData = [];
    /**
     * 判断列表是否空
     */
    notnull:boolean=true;
    /**
     * 是否为待反馈 
     */
    pendingBack:boolean=true;
    /**
     * 是否为待处理
     */
    isPendingDeal:boolean = false;
    /**
     * 是否为已确认
     */
    alreadyInquiry:boolean=false;
    /**
     * 是否为待报价
     */
    isPendingQuote:boolean = false;
    
    dealStatusList = [
        { text: "全部", value: "9,10" },
        { text: "已中标", value: "9" },
        { text: "未中标", value: "10" },
    ];
    StateDropDown = [];
    isAdmin="";
    weChatAuthorize="";
    showTemp:boolean=true;
    ready() {
        this.isAdmin=sessionStorage.getItem("isAdmin");
        this.weChatAuthorize=sessionStorage.getItem("weChatAuthorize");
        /**
         * 拥有查看权限
         */
        if(this.weChatAuthorize.indexOf('3')>-1 || this.isAdmin=='true'){
            this.showTemp=true;
            $(".bd_content").scroll(()=>{
                /* 保存总数 */
                let scrollTop= document.querySelector('.bd_content').scrollTop;
                // console.log('scrollTop',scrollTop);
                window.sessionStorage.setItem('orderQueryTotal',JSON.stringify({
                    totalCount:this.skip,
                    scrollTop:scrollTop,
                }));
            });
            //初始值为空
            this.skip = 0;
            this.InquiryData=[];
            if(window.sessionStorage.getItem('orderQuery')){
                let inquiryQuery = JSON.parse(window.sessionStorage.getItem('orderQuery'));
                this.searchingInquiryId = inquiryQuery.searchingInquiryId;
                this.searchingState = inquiryQuery.searchingState;
                this.pendingBack=inquiryQuery.pendingBack;
                this.isPendingDeal=inquiryQuery.isPendingDeal;
                this.alreadyInquiry=inquiryQuery.alreadyInquiry;
                if(this.pendingBack){
                    this.StateDropDown = this.inquiryStatusList;
                    $('.weui-flex__item').eq(0).addClass('fontstyle');
                    var init_px=$('.weui-flex__item').eq(0).children('a').offset().left;
                    $('.bottomline').css('left',init_px+'px');
                }else if (this.isPendingDeal){
                    $('.weui-flex__item').eq(1).addClass('fontstyle');
                    var init_px=$('.weui-flex__item').eq(1).children('a').offset().left;
                    $('.bottomline').css('left',init_px+'px');
                }else if(this.alreadyInquiry){
                    this.StateDropDown = this.dealStatusList;
                    $('.weui-flex__item').eq(2).addClass('fontstyle');
                    var init_px=$('.weui-flex__item').eq(2).children('a').offset().left;
                    $('.bottomline').css('left',init_px+'px');
                }
            }else{
                this.StateDropDown = this.inquiryStatusList;
                this.searchingInquiryId = "";
                this.searchingState = this.StateDropDown[0].value;
                this.pendingBack=true;
                this.isPendingDeal=false;
                this.alreadyInquiry=false;
                /* 初始化顶部样式 */
                $('.weui-flex__item').eq(0).addClass('fontstyle');
                var init_px=$('.weui-flex__item').eq(0).children('a').offset().left;
                $('.bottomline').css('left',init_px+'px');
            }
            if(window.sessionStorage.getItem('orderQueryTotal')){
                let inquiryQueryTotal = JSON.parse(window.sessionStorage.getItem('orderQueryTotal'));
                this.load2(this.searchingInquiryId,this.searchingState,inquiryQueryTotal);
            }else{
                this.load(this.searchingInquiryId,this.searchingState,0,10);
            }
            
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
            
            //加载数据
            this.load(this.searchingInquiryId,this.searchingState, this.skip, 10);
            /* 下拉刷新 */
            $(".bd_content").pullToRefresh({
                distance: 60,
                onRefresh: ()=>{
                    setTimeout(()=>{
                        this.load(this.searchingInquiryId, this.searchingState, 0, 10);
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
            $(".bd_content").infinite(53).on("infinite", ()=> {
                if(loading) return;
                loading = true;
                setTimeout(()=> {
                    this.skip = this.InquiryData.length;
                    this.load1(this.searchingInquiryId, this.searchingState, this.skip, 10);
                    loading = false;
                }, 1000);
            });
        }else{
            this.showTemp=false;
        }
    }

    //请求数据
    load(searchingInquiryId, searchingState, skip, count) {
        $.showLoading('加载中...');
        if(this.pendingBack == true){
            if(this.searchingState == "0" || this.searchingState == "2"){
                this.isPendingQuote = false;
                dataService().CspInquiry.getCspInquiryList(searchingInquiryId, "", searchingState, "", "", "", "", skip, count).then((res) => {
                    if(res.data.length>0){
                        this.InquiryData=res.data;
                        this.InquiryData.forEach((item) => {
                            if(item.goodsName.length>7){
                                item.goodsName=item.goodsName.substr(0,7)+"..."
                            }
                        });
                        this.notnull=true;
                       if(res.data.length<10){
                            $('.weui-loadmore__tips').html('没有更多询价单可加载...');
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
                this.isPendingQuote = true;
                dataService().Inquiry.getInquiryList(searchingInquiryId, "", "", "",searchingState, "", "", skip, count).then((res) => {
                    if(res.data.length>0){
                        this.InquiryData=res.data;
                        this.InquiryData.forEach((item) => {
                            if(item.goodsName.length>7){
                                item.goodsName=item.goodsName.substr(0,7)+"..."
                            }
                        });
                        this.notnull=true;
                       if(res.data.length<10){
                            $('.weui-loadmore__tips').html('没有更多询价单可加载...');
                            $('.weui-loading').hide();
                            $(".bd_content").destroyInfinite();
                        }else{
                            $('.weui-loadmore__tips').html('正在加载...');
                            $('.weui-loading').hide();
                            $(".bd_content").infinite(53);
                        }
                    }else{
                        this.notnull=false;
                    }
                    $.hideLoading();
                }, function (rej) {});
            }
        }else if(this.alreadyInquiry == true){
            dataService().Inquiry.getInquiryList(searchingInquiryId, "", "", "",searchingState, "", "", skip, count).then((res) => {
                if(res.data.length>0){
                    this.InquiryData=res.data;
                    this.InquiryData.forEach((item) => {
                        if(item.goodsName.length>7){
                            item.goodsName=item.goodsName.substr(0,7)+"..."
                        }
                    });
                    this.notnull=true;
                   if(res.data.length<10){
                        $('.weui-loadmore__tips').html('没有更多询价单可加载...');
                        $('.weui-loading').hide();
                        $(".bd_content").destroyInfinite();
                    }else{
                        $('.weui-loadmore__tips').html('正在加载...');
                        $('.weui-loading').hide();
                        $(".bd_content").infinite(53);
                    }
                }else{
                    this.notnull=false;
                }
                $.hideLoading();
            }, function (rej) {});
        }

    }

    load1(searchingInquiryId, searchingState, skip, count){
        $.showLoading('加载中...');
        if(this.pendingBack == true){
            if(this.searchingState == "0" || this.searchingState == "2"){
                this.isPendingQuote = false;
                dataService().CspInquiry.getCspInquiryList(searchingInquiryId, "", searchingState, "", "", "", "", skip, count).then((res) => {
                    var list = res.data;
                    list.forEach((item) => {
                        if(item.goodsName.length>7){
                            item.goodsName=item.goodsName.substr(0,7)+"..."
                        }
                    });
                    if(list.length>0){
                        for (var j = 0; j <list.length; j++) {
                            this.InquiryData.push(list[j]);
                        }
                        if(list.length<10){
                            $('.weui-loadmore__tips').html('没有更多询价单可加载...');
                            $('.weui-loading').hide();
                        }else{
                            $('.weui-loadmore__tips').html('正在加载...');
                            $('.weui-loading').show();
                        }
                    }
                    $.hideLoading();
                }, function (rej) {});
            }else{
                this.isPendingQuote = true;
                dataService().Inquiry.getInquiryList(searchingInquiryId, "", "", "",searchingState, "", "", skip, count).then((res) => {
                    var list = res.data;
                    list.forEach((item) => {
                        if(item.goodsName.length>7){
                            item.goodsName=item.goodsName.substr(0,7)+"..."
                        }
                    });
                    if(list.length>0){
                        for (var j = 0; j <list.length; j++) {
                            this.InquiryData.push(list[j]);
                        }
                        if(list.length<10){
                            $('.weui-loadmore__tips').html('没有更多询价单可加载...');
                            $('.weui-loading').hide();
                        }else{
                            $('.weui-loadmore__tips').html('正在加载...');
                            $('.weui-loading').show();
                        }
                    }
                    $.hideLoading();
                }, function (rej) {});
            }
        }else if(this.alreadyInquiry == true){
            dataService().Inquiry.getInquiryList(searchingInquiryId, "", "", "",searchingState, "", "", skip, count).then((res) => {
                var list = res.data;
                list.forEach((item) => {
                    if(item.goodsName.length>7){
                        item.goodsName=item.goodsName.substr(0,7)+"..."
                    }
                });
                if(list.length>0){
                    for (var j = 0; j <list.length; j++) {
                        this.InquiryData.push(list[j]);
                    }
                    if(list.length<10){
                        $('.weui-loadmore__tips').html('没有更多询价单可加载...');
                        $('.weui-loading').hide();
                    }else{
                        $('.weui-loadmore__tips').html('正在加载...');
                        $('.weui-loading').show();
                    }
                }
                $.hideLoading();
            }, function (rej) {});
        }
    }
    //请求数据(返回列表)
    load2(searchingInquiryId, searchingState,inquiryQueryTotal) {
        $.showLoading('加载中...');
        if(this.pendingBack == true){
            if(this.searchingState == "0" || this.searchingState == "2"){
                this.isPendingQuote = false;
                dataService().CspInquiry.getCspInquiryList(searchingInquiryId, "", searchingState, "", "", "", "", 0,inquiryQueryTotal.totalCount+10).then((res) => {
                    var list = res.data;
                    list.forEach((item) => {
                        if(item.goodsName.length>7){
                            item.goodsName=item.goodsName.substr(0,7)+"..."
                        }
                    });
                    if(list.length>0){
                        for (var j = 0; j <list.length; j++) {
                            this.InquiryData.push(list[j]);
                        }
                        if(list.length<10){
                            $('.weui-loadmore__tips').html('没有更多询价单可加载...');
                            $('.weui-loading').hide();
                        }else{
                            $('.weui-loadmore__tips').html('正在加载...');
                            $('.weui-loading').show();
                        }
                    }
                    $.hideLoading();
                }).then(()=>{
                    $('.bd_content').scrollTop(inquiryQueryTotal.scrollTop);
                });
            }else{
                this.isPendingQuote = true;
                dataService().Inquiry.getInquiryList(searchingInquiryId, "", "", "",searchingState, "", "", 0,inquiryQueryTotal.totalCount+10).then((res) => {
                    var list = res.data;
                    list.forEach((item) => {
                        if(item.goodsName.length>7){
                            item.goodsName=item.goodsName.substr(0,7)+"..."
                        }
                    });
                    if(list.length>0){
                        for (var j = 0; j <list.length; j++) {
                            this.InquiryData.push(list[j]);
                        }
                        if(list.length<10){
                            $('.weui-loadmore__tips').html('没有更多询价单可加载...');
                            $('.weui-loading').hide();
                        }else{
                            $('.weui-loadmore__tips').html('正在加载...');
                            $('.weui-loading').show();
                        }
                    }
                    $.hideLoading();
                }).then(()=>{
                    $('.bd_content').scrollTop(inquiryQueryTotal.scrollTop);
                });
            }
        }else if(this.alreadyInquiry == true){
            dataService().Inquiry.getInquiryList(searchingInquiryId, "", "", "",searchingState, "", "", 0,inquiryQueryTotal.totalCount+10).then((res) => {
                var list = res.data;
                list.forEach((item) => {
                    if(item.goodsName.length>7){
                        item.goodsName=item.goodsName.substr(0,7)+"..."
                    }
                });
                if(list.length>0){
                    for (var j = 0; j <list.length; j++) {
                        this.InquiryData.push(list[j]);
                    }
                    if(list.length<10){
                        $('.weui-loadmore__tips').html('没有更多询价单可加载...');
                        $('.weui-loading').hide();
                    }else{
                        $('.weui-loadmore__tips').html('正在加载...');
                        $('.weui-loading').show();
                    }
                }
                $.hideLoading();
            }).then(()=>{
                $('.bd_content').scrollTop(inquiryQueryTotal.scrollTop);
            });
        }
    }

    //查询调用
    query = function() {
        $(".bd_content").destroyInfinite();
        this.InquiryData=[];
        this.load(this.searchingInquiryId, this.searchingState, 0, 10);
        $('.searchPop').animate({top:'-165px'},500,function(){
            $('.searchModal').hide();
        });
        this.localCriteria();
    }
    /* 重置 */
    reset=function(){
        this.searchingInquiryId = '';
        if(this.pendingBack){
            this.StateDropDown = this.inquiryStatusList;
            this.searchingState = this.StateDropDown[0].value;
        }else if (this.isPendingDeal){
            this.searchingState = "8,11";
        }else if(this.alreadyInquiry){
            this.StateDropDown = this.dealStatusList;
            this.searchingState = this.StateDropDown[0].value;
        }
    }

    // 已下单查看详情事件
    LinckToInquiryDetail = function(item){
        if(item.status=='未处理' || item.status=='询价终结'){
            router.go("/WxInquiry/WxInquiryReleaseDetail?id=" + item.id + '&status=' + item.status);
        }else{
            router.go("/WxInquiry/WxInquiryDetail?id=" + item.id + '&status=' + item.status);
        }
    }

    //已处理查看详情事件
    LinckToInquiryDetail1 = function (item) {
        router.go("/WxInquiry/WxInquiryDetail?id="+item.id+'&status='+item.status);
    }

    /* 待反馈 */
    goInquiry(){
        $(".bd_content").destroyInfinite();
        this.InquiryData = [];
        this.searchingInquiryId="";
        this.StateDropDown = this.inquiryStatusList;
        this.searchingState = this.inquiryStatusList[0].value;
        this.pendingBack = true;
        this.alreadyInquiry = false;
        this.isPendingDeal = false;
        this.skip = 0;
        this.load(this.searchingInquiryId,this.searchingState, this.skip, 10);
        this.localCriteria();
    }

    /**
     * 待处理
     */
    goDeal(){
        $(".bd_content").destroyInfinite();
        this.InquiryData = [];
        this.searchingInquiryId="";
        this.searchingState = "8,11";
        this.pendingBack = false;
        this.alreadyInquiry = true;
        this.isPendingDeal = true;
        this.skip = 0;
        this.StateDropDown = [];
        this.load(this.searchingInquiryId,this.searchingState, this.skip, 10);
        this.localCriteria();
    }
    /**
     * 已确认
     */
    goConfirm(){
        $(".bd_content").destroyInfinite();
        this.InquiryData = [];
        this.searchingInquiryId="";
        this.StateDropDown = this.dealStatusList;
        this.searchingState = this.dealStatusList[0].value;
        this.pendingBack = false;
        this.alreadyInquiry = true;
        this.isPendingDeal = false;
        this.skip = 0;
        this.load(this.searchingInquiryId,this.searchingState, this.skip, 10);
        this.localCriteria();
    }

    /* 新增询价单 */
    inquiryAdd(){
        router.go("/WxInquiry/WxInquiryAdd?id="+""+"&name="+"add");
    }
    /* 存储询价单查询条件 */
    localCriteria = function(){
        window.sessionStorage.setItem('orderQuery',JSON.stringify({
            searchingInquiryId:this.searchingInquiryId,
            searchingState:this.searchingState,
            pendingBack:this.pendingBack,
            isPendingDeal:this.isPendingDeal,
            alreadyInquiry:this.alreadyInquiry,
        }));
    }
}
