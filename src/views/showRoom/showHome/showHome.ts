import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../../service/dataService'
import '../../../img/showroom_title.png'

@VueComponent({
    template: require('./showHome.html'),
    style: require('./showHome.scss')
})
export class ShowHomeComponent extends Vue {
    el:'#showHome'

    ready(){
        if(window.location.hostname=='csp.sowl.cn'){
            var usename="麦当劳"
        }else if(window.location.hostname=='csp.jfry.cn'){
            var usename="肯德基"
        }
        document.documentElement.style.height = window.innerHeight + 'px';
        // dataService().User.login("货准达测试账户","123456", "").then((res)=>{
        dataService().User.login(usename,"123456", "").then((res)=>{
            var loginData=res;
            window.sessionStorage.setItem("logined","yes");
            var userInfo=JSON.stringify(loginData);
            window.sessionStorage.setItem("userInfo",userInfo);
            window.sessionStorage.setItem("userName",res.userName);
        },function(err){
            console.log(err)
        })
    }

}