import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'
var echarts = require('echarts')
Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxdataAnalysisCost.html'),
    style: require('./WxdataAnalysisCost.scss'),
})

export class WxdataAnalysisCostComponent extends Vue{
    el:'#WxdataAnalysisCost'
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
    totaldata=[];
    //线路吨位波动价格
    lineone = [];
    lineoneprovinceCity = [];
    lineTonnageRangeNumber = [];

    ready(){
        /**添加滚动条 */
        document.getElementsByTagName("body")[0].setAttribute("style", "height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        this.id = JSON.parse(window.sessionStorage.getItem("userInfo")).clientId;
        // 物流费用波动
        this.logisticsCostRangeNumber = [];
        this.logisticsCostRangeMonth = [];

        if(window.sessionStorage.getItem("userName") == "麦当劳" || window.sessionStorage.getItem("userName") == "肯德基"){
            dataService().OrderReceivableMDL.Get12MonthsReceivableTotalPrice().then((res)=>{
                res.forEach((item,index)=>{
                    if(index>5){
                        this.logisticsCostRangeNumber.push(item.receivableTotalPrice);
                        this.logisticsCostRangeMonth.push(item.month);
                    }
                });
            }).then(()=>{
                this.logisticsCostRange(this.logisticsCostRangeNumber,this.logisticsCostRangeMonth);
            })
            // //线路成本比例
            this.lineCostNumber = [];
            dataService().OrderReceivableMDL.GetOrderLineTop10Receivable().then((res)=>{
                res.forEach((item,index)=>{
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
            // //费用类型比例
            this.costTypeNumber = [];
            dataService().OrderReceivableMDL.GetOrderReceivableFeeType().then((res)=>{
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
            this.totaldata=[];
            dataService().OrderReceivableMDL.GetOrderReceivableLineTop5Month().then((res)=>{
                res.forEach((item,index)=>{
                        this.totalCostRangeNumber.push(item)
                        this.linetotalone.push(item.listOrderReceivableMonth.slice(-6))
                        this.linetotaloneprovinceCity.push(item.provinceCity);
                });
                
                
            }).then(()=>{
                this.totalCostRangeData(this.linetotalone,this.linetotaloneprovinceCity)
            })
        }else {
            dataService().OrderReceivable.Get12MonthsReceivableTotalPrice(this.id).then((res)=>{
                res.forEach((item,index)=>{
                    if(index>5){
                        this.logisticsCostRangeNumber.push(item.receivableTotalPrice);
                        this.logisticsCostRangeMonth.push(item.month);
                    }
                });
            }).then(()=>{
                this.logisticsCostRange(this.logisticsCostRangeNumber,this.logisticsCostRangeMonth);
            })
            // //线路成本比例
            this.lineCostNumber = [];
            dataService().OrderReceivable.GetOrderLineTop10Receivable(this.id).then((res)=>{
                res.forEach((item,index)=>{
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
            // //费用类型比例
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
            this.totaldata=[];
            dataService().OrderReceivable.GetOrderReceivableLineTop5Month(this.id).then((res)=>{
                res.forEach((item,index)=>{
                        this.totalCostRangeNumber.push(item)
                        this.linetotalone.push(item.listOrderReceivableMonth.slice(-6))
                        this.linetotaloneprovinceCity.push(item.provinceCity);
                });
                
                
            }).then(()=>{
                this.totalCostRangeData(this.linetotalone,this.linetotaloneprovinceCity)
            })
        }
      
    }


    //1线路总费用波动
    totalCostRangeData = function(linecosttotal,linecostprovinceCity){
        var totalCostRange = echarts.init(document.getElementById('WxtotalCostRange'));
        window.addEventListener("resize", function () {
            totalCostRange.resize();
        });
        totalCostRange.on('globalout', function (params) {
            $('.analysistable').find("tr").removeClass("list_c");
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
         /* table */
    
         switch(linecosttotal.length-1){
            case 0:
                    for(var i=0;i<=linecosttotal.length;i++){
                        this.totaldata.push({
                            month: linecostmonth[i],
                            a:datapriceAA[i],
                        })
                       } 
                    break;
            case 1:
                    for(var i=0;i<=linecosttotal.length;i++){
                        this.totaldata.push({
                            month: linecostmonth[i],
                            a:datapriceAA[i],
                            b:datapriceBB[i],
                        })
                       } 
                    break;
            case 2:
                    for(var i=0;i<=linecosttotal.length;i++){
                        this.totaldata.push({
                            month: linecostmonth[i],
                            a:datapriceAA[i],
                            b:datapriceBB[i],
                            c:datapriceCC[i],
                        })
                       } 
                    break;
            case 3:
                    for(var i=0;i<=linecosttotal.length;i++){
                        this.totaldata.push({
                            month: linecostmonth[i],
                            a:datapriceAA[i],
                            b:datapriceBB[i],
                            c:datapriceCC[i],
                            d:datapriceDD[i],
                        })
                       } 
                    break;
            case 4: 
                    for(var i=0;i<=linecosttotal.length;i++){
                        this.totaldata.push({
                            month: linecostmonth[i],
                            a:datapriceAA[i],
                            b:datapriceBB[i],
                            c:datapriceCC[i],
                            d:datapriceDD[i],
                            e:datapriceEE[i],
                        })
                       } 
                    break;
        }
        this.totaldata=this.totaldata.reverse();

        var option_totalCostRange ={
            // title: {
            //     text: '线路总费用波动'
            // },
            tooltip: {
                trigger: 'axis',
                backgroundColor : '#0A275A',
                textStyle:{
                    fontSize: 10,
                },
                formatter:function(params)  
                {  
                    $('.analysistable').find("tr").removeClass("list_c");
                    var index = params[0].axisValue;
                    console.log('params',params)
                    $('#' + index).addClass("list_c");

                    var relVal = params[0].name;  
                    for (var i = 0, l = params.length; i < l; i++) {  
                            relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + " 元";  
                        }  
                    return relVal;  
                }
            },
            legend: {
                itemWidth: 15,
                itemHeight: 15,
                itemGap: 5,       
                x: 'center',
                bottom: 15,
                padding: 3,
                icon:'square',
                data:linecostprovinceCity,
                textStyle: {
                    fontSize: 12,
                    color:'#fff'
                }
            },
            grid: {
                y:20,
                left: '3%',
                right: '4%',
                bottom: '30%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisTick:{
                    show:false
                },
                boundaryGap: false,
                data: linecostmonth,
                show : true,  
                axisLabel:{  
                    interval:0,
                    rotate:30,
                    textStyle: {
                        color: '#999'
                    }
                }
            },
            yAxis: [
                {
                // name:'单位：元',
                splitLine:{show: false},
                axisLabel:{
                    textStyle: {
                        color: '#999'
                    }
                },
                }
            ],
            series: [
                {
                    name:linecostprovinceCity[0],
                    type:'line',
                    data:datapriceAA,
                    showAllSymbol: true,
                    symbolSize : 4,
                    showSymbol: false,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                color: '#0091F5',
                                width:1
                            }
                        },
                    },
                },
                {
                    name:linecostprovinceCity[1],
                    type:'line',
                    data:datapriceBB,
                    showAllSymbol: true,
                    showSymbol: false,
                    symbolSize : 4,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                color: '#A77FFF',
                                width:1
                            }
                        },
                    },
                },
                {
                    name:linecostprovinceCity[2],
                    type:'line',
                    data:datapriceCC,
                    showAllSymbol: true,
                    showSymbol: false,
                    symbolSize : 4,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                color: '#00E46C',
                                width:1
                            }
                        },
                    },
                },
                {
                    name:linecostprovinceCity[3],
                    type:'line',
                    data:datapriceDD,
                    showAllSymbol: true,
                    showSymbol: false,
                    symbolSize : 4,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                color: '#FFD448',
                                width:1
                            }
                        },
                    },
                },
                {
                    name:linecostprovinceCity[4],
                    type:'line',
                    data:datapriceEE,
                    showAllSymbol: true,
                    showSymbol: false,
                    symbolSize : 4,
                    itemStyle:{
                        normal:{
                            lineStyle:{
                                color: '#FF2A3A',
                                width:1
                            }
                        },
                    },
                }
            ],
            color: ['#0091F5','#A77FFF','#00E46C','#FFD448','#FF2A3A','#3BD7F9','#E25C55','#FF9224','#FF3FA5','#4371FF','#14C4C9']
        }
        totalCostRange.setOption(option_totalCostRange);
    }

