import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import { open, read } from 'fs';

var echarts = require('echarts');

@VueComponent({
    template: require('./WxDataAnalysisRequirement.html'),
    style: require('./WxDataAnalysisRequirement.scss')
})

export class WxDataAnalysisRequirement extends Vue{
    el:'#WxDataAnalysisRequirement'

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
     * 列表数据
     */
    listData=[];
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
    showTemp:boolean=true;
    isAdmin="";
    weChatAuthorize="";
    ready(){
        this.isAdmin=sessionStorage.getItem("isAdmin");
        this.weChatAuthorize=sessionStorage.getItem("weChatAuthorize");
        if(this.weChatAuthorize.indexOf('2')>-1 || this.isAdmin=='true'){
            this.showTemp=true;
        /**添加滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style", "height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.clientId = JSON.parse(window.sessionStorage.getItem("userInfo")).clientId;
        this.monthXdata = [];
        this.orderNum = [];
        this.carNum = [];
        this.tongeNum = [];
        this.lineOrderNum = [];
        this.starProvinceNum = [];
        this.endProviceNum = [];
        this.commonCarNum = [];

        if(window.sessionStorage.getItem("userName") == "麦当劳" || window.sessionStorage.getItem("userName") == "肯德基"){
            /**
             * 月度波动图
             */
            dataService().DataAnalysisMDL.getMonthlyFluctuationChart().then((res)=>{
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
            dataService().DataAnalysisMDL.getLineOrderResult().then((res)=>{
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
            dataService().DataAnalysisMDL.getOriginProvinceResult().then((res)=>{
                if(res.length == 0){
                    this.starProvinceNum = [];
                }else{
                    res.forEach((item)=>{
                        this.starProvinceNum.push({
                            name:item.originProvinces,
                            value:item.num
                        });
                    });
                }
            }).then(()=>{
                this.getStartProvince(this.starProvinceNum);
            });
            /**
             * 送达省份占比
             */
            dataService().DataAnalysisMDL.getDestinationProvinceResult().then((res)=>{
                if(res == []){
                    this.endProviceNum = [];
                }else{
                    res.forEach((item)=>{
                        this.endProviceNum.push({
                            name:item.destinationProvince,
                            value:item.num
                        });
                    });
                }
            }).then(()=>{
                this.getEndProvince(this.endProviceNum);
            });
            /**
             * 常用车辆占比
             */
            dataService().DataAnalysisMDL.getVehicleTypeResult().then((res)=>{
                if(res == []){
                    this.commonCarNum = [];
                }else{
                    res.forEach((item)=>{
                        this.commonCarNum.push({
                            name:item.vehicleType,
                            value:item.num
                        });
                    });
                }
            }).then(()=>{
                this.getCommonCar(this.commonCarNum);
            })
        }else{
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
                        value:item.num
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
                        value:item.num
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
                        value:item.num
                    });
                });
            }
        }).then(()=>{
            this.getCommonCar(this.commonCarNum);
        })
        }
        }else{
            this.showTemp=false;
        }
    }   

    /**
     * 月度波动图
     */
    getMonthWavePattern = function(x, orderData, carData, tongeData){
        var monthChart = echarts.init(document.getElementById('totalRequire'));
        window.addEventListener("resize", function () {
            monthChart.resize();
        });
        var month = x.slice(-6);
        var order = orderData.slice(-6);
        var car = carData.slice(-6);
        var tonge = tongeData.slice(-6);
        this.listData = [];
        for(var i=0;i<6;i++){
            this.listData.push({
                monthD:month[i],
                orderD:order[i],
                carD:car[i],
                tongeD:tonge[i]
            })
        }
        this.listData=this.listData.reverse();
        var option = {
            title: {
                // text: '交易统计概览'
                text:''
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor : '#0A275A',
                formatter:function(params)  
                {
                    $('#listTotal').find("tr").removeClass("list_c");
                    var index = params[0].axisValue;
                    $('#' + index).addClass("list_c");
                    var relVal = params[0].name;

                    for (var i = 0, l = params.length; i < l; i++) {  
                        if(params[i].seriesName == "物流订单量") {
                            relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + " 笔";
                        }if(params[i].seriesName == "所用车辆数"){
                            relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + " 辆";  
                        }else if(params[i].seriesName == "运输吨位数"){
                            relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + " 吨";
                        }
                    }  
                    return relVal;  
                }
            },
            legend: {
                padding: 3,
                bottom: 20,
                icon:'rect',
                itemWidth: 15,
                itemHeight: 15,
                data:['物流订单量','所用车辆数','运输吨位数'],
                textStyle: {
                    fontSize: 12,
                    color:'#fff'
                }
            },
            grid: {
                y:20,
                left: '2%',
                right: '2%',
                bottom: '25%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: month,
                axisTick:{show:false},
                axisLabel:{
                    interval:0,
                    rotate:30,
                    textStyle: {
                        color: '#999'
                    }
                },
                boundaryGap: false,
            },
            yAxis: [
                {
                    name: '',
                    nameTextStyle:{
                        padding: [0, 0, 0, 130],
                    },
                    splitLine: {show: false},
                    axisTick:{show:false},
                    axisLabel:{
                        textStyle: {
                            color: '#999'
                        }
                    },
                },
                {
                    name: '',
                    splitLine: {show: false},
                    axisTick:{show:false},
                    axisLabel:{
                        textStyle: {
                            color: '#999'
                        }
                    },
                }
            ],
            series: [
                {
                    name:'物流订单量',
                    type:'line',
                    color: ['#FF2A3A'],
                    data: order,
                    showAllSymbol: true,
                    showSymbol: false,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                width:1
                            }
                        },
                    },
                },
                {
                    name:'所用车辆数',
                    type:'line',
                    color: ['#FFBB2E'],
                    data: car,
                    showAllSymbol: true,
                    showSymbol: false,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                width:1
                            }
                        },
                    },
                },
                {
                    name:'运输吨位数',
                    type:'line',
                    color: ['#3BD7F9'],
                    data: tonge,
                    yAxisIndex:1,
                    showAllSymbol: true,
                    showSymbol: false,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                width:1
                            }
                        },
                    },
                }
            ]
        };
        monthChart.setOption(option);
        monthChart.on('globalout', function (params) {
            $('.analysistable').find("tr").removeClass("list_c");
        });
    }

    /**
     * 线路订单量占比
     */
    getLineOrder = function(lineData){
        if(lineData.length == 0){
            var lineOrderChart = echarts.init(document.getElementById('lineRequire'));
            window.addEventListener("resize", function () {
                lineOrderChart.resize();
            });
            var option = {
                title: {
                    text: ''
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
                                    color: '#fff',
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
            var lineOrderChart = echarts.init(document.getElementById('lineRequire'));
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
                    text: ''
                },
                tooltip: {
                    show:false
                },
                grid: {
                    left: '3%',
                    top:'2%',
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
                            fontSize: 12,
                            color: '#fff'
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
                                     var colorList = ['#14C4C9','#4371FF','#FF3FA5','#FF9224','#E25C55','#3BD7F9','#FF2A3A','#FFD448','#00E46C','#A77FFF','#0091F5'];
                                    return colorList[params.dataIndex];
                                },
                                label: {
                                    show: true,
                                    position: 'right',
                                    textStyle:{
                                        color:'#fff',
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
            var startProvinceChart = echarts.init(document.getElementById('startRequire'));
            window.addEventListener("resize", function () {
                startProvinceChart.resize();
            });
            var option = {
                title : {
                    text: '',
                    x:'left',
                    y:'1%'
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
                                    color: '#fff',
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
            var startProvinceChart = echarts.init(document.getElementById('startRequire'));
            window.addEventListener("resize", function () {
                startProvinceChart.resize();
            });
            var startProvince = [];
            startProvinceData.forEach((item) =>{
                startProvince.push(item.name);
            });
            var optionT = {
                title : {
                    text: '',
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c}%",
                    backgroundColor : '#0A275A'
                },
                legend: {
                    orient: 'vertical',
                    y:'center',
                    right:'8%',
                    itemWidth: 15,
                    itemHeight: 15,
                    align: 'left',
                    textStyle: {
                        fontSize: 12,
                        color:'#fff'
                    },
                    data: startProvince,
                    formatter:function(name){
                        var d = optionT.series[0].data;
                        for(var i = 0; i < optionT.series[0].data.length; i++){
                            if(name==d[i].name){
                                return name + '    ' + d[i].value  + '%';
                            }
                        }
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['26%', '46%'],
                        center: ['25%', '48%'],
                        minAngle:3,
                        itemStyle: {
                            normal:{
                                color: function (params){
                                    var colorList = ['#0091F5','#A77FFF','#00E46C','#FFD448','#FF2A3A','#3BD7F9','#E25C55','#FF9224','#FF3FA5','#4371FF','#14C4C9'];
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
                                    fontSize: '12',
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
            var endProvinceChart = echarts.init(document.getElementById('arriveRequire'));
            window.addEventListener("resize", function () {
                endProvinceChart.resize();
            });
            var option = {
                title:{
                    text:'',
                    // x:'left',
                    // y:'1%'
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
                                    color: '#fff',
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
            var endProvinceChart = echarts.init(document.getElementById('arriveRequire'));
            window.addEventListener("resize", function () {
                endProvinceChart.resize();
            });
            var endProvince = [];
            endProviceData.forEach((item) =>{
                endProvince.push(item.name);
            });
            var optionT = {
                title:{
                    text:'',
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c}%",
                    backgroundColor : '#0A275A'
                },
                legend: {
                    orient: 'vertical',
                    y:'center',
                    right:'8%',
                    itemWidth: 15,
                    itemHeight: 15,
                    align: 'left',
                    textStyle: {
                        fontSize: 12,
                        color:'#fff'
                    },
                    data: endProvince,
                    formatter:function(name){
                        var d = optionT.series[0].data;
                        for(var i = 0; i < optionT.series[0].data.length; i++){
                            if(name==d[i].name){
                                return name + '    ' + d[i].value  + '%';
                            }
                        }
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['26%', '46%'],
                        center: ['25%', '48%'],
                        minAngle:3,
                        avoidLabelOverlap: false,
                        itemStyle: {
                            normal:{
                                color: function (params){
                                    var colorList = ['#0091F5','#A77FFF','#00E46C','#FFD448','#FF2A3A','#3BD7F9','#E25C55','#FF9224','#FF3FA5','#4371FF','#14C4C9'];
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
                                    fontSize: '12',
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
            var commonCarChart = echarts.init(document.getElementById('carRequire'));
            window.addEventListener("resize", function () {
                commonCarChart.resize();
            });
            commonCarChart.setOption({
                title:{
                    text:'',
                    // x:'left',
                    // y:'1%'
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
                                        color: '#fff',
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
            var commonCarChart = echarts.init(document.getElementById('carRequire'));
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
            var optionT = {
                title:{
                    text:'',
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c}%",
                    backgroundColor : '#0A275A'
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    right: 5,
                    y:'center',
                    itemWidth:15,
                    itemHeight:15,
                    align: 'left',
                    textStyle: {
                        fontSize: 12,
                        color:'#fff'
                    },
                    data: commonCar,
                    formatter:function(name){
                        var d = optionT.series[0].data;
                        for(var i = 0; i < optionT.series[0].data.length; i++){
                            if(name==d[i].name){
                                return name + '    ' + d[i].value  + '%';
                            }
                        }
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ['26%', '46%'],
                        center: ['25%', '48%'],
                        minAngle:3,
                        avoidLabelOverlap: false,
                        itemStyle: {
                            normal:{
                                color: function (params){
                                    var colorList = ['#0091F5','#A77FFF','#00E46C','#FFD448','#FF2A3A','#3BD7F9','#E25C55','#FF9224','#FF3FA5','#4371FF','#14C4C9'];
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
                                    fontSize: '12',
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
            }
            commonCarChart.setOption(optionT);
        }
    }
}