import * as VueResource from "vue-resource";
import { routeService } from "./routeService";

export function dataService() {
    /**域名地址 */
    var hostn = window.location.hostname;
    if (hostn == "csp.sowl.cn") {
        var baseUrl = "csp/";
        var databaseUrl = "bda/";
        var testUrl = "bda/";
        /**微信测试服地址 */
        var weUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2ecc139213030129&redirect_uri=http%3a%2f%2fcsp.sowl.cn%2f%3f%23!%2fWxLogin%2fLogin&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
        var wxUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2ecc139213030129&redirect_uri=http%3a%2f%2fcsp.sowl.cn%2f%3f%23!%2fwechatConfirm%2flogin&response_type=code&scope=snsapi_base#wechat_redirect";
        var ossB = "sinostoragedev";
        var wilddogUrl = "https://cjtmsystem-web-dev.wilddogio.com/";
    } else if (hostn == "csp.jfry.cn") {
        var baseUrl = "csp/";
        var testUrl = "bda/";
        var databaseUrl = "bda/";
        /**微信正式服地址 */
        var weUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe083605fdce31a3d&redirect_uri=https%3a%2f%2fcsp.jfry.cn%2f%23!%2fWxLogin%2fLogin&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
        var wxUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe083605fdce31a3d&redirect_uri=https%3a%2f%2fcsp.jfry.cn%2f%23!%2fwechatConfirm%2flogin&response_type=code&scope=snsapi_base#wechat_redirect";
        var ossB = "sinostorage";
        var wilddogUrl = "https://tmsystem.wilddogio.com/"
    } else {
       var baseUrl = "/csp/";   //代理
        var databaseUrl = "/bda/";   //代理
        //  var baseUrl = "http://192.168.1.222:5000/csp/";   //丁闻宇
        //var databaseUrl = "http://192.168.1.107:888/bda/";
        var testUrl = "http://192.168.1.205:888/bda/";
        var orderUrl = "http://192.168.1.234:5000/csp/"
        var ossB = "sinostoragedev";
        var wilddogUrl = "https://cjtmsystem-web-dev.wilddogio.com/";
        
    }

    var DefaultBlockSize: number = 1024 * 32
    var getLoginCookie = function () {
        var cookie = document.cookie;
        let cookieList = cookie.split(';');
        let usernameCookie = cookieList.filter(item => { return item.indexOf('ow-login-username=') >= 0 })[0];
        let username = usernameCookie ? usernameCookie.split('=')[1] : "";
        let pswCookie = cookieList.filter(item => { return item.indexOf('ow-login-password=') >= 0 })[0];
        let psw = pswCookie ? pswCookie.split('=')[1] : "";
        return username && psw ? { username: username, password: psw } : null;
    };
    var setLoginCookie = function (username, password) {
        document.cookie = "ow-login-username=" + username;
        document.cookie = "ow-login-password=" + password;
    };

    var upload = function () {
        Vue.use(VueResource);
        return Vue.http.get('../../test.json', {}, {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            emulateJSON: true
        }).then(function (response) {
            var data = response.data['data'];
            return data;
        }, function (response) {
            // handle error
            return response;
        })
    };
    /** */
    var Storage = {
        AquireStorageSharedSigniture: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + 'Storage/AquireStorageSharedSigniture?containerName=' + 'avatar-container', {},
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data;
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        }
    }
    /**附件 */
    var Attachment = {
        getAttachment: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Attachment.getAttachment(id), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        }

    }

    var CheckFinance = {
        GetOrderFinceList: function (
            startTime: string,
            endTime: string,
            goodsName: string,
            originAddress: string,
            destinationAddress: string,
            goodsTypeName: string,
            orderNumber: string,
            receiptStatus: number,
            skip: number,
            count: number
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CheckFinance.GetOrderFinceList(
                startTime,
                endTime,
                goodsName,
                originAddress,
                destinationAddress,
                goodsTypeName,
                orderNumber,
                receiptStatus,
                skip,
                count
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        GetPriceTotle: function (
            startTime: string,
            endTime: string,
            GoodsName: string,
            OriginAddress: string,
            DestinationAddress: string,
            goodsTypeName: string,
            orderNumber: string,
            receiptStatus: number
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CheckFinance.GetPriceTotle(
                startTime,
                endTime,
                GoodsName,
                OriginAddress,
                DestinationAddress,
                goodsTypeName,
                orderNumber,
                receiptStatus
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        GetOrderFinceExport: function (
            LogisticsCompanyId: string,
            clientId: string,
            startTime: string,
            endTime: string,
            GoodsName: string,
            OriginAddress: string,
            DestinationAddress: string,
            goodsTypeName: string,
            orderNumber: string,
            receiptStatus: number,
            skip: number,
            count: number
        ) {
            Vue.use(VueResource);
            window.location.href = baseUrl + routeService.CheckFinance.GetOrderFinceExport(
                LogisticsCompanyId,
                clientId,
                startTime,
                endTime,
                GoodsName,
                OriginAddress,
                DestinationAddress,
                goodsTypeName,
                orderNumber,
                receiptStatus,
                skip,
                count
            )
        },
        GetOrderReceivableList: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CheckFinance.GetOrderReceivableList(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        getReceiveableFee: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CheckFinance.getReceiveableFee(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        getContractDetail: function (econtractId: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CheckFinance.getContractDetail(econtractId), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        downloadContract:function(eContractId){
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.CheckFinance.downloadContract(), {"eContractId":eContractId},{
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data;
                return data;
            }, function (response) {
                return response;
            })
        },
    }

    var Area = {
        //获取总
        getAllArea: function (provincecode: string, citycode: string, isreturn: boolean) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Area.getAllArea(provincecode, citycode, isreturn), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        //获取省
        getProvince: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Area.getProvince(), {},
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        //获取市
        getCity: function (provinceCode: string) {
            if (!provinceCode) {
                return;
            }
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Area.getCity(provinceCode), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })

        },
        //获取区
        getCountry: function (cityCode: string) {
            if (!cityCode) { return }
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Area.getCounty(cityCode), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        }
    };
    var CspInquiry = {      
        //获取发布询价列表
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
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CspInquiry.getCspInquiryList(
                CspInquiryCode,
                CspInquiryChildCode,
                status,
                startTime,
                endTime,
                startAddress,
                endAddress,
                skip,
                count
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        'Access-Control-Allow-Origin': "*"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data['data'];
                    return data;
                }, function (response) {
                    return response;
                })
        },
        //获取发布询价详情
        getCspInquiry: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CspInquiry.getCspInquiry(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        //添加发布询价!
        addCspInquiry: function (submitInquiry) {
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.CspInquiry.addCspInquiry, submitInquiry,
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: false
                }).then(function (response) {
                    var data = response.data;
                    return data;
                }, function (response) {
                    return response;
                })
        },
        /**
         * 编辑询价单
         */
        updateCspInquiry:function(updateInquiry){
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.CspInquiry.updateCspInquiry(), updateInquiry,{
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data;
                return data;
            }, function (response) {
                return response;
            })
        },
        //终结询价单
        editCspInquiry: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.put(baseUrl + routeService.CspInquiry.editCspInquiry(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        //删除发布询价
        deleteCspInquiry: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.delete(baseUrl + routeService.CspInquiry.deleteCspInquiry(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        /* 概述区域 */
        getCspInquiryCount: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CspInquiry.getCspInquiryCount(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },

    };
    var CspOrder = {
        //获取发布订单列表
        getCspOrderList: function (
            orderId: string,
            status: string,
            startTime: string,
            endTime: string,
            startAddress: string,
            endAddress: string,
            skip: number,
            count: number,
            clientOrderId: string
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CspOrder.getCspOrderList(
                orderId,
                status,
                startTime,
                endTime,
                startAddress,
                endAddress,
                skip,
                count,
                clientOrderId
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        //获取发布订单详情
        getCspOrder: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CspOrder.getCspOrder(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        //添加发布订单
        addCspOrder: function (obj) {
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.CspOrder.addCspOrder(), obj,
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: false
                }).then(function (response) {
                    var data = response.data;
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        //编辑发布订单
        EditCspOrder: function (obj) {
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.CspOrder.EditCspOrder(), obj,
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: false
                }).then(function (response) {
                    var data = response.data;
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        //修改发布列表
        editCspOrder: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.put(baseUrl + routeService.CspOrder.editCspOrder(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        //删除发布列表
        deleteCspOrder: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.delete(baseUrl + routeService.CspOrder.deleteCspOrder(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        /* 获取概述区域 */
        getCspOrderCount: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CspOrder.getCspOrderCount(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        /* 判断托运合同以及结算单位是否异常 */
        getAddOrderAuthAndSettleIsExis: function (settleName:string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CspOrder.getAddOrderAuthAndSettleIsExis(settleName), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res;
            }, function (response) {
                return response;
            })
        },
    };
    var CustomerRepresentative = {
        //获取客户列表
        getCustomerList: function (
            enterPriseId: string,
            skip: number,
            count: number
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CustomerRepresentative.getCustomerList(enterPriseId, skip, count), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },

    };
    var Goods = {
        //获取货物列表
        getDoodsList: function (
            // enterPriseId: string,
            goodsTypeId: string,
            skip: number,
            count: number,
            goodsName: string
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Goods.getGoodsList(goodsTypeId, skip, count, goodsName), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },

    };
    var GoodsType = {
        //获取货物列别列表
        getDoodsTypeList: function (
            enterPriseId: string,
            skip: number,
            count: number
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.GoodsType.getGoodsTypeList(enterPriseId, skip, count), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },

    };
    var Inquiry = {
        //获取询价列表
        getInquiryList: function (
            inquiryId: string,
            inquiryChildId: string,
            Origin: string,
            Destination: string,
            status: string,
            begin: string,
            end: string,
            skip: number,
            count: number
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Inquiry.getInquiryList(
                inquiryId,
                inquiryChildId,
                Origin,
                Destination,
                status,
                begin,
                end,
                skip,
                count
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        //获取询价详情
        getInquiry: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Inquiry.getInquiry(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        //修改询价状态
        editInquiry: function (id: string, status: any) {
            Vue.use(VueResource);
            return Vue.http.put(baseUrl + routeService.Inquiry.editInquiry(id), status, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res;
            }, function (response) {
                // handle error
                return response;
            })
        },
        /* 询价概述区域 */
        getInquiryCount: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Inquiry.getInquiryCount(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        
    };
    var LinePrice = {
        //获取线路报价列表
        getLinePriceList: function (
            enterPriseId: string,
            goodsTypeId: string,
            goodsId: string,
            skip: number,
            count: number

        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.LinePrice.getLinePriceList(
                enterPriseId,
                goodsTypeId,
                goodsId,
                skip,
                count
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        //获取线路报价详情
        getLinePrice: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.LinePrice.getLinePrice(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
    }
    var Location = {
        getLocation: function (
            phone:string,
            orderId:string
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Location.getLocation(phone,orderId), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        GetAddressToPositionDetail: function (id,OriginAddress,DestinationAddress) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Location.GetAddressToPositionDetail(id,OriginAddress,DestinationAddress), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        getBDNPLotion: function (
            carCode:string,
            orderId:string
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Location.getBDNPLotion(carCode,orderId), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        GetLocationList: function (id) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Location.GetLocationList(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        CheckOrderIsLocating: function (id) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Location.CheckOrderIsLocating(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        getHistoryPosition: function (carCode) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Location.getHistoryPosition(carCode), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
    }
    var Order = {
        //订单批量上传
        uploadexcel: function (formdata){
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.Order.uploadexcel(
            ), formdata, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        //下载模板
        getTemplate: function (){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Order.getTemplate(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var res;
                res = response;
                return res;
            }, function (response) {
                return response;
            })
        },
        /* 批量发布 */
        addExcelData:function(formdata){
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.Order.addExcelData(), formdata, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res;
            }, function (response) {
                // handle error
                return response;
            })
        },
        //获取在途订单列表
        getOnWayOrderList: function (
            orderId: string,
            status: string,
            origin: string,
            destination: string,
            skip: number,
            count: number,
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Order.getOnWayOrderList(
                orderId,
                status,
                origin,
                destination,
                skip,
                count
            ), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        //获取在途订单详情
        getOnWayOrderDetail: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Order.getOnWayOrderDetail(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data']?response.data['data']:response.data;
                return data;
            }, function (response) {
                return response;
            })
        },
        //获取订单列表
        getOrderList: function (
            orderId: string,
            status: string,
            deliveryBegin: string,
            deliveryEnd: string,
            deliveryStartTime: string,
            deliveryEndTime: string,
            origin: string,
            destination: string,
            skip: number,
            count: number,
            receiptStatus: number,
            clientOrderId: string
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Order.getOrderList(
                orderId,
                status,
                deliveryBegin,
                deliveryEnd,
                deliveryStartTime,
                deliveryEndTime,
                origin,
                destination,
                skip,
                count,
                receiptStatus, clientOrderId
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        //获取订单详情
        getOrder: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Order.getOrder(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        /**
         * 导出订单列表1
         */
        getOrderListExport: function (
            logisticsCompanyId: string,
            clientId: string,
            orderId: string,
            status: string,
            orderBegin: string,
            orderEnd: string,
            origin: string,
            destination: string,
            deliverybegin: string,
            deliveryend: string,
            skip: number,
            count: number,
            receiptStatus: number,
            clientOrderId: string
        ) {
            Vue.use(VueResource);
            window.location.href = baseUrl + routeService.Order.getOrderListExport(
                logisticsCompanyId,
                clientId,
                orderId,
                status,
                orderBegin,
                orderEnd,
                origin,
                destination,
                deliverybegin,
                deliveryend,
                skip,
                count,
                receiptStatus,
                clientOrderId
            )
        },
        /**
         * 导出订单列表2
         */
        getCspOrderListExport: function (
            logisticsCompanyId: string,
            clientId: string,
            orderid: string,
            status: string,
            starttime: string,
            endtime: string,
            startaddress: string,
            endaddress: string,
            skip: number,
            count: number,
            clientOrderId: string
        ) {
            Vue.use(VueResource);
            window.location.href = baseUrl + routeService.Order.getCspOrderListExport(
                logisticsCompanyId,
                clientId,
                orderid,
                status,
                starttime,
                endtime,
                startaddress,
                endaddress,
                skip,
                count,
                clientOrderId
            )
        },
        /* 订单管理概述区域 */
        getOrderCount: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Order.getOrderCount(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        /**订单追踪 */
        getOrderLogList:function(id:string){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Order.getOrderLogList(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        /**获取客服电话  */
        getCustomerServicePhone:function(id:string){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Order.getCustomerServicePhone(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        /**确认发货  */
        updateIsDelivery:function(id:string){
            Vue.use(VueResource);
            return Vue.http.put(baseUrl + routeService.Order.updateIsDelivery(),{
                Id:id
            },{
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var res = response.data;
                return res
            }, function (response) {
                return response;
            })
        },
        /**确认收货  */
        getUpdateIsReceipt:function(id:string){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Order.getUpdateIsReceipt(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data;
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        /**订单报错 */
        setOrderError:function(id:string){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Order.setOrderError(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        /**获取专属客服信息 */
        GetClientServiceOfficer:function(id:string){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Order.GetClientServiceOfficer(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
    };
    var Project = {
        //获取工程列表
        getProjectList: function (
            enterPriseId: string,
            skip: number,
            count: number
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Project.getProjectList(enterPriseId, skip, count), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        //获取工程详情
        getProject: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Project.getProject(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
    };
    var Settle = {
        //获取结算方列表
        getSettleList: function (
            name: string,
            skip: number,
            count: number
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Settle.getSettleList(name, skip, count), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        }
    };
    var User = {
        //登陆
        login: function (userName, passWord, weChatOpenid) {
            Vue.use(VueResource);
            var obj = {
                userName: userName,
                password: passWord,
                weChatOpenid: weChatOpenid
            };
            return Vue.http.post(baseUrl + routeService.User.login(), obj, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res;
            }, function (response) {
                // handle errordata
                return response;
            })
        },
        //用户协议
        contract: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.User.contract(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(
                 function (response) {
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res;
             }, 
            function (response) {
                return response;
            })
        },
        //修改密码
        updatePassword: function (oldPassword, password, rePassword) {
            Vue.use(VueResource);
            return Vue.http.put(baseUrl + routeService.User.updatePassword, {
                oldPassword: oldPassword,
                password: password,
                rePassword: rePassword
            },
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",

                    },
                    emulateJSON: false
                }).then(function (response) {
                    var res;
                    !response.data['data'] ? res = response.data : res = response.data['data'];
                    return res;
                }, function (response) {
                    // handle error
                    return response;
                })
        },

        //修改用户名
        updateUserName: function (newUserName, oldPassword) {
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.User.updataUserName(), {
                newUserName: newUserName,
                oldPassword: oldPassword
            },
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",

                    },
                    emulateJSON: false
                }).then(function (response) {
                    var res;
                    !response.data['data'] ? res = response.data : res = response.data['data'];
                    return res;
                }, function (response) {
                    return response;
                })
        },

        //获取用户名修改次数
        getEditUserNameCount: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.User.getEditUserNameCount(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },

        //根据OpenId获取用户信息
        GetUserInfo: function (OpenId) {
            Vue.use(VueResource);
            var obj = {
                OpenId: OpenId
            };
            return Vue.http.get(baseUrl + routeService.User.GetUserInfo(OpenId), obj, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        //注销用户信息
        LogOutOpenid: function (OpenId) {
            Vue.use(VueResource);
            var obj = {
                OpenId: OpenId
            };
            return Vue.http.get(baseUrl + routeService.User.LogOutOpenid(OpenId), obj, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        //获取用户信息openid
        GetOpenidForCode: function (code) {
            Vue.use(VueResource);
            var obj = {
                code: code
            };
            return Vue.http.get(baseUrl + routeService.User.GetOpenidForCode(code), obj, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /**
         * 获取验证码
         */
        getCode: function (phone) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.User.getCode(phone), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res;
            }, function (response) {
                return response;
            })
        },
        /**
         * 验证码登陆
         */
        wechartLogin: function (phone,code,openId) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.User.wechartLogin(phone,code,openId), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res;
            }, function (response) {
                return response;
            })
        },
        /**
         * 自动登陆
         */
        autoLogin: function (openId) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.User.autoLogin(openId), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res;
            }, function (response) {
                return response;
            })
        },
        /**
         * 获取子账户列表
         */
        getCspUserChildList: function(skip:number,count:number){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.User.getCspUserChildList(skip,count),{
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response){
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res
            },function(response){
                return response
            })
        },
        /**
         * 获取子账户详情
         */
        getCspUserChildDetail: function(id:string){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.User.getCspUserChildDetail(id),{
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response){
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res
            },function(response){
                return response
            })
        },
        /**
         * 新增子账户
         */
        addUserChild:function(userChild){
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.User.addUserChild(),userChild,{
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var res = response.data;
                return res
            }, function (response) {
                return response;
            })
        },
        /**
         * 修改子账户信息
         */
        updataUserChild:function(userChild){
            Vue.use(VueResource);
            return Vue.http.put(baseUrl + routeService.User.updataUserChild(),userChild,{
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var res = response.data;
                return res
            }, function (response) {
                return response;
            })
        },
        /**
         * 删除子账户信息
         */
        deleteUserChild:function(id:string){
            Vue.use(VueResource);
            return Vue.http.delete(baseUrl + routeService.User.deleteUserChild(id),{},{
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var res = response.data;
                return res
            }, function (response) {
                return response;
            })
        },
        /**
         * 更新子账户状态
         */
        updataUserChildEnable:function(isEable){
            Vue.use(VueResource);
            return Vue.http.put(baseUrl + routeService.User.updataUserChildEnable(),isEable,{
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var res = response.data;
                return res
            }, function (response) {
                return response;
            })
        }


    };
    var Wxcsporders = {
        getUserOrderList:function(openId){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Wxcsporders.getUserOrderList(openId), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res;
            }, function (response) {
                return response;
            })
        },
        getCspOrders:function(carrierOrderId){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Wxcsporders.getCspOrders(carrierOrderId), {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var res;
                !response.data['data'] ? res = response.data : res = response.data['data'];
                return res;
            }, function (response) {
                return response;
            })
        },
        updataCspOrderStatus:function(obj){
            Vue.use(VueResource);
            return Vue.http.patch(baseUrl + routeService.Wxcsporders.updataCspOrderStatus(), obj, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
                emulateJSON: false
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        patchUpdateCspOrders:function(obj){
            Vue.use(VueResource);
            return Vue.http.patch(baseUrl + routeService.Wxcsporders.patchUpdateCspOrders(), obj, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
                emulateJSON: false
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
    };
    /**
     * 成本分析
     */
    var OrderReceivable = {
        Get12MonthsReceivableTotalPrice:function(id:string){
            Vue.use(VueResource);
            return Vue.http.get(databaseUrl + routeService.OrderReceivable.Get12MonthsReceivableTotalPrice(id),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },

        GetOrderLineTop10Receivable:function(id){
            Vue.use(VueResource);
            return Vue.http.get(databaseUrl + routeService.OrderReceivable.GetOrderLineTop10Receivable(id),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        GetOrderReceivableFeeType:function(id){
            Vue.use(VueResource);
            return Vue.http.get(databaseUrl + routeService.OrderReceivable.GetOrderReceivableFeeType(id),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        GetOrderReceivableLineTop5MonthQuality:function(id){
            Vue.use(VueResource);
            return Vue.http.get(databaseUrl + routeService.OrderReceivable.GetOrderReceivableLineTop5MonthQuality(id),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        GetOrderReceivableLineTop5Month:function(id:string){
            Vue.use(VueResource);
            return Vue.http.get(databaseUrl + routeService.OrderReceivable.GetOrderReceivableLineTop5Month(id),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
    }
    /**
     * 成本分析[麦当劳]
     */
    var OrderReceivableMDL = {
        Get12MonthsReceivableTotalPrice:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.OrderReceivableMDL.Get12MonthsReceivableTotalPrice(),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },

        GetOrderLineTop10Receivable:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.OrderReceivableMDL.GetOrderLineTop10Receivable(),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        GetOrderReceivableFeeType:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.OrderReceivableMDL.GetOrderReceivableFeeType(),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        GetOrderReceivableLineTop5MonthQuality:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.OrderReceivableMDL.GetOrderReceivableLineTop5MonthQuality(),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        GetOrderReceivableLineTop5Month:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.OrderReceivableMDL.GetOrderReceivableLineTop5Month(),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
    }
    /**需求分析 */
    var DataAnalysis = {
        /**月度订单量 */
        getMonthlyFluctuationChart:function(clientId:string){
            Vue.use(VueResource);
            return Vue.http.get(databaseUrl + routeService.DataAnalysis.getMonthlyFluctuationChart(clientId),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        
        /**线路订单量占比 */
        getLineOrderResult:function(clientId:string){
            Vue.use(VueResource);
            return Vue.http.get(databaseUrl + routeService.DataAnalysis.getLineOrderResult(clientId),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        
        /**始发省份占比 */
        getOriginProvinceResult:function(clientId:string){
            Vue.use(VueResource);
            return Vue.http.get(databaseUrl + routeService.DataAnalysis.getOriginProvincesProportionResult(clientId),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        /**送达省份占比 */
        getDestinationProvinceResult:function(clientId:string){
            Vue.use(VueResource);
            return Vue.http.get(databaseUrl + routeService.DataAnalysis.getDestinationProvinceProportionResult(clientId),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        /**常用车辆占比 */
        getVehicleTypeResult:function(clientId:string){
            Vue.use(VueResource);
            return Vue.http.get(databaseUrl + routeService.DataAnalysis.getVehicleTypeResult(clientId),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
    }
    /**需求分析[麦当劳] */
    var DataAnalysisMDL = {
        /**月度订单量 */
        getMonthlyFluctuationChart:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisMDL.getMonthlyFluctuationChart(),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        
        /**线路订单量占比 */
        getLineOrderResult:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisMDL.getLineOrderResult(),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        
        /**始发省份占比 */
        getOriginProvinceResult:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisMDL.getOriginProvincesProportionResult(),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        /**送达省份占比 */
        getDestinationProvinceResult:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisMDL.getDestinationProvinceProportionResult(),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
        /**常用车辆占比 */
        getVehicleTypeResult:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisMDL.getVehicleTypeResult(),{},{
                headers:{
                    "X-Requested-With":"XMLHttpRequest"
                },
                emulateJSON:true
            }).then(function(response){
                var data = response.data['data'];
                return data;
            },function(response){
                return response;
            })
        },
    }
    /**
     * 质量分析
     */
    var QualityAnalysis = {
        getRate : function (ClientId) {
            Vue.use(VueResource);
            var obj = {
                ClientId:ClientId
            };
            return Vue.http.get(databaseUrl + routeService.QualityAnalysis.getRate(ClientId), obj, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        getResponseRate : function (ClientId) {
            Vue.use(VueResource);
            var obj = {
                ClientId:ClientId
            };
            return Vue.http.get(databaseUrl + routeService.QualityAnalysis.getResponseRate(ClientId), obj, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /* 麦当劳 */
        getRateMDL : function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.QualityAnalysis.getRateMDL(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        getResponseRateMDL : function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.QualityAnalysis.getResponseRateMDL(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
    }
  

    var Work = {
        getInquiryCount : function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Work.getInquiryCount(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        getInquiryStatus : function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Work.getInquiryStatus(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        getOrderCount : function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Work.getOrderCount(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },  
        getOrderStatus : function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Work.getOrderStatus(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        getCount:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Work.getCount(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        }
    }

  /**
     * 意见反馈
     */
    var feedback = {
        GetOpinionList: function (
            status: string,
            skip: number,
            count: number
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Opinion.GetOpinionList(
                status,
                skip,
                count
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data;
                    !response.data['data'] ? data = response.data : data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        AddOpinion: function (
            obj
        ) {
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.Opinion.AddOpinion(),obj, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: false
                }).then(function (response) {
                    var data;
                    !response.data['data'] ? data = response.data : data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        GetOpinionDetail: function (
            Id: string,
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.Opinion.GetOpinionDetail(
                Id
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data;
                    !response.data['data'] ? data = response.data : data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
    }
    /**
     * 费用明细
     */
    var feeManage = {
        /**获取费用明细列表 */
        getFeeList:function(
            feeAttribute: string,
            starttime: string,
            endtime: string,
            skip: number,
            count: number,)
        {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.feeManage.getFeeList(feeAttribute,starttime,endtime,skip,count), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data;
                    !response.data['data'] ? data = response.data : data = response.data['data'];
                    return data;
                }, function (response) {
                    return response;
                })
        },
        /**获取账户状态 */
        getAccountInfo:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.feeManage.getAccountInfo(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /**
         * 获取最早月份
         */
        getEarlyMonth:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.feeManage.getEarlyMonth(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        }
    }
  /**
     * 微信SDK签名
     */
    var wxsdk = {
        signature: function (
            url: string,
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.wxsdk.GetSignature(
                url,
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data;
                    !response.data['data'] ? data = response.data : data = response.data['data'];
                    return data;
                }, function (response) {
                    return response;
                })
        }
    }

    /**
     * 大全定位
     */
    var daquan = {
        /**
         * 判断客户是否有效
         */
        customerValide:function(){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.daquan.customerValide(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /**
         * 获取订单信息
         */
        getOrderInfo:function(orderId:string){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.daquan.getOrderInfo(orderId), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /**
         * 开通LBS定位
         */
        registerLBS:function(
            carCode:string,
            phoneNumber:string
        ){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.daquan.registerLBS(carCode,phoneNumber), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /**
         * LBS定位
         */
        lbsLocation:function(
            carCode:string,
            phoneNumber:string
        ){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.daquan.lbsLocation(carCode,phoneNumber), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /**
         * 获取定位进度信息
         */
        getOrderTrackLocation:function(orderId:string){
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.daquan.getOrderTrackLocation(orderId), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data;
                !response.data['data'] ? data = response.data : data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
    }
    
    /**集团报账 */
    var CheckFinanceApiControlle = {
        GetOrderFinceList: function (
            startTime: string,
            endTime: string,
            goodsName: string,
            originAddress: string,
            destinationAddress: string,
            goodsTypeName: string,
            orderNumber: string,
            receiptStatus: number,
            skip: number,
            count: number
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CheckFinanceApiControlle.GetOrderFinceList(
                startTime,
                endTime,
                goodsName,
                originAddress,
                destinationAddress,
                goodsTypeName,
                orderNumber,
                receiptStatus,
                skip,
                count
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        GetPriceTotle: function (
            startTime: string,
            endTime: string,
            GoodsName: string,
            OriginAddress: string,
            DestinationAddress: string,
            goodsTypeName: string,
            orderNumber: string,
            receiptStatus: number
        ) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CheckFinanceApiControlle.GetPriceTotle(
                startTime,
                endTime,
                GoodsName,
                OriginAddress,
                DestinationAddress,
                goodsTypeName,
                orderNumber,
                receiptStatus
            ), {}, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    emulateJSON: true
                }).then(function (response) {
                    var data = response.data['data'];
                    return data;
                }, function (response) {
                    // handle error
                    return response;
                })
        },
        GetOrderFinceExport: function (
            LogisticsCompanyId: string,
            clientId: string,
            startTime: string,
            endTime: string,
            GoodsName: string,
            OriginAddress: string,
            DestinationAddress: string,
            goodsTypeName: string,
            orderNumber: string,
            receiptStatus: number,
            skip: number,
            count: number,
            SId: string
        ) {
            Vue.use(VueResource);
            window.location.href = baseUrl + routeService.CheckFinanceApiControlle.GetOrderFinceExport(
                LogisticsCompanyId,
                clientId,
                startTime,
                endTime,
                GoodsName,
                OriginAddress,
                DestinationAddress,
                goodsTypeName,
                orderNumber,
                receiptStatus,
                skip,
                count,
                SId
            )
        },
        GetOrderReceivableList: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CheckFinanceApiControlle.GetOrderReceivableList(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        getReceiveableFee: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CheckFinanceApiControlle.getReceiveableFee(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        getContractDetail: function (econtractId: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.CheckFinanceApiControlle.getContractDetail(econtractId), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        downloadContract: function (eContractId) {
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.CheckFinanceApiControlle.downloadContract(), { "eContractId": eContractId }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data;
                return data;
            }, function (response) {
                return response;
            })
        },
    }

    /**数据分析 */
    var DataAnalysisApiControlle = {
        /**月度订单量 */
        getMonthlyFluctuationChart: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.getMonthlyFluctuationChart(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },

        /**线路订单量占比 */
        getLineOrderResult: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.getLineOrderResult(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },

        /**始发省份占比 */
        getOriginProvinceResult: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.getOriginProvincesProportionResult(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /**送达省份占比 */
        getDestinationProvinceResult: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.getDestinationProvinceProportionResult(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /**常用车辆占比 */
        getVehicleTypeResult: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.getVehicleTypeResult(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /**成本分析 */
        Get12MonthsReceivableTotalPrice: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.Get12MonthsReceivableTotalPrice(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },

        GetOrderLineTop10Receivable: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.GetOrderLineTop10Receivable(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        GetOrderReceivableFeeType: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.GetOrderReceivableFeeType(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        GetOrderReceivableLineTop5MonthQuality: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.GetOrderReceivableLineTop5MonthQuality(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        GetOrderReceivableLineTop5Month: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.GetOrderReceivableLineTop5Month(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /**质量分析 */
        getRate: function () {
            Vue.use(VueResource);
            
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.getRate(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        getResponseRate: function () {
            Vue.use(VueResource);
            
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.getResponseRate(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        /* 麦当劳 */
        getRateMDL: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.getRateMDL(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
        getResponseRateMDL: function () {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.DataAnalysisApiControlle.getResponseRateMDL(), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                return response;
            })
        },
    }

    /**电子回单 */
    var OrderExternalApiControlle = {
        //获取订单详情
        getOrder: function (id: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.OrderExternalApiControlle.getOrder(id), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        getContractDetail: function (econtractId: string) {
            Vue.use(VueResource);
            return Vue.http.get(baseUrl + routeService.OrderExternalApiControlle.getContractDetail(econtractId), {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function (response) {
                var data = response.data['data'];
                return data;
            }, function (response) {
                // handle error
                return response;
            })
        },
        downloadContract: function (eContractId) {
            Vue.use(VueResource);
            return Vue.http.post(baseUrl + routeService.OrderExternalApiControlle.downloadContract(), { "eContractId": eContractId }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: false
            }).then(function (response) {
                var data = response.data;
                return data;
            }, function (response) {
                return response;
            })
        },
    }

    return {
        upload: upload,
        Storage: Storage,
        Attachment: Attachment,
        Area: Area,
        CspInquiry: CspInquiry,
        CspOrder: CspOrder,
        CustomerRepresentative: CustomerRepresentative,
        Goods: Goods,
        GoodsType: GoodsType,
        Inquiry: Inquiry,
        LinePrice: LinePrice,
        Location: Location,
        Order: Order,
        Project: Project,
        Settle: Settle,
        User: User,
        baseUrl: baseUrl,
        databaseUrl:databaseUrl,
        weUrl: weUrl,
        wxUrl: wxUrl,
        CheckFinance: CheckFinance,
        dataAnalysis: DataAnalysis,
        DataAnalysisMDL: DataAnalysisMDL,
        OrderReceivable: OrderReceivable,
        OrderReceivableMDL: OrderReceivableMDL,
        QualityAnalysis:QualityAnalysis,
        Work:Work,
        ossB:ossB,
        wilddogUrl:wilddogUrl,
        Wxcsporders:Wxcsporders,
        feedback:feedback,
        feeManage:feeManage,
        wxsdk:wxsdk,
        daquan:daquan,
        CheckFinanceApiControlle: CheckFinanceApiControlle,
        DataAnalysisApiControlle: DataAnalysisApiControlle,
        OrderExternalApiControlle: OrderExternalApiControlle
    };
}
