import { VueComponent, Prop, Watch } from 'vue-typescript'
import { aliupload } from '../../service/OssUploadService';
//import '../../img/menu-erweima.png';
//import '../../img/menu-erweima2.png';
//import '../../img/menu-modalFeedBack.png';
//import '../../img/menu-modalFeedBack2.png';
//import '../../img/csp-erweima.jpg';
//import '../../img/menu-erweima2.png';
import { dataService } from '../../service/dataService';

declare var $:any;

var VueTables = require('vue-tables');
var moment = require('moment');
Vue.use(VueTables.client,{
    filterable:false,
    compileTemplates:true,
});

@VueComponent({
    template: require('./feedback.html'),
    style:require('./feedback.scss')
})

export class feedback extends Vue{
    // 新增反馈
    /* 标题 */
    modalTitle:string = "";
    /* 内容 */
    modalContent:string = "";
    /* 意见反馈图片 */
    feedBackPicList = [];
    /* 提交反馈图片列表 */
    submitFeedBackPicList = [];
    //历史反馈
    /* 历史反馈列表 */
    historyFeedbackList = [];
    /* 历史反馈内容 */
    historyFeedbackContent = [];
    /* 模态框图片路径 */
    picPath:string="";
    /* 当前图片旋转角度 */
    // currentDeg:number = null;
    isAdmin="";

    ready(){
        this.isAdmin=sessionStorage.getItem("isAdmin");
        this.submitFeedBackPicList.splice(0,this.submitFeedBackPicList.length);
        this.historyFeedbackList = [];
        $('#feedbackModal').on('show.bs.modal', ()=> {
            $('#feedBack_w').removeClass("feedBack");
            $('#feedBack_w').addClass("feedBack2");
            $('#goAddfeedback').addClass('active');
            $('#addFeedback').addClass('active');
            document.getElementById('feedbackModal_footer').style.display = "block";
            $('#goMyfeedback').removeClass('active');
            $('#myFeedBack').removeClass('active');
            this.feedBackPicList = [];
            document.getElementById('title-count').innerHTML = this.modalTitle.length.toString();
            document.getElementById('text-count').innerHTML = this.modalContent.length.toString();
            this.submitFeedBackPicList.splice(0,this.submitFeedBackPicList.length);
            $('#opinionFeed_loaderSelect').removeAttr("disabled");
            document.getElementById('upLoader_num').innerHTML = this.feedBackPicList.length.toString();
        });
        $('#feedbackModal').on('hide.bs.modal', ()=> {
            $('#feedBack_w').removeClass("feedBack2");
            $('#feedBack_w').addClass("feedBack");
        });
        /* 二维码 */
        $('.qRcode').click(function(){
            $('.erweima').toggle();
            $(this).toggleClass('qRcode2');
        });
    }

    /* 图片列表 */
    imageColumns =['name','size','rate','state','operation'];
    imageOptions= {
        texts:{
            noResults:'',
        },
        headings:{
            name:"名称",
            size:"大小",
            rate:"进度",
            state:"状态",
            operation:'操作'
        },
        templates: {
            name: (row)=>{
                return `<div style="width:150px;">${row.name}</div>`
            },
            size:(row)=>{
                var size = (row.size/1024/1024).toFixed(2);
                return `<div>${size} MB</div>`;
            },
            rate:(row)=>{
                var rateTemple = `<div class="progress"><div class="progress-bar progress-bar-uploadFile progress-bar-success" id='${row.id}progressBar' role="progressbar"></div></div>`;
                if(this.submitFeedBackPicList.length>0){
                    if(this.submitFeedBackPicList.filter(t=>t.id==row.id).length>0){
                        if(this.submitFeedBackPicList.filter(t=>t.id==row.id)[0].submitUrl){
                            return `<div class="progress"><div class="progress-bar progress-bar-uploadFile progress-bar-success" id='${row.id}progressBar' role="progressbar" style="width:100.00%"></div></div>`;
                        }
                    }else{
                        return rateTemple;
                    }
                }else{
                    return rateTemple;
                }
            },
            state:(row)=>{
                var stateTemple = `<span class='glyphicon glyphicon-remove text-danger' id="${row.id}"  title='状态显示'></span>`;
                if(this.submitFeedBackPicList.length>0){
                    if(this.submitFeedBackPicList.filter(t=>t.id==row.id).length>0){
                        if(this.submitFeedBackPicList.filter(t=>t.id==row.id)[0].submitUrl){
                            return `<span class='glyphicon glyphicon-ok text-success' id="${row.id}"  title='状态显示'></span>`;
                        }
                    }else{
                        return stateTemple;
                    }
                }else{
                    return stateTemple;
                }
            },
            operation: (row)=> {
                var oprationTemple =`<button type="button" id="${row.id}uploadDisabledStatus" class="btn btn-success btn-xs" @click='$parent.uploadImage(${row.id})' >
                        <span class="glyphicon glyphicon-upload"></span> 上传</button>
                        <button type="button" class="btn btn-danger btn-xs" @click='$parent.deleteImage(${row.id})'>
                        <span class="glyphicon glyphicon-trash"></span> 删除</button>`
                if(this.submitFeedBackPicList.length>0){
                    if(this.submitFeedBackPicList.filter(t=>t.id==row.id).length>0){
                        if(this.submitFeedBackPicList.filter(t=>t.id == row.id)[0].submitUrl){
                            return `<button type="button" id="${row.id}uploadDisabledStatus" class="btn btn-success btn-xs" @click='$parent.uploadImage(${row.id})' disabled="disabled">
                                    <span class="glyphicon glyphicon-upload"></span> 上传</button>
                                    <button type="button" class="btn btn-danger btn-xs" @click='$parent.deleteImage(${row.id})'>
                                    <span class="glyphicon glyphicon-trash"></span> 删除</button>`
                        }
                    }else{
                        return oprationTemple;
                    }
                }else{
                    return oprationTemple;
                }
            },
        },
    };

