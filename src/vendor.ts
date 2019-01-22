//Get webpack to automatically include bootstrap
//If you have more vendor stuff, you should probably get webpack to make a second bundle
require('jquery-ui-dist/jquery-ui.css');
require('jquery/dist/jquery.min.js');
// require('jquery/dist/jquery.js');
require('jquery-ui-dist/jquery-ui.js');
require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap/dist/js/bootstrap.min.js');
require('moment/moment.js');

require('moment/locale/zh-cn.js');
require('bootbox/bootbox.js');
require('bootstrap-table/dist/bootstrap-table.min.css');
require('./libs/bootstrap-table-fixed-columns.css');
require('bootstrap-table/dist/bootstrap-table.js');
require('bootstrap-table/dist/locale/bootstrap-table-zh-CN.js');
require('./libs/bootstrap-table-fixed-columns.js');

require('font-awesome/css/font-awesome.css');
require('font-awesome/fonts/fontawesome-webfont.eot');
require('font-awesome/fonts/fontawesome-webfont.svg');
require('font-awesome/fonts/fontawesome-webfont.ttf');
require('font-awesome/fonts/fontawesome-webfont.woff');
require('font-awesome/fonts/fontawesome-webfont.woff2');
require('font-awesome/fonts/FontAwesome.otf');

require('jquery-datetimepicker/build/jquery.datetimepicker.min.css');
require('./libs/jquery.datetimepicker.full.js');
require('./libs/jSignature.js');

// require('./libs/jSignature.js');
// require('../node_modules/ali-oss/dist/aliyun-oss-sdk.min.js');
// jQuery['datetimepicker'].setLocale('ch');

interface JQuery {
    bootstrapTable(options?: any): JQuery;
    bootstrapTable(name:string,any):JQuery;
    datetimepicker(option?:any):any;
    cityPicker:any;
    datetimePicker:any;
    toptip:any;
}
declare var bootstrapTable: JQueryStatic;

bootbox.setDefaults({locale:"zh_CN"});

declare var YAHOO;
declare var util;
declare var Canvas;
declare var CanvasDemo;

declare var BMap:any;
declare var BMAP_ANCHOR_TOP_LEFT;
declare var BMAP_NAVIGATION_CONTROL_LARGE;
declare var BMAP_ANCHOR_BOTTOM_LEFT;
declare var markerArr:any[];
declare var OSS;

