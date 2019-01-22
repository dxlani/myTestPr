import { VueComponent } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'
import '../../img/plus.png';
import '../../img/fankui.png';
import '../../img/huifu.png';
declare var $: any;
Vue.use(VueRouter);

var router = new VueRouter();

@VueComponent({
    template: require('./wxFeedBackDetail.html'),
    style: require('./wxFeedBackDetail.scss')
})
export class wxFeedBackDetailComponent extends Vue {
    el: '#wxFeedBackDetail';
    /* 意见反馈id */
    id:String="";
    /* 提问title */
    title:String="";
    /* 提问内容 */
    content:String="";
    /* 提问时间 */
    creationTime:String="";
    /* 反馈图片 */
    attachments=[];
    /* 回复内容 */
    replyContent:String="";
    /* 回复时间 */
    replyTime:String="";
    ready () {
        this.title="";
        this.content="";
        this.creationTime="";
        this.attachments=[];
        this.replyContent="";
        this.replyTime="";
        this.id = this.$route.query.id;
        this.load(this.id);
        window.onresize = adjuest;
        adjuest();
        function adjuest(){
            var height= $('.imgGroup>.imggroup').css('width');
            $('.imggroup').height(height);
        }

        $('.imgGroup').on('click','img',function() {
            $('#ImgModal').show();
            var src = $(this).attr('src');
            $('#img01').attr('src', src);
        })
    }
    closeImg(){
        $('#ImgModal').hide();
    }
    load(id){
        dataService().feedback.GetOpinionDetail(id).then((res)=>{
            console.log(res);
            this.title=res.title;
            this.content=res.content;
            this.creationTime=res.creationTime;
            this.attachments=res.attachments;
            this.replyContent=res.replyContent;
            this.replyTime=res.replyTime;
        }).then(
            ()=>{
                var height= $('.imgGroup>.imggroup').css('width');
                $('.imggroup').height(height);
            }
        )
    }

   
}