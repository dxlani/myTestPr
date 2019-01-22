import { Prop, VueComponent } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import '../../img/daquan.png'
import '../../img/wode.png'
import '../../img/noValide.png'
import '../../img/daquanLocateIcon.png';
import '../../img/sino-er.png'
import '../../img/csp-er.png'
import '../../img/ccp-er.png'
import "../../img/default-avatar.png";
var echarts = require('echarts');

@VueComponent({
  template: require("./DataAnalysisControlle.html"),
  style: require("./DataAnalysisControlle.scss")
})
export class DataAnalysisControlle extends Vue {
  el: "#DataAnalysisControlle";

  /* 当前用户是否有效 */
  isValide: boolean = false;
  /**用户Logo */
  userLogo: string = "";

  /**客户单位名称 */
  userName:string = "";
  /* 用户token */
  userToken: string = "";
  /* 是否显示按钮 */

  id: string;
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
  oneTab: boolean = false;
  twoTab: boolean = false;
  threeTab: boolean = false;

  @Prop
  /**
   * 客户id
   */
  clientId: string;
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
  commonCarNum = [];
  /**
   * 年份
   */
  currentYear: string = "";
  //时间
  qwMonthXdata = [];
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

  ClientId: string;

  ready() {
    this.isValide = true;
    this.oneTab = true;
    this.twoTab = false;
    this.threeTab = false;
    this.userToken = this.$route.query.accountSID;
    //  this.userToken = "3f02b2188a8aa504162c50eb8544d4d5";

    // if (this.userToken == "a26c15dcef031f4240fb3d8b23c16140") {
    //   this.userLogo = "../../img/daquan.png";
    // } else if (this.userToken == "3f02b2188a8aa504162c50eb8544d4d5") {
    //   this.userLogo = "../../img/wode.png";
    // }
    Vue.http.headers.common["accountSID"] = this.userToken;

    dataService()
      .daquan.customerValide()
      .then(res => {
        if (res.validationResult) {
          this.isValide = true;
          this.userLogo = res.logoUrl;
          this.userName = res.name;
          console.log("userLogo", this.userLogo);
        } else {
          this.isValide = false;
        }
      });
    this.currentYear = new Date().getFullYear().toString();
    this.clickTab1();
    this.clickTab2();
    this.clickTab3();
  }

  /* tab1Click */
  clickTab1() {
    /**
     * 月度波动图
     */
    dataService()
      .DataAnalysisApiControlle.getMonthlyFluctuationChart()
      .then(res => {
        var orderNumber = [];
        var vehicleNum = [];
        var transportTonnageNum = [];
        this.monthXdata = [];
        this.orderNum = [];
        this.carNum = [];
        this.tongeNum = [];
        res.forEach(item => {
          if (item.type == "OrderFluctuation") {
            orderNumber = item.monthlyFluctuationData;
            orderNumber.forEach(itemO => {
              this.monthXdata.push(itemO.time);
              this.orderNum.push(itemO.num);
            });
          }
          if (item.type == "VehicleNumFluctuate") {
            vehicleNum = item.monthlyFluctuationData;
            vehicleNum.forEach(itemV => {
              this.carNum.push(itemV.num);
            });
          } else if (item.type == "TransportTonnageFluctuate") {
            transportTonnageNum = item.monthlyFluctuationData;
            transportTonnageNum.forEach(itemT => {
              this.tongeNum.push(itemT.num);
            });
          }
        });
      })
      .then(() => {
        this.getMonthWavePattern(
          this.monthXdata,
          this.orderNum,
          this.carNum,
          this.tongeNum
        );
      });
    /**
     * 线路订单量占比
     */
    dataService()
      .DataAnalysisApiControlle.getLineOrderResult()
      .then(res => {
        this.lineOrderNum = [];
        if (res == []) {
          this.lineOrderNum = [];
        } else {
          res.forEach(item => {
            this.lineOrderNum.push({
              name: item.provinceCity,
              value: item.num
            });
          });
        }
      })
      .then(() => {
        this.getLineOrder(this.lineOrderNum);
      });
    /**
     * 始发省份占比
     */
    dataService()
      .DataAnalysisApiControlle.getOriginProvinceResult()
      .then(res => {
        this.starProvinceNum = [];
        if (res.length == 0) {
          this.starProvinceNum = [];
        } else {
          res.forEach(item => {
            this.starProvinceNum.push({
              name: item.originProvinces,
              value: item.num,
              value1: item.orderNum
            });
          });
        }
      })
      .then(() => {
        this.getStartProvince(this.starProvinceNum);
      });
    /**
     * 送达省份占比
     */
    dataService()
      .DataAnalysisApiControlle.getDestinationProvinceResult()
      .then(res => {
        this.endProviceNum = [];
        if (res == []) {
          this.endProviceNum = [];
        } else {
          res.forEach(item => {
            this.endProviceNum.push({
              name: item.destinationProvince,
              value: item.num,
              value1: item.orderNum
            });
          });
        }
      })
      .then(() => {
        this.getEndProvince(this.endProviceNum);
      });
    /**
     * 常用车辆占比
     */
    dataService()
      .DataAnalysisApiControlle.getVehicleTypeResult()
      .then(res => {
        this.commonCarNum = [];
        if (res == []) {
          this.commonCarNum = [];
        } else {
          res.forEach(item => {
            this.commonCarNum.push({
              name: item.vehicleType,
              value: item.num,
              value1: item.orderNum
            });
          });
        }
      })
      .then(() => {
        this.getCommonCar(this.commonCarNum);
      });
  }

