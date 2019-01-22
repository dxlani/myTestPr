import { VueComponent, Prop } from 'vue-typescript'
import { dataService } from '../../service/dataService'
import * as VueRouter from 'vue-router'

Vue.use(VueRouter);
var router = new VueRouter();

@VueComponent({
    template: require('./userInfo.html'),
    style:require('./userInfo.scss')
})

export class UserInfoComponent extends Vue{
    el:'#userInfo'
    components:({
        userInfo:any,
    })
    
    @Prop  
    //v-model初始化
    userName:string="";
    userGroupName:string="";
    userPassword:string="";
    rUserPassword:string="";
    rUserPasswordAgain:string="";
    cName:string = "";
    vPassword:string = "";
    editCount:number = null;

    ready=function(){
        this.userName = window.sessionStorage.getItem("userName");
        this.userGroupName="客户单位";
        this.userPassword='';
        this.rUserPassword='';
        this.rUserPasswordAgain='';
        this.cName = this.userName;
        this.vPassword = '';

        //获取用户名修改次数
        dataService().User.getEditUserNameCount().then((res)=>{
            this.editCount = res.editUserNameCount;
        });
    }

    save = function(){
        dataService().User.updatePassword(this.userPassword,this.rUserPassword,this.rUserPasswordAgain).then((res)=>{
            if(res&&res.success!==true){
                bootbox.alert(res.errorMessage);
            }else{
                bootbox.confirm("密码修改成功，请重新登陆！",()=>{
                    // if(result){
                        router.go('/login');
                    // }
                });
            }
        });
    }

    saveName = function(){
        dataService().User.updateUserName(this.cName,this.vPassword).then((res)=>{
            if(res&&res.success!==true){
                bootbox.alert(res.errorMessage);
            }else{
                bootbox.confirm("用户名修改成功，请重新登陆！",()=>{
                    router.go('/login');
                });
            }
        });
    }
}