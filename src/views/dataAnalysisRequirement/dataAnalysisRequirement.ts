import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import { open, read } from 'fs';

var echarts = require('echarts');

@VueComponent({
    template: require('./dataAnalysisRequirement.html'),
    style: require('./dataAnalysisRequirement.scss')
})

export class DataAnalysisRequirement extends Vue{
    el:'#dataAnalysisRequirement'

    @Prop
    /**
     * 客户id
     */
    clientId:string;
    /**
     * 月度波动图数据(后台获取)
     */
    monthData = [];
    /**
     * 月度波动图x轴
     */
    monthXdata = [];
    /**
     * 物流订单量
     */
    orderNum = [];
    /**
     * 车辆数
     */
    carNum = [];
    /**
     * 吨位数
     */
    tongeNum = [];
    /**
     * 线路订单量(后台获取)
     */
    lineOrderNum = [];
    /**
     * 始发省份
     */
    starProvinceNum = [];
    /**
     * 送达省份
     */
    endProviceNum = [];
    /**
     * 常用车辆
     */
    commonCarNum =[];
    /**
     * 年份
     */
    currentYear:string="";

    ready(){
        this.clientId = JSON.parse(window.sessionStorage.getItem("userInfo")).clientId;
        this.monthXdata = [];
        this.orderNum = [];
        this.carNum = [];
        this.tongeNum = [];
        this.lineOrderNum = [];
        this.starProvinceNum = [];
        this.endProviceNum = [];
        this.commonCarNum = [];
        this.currentYear = new Date().getFullYear().toString();
        /**
         * 月度波动图
         */
        dataService().dataAnalysis.getMonthlyFluctuationChart(this.clientId).then((res)=>{
            var orderNum = [];
            var vehicleNum = [];
            var transportTonnageNum = [];
            res.forEach((item)=>{
                if(item.type == "OrderFluctuation"){
                    orderNum = item.monthlyFluctuationData;
                    orderNum.forEach((itemO)=>{
                        this.monthXdata.push(itemO.time);
                        this.orderNum.push(itemO.num);
                    })
                }if(item.type == "VehicleNumFluctuate"){
                    vehicleNum = item.monthlyFluctuationData;
                    vehicleNum.forEach((itemV)=>{
                        this.carNum.push(itemV.num);
                    })
                }else if(item.type == "TransportTonnageFluctuate"){
                    transportTonnageNum = item.monthlyFluctuationData;
                    transportTonnageNum.forEach((itemT)=>{
                        this.tongeNum.push(itemT.num);
                    })
                }
            });
        }).then(()=>{
            this.getMonthWavePattern(this.monthXdata, this.orderNum, this.carNum, this.tongeNum);
        });
        /**
         * 线路订单量占比
         */
        dataService().dataAnalysis.getLineOrderResult(this.clientId).then((res)=>{
            if(res == []){
                this.lineOrderNum = []
            }else{
                res.forEach((item)=>{
                    this.lineOrderNum.push({
                        name:item.provinceCity,
                        value:item.num
                    })
                })
            }
        }).then(()=>{
            this.getLineOrder(this.lineOrderNum);
        })
        /**
         * 始发省份占比
         */
        dataService().dataAnalysis.getOriginProvinceResult(this.clientId).then((res)=>{
            if(res.length == 0){
                this.starProvinceNum = [];
            }else{
                res.forEach((item)=>{
                    this.starProvinceNum.push({
                        name:item.originProvinces,
                        value:item.num,
                        value1: item.orderNum
                    });
                });
            }
        }).then(()=>{
            this.getStartProvince(this.starProvinceNum);
        });
        /**
         * 送达省份占比
         */
        dataService().dataAnalysis.getDestinationProvinceResult(this.clientId).then((res)=>{
            if(res == []){
                this.endProviceNum = [];
            }else{
                res.forEach((item)=>{
                    this.endProviceNum.push({
                        name:item.destinationProvince,
                        value:item.num,
                        value1:item.orderNum
                    });
                });
            }
        }).then(()=>{
            this.getEndProvince(this.endProviceNum);
        });
        /**
         * 常用车辆占比
         */
        dataService().dataAnalysis.getVehicleTypeResult(this.clientId).then((res)=>{
            if(res == []){
                this.commonCarNum = [];
            }else{
                res.forEach((item)=>{
                    this.commonCarNum.push({
                        name:item.vehicleType,
                        value:item.num,
                        value1:item.orderNum
                    });
                });
            }
        }).then(()=>{
            this.getCommonCar(this.commonCarNum);
        })
    }

