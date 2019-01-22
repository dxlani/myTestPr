import { VueComponent, Prop, Watch } from 'vue-typescript/lib'
import * as VueRouter from 'vue-router'
import { dataService } from '../../service/dataService'

declare var $: any;
declare var wx: any;
Vue.use(VueRouter);
var router = new VueRouter();
declare var event: any;
import '../../img/maikefeng.png';
import '../../img/keyboard.png';
import '../../img/mai.png';
import '../../img/microphoneBg.png';
import '../../img/whitemai.png';
import '../../img/bluecircle.png';
@VueComponent({
    template: require('./ai.html'),
    style: require('./ai.scss')
})

export class AiComponent extends Vue {
    el: '#aiHelper'
    /**
     * 对话内容（文字）
     */
    dialogue: string = "";
    /**
     * 初始化起点坐标
     */
    posStart: number = 0;
    /**
     * 初始化终点坐标
     */
    posEnd: number = 0;
    /**
     * 初始化滑动坐标
     */
    posMove: number = 0;
    /**
     * 发送语音图片元素
     */
    btnElem: any;
    /**
     * URL
     */
    URL: string = "";
    /**
     * 录音开始时间戳
     */
    startTime: number = null;
    /**
     * 录音结束时间戳
     */
    endTime: number = null;
    /**
     * 录音ID
     */
    localId: string = "";
    /**
     * 录音最短时间
     */
    minTime: number = null;
    /**
     * ai回复
     */
    aiReply: string = "";

    ready() {
        this.minTime = 2;
        $('#aiInputContent').blur(() => {
            // $('.sendMessage')
        })

        $('#aiInputContent').focus(() => {
            // $('.sendMessage')
        })
        var maiBgColor = document.getElementsByClassName("mai")[0];
        this.btnElem = document.getElementById("microphone");//获取大麦克风ID  
        maiBgColor.addEventListener("touchstart", () => {
            $('.mai').addClass('bgColor');
        }, false)
        maiBgColor.addEventListener("touchend", () => {
            $('.mai').removeClass('bgColor');
        }, false)
        var microphone = document.getElementById("microphone");
        microphone.addEventListener("touchstart", () => {
            event.preventDefault();
        }, false)
        microphone.addEventListener("touchend", () => {
            event.preventDefault();
        }, false)

        this.URL = ((window.location.href).split('#'))[0];
        dataService().wxsdk.signature(this.URL).then((res) => {
            wx.config({
                debug: false,
                appId: 'wx2ecc139213030129', // 必填，公众号的唯一标识
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.noncestr, // 必填，生成签名的随机串
                signature: res.signature,// 必填，签名，见附录1
                jsApiList: ['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(() => {
                this.initEvent();
            })
            wx.error(function(res){
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                alert(res);
            });
        }, function (err) {
            console.log(err)
        })
        // this.initEvent();
    }
    getKeyBoard() {
        $('.aiRecord').hide();
        $('.aiInput').show();
        $('.talkContent').css('bottom', '50px');
        document.getElementById('aiInputContent').focus();
        $('.talkContent').scrollTop(99999);
    }
    toMaikefeng() {
        this.dialogue = "";
        $('.aiInput').hide();
        $('.aiRecord').show();
        $('.talkContent').css('bottom', '170px');
        document.getElementById('aiInputContent').blur();
        $('.talkContent').scrollTop(99999);
    }
 
    /* 按住发送，滑动取消 */

    initEvent() {
        this.btnElem.addEventListener("touchstart", (event) => {
            console.log('start')
            event.preventDefault();
            $('.blueBg').fadeOut();
            $('#microphoneBg1').fadeIn();
            $('#microphoneBg').fadeIn();
            this.posStart = 0;
            this.posStart = event.touches[0].pageY;//获取起点坐标  
            //开始录音
            this.startTime = new Date().getTime();
            wx.startRecord();
        });
        this.btnElem.addEventListener("touchmove", (event) => {
            event.preventDefault();
            this.posMove=0;
            this.posMove = event.targetTouches[0].pageY;//获取滑动实时坐标 
            if (this.posStart - this.posMove < 60) {
               $('.sliderTip1').show();
               $('.sliderTip2').hide();
            }else{
                if (this.posStart - this.posMove > 60) {
                    $('.sliderTip1').hide();
                    $('.sliderTip2').show();
                 }
            }
        });
        this.btnElem.addEventListener("touchend", (event) => {
            event.preventDefault();
            $('.sliderTip1').hide();
            $('.sliderTip2').hide();
            $('.blueBg').fadeIn();
            $('#microphoneBg1').fadeOut();
            $('#microphoneBg').fadeOut();
            this.posEnd=0;
            this.posEnd = event.changedTouches[0].pageY;//获取终点坐标  
            if (this.posStart - this.posEnd <= 60) {
                console.log('结束录音，开始识别');
                //停止录音接口
                wx.stopRecord({
                    success: (res)=>{
                        this.endTime = new Date().getTime();
                        if ((this.endTime - this.startTime) / 1000 < this.minTime) {
                            this.localId = '';
                            alert(`语音时间少于${this.minTime}秒，请重新讲话`);
                        }else{
                            this.localId = res.localId;
                        // 识别音频
                        console.log('识别中...');
                        wx.translateVoice({
                            localId: this.localId, // 需要识别的音频的本地Id，由录音相关接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success:  (res)=> {
                                this.dialogue=res.translateResult;// 语音识别的结果
                                this.adddialogue(this.dialogue);
                                if(this.dialogue!==undefined){
                                    this.replydialogue(false);
                                }
                                
                            }
                            });
                        }
                    }
                });
            } else {
                console.log("终止录音，取消发送");
                wx.stopRecord({
                    success: function (res) {
                        this.localId = '';
                    }
                });
                this.localId = '';
            };
        });
    };
    wxSdk() {
        //ajax  
        console.log('Success');
    }

    sendMessage() {
        this.adddialogue(this.dialogue);
        this.replydialogue(false);
        document.getElementById('aiInputContent').focus();
        this.dialogue = "";
        document.getElementById('aiInputContent').focus();
    }

    adddialogue(content) {
       if(content==undefined){
           $('.sliderTip3').show();
            setTimeout(()=>{
                $('.sliderTip3').hide();
            },1000)
       }else{
        var MsgHtml = `<section class="question"><p>"${content}"</p></section>`;
        $('.dialogue').append(MsgHtml);
       }
        // document.getElementById("bottom").scrollIntoView(false); 
        $('.talkContent').scrollTop(99999);
        content="";
    }
    replydialogue(ai) {
       if(!ai){
        let aiReplay = `<section class="answer thinking"><p>"我在想..."</p></section>`;
        $('.dialogue').append(aiReplay);
        $('.talkContent').scrollTop(99999);
            setTimeout(()=>{
                $('.thinking').remove();
                let aiReplay = `<section  class="answer"><p>"抱歉，您的问题太难了，请拨打客服热线试试：<a href="tel:0511-86990000">0511-86990000</a>"</p></section>`;
                $('.dialogue').append(aiReplay);
            },1000)
       }else{
       
       }
    }
}


