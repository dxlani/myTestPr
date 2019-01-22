import { VueComponent, Prop } from 'vue-typescript'
import {dataService} from '../../service/dataService';
import * as VueRouter from 'vue-router'

var router = new VueRouter();

@VueComponent({
    template: require('./authorityManage.html'),
    style: require('./authorityManage.scss')
})

export class AuthorityManageComponent extends Vue {
    el:'#authorityManage'
    @Prop
    Records=1;
    skip=0;
    count=10;
    currentPage = 1;
    
    /**
     * 列表数据
     */
    userChildList = []
    /**
     * 创建时间
     */
    createTime:string="";
    /**
     * 所属用户组
     */
    group:string="";
    /**
     * 用户名
     */
    userName:string="";
    /**
     * 密码
     */
    passWord:string="";
    /**
     * 备注
     */
    remarks:string="";
    /**
     * web权限
     */
    webList:string="";
    /**
     * 微信权限
     */
    wxList:string="";

    ready=function(){
        let routerName = this.$route.path;
        if(window.localStorage.getItem(String(routerName + 'Page'))){
            let pageData = JSON.parse(window.localStorage.getItem(String(routerName + 'Page')));
            this.skip = pageData.skip;
            this.count = pageData.count;
        }else{
            this.skip = 0;
            this.count = 10;
        }
        this.$on('pageIndexChange', function(event) {
            this.count = event.pageSize;
            this.skip = event.pageIndex;
            this.currentPage = event.currentPage;
            this.localPage(this.skip,this.count,this.currentPage)
            this.load(this.skip,this.count);
        });

        var table = $('#authorityManage_table').bootstrapTable({
            dataField: "rows",
            clickToSelect:true,
            singleSelect:true,
            cardView:false,
            sidePagination: "client",
            buttonsAlign: "left",
            columns: [
                {field: "userName",title: "用户名",align: "center"},
                {field: "template",title: "权限",align: "center",
                    formatter: function operateFormatter(value,row,index){
                        var webAuthorize = row.webAuthorize;
                        var weChatAuthorize = row.weChatAuthorize;
                        return `web: ${webAuthorize} </br>
                                微信: ${weChatAuthorize}`;
                    }
                },
                {field: "creationTime",title: "创建时间",align: "center"},
                {field: "template1",title: "账户状态",align: "center",
                    formatter: function operateFormatter(value, row, index) {
                        var enabled = `<label class="weui-switch-cp">
                                        <input class="weui-switch-cp__input switchBtn" type="checkbox" checked="checked">
                                        <div class="weui-switch-cp__box"></div>
                                        </label>`;
                        var noEnabled = `<label class="weui-switch-cp">
                                        <input class="weui-switch-cp__input switchBtn" type="checkbox">
                                        <div class="weui-switch-cp__box"></div>
                                        </label>`
                        if(row.enabled == 1){
                            return enabled
                        }else if(row.enabled == 0){
                            return noEnabled
                        }
                    },
                    events:{
                        'click .switchBtn':(e, value, row, index)=>{
                            var abled;
                            if(row.enabled == 0){
                                abled = 1;
                                var isEnable = {
                                    id:row.id,
                                    enabled: abled
                                }
                                dataService().User.updataUserChildEnable(isEnable).then((res)=>{
                                    if(res.success){
                                        bootbox.alert("该账户已启用")
                                        this.load(this.skip,this.count)
                                    }else{
                                        bootbox.alert("修改子账户状态失败")
                                    }
                                })
                            }else if(row.enabled == 1){
                                abled = 0;
                                var isEnable = {
                                    id:row.id,
                                    enabled: abled
                                }
                                dataService().User.updataUserChildEnable(isEnable).then((res)=>{
                                    if(res.success){
                                        bootbox.alert("该账户已禁用")
                                        this.load(this.skip,this.count)
                                    }else{
                                        bootbox.alert("修改子账户状态失败")
                                    }
                                })
                            }
                        }
                            
                    }
                },
                {
                    field: 'template2',
                    title: '操作',
                    align: "center",
                    formatter: function operateFormatter(value, row, index) {
                        var detail =` <a title='查看详情' class='detail' data-toggle="modal" data-target="#authorityDetail"><i class='glyphicon glyphicon-eye-open text-info'></i></a>`;
                        var edit =`<a href="javascript:void(0)" title='编辑' class='edit'><i class='glyphicon glyphicon-edit text-info'></i></a>`;
                        var remove =`<a href="javascript:void(0)" title='删除' class='remove'><i class='glyphicon glyphicon-trash primary text-danger text-info'></i></a>`;
                        return detail + ` ` + edit + ` ` + remove
                    },
                    events: {
                        'click .detail': (e, value, row, index)=> {
                            dataService().User.getCspUserChildDetail(row.id).then((res)=>{
                                this.createTime = res.creationTime;
                                this.group = sessionStorage.getItem('userName');
                                this.userName = res.userName;
                                this.passWord = res.password;
                                this.remarks = res.comments;
                                this.webList = res.webAuthorize;
                                this.wxList = res.weChatAuthorize;

                            })
                        },
                        'click .edit':(e,value,row,index)=>{
                            router.go('authorityDetail/?id=' + row.id + '&name=edit');
                        },
                        'click .remove':(e,value,row,index)=>{
                            bootbox.confirm({
                                title: '删除子账户',
                                buttons:{
                                    confirm:{
                                        label: '删除'
                                    },
                                    cancel: {
                                        label: '取消',
                                    }
                                },
                                message: `确认删除子账户“${row.userName}”吗？删除后，该子账户将不可登录`,
                                callback: (result)=>{
                                    if(result){
                                        dataService().User.deleteUserChild(row.id).then((res)=>{
                                            if(res.success){
                                                bootbox.alert("删除子账户成功!");
                                                this.load(this.skip,this.count);
                                            }else{
                                                bootbox.alert("删除子账户失败!")
                                            }
                                        })
                                    }
                                },
                            })
                        },
                    },
                }
            ],
            data: [],
            locale: "zh-CN"
        });
        this.load(this.skip,this.count);
    }
    /**
     * 请求数据
     */
    load=function(skip,count){
        this.userChildList = []
        dataService().User.getCspUserChildList(skip,count).then((res)=>{
            if(res){
                this.userChildList = res.userList;
                this.Records = res.totalCount
            }
        }).then(()=>{
            $('#authorityManage_table').bootstrapTable('load',this.userChildList)
        })
    }

    //存储页数
    localPage = function(skip,count,currentPage){
        var routerName = this.$route.path;
        window.localStorage.setItem(String(routerName+'Page'),JSON.stringify({skip:skip,count:count,currentPage:currentPage}));
    }

    /**
     * 新增子账户
     */
    add(){
        router.go('authorityDetail/?id=' + '' + '&name=add');
    }

}