  /* tab2Click */
  clickTab2() {
    // 物流费用波动
    dataService()
      .DataAnalysisApiControlle.Get12MonthsReceivableTotalPrice()
      .then(res => {
        this.logisticsCostRangeNumber = [];
        this.logisticsCostRangeMonth = [];
        res.forEach((item, index) => {
          this.logisticsCostRangeNumber.push(item.receivableTotalPrice);
          this.logisticsCostRangeMonth.push(item.month);
        });
      })
      .then(() => {
        this.logisticsCostRange(
          this.logisticsCostRangeNumber,
          this.logisticsCostRangeMonth
        );
      });
    //线路成本比例
    dataService()
      .DataAnalysisApiControlle.GetOrderLineTop10Receivable()
      .then(res => {
        this.lineCostNumber = [];
        res.forEach(item => {
          if (item.provinceCity != "其他") {
            this.lineCostNumber.push({
              name: item.provinceCity,
              value: item.percent
            });
          }
        });
      })
      .then(() => {
        this.lineCostRata(this.lineCostNumber);
      });
    //费用类型比例
    dataService()
      .DataAnalysisApiControlle.GetOrderReceivableFeeType()
      .then(res => {
        this.costTypeNumber = [];
        res.forEach((item, index) => {
          this.costTypeNumber.push({
            name: item.feeTypeName,
            value: item.percent
          });
        });
      })
      .then(() => {
        this.contTitleRata(this.costTypeNumber);
      });
    //线路价格波动
    dataService()
      .DataAnalysisApiControlle.GetOrderReceivableLineTop5Month()
      .then(res => {
        this.linetotalone = [];
        this.linetotaloneprovinceCity = [];
        this.totalCostRangeNumber = [];
        res.forEach((item, index) => {
          this.totalCostRangeNumber.push(item);
          this.linetotalone.push(item.listOrderReceivableMonth);
          this.linetotaloneprovinceCity.push(item.provinceCity);
        });
      })
      .then(() => {
        this.totalCostRangeData(
          this.linetotalone,
          this.linetotaloneprovinceCity
        );
      });
  }

  /* tab3Click */
  clickTab3() {
    /**质量分析 */
    dataService()
      .DataAnalysisApiControlle.getRate()
      .then(res => {
        this.qwMonthXdata = [];
        this.arrivalNum = [];
        this.deliveryNum = [];
        var reachNum = [];
        var trafficNum = [];
        trafficNum = res.qualityDeliveryList;
        trafficNum.forEach(itemD => {
          this.qwMonthXdata.push(itemD.time);
          this.deliveryNum.push({
            valueR: itemD.rate,
            valueN: itemD.num
          });
        });
        reachNum = res.qualityArrivalList;
        reachNum.forEach(itemA => {
          this.arrivalNum.push({
            valueR: itemA.rate,
            valueN: itemA.num
          });
        });
      })
      .then(() => {
        this.getRate(this.qwMonthXdata, this.deliveryNum, this.arrivalNum);
      });
    dataService()
      .DataAnalysisApiControlle.getResponseRate()
      .then(res => {
        this.responseTime = [];
        this.sendCar = [];
        this.presentOn = [];
        var sendCarNum = [];
        var presentOnNum = [];
        sendCarNum = res.sendCarOnTimeList;
        sendCarNum.forEach(itemS => {
          this.responseTime.push(itemS.time);
          this.sendCar.push({
            valueR: itemS.rate,
            valueN: itemS.num
          });
        });
        presentOnNum = res.presentOnTimeList;
        presentOnNum.forEach(itemP => {
          this.presentOn.push({
            valueR: itemP.rate,
            valueN: itemP.num
          });
        });
      })
      .then(() => {
        this.getresponseAgingRate(
          this.responseTime,
          this.sendCar,
          this.presentOn
        );
      });
  }

