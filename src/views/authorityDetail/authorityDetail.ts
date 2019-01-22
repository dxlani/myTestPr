import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import * as VueRouter from 'vue-router'

@VueComponent({
    template: require('./authorityDetail.html'),
    style: require('./authorityDetail.scss')
})

export class AuthorityDetailComponent extends Vue {
    el:'#authorityDetail'
        
    /**
     * 子账户id
     */
    id:string="";
    /**
     * 操作类型
     */
    name:string="";
    /**
     * 详情标题
     */
    title:string="";
    /**
     * 页面元素显隐
     */
    showElemnt:boolean=false;
    /**
     * web端权限
     */
    weChatAuthorize:string="";
    weChatAuth=[];
   
    /**
     * 微信端权限
     */
    webAuthorize:string="";
    webAuth=[];
   

    /**创建时间  */
    creationTime:string="";
    /**用户组  */
    userGroup:string="";
    /**用户名  */
    userName:string="";
    /**密码  */
    password:string="";
    /**备注  */
    comments:string="";
    ready(){
        var userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.userGroup = userInfo ? userInfo.realName : "";
        this.id = this.$route.query.id;
        this.name = this.$route.query.name;
        if(this.name == "add"){
            this.title = "新增子账户";
            this.showElemnt=false;
            this.userName="";
            this.password="";
            this.comments="";
        }else if(this.name == "edit"){
            this.title = "编辑子账户";
            this.showElemnt=true;
              //详情接口
        dataService().User.getCspUserChildDetail(this.id).then((res)=>{
            this.comments=res.comments
            this.creationTime=res.creationTime
            this.password=res.password
            this.userName=res.userName
            this.weChatAuthorize=res.weChatAuthorize
            this.webAuthorize=res.webAuthorize

            this.weChatAuth=this.weChatAuthorize.split(',')
            this.webAuth=this.webAuthorize.split(',')

            this.weChatAuth.forEach(item=>{
                let i=Number(item)-1;
                $(`.wxCheckbox:eq(${i})`).attr("checked", 'checked');
            })
            this.webAuth.forEach(item=>{
                let i=Number(item)-1;
                $(`.webCheckbox:eq(${i})`).attr("checked", 'checked');
            })
        });
        }
    }


    /**
     * 新增
     */
    add(){
        //新增接口
         let  weChatChecked=[];
         let  webAuthChecked=[];
         $("input[name='webCheckbox']:checkbox:checked").each(function(){ 
            webAuthChecked.push($(this).val());
               }); 
         $("input[name='wxCheckbox']:checkbox:checked").each(function(){ 
             weChatChecked.push($(this).val());
               }); 
               if(webAuthChecked.length && weChatChecked.length && this.userName && this.password){
                bootbox.confirm('确定新增子账户吗？',sure=>{
                    if(sure){
                     dataService().User.addUserChild({
                         userName:this.userName,
                         password: this.password,
                         webAuthorize:webAuthChecked.join(","),
                         weChatAuthorize: weChatChecked.join(","),
                         comments:this.comments,
                        }).then((res)=>{
                         if(res.success){
                             this.$router.go('/app/authorityManage')
                         }else{
                            bootbox.alert(res.errorMessage)
                         }
                 });
                    }else {
                        return 
                    }
                })
               }else{
                bootbox.alert('请补全子账户信息')
               }
               
        
    }

    /**
     * 编辑
     */
    edit(){
        //编辑接口
        let  weChatChecked=[];
        let  webAuthChecked=[];
        $("input[name='webCheckbox']:checkbox:checked").each(function(){ 
           webAuthChecked.push($(this).val());
              }); 
        $("input[name='wxCheckbox']:checkbox:checked").each(function(){ 
            weChatChecked.push($(this).val());
              }); 
              if(webAuthChecked.length && weChatChecked.length && this.userName && this.password){
               bootbox.confirm('确定保存子账户信息吗？',sure=>{
                   if(sure){
                    dataService().User.updataUserChild({
                        id: this.id,
                        userName:this.userName,
                        password: this.password,
                        webAuthorize:webAuthChecked.join(","),
                        weChatAuthorize: weChatChecked.join(","),
                        comments:this.comments,
                       }).then((res)=>{
                        if(res.success){
                            this.$router.go('/app/authorityManage')
                        }else{
                            bootbox.alert(res.errorMessage)
                         }
                });
                   }else {
                       return 
                   }
               })
            }else{
                bootbox.alert('请补全子账户信息')
            }
     }
   
     /* 取消 */
     cancel(){
        this.$router.go('/app/authorityManage');
     }

}
