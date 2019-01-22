import { VueComponent } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'
import { aliupload } from '../../service/OssUploadService';
import '../../img/plus.png';
import '../../img/fankui.png';
import '../../img/huifu.png';
import '../../img/redclose.png';
declare var $: any;
Vue.use(VueRouter);

var router = new VueRouter();

@VueComponent({
    template: require('./wxFeedBackAdd.html'),
    style: require('./wxFeedBackAdd.scss')
})
export class wxFeedBackAddComponent extends Vue {
    el: '#wxFeedBackAdd';

    /* 标题 */
    title: string = "";
    /* 内容 */
    content: string = "";
    /* 统计的字数1 */
    wordcount1: number = 0;
    /* 统计的字数2 */
    wordcount2: number = 0;

    /* 图片 */
    file;
    /* 图片名字 */
    imageName: string = "";
    /* 文件类型 */
    filetype = "";
    /* 图片 OSS路径 */
    imageUrl: string = "";


    /* 图片数量 */
    imageCount: number = 0;
    /* 图片数组 */
    imageslist = [];
    /* 上传内容 */
    obj={
        title: "",
        content:"",
        feedBackPlatform:"3",
        attachment: []
    }
    /* 监听字数定时任务 */
    timer:any;
    ready() {
        this.obj={
            title:"",
            content:"",
            feedBackPlatform:"3",
            attachment: []
        }
        this.imageslist=[];
        this.wordcount1=0;
        this.wordcount2=0;
        this.file = "";
        this.title = "";
        this.content = "";
        this.imageName = "";
        window.onresize = adjuest;
        adjuest();
        function adjuest() {
            var height = $('.weui-uploader__input-box').width();
            $('.setHeight').height(height);
        }

        $('.setHeight').on('click','#feedbackImg',function() {
            $('#ImgModal').show();
            var src = $(this).attr('src');
            $('#img01').attr('src', src);
        })
        this.timer=setInterval(()=>{  
            this.wordcount1 = this.title.length;
            this.wordcount2 = this.content.length;
            this.obj.title= this.title;
            this.obj.content=this.content;
        },100)  
    }
    closeImg(){
        $('#ImgModal').hide();
    }
    wordStatic1() {
        this.wordcount1 = this.title.length;
    }
    wordStatic2() {
        this.wordcount2 = this.content.length;
    }

    /* 上传图片 */
    fileChange(event) {
        this.file = event.target.files[0];
        if(this.file){
            // this.filetype = this.file.name.split(".").reverse()[0];
            this.imageName = this.file.name;
            aliupload().upload(this.file, this.imageName, (res) => {
                if (res.res.statusCode == "200") {
                    /**图片path */
                    this.imageUrl = res.res.requestUrls[0].split('?')[0];
                    this.obj.attachment.push(
                        { 'name': this.imageName,'path': this.imageUrl }
                    );
                    this.imageslist= this.obj.attachment;
                   
                } else {
                    $.alert('上传失败，请重新上传');
                }
            });
        }
    
    }
    /* 删除图片 */
    deleteImage(index) {
        this.obj.attachment.splice(index, 1);
        this.imageslist= this.obj.attachment;
    }
    /* 上传意见给后台 */
    submitFeedBack(){
        this.obj.title= this.title;
        this.obj.content=this.content;
        dataService().feedback.AddOpinion(this.obj).then((res)=>{
          if(res.success){
              clearInterval(this.timer);
            $.alert("提交成功！", function () {
                router.go("/wxFeedBack");
           });
          }else{
            $.alert('提交失败，请重新提交');
          }
        },function(rej){});
    }

}

