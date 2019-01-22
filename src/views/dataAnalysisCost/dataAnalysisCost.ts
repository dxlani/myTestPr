import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'
var echarts = require('echarts')
Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./dataAnalysisCost.html'),
    style: require('./dataAnalysisCost.scss'),
})

export class dataanalysiscostComponent extends Vue{
    el:'#dataAnalysisCost'
    id:string;
    // 物流费用波动
    logisticsCostRangeMonth = [];
    logisticsCostRangeNumber = [];
    //线路成本比例
    lineCostNumber = [];
    //费用类型比例
    costTypeNumber = [];
    //线路价格波动
    linetotalone = [];
    linetotaloneprovinceCity = [];
    totalCostRangeNumber = [];
    //线路吨位波动价格
    lineone = [];
    lineoneprovinceCity = [];
    lineTonnageRangeNumber = [];

    ready(){
        this.id = JSON.parse(window.sessionStorage.getItem("userInfo")).clientId;
        // 物流费用波动
        this.logisticsCostRangeNumber = [];
        this.logisticsCostRangeMonth = [];
        dataService().OrderReceivable.Get12MonthsReceivableTotalPrice(this.id).then((res)=>{
            res.forEach((item,index)=>{
                this.logisticsCostRangeNumber.push(item.receivableTotalPrice);
                this.logisticsCostRangeMonth.push(item.month);
            });
        }).then(()=>{
            this.logisticsCostRange(this.logisticsCostRangeNumber,this.logisticsCostRangeMonth);
        })
        //线路成本比例
        this.lineCostNumber = [];
        dataService().OrderReceivable.GetOrderLineTop10Receivable(this.id).then((res)=>{
            res.forEach((item)=>{
                if(item.provinceCity != "其他"){
                    this.lineCostNumber.push({
                        name: item.provinceCity,
                        value: item.percent,
                    });
                }
            });
        }).then(()=>{
            this.lineCostRata(this.lineCostNumber);
        })
        //费用类型比例
        this.costTypeNumber = [];
        dataService().OrderReceivable.GetOrderReceivableFeeType(this.id).then((res)=>{
            res.forEach((item,index)=>{
                this.costTypeNumber.push({
                    name: item.feeTypeName,
                    value: item.percent,
                })
            });
        }).then(()=>{
            this.contTitleRata(this.costTypeNumber)
        })
        //线路价格波动
        this.linetotalone = [];
        this.linetotaloneprovinceCity = [];
        this.totalCostRangeNumber = [];
        dataService().OrderReceivable.GetOrderReceivableLineTop5Month(this.id).then((res)=>{
            res.forEach((item,index)=>{
                this.totalCostRangeNumber.push(item)
                this.linetotalone.push(item.listOrderReceivableMonth)
                this.linetotaloneprovinceCity.push(item.provinceCity)
            });
        }).then(()=>{
            this.totalCostRangeData(this.linetotalone,this.linetotaloneprovinceCity)
        })
        // 线路吨位价波动
        // this.lineone = [];
        // this.lineoneprovinceCity = []
        // this.lineTonnageRangeNumber = [];
        // dataService().OrderReceivable.GetOrderReceivableLineTop5MonthQuality(this.id).then((res)=>{
        //     res.forEach((item)=>{
        //         this.lineTonnageRangeNumber.push(item)
        //         this.lineone.push(item.listOrderReceivableMonthQuality)
        //         this.lineoneprovinceCity.push(item.provinceCity)
        //     });
        // }).then(()=>{
        //     this.lineTonnageRangeDate(this.lineone,this.lineoneprovinceCity)
        // })
    }

