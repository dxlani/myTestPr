# 货准达前端

#### 项目介绍
帮助客户询价发货，发布订单，实时定位货物信息
项目内容包括四大部分：
1. 货准达PC端后台管理
2. 货准达微信端
3. 收发货管理
4. 展厅展示页

#### 框架技术及环境

- 前端框架技术：vue1+webpack
- 环境：node 6
- docker环境:node 6.9.5

#### 第三方主流插件包如下：
1. 图片上传: ali-oss
2. 移动端UI：jquery-weui
3. 自动补全功能: jquery-ui-dist
4. 部分样式: bootstrap
5. 表单校验：vue-validate
6. 字体图标：font-awesome
8. 图表统计：echarts
9. pc端表格插件：bootstrap-table
10. pc端弹出框插件：bootbox
11. pc端时间选择器：jquery-datetimepicker
12  电子签名插件：jSignature


#### 安装教程
1. npm install
2. npm run dev 开发模式
3. npm run build 生产模式

#### 使用说明
- src 
    - component  
        - autoComplete  自动补全组件
        - navbar  PC端导航条
        - navbar  阿里云图片上传组件
        - pagination 分页组件
        - wxfooter 微信端底部导航
- img 图片管理
- libs 外部引入插件js
- service
    - dataService.ts 接口API服务
    - OssUploadService.ts 阿里云图片上传服务
    - routeService.ts 接口API服务
- static
    - aliyun-oss-sdk.min.js 阿里云SDK
- views 视图组件
 
       





