import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../../service/dataService'
import '../../../img/showmessage_title.png'

@VueComponent({
    template: require('./senderMessage.html'),
    style: require('./senderMessage.scss')
})
export class ShowSenderMessage extends Vue {
    el:'#showSenderMessage'

    ready(){
        document.getElementsByTagName("body")[0].setAttribute("style", "height:100%;overflow-y: scroll;-webkit-overflow-scrolling:touch;");
        // alert(navigator.userAgent);
        // if(document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
        //     var bodyTag = document.getElementsByTagName('body')[0];
        //     bodyTag.style.height = document.documentElement.clientWidth / screen.width * screen.height - 35 + 'px';
            
        //     document.documentElement.style.height = bodyTag.style.height
        // }
        // setTimeout(function() {
        //     window.scrollTo(0, 1)
        // }, 0);
        // document.documentElement.style.height = window.innerHeight + 'px';

    }

}