  /**
   * 月度波动图
   */
  getMonthWavePattern = function(x, orderData, carData, tongeData) {
    var monthDiv = document.getElementById("monthWavePattern");
    var monthChart = echarts.init(document.getElementById("monthWavePattern"));
    monthChart.resize(monthDiv.offsetWidth, monthDiv.offsetHeight);
    window.addEventListener("resize", function() {
      monthChart.resize();
    });
    var option = {
      title: {
        text: "交易统计概览"
      },
      tooltip: {
        trigger: "axis",
        formatter: function(params) {
          var relVal = params[0].name;
          for (var i = 0, l = params.length; i < l; i++) {
            if (params[i].seriesName == "物流订单量") {
              relVal +=
                "<br/>" + params[i].seriesName + " : " + params[i].value + "笔";
            }
            if (params[i].seriesName == "所用车辆数") {
              relVal +=
                "<br/>" + params[i].seriesName + " : " + params[i].value + "辆";
            } else if (params[i].seriesName == "运输吨位数") {
              relVal +=
                "<br/>" + params[i].seriesName + " : " + params[i].value + "吨";
            }
          }
          return relVal;
        }
      },
      legend: {
        x: "right",
        icon: "circle",
        itemWidth: 15,
        itemHeight: 15,
        data: ["物流订单量", "所用车辆数", "运输吨位数"]
      },
      xAxis: {
        type: "category",
        data: x,
        axisTick: { show: false }
      },
      yAxis: [
        {
          name: "物流订单量（单位：笔）,所用车辆数（单位：辆）",
          nameTextStyle: {
            padding: [0, 0, 0, 130]
          },
          splitLine: {
            show: false
          }
        },
        {
          name: "运输吨位数（单位：吨）",
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "物流订单量",
          type: "line",
          color: ["#EB595A"],
          data: orderData,
          showAllSymbol: true,
          showSymbol: false
        },
        {
          name: "所用车辆数",
          type: "line",
          color: ["#3AB9E9"],
          data: carData,
          showAllSymbol: true,
          showSymbol: false
        },
        {
          name: "运输吨位数",
          type: "line",
          color: ["#2CBB8D"],
          data: tongeData,
          yAxisIndex: 1,
          showAllSymbol: true,
          showSymbol: false
        }
      ]
    };
    monthChart.setOption(option);
  };