    // 2物流费用波动
    logisticsCostRange = function(Number,Month){
        var logisticsCostRangess = echarts.init(document.getElementById('WxlogisticsCostRangess'));
        window.addEventListener("resize", function () {
            logisticsCostRangess.resize();
        });
        var option_logisticsCostRange = {
            color:['#04D2EB'],
            tooltip: {
                trigger: 'axis',
                backgroundColor : '#0A275A',
                formatter:function(e){
                    var eVal = e[0].name;
                    for(var i = 0; i <  e.length; i++){
                        eVal += '<br />' + e[i].seriesName + ":" + e[i].value + "元"
                    }
                    return eVal;
                }
            },
            grid: {
                y:20,
                left: '3%',
                right: '4%',
                bottom: '15',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisTick:{show:false},
                boundaryGap: false,
                data:Month,
                show:true,
                axisLabel:{  
                    interval:0,
                    rotate:30,
                    textStyle: {
                        color: '#999'
                    }
                }
            },
            yAxis: [
                {
                splitLine: {show: false},
                axisLabel:{
                    textStyle: {
                        color: '#999'
                    }
                },
                }
            ],
            series: [{
                value:Number,
                symbol: 'emptyCircle',  // 数据级个性化拐点图形
                symbolSize : 4,
                showAllSymbol: true,
                showSymbol: true,
                name: '物流费用波动',
                type: 'line',
                itemStyle:{
                    normal:{
                        color: "#EB6614",
                        lineStyle:{
                            color: '#EB6614',
                            width:1
                        },
                        label: {
                            "show": false,  
                            // "position": "top",
                        }
                    },
                },
                data:Number,
            }],
        };
        logisticsCostRangess.setOption(option_logisticsCostRange,true);
    }

    
    // 3费用类型比例
    contTitleRata = function(costTitle){
        if(costTitle.length == 0){
            var costTypeNodata = echarts.init(document.getElementById('WxcostType'));
            window.addEventListener("resize", function () {
                costTypeNodata.resize();
            });
            var option_costTypeNodata = {
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
                                    color: '#fff',
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                },
                                formatter: '暂无数据'
                            }
                        },
                    }],
                    color: ['#0091F5','#A77FFF','#00E46C','#FFD448','#FF2A3A','#3BD7F9','#E25C55','#FF9224','#FF3FA5','#4371FF','#14C4C9']
                }]
            }
            costTypeNodata.setOption(option_costTypeNodata);
        }else{
            var costType = echarts.init(document.getElementById('WxcostType'));
            window.addEventListener("resize", function () {
                costType.resize();
            });
            var costTitledata = [];
            costTitle.forEach((item) => {
                costTitledata.push(item.name);
            })
            var option_costType = {
                legend: {
                    y: 'center',
                    left:'60%',
                    orient: 'vertical',
                    data:costTitledata,
                    itemWidth:15,
                    itemHeight:15,
                    formatter:function(name){
                        for (var i=0;i<costTitle.length;i++){
                            if(name==costTitle[i].name){
                                return name+' '+costTitle[i].value+'%';
                            }
                        }
                       
                    },
                    textStyle: {
                        fontSize: 12,
                        color:'#fff'
                    }
                },
                grid: {
                     x:20,
                     left: '5%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c}%",
                    backgroundColor : '#0A275A'
                },
                series: [
                    {
                        name:'费用类型占比',
                        type:'pie',
                        minAngle:5,
                        avoidLabelOverlap: false,
                        center: ['30%', '50%'],
                        radius: ['35%', '66%'],
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
                        data:costTitle
                    }
                ],
                color: ['#0091F5','#A77FFF','#00E46C','#FFD448','#FF2A3A','#3BD7F9','#E25C55','#FF9224','#FF3FA5','#4371FF','#14C4C9']
            }
            costType.setOption(option_costType);
        }
    }

   // 4线路成本比例
    lineCostRata = function(lineData){
        if(lineData.length == 0){
            var lineCostNodata = echarts.init(document.getElementById('WxlineCost'));
            window.addEventListener("resize", function () {
                lineCostNodata.resize();
            });
            var option_lineCostNodata = {
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
                                    color: '#fff',
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
            var lineCost = echarts.init(document.getElementById('WxlineCost'));
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
                tooltip: {
                    show:false
                },
                grid: {
                    y:20,
                    left: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    splitLine: {show: false},
                    axisLabel: {show: false},
                    axisTick: {show: false},
                    axisLine: {show: false},
                    boundaryGap : [0, 0.1]
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
                            fontSize: 12,
                            color: '#fff'
                        }
                    },
                },
                series: [
                    {
                        // name:'线路成本占比',
                        type:'bar',
                        barMaxWidth:25,
                        itemStyle: {
                            normal:{
                                color: function (params){
                                    var colorList = ['#0091F5','#A77FFF','#00E46C','#FFD448','#FF2A3A','#3BD7F9','#E25C55','#FF9224','#FF3FA5','#4371FF','#14C4C9'];
                                    return colorList[params.dataIndex];
                                },
                                label: {
                                    show: true,
                                    position: 'right',
                                    textStyle:{
                                        color:'#fff',
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
}