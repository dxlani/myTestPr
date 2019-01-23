import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService';
import * as VueRouter from 'vue-router';
//import '../../favicon.ico';
declare var $: any;

Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxInquiryManage.html'),
    style: require('./WxInquiryManage.scss')
})
export class WxInquiryManageComponent extends Vue {
    el: '#wxInquiryManage';
    components: ({
        vclienttable: any,
    })
    @Prop
    /**是否显示暂无数据 */
    IsData: boolean = false;
    /**是否显示正在加载 */
    IsLoad: boolean = false;
    skip = 0;
    count = 10;
    router = new VueRouter();
    //查询数据初始化
    statusList = [
        { text: "全部", value: "" },
        { text: "报价中", value: "2,4,5,6,7" },//
        { text: "已报价", value: "8" },
        { text: "已接受", value: "9" },//
        { text: "已拒绝", value: "10" },//
        { text: "待确认", value: "11" },
        { text: "询价终结", value: "12" },//
    ]
    /**询价单列表 */
    InquiryData = [];
    /**查询数据初始化 */
    inquiryParameter = {
        code: "",
        status: "",
    }

    ready = function () {
        /**移除滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style","");

        /**是否显示暂无数据 */
        this.IsData = false;
        /**是否显示正在加载 */
        this.IsLoad = true;
        this.inquiryParameter.code = "";
        this.inquiryParameter.status = "";
        this.skip = 0;
        this.count = 10;
        this.InquiryData = [];
        //加载数据
        this.load(this.inquiryParameter, this.skip, this.count);
        //上拉滚动加载
        var loading = false;
        //状态标记
        $(".wx-top-k").infinite(50).on("infinite", () => {
            if (loading) return;
            loading = true;
            setTimeout(() => {
                // $.alert("上拉滚动加载");
                //加载数据
                var DataSkip = this.InquiryData.length / 10;
                this.load(this.inquiryParameter, DataSkip * 10, this.count);
                this.skip = DataSkip * 10;
                loading = false;
            }, 1500);   //模拟延迟
        });

        //下拉刷新
        $(".wx-top-k").pullToRefresh().on("pull-to-refresh", () => {
            setTimeout(() => {
                this.query(0, 10);
                $(".wx-top-k").pullToRefreshDone();
            }, 2000);
        });
    }

    //请求数据
    load = function (inquiryParameter, skip, count) {
        $.showLoading('加载中...');
        dataService().Inquiry.getInquiryList(inquiryParameter.code, "", "", "", inquiryParameter.status, "", "", skip, count)
            .then((res) => {
                if (res.data.length == 0) {
                    this.IsData = true;
                    $(".wx-top-k").destroyInfinite();
                } else {
                    this.IsData = false;
                    $(".wx-top-k").infinite();
                }
                if (res.data.length < 3) {
                    this.IsLoad = false;
                    $(".wx-top-k").destroyInfinite();
                } else {
                    this.IsLoad = true;
                    $(".wx-top-k").infinite();
                }

                // /**下拉加载数据 */
                var DataLengths = res.data.length;
                if (DataLengths > 0) {
                    for (var j = 0; j < DataLengths; j++) {
                        this.InquiryData.push(res.data[j]);
                    }
                } else {
                    /**销毁下拉滚动加载 */
                    $(".wx-top-k").destroyInfinite();
                }
                $.hideLoading();
            }, function (rej) {
                // console.info('rej:',rej);
            });
    }
    //查询调用
    query = function () {
        this.InquiryData = [];
        this.load(this.inquiryParameter, 0, 10);
    }

    //查看详情事件
    LinckToInquiryDetail = function (item) {
        router.go("/WxInquiry/WxInquiryReleaseDetail?id=" + item.id + '&status=' + item.status);
    }

    package: string = 'vue-typescript';
    repo: string = 'https://github.com/itsFrank/vue-typescript';

}