    /* 获取数据 */
    loadData(){
        this.historyFeedbackList = [];
        dataService().feedback.GetOpinionList("0",0,-1).then((res)=>{
            if(res){
                this.historyFeedbackList = res;
            }
        });
    }

    /* 清除反馈新增内容 */
    clearAddfeedback = function(){
        this.modalTitle = "";
        this.modalContent = "";
        this.feedBackPicList = [];
    }

    /* 获取标题字数 */
    checkTitleNum = function(){
        document.getElementById('title-count').innerHTML = this.modalTitle.length;
    }

    /* 获取内容字数 */
    checkMaxInput = function(){
        document.getElementById('text-count').innerHTML = this.modalContent.length;
    }

    /* 文件计数 */
    checkFileNum = function(){
        if(this.feedBackPicList.length <= 3){
            document.getElementById('upLoader_num').innerHTML = this.feedBackPicList.length;
            if(this.feedBackPicList.length == 3){
                $('#opinionFeed_loaderSelect').attr('disabled', 'disabled');
            }else{
                $('#opinionFeed_loaderSelect').removeAttr("disabled");
            }
        }
    }

    /* 选择文件 */
    fileChange=function(e) {
        var files = e.target.files;
        if (files.length > 0) {
            for(var i=0;i<files.length;i++){
                var imageName=Math.round(Math.random() * 10000).toString();
                var objUrl = this.getObjectURL(files[i]);;
                files[i].id=imageName;
                files[i].path=objUrl;
                this.feedBackPicList.push(files[i]);
            }
        }
        $("#upLoader").val("");
        this.checkFileNum();
    }

    /* 删除文件 */
    deleteImage=function(index){
        var itemDel = this.feedBackPicList.filter(t => t.id == index);
        var itemSubDel = this.submitFeedBackPicList.filter(t => t.id == index);
        this.feedBackPicList.$remove(itemDel[0]);
        // $('#feedback_table').bootstrapTable('load', this.feedBackPicList);
        this.submitFeedBackPicList.$remove(itemSubDel[0]);
        this.checkFileNum();
    }
    
    /* 上传文件 */
    uploadImage=function(id){
        var uploadDisabledStatus = $("#"+id+'uploadDisabledStatus').attr('disabled');
        if(uploadDisabledStatus!=='disabled'){
            var submitUrl='';
            var itemUpload =this.feedBackPicList.filter(t => t.id == id);
            var today = new Date();
            var formatDate=moment().format('YYYYMMDDHHmm');
            var rr = itemUpload[0].name.indexOf(".");
            var nameimg = formatDate + Math.round(Math.random() * 10000).toString() + itemUpload[0].name.substring(rr);
            $("#" + itemUpload[0].id + 'uploadDisabledStatus').attr('disabled', 'disabled');
            aliupload().upload(itemUpload[0], nameimg, (res) => {
                if (res.res.statusCode == "200") {
                    var imageUriSubmit = res.res.requestUrls[0].split('?')[0];
                    itemUpload[0].fileName = nameimg;
                    itemUpload[0].submitUrl = imageUriSubmit;
                    $("#" + itemUpload[0].id + 'progressBar').attr({ style: "width:" + "100" + '%' });
                    $("#" + itemUpload[0].id).attr("class", "glyphicon glyphicon-ok text-success");
                    this.submitFeedBackPicList.push(itemUpload[0]);
                }else{
                    $("#" + itemUpload[0].id + 'uploadDisabledStatus').removeAttr("disabled");
                }
            });
        }
    }

