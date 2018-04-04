/**
 * Created by v-boguan on 2015/2/16.
 */

(function ($) {
    var config = {
        apiurl: '',
        services: {
            login: ['post'],
            checkusername: ['post'],
            register: ['post'],
            findaddress: ['post'],
            address: ['post', 'delete'],
            changepassword: ['post'],
            customerupdate: ['post'],
            redbonusclaim: ['post'],
            exchangerate: ['get'],
            rewardpointsredeem: ['post'],
            balances: ['post'],
            addresslist: ['post'],
            redenvelop: ['post'],
            islogin: ['post'],
            shipmentaddtocart: ['post'],
            deleteshipment: ['post'],
            calcshipmentdiscountamount: ['post'],
            cart: ['post'],
            getpickuptypebyservice: ['post'],
            domesticservice: ['post'],
            updateshipment: ['post'],
            volley: ['post'],
            luggage: ['post'],
            shoppingtocart: ['post', 'put'],
            milkvolley: ['post'],
            searchorder: ['post'],
            deleteorder: ['post'],
            calcorderdiscountamount: ['post'],
            packagetocart: ['post'],
            milkgroup: ['post'],
            addhaitaotoCart: ['post'],
            addProductToCart: ['post'],
            getAllShoppingCartsAmount: ['get'],
            deleteShoppingCartProduct: ['post'],
            deleteAllShoppingCartProduct: ['post'],
            updateShoppingCartProduct: ['post'],
            mergeOrder: ['post'],
            splitOrder: ['post'],
            settleOrder: ['post'],
            returnItemInOrder: ['post'],
            orderpayment: ['post'],
            haitaoorderpayment: ['post'],
            UpdateStatus: ['post'],
            getblogs: ['post'],
            forgetpassword: ['post'],
            passwordrecovery: ['post'],
            activity: ['post'],
            Topic: ['post'],
            insertblogcomment: ['post'],
            AddBpostScheduledPickup: ['post'],
            calctransportdiscountamount: ['post'],
            contactus: ['post'],
            internationalPricesQuoteList: ['get'],
            shipmentOrederAll: ['post'],
            delallcart: ['post'],
            sendemail: ['post'],
            downloadmergedlabels: ['post'],
            downloadlabels: ['get'],
            serviceproviders: ['get'],
            api: {
                topic: ['post'],
                logistics: {
                    costing: ['post'],
                    chooseservices: ['post'],
                    domestics: ['post'],
                    batch: ['post']
                },
                payment: {
                    value_account: {
                        logistics: ['post'],
                        mall: ['post'],
                        transport: ['post'],
                        directmail: ['post'],
                        payment: ['post']
                    },
                    bank: {
                        logistics: ['post'],
                        mall: ['post'],
                        transport: ['post'],
                        directmail: ['post'],
                        recharge: ['post'],
                        payment: ['post']
                    }
                },
                shareorder: ['post'],
                balances: {
                    bank: ['post']
                },
                common: {
                    milkgroup: ['get', 'post'],
                    tuangou_costing: ['post'],
                    subscribe: ['post']
                },
                customer: {
                    debts: ['post'],
                    couponcodeforpopup: ['post']
                },
                announcement: ['post'],
                like: ['post'],
                promotionredeemhistory: ['post'],
                address: {
                    view: ['get'],
                    list: ['post']
                }
            }
        }
    };

    function FactoryAPI() {
        function API(obj, name) {
            var key;
            var getCmd = {};
            if (obj instanceof Array) {
                for (key in obj) {
                    getCmd[obj[key]] = API(obj[key], name)
                }
                return getCmd;
            } else if (obj instanceof Object) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (key == '') {
                            getCmd = API(obj[key], name)
                        } else {
                            getCmd[key] = API(obj[key], name + '/' + key);
                        }
                    }
                }
                return getCmd;
            } else {
                return getCmd[obj] = function (query, headers, callback) {
                    if (!callback) {
                        callback = headers;
                        headers = {};
                    }
                    callback = callback || new Function();
                    var url = name;
                    return $.ajax({
                        type: obj,
                        url: url,
                        //dataType: 'json',
                        headers: headers,
                        data: query,
                        success: function (data) {
                            if (data.ErrorCode == 'x99999') {
                                window.location.href = '/login?return=' + window.location.href;
                                callback({error: true});
                            } else {
                                callback(data);
                            }
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            console.log(xhr.responseJSON);
                        }
                    });
                }
            }
        }

        return API(config.services, config.apiurl)
    }

    window.services = FactoryAPI();

    /*window.services = (function () {
     var service = {};
     var api_modulse = config.services;
     var urlp = [config.apiurl];
     var getCmd = function (module, methods) {
     var objCmd = {};
     var url = urlp.concat(module).join('');
     for (var i in  methods) {
     objCmd[methods[i]] = (function (method) {
     return function (query, headers, callback) {
     if (!callback) {
     callback = headers;
     headers = {};
     }
     callback = callback || new Function();
     return $.ajax({
     type: method,
     url: url,
     data: query,
     headers: headers,
     success: function (data) {
     if (data.ErrorCode == 'x99999') {
     window.location.href = '/login?return=' + window.location.href;
     callback({});
     } else {
     callback(data);
     }
     },
     error: function (xhr, ajaxOptions, thrownError) {
     console.log(xhr.responseJSON);
     }
     });
     }
     })(methods[i]);
     }
     return objCmd;
     }
     for (var key in api_modulse) {
     service[key] = {};
     service[key] = (function (module, methods) {
     return getCmd(module, methods)
     })([key], api_modulse[key]);
     }
     return service;
     })(); */
})
(jQuery)