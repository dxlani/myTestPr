import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../../service/dataService'
import '../../../img/showmessage_title.png'
import '../../../img/showmessage_round.png'

@VueComponent({
    template: require('./showMessage.html'),
    style: require('./showMessage.scss')
})
export class ShowMessageComponent extends Vue {
    el:'#showMessage'

    ready(){
        // alert(navigator.userAgent);
        // if(document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
        //     var bodyTag = document.getElementsByTagName('body')[0];
        //     bodyTag.style.height = document.documentElement.clientWidth / screen.width * screen.height - 35 + 'px';
            
        //     document.documentElement.style.height = bodyTag.style.height
        // }
        // setTimeout(function() {
        //     window.scrollTo(0, 1)
        // }, 0);

        $(window).resize(function() {
            document.documentElement.style.height = window.innerHeight + 'px';
          });
      

    }

}