    /**
     * 月度波动图
     */
    getMonthWavePattern = function(x, orderData, carData, tongeData){
        var monthChart = echarts.init(document.getElementById('monthWavePattern'));
        window.addEventListener("resize", function () {
            monthChart.resize();
        });
        var option = {
            title: {
                text: '交易统计概览'
            },
            tooltip: {
                trigger: 'axis',
                formatter:function(params)  
                {  
                    var relVal = params[0].name;  
                    for (var i = 0, l = params.length; i < l; i++) {  
                        if(params[i].seriesName == "物流订单量") {
                            relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "笔";
                        }if(params[i].seriesName == "所用车辆数"){
                            relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "辆";  
                        }else if(params[i].seriesName == "运输吨位数"){
                            relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + "吨";
                        }
                    }  
                    return relVal;  
                }
            },
            legend: {
                x:'right',
                icon:'rect',
                itemWidth: 15,
                itemHeight: 15,
                data:['物流订单量','所用车辆数','运输吨位数']
            },
            xAxis: {
                type: 'category',
                data: x,
                axisTick:{show:false},  
            },
            yAxis: [
                {
                    name: '物流订单量（单位：笔）,所用车辆数（单位：辆）',
                    nameTextStyle:{
                        padding: [0, 0, 0, 130],
                    },
                    splitLine: {
                        show: false
                    },
                },
                {
                    name: '运输吨位数（单位：吨）',
                    splitLine: {
                        show: false
                    },
                }
            ],
            series: [
                {
                    name:'物流订单量',
                    type:'line',
                    color: ['#EB595A'],
                    data: orderData,
                    showAllSymbol: true,
                    showSymbol: false,
                },
                {
                    name:'所用车辆数',
                    type:'line',
                    color: ['#5396FF'],
                    data: carData,
                    showAllSymbol: true,
                    showSymbol: false,
                },
                {
                    name:'运输吨位数',
                    type:'line',
                    color: ['#31C27C'],
                    data: tongeData,
                    yAxisIndex:1,
                    showAllSymbol: true,
                    showSymbol: false,
                }
            ]
        };
        monthChart.setOption(option);
    }

