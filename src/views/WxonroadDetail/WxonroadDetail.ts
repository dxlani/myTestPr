import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import '../../img/onRoadDetail_bg@3x.png';
import '../../img/onroadDetail.png';
import '../../img/onroadbox@2x.png';
import * as VueRouter from 'vue-router';
declare var $:any;
Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./WxonroadDetail.html'),
    style: require('./WxonroadDetail.scss')
})

export class WxonroadDetailComponent extends Vue{
    /* 当前位置(详细) */
    nowLocation:string="";
    /* 路线百分比 */
    roadPercent:number=null;
    /* 起点地址 */
    startAddress:string="";
    /* 起始时间 */
    startTime:string="";
    /* 中途地址 */
    onroadAddress:string="";
    /* 当前时间 */
    onroadTime:string="";
    /* 终点地址 */
    endAddress:string="";
    /* 订单id */
    id:string="";
    /* 订单编号 */
    orderId:string = "";
    /* 车牌号 */
    carCode:string = "";
    /* 车型 */
    carType:string = "";
    /* 车长 */
    carLength:string = "";
    /* 距离 */
    distance:string="";
    /* 预计到达时间 */
    exceptDeliveryTime="";
    myGeo;
    ready(){
        this.myGeo = new BMap.Geocoder();
        this.id = this.$route.query.id;
        this.orderId = this.$route.query.orderid;
        var canvas = document.querySelector("canvas");
        var context = canvas.getContext('2d');
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        this.nowLocation = "";
        this.startAddress = "";
        this.startTime = "";
        this.onroadAddress = "";
        this.onroadTime = "";
        this.endAddress = "";
        this.carCode = "";
        this.carType = "";
        this.carLength = "";
        this.distance = "";
        this.exceptDeliveryTime = "";
        this.roadPercent = 0;
        $('.hiddenBlock').hide();
        $.showLoading('定位中...');
        dataService().Order.getOnWayOrderDetail(this.id).then((res)=>{
            if(res.errorMessage){
                $.hideLoading();
                $.alert('定位失败，请重新再试！',function () {
                    router.go('./wechat/onroad');
               })
            }else{
                this.nowLocation = res.nowAddress;
                this.startAddress = res.originAddress;
                this.startTime = res.deliveryTime;
                this.onroadAddress = res.nowAddress;
                this.onroadTime = res.nowTime;
                this.endAddress = res.destinationAddress;
                this.carCode = res.carCode;
                this.carType = res.vehicleType;
                this.carLength = res.carLength;
                this.distance =res.residualDistance;
                this.exceptDeliveryTime=res.exceptDeliveryTime;
                /* 百分比 */
                this.roadPercent = res.orderProgress;
                $.hideLoading();
                $('.hiddenBlock').show();
            }
        }).then(()=>{
            // if(this.roadPercent){
                /* 起点坐标 */
                var startX = canvas.width*0.18;
                var startY = canvas.height*0.15;
                /* 控制点坐标 */
                var controlX = canvas.width*0.9;
                var controlY = canvas.height*0.48;
                /* 终点坐标 */
                var endX = canvas.width*0.6;
                var endY = canvas.height*0.72;
                if(this.roadPercent == 0){
                    context.beginPath();
                    context.strokeStyle = "#4B56AF";
                    context.lineWidth = 1;
                    context.moveTo(startX,startY);
                    context.lineTo(endX, endY);
                    context.closePath();
                    context.stroke();
                    /* 起点文字 */
                    context.fillStyle = '#4855B4';
                    context.font = "14px PingFangSC-Regular"; 
                    context.fillText(this.startAddress,startX-30,startY+30);
                    context.fillStyle = '#4855B4';
                    context.font = "12px PingFangSC-Regular"; 
                    context.fillText(this.startTime,startX-30,startY+48);
                    var draw = function(x, y, r, start, end, color, type) {
                        var unit = Math.PI / 180;
                        context.beginPath();
                        context.arc(x, y, r, start * unit, end * unit);
                        context[type + 'Style'] = color;
                        context.closePath();
                        context[type]();
                    }
                    draw(startX,startY,12,0,360,"#4B56AF","fill");
                    context.fillStyle = '#283060';
                    context.font = "14px PingFangSC-Regular"; 
                    context.fillText("起",startX-7,startY+5);
                    /* 终点文字 */
                    context.fillStyle = '#fff';
                    context.font = "14px PingFangSC-Regular"; 
                    context.fillText(this.endAddress,endX-25,endY+30);
                    draw(endX,endY,12,0,360,"#F9AB41","fill");
                    context.fillStyle = '#283060';
                    context.font = "14px PingFangSC-Regular"; 
                    context.fillText("终",endX-7,endY+5);
                }else if(this.roadPercent == 1){
                    /* 路线 */
                    context.beginPath();
                    context.strokeStyle = "#05A9EE";
                    context.setLineDash([4,6]);
                    context.lineWidth = 1;
                    context.moveTo(startX,startY);
                    context.lineTo(endX, endY);
                    context.closePath();
                    context.stroke();
                    /* 起点文字 */
                    context.fillStyle = '#4855B4';
                    context.font = "14px PingFangSC-Regular"; 
                    context.fillText(this.startAddress,startX-30,startY+30);
                    context.fillStyle = '#4855B4';
                    context.font = "12px PingFangSC-Regular"; 
                    context.fillText(this.startTime,startX-30,startY+48);
                    var draw = function(x, y, r, start, end, color, type) {
                        var unit = Math.PI / 180;
                        context.beginPath();
                        context.arc(x, y, r, start * unit, end * unit);
                        context[type + 'Style'] = color;
                        context.closePath();
                        context[type]();
                    }
                    draw(startX,startY,12,0,360,"#4B56AF","fill");
                    context.fillStyle = '#283060';
                    context.font = "14px PingFangSC-Regular"; 
                    context.fillText("起",startX-7,startY+5);
                    /* 提示文字 */
                    document.getElementById("tag1").style.left = (endX-82) +"px";
                    document.getElementById("tag1").style.top = (endY-70) +"px";
                    /* 终点文字 */
                    context.fillStyle = '#fff';
                    context.font = "14px PingFangSC-Regular"; 
                    context.fillText(this.endAddress,endX-25,endY+30);
                    draw(endX,endY,12,0,360,"#F9AB41","fill");
                    context.fillStyle = '#283060';
                    context.font = "14px PingFangSC-Regular"; 
                    context.fillText("终",endX-7,endY+5);
                }else{
                    if(this.roadPercent > 0 && this.roadPercent <= 0.5){
                        var i=0;
                        var timer=setInterval(()=>{
                            if(i<this.roadPercent){
                                context.clearRect(0,0,canvas.width,canvas.height);
                                i=i+0.03;
                                /* 贝塞尔曲线 */
                                context.beginPath();
                                context.moveTo(startX,startY);
                                context.quadraticCurveTo(controlX,controlY,endX,endY);
                                context.closePath();
                                var onroadX = Math.pow((1-i),2)*startX + 2*i*(1-i)*controlX + Math.pow(i,2)*endX;
                                var onroadY = Math.pow((1-i),2)*startY + 2*i*(1-i)*controlY + Math.pow(i,2)*endY;
                                /* 路线 */
                                context.beginPath();
                                context.lineWidth = 1;
                                context.setLineDash([]);
                                context.strokeStyle = "#4B56AF";
                                context.moveTo(startX,startY);
                                context.lineTo(onroadX, onroadY);
                                context.closePath();
                                context.stroke();
                                context.beginPath();
                                context.strokeStyle = "#05A9EE";
                                context.setLineDash([4,6]);
                                context.lineWidth = 1;
                                context.moveTo(onroadX, onroadY);
                                context.lineTo(endX, endY);
                                context.closePath();
                                context.stroke();
                                /* 起点文字 */
                                context.fillStyle = '#4855B4';
                                context.font = "14px PingFangSC-Regular"; 
                                context.fillText(this.startAddress,startX-30,startY+30);
                                context.fillStyle = '#4855B4';
                                context.font = "12px PingFangSC-Regular"; 
                                context.fillText(this.startTime,startX-30,startY+48);
                                var draw = function(x, y, r, start, end, color, type) {
                                    var unit = Math.PI / 180;
                                    context.beginPath();
                                    context.arc(x, y, r, start * unit, end * unit);
                                    context[type + 'Style'] = color;
                                    context.closePath();
                                    context[type]();
                                }
                                draw(startX,startY,12,0,360,"#4B56AF","fill");
                                context.fillStyle = '#283060';
                                context.font = "14px PingFangSC-Regular"; 
                                context.fillText("起",startX-7,startY+5);
                                /* 在途点（文字） */
                                context.fillStyle = '#04B8FE';
                                var onroadImg  = new Image();
                                onroadImg.src = "img/onroadDetail.png";
                                onroadImg.onload = function(){
                                    context.drawImage(onroadImg,onroadX-8, onroadY-8);
                                }
                                document.getElementById("tag0").style.left = (onroadX-80) +"px";
                                document.getElementById("tag0").style.top = (onroadY+18) +"px";
                    
                                /* 终点文字 */
                                context.fillStyle = '#fff';
                                context.font = "14px PingFangSC-Regular"; 
                                context.fillText(this.endAddress,endX-25,endY+30);
                                draw(endX,endY,12,0,360,"#F9AB41","fill");
                                context.fillStyle = '#283060';
                                context.font = "14px PingFangSC-Regular"; 
                                context.fillText("终",endX-7,endY+5);
                            }else{
                                clearInterval(timer)
                            }
                        }, 50);
                    }else{
                        var i=0;
                        var timer=setInterval(()=>{
                            if(i<this.roadPercent){
                                context.clearRect(0,0,canvas.width,canvas.height);
                                i=i+0.03;
                                /* 贝塞尔曲线 */
                                context.beginPath();
                                context.moveTo(startX,startY);
                                context.quadraticCurveTo(controlX,controlY,endX,endY);
                                context.closePath();
                                var onroadX = Math.pow((1-i),2)*startX + 2*i*(1-i)*controlX + Math.pow(i,2)*endX;
                                var onroadY = Math.pow((1-i),2)*startY + 2*i*(1-i)*controlY + Math.pow(i,2)*endY;
                                /* 路线 */
                                context.beginPath();
                                context.lineWidth = 1;
                                context.setLineDash([]);
                                context.strokeStyle = "#4B56AF";
                                context.moveTo(startX,startY);
                                context.lineTo(onroadX, onroadY);
                                context.closePath();
                                context.stroke();
                                context.beginPath();
                                context.strokeStyle = "#05A9EE";
                                context.setLineDash([4,6]);
                                context.lineWidth = 1;
                                context.moveTo(onroadX, onroadY);
                                context.lineTo(endX, endY);
                                context.closePath();
                                context.stroke();
                                /* 起点文字 */
                                context.fillStyle = '#4855B4';
                                context.font = "14px PingFangSC-Regular"; 
                                context.fillText(this.startAddress,startX-30,startY+30);
                                context.fillStyle = '#4855B4';
                                context.font = "12px PingFangSC-Regular"; 
                                context.fillText(this.startTime,startX-30,startY+48);
                                var draw = function(x, y, r, start, end, color, type) {
                                    var unit = Math.PI / 180;
                                    context.beginPath();
                                    context.arc(x, y, r, start * unit, end * unit);
                                    context[type + 'Style'] = color;
                                    context.closePath();
                                    context[type]();
                                }
                                draw(startX,startY,12,0,360,"#4B56AF","fill");
                                context.fillStyle = '#283060';
                                context.font = "14px PingFangSC-Regular"; 
                                context.fillText("起",startX-7,startY+5);
                                /* 在途点（文字） */
                                context.fillStyle = '#04B8FE';
                                // context.font = "14px PingFangSC-Regular"; 
                                // context.fillText(this.onroadAddress,onroadX-80, onroadY-6);
                                // context.font = "12px PingFangSC-Regular"; 
                                // context.fillText(this.onroadTime,onroadX-80, onroadY+12);
                                var onroadImg  = new Image();
                                onroadImg.src = "img/onroadDetail.png";
                                onroadImg.onload = function(){
                                    context.drawImage(onroadImg,onroadX-8, onroadY-8);
                                }
                                document.getElementById("tag").style.left = (onroadX-82) +"px";
                                document.getElementById("tag").style.top = (onroadY-70) +"px";
                    
                                /* 终点文字 */
                                context.fillStyle = '#fff';
                                context.font = "14px PingFangSC-Regular"; 
                                context.fillText(this.endAddress,endX-25,endY+30);
                                draw(endX,endY,12,0,360,"#F9AB41","fill");
                                context.fillStyle = '#283060';
                                context.font = "14px PingFangSC-Regular"; 
                                context.fillText("终",endX-7,endY+5);
                            }else{
                                clearInterval(timer)
                            }
                        }, 50);
                    }
                }
        })
        
     }
   
    /* 查看详情 */
    goOrderDetail = function(){
        router.go("/WxOrder/WxOrderManageDetail?id="+this.id);
    }

  
}