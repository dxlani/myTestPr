import { VueComponent, Prop, Watch } from 'vue-typescript'
import * as VueRouter from 'vue-router';

// declare var files;
Vue.use(VueRouter);
var router = new VueRouter();

// var co = require("co");
// var OSS = require('ali-oss');

@VueComponent({
    template: require('./ossupload.html'),
    style: require('./ossupload.scss')
})

export class ossupload extends Vue {
    // el: '#inquiryAdd'
    /**声明 props */
    @Prop
    // multiple: Boolean;
    // id: String;
    url = [];
    // data:string;
    fileSize;
    client;
    typeArr: ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/bmp"];
    size: number;
    data() {
        return {
            fileSize: 500000,

        };
    }
    /**初始化 */
    ready() {
        if (this.size) {
            this.fileSize = this.size;
        }
        this.client = new OSS.Wrapper({
            region: 'oss-cn-shenzhen',
            secure: true,
            accessKeyId: 'LTAIhjYdHfPyEvgk',
            accessKeySecret: 'yRGm57lkOJFRPYBK8PnrHMNBnIPD8n',
            // stsToken: result.data.token.SecurityToken,
            bucket: 'liszt'
        });
    }

    /**上传图片**/
    upload(event) {
        // var self = this;
        var file = event.target.files[0];

        var type = file.name.split('.')[1];
        // var storeAs = file.name;
        var storeAs = this.getUuid() + '.' + type;
        var boolean = false;
        if (file.size > this.fileSize) {
            alert('亲,图片不能超过!' + this.fileSize / 1000 + 'kb');
            return false;
        }
        if (this.typeArr && this.typeArr.indexOf(type) > 0) {
            boolean = false;
        }
        if (boolean) {
            alert('上传图片格式不支持!请选择' + this.typeArr);
            return false;
        }
        this.client.multipartUpload(storeAs, file).then(function (result) {

            this.url = result.res.requestUrls[0].split('?')[0];
            return this.url;

            // console.log(result.res.requestUrls[0].split('?')[0]);
        }).catch(function (err) {

            console.log(err);
        });

    }

    /**重命名 */
    getUuid = function () {
        var len = 32; //32长度
        var radix = 16; //16进制
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }
    
    // doUpload = function () {
    //     const _this = this;

    //     const client = new OSS.Wrapper({
    //         region: _this.region,
    //         accessKeyId: 'LTAIhjYdHfPyEvgk',
    //         accessKeySecret: 'yRGm57lkOJFRPYBK8PnrHMNBnIPD8n',
    //         // stsToken: result.data.token.SecurityToken,
    //         bucket: _this.bucket
    //     })
    //     const files = document.getElementById(_this.id);
    //     // files['files']=files;
    //     // let files = document.querySelectorAll(".files") as NodeListOf<HTMLElement>;
    //     if (files) {
    //         const fileLen = document.getElementById(_this.id).attributes;
    //         console.log(files);
    //         // let fileLen = document.querySelectorAll(".length") as NodeListOf<HTMLElement>;
    //         const resultUpload = [];
    //         for (let i = 0; i < fileLen.length; i++) {
    //             const file = fileLen[i];
    //             const storeAs = file.name;
    //             client.multipartUpload(storeAs, file, {

    //             }).then((results) => {
    //                 if (results.url) {
    //                     resultUpload.push(results.url);
    //                 }
    //             }).catch((err) => {
    //                 console.log(err);
    //             });
    //         }
    //         _this.url = resultUpload;
    //         console.log(resultUpload);
    //     }

    // }

};