  /**
   * 线路订单排名
   */
  getLineOrder = function(lineData) {
    if (lineData.length == 0) {
      var lineOrderDiv = document.getElementById("lineOrderChart");
      var lineOrderChart = echarts.init(
        document.getElementById("lineOrderChart")
      );
      lineOrderChart.resize(
        lineOrderDiv.offsetWidth,
        lineOrderDiv.offsetHeight
      );
      window.addEventListener("resize", function() {
        lineOrderChart.resize();
      });
      var option = {
        title: {
          text: `{a|线路订单排名}  {b|${this.currentYear}}`,
          x: "left",
          y: "1%",
          textStyle: {
            rich: {
              a: {
                fontSize: 18,
                fontWeight: 800
              },
              b: {
                backgroundColor: "#3AB9E9",
                width: 40,
                height: 18,
                color: "#fff",
                align: "center"
              }
            }
          }
        },
        tooltip: {},
        grid: {
          left: "3%",
          bottom: "3%",
          containLabel: true
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: "100",
                name: "nodata",
                cursor: "default",
                tooltip: {
                  show: false
                },
                hoverAnimation: false,
                label: {
                  normal: {
                    textStyle: {
                      color: "#000000",
                      fontSize: "16",
                      bold: "bold"
                    },
                    formatter: "暂无数据"
                  }
                },
                itemStyle: {
                  normal: {
                    color: "#FFFFFF"
                  },
                  emphasis: {
                    color: "#FFFFFF"
                  }
                }
              }
            ]
          }
        ]
      };
      lineOrderChart.setOption(option);
    } else {
      var lineOrderDiv = document.getElementById("lineOrderChart");
      var lineOrderChart = echarts.init(
        document.getElementById("lineOrderChart")
      );
      lineOrderChart.resize(
        lineOrderDiv.offsetWidth,
        lineOrderDiv.offsetHeight
      );
      window.addEventListener("resize", function() {
        lineOrderChart.resize();
      });
      var lineName = [];
      lineData.forEach(item => {
        lineName.push(item.name);
      });
      lineName = lineName.reverse();
      var lineNum = [];
      lineData.forEach(item => {
        lineNum.push(item.value);
      });
      lineNum = lineNum.reverse();

      var optionT = {
        title: {
          text: `{a|线路订单排名}  {b|${this.currentYear}}`,
          x: "left",
          y: "1%",
          textStyle: {
            rich: {
              a: {
                fontSize: 18,
                fontWeight: 800
              },
              b: {
                backgroundColor: "#3AB9E9",
                width: 40,
                height: 18,
                color: "#fff",
                align: "center"
              }
            }
          }
        },
        tooltip: {
          show: false
        },
        grid: {
          left: "3%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          splitLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false }
        },
        yAxis: {
          type: "category",
          data: lineName,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: {
            margin: 30,
            textStyle: {
              fontSize: 14
            }
          }
        },
        series: [
          {
            type: "bar",
            data: lineNum,
            barMaxWidth: 25,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9"
                  ];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true,
                  position: "right",
                  textStyle: {
                    color: "#000000",
                    fontSize: "12"
                  }
                }
              }
            }
          }
        ]
      };
      lineOrderChart.setOption(optionT);
    }
  };

  /**
   * 始发省份占比
   */
  getStartProvince = function(startProvinceData) {
    if (startProvinceData.length == 0) {
      var startProvinceDiv = document.getElementById("startProvinceChart");
      var startProvinceChart = echarts.init(
        document.getElementById("startProvinceChart")
      );
      startProvinceChart.resize(
        startProvinceDiv.offsetWidth,
        startProvinceDiv.offsetHeight
      );
      window.addEventListener("resize", function() {
        startProvinceChart.resize();
      });
      var option = {
        title: {
          text: `{a|始发省份占比}  {b|${this.currentYear}}`,
          x: "left",
          y: "1%",
          textStyle: {
            rich: {
              a: {
                fontSize: 18,
                fontWeight: 800
              },
              b: {
                backgroundColor: "#3AB9E9",
                width: 40,
                height: 18,
                color: "#fff",
                align: "center"
              }
            }
          }
        },
        tooltip: {},
        legend: {
          icon: "circle"
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: "100",
                name: "nodata",
                cursor: "default",
                tooltip: {
                  show: false
                },
                hoverAnimation: false,
                label: {
                  normal: {
                    textStyle: {
                      color: "#000000",
                      fontSize: "18",
                      bold: "bold"
                    },
                    formatter: "暂无数据"
                  }
                },
                itemStyle: {
                  normal: {
                    color: "#87CEFA"
                  },
                  emphasis: {
                    color: "#87CEFA"
                  }
                }
              }
            ]
          }
        ]
      };
      startProvinceChart.setOption(option);
    } else {
      var startProvinceDiv = document.getElementById("startProvinceChart");
      var startProvinceChart = echarts.init(
        document.getElementById("startProvinceChart")
      );
      startProvinceChart.resize(
        startProvinceDiv.offsetWidth,
        startProvinceDiv.offsetHeight
      );
      window.addEventListener("resize", function() {
        startProvinceChart.resize();
      });
      var startProvince = [];
      startProvinceData.forEach(item => {
        startProvince.push(item.name);
      });
      var optionT = {
        title: {
          text: `{a|始发省份占比}  {b|${this.currentYear}}`,
          x: "left",
          y: "1%",
          textStyle: {
            rich: {
              a: {
                fontSize: 18,
                fontWeight: 800
              },
              b: {
                backgroundColor: "#3AB9E9",
                width: 40,
                height: 18,
                color: "#fff",
                align: "center"
              }
            }
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function(e) {
            var eVal = e.name;
            eVal +=
              "：" +
              e.data.value +
              "%" +
              "<br />" +
              "订单量：" +
              e.data.value1 +
              "笔";
            return eVal;
          }
        },
        legend: {
          bottom: 5,
          x: "center",
          data: startProvince,
          icon: "circle"
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["36%", "66%"],
            center: ["50%", "45%"],
            minAngle: 3,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#5396FF",
                    "#EB595A",
                    "#50E3C2",
                    "#FFEF21",
                    "#909DEF",
                    "#64C843",
                    "#F2AE50",
                    "#F17E7D",
                    "#6CACF4",
                    "#F07DC7",
                    "#04D2EB"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            },
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: startProvinceData
          }
        ]
      };
      startProvinceChart.setOption(optionT);
    }
  };

  /**
   * 送达省份占比
   */
  getEndProvince = function(endProviceData) {
    if (endProviceData.length == 0) {
      var endProvinceDiv = document.getElementById("endProvinceChart");
      var endProvinceChart = echarts.init(
        document.getElementById("endProvinceChart")
      );
      endProvinceChart.resize(
        endProvinceDiv.offsetWidth,
        endProvinceDiv.offsetHeight
      );
      window.addEventListener("resize", function() {
        endProvinceChart.resize();
      });
      var option = {
        title: {
          text: `{a|送达省份占比}  {b|${this.currentYear}}`,
          x: "left",
          y: "1%",
          textStyle: {
            rich: {
              a: {
                fontSize: 18,
                fontWeight: 800
              },
              b: {
                backgroundColor: "#3AB9E9",
                width: 40,
                height: 18,
                color: "#fff",
                align: "center"
              }
            }
          }
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: "100",
                cursor: "default",
                name: "nodata",
                tooltip: {
                  show: false
                },
                hoverAnimation: false,
                label: {
                  normal: {
                    textStyle: {
                      color: "#000000",
                      fontSize: "18",
                      bold: "bold"
                    },
                    formatter: "暂无数据"
                  }
                },
                itemStyle: {
                  normal: {
                    color: "#F2AE50"
                  },
                  emphasis: {
                    color: "#F2AE50"
                  }
                }
              }
            ]
          }
        ]
      };
      endProvinceChart.setOption(option);
    } else {
      var endProvinceDiv = document.getElementById("endProvinceChart");
      var endProvinceChart = echarts.init(
        document.getElementById("endProvinceChart")
      );
      endProvinceChart.resize(
        endProvinceDiv.offsetWidth,
        endProvinceDiv.offsetHeight
      );
      window.addEventListener("resize", function() {
        endProvinceChart.resize();
      });
      var endProvince = [];
      endProviceData.forEach(item => {
        endProvince.push(item.name);
      });
      var optionT = {
        title: {
          text: `{a|送达省份占比}  {b|${this.currentYear}}`,
          x: "left",
          y: "1%",
          textStyle: {
            rich: {
              a: {
                fontSize: 18,
                fontWeight: 800
              },
              b: {
                backgroundColor: "#3AB9E9",
                width: 40,
                height: 18,
                color: "#fff",
                align: "center"
              }
            }
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function(e) {
            var eVal = e.name;
            eVal +=
              "：" +
              e.data.value +
              "%" +
              "<br />" +
              "订单量：" +
              e.data.value1 +
              "笔";
            return eVal;
          }
        },
        legend: {
          bottom: 5,
          x: "center",
          data: endProvince,
          icon: "circle"
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["36%", "66%"],
            center: ["50%", "45%"],
            minAngle: 3,
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#F2AE50",
                    "#F17E7D",
                    "#6CACF4",
                    "#F07DC7",
                    "#04D2EB",
                    "#5396FF",
                    "#EB595A",
                    "#50E3C2",
                    "#FFEF21",
                    "#909DEF",
                    "#64C843"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            },
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: endProviceData
          }
        ]
      };
      endProvinceChart.setOption(optionT);
    }
  };

  /**
   * 常用车辆占比
   */
  getCommonCar = function(commonCarData) {
    if (commonCarData.length == 0) {
      var commonCarDiv = document.getElementById("commonCarChart");
      var commonCarChart = echarts.init(
        document.getElementById("commonCarChart")
      );
      commonCarChart.resize(
        commonCarDiv.offsetWidth,
        commonCarDiv.offsetHeight
      );
      window.addEventListener("resize", function() {
        commonCarChart.resize();
      });
      commonCarChart.setOption({
        title: {
          text: `{a|常用车辆占比}  {b|${this.currentYear}}`,
          x: "left",
          y: "1%",
          textStyle: {
            rich: {
              a: {
                fontSize: 18,
                fontWeight: 800
              },
              b: {
                backgroundColor: "#3AB9E9",
                width: 40,
                height: 18,
                color: "#fff",
                align: "center"
              }
            }
          }
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: "100",
                name: "nodata",
                cursor: "default",
                tooltip: {
                  show: false
                },
                hoverAnimation: false,
                label: {
                  normal: {
                    textStyle: {
                      color: "#000000",
                      fontSize: "18",
                      bold: "bold"
                    },
                    formatter: "暂无数据"
                  }
                },
                itemStyle: {
                  normal: {
                    color: "#F07DC7"
                  },
                  emphasis: {
                    color: "#F07DC7"
                  }
                }
              }
            ]
          }
        ]
      });
    } else {
      var commonCarDiv = document.getElementById("commonCarChart");
      var commonCarChart = echarts.init(
        document.getElementById("commonCarChart")
      );
      commonCarChart.resize(
        commonCarDiv.offsetWidth,
        commonCarDiv.offsetHeight
      );
      window.addEventListener("resize", function() {
        commonCarChart.resize();
      });
      var commonCar = [];
      commonCarData.forEach(item => {
        if (item.name.indexOf("（") || item.name.indexOf("）")) {
          item.name = item.name.replace(/（/g, "(");
          item.name = item.name.replace(/）/g, ")");
        }
        commonCar.push(item.name);
      });
      commonCarChart.setOption({
        title: {
          text: `{a|常用车辆占比}  {b|${this.currentYear}}`,
          x: "left",
          y: "1%",
          textStyle: {
            rich: {
              a: {
                fontSize: 18,
                fontWeight: 800
              },
              b: {
                backgroundColor: "#3AB9E9",
                width: 40,
                height: 18,
                color: "#fff",
                align: "center"
              }
            }
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function(e) {
            var eVal = e.name;
            eVal +=
              "：" +
              e.data.value +
              "%" +
              "<br />" +
              "订单量：" +
              e.data.value1 +
              "笔";
            return eVal;
          }
        },
        legend: {
          bottom: 5,
          x: "center",
          data: commonCar,
          icon: "circle"
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["36%", "66%"],
            center: ["50%", "45%"],
            minAngle: 3,
            avoidLabelOverlap: false,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#F07DC7",
                    "#04D2EB",
                    "#5396FF",
                    "#EB595A",
                    "#F2AE50",
                    "#F17E7D"
                  ];
                  return colorList[params.dataIndex];
                }
              }
            },
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "18",
                  fontWeight: "bold"
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
  };

  /**成本分析 */
  //物流费用波动
  logisticsCostRange = function(Number, Month) {
    var logisticsCostRangessDiv = document.getElementById(
      "logisticsCostRangess"
    );
    var logisticsCostRangess = echarts.init(
      document.getElementById("logisticsCostRangess")
    );
    logisticsCostRangess.resize(
      logisticsCostRangessDiv.offsetWidth,
      logisticsCostRangessDiv.offsetHeight
    );
    window.addEventListener("resize", function() {
      logisticsCostRangess.resize();
    });
    var option_logisticsCostRange = {
      title: {
        text: "物流费用波动"
      },
      tooltip: {
        trigger: "axis",
        formatter: function(e) {
          var eVal = e[0].name;
          for (var i = 0; i < e.length; i++) {
            eVal += "<br />" + e[i].seriesName + "：" + e[i].value + "元";
          }
          return eVal;
        }
      },
      color: ["#04D2EB"],
      legend: {
        x: "right",
        data: [
          {
            name: "物流费用波动",
            icon: "circle"
          }
        ]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        axisTick: { show: false },
        data: Month
      },
      yAxis: [
        {
          name: "单位：元",
          splitLine: { show: false }
        }
      ],
      series: [
        {
          showAllSymbol: true,
          showSymbol: false,
          name: "物流费用波动",
          type: "line",
          itemStyle: {
            normal: {
              lineStyle: {
                color: "#04D2EB",
                width: 3
              }
            }
          },
          data: Number
        }
      ]
    };
    logisticsCostRangess.setOption(option_logisticsCostRange, true);
  };

  //线路成本比例
  lineCostRata = function(lineData) {
    if (lineData.length == 0) {
      var lineCostNodataDiv = document.getElementById("lineCost");
      var lineCostNodata = echarts.init(document.getElementById("lineCost"));
      lineCostNodata.resize(
        lineCostNodataDiv.offsetWidth,
        lineCostNodataDiv.offsetHeight
      );
      window.addEventListener("resize", function() {
        lineCostNodata.resize();
      });
      var option_lineCostNodata = {
        title: {
          text: "线路成本占比",
          x: "left",
          y: "2%"
        },
        tooltip: {},
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["40%", "70%"],
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: "100",
                name: "nodata",
                cursor: "default",
                tooltip: {
                  show: false
                },
                hoverAnimation: false,
                label: {
                  normal: {
                    textStyle: {
                      color: "#000000",
                      fontSize: "16",
                      fontWeight: "bold"
                    },
                    formatter: "暂无数据"
                  }
                },
                itemStyle: {
                  normal: {
                    color: "#FFFFFF"
                  },
                  emphasis: {
                    color: "#FFFFFF"
                  }
                }
              }
            ]
          }
        ]
      };
      lineCostNodata.setOption(option_lineCostNodata);
    } else {
      var lineCostDiv = document.getElementById("lineCost");
      var lineCost = echarts.init(document.getElementById("lineCost"));
      lineCost.resize(lineCostDiv.offsetWidth, lineCostDiv.offsetHeight);
      window.addEventListener("resize", function() {
        lineCost.resize();
      });
      var lineprovinceCity = [];
      lineData.forEach(item => {
        lineprovinceCity.push(item.name);
      });
      lineprovinceCity = lineprovinceCity.reverse();
      var lineprovincevalue = [];
      lineData.forEach(item => {
        lineprovincevalue.push(item.value);
      });
      lineprovincevalue = lineprovincevalue.reverse();
      var option_lineCost = {
        title: {
          text: "线路成本占比"
        },
        tooltip: {
          show: false
        },
        grid: {
          left: "3%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          splitLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false }
        },
        yAxis: {
          type: "category",
          data: lineprovinceCity,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: {
            margin: 30,
            textStyle: {
              fontSize: 14
            }
          }
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
            type: "bar",
            barMaxWidth: 25,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9",
                    "#3AB9E9"
                  ];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true,
                  position: "right",
                  textStyle: {
                    color: "#000000",
                    fontSize: "12"
                  },
                  formatter: "{c}%"
                }
              }
            },
            data: lineprovincevalue
          }
        ]
        // color: ['#04D2EB','#F07DC7','#6CACF4','#F17E7D','#F2AE50','#64C843','#909DEF','#FFEF21','#50E3C2','#EB595A','#5396FF'],
      };
      lineCost.setOption(option_lineCost);
    }
  };
  //费用类型比例
  contTitleRata = function(costTitle) {
    if (costTitle.length == 0) {
      var lineCostNodataDiv = document.getElementById("costType");
      var costTypeNodata = echarts.init(document.getElementById("costType"));
      costTypeNodata.resize(
        lineCostNodataDiv.offsetWidth,
        lineCostNodataDiv.offsetHeight
      );
      window.addEventListener("resize", function() {
        costTypeNodata.resize();
      });
      var option_costTypeNodata = {
        title: {
          text: "费用类型占比",
          x: "left",
          y: "2%"
        },
        tooltip: {},
        series: [
          {
            type: "pie",
            center: ["50%", "50%"],
            radius: ["40%", "70%"],
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: "100",
                name: "nodata",
                cursor: "default",
                tooltip: {
                  show: false
                },
                hoverAnimation: false,
                label: {
                  normal: {
                    textStyle: {
                      fontSize: "16",
                      fontWeight: "bold"
                    },
                    formatter: "暂无数据"
                  }
                }
              }
            ],
            color: [
              "#04D2EB",
              "#F07DC7",
              "#6CACF4",
              "#F17E7D",
              "#F2AE50",
              "#64C843",
              "#909DEF",
              "#FFEF21",
              "#50E3C2",
              "#EB595A",
              "#5396FF"
            ]
          }
        ]
      };
      costTypeNodata.setOption(option_costTypeNodata);
    } else {
      var costTypeDiv = document.getElementById("costType");
      var costType = echarts.init(document.getElementById("costType"));
      costType.resize(costTypeDiv.offsetWidth, costTypeDiv.offsetHeight);
      window.addEventListener("resize", function() {
        costType.resize();
      });
      var costTitledata = [];
      costTitle.forEach(item => {
        costTitledata.push(item.name);
      });
      var option_costType = {
        title: {
          text: "费用类型占比",
          x: "left",
          y: "2%",
          textAlign: "left"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}%"
        },
        legend: {
          // x: 'right',
          // orient: 'vertical',
          data: costTitledata,
          // itemWidth:15,
          // itemHeight:15,
          bottom: 10,
          x: "center",
          icon: "circle"
          // padding:10,
        },
        series: [
          {
            name: "费用类型占比",
            type: "pie",
            minAngle: 5,
            center: ["50%", "48%"],
            radius: ["36%", "66%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: costTitle
          }
        ],
        color: [
          "#04D2EB",
          "#F07DC7",
          "#6CACF4",
          "#F17E7D",
          "#F2AE50",
          "#64C843",
          "#909DEF",
          "#FFEF21",
          "#50E3C2",
          "#EB595A",
          "#5396FF"
        ]
      };
      costType.setOption(option_costType);
    }
  };
  // 线路价格波动
  totalCostRangeData = function(linecosttotal, linecostprovinceCity) {
    var totalCostRangeDiv = document.getElementById("totalCostRange");
    var totalCostRange = echarts.init(
      document.getElementById("totalCostRange")
    );
    totalCostRange.resize(
      totalCostRangeDiv.offsetWidth,
      totalCostRangeDiv.offsetHeight
    );
    window.addEventListener("resize", function() {
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
    linecosttotal.forEach((item, index) => {
      switch (index) {
        case 0:
          linecosttotal[index].forEach(itemC => {
            linecostmonth.push(itemC.month);
            datapriceAA.push(itemC.price);
          });
          break;
        case 1:
          linecosttotal[index].forEach(itemC => {
            datapriceBB.push(itemC.price);
          });
          break;
        case 2:
          linecosttotal[index].forEach(itemC => {
            datapriceCC.push(itemC.price);
          });
          break;
        case 3:
          linecosttotal[index].forEach(itemC => {
            datapriceDD.push(itemC.price);
          });
          break;
        case 4:
          linecosttotal[index].forEach(itemC => {
            datapriceEE.push(itemC.price);
          });
          break;
      }
    });
    var option_totalCostRange = {
      title: {
        text: "线路总费用波动"
      },
      tooltip: {
        trigger: "axis",
        formatter: function(params) {
          var relVal = params[0].name;
          for (var i = 0, l = params.length; i < l; i++) {
            relVal +=
              "<br/>" + params[i].seriesName + " : " + params[i].value + "元";
          }
          return relVal;
        }
      },
      legend: {
        x: "right",
        right: "4%",
        left: "30%",
        icon: "circle",
        data: linecostprovinceCity
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: linecostmonth
      },
      yAxis: [
        {
          name: "单位：元",
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: linecostprovinceCity[0],
          type: "line",
          data: datapriceAA,
          showAllSymbol: true,
          showSymbol: false
        },
        {
          name: linecostprovinceCity[1],
          type: "line",
          data: datapriceBB,
          showAllSymbol: true,
          showSymbol: false
        },
        {
          name: linecostprovinceCity[2],
          type: "line",
          data: datapriceCC,
          showAllSymbol: true,
          showSymbol: false
        },
        {
          name: linecostprovinceCity[3],
          type: "line",
          data: datapriceDD,
          showAllSymbol: true,
          showSymbol: false
        },
        {
          name: linecostprovinceCity[4],
          type: "line",
          data: datapriceEE,
          showAllSymbol: true,
          showSymbol: false
        }
      ],
      color: [
        "#04D2EB",
        "#F07DC7",
        "#6CACF4",
        "#F17E7D",
        "#F2AE50",
        "#64C843",
        "#909DEF",
        "#FFEF21",
        "#50E3C2",
        "#EB595A",
        "#5396FF"
      ]
    };
    totalCostRange.setOption(option_totalCostRange);
  };

  /**质量分析 */
  /**
   * 准时发出率数据处理
   */
  dealDeliveryData(deliveryData) {
    var deliveryD = [];
    deliveryData.forEach(itemD => {
      deliveryD.push(itemD.valueR);
    });
    return deliveryD;
  }
  /**
   * 准时出发率数据处理
   */
  dealArrivalData(arrivalData) {
    var arrivalD = [];
    arrivalData.forEach(itemA => {
      arrivalD.push(itemA.valueR);
    });
    return arrivalD;
  }
  /**
   * 运输时效分析
   */
  getRate = function(x, deliveryData, arrivalData) {
    var myChartDiv = document.getElementById("qualitywave");
    var myChart = echarts.init(document.getElementById("qualitywave"));
    myChart.resize(myChartDiv.offsetWidth, myChartDiv.offsetHeight);
    window.addEventListener("resize", function() {
      myChart.resize();
    });
    var option = {
      backgroundColor: "white",
      title: {
        text: "运输时效分析",
        left: "3%"
      },
      tooltip: {
        trigger: "axis",
        formatter: function(e) {
          var eVal = e[0].name;
          for (var i = 0; i < e.length; i++) {
            if (e[i].seriesName == "准时发出率") {
              eVal +=
                "<br />" +
                e[i].seriesName +
                "：" +
                deliveryData[e[i].dataIndex].valueR +
                "%，" +
                "运单量：" +
                deliveryData[e[i].dataIndex].valueN +
                "笔";
            } else if (e[i].seriesName == "准时到达率") {
              eVal +=
                "<br />" +
                e[i].seriesName +
                "：" +
                arrivalData[e[i].dataIndex].valueR +
                "%，" +
                "运单量：" +
                arrivalData[e[i].dataIndex].valueN +
                "笔";
            }
          }
          return eVal;
        }
      },
      color: ["#6650FB", "#0DC6C8"],
      legend: {
        right: "5%",
        top: "3%",
        data: [
          {
            name: "准时发出率",
            icon: "circle"
          },
          {
            name: "准时到达率",
            icon: "circle"
          }
        ]
      },
      grid: {
        left: "6%",
        right: "7%",
        bottom: "6%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: x,
        axisTick: {
          show: false
        },
        axisLabel: {
          margin: 15,
          color: "#000000"
        },
        axisLine: {
          lineStyle: {
            color: "#000000"
          }
        }
      },
      yAxis: {
        name: "单位：%",
        boundaryGap: true,
        type: "value",
        max: "100",
        min: "0",
        splitNumber: "11",
        minInterval: 1,
        axisTick: {
          show: false
        },
        axisLabel: {
          margin: 10,
          color: "#000000"
        },
        axisLine: {
          lineStyle: {
            color: "#000000"
          }
        }
      },
      series: [
        {
          name: "准时发出率",
          showAllSymbol: true,
          showSymbol: false,
          type: "line",
          stack: "百分比1",
          itemStyle: {
            normal: {
              lineStyle: {
                color: "#6650FB"
              }
            }
          },
          data: this.dealArrivalData(deliveryData)
        },
        {
          name: "准时到达率",
          showAllSymbol: true,
          showSymbol: false,
          type: "line",
          stack: "百分比2",
          itemStyle: {
            normal: {
              lineStyle: {
                color: "#0DC6C8"
              }
            }
          },
          data: this.dealArrivalData(arrivalData)
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  };

  /**
   * 准时派车率数据处理
   */
  dealSendCar(sendCar) {
    var sendCarD = [];
    sendCar.forEach(itemD => {
      sendCarD.push(itemD.valueR);
    });
    return sendCarD;
  }
  /**
   * 准时到场率数据处理
   */
  dealPresentOn(presentOn) {
    var presentOnD = [];
    presentOn.forEach(itemA => {
      presentOnD.push(itemA.valueR);
    });
    return presentOnD;
  }
  /**
   * 响应时效分析
   */
  getresponseAgingRate = function(x, sendCar, presentOn) {
    var myChartDiv = document.getElementById("responseAging");
    var myChart = echarts.init(document.getElementById("responseAging"));
    myChart.resize(myChartDiv.offsetWidth, myChartDiv.offsetHeight);
    window.addEventListener("resize", function() {
      myChart.resize();
    });
    var option = {
      backgroundColor: "white",
      title: {
        text: "响应时效分析",
        left: "3%"
      },
      tooltip: {
        trigger: "axis",
        formatter: function(e) {
          var eVal = e[0].name;
          for (var i = 0; i < e.length; i++) {
            if (e[i].seriesName == "准时派车率") {
              eVal +=
                "<br />" +
                e[i].seriesName +
                "：" +
                sendCar[e[i].dataIndex].valueR +
                "%，" +
                "运单量：" +
                sendCar[e[i].dataIndex].valueN +
                "笔";
            } else if (e[i].seriesName == "准时到场率") {
              eVal +=
                "<br />" +
                e[i].seriesName +
                "：" +
                presentOn[e[i].dataIndex].valueR +
                "%，" +
                "运单量：" +
                presentOn[e[i].dataIndex].valueN +
                "笔";
            }
          }
          return eVal;
        }
      },
      color: ["#EB595A", "#3AB9E9"],
      legend: {
        right: "5%",
        top: "3%",
        data: [
          {
            name: "准时派车率",
            icon: "circle"
          },
          {
            name: "准时到场率",
            icon: "circle"
          }
        ]
      },
      grid: {
        left: "6%",
        right: "7%",
        bottom: "6%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: x,
        axisTick: {
          show: false
        },
        axisLabel: {
          margin: 15,
          color: "#000000"
        },
        axisLine: {
          lineStyle: {
            color: "#000000"
          }
        }
      },
      yAxis: {
        name: "单位：%",
        boundaryGap: true,
        type: "value",
        max: "100",
        min: "0",
        splitNumber: "11",
        minInterval: 1,
        axisTick: {
          show: false
        },
        axisLabel: {
          margin: 10,
          color: "#000000"
        },
        axisLine: {
          lineStyle: {
            color: "#000000"
          }
        }
      },
      series: [
        {
          name: "准时派车率",
          showAllSymbol: true,
          showSymbol: false,
          type: "line",
          stack: "百分比1",
          itemStyle: {
            normal: {
              lineStyle: {
                color: "#EB595A"
              }
            }
          },
          data: this.dealSendCar(sendCar)
        },
        {
          name: "准时到场率",
          showAllSymbol: true,
          showSymbol: false,
          type: "line",
          stack: "百分比2",
          itemStyle: {
            normal: {
              lineStyle: {
                color: "#3AB9E9"
              }
            }
          },
          data: this.dealPresentOn(presentOn)
        }
      ]
    };
    myChart.setOption(option);
  };
}