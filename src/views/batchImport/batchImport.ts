import { VueComponent,Prop } from 'vue-typescript'
import * as VueRouter from 'vue-router'
import {dataService} from '../../service/dataService'

Vue.use(VueRouter);
var router = new VueRouter();


@VueComponent({
    template: require('./batchImport.html'),
    style:require('./batchImport.scss')
})

 export class batchImportComponent extends Vue {
    el:'#batchImport'
    /* 文件 */
    file; 
    /* 文件类型 */  
    filetype:string; 
    /* 文件类型是否为excel */
    filetypeval:boolean = false;
    /* 显示下载上传模板 */
    downloadExcel:boolean = true;
    /* 上传成功 */
    uploadSuccess:boolean = false;
    /* 上传错误 */
    uploadError:boolean = false;
    /* 上传重复 */
    uploadRepeat:boolean = false;
    /* 表格数据 */
    batchImportList;
    /* 错误类型 */
    errorType:number = null;
    /* 错误单元格 */
    errList = [];

    ready=function(){
        this.filetypeval = false;
        this.downloadExcel = true;
        this.uploadSuccess = false;
        this.uploadRepeat = false;
        this.batchImportList = [];
        this.errList = [];
        var $table = $('#batchImport_table').bootstrapTable({
            dataField: "rows",
            columns: [
                {field: "consignorName",title: "发货计划人",align: "center"},
                {field: "originAddress",title: "发货地址",align: "center"},
                {field: "destinationAddress",title: "送货地址",align: "center"},
                {field: "deliveryTime",title: "发货时间",align: "center"},
                {field: "arrivalTime",title: "到货时间",align: "center"},
                {field: "goodsTypeName",title: "货物类别",align: "center"},
                {field: "goodsName",title: "货物名称",align: "center"},
                {field: "tonnageRange",title: "吨位范围",align: "center"},
                {field: "goodsNum",title: "货物数量",align: "center"},
                {field: "includeTax",title: "含税",align: "center"},
                {field: "settle",title: "结算单位",align: "center"},
                {field: "responseTime",title: "紧急程度",align: "center"},
            ],
            data: [],
            locale: "zh-CN"//中文支持,
        });
    }
    /* 下载模板 */
    getTemplate = function(){
        dataService().Order.getTemplate().then((res)=>{
            let blob = new Blob([res.data],{type:res.data.type});
            var objectUrl = URL.createObjectURL(blob);
            var fileName = objectUrl.substring(objectUrl.lastIndexOf('/')+1)
            if('msSaveOrOpenBlob' in navigator){
                window.navigator.msSaveOrOpenBlob(blob,fileName+'.xls');
            }else{
                // let blob = new Blob([res.data],{type:res.data.type});
                // var objectUrl = URL.createObjectURL(blob);
                window.location.href = objectUrl;
            }
        });
    }

    /* 上传EXCEL */
    fileChange(event) {
        this.file = event.target.files[0];
        if (this.file) {
            this.filetype = this.file.name.split(".").reverse()[0];
            // console.log(this.file,this.filetype);
            if (this.filetype === "xls" || this.filetype === "xlsx") {
                this.filetypeval = true;
            }else{
                this.filetypeval = false;
                bootbox.alert("请选择excel格式文件!");
            }
            if(this.filetypeval){
                var formData = new FormData();
                formData.append('excel', this.file);
                $('.loadingModal').fadeIn('');
                dataService().Order.uploadexcel(formData).then((res)=>{
                    this.batchImportList = [];
                    this.errList = [];
                    this.errorType = res.validityStatus;
                    if(this.errorType == 1){
                        if(res.orderList.length == 0){
                            bootbox.alert("Excel表格为空，无法上传！");
                        }else{
                            bootbox.alert("一次最多上传100条订单，请删减后重新上传！");
                        }
                        $('.loadingModal').hide();
                    }else{
                        this.downloadExcel = false;
                        if(this.errorType == 0){
                            this.uploadSuccess = true;
                            this.uploadError = false;
                            this.uploadRepeat = false;
                        }else if(this.errorType == 2){
                            this.errList = res.errRowCellList;
                            this.uploadSuccess = false;
                            this.uploadError = true;
                            this.uploadRepeat = false;
                        }else if(this.errorType == 3){
                            this.errList = res.repeatRow;
                            this.uploadSuccess = false;
                            this.uploadError = false;
                            this.uploadRepeat = true;
                        }
                        this.batchImportList=[];
                        res.orderList.forEach((item) => {
                            this.batchImportList.push({
                                consignorName: item.consignorName,
                                originAddress: item.originProvince + item.originCity + item.originCounty + item.originDetails,
                                destinationAddress: item.destinationProvince + item.destinationCity + item.destinationCounty + item.destinationDetails,
                                deliveryTime: item.deliveryTime,
                                arrivalTime: item.arrivalTime,
                                goodsTypeName: item.goodsTypeName,
                                goodsName: item.goodsName,
                                tonnageRange: item.tonnageRange,
                                goodsNum: item.quantityOfGoods + item.goodsUnit,
                                includeTax: item.includeTax,
                                settle: item.settle,
                                responseTime: item.responseTime + item.responseTimeUnit,
                            })
                        });
                        $('.loadingModal').hide();
                        $('#batchImport_table').bootstrapTable('load', this.batchImportList);
                        // console.log(res);
                    }
                }).then(()=>{
                    if(this.errorType == 2){
                        $("table").find("td").removeClass("trbc");
                        this.errList.forEach((itemE)=>{
                            var tableCell;
                            if(itemE.cell == 1 || itemE.cell == 2){
                                tableCell = 12;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }else if(itemE.cell == 3){
                                tableCell = 1;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }else if(itemE.cell == 4 || itemE.cell == 5 || itemE.cell == 6 ||itemE.cell == 7){
                                tableCell = 2;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }else if(itemE.cell == 8 || itemE.cell == 9 || itemE.cell == 10 ||itemE.cell == 11){
                                tableCell = 3;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }else if(itemE.cell == 12){
                                tableCell = 4;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }else if(itemE.cell == 13){
                                tableCell = 5;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }else if(itemE.cell == 14){
                                tableCell = 6;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }else if(itemE.cell == 15){
                                tableCell = 7;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }else if(itemE.cell == 16){
                                tableCell = 8;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }else if(itemE.cell == 17 || itemE.cell == 18){
                                tableCell = 9;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }else if(itemE.cell == 19){
                                tableCell = 10;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }else if(itemE.cell == 20){
                                tableCell = 11;
                                $("table").find("tr").eq(itemE.row).find("td").eq(tableCell-1).addClass('trbc');
                            }
                        });
                    }else if(this.errorType == 3){
                        $("table").find("tr").removeClass("trbc");
                        this.errList.forEach((itemE)=>{
                            $("table").find("tr").eq(itemE.row).addClass('trbc');
                        });
                    }
                });
            }
        }
        $("#fileReload").val("");
        $("#fileInput").val("");
    }

    /* 确认发布 */
    confirm = function(){
        var formData = new FormData();
        formData.append('excel', this.file);
        $('.loadingModal1').fadeIn('');
        dataService().Order.addExcelData(formData).then((res)=>{
            if(res.success){
                $('.loadingModal1').hide();
                router.go('orderReleaseManage');
            }else{
                $('.loadingModal1').hide();
                bootbox.alert("发布失败");
            }
        });
    }

    /* 取消 */
    cancel = function(){
        router.go('orderReleaseManage');
    }
}