import { Prop,VueComponent } from 'vue-typescript'
import {dataService} from '../../service/dataService';
//import '../../img/pic1.png';
//import '../../img/pic2.png';
//import '../../img/pic3.png';
//import '../../img/pic4.png';
//import '../../img/u124.png';

var echarts = require('echarts');

@VueComponent({
    template: require('./home.html'),
    style: require('./home.scss')
})

export class HomeComponent extends Vue {
    el:'#home'

    // @Prop
    //询价部分
    /**本月总询价量 */
    inquiryTotal:number = null;
    /**询价环比上个月 */
    inquiryPercent:string = '';
    /**询价单环比上个月状态 */
    inquiryPercentStatus:string = '';
    /**待接单 */
    pendingOrder:number = null;
    /**待报价 */
    pendingQuotation:number = null;
    /**待确认 */
    successfulQuote:number = null;
    /**已中标 */
    successfulBidder:number = null;
    /**未中标 */
    unSuccessfulBidder:number = null;
    /**已终结 */
    end:number = null;
    //询价单状态构成饼图数据
    inquiryStatusData = [];
    //历史询价单数量折线图数据
    /**累计发布询价单数量 */
    inquiryReleaseTotal:number = null;
    /**询价折线图月份 */
    inquiryMonth = [];
    /**询价单数量数组 */
    inquiryData = [];

    //订单部分
    /**本月总订单量 */
    orderTotal:number = null;
    /**订单环比上个月百分比 */
    orderPercent:string = '';
    /**订单环比上个月状态 */
    orderPercentStatus:string = '';
    /**货已送达 */
    alreadyReach:number = null;
    /**已发货 */
    alreadyDelivery:number = null;
    /**待发货 */
    pendDelivery:number = null;
    /**已派车 */
    alreadySendcar:number = null;
    /**派车中 */
    sendingCar:number = null;
    /**订单终结 */
    orderEnd:number = null;
    /**未处理*/
    untreated:number = null;
    
    //订单状态构成饼图数据
    orderStatusData = [];
    //历史订单数量折线图数据
    /**累计发布订单数量 */
    orderReleaseTotal:number = null;
    /**订单折线图月份 */
    orderMonth = [];
    /**订单数量数组 */
    orderData = [];

    ready(){
        this.inquiryStatusData = [];
        this.inquiryMonth = [];
        this.inquiryData = [];

        this.orderStatusData = [];
        this.orderMonth = [];
        this.orderData = [];

        /**询价单数据 */
        dataService().Work.getInquiryCount().then((res)=>{
            this.inquiryTotal = res.item1.inquiry;
            this.pendingOrder = res.item1.pendingOrder;
            this.pendingQuotation = res.item1.quote;
            this.successfulQuote = res.item1.successfulQuote;
            this.successfulBidder = res.item1.successfulBidder;
            this.unSuccessfulBidder = res.item1.unsuccessfulBidders;
            this.end = res.item1.end;
            this.inquiryPercent = res.item1.monthDiffer;
            this.inquiryPercentStatus = res.item1.rateTrend;
            res.item2.forEach((itemS) => {
                if(itemS.proportion != 0){
                    this.inquiryStatusData.push({
                        name:itemS.stateName,
                        value:itemS.proportion
                    });
                }
            });
        }).then(()=>{
            this.getInquirypie(this.inquiryStatusData);
            if(this.inquiryPercentStatus == "Up"){
                document.getElementById("inquiryArrow").setAttribute("class","upArrow");//切换为向上绿色箭头
                // document.getElementById("inquiryCompare").setAttribute("class","upColor");
                document.getElementById("inquiryUp").setAttribute("class","is-display");
                document.getElementById("inquiryDown").setAttribute("class","no-display");
            }else{
                document.getElementById("inquiryArrow").setAttribute("class","downArrow");//切换为向下红色箭头
                // document.getElementById("inquiryCompare").setAttribute("class","downColor");
                document.getElementById("inquiryUp").setAttribute("class","no-display");
                document.getElementById("inquiryDown").setAttribute("class","is-display");
            }
        });
        /**询价单图表 */
        dataService().Work.getInquiryStatus().then((res)=>{
            res.inquiryMonthStatistics.forEach((itemM)=>{
                this.inquiryMonth.push(itemM.month);
                this.inquiryData.push(itemM.num);
            });
            this.inquiryReleaseTotal = res.totalCount;
            
        }).then(()=>{
            this.getInquiryLine(this.inquiryMonth,this.inquiryData);
        });

        /**订单数据 */
        dataService().Work.getOrderCount().then((res)=>{
            this.orderTotal = res.item1.order;
            this.alreadyReach = res.item1.tchbd;
            this.alreadyDelivery = res.item1.ship;
            this.pendDelivery = res.item1.wftd;
            this.alreadySendcar = res.item1.hsc;
            this.sendingCar = res.item1.itc;
            this.orderEnd = res.item1.oend;
            this.untreated = res.item1.untreated
            this.orderPercent = res.item1.monthDiffer;
            this.orderPercentStatus = res.item1.rateTrend;
            res.item2.forEach((itemS) => {
                if(itemS.proportion != 0){
                    this.orderStatusData.push({
                        name:itemS.stateName,
                        value:itemS.proportion,
                    });
                }
            });
        }).then(()=>{
            this.getOrderpie(this.orderStatusData);
            if(this.orderPercentStatus == "Up"){
                document.getElementById("orderArrow").setAttribute("class","upArrow");//切换为向上绿色箭头
                // document.getElementById("orderCompare").setAttribute("class","upColor");
                document.getElementById("orderUp").setAttribute("class","is-display");
                document.getElementById("orderDown").setAttribute("class","no-display");
            }else{
                document.getElementById("orderArrow").setAttribute("class","downArrow");//切换为向下红色箭头
                // document.getElementById("orderCompare").setAttribute("class","downColor");
                document.getElementById("orderUp").setAttribute("class","no-display");
                document.getElementById("orderDown").setAttribute("class","is-display");
            }
        });

        /**订单图表 */
        dataService().Work.getOrderStatus().then((res)=>{
            res.item2.forEach((itemM)=>{
                this.orderMonth.push(itemM.time);
                this.orderData.push(itemM.num);
            });
            this.orderReleaseTotal = res.item3;
        }).then(()=>{
            this.getOrderLine(this.orderMonth,this.orderData);
        })
    }