    //建立一個可存取到该file的url
    getObjectURL=(file)=> {
        var urlImg = null;
        if (window.URL != undefined) {
            urlImg = window.URL.createObjectURL(file);
        } 
        return urlImg;
    }

    /* 提交反馈 */
    confirm = function(){
        if(this.modalTitle == ""){
            bootbox.alert({
                title: "",
                message: "请输入反馈问题的标题",
                className:"modal-C"
            });
            return;
        }else if(this.modalContent == ""){
            bootbox.alert({
                title: "",
                message: "请补充详细的问题描述和建议",
                className:"modal-C"
            });
            return;
        }
        var submitImageFiles = [];
        this.submitFeedBackPicList.forEach((item) => {
            submitImageFiles.push(
                {
                    "name": item.name,
                    "path": item.submitUrl,
                }
            )
        })
        var submitFeedback = {
            "title": this.modalTitle,
            "content": this.modalContent,
            "feedBackPlatform": 4,
            "attachment": submitImageFiles
        }
        dataService().feedback.AddOpinion(submitFeedback).then((res)=>{
            if(res.success){
                bootbox.alert({
                    title: "提交成功",  
                    message: "感谢您的反馈，我们将持续为您改进",
                    className:"modal-C",
                    callback: function() {
                        $("#feedbackModal").modal('hide');
                    },
                })
            }
        });
        
    }

    /* 新增反馈tab */
    changeAddfeedback = function(){
        document.getElementById('feedbackModal_footer').style.display = "block";
    }

    /* 历史反馈tab */
    changeMyfeedback = function(){
        document.getElementById('feedbackModal_footer').style.display = "none";
        this.loadData();
    }

    /* 显示 */
    showContent = function(index){
        $("#group"+ index).addClass("feedBackcolor");
        $("#showspread"+index).hide();
    }
    /* 隐藏 */
    hideContent = function(index){
        $("#group"+ index).removeClass("feedBackcolor");
        $("#showspread"+index).show();
    }

    /*点击并缩放图片*/
    bigPic = function(picFile){
        this.picPath = '';
        this.picPath = picFile.path;
        // this.currentDeg = 0;
        // document.getElementById('feedBack_img').style.transform = "rotate(0deg)";
        // this.bbImg();
    } 

    /* 图片旋转 */
    // changePicdeg = function(){
    //     if(this.currentDeg >= 360){
    //         this.currentDeg = 0;
    //     }
    //     this.currentDeg = this.currentDeg + 90 ;
    //     document.getElementById('feedBack_img').style.transform = "rotate(" + this.currentDeg + "deg)";
    // }
    /*图片放大缩小*/
    // bbImg = function(){
    //     var oImg=document.getElementById("feedBack_img");
    //     fnWheel(oImg,function (down,oEvent){
    //         var oldWidth=this.offsetWidth;
    //         var oldHeight=this.offsetHeight;
    //         var oldLeft=this.offsetLeft;
    //         var oldTop=this.offsetTop;

    //         var scaleX=(oEvent.clientX-oldLeft)/oldWidth;
    //         var scaleY=(oEvent.clientY-oldTop)/oldHeight;

    //         if (down){
    //             this.style.width=this.offsetWidth*0.9+"px";
    //             this.style.height=this.offsetHeight*0.9+"px";
    //         }
    //         else{
    //             this.style.width=this.offsetWidth*1.1+"px";
    //             this.style.height=this.offsetHeight*1.1+"px";
    //         }
    //         var newWidth=this.offsetWidth;
    //         var newHeight=this.offsetHeight;
    //         this.style.left=oldLeft-scaleX*(newWidth-oldWidth)+"px";
    //         this.style.top=oldTop-scaleY*(newHeight-oldHeight)+"px";
    //     });
    //     function fnWheel(obj,fncc){
    //         obj.onmousewheel = fn;
    //         if(obj.addEventListener){
    //             obj.addEventListener('DOMMouseScroll',fn,false);
    //         }
    //         function fn(ev){
    //             var oEvent = ev || window.event;
    //             var down = true;
    //             if(oEvent.detail){
    //                 down = oEvent.detail>0
    //             }else{
    //                 down = oEvent.wheelDelta<0
    //             }
    //             if(fncc){
    //                 fncc.call(this,down,oEvent);
    //             }
    //             if(oEvent.preventDefault){
    //                 oEvent.preventDefault();
    //             }
    //             return false;
    //         }
    //     }
    // }

    

}