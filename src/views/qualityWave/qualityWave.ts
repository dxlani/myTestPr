import { VueComponent, Prop } from 'vue-typescript'
import { AboutComponent } from '../../views/about/about';
import {dataService} from '../../service/dataService';
import {routeService} from '../../service/routeService';
import * as VueRouter from 'vue-router';

var echarts = require('echarts')

@VueComponent({
    template: require('./qualityWave.html'),
    style: require('./qualityWave.scss')
})
export class qualitywaveComponent extends Vue {
    el:'#qualitywave'

    @Prop

    ClientId:string;
    //时间
    monthXdata = [];
    //到达
    arrivalNum = [];
    //出发
    deliveryNum = [];
    /**
     * 响应时效时间
     */
    responseTime = [];
    /**
     * 准时派车率
     */
    sendCar = [];
    /**
     * 准时到场率
     */
    presentOn = [];

    ready(){
        this.ClientId = JSON.parse(window.sessionStorage.getItem("userInfo")).clientId;
        this.monthXdata = [];
        this.arrivalNum = [];
        this.deliveryNum = [];
        this.responseTime = [];
        this.sendCar = [];
        this.presentOn = [];
        dataService().QualityAnalysis.getRate(this.ClientId).then((res)=>{
            var reachNum = [];
            var trafficNum = [];
            trafficNum = res.qualityDeliveryList;
            trafficNum.forEach((itemD)=>{
                this.monthXdata.push(itemD.time);
                this.deliveryNum.push({
                    valueR:itemD.rate,
                    valueN:itemD.num
                });
            })                    
            reachNum = res.qualityArrivalList;
            reachNum.forEach((itemA) => {
                this.arrivalNum.push({
                    valueR:itemA.rate,
                    valueN:itemA.num
                });  
            })
        }).then(()=>{
            this.getRate(this.monthXdata,this.deliveryNum,this.arrivalNum);
        });
        dataService().QualityAnalysis.getResponseRate(this.ClientId).then((res)=>{
            var sendCarNum = [];
            var presentOnNum = [];
            sendCarNum = res.sendCarOnTimeList;
            sendCarNum.forEach((itemS)=>{
                this.responseTime.push(itemS.time);
                this.sendCar.push({
                    valueR:itemS.rate,
                    valueN:itemS.num
                });
            })
            presentOnNum = res.presentOnTimeList;
            presentOnNum.forEach((itemP) => {
                this.presentOn.push({
                    valueR:itemP.rate,
                    valueN:itemP.num
                });     
            })
        }).then(()=>{
            this.getresponseAgingRate(this.responseTime,this.sendCar,this.presentOn);
        });
    }

