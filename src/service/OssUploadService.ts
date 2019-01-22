import { dataService } from "./dataService";

export function aliupload() {
    // var OSS = require('ali-oss');
    // var _this = this;
    var fileSize = 1500000;//1.5MB

    if (this.size) {
        this.fileSize = this.size;
    }
    var in_array = function (e) {
        var r = new RegExp(',' + e + ',');
        return (r.test(',' + this.join(this.S) + ','));
    };
    /**声明 */
    var client = new OSS.Wrapper({
        // region: 'oss-cn-beijing',
        // accessKeyId: 'LTAIOZT53Uu0ykZO',
        // accessKeySecret: 'TYxjx2Icu7zjbxQ7LstQewJ6ZlLMZR',
        // bucket: 'sinostoragedev1'
        
        region: 'oss-cn-hangzhou',
        secure:true,
        accessKeyId: 'LTAItKu8i5yJwbYy',
        accessKeySecret: 'dLgecHvzUJg1MFy3nnzVzX5YgsxRSD',
        bucket: dataService().ossB

    })

    /**上传图片**/
    var upload = function (selectedFile, nameimg, cb) {

        const file = selectedFile;
        const name = nameimg;
        // var type = name.split('.')[1];
        var type = name.substring(name.lastIndexOf('.')+1)
        // var storeAs = nameimg;
        /** 文件名*/
        var storeAs = "upload/" + getUuid() + '.' + type;
        var boolean = true;
        // if (file.size > fileSize) {
        //     bootbox.alert('图片不能超过!' + fileSize / 1000 + 'kb');
        //     return false;
        // }
        // console.log(type, "格式");
        if (!/image\/(gif|jpeg|jpg|png|bmp)/.test(type)) {
            boolean = false;
        }
        if (boolean) {
            bootbox.alert('上传图片格式不支持!请选择 gif,jpeg,jpg,png,bmp');
            return false;
        }
        client.multipartUpload(storeAs, file,
            {
                progress: progress
            }).then((result) => {
                this.url = result;
                cb(result);
                // console.log(result.res.requestUrls[0].split('?')[0]);
            }).catch(function (err) {

                console.log(err);
            });
    };
    /**上传进度 */
    var progress = function (p) {
        return function (done) {
            // $("#" + p.id + 'progressBar').attr({ style: "width:" + Math.floor(p * 100) + '%' });
            var bar = $("#" + p.id + 'progressBar');
            // bar.style.width = Math.floor(p * 100) + '%';
            // bar.innerHTML = Math.floor(p * 100) + '%';
            done();
        }
    };

    /**重命名 */
    // var guidGenerate = function() {
    //     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    //       var r = Math.random() * 16 | 0,
    //         v = c == 'x' ? r : (r & 0x3 | 0x8);
    //       return v.toString(16);
    //     }).toUpperCase();
    //   }

    var getUuid = function () {
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

    /**导出方法 */
    return {
        upload: upload,
        progress: progress
    };
};