    //物流费用波动
    logisticsCostRange = function(Number,Month){
        var logisticsCostRangess = echarts.init(document.getElementById('logisticsCostRangess'));
        window.addEventListener("resize", function () {
            logisticsCostRangess.resize();
        });
        var option_logisticsCostRange = {
            title: {
                text: '物流费用波动'
            },
            tooltip: {
                trigger: 'axis',
                formatter:function(e){
                    var eVal = e[0].name;
                    for(var i = 0; i <  e.length; i++){
                        eVal += '<br />' + e[i].seriesName + "：" + e[i].value + "元"
                    }
                    return eVal;
                }
            },
            color:['#04D2EB'],
            legend: {
                x: 'right',
                data:[{
                    name:'物流费用波动',
                    icon:'square',
                }],
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisTick:{show:false},
                data:Month ,
            },
            yAxis: [
                {
                name:'单位：元',
                splitLine: {show: false},
                }
            ],
            series: [{
                showAllSymbol: true,
                showSymbol: false,
                name: '物流费用波动',
                type: 'line',
                itemStyle:{
                    normal:{
                        lineStyle:{
                            color: '#04D2EB',
                            width:3
                        }
                    },
                },
                data:Number,
            }],
        };
        logisticsCostRangess.setOption(option_logisticsCostRange,true);
    }