    /**
     * 准时发出率数据处理
     */
    dealDeliveryData(deliveryData){
        var deliveryD = []
        deliveryData.forEach((itemD)=>{
            deliveryD.push(itemD.valueR)
        });
        return deliveryD;
    }
    /**
     * 准时出发率数据处理
     */
    dealArrivalData(arrivalData){
        var arrivalD = []
        arrivalData.forEach((itemA)=>{
            arrivalD.push(itemA.valueR)
        });
        return arrivalD;
    }
    /**
     * 运输时效分析
     */
    getRate = function(x, deliveryData, arrivalData){
        var echarts = require('echarts')
        var myChart =echarts.init(document.getElementById('qualitywave'));
        //图表自适应屏幕大小
        window.addEventListener("resize",function(){
            myChart.resize();
        });
        // 指定图表的配置项和数据
        var option = {
            backgroundColor: 'white',
            title: {
                text:'运输时效分析',
                left:'3%'
            },
            tooltip: {
                trigger: 'axis',
                formatter:function(e){
                    var eVal = e[0].name;
                    for(var i = 0; i <  e.length; i++){
                        if(e[i].seriesName == "准时发出率"){
                            eVal += '<br />' + e[i].seriesName + "：" + deliveryData[e[i].dataIndex].valueR + "%，" + "运单量：" + deliveryData[e[i].dataIndex].valueN + "笔";
                        }else if(e[i].seriesName == "准时到达率"){
                            eVal += '<br />' + e[i].seriesName + "：" + arrivalData[e[i].dataIndex].valueR + "%，" + "运单量：" + arrivalData[e[i].dataIndex].valueN + "笔";
                        }
                    }
                    return eVal;
                }
            },
            color:['#7ccd7c','#ee3b3b'],
            legend: {
                right:'5%',
                top:'3%',
                data:[
                {
                    name:'准时发出率',
                    icon:'square',
                },
                {
                    name:'准时到达率',
                    icon:'square',
                },
            ]
            },
            grid: {
                left: '6%',
                right: '7%',
                bottom: '6%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:x,
                axisTick:{
                    show:false
                },
                axisLabel:{
                    margin:15,
                    color:'#000000'
                },
                axisLine:{
                    lineStyle:{
                        color:'#000000'
                    }
                }
            },
            yAxis: {
                name:'单位：%',
                boundaryGap: true,
                type: 'value',
                max: '100',
                min:'0',
                splitNumber:'11',
                minInterval:1,
                axisTick:{
                    show:false
                },
                axisLabel:{
                    margin:10,
                    color:'#000000'
                },
                axisLine:{
                    lineStyle:{
                        color:'#000000'
                    }
                }
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
                                color:'#7ccd7c'
                            },
                        }
                    },
                    data:this.dealArrivalData(deliveryData)
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
                                color:'#ee3b3b'
                            },
                        }
                    },
                    data:this.dealArrivalData(arrivalData)    
                }
            ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    /**
     * 准时派车率数据处理
     */
    dealSendCar(sendCar){
        var sendCarD = []
        sendCar.forEach((itemD)=>{
            sendCarD.push(itemD.valueR)
        });
        return sendCarD;
    }
    /**
     * 准时到场率数据处理
     */
    dealPresentOn(presentOn){
        var presentOnD = []
        presentOn.forEach((itemA)=>{
            presentOnD.push(itemA.valueR)
        });
        return presentOnD;
    }
    /**
     * 响应时效分析
     */
    getresponseAgingRate = function(x, sendCar, presentOn){
        var echarts = require('echarts')
        var myChart =echarts.init(document.getElementById('responseAging'));
        window.addEventListener("resize",function(){
            myChart.resize();
        });
        var option = {
            backgroundColor: 'white',
            title: {
                text:'响应时效分析',
                left:'3%'
            },
            tooltip: {
                trigger: 'axis',
                formatter:function(e){
                    var eVal = e[0].name;
                    for(var i = 0; i <  e.length; i++){
                        if(e[i].seriesName == "准时派车率"){
                            eVal += '<br />' + e[i].seriesName + "：" + sendCar[e[i].dataIndex].valueR + "%，" + "运单量：" + sendCar[e[i].dataIndex].valueN + "笔";
                        }else if(e[i].seriesName == "准时到场率"){
                            eVal += '<br />' + e[i].seriesName + "：" + presentOn[e[i].dataIndex].valueR + "%，" + "运单量：" + presentOn[e[i].dataIndex].valueN + "笔";
                        }
                    }
                    return eVal;
                }
            },
            color:['#F2AE50','#5396FF'],
            legend: {
                right:'5%',
                top:'3%',
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
                left: '6%',
                right: '7%',
                bottom: '6%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:x,
                axisTick:{
                    show:false
                },
                axisLabel:{
                    margin:15,
                    color:'#000000'
                },
                axisLine:{
                    lineStyle:{
                        color:'#000000'
                    }
                }
            },
            yAxis: {
                name:'单位：%',
                boundaryGap: true,
                type: 'value',
                max: '100',
                min:'0',
                splitNumber:'11',
                minInterval:1,
                axisTick:{
                    show:false
                },
                axisLabel:{
                    margin:10,
                    color:'#000000'
                },
                axisLine:{
                    lineStyle:{
                        color:'#000000'
                    }
                }
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
                                color:'#F2AE50'
                            },
                        }
                    },
                    data:this.dealSendCar(sendCar)
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
                                color:'#5396FF'
                            },
                        }
                    },
                    data:this.dealPresentOn(presentOn)
                }
            ],
        };
        myChart.setOption(option);
    }

}

