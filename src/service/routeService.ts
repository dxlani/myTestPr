

var routeService = {
    /**附件 */
    Attachment: {
        getAttachment: function (id) {
            return "Attachment/getAttachment/" + id
        }
    },
    CheckFinance:{
        GetOrderFinceList: function(startTime,endTime,goodsName,originAddress,destinationAddress,goodsTypeName,orderNumber,receiptStatus,skip,count) {
            return "CheckFinance/GetOrderFinceList?startTime=" + startTime + "&endTime=" +endTime+ "&GoodsName=" + goodsName + "&OriginAddress=" + originAddress + "&DestinationAddress=" + destinationAddress + "&GoodsTypeName=" + goodsTypeName  + "&OrderNumber=" + orderNumber + "&ReceiptStatus=" + receiptStatus +  "&skip=" + skip + "&count=" + count
        },
        GetPriceTotle: function(startTime,endTime,GoodsName,OriginAddress,DestinationAddress,goodsTypeName,orderNumber,receiptStatus) {
            return "CheckFinance/GetPriceTotle?startTime=" + startTime + "&endTime=" +endTime+ "&GoodsName=" + GoodsName + "&OriginAddress=" + OriginAddress + "&DestinationAddress=" + DestinationAddress + "&GoodsTypeName=" + goodsTypeName  + "&OrderNumber=" + orderNumber + "&ReceiptStatus=" + receiptStatus
        },
        GetOrderFinceExport: function(LogisticsCompanyId,clientId,startTime,endTime,GoodsName,OriginAddress,DestinationAddress,goodsTypeName,orderNumber,receiptStatus,skip,count) {
            return "CheckFinance/GetOrderFinceExport?LogisticsCompanyId=" + LogisticsCompanyId +"&clientId="+ clientId+ "&startTime=" + startTime + "&endTime=" +endTime+ "&GoodsName=" + GoodsName + "&OriginAddress=" + OriginAddress + "&DestinationAddress=" + DestinationAddress + "&GoodsTypeName=" + goodsTypeName  + "&OrderNumber=" + orderNumber + "&ReceiptStatus=" + receiptStatus + "&skip=" + skip + "&count=" + count
        },
        GetOrderReceivableList: function(id) {
            return "CheckFinance/GetOrderReceivableList/" + id
        },
        getReceiveableFee:function(){
            return "CheckFinance/GetReceiveableFee"
        },
        getContractDetail:function(econtractId){
            return "Csp_Orders/GetContractDetail?econtractid=" + econtractId
        },
        downloadContract:function(){
            return "Csp_Orders/PostDownloadContract"
        }
    },
    Area: {
        getProvince: function () {
            return "Area/getProvince";
        },
        getCity: function (provincecode) {
            return "Area/getCity/" + provincecode;
        },
        getCounty: function (citycode) {
            return "Area/getCounty/" + citycode;
        },
        getAllArea: function (provincecode, citycode, isreturn) {
            return "Area/getAllArea?provincecode=" + provincecode + "&citycode=" + citycode + "&isreturn=" + isreturn;
        }
    },
    CspInquiry: {
        getCspInquiryList: function (
            CspInquiryCode: string,
            CspInquiryChildCode: string,
            status: string,
            startTime: string,
            endTime: string,
            startAddress: string,
            endAddress: string,
            skip: number,
            count: number
        ) {
            return "CspInquiry/getCspInquiryList?cspinquirycode=" + CspInquiryCode + "&cspInquirychildcode=" + CspInquiryChildCode + '&status=' + status + '&startTime=' + startTime + '&endTime=' + endTime + '&startAddress=' + startAddress + '&endAddress=' + endAddress + '&skip=' + skip + '&count=' + count

        },

        getCspInquiry: function (id) {
            return "CspInquiry/getCspInquiry/" + id
        },
        addCspInquiry: "CspInquiry/addCspInquiry",
        updateCspInquiry:function(){
            return "CspInquiry/updateCspInquiry"
        },
        editCspInquiry: function (id) {
            return "CspInquiry/editCspInquiry/" + id
        },
        deleteCspInquiry: function (id) {
            return "CspInquiry/deleteCspInquiry/" + id
        },
        getCspInquiryCount:function(){
            return "CspInquiry/GetCspInquiryCount"
        }
    },
    CspOrder: {
        getCspOrderList: function (
            orderId: string,
            status: string,
            startTime: string,
            endTime: string,
            startAddress: string,
            endAddress: string,
            skip: number,
            count: number,
            clientOrderId:string
        ) {
            return "CspOrder/getCspOrderList?orderid=" + orderId + "&status=" + status + "&starttime=" + startTime + "&endtime=" + endTime + "&startaddress=" + startAddress + "&endaddress=" + endAddress + "&skip=" + skip + "&count=" + count + "&ClientOrderId=" + clientOrderId
        },
        getCspOrder: function (id) {
            return "CspOrder/getCspOrder/" + id
        },
        addCspOrder: function () {
            return "CspOrder/addCspOrder"
        },//attention
        /* 终结 */
        editCspOrder: function (id) {
            return "CspOrder/editCspOrder/" + id
        },
        /* 编辑 */
        EditCspOrder: function () {
            return "CspOrder/UpdateCspOrder"
        },
        deleteCspOrder: function (id) {
            return "CspOrder/deleteCspOrder/" + id
        },
        getCspOrderCount:function(){
            return "CspOrder/GetCspOrderCount"
        },
        getAddOrderAuthAndSettleIsExis:function(settleName){
            settleName=settleName.replace(/\+/g,'%2b');
            return "CspOrder/GetAddOrderAuthAndSettleIsExis?SettleName=" + settleName
        }
    },
    CustomerRepresentative: {
        getCustomerList: function (enterpriseid, skip, count) {
            return "CustomerRepresentative/getCustomerList?enterpriseid=" + enterpriseid + "&skip=" + skip + "&count=" + count;
        }
    },
    Goods: {
        getGoodsList: function (goodstypeid, skip, count, goodsName) {
            return "Goods/getGoodsList?&goodstypeid=" + goodstypeid + "&skip=" + skip + "&count=" + count + "&goodsName=" + goodsName
        }
    },
    GoodsType: {
        getGoodsTypeList: function (enterpriseid, skip, count) {
            return "GoodsType/getGoodsTypeList?enterpriseid=" + enterpriseid + "&skip=" + skip + "&count=" + count;
        }
    },
    Inquiry: {
        getInquiryList: function (inquiryid, inquirychildid, Origin, Destination, status, begin, end, skip, count) {
            return "Inquiry/getInquiryList?inquiryid=" + inquiryid + "&inquirychildid=" + inquirychildid + "&Origin=" + Origin + "&Destination=" + Destination + "&status=" + status + "&begin=" + begin + "&end=" + end + "&skip=" + skip + "&count=" + count
        },
        getInquiry: function (id) {
            return "Inquiry/getInquiry/" + id
        },
        editInquiry: function (id) {
            return "Inquiry/editInquiry/" + id
        },
        getInquiryCount:function(){
            return "Inquiry/GetInquiryCount"
        },
    },
    LinePrice: {
        getLinePriceList: function (enterpriseid, goodstypeid, goodsid, skip, count) {
            return "LinePrice/getLinePriceList?enterpriseid=" + enterpriseid + "&goodstypeid=" + goodstypeid + "&goodsid" + goodsid + "&skip=" + skip + "&count=" + count
        },
        getLinePrice: function (id) {
            return "LinePrice/getLinePrice/" + id
        }
    },
    Location: {
        getLocation: function (phone,orderId) {
            return "Location/getLocation?phone=" + phone + "&orderId=" + orderId;
        },
        GetAddressToPositionDetail: function (id,OriginAddress,DestinationAddress) {
            return "Location/GetAddressToPositionDetail?id=" + id + "&OriginAddress" + OriginAddress + "&DestinationAddress" + DestinationAddress;
        },
        GetLocationList: function (id) {
            return "Location/GetLocationList?id=" + id;
        },
        CheckOrderIsLocating: function (id) {
            return "Location/CheckOrderIsLocating?id=" + id;
        },
        getBDNPLotion: function(carCode,orderId){
            return "Location/getBeidouLocation?carCode=" + carCode + "&orderId=" + orderId;
        },
        getHistoryPosition: function(carCode){
            return "Location/GetHistoryPosition?carCode=" + carCode;
        }
    },
    Order: {
        getOnWayOrderList:function(orderid,status,origin,destination,skip,count){
            return "Order/getOnWayOrderList?orderid=" + orderid + "&status=" + status + "&origin=" + origin + "&destination=" + destination + "&skip=" + skip + "&count=" + count;
        },
        getOnWayOrderDetail:function(id){
            return "Order/getOnWayOrderDetail?id=" + id;
        },
        getOrderList: function (orderid, status, deliverybegin, deliveryend, deliveryStartTime, deliveryEndTime, origin, destination, skip, count, receiptStatus,clientOrderId) {
            return "Order/getOrderList?orderid=" + orderid + "&status=" + status + "&orderBegin=" + deliverybegin + "&orderEnd=" + deliveryend + "&deliverybegin=" + deliveryStartTime + "&deliveryEnd=" + deliveryEndTime + "&origin=" + origin + "&destination=" + destination
             + "&skip=" + skip + "&count=" + count + "&receiptStatus=" + receiptStatus + "&ClientOrderId=" + clientOrderId
        },
        getOrder: function (id) {
            return "Order/getOrder/" + id
        },
        getOrderListExport: function (logisticsCompanyId,clientId,orderId, status, orderBegin, orderEnd, origin,  destination, deliverybegin, deliveryend, skip, count, receiptStatus,clientOrderId) {
            return "Order/GetOrderListExport?LogisticsCompanyId=" + logisticsCompanyId  + "&clientId=" + clientId  + "&orderid=" + orderId + "&status=" + status + "&orderbegin=" + orderBegin + "&orderend=" + orderEnd  + "&origin=" + origin + "&destination=" 
                    + destination + "&deliverybegin=" + deliverybegin + "&deliveryend=" + deliveryend + "&skip=" + skip + "&count=" + count + "&ReceiptStatus=" + receiptStatus + "&ClientOrderId=" + clientOrderId
        },
        getCspOrderListExport: function (logisticsCompanyId,clientId,orderid,status,starttime,endtime,startaddress,endaddress,skip,count,clientOrderId) {
            return "CspOrder/GetCspOrderListExport?LogisticsCompanyId=" + logisticsCompanyId  + "&clientId=" + clientId  + "&orderid=" + orderid  + "&status=" + status  + "&starttime=" + starttime + "&endtime=" + endtime + "&startaddress=" + startaddress + "&endaddress=" + endaddress  + "&skip=" + skip + "&count=" + count + "&ClientOrderId=" + clientOrderId
        },
        getOrderCount:function(){
            return "Order/GetOrderCount"
        },
        uploadexcel:function(){
            return "CspOrder/uploadexcel"
        },
        getTemplate:function(){
            return "ExportTemplate/GetTemplate"
        },
        addExcelData:function(){
            return "CspOrder/AddExcelData"
        },
        getOrderLogList:function(id){
            return "Order/GetSystemLogList?ItemCode=" + id
        },
        getCustomerServicePhone:function(id){
            return "Order/GetCustomerServicePhone?Id=" + id
        },
        updateIsDelivery:function(){
            return "Order/UpdateIsDelivery"
        },
        getUpdateIsReceipt:function(id){
            return "Order/GetUpdateIsReceipt?id=" + id
        },
        setOrderError:function(id){
            return "Order/setOrderError?Id=" + id;
        },
        GetClientServiceOfficer:function(id){
            return "Order/GetClientServiceOfficer?Id=" + id;
        },
    },
    Project: {
        getProjectList: function (enterpriseid, skip, count) {
            return "Project/getProjectList?enterpriseid=" + enterpriseid + "&skip=" + skip + "&count=" + count;
        },
        getProject: function (id) {
            return "Project/getProject/" + id
        },
    },
    Settle: {
        getSettleList: function (name, skip, count) {
            return "Settle/getSettleList?name=" + name + "&skip=" + skip + "&count=" + count;
        }
    },
    User: {
        login: function () {
            return "User/login";
        },
        contract:function(){
            return "User/GetIsContract"
        },
        updatePassword: "User/updatepassword",
        updataUserName: function(){
            return "User/UpdateUserName"
        },
        getEditUserNameCount: function(){
            return "User/GetEditUserNameCount"
        },
        GetUserInfo: function (OpenId) {
            return "User/GetUserInfo?openid=" + OpenId;
        },
        LogOutOpenid: function (OpenId) {
            return "User/LogOutOpenid?openid=" + OpenId;
        },
        GetOpenidForCode: function (code) {
            return "User/GetOpenidForCode?code=" + code;
        },
        getCode:function(phone){
            return "User/GetCode?phoneNum=" + phone;
        },
        wechartLogin:function(phone,code,openId){
            return "User/WeChartLogin?PhoneNum=" + phone + "&Code=" + code + "&OpenId=" + openId;
        },
        autoLogin:function(openId){
            return "User/AutoLogin?OpenID=" + openId;
        },
        getCspUserChildList:function(skip,count){
            return "User/GetCspUserChildList?skip=" + skip + "&count=" + count
        },
        getCspUserChildDetail:function(id){
            return "User/GetCspUserChilds?id=" + id
        },
        addUserChild:function(){
            return "User/AddUserChild"
        },
        updataUserChild:function(){
            return "User/UpdateCspUserChilds"
        },
        deleteUserChild:function(id){
            return "User/DeleteCspUserChilds?Id=" + id
        },
        updataUserChildEnable:function(){
            return "User/UpdateEnabled"
        }

    },
    Wxcsporders:{
        getUserOrderList:function(openId){
            return "Csp_Orders/GetUserOrderList?OpenId=" + openId;
        },
        getCspOrders:function(carrierOrderId){
            return "Csp_Orders/GetCsp_Orders?carrierOrderId=" + carrierOrderId;
        },
        updataCspOrderStatus:function(){
            return "Csp_Orders/UpdateCsp_OrdersStatus"
        },
        patchUpdateCspOrders:function(){
            return "Csp_Orders/PatchUpdateCsp_Orders"
        }
    },
    OrderReceivable : {
        /**成本分析 */
        Get12MonthsReceivableTotalPrice:function(id){
            return "OrderReceivable/Get12MonthsReceivableTotalPrice/" + id
        },
        GetOrderLineTop10Receivable:function(id){
            return "OrderReceivable/GetOrderLineTop10Receivable/" + id
        },
        GetOrderReceivableFeeType:function(id){
            return "OrderReceivable/GetOrderReceivableFeeType/" + id
        },
        GetOrderReceivableLineTop5MonthQuality:function(id){
            return "OrderReceivable/GetOrderReceivableLineTop5MonthQuality/" + id
        },
        GetOrderReceivableLineTop5Month:function(id){
            return "OrderReceivable/GetOrderReceivableLineTop5Month/" + id
        },
    },
    OrderReceivableMDL : {
        /**成本分析[麦当劳]*/
        Get12MonthsReceivableTotalPrice:function(){
            return "McDonald/Get12MonthsReceivableTotalPrice"
        },
        GetOrderLineTop10Receivable:function(){
            return "McDonald/GetOrderLineTop10Receivable" 
        },
        GetOrderReceivableFeeType:function(){
            return "McDonald/GetOrderReceivableFeeType" 
        },
        GetOrderReceivableLineTop5MonthQuality:function(){
            return "McDonald/GetOrderReceivableLineTop5MonthQuality"
        },
        GetOrderReceivableLineTop5Month:function(){
            return "McDonald/GetOrderReceivableLineTop5Month"
        },
    },
    DataAnalysis:{
        /**需求分析 */
        getMonthlyFluctuationChart:function(clientId){
            return "RequirementAnalysis/GetMonthlyFluctuationChart?ClientId=" + clientId
        },
        getLineOrderResult:function(clientId){
            return "RequirementAnalysis/GetLineOrderProportionResult?clientId=" + clientId
        },
        getOriginProvincesProportionResult:function(clientId){
            return "RequirementAnalysis/GetOriginProvincesProportionResult?clientId=" + clientId    
        },
        getDestinationProvinceProportionResult:function(clientId){
            return "RequirementAnalysis/GetDestinationProvinceProportionResult?clientId=" + clientId
        },
        getVehicleTypeResult:function(clientId){
            return "RequirementAnalysis/GetVehicleTypeProportionResult?clientId=" + clientId
        }
    },
    DataAnalysisMDL:{
        /**需求分析[麦当劳] */
        getMonthlyFluctuationChart:function(){
            return "McDonald/GetMonthlyFluctuationChart"
        },
        getLineOrderResult:function(){
            return "McDonald/GetLineOrderProportionResult"
        },
        getOriginProvincesProportionResult:function(){
            return "McDonald/GetOriginProvincesProportionResult"    
        },
        getDestinationProvinceProportionResult:function(){
            return "McDonald/GetDestinationProvinceProportionResult"
        },
        getVehicleTypeResult:function(){
            return "McDonald/GetVehicleTypeProportionResult"
        }
    },
    /**
     * 质量分析
     */
    QualityAnalysis:{
        getRate:function(ClientId)
        {
            return "QualityAnalysis/GetQualityAnalysisRate?ClientId=" + ClientId;
        },
        getResponseRate:function(ClientId)
        {
            return "QualityAnalysis/GetResponseRate?ClientId=" + ClientId;
        },
        getRateMDL:function()
        {
            return "McDonald/GetQualityAnalysisRate";
        },
        getResponseRateMDL:function()
        {
            return "McDonald/GetResponseRate";
        },
    },

    Work:{
        getInquiryCount:function(){
            return "GetCount/getInquiryCount"
        },
        getInquiryStatus:function(){
            return "Inquiry/GetInquiryStatistics"
        },
        getOrderCount:function(){
            return "GetCount/getOrderCount"
        },
        getOrderStatus:function(){
            return "Order/GetOrderStatistics"
        },
        getCount:function(){
            return "GetCount/GetInquiryManager"
        }
    },

    /** 
     * 意见反馈
     */
    Opinion:{
        GetOpinionList:function (status, skip, count) {
            return "Opinion/GetOpinionList?status=" + status + "&skip=" + skip + "&count=" + count;
        },
        AddOpinion:function(){
            return "Opinion/AddOpinion"
        },
        GetOpinionDetail:function(Id){
            return "Opinion/GetOpinionDetail?Id=" + Id ;
        },
    },
    /**
     * 费用管理
     */
    feeManage:{
        getFeeList:function(feeAttribute,starttime,endtime,skip,count){
            return "FeeDetail/GetFeeDetailList?feeAttribute=" + feeAttribute + "&starttime="+ starttime + "&endtime=" + endtime + "&skip=" + skip + "&count=" + count;
        },
        getAccountInfo:function(){
            return "FeeDetail/GetAccountInfo" 
        },
        getEarlyMonth:function(){
            return "FeeDetail/GetEarlyMonth"
        }
    },
    /**wxsdk */
    wxsdk: {
        GetSignature: function (url) {
            return "User/GetWeChatSDKCheck?URL=" + url
        }
    },
    /* 大全 */
    daquan:{
        customerValide:function(){
            return "CustomerOrderLocationApiControlle/CustomerValidation"
        },
        getOrderInfo:function(orderId){
            return "CustomerOrderLocationApiControlle/GetOrderInfo?OrderId=" + orderId;
        },
        registerLBS:function(carCode,phoneNumber){
            return "CustomerOrderLocationApiControlle/RegisterLBS?CarCode=" + carCode + "&PhoneNumber=" + phoneNumber
        },
        lbsLocation:function(carCode,phoneNumber){
            return "CustomerOrderLocationApiControlle/LBSLocation?CarCode=" + carCode + "&PhoneNumber=" + phoneNumber
        },
        getOrderTrackLocation:function(orderId){
            return "CustomerOrderLocationApiControlle/GetOrderTrackLocation?OrderId=" + orderId
        }
    },
    /***集团对账 */
    CheckFinanceApiControlle: {
        GetOrderFinceList: function (startTime, endTime, goodsName, originAddress, destinationAddress, goodsTypeName, orderNumber, receiptStatus, skip, count) {
            return "CheckFinanceApiControlle/GetOrderFinceList?startTime=" + startTime + "&endTime=" + endTime + "&GoodsName=" + goodsName + "&OriginAddress=" + originAddress + "&DestinationAddress=" + destinationAddress + "&GoodsTypeName=" + goodsTypeName + "&OrderNumber=" + orderNumber + "&ReceiptStatus=" + receiptStatus + "&skip=" + skip + "&count=" + count;
        },
        GetPriceTotle: function (startTime, endTime, GoodsName, OriginAddress, DestinationAddress, goodsTypeName, orderNumber, receiptStatus) {
            return "CheckFinanceApiControlle/GetPriceTotle?startTime=" + startTime + "&endTime=" + endTime + "&GoodsName=" + GoodsName + "&OriginAddress=" + OriginAddress + "&DestinationAddress=" + DestinationAddress + "&GoodsTypeName=" + goodsTypeName + "&OrderNumber=" + orderNumber + "&ReceiptStatus=" + receiptStatus;
        },
        GetOrderFinceExport: function (LogisticsCompanyId, clientId, startTime, endTime, GoodsName, OriginAddress, DestinationAddress, goodsTypeName, orderNumber, receiptStatus, skip, count, SId) {
            return "CheckFinanceApiControlle/GetOrderFinceExport?LogisticsCompanyId=" + LogisticsCompanyId + "&clientId=" + clientId + "&startTime=" + startTime + "&endTime=" + endTime + "&GoodsName=" + GoodsName + "&OriginAddress=" + OriginAddress + "&DestinationAddress=" + DestinationAddress + "&GoodsTypeName=" + goodsTypeName + "&OrderNumber=" + orderNumber + "&ReceiptStatus=" + receiptStatus + "&skip=" + skip + "&count=" + count + "&SId=" + SId;
        },
        GetOrderReceivableList: function (id) {
            return "CheckFinanceApiControlle/GetOrderReceivableList/" + id;
        },
        getReceiveableFee: function () {
            return "CheckFinanceApiControlle/GetReceiveableFee";
        },
        getContractDetail: function (econtractId) {
            return "Csp_Orders/GetContractDetail?econtractid=" + econtractId
        },
        downloadContract: function () {
            return "Csp_Orders/PostDownloadContract"
        }
    },
    /**数据分析 */
    DataAnalysisApiControlle: {
        /**需求分析 */
        getMonthlyFluctuationChart: function () {
            return "DataAnalysisApiControlle/GetMonthlyFluctuationChart" ;
        },
        getLineOrderResult: function () {
            return "DataAnalysisApiControlle/GetLineOrderProportionResult";
        },
        getOriginProvincesProportionResult: function () {
            return "DataAnalysisApiControlle/GetOriginProvincesProportionResult" ;
        },
        getDestinationProvinceProportionResult: function () {
            return "DataAnalysisApiControlle/GetDestinationProvinceProportionResult" ;
        },
        getVehicleTypeResult: function () {
            return "DataAnalysisApiControlle/GetVehicleTypeProportionResult" ;
        },
        /**成本分析 */
        Get12MonthsReceivableTotalPrice: function () {
            return "DataAnalysisApiControlle/Get12MonthsReceivableTotalPrice";
        },
        GetOrderLineTop10Receivable: function () {
            return "DataAnalysisApiControlle/GetOrderLineTop10Receivable";
        },
        GetOrderReceivableFeeType: function () {
            return "DataAnalysisApiControlle/GetOrderReceivableFeeType";
        },
        GetOrderReceivableLineTop5MonthQuality: function () {
            return "DataAnalysisApiControlle/GetOrderReceivableLineTop5MonthQuality";
        },
        GetOrderReceivableLineTop5Month: function () {
            return "DataAnalysisApiControlle/GetOrderReceivableLineTop5Month";
        },
        /**质量分析 */
        getRate: function () {
            return "DataAnalysisApiControlle/GetQualityAnalysisRate";
        },
        getResponseRate: function () {
            return "DataAnalysisApiControlle/GetResponseRate";
        },
        getRateMDL: function () {
            return "McDonald/GetQualityAnalysisRate";
        },
        getResponseRateMDL: function () {
            return "McDonald/GetResponseRate";
        },
    },
    /**电子回单 */
    OrderExternalApiControlle: {
        getOrder: function (id) {
            return "OrderExternalApiControlle/getOrder/" + id;
        },
        getContractDetail: function (econtractId) {
            return "OrderExternalApiControlle/GetContractDetail?econtractid=" + econtractId
        },
        downloadContract: function () {
            return "OrderExternalApiControlle/PostDownloadContract"
            
        },
    }
}

export { routeService }