    //线路成本比例
    lineCostRata = function(lineData){
        if(lineData.length == 0){
            var lineCostNodata = echarts.init(document.getElementById('lineCost'));
            window.addEventListener("resize", function () {
                lineCostNodata.resize();
            });
            var option_lineCostNodata = {
                title : {
                    text: '线路成本占比',
                    x:'left',
                    y:'2%'
                },
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
                                    color: '#000000',
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                },
                                formatter: '暂无数据'
                            }
                        },
                        itemStyle: {
                            normal:{
                                color: '#FFFFFF'
                            },
                            emphasis: {
                                color: '#FFFFFF'
                            }
                        },
                    }],
                }]
            };
            lineCostNodata.setOption(option_lineCostNodata);
        }else{
            var lineCost = echarts.init(document.getElementById('lineCost'));
            window.addEventListener("resize", function () {
                lineCost.resize();
            });
            var lineprovinceCity = [];
            lineData.forEach((item) => {
                lineprovinceCity.push(item.name);
            });
            lineprovinceCity = lineprovinceCity.reverse();
            var lineprovincevalue = [];
            lineData.forEach((item) => {
                lineprovincevalue.push(item.value);
            });
            lineprovincevalue = lineprovincevalue.reverse();
            var option_lineCost = {
                title: {
                    text: '线路成本占比'
                },
                tooltip: {
                    show:false
                },
                grid: {
                    left: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    splitLine: {show: false},
                    axisLabel: {show: false},
                    axisTick: {show: false},
                    axisLine: {show: false}
                },
                yAxis: {
                    type: 'category',
                    data: lineprovinceCity,
                    axisLine: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    axisLabel: {
                        margin: 30,
                        textStyle: {
                            fontSize: 14
                        }
                    },
                },
                // legend: {
                //     x: 'right',
                //     orient: 'vertical',
                //     data:lineprovinceCity,
                //     itemWidth:15,
                //     itemHeight:15,
                //     padding:10,
                // },
                series: [
                    {
                        // name:'线路成本占比',
                        type:'bar',
                        barMaxWidth:25,
                        itemStyle: {
                            normal:{
                                color: function (params){
                                    var colorList = ['#EB595A','#50E3C2','#FFEF21','#909DEF','#64C843','#F2AE50','#F17E7D','#6CACF4','#F07DC7','#04D2EB'];
                                    return colorList[params.dataIndex];
                                },
                                label: {
                                    show: true,
                                    position: 'right',
                                    textStyle:{
                                        color:'#000000',
                                        fontSize:'12'
                                    },
                                    formatter:'{c}%'
                                },
                            }
                        },
                        data:lineprovincevalue
                    }
                ],
                // color: ['#04D2EB','#F07DC7','#6CACF4','#F17E7D','#F2AE50','#64C843','#909DEF','#FFEF21','#50E3C2','#EB595A','#5396FF'],
            };
            lineCost.setOption(option_lineCost);
        }
    }
    //费用类型比例
    contTitleRata = function(costTitle){
        if(costTitle.length == 0){
            var costTypeNodata = echarts.init(document.getElementById('costType'));
            window.addEventListener("resize", function () {
                costTypeNodata.resize();
            });
            var option_costTypeNodata = {
                title : {
                    text: '费用类型占比',
                    x:'left',
                    y:'2%'
                },
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
                    color: ['#04D2EB','#F07DC7','#6CACF4','#F17E7D','#F2AE50','#64C843','#909DEF','#FFEF21','#50E3C2','#EB595A','#5396FF'],
                }]
            }
            costTypeNodata.setOption(option_costTypeNodata);
        }else{
            var costType = echarts.init(document.getElementById('costType'));
            window.addEventListener("resize", function () {
                costType.resize();
            });
            var costTitledata = [];
            costTitle.forEach((item) => {
                costTitledata.push(item.name);
            })
            var option_costType = {
                title: {
                    text: '费用类型占比',
                    x:'left',
                    y:'2%',
                    textAlign:'left'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c}%"
                },
                legend: {
                    // x: 'right',
                    // orient: 'vertical',
                    data:costTitledata,
                    // itemWidth:15,
                    // itemHeight:15,
                    bottom: 10,
                    x: 'center',
                    // padding:10,
                },
                series: [
                    {
                        name:'费用类型占比',
                        type:'pie',
                        minAngle:5,
                        center: ['50%', '48%'],
                        radius: ['36%', '66%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:costTitle
                    }
                ],
                color: ['#04D2EB','#F07DC7','#6CACF4','#F17E7D','#F2AE50','#64C843','#909DEF','#FFEF21','#50E3C2','#EB595A','#5396FF']
            }
            costType.setOption(option_costType);
        }
    }
    // 线路价格波动
    totalCostRangeData = function(linecosttotal,linecostprovinceCity){
        var totalCostRange = echarts.init(document.getElementById('totalCostRange'));
        window.addEventListener("resize", function () {
            totalCostRange.resize();
        });
        var linecostmonth = [];
        var lineCostDataAA = [];
        var dataprice = [];
        var datapriceAA = [];
        var datapriceBB = [];
        var datapriceCC = [];
        var datapriceDD = [];
        var datapriceEE = [];
        linecosttotal.forEach((item,index)=> {
            switch(index){
                case 0:linecosttotal[index].forEach((itemC)=>{
                            linecostmonth.push(itemC.month);
                            datapriceAA.push(itemC.price);
                        })
                        break;
                case 1:linecosttotal[index].forEach((itemC)=>{
                            datapriceBB.push(itemC.price);
                        }) 
                        break;
                case 2:linecosttotal[index].forEach((itemC)=>{
                            datapriceCC.push(itemC.price);
                        })
                        break;
                case 3:linecosttotal[index].forEach((itemC)=>{
                            datapriceDD.push(itemC.price);
                        }) 
                        break;
                case 4:linecosttotal[index].forEach((itemC)=>{
                            datapriceEE.push(itemC.price);
                        }) 
                        break;
            }
        });
        var option_totalCostRange ={
            title: {
                text: '线路总费用波动'
            },
            tooltip: {
                trigger: 'axis',
                formatter:function(params)  
                {  
                    var relVal = params[0].name;  
                    for (var i = 0, l = params.length; i < l; i++) {  
                            relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "元";  
                        }  
                    return relVal;  
                }
            },
            legend: {
                x: 'right',
                right: '4%',
                left:'30%',
                icon:'square',
                data:linecostprovinceCity,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: linecostmonth,
            },
            yAxis: [
                {
                name:'单位：元',
                splitLine:{show: false},
                }
            ],
            series: [
                {
                    name:linecostprovinceCity[0],
                    type:'line',
                    data:datapriceAA,
                    showAllSymbol: true,
                    showSymbol: false
                },
                {
                    name:linecostprovinceCity[1],
                    type:'line',
                    data:datapriceBB,
                    showAllSymbol: true,
                    showSymbol: false
                },
                {
                    name:linecostprovinceCity[2],
                    type:'line',
                    data:datapriceCC,
                    showAllSymbol: true,
                    showSymbol: false
                },
                {
                    name:linecostprovinceCity[3],
                    type:'line',
                    data:datapriceDD,
                    showAllSymbol: true,
                    showSymbol: false
                },
                {
                    name:linecostprovinceCity[4],
                    type:'line',
                    data:datapriceEE,
                    showAllSymbol: true,
                    showSymbol: false
                }
            ],
            color: ['#04D2EB','#F07DC7','#6CACF4','#F17E7D','#F2AE50','#64C843','#909DEF','#FFEF21','#50E3C2','#EB595A','#5396FF']
        }
        totalCostRange.setOption(option_totalCostRange);
    }
    //线路价吨位波动
    // lineTonnageRangeDate = function(lineTonnageData,linecityAA){
    //         var lineTonnageRange = echarts.init(document.getElementById('lineTonnageRange'));
    //         window.addEventListener("resize", function () {
    //             lineTonnageRange.resize();
    //         });
    //         var linemonth = [];
    //         var dataqualityAA = [];
    //         var dataqualityBB = [];
    //         var dataqualityCC = [];
    //         var dataqualityDD = [];
    //         var dataqualityEE = [];
    //         lineTonnageData.forEach((item,index)=> {
    //             switch(index){
    //                 case 0:lineTonnageData[index].forEach((itemC)=>{
    //                             linemonth.push(itemC.month);
    //                             dataqualityAA.push(itemC.percent);
    //                         }) 
    //                         break;
    //                 case 1:lineTonnageData[index].forEach((itemC)=>{
    //                             dataqualityBB.push(itemC.percent);
    //                         }) 
    //                         break;
    //                 case 2:lineTonnageData[index].forEach((itemC)=>{
    //                             dataqualityCC.push(itemC.percent);
    //                         }) 
    //                         break;
    //                 case 3:lineTonnageData[index].forEach((itemC)=>{
    //                             dataqualityDD.push(itemC.percent);
    //                         }) 
    //                         break;
    //                 case 4:lineTonnageData[index].forEach((itemC)=>{
    //                             dataqualityEE.push(itemC.percent);
    //                         }) 
    //                         break;

    //             }
    //         });
            
    //         var option_lineTonnageRange = {
    //             title: {
    //                 text: '线路吨位价波动'
    //             },
    //             tooltip: {
    //                 trigger: 'axis',
    //                 formatter:function(params)  
    //                 {  
    //                     var relVal = params[0].name;  
    //                     for (var i = 0, l = params.length; i < l; i++) {  
    //                             relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + " 元/吨";  
    //                         }  
    //                     return relVal;  
    //                 }
    //             },
    //             legend: {
    //                 x: 'right',
    //                 data:linecityAA
    //             },
    //             grid: {
    //                 left: '3%',
    //                 right: '4%',
    //                 bottom: '3%',
    //                 containLabel: true
    //             },
    //             xAxis: {
    //                 type: 'category',
    //                 data: linemonth
    //             },
    //             yAxis: [
    //                 {
    //                     name:'单位：元/吨',
    //                     splitLine: {show: false},
    //                 }
    //             ],
    //             series: [
    //                 {
    //                     name:linecityAA[0],
    //                     type:'line',
    //                     data:dataqualityAA
    //                 },
    //                 {
    //                     name:linecityAA[1],
    //                     type:'line',
    //                     data:dataqualityBB
    //                 },
    //                 {
    //                     name:linecityAA[2],
    //                     type:'line',
    //                     data:dataqualityCC
    //                 },
    //                 {
    //                     name:linecityAA[3],
    //                     type:'line',
    //                     data:dataqualityDD
    //                 },
    //                 {
    //                     name:linecityAA[4],
    //                     type:'line',
    //                     data:dataqualityEE
    //                 }
    //             ],
    //             color: ['#04D2EB','#F07DC7','#6CACF4','#F17E7D','#F2AE50','#64C843','#909DEF','#FFEF21','#50E3C2','#EB595A','#5396FF']
    //         }
    //         lineTonnageRange.setOption(option_lineTonnageRange);
    // }

}