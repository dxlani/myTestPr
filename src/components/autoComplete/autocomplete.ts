import { VueComponent, Prop, Watch } from 'vue-typescript'

var events = require('events');
var eventEmitter = new events.EventEmitter;


@VueComponent({
    template: require('./autocomplete.html'),
    style:require('./autocomplete.scss')
})

export class autocompleteCom extends Vue {
    /**id */
    @Prop
    id:string = "";
    /**showSelect */
    @Prop
    showList:boolean = false;
    @Prop
    showReminder:boolean = false;

    @Prop 
    focus:boolean = false;

    @Prop
    eventName = "";

    @Prop
    /**name */
    name:string="";

    @Prop
    /**名称下拉 */
    list = [];

    @Prop 
    eventname = "";

    ready(){
        this.id = "";
        this.isInput();
        this.focus = false;
    }

    // set focus(focus:boolean){
    //     this._focus = focus;
    //     this.showList = this.list.length && focus;
    //     this.showReminder = !this.list.length && focus;
    // };
    // get focus():boolean{
    //     return  this._focus;
    // }
    // @Watch('name')
    // setName(newVal,oldVal){
    //     if(){
    //     }
    // }

    @Watch('list')
    setList(newVal,oldVal){
        this.showList = newVal.length && this.focus;
        this.showReminder = !newVal.length && this.focus;
        newVal.forEach((item) => {
            if(this.name == item.name){
                this.id = item.id;
                this.name  = item.name;
                return;
            }
            
        });
    }

    @Watch('focus')
    changFocus(newv,oldv){
        this.showList = this.list.length && newv;
        this.showReminder = !this.list.length && newv;
    }

    @Watch('id')
    changeId(newd,oldd){
        if(newd){
            this.changeStyle1();
        }else{
            this.changeStyle();
        }
    }

    /**input框获得焦点 */
    onfocus = function(){
        this.id= "";
        this.$dispatch(this.eventname,{name:this.name,id:this.id});
        this.focus = true;
    }

    /**input框失去焦点 */
    blur = function(){
        setTimeout(() => {
            this.focus = false;
            this.$dispatch(this.eventname,{name:this.name,id:this.id});
        }, 200);
    }

    /**判断输入框输入完成 */
    isInput = function(){
        var timeout = null,inputing = false;
        var flag = true;
        $(this.$els.searchname).on('compositionstart',()=>{
            flag = false;
        });
        $(this.$els.searchname).on('compositionend',()=>{
            flag = true;
        });
        $(this.$els.searchname).on('input',()=>{
            if(timeout){
                clearTimeout(timeout)
            }
            timeout= setTimeout(()=>{
                if(flag){
                    this.changeName();
                };
            },500)
        });
        $(this.$els.searchname).focus(()=>{
            this.changeStyle();
        });
    }

    /**选中事件 */
    selectName = function(data){
        this.name = data.name;
        this.id = data.id;
        this.$dispatch(this.eventname,{name:this.name,id:this.id});
        this.changeStyle1();
    }

    /**修改货物名称（传给父组件调接口） */
    changeName = function(){
        this.list = [];
        this.id = "";
        this.$dispatch(this.eventname,{name:this.name,id:this.id});
        this.changeStyle();
    }

    /**添加样式 */
    changeStyle = function(){
        $(this.$els.searchname).removeClass('auto-valid').addClass('auto-invalid');
    }

    /**添加样式 */
    changeStyle1 = function(){
        $(this.$els.searchname).removeClass('auto-invalid').addClass('auto-valid');
    }

} 
