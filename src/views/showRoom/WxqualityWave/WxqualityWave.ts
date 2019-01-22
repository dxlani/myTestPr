import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../../service/dataService';
import {routeService} from '../../../service/routeService';
import * as VueRouter from 'vue-router';

var echarts = require('echarts')

@VueComponent({
    template: require('./WxqualityWave.html'),
    style: require('./WxqualityWave.scss')
})
export class ShowWxqualityWaveComponent extends Vue {
    el:'#cspWxqualityWave'

    @Prop

    ClientId:string;
    //时间
    monthXdata = [];
    //到达
    arrivalNum = [];
    //出发
    deliveryNum = [];
    totaldata=[];
    monthXdata1 = [];
    //到达
    arrivalNum1 = [];
    //出发
    deliveryNum1 = [];
    totaldata1=[];

    ready(){
        /**添加滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style", "height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.ClientId = JSON.parse(window.sessionStorage.getItem("userInfo")).clientId;
        this.monthXdata = [];
        this.arrivalNum = [];
        this.deliveryNum = [];
        this.totaldata=[];
        this.monthXdata1 = [];
        this.arrivalNum1 = [];
        this.deliveryNum1 = [];
        this.totaldata1=[];
        if(window.sessionStorage.getItem("userName") == "麦当劳" || window.sessionStorage.getItem("userName") == "肯德基"){
            dataService().QualityAnalysis.getRateMDL().then((res)=>{
                var reachNum = [];
                var trafficNum = [];
                trafficNum = res.qualityDeliveryList;
                trafficNum.forEach((itemD)=>{
                    this.monthXdata.push(itemD.time);
                    this.deliveryNum.push(itemD.rate);
                })                    
                reachNum = res.qualityArrivalList;
                reachNum.forEach((itemA) => {
                    this.arrivalNum.push(itemA.rate);     
                })
            }).then(()=>{
                this.getRate(this.monthXdata,this.deliveryNum,this.arrivalNum);
            });
            dataService().QualityAnalysis.getResponseRateMDL().then((res)=>{
                var reachNum = [];
                var trafficNum = [];
                trafficNum = res.presentOnTimeList;
                trafficNum.forEach((itemD)=>{
                    this.monthXdata1.push(itemD.time);
                    this.deliveryNum1.push(itemD.rate);
                })                    
                reachNum = res.sendCarOnTimeList;
                reachNum.forEach((itemA) => {
                    this.arrivalNum1.push(itemA.rate);     
                })
            }).then(()=>{
               this.getResponseRate(this.monthXdata1,this.deliveryNum1,this.arrivalNum1);
            });
        }else{
            dataService().QualityAnalysis.getRate(this.ClientId).then((res)=>{
                var reachNum = [];
                var trafficNum = [];
                trafficNum = res.qualityDeliveryList;
                trafficNum.forEach((itemD)=>{
                    this.monthXdata.push(itemD.time);
                    this.deliveryNum.push(itemD.rate);
                })                    
                reachNum = res.qualityArrivalList;
                reachNum.forEach((itemA) => {
                    this.arrivalNum.push(itemA.rate);     
                })
            }).then(()=>{
                this.getRate(this.monthXdata,this.deliveryNum,this.arrivalNum);
            });
            dataService().QualityAnalysis.getResponseRate(this.ClientId).then((res)=>{
                var reachNum = [];
                var trafficNum = [];
                trafficNum = res.presentOnTimeList;
                trafficNum.forEach((itemD)=>{
                    this.monthXdata1.push(itemD.time);
                    this.deliveryNum1.push(itemD.rate);
                })                    
                reachNum = res.sendCarOnTimeList;
                reachNum.forEach((itemA) => {
                    this.arrivalNum1.push(itemA.rate);     
                })
            }).then(()=>{
               this.getResponseRate(this.monthXdata1,this.deliveryNum1,this.arrivalNum1);
            });
        }
       
    }

    getRate = function(x, deliveryData, arrivalData){
        var echarts = require('echarts')
        var myChart =echarts.init(document.getElementById('Wxqualitywave'));
        //图表自适应屏幕大小
        window.addEventListener("resize",function(){
            myChart.resize();
        });
        myChart.on('globalout', function (params) {
            $('.analysistable').find("tr").removeClass("list_c");
        });
        for(var i=0;i<12;i++){
            this.totaldata.push({
                month: x[i],
                a:deliveryData[i]+"%",
                b:arrivalData[i]+"%",
            })
           } 
           this.totaldata=this.totaldata.reverse();
        // 指定图表的配置项和数据
        var option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor : '#0A275A',
                formatter:function(e){
                    $('.analysistable').find("tr").removeClass("list_c");
                    var index = e[0].dataIndex;
                    $('#wave' + index).addClass("list_c");

                    var eVal = e[0].name;
                    for(var i = 0; i <  e.length; i++){
                        eVal += '<br />' + e[i].seriesName + ":" + e[i].value + "%"
                    }
                    return eVal;
                }
            },
            color:['#FF2A3A','#FFBB2E'],
            legend: {
                itemWidth: 15,
                itemHeight: 15,
                itemGap: 5,       
                x: 'center',
                bottom: 15,
                padding: 3,
                icon:'square',
                textStyle: {
                    fontSize: 12,
                    color:'#fff'
                },
                data:[
                {
                    name:'准时发出率',
                    icon:'square',
                },
                {
                    name:'准时到达率',
                    icon:'square',
                }
            ]
            },
            grid: {
                y:20,
                left: '8%',
                right: '2%',
                bottom: '30%',
                containLabel: true,
                show:'true',
                borderWidth:'0'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:x,
                axisTick:{
                    show:false
                },
                axisLabel:{  
                    interval:0,
                    rotate:45,
                    textStyle: {
                        color: '#999'
                    }
                },
                
            },
            yAxis: {
                splitLine:{show: false},
                axisLabel:{
                    textStyle: {
                        color: '#999'
                    }
                },
            },
            series: [
                {
                    name:'准时发出率',
                    showAllSymbol: true,
                    showSymbol: false,
                    type:'line',
                    stack: '百分比1',
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                color:'#FF2A3A',
                                width:1
                            },
                        }
                    },
                    data:deliveryData
                },
                {
                    name:'准时到达率',
                    showAllSymbol: true,
                    showSymbol: false,
                    type:'line',
                    stack: '百分比2',
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                color:'#FFBB2E',
                                width:1
                            },
                        }
                    },
                    data:arrivalData
                }
            ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        } 
    getResponseRate = function(x, deliveryData, arrivalData){
    var echarts = require('echarts')
    var myChart =echarts.init(document.getElementById('Wxqualitywave1'));
    //图表自适应屏幕大小
    window.addEventListener("resize",function(){
        myChart.resize();
    });
    myChart.on('globalout', function (params) {
        $('.analysistable1').find("tr").removeClass("list_c");
    });
    for(var i=0;i<12;i++){
        this.totaldata1.push({
            month: x[i],
            a:deliveryData[i]+"%",
            b:arrivalData[i]+"%",
        })
        } 
        this.totaldata1=this.totaldata1.reverse();
    // 指定图表的配置项和数据
    var option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor : '#0A275A',
            formatter:function(e){
                $('.analysistable1').find("tr").removeClass("list_c");
                var index = e[0].dataIndex;
                $('#rate' + index).addClass("list_c");

                var eVal = e[0].name;
                for(var i = 0; i <  e.length; i++){
                    eVal += '<br />' + e[i].seriesName + ":" + e[i].value + "%"
                }
                return eVal;
            }
        },
        color:['#FF2A3A','#FFBB2E'],
        legend: {
            itemWidth: 15,
            itemHeight: 15,
            itemGap: 5,       
            x: 'center',
            bottom: 15,
            padding: 3,
            icon:'square',
            textStyle: {
                fontSize: 12,
                color:'#fff'
            },
            data:[
            {
                name:'准时派车率',
                icon:'square',
            },
            {
                name:'准时到场率',
                icon:'square',
            }
        ]
        },
        grid: {
            y:20,
            left: '8%',
            right: '2%',
            bottom: '30%',
            containLabel: true,
            show:'true',
            borderWidth:'0'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data:x,
            axisTick:{
                show:false
            },
            axisLabel:{  
                interval:0,
                rotate:45,
                textStyle: {
                    color: '#999'
                }
            },
            
        },
        yAxis: {
            splitLine:{show: false},
            axisLabel:{
                textStyle: {
                    color: '#999'
                }
            },
        },
        series: [
            {
                name:'准时派车率',
                showAllSymbol: true,
                showSymbol: false,
                type:'line',
                stack: '百分比1',
                itemStyle:{
                    normal:{
                        lineStyle:{
                            color:'#FF2A3A',
                            width:1
                        },
                    }
                },
                data:deliveryData
            },
            {
                name:'准时到场率',
                showAllSymbol: true,
                showSymbol: false,
                type:'line',
                stack: '百分比2',
                itemStyle:{
                    normal:{
                        lineStyle:{
                            color:'#FFBB2E',
                            width:1
                        },
                    }
                },
                data:arrivalData
            }
        ],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    } 

    }