    /**询价单状态构成饼图 */
    getInquirypie = function(inquiryStatusData){
        var inquiryPieChart = echarts.init(document.getElementById('inquiryPie'));
        window.addEventListener("resize", function () {
            inquiryPieChart.resize();
        });
        if(inquiryStatusData.length >0){
            var inquiryPie = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} <br /> {c}%",
                },
                legend: {
                    bottom: 10,
                    x: 'center',
                    data: inquiryStatusData,
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '44%'],
                    data: inquiryStatusData,
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position:'center',
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '18',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false,
                        },
                        
                    },
                }],
                color: ['#49A9EE','#98D87D','#FFD86E','#F3857B','#8996E6','#FF6600'],
            }
            inquiryPieChart.setOption(inquiryPie);
        }else{
            var inquiryPieNodata = {
                tooltip : {},
                series: [{
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: ['40%', '70%'],
                    label: {
                        normal: {
                            position: 'center'
                        },
                    },
                    data: [{
                        value: '100',
                        name: 'nodata',
                        cursor:'default',
                        tooltip: {
                            show: false
                        },
                        hoverAnimation:false,
                        label: {
                            normal: {
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                },
                                formatter: '暂无数据'
                            }
                        },
                    }],
                    color: ['#04D2EB'],
                }]
            };
            inquiryPieChart.setOption(inquiryPieNodata);
        }
    }
    
    /**历史询价单数量折线图 */
    getInquiryLine = function(x, inquiryData){
        var inquiryLineChart = echarts.init(document.getElementById('inquiryLine'));
        window.addEventListener("resize", function () {
            inquiryLineChart.resize();
        });
        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                formatter: '{b0}<br />{a0} :{c0} ',
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick:{show:false},
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#dcdcdc',
                        width:'1'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#666',
 
                    },
                },
                data: x,
            },
            yAxis:{
                name: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#dcdcdc',
                        width:'1'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#666',
                    },
                },
            },
            series: [
                {
                    name:'询价单',
                    type:'line',
                    color: ['#4CAAEE'],
                    data: inquiryData,
                    showAllSymbol: true,
                     showSymbol: false,
                },
            ]
        };
        inquiryLineChart.setOption(option);
    }

    /**订单状态构成饼图 */
    getOrderpie = function(orderStatusData){
        var orderPieChart = echarts.init(document.getElementById('orderPie'));
        window.addEventListener("resize", function () {
            orderPieChart.resize();
        });
        if(orderStatusData.length > 0){
            var orderPie = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} <br /> {c}%",
                },
                legend: {
                    bottom: 10,
                    x: 'center',
                    data: orderStatusData,
                },
                series: [{
                    name: '',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '44%'],
                    data: orderStatusData,
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position:'center',
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '18',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false,
                        }
                    },
                }],
                 color: ['#49A9EE','#98D87D','#FFD86E','#F3857B','#8996E6','#FF6600','#F07DC7'],
            };
            orderPieChart.setOption(orderPie);
        }else{
            var orderPieNodata = {
                tooltip : {},
                series: [{
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: ['40%', '70%'],
                    label: {
                        normal: {
                            position: 'center'
                        },
                    },
                    data: [{
                        value: '100',
                        name: 'nodata',
                        cursor:'default',
                        tooltip: {
                            show: false
                        },
                        hoverAnimation:false,
                        label: {
                            normal: {
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                },
                                formatter: '暂无数据'
                            }
                        },
                    }],
                    color: ['#04D2EB'],
                }]
            };
            orderPieChart.setOption(orderPieNodata);
        }
    }

    /**历史订单数量折线图 */
    getOrderLine = function(x, orderData){
        var orderLineChart = echarts.init(document.getElementById('orderLine'));
        window.addEventListener("resize", function () {
            orderLineChart.resize();
        });
        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                formatter: '{b0}<br />{a0} :{c0} ',
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick:{show:false},
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#dcdcdc',
                        width:'1'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#666',
                    },
                },  
                data: x,
            },
            yAxis: {
                name: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        type: 'solid',
                        color: '#dcdcdc',
                        width:'1'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#666',
                    }
                },
            },
            series: [
                {
                    name:'订单',
                    type:'line',
                    color: ['#4CAAEE'],
                    data: orderData,
                    showAllSymbol: true,
                    showSymbol: false,
                }
            ]
        };
        orderLineChart.setOption(option);
    }
}