    /**
     * 线路订单排名
     */
    getLineOrder = function(lineData){
        if(lineData.length == 0){
            var lineOrderChart = echarts.init(document.getElementById('lineOrderChart'));
            window.addEventListener("resize", function () {
                lineOrderChart.resize();
            });
            var option = {
                title: {
                    text: `{a|线路订单排名}  {b|${this.currentYear}}`,
                    x:'left',
                    y:'1%',
                    textStyle:{
                        rich:{
                            a:{
                                fontSize:18,
                                fontWeight:800
                            },
                            b:{
                                backgroundColor:'#FFCC66',
                                width:40,
                                height:18,
                                color:'#fff',
                                align:'center'
                            }
                        }
                    },
                },
                tooltip: {},
                grid: {
                    left: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '50%'],
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
                                    fontSize:'16',
                                    bold:'bold'
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
            lineOrderChart.setOption(option);
        }else{
            var lineOrderChart = echarts.init(document.getElementById('lineOrderChart'));
            window.addEventListener("resize", function () {
                lineOrderChart.resize();
            });
            var lineName = [];
            lineData.forEach((item) => {
                lineName.push(item.name);
            });
            lineName = lineName.reverse();
            var lineNum = [];
            lineData.forEach((item) => {
                lineNum.push(item.value);
            });
            lineNum = lineNum.reverse();

            var optionT = {
                title: {
                    text: `{a|线路订单排名}  {b|${this.currentYear}}`,
                    x:'left',
                    y:'1%',
                    textStyle:{
                        rich:{
                            a:{
                                fontSize:18,
                                fontWeight:800
                            },
                            b:{
                                backgroundColor:'#FFCC66',
                                width:40,
                                height:18,
                                color:'#fff',
                                align:'center'
                            }
                        }
                    },
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
                    data: lineName,
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
                series: [
                    {
                        type: 'bar',
                        data: lineNum,
                        barMaxWidth:25,
                        itemStyle: {
                            normal:{
                                color: function (params){
                                    var colorList = ['#5396FF','#EB595A','#50E3C2','#FFEF21','#909DEF','#64C843','#F2AE50','#F17E7D','#6CACF4','#F07DC7','#04D2EB'];
                                    return colorList[params.dataIndex];
                                },
                                label: {
                                    show: true,
                                    position: 'right',
                                    textStyle:{
                                        color:'#000000',
                                        fontSize:'12'
                                    }
                                },
                            }
                        },
                    }
                ],
            }
            lineOrderChart.setOption(optionT);

        }
        
    }

    /**
     * 始发省份占比
     */
    getStartProvince = function(startProvinceData){
        if(startProvinceData.length == 0){
            var startProvinceChart = echarts.init(document.getElementById('startProvinceChart'));
            window.addEventListener("resize", function () {
                startProvinceChart.resize();
            });
            var option = {
                title: {
                    text: `{a|始发省份占比}  {b|${this.currentYear}}`,
                    x:'left',
                    y:'1%',
                    textStyle:{
                        rich:{
                            a:{
                                fontSize:18,
                                fontWeight:800
                            },
                            b:{
                                backgroundColor:'#FFCC66',
                                width:40,
                                height:18,
                                color:'#fff',
                                align:'center'
                            }
                        }
                    },
                },
                tooltip : {},
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '50%'],
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
                                    fontSize:'18',
                                    bold:'bold'
                                },
                                formatter: '暂无数据'
                            }
                        },
                        itemStyle: {
                            normal:{
                                color: '#87CEFA'
                            },
                            emphasis: {
                                color: '#87CEFA'
                            }
                        },
                    }],
                }]
            };
            startProvinceChart.setOption(option);
        }else{
            var startProvinceChart = echarts.init(document.getElementById('startProvinceChart'));
            window.addEventListener("resize", function () {
                startProvinceChart.resize();
            });
            var startProvince = [];
            startProvinceData.forEach((item) =>{
                startProvince.push(item.name);
            });
            var optionT = {
                title: {
                    text: `{a|始发省份占比}  {b|${this.currentYear}}`,
                    x:'left',
                    y:'1%',
                    textStyle:{
                        rich:{
                            a:{
                                fontSize:18,
                                fontWeight:800
                            },
                            b:{
                                backgroundColor:'#FFCC66',
                                width:40,
                                height:18,
                                color:'#fff',
                                align:'center'
                            }
                        }
                    },
                },
                tooltip : {
                    trigger: 'item',
                    formatter:function(e){
                        var eVal = e.name;
                        eVal += "：" + e.data.value + "%" + '<br />' + "订单量：" + e.data.value1 + "笔";
                        return eVal;
                    }
                },
                legend: {
                    bottom: 5,
                    x: 'center',
                    data: startProvince
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['36%', '66%'],
                        center: ['50%', '45%'],
                        minAngle:3,
                        itemStyle: {
                            normal:{
                                color: function (params){
                                    var colorList = ['#5396FF','#EB595A','#50E3C2','#FFEF21','#909DEF','#64C843','#F2AE50','#F17E7D','#6CACF4','#F07DC7','#04D2EB'];
                                    return colorList[params.dataIndex];
                                }
                            }
                        },
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
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
                                show: false
                            }
                        },
                        data: startProvinceData,
                    }
                ]
            };
            startProvinceChart.setOption(optionT);
        }
        
    }

    /**
     * 送达省份占比
     */
    getEndProvince = function(endProviceData){
        if(endProviceData.length == 0){
            var endProvinceChart = echarts.init(document.getElementById('endProvinceChart'));
            window.addEventListener("resize", function () {
                endProvinceChart.resize();
            });
            var option = {
                title: {
                    text: `{a|送达省份占比}  {b|${this.currentYear}}`,
                    x:'left',
                    y:'1%',
                    textStyle:{
                        rich:{
                            a:{
                                fontSize:18,
                                fontWeight:800
                            },
                            b:{
                                backgroundColor:'#FFCC66',
                                width:40,
                                height:18,
                                color:'#fff',
                                align:'center'
                            }
                        }
                    },
                },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '50%'],
                    label: {
                        normal: {
                            position: 'center'
                        }
                    },
                    data: [{
                        value: '100',
                        cursor:'default',
                        name: 'nodata',
                        tooltip: {
                            show: false
                        },
                        hoverAnimation:false,
                        label: {
                            normal: {
                                textStyle: {
                                    color: '#000000',
                                    fontSize:'18',
                                    bold:'bold'
                                },
                                formatter: '暂无数据'
                            }
                        },
                        itemStyle: {
                            normal:{
                                color: '#F2AE50'
                            },
                            emphasis: {
                                color: '#F2AE50'
                            }
                        },
                    }],
                }]
            };
            endProvinceChart.setOption(option);
        }else{
            var endProvinceChart = echarts.init(document.getElementById('endProvinceChart'));
            window.addEventListener("resize", function () {
                endProvinceChart.resize();
            });
            var endProvince = [];
            endProviceData.forEach((item) =>{
                endProvince.push(item.name);
            });
            var optionT = {
                title: {
                    text: `{a|送达省份占比}  {b|${this.currentYear}}`,
                    x:'left',
                    y:'1%',
                    textStyle:{
                        rich:{
                            a:{
                                fontSize:18,
                                fontWeight:800
                            },
                            b:{
                                backgroundColor:'#FFCC66',
                                width:40,
                                height:18,
                                color:'#fff',
                                align:'center'
                            }
                        }
                    },
                },
                tooltip : {
                    trigger: 'item',
                    formatter:function(e){
                        var eVal = e.name;
                        eVal += "：" + e.data.value + "%" + '<br />' + "订单量：" + e.data.value1 + "笔";
                        return eVal;
                    }
                },
                legend: {
                    bottom: 5,
                    x: 'center',
                    data: endProvince,
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['36%', '66%'],
                        center: ['50%', '45%'],
                        minAngle:3,
                        avoidLabelOverlap: false,
                        itemStyle: {
                            normal:{
                                color: function (params){
                                    var colorList = ['#F2AE50','#F17E7D','#6CACF4','#F07DC7','#04D2EB','#5396FF','#EB595A','#50E3C2','#FFEF21','#909DEF','#64C843'];
                                    return colorList[params.dataIndex];
                                }
                            }
                        },
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
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
                                show: false
                            }
                        },
                        data: endProviceData,
                    }
                ]
            };
            endProvinceChart.setOption(optionT);
        }
        
    }

    /**
     * 常用车辆占比
     */
    getCommonCar = function(commonCarData){
        if(commonCarData.length == 0){
            var commonCarChart = echarts.init(document.getElementById('commonCarChart'));
            window.addEventListener("resize", function () {
                commonCarChart.resize();
            });
            commonCarChart.setOption({
                title: {
                    text: `{a|常用车辆占比}  {b|${this.currentYear}}`,
                    x:'left',
                    y:'1%',
                    textStyle:{
                        rich:{
                            a:{
                                fontSize:18,
                                fontWeight:800
                            },
                            b:{
                                backgroundColor:'#FFCC66',
                                width:40,
                                height:18,
                                color:'#fff',
                                align:'center'
                            }
                        }
                    },
                },
                series: [{
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '50%'],
                        label: {
                            normal: {
                                position: 'center'
                            }
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
                                        fontSize:'18',
                                        bold:'bold'
                                    },
                                    formatter: '暂无数据'
                                }
                            },
                            itemStyle: {
                                normal:{
                                    color: '#F07DC7'
                                },
                                emphasis: {
                                    color: '#F07DC7'
                                }
                            },
                        }],
                    }
                ]         
            });
        }else{
            var commonCarChart = echarts.init(document.getElementById('commonCarChart'));
            window.addEventListener("resize", function () {
                commonCarChart.resize();
            });
            var commonCar = [];
            commonCarData.forEach((item) =>{
                if(item.name.indexOf('（') || item.name.indexOf('）')){
                    item.name=item.name.replace(/（/g,'(');
                    item.name=item.name.replace(/）/g,')');
                }
                commonCar.push(item.name);

            });
            commonCarChart.setOption({
                title: {
                    text: `{a|常用车辆占比}  {b|${this.currentYear}}`,
                    x:'left',
                    y:'1%',
                    textStyle:{
                        rich:{
                            a:{
                                fontSize:18,
                                fontWeight:800
                            },
                            b:{
                                backgroundColor:'#FFCC66',
                                width:40,
                                height:18,
                                color:'#fff',
                                align:'center'
                            }
                        }
                    },
                },
                tooltip : {
                    trigger: 'item',
                    formatter: function(e){
                        var eVal = e.name;
                        eVal += "：" + e.data.value + "%" + '<br />' + "订单量：" + e.data.value1 + "笔";
                        return eVal;
                    }
                },
                legend: {
                    bottom: 5,
                    x: 'center',
                    data: commonCar,
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['36%', '66%'],
                        center: ['50%', '45%'],
                        minAngle:3,
                        avoidLabelOverlap: false,
                        itemStyle: {
                            normal:{
                                color: function (params){
                                    var colorList = ['#F07DC7','#04D2EB','#5396FF','#EB595A','#F2AE50','#F17E7D'];
                                    return colorList[params.dataIndex];
                                }
                            }
                        },
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
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
                                show: false
                            }
                        },
                        data: commonCarData
                    }
                ]         
            });
        }
    }
}