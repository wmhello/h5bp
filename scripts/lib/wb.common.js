/**
 * Created by v-boguan on 2015/2/15.
 */

(function ($) {
    if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function (fileData) {
            var binary = "";
            var pt = this;
            var reader = new FileReader();
            reader.onload = function (e) {
                var bytes = new Uint8Array(reader.result);
                var length = bytes.byteLength;
                for (var i = 0; i < length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                pt.content = binary;
                $(pt).trigger('onload');
            }
            reader.readAsArrayBuffer(fileData);
        }
    }
    if (!ArrayBuffer.prototype.slice) {
        //Returns a new ArrayBuffer whose contents are a copy of this ArrayBuffer's
        //bytes from `begin`, inclusive, up to `end`, exclusive
        ArrayBuffer.prototype.slice = function (begin, end) {
            //If `begin` is unspecified, Chrome assumes 0, so we do the same
            if (begin === void 0) {
                begin = 0;
            }

            //If `end` is unspecified, the new ArrayBuffer contains all
            //bytes from `begin` to the end of this ArrayBuffer.
            if (end === void 0) {
                end = this.byteLength;
            }

            //Chrome converts the values to integers via flooring
            begin = Math.floor(begin);
            end = Math.floor(end);

            //If either `begin` or `end` is negative, it refers to an
            //index from the end of the array, as opposed to from the beginning.
            if (begin < 0) {
                begin += this.byteLength;
            }
            if (end < 0) {
                end += this.byteLength;
            }

            //The range specified by the `begin` and `end` values is clamped to the
            //valid index range for the current array.
            begin = Math.min(Math.max(0, begin), this.byteLength);
            end = Math.min(Math.max(0, end), this.byteLength);

            //If the computed length of the new ArrayBuffer would be negative, it
            //is clamped to zero.
            if (end - begin <= 0) {
                return new ArrayBuffer(0);
            }

            var result = new ArrayBuffer(end - begin);
            var resultBytes = new Uint8Array(result);
            var sourceBytes = new Uint8Array(this, begin, end - begin);

            resultBytes.set(sourceBytes);

            return result;
        };
    }

    var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };

    var FlagMap = {
        1: 'china',
        2: 'kingdom',
        3: 'hongkong',
        4: 'taiwan',
        5: 'macao'
    };
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    $.getUrlVars = function () {
        var vars = {},
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            if (hash.length == 2 && hash[1].length > 0) {
                vars[hash[0].toLowerCase()] = hash[1];
            }
        }
        return vars;
    };

    var body = $('body');
    Date.prototype.addDays = Date.prototype.addDays || function (days) {
            this.setDate(this.getDate() + days);
            return this;
        }
    window.comm = {
        conventInt: function (value) {
            var i = parseInt(value);
            return isNaN(i) ? null : i;
        },
        toDate: function (longtime, formatstr) {
            if (longtime == 0) {
                return '';
            }
            formatstr = formatstr || 'yyyy-MM-dd';
            var date = this.parseDate(longtime);
            return date.format(formatstr);
        },
        parseDate: function (longtime) {
            var date = new Date((longtime - 621355968000000000) * 0.0001);
            return date;
        },
        toDecimal: function (value, num) {
            num = num || 2;
            value = parseFloat(value);
            return isNaN(value) ? '0.00' : value.toFixed(num);
        },
        getIP: function (ip, callback) {
            var ipapi = 'http://ip-api.com/json{0}?fields=country,countryCode,city,timezone,query&callback=?';
            if ($.isFunction(ip)) {
                callback = ip;
                ip = '';
            }
            $.getJSON(ipapi.format(ip), function (data) {
                callback(data);
            });
        },
        getFlag: function (CountryId) {
            return FlagMap[CountryId];
        },
        guid: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        stripTags: function (html, limit, ellipsis) {
            ellipsis = ellipsis || '';
            var text = html.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '');
            if (limit) {
                return text.length > limit ? text.substr(0, limit) + ellipsis : text;
            }
            return text;
        },
        highLight: function (doc, keyword) {
            var doc = $(doc);
            var content = doc.html();
            if ($.trim(keyword) == "") {
                return;
            }
            var htmlReg = new RegExp('\<.*?\>', 'i');
            var arrA = new Array();
            for (var i = 0; true; i++) {
                var m = htmlReg.exec(content);
                if (m) {
                    arrA[i] = m;
                } else {
                    break;
                }
                content = content.replace(m, '{[(' + i + ')]}');
            }
            var words = unescape(keyword.replace(/\+/g, ' ')).split(/\s+/);
            for (w = 0; w < words.length; w++) {
                var r = new RegExp("(" + words[w].replace(/[(){}.+*?^$|\\]/g, "\\$&") + ")", "ig");
                content = content.replace(r, '<span class="highlight-keyword">' + words[w] + '</span>');
            }
            for (var i = 0; i < arrA.length; i++) {
                content = content.replace('{[(' + i + ')]}', arrA[i]);
            }
            doc.html(content);
        },
        linkOpenTab: function (url) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent('click', true, true);
            var a = $('<a>').attr({
                target: '_blank',
                href: url
            }).appendTo('body');
            a.get(0).dispatchEvent(evt);
            /*if (navigator.userAgent.search('firefox', 'i') > -1) {*/
            a.get(0).click();
            a.detach()
            /*}*/
        },
        fly: function (flyer, flyingTo, callback) {
            var $func = $(this);
            var divider = 3;
            var flyerClone = $(flyer).clone();
            $(flyerClone).css({
                position: 'absolute',
                top: $(flyer).offset().top + "px",
                left: $(flyer).offset().left + "px",
                opacity: 1,
                'z-index': 1000
            });
            $('body').append($(flyerClone));
            var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width() / divider) / 2;
            var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - ($(flyer).height() / divider) / 2;

            $(flyerClone).animate({
                opacity: 0.4,
                left: gotoX,
                top: gotoY,
                width: $(flyer).width() / divider,
                height: $(flyer).height() / divider
            }, 700, function () {
                $(flyingTo).fadeOut('fast', function () {
                    $(flyingTo).fadeIn('fast', function () {
                        $(flyerClone).fadeOut('fast', function () {
                            $(flyerClone).remove();
                            callback()
                        });
                    });
                });
            });
        },
        imgLoad: function (img, isNew) {
            var parent = $(img).parents('[data-parent]');
            var image = {width: img.width, height: img.height};
            if (isNew) {
                var path = $(img).attr('src');
                var newImg = new Image();
                newImg.onload = function () {
                    image = {width: newImg.width, height: newImg.height};
                    setSize()
                };
                newImg.src = path;
            } else {
                setSize();
            }

            function setSize() {
                var FitWidth = parent.width();
                var FitHeight = parent.height();
                var height = (image.height * FitWidth) / image.width;
                var width = (image.width * FitHeight) / image.height;
                if (height > FitHeight) {
                    var h = (height - FitHeight) / 2;
                    img.width = FitWidth;
                    if (h < FitHeight) {
                        img.style.marginTop = -h + 'px';
                    }
                } else {
                    img.style.marginLeft = -(width - FitWidth) / 2 + 'px';
                    img.height = FitHeight
                }
            }

        },
        balanceType: function (type) {
            switch (type) {
                case 1:
                    return '账户充值';
                    break;
                case 2:
                    return '兑换积分';
                    break;
                case 3:
                    return '退款';
                    break;
                case 4:
                    return '商品付款';
                    break;
                case 5:
                    return '物流付款';
                    break;
                case 6:
                    return '资金转入';
                    break;
                case 7:
                    return '资金转出';
                    break;
                case 8:
                    return '返利';
                    break;
                default:
                    return '';
                    break;
            }
        },
        addValidateMae: function () {
            $.validator.addMethod('requiredtirm', function (value, element, params) {
                value = $.trim(value);
                return value.length > 0;
            });
            $.validator.addMethod('username', function (value, element, params) {
                var isuser = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[_\a-zA-Z0-9]|[\s]){4,16}$/gi.test(value);
                var s = 0;
                for (var i = 0; i < value.length; i++) {
                    if (value.charAt(i).match(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/)) {
                        s += 2;
                    } else {
                        s++;
                    }
                }
                return this.optional(element) || (s <= 16 && isuser)
            });
            $.validator.addMethod("isNEqZero", function (value, element) {
                value = parseInt(value);
                return this.optional(element) || value != 0;
            });
            $.validator.addMethod("notNull", function (value, element) {
                return this.optional(element) || $.trim(value).length > 0;
            });
            $.validator.addMethod('englishname', function (value, element, params) {
                return this.optional(element) || /^([\\ _a-zA-Z0-9]|[\s]){4,48}$/gi.test(value);
            });
            $.validator.addMethod('englishaddress2', function (value, element, params) {
                return this.optional(element) || /^[ ^`~!@$%^&()+=|\\\][\]\{\}:;'\,.<>?\w-]{0,24}$/g.test(value);
            });
            $.validator.addMethod('englishaddress', function (value, element, params) {
                return this.optional(element) || /^[\\ \w,-]{4,24}(\s[\\ \w,-]{0,24}){0,2}/g.test(value);
            });
            $.validator.addMethod('chineseAddress', function (value, element, params) {
                return this.optional(element) || /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0]){2}/gi.test(value);
            });
            $.validator.addMethod('englishzip', function (value, element, params) {
                return this.optional(element) || /^([A-PR-UWYZa-pr-uwyz]([0-9]{1,2}|([A-HK-Ya-hk-y][0-9]|[A-HK-Ya-hk-y][0-9]([0-9]|[ABEHMNPRV-Yabehmnprv-y]))|[0-9][A-HJKS-UWa-hjks-uw])\ {0,1}[0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}|([Gg][Ii][Rr]\ 0[Aa][Aa])|([Ss][Aa][Nn]\ {0,1}[Tt][Aa]1)|([Bb][Ff][Pp][Oo]\ {0,1}([Cc]\/[Oo]\ )?[0-9]{1,4})|(([Aa][Ss][Cc][Nn]|[Bb][Bb][Nn][Dd]|[BFSbfs][Ii][Qq][Qq]|[Pp][Cc][Rr][Nn]|[Ss][Tt][Hh][Ll]|[Tt][Dd][Cc][Uu]|[Tt][Kk][Cc][Aa])\ {0,1}1[Zz][Zz]))$/.test(value);
            });
            $.validator.addMethod('chinesename', function (value, element, params) {
                return this.optional(element) || /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[.]){2,8}$/gi.test(value) && !/(女士)/gi.test(value);
            });
            $.validator.addMethod('chinesename2', function (value, element, params) {
                return this.optional(element) || /^([\\ _a-zA-Z0-9\s]|[\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[.]){2,48}$/gi.test(value) && !/(女士)/gi.test(value);
            });
            $.validator.addMethod('isAllNumber', function (value, element, params) {
                return this.optional(element) || !/[^0-9]/g.test(value);
            });
            $.validator.addMethod('isPhoneNumber', function (value, element, params) {
                return this.optional(element) || /^\d{11}$/g.test(value)
            });
            $.validator.addMethod('email2', function (value, element, params) {
                return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
            });
            $.validator.addMethod('zhzip', function (value, element, params) {
                var isValidate = false;
                if (element) {
                    var citise = $(element).parents('form:eq(0)').find('#Location').data('cities');
                    var code = citise[3].ItemCode;
                    if (code) {
                        if (code.search(/^710/g) > -1) {
                            isValidate = /^(1[0-9]|[0-9])\d{0,2}$/.test(value);
                        } else if (code.search(/^810/g) > -1) {
                            isValidate = true;
                        } else {
                            isValidate = /^(0[1-9]|[1-9][0-9])\d{4}$/.test(value);
                        }
                    } else {
                        isValidate = /^(0[1-9]|[1-9][0-9])\d{4}$/.test(value);
                    }
                } else {
                    isValidate = /^(0[1-9]|[1-9][0-9])\d{4}$/.test(value);
                }

                return isValidate;
            });
            $.validator.addMethod('zhzipx', function (value, element, params) {
                return /^(\d){3,6}$/.test(value);
            });

            $.validator.addMethod('isCardNo', function (value, element, params) {
                var isValidat = true;
                if (!/^\d{17}(\d|x)$/i.test(value)) {
                    isValidat = false;
                } else {
                    var txtIDCARD = value.replace(/x$/i, 'a');
                    if (aCity[parseInt(txtIDCARD.substr(0, 2))] == null) {
                        isValidat = false;
                    } else {
                        var iSum = 0;
                        for (var i = 17; i >= 0; i--) {
                            iSum += (Math.pow(2, i) % 11) * parseInt(txtIDCARD.charAt(17 - i), 11)
                        }
                        if (iSum % 11 != 1) {
                            isValidat = false;
                        }
                    }
                }
                return this.optional(element) || isValidat;
            });
            $.validator.addMethod('city', function (value, element, params) {
                var city = $(element).data('city');
                var is_validator = false;
                if (city) {
                    if (city[1].ItemName && city[2].ItemName && city[3].ItemName) {
                        is_validator = true;
                    }
                }
                return is_validator;
            });
        },
        alert: function (title, text, fun, isbackdrop) {
            fun = fun || new Function();
            var alert = $('body').Dialog({
                title: title,
                body: text,
                footer: $('<button class="btn btn-primary">确定</button>').click(function (e) {
                    fun();
                    alert.layout.modal('hide');
                }),
                isbackdrop: isbackdrop || false,
                modal: 'modal-sm'
            });
        },
        confirm: function (title, text, fun, isbackdrop) {
            fun = fun || new Function();
            var alert = $('body').Dialog({
                title: title,
                body: text,
                footer: [
                    $('<a href="javascript:;" class="btn btn-default">取消</a>').click(function (e) {
                        alert.layout.detach();
                    }),
                    $('<a href="javascript:;" class="btn btn-primary">确定</a>').click(function (e) {
                        fun();
                        alert.layout.detach();
                    })
                ],
                isbackdrop: isbackdrop || false,
                modal: 'modal-sm'
            });
        },
        modal: function (options) {
            this.params = {
                title: '',
                body: '',
                footer: '',
                modal: '',
                hide: function (e) {
                },
                show: function (e) {
                }
            }
            $.extend(true, this.params, options || {});
            var tmpl = $('<div class="modal fade"  role="dialog" >\
                <div class="modal-dialog {modal}">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                            <h4 class="modal-title">{title}</h4>\
                        </div>\
                        <div class="modal-body">\
                            {body}\
                        </div>\
                        <div class="modal-footer">\
                        </div>\
                     </div>\
                </div>\
            </div>'.format(this.params));
            tmpl.find('.modal-footer').append(this.params.footer);

            var _self = this;
            tmpl.on('hidden.bs.modal', function (e) {
                _self.params.hide(e);
                e.target.remove();
            })
            tmpl.on('show.bs.modal', function (e) {
                _self.params.show(e);
            });
            tmpl.modal('show');
            return tmpl;
        },
        appenderror: function (errmsg, ele) {
            var input = $(ele).val('');
            var cgroup = input.parents('.form-group').removeClass('has-success has-error has-feedback');
            cgroup.find('span[role!="captcha"]').remove();
            input.parents('.form-group').addClass('has-error has-feedback');
            input.after('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
            var err = $('<span class="control-label">').text(errmsg)
            cgroup.find('div:eq(0)').append(err);
        },
        JFrome: function (url, target, data) {
            var inputs = [];
            var form_data = $.param(data).split('&');
            $.each(form_data, function (i, value) {
                var key_value = value.split('=');
                inputs.push(jQuery('<input>', {
                    name: decodeURIComponent(key_value[0]),
                    value: decodeURIComponent((key_value[1] || '').replace(/\+/g, ' ')),
                    type: 'hidden'
                }));
            })
            var newForm = $('<form>', {
                action: url,
                target: target,
                method: 'POST'
            }).append(inputs).appendTo('body');
            newForm.submit();
            if (target == '_blank') {
                newForm.detach();
            }
        }
    }
    $.fn.wbmask = function (cla) {
        var mask = $('<div class="wb-backdrop">').addClass(cla);
        return mask.appendTo('body');
    }

    var $d = $(document).bind('showCartsAmount', function (e, dd) {
        var data = $d.data('amount') || {
                ResultCode: 3
            };
        if (!data.ResultCode) {
            $('[data-type="cartcount"]').text(data.PendingShipments + data.PendingWarehouseOrders + data.PendingProductOrders);
            //$('[data-amount="shipments"]').text('(' + data.PendingShipments + ')');
            $('[data-amount="warehouse"]').text('(' + data.PendingWarehouseOrders + ')');
            //$('[data-amount="product"]').text('(' + data.PendingProductOrders + ')');
        }
    }).bind('showClamp', function (e) {
        if (window.$clamp) {
            $('[data-clamp]:not([data-role="clamp"])').each(function (i, o) {
                var clamp = $(o).data('clamp');
                $clamp(o, {clamp: clamp});
                $(o).attr('data-role', 'clamp');
            });
        }
    });

    function LoadAllShoppingCartsAmount() {
        services.getAllShoppingCartsAmount.get({v: Math.random()}, function (data) {
            $d.data({
                amount: data
            });
            $d.trigger('showCartsAmount');
        })
    }

    LoadAllShoppingCartsAmount();
    setInterval(LoadAllShoppingCartsAmount, 45000);

    function partner() {
        var partner = $('.wb-partner-list');
        if (partner.length > 0) {
            var ul = partner.find('ul');

            partner.on('click', '.prev a', function (e) {
                e.preventDefault();
                var scrollWidth = ul.get(0).scrollWidth;
                if (ul.scrollLeft() > 0) {
                    //ul.scrollLeft(ul.scrollLeft() - ul.width());
                    var left = ul.scrollLeft() - ul.width();
                    left = left > 0 ? left : 0;
                    ul.animate({
                        scrollLeft: (left) + 'px'
                    }, 800);
                }
            }).on('click', '.next a', function (e) {
                e.preventDefault();
                var scrollWidth = ul.get(0).scrollWidth;
                if (scrollWidth > ul.scrollLeft() + ul.width()) {
                    ul.animate({
                        scrollLeft: (scrollWidth - ul.scrollLeft() + ul.width()) + 'px'
                    }, 800);
                }
            })
        }
    }

    function likeblog(id) {
        return services.api.like.post({id: id});
    }

    $(function () {
        var exchenage = $('[data-exchangerate]');
        if (exchenage.length > 0) {
            services.exchangerate.get({v: Math.random()}, function (data) {
                exchenage.text('今日汇率：£1.00 = ¥' + comm.toDecimal(data.ExchangeRate, 4));
                exchenage.data({CNY: data.ExchangeRate});
            })
        }

        var backtoolbar = $('<div class="wb-back-toolbar"><div class="wb-back-box"><div class="wb-back-list"><ul><li data-action="top"><a class="wb-back-icon"><img src="/images/top.png"></a><a class="wb-back-text">回到顶部</a></li></ul></div></div></div>');
        backtoolbar.appendTo('body');
        backtoolbar.on('click', 'li[data-action]', function (e) {
            var li = $(this);
            var action = li.data('action');
            if (action == 'top') {
                $('html, body').animate({scrollTop: 0});
            } else {
                $('html, body').animate({scrollTop: $('.wb-home-main div[data-backname="' + action + '"]').offset().top});
            }
        });

        $('body').on('click', 'a[data-like]', function (e) {
            var a = $(this);
            var id = a.data('like');
            var value = a.find('[data-count]').data('count');
            likeblog(id).then(function (data) {
                if (data.Success) {
                    value = value + 1;
                    $('a[data-like="' + id + '"]>[data-count]').data({count: value}).text(value);
                } else {
                    comm.modal({
                        title: '提示',
                        body: data.Message,
                        footer: '<button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>',
                        modal: 'modal-sm'
                    });
                }
            });
        })
        var handler = function (hash) {
            var target = document.getElementById(hash.slice(1));
            if (!target) return;
            var targetOffset = $(target).offset().top;
            $('html,body').animate({scrollTop: targetOffset}, 400);

        }
        $('a[href^=#][href!=#]').click(function (e) {
            e.preventDefault();
            handler(this.hash)
        });

        if (location.hash) {
            handler(location.hash)
        }
        services.api.announcement.post({}, function (data) {
            if ($.isArray(data) && data.length > 0) {
                var div = $('<div class="wb-announce carousel slide"><ul class="carousel-inner" role="listbox"></ul></div>');
                var ul = div.find('ul');
                $.each(data, function (i, item) {
                    ul.append('<li class="item"><a href="/blog-' + item.Id + '"><span class="glyphicon glyphicon-volume-up"> ' + item.Title + '</span></a></li>');
                });
                ul.find('li:eq(0)').addClass('active');
                div.appendTo('#wb_topmenu>.wb-menu')
                div.carousel({
                    interval: 5000
                });
            }
        });

        partner();
        if (window.location.hash) {
            $('a[href="' + window.location.hash + '"]').trigger('click');
        }
        $('.wb-dropdown').on('click', '.form-control', function (e) {
            e.stopPropagation();
            $(this).next().find('[data-toggle="dropdown"]').dropdown('toggle');
        }).on('change', 'input:radio', function (e) {
            var radio = $(this);
            radio.parents('.wb-dropdown-btn').prev().text(radio.val());
        });
        $('.wb-dropdown-btn').on('shown.bs.dropdown', function (e) {
            var drop = $(this).parents('.wb-dropdown').addClass('focus').removeClass('has-feedback has-success has-error');
            drop.children('span').detach();
        }).on('hidden.bs.dropdown', function (e) {
            $(this).parents('.wb-dropdown').removeClass('focus');
        });
        $d.trigger('showClamp');
        $d.trigger('showCartsAmount');
        var pages = $('[data-provide="paginator"]');
        if (pages.bootstrapPaginator) {
            pages.each(function (i, o) {
                var page = $(o);
                var count = page.data('count');
                var index = page.data('index');
                var cla = page.data('class');
                var curentPage = page.data('size') || 10;
                var totalPages = parseInt(count / curentPage) + (count % curentPage == 0 ? 0 : 1);
                if (count > 0) {
                    page.bootstrapPaginator({
                        currentPage: index,
                        totalPages: totalPages,
                        alignment: 'right',
                        listContainerClass: cla,
                        size: "normal",
                        numberOfPages: 5,
                        pageUrl: function (type, page, current) {
                            var querys = $.getUrlVars();
                            querys['page'] = page;
                            return location.pathname + '?' + $.param(querys);
                        }
                    });
                }
            })
        }
    });
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $.fn.scrollQ = function (options) {
        var defaults = {
            speed: 40, //滚动速度,值越大速度越慢
            rowHeight: 24 //每行的高度
        };

        var opts = $.extend({}, defaults, options),
            intId = [];

        function marquee(obj, step) {

            obj.find(".scrollup").animate({
                marginTop: '-=1'
            }, 0, function () {
                var s = Math.abs(parseInt($(this).css("margin-top")));
                if (s >= step) {
                    $(this).find(".media").slice(0, 1).appendTo($(this));
                    $(this).css("margin-top", 0);
                }
            });
        }

        this.each(function (i) {
            var sh = opts["rowHeight"],
                speed = opts["speed"],
                _this = $(this);
            intId[i] = setInterval(function () {
                if (_this.find(".scrollup").height() <= _this.height()) {
                    clearInterval(intId[i]);
                } else {
                    marquee(_this, sh);
                }
            }, speed);

            _this.hover(function () {
                clearInterval(intId[i]);
            }, function () {
                intId[i] = setInterval(function () {
                    if (_this.find(".scrollup").height() <= _this.height()) {
                        clearInterval(intId[i]);
                    } else {
                        marquee(_this, sh);
                    }
                }, speed);
            });

        });

    }
})
(jQuery);
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof(args) == 'object') {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp('({' + key + '})', 'g');
                    result = result.replace(reg, args[key]);
                } else if (args[key] == null) {
                    var reg = new RegExp('({' + key + '})', 'g');
                    result = result.replace(reg, '');
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp('({[' + i + ']})', 'g');
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        'use strict';
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
/**
 * Created by fendoe on 2015/3/7.
 */

Date.prototype.format = function (mask) {
    var d = this;
    var zeroize = function (value, length) {
        if (!length) length = 2;
        value = String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
        }
        return zeros + value;
    };
    var test = /"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g;
    return mask.replace(test, function (obj) {
        switch (obj) {
            case 'd':
                return d.getDate();
            case 'dd':
                return zeroize(d.getDate());
            case 'ddd':
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
            case 'dddd':
                return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
            case 'M':
                return d.getMonth() + 1;
            case 'MM':
                return zeroize(d.getMonth() + 1);
            case 'MMM':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
            case 'MMMM':
                return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
            case 'yy':
                return String(d.getFullYear()).substr(2);
            case 'yyyy':
                return d.getFullYear();
            case 'h':
                return d.getHours() % 12 || 12;
            case 'hh':
                return zeroize(d.getHours() % 12 || 12);
            case 'H':
                return d.getHours();
            case 'HH':
                return zeroize(d.getHours());
            case 'm':
                return d.getMinutes();
            case 'mm':
                return zeroize(d.getMinutes());
            case 's':
                return d.getSeconds();
            case 'ss':
                return zeroize(d.getSeconds());
            case 'l':
                return zeroize(d.getMilliseconds(), 3);
            case 'L':
                var m = d.getMilliseconds();
                if (m > 99) m = Math.round(m / 10);
                return zeroize(m);
            case 'tt':
                return d.getHours() < 12 ? 'am' : 'pm';
            case 'TT':
                return d.getHours() < 12 ? 'AM' : 'PM';
            case 'Z':
                return d.toUTCString().match(/[A-Z]+$/);
            default:
                return obj.substr(1, $0.length - 2);
        }
    });
};


(function ($) {
    var Dialog = function (select, options) {
        this.params = {
            title: '',
            body: '',
            footer: '',
            modal: '',
            isbackdrop: false,
            show: function () {
            }
        }
        $.extend(true, this.params, options || {});
        this.layout = $('<div class="modal fade"  role="dialog" >\
                <div class="modal-dialog {modal}">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                            <h4 class="modal-title">{title}</h4>\
                        </div>\
                        <div class="modal-body">\
                            {body}\
                        </div>\
                        <div class="modal-footer">\
                        </div>\
                     </div>\
                </div>\
            </div>'.format(this.params));
        this.layout.find('.modal-footer').append(this.params.footer);
        var _self = this;
        this.init();
    }
    Dialog.prototype = {
        init: function () {
            var _self = this;

            if (_self.params.isbackdrop) {
                _self.layout.attr({'data-backdrop': false}).prepend('<div class="modal-backdrop in"></div>');
            }

            _self.layout.on('hidden.bs.modal', function (e) {
                e.target.remove();
            });
            _self.layout.on('show.bs.modal', function (e) {
                _self.params.show(e);
            });
            _self.layout.modal('show');
        }
    }
    $.fn.Dialog = function (options) {
        if ($(this).length > 1) {
            var _instances = [];
            $(this).each(function (i) {
                _instances[i] = new Dialog(this, options);
            });
            return _instances;
        } else {
            return new Dialog(this, options);
        }
    }
    if (!jQuery.fn.dialog) {
        $.fn.dialog = $.fn.Dialog;
    }
})(jQuery);
