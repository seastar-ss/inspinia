(function ($) {
    var uniqueInt = 0, types = function (obj) {
            var regex = /\[object\s+(\w+)\]/i, tt = Object.prototype.toString.call(obj), re = regex.exec(tt);
            return (re && re.length > 0) ? re[1].toLowerCase() : 'error';
        }, debug = function ($obj) {
            if (console && console.dir) {
                console.dir($obj);
            }
        }, logger = function (level) {
            var config = {
                DEBUG: 0,
                INFO: 1,
                WARN: 2,
                ERROR: 3,
                level: level,
                methodMap: {
                    0: 'debug',
                    1: 'info',
                    2: 'warn',
                    3: 'error'
                }
            };
            return function (level, obj) {
                if (config.level <= level) {
                    var method = config.methodMap[level];
                    if (dMode && typeof console !== 'undefined' && console[method]) {
                        console[method].call(console, obj);
                    }
                }
            };
        }, ajaxErrorHandler = {
            '400': function (obj, s) {
                projectLib.alert("\u8bf7\u68c0\u67e5\u60a8\u7684\u8f93\u5165\u662f\u5426\u6b63\u786e\uff0c\u6216\u8005\u53ef\u80fd\u7f51\u7edc\u51fa\u73b0\u4e86\u5f02\u5e38");
            },
            '401': function (obj, s) {
                projectLib.alert("\u60a8\u8fd8\u6ca1\u6709\u767b\u5f55\uff0c\u6216\u8005\u6ca1\u6709\u6743\u9650\u8bbf\u95ee\u8be5\u529f\u80fd");
            },
            '403': function (obj, s) {
                projectLib.alert('\u62b1\u6b49\uff0c\u60a8\u9700\u8981\u5148\u767b\u5f55\u6709\u6b64\u6743\u9650\u7684\u5e10\u53f7\u624d\u80fd\u4f7f\u7528\u8be5\u529f\u80fd,请重新登录');
            },
            '404': function (obj, s) {
                projectLib.alert("\u53ef\u80fd\u60a8\u9700\u8981\u5237\u65b0\u7f51\u9875\uff0c\u6240\u4f7f\u7528\u7684\u6570\u636e\u672a\u627e\u5230");
            },
            '409': function (obj, s) {
                projectLib.alert("\u5f53\u524d\u72b6\u6001\u4e0b\uff0c\u64cd\u4f5c\u65e0\u6cd5\u5b8c\u6210");
            },
            '500': function (obj, s) {
                projectLib.alert("\u7cfb\u7edf\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5");
            },
            '503': function (obj, s) {
                projectLib.alert("\u7cfb\u7edf\u51fa\u9519\uff0c\u8bf7\u91cd\u8bd5");
            },
            '0': function (obj, s) {
                //projectLib.alert("\u6240\u8fde\u63a5\u7684\u7f51\u7ad9\u65e0\u54cd\u5e94\uff0c\u8bf7\u68c0\u67e5\u7f51\u7edc\u8fde\u63a5\u662f\u5426\u6b63\u5e38");
                console.log("网络连接不稳定");
            }
        }, ajax = function (url, param, callback, options) {

            var requestParam, method = "POST", hideLoading = false;
            if (types(param) === "string") {
                requestParam = param;
            } else if (types(param) === "object") {
                requestParam = {};
                requestParam = $.extend({}, param, {
                    t: (new Date()).getTime()
                });
            }
            var errHandler = projectLib.param.ajaxDefaultErrorHandler;
            if (options && options.errHandler !== undefined) {
                errHandler = $.extend(errHandler, options.errHandler);
            }
            if (options && options.method) {
                method = options.method;
            }
            if (options && options.hideLoading !== undefined) {
                hideLoading = options.hideLoading;
            }
            var requestObj = {
                url: url,
                type: method,
                timeout: 80000,
                data: requestParam,
                dataType: "json"
            };
            if (options && options.contentType !== undefined) {
                requestObj.contentType = contentType;
            }
            var request = $.ajax(requestObj);
            var loading;
            if (!hideLoading) {
                loading = __.loading();
            }
            request.done(function (msg) {
                if ($.isFunction(callback)) {
                    //msg = $.trim(msg);
                    callback.apply(this, [msg]);
                }
                if (loading) {
                    loading.modal("hide");
                }
            });
            request.fail(function (jqXHR, textStatus) {
                var s = jqXHR.status;
                if (s in errHandler) {
                    errHandler[s].apply(this, [jqXHR, s]);
                } else {
                    projectLib.alert(url + " \u672a\u77e5\u9519\u8bef\u53d1\u751f");
                }
                if (options && options.retureWhatever) {
                    if ($.isFunction(callback)) {
                        callback.apply(this, ['']);
                    }
                }
                if (loading) {
                    loading.modal("hide");
                }
            });
            return request;
        },
        dialogFactory = function (type, tt) {
            var tag = '-' + (new Date().getTime());
            type = type || 'common-alert', tt = tt || '\u4fe1\u606f';
            var idstr = 'i-' + type + tag;
            var modal;

            if (type === 'alert') {
                modal = '<div class="modal fade in"><div  class="modal-dialog"  id="' + idstr + '"  title="" style="z-index:100000;overflow:hidden;"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" >信息</h4></div><div class="modal-body padding0"></div><div class="modal-footer alert-footer padding0"><button class="btn btn-no btn-success">确定</button></div></div></div></div>';
            } else {
                modal = '<div class="modal fade in"><div  class="modal-dialog"  id="' + idstr + '"  title="" style="z-index:100000;overflow:hidden;"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" >信息</h4></div><div class="modal-body padding0"></div><div class="modal-footer confirm-footer padding0"><button class="btn btn-no" value="取消">取消</button><button type="button" class="btn btn-yes" value="确认">确认</button></div></div></div></div>';
            }

            //projectLib.insertHidenEl(modal, 'info-container');
            var o = $(modal);
            $title = o.find('.modal-title').html(tt);
            var $btn = o.find('.modal-footer .btn-yes').click(function (event) {
                o.modal('hide');
            }), $bt = o.find('.btn-no').click(function (event) {
                o.modal('hide');
            }), $body = o.find('.modal-body')/*, $title = o.find('.modal-header .modal-title')*/;
            //$btn.html('\u786e\u8ba4');$bt.html('\u5426');
            return function (msg, callback, ops) {
                if (callback && types(callback) === 'function') {
                    $btn.html('\u786e\u8ba4').unbind('click').show().click(function () {
                        callback.apply(o, []);
                        o.modal('hide');
                    });
                } else {
                    $btn.hide();
                    if (types(callback) === 'object') {
                        ops = callback;
                    }
                }
                // var param = projectLib.param.dialogDefaultParam;
                if (ops) {
                    if (ops.buttonText) {
                        $btn.html(ops.buttonText);
                    }
                    if (ops.title) {
                        $title.html(ops.title);
                    }
                    if (ops.confirmText) {
                        $btn.html(ops.confirmText);
                    }
                    if (types(ops.prepare) === 'function') {
                        ops.prepare.apply(o, [msg]);
                    }
                    // if (types(ops.param) === 'object') {
                    //     param = $.extend({}, param, ops.param);
                    // }
                }
                if (msg)
                    $body.html("").html(msg);
                $("body").prepend(o);
                o.modal('show');
                return o;
//            o.modal('show');
            };
        }, promptFactory = function (type, tt) {
            var tag = '-' + (new Date().getTime());
            type = type || 'common-alert', tt = tt || '\u4fe1\u606f';
            var idstr = 'i-' + type + tag;
            var modal;
            var autoHide = false;
            if (type === 'miniconfirm') {
                autoHide = true;
                modal = '<div class="modal fade in"><div class="modal-dialog"  id="' + idstr + '"  title="" style="z-index:100000;overflow:hidden;"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" >信息</h4></div><div class="modal-body padding0"></div></div></div></div>';
            } else if (type === 'loading') {
                autoHide = false;
                modal = '<div class="modal fade in"><div  class="modal-dialog"  id="' + idstr + '"  title="" style="z-index:100000;overflow:hidden;"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" >加载中</h4></div><div class="modal-body padding0" style="text-align: center"><img src="/img/loading.gif"/></div></div></div></div>';
            }

            //projectLib.insertHidenEl(modal, 'info-container');
            var o = $(modal);
            o.find('.modal-title').html(tt);
            var $body = o.find('.modal-body');
            //$btn.html('\u786e\u8ba4');$bt.html('\u5426');
            return function (msg, callback, ops) {
                if (msg)
                    $body.html("").html(msg);
                $("body").prepend(o);
                o.modal('show');
                var hidden = ops ? (ops['autoHide'] || autoHide) : autoHide;
                if (hidden) {
                    setTimeout(function () {
                        o.modal('hide');
                    }, 2500);
                }
                return o;
            }
        }, dateParser = function parseDate(input, format, type) {
            format = format || 'yyyy-MM-dd HH:mm:ss'; // default format
            var parts = input.match(/(\d+)/g),
                i = 0, fmt = {};
            // extract date-part indexes from the format
            format.replace(/(yyyy|dd|MM|HH|mm|ss)/g, function (part) {
                fmt[part] = i++;
            });
            if (type)
                return new Date(parts[fmt['yyyy']], parts[fmt['MM']] - 1, parts[fmt['dd']], parts[fmt['HH']], parts[fmt['mm']], parts[fmt['ss']]);
            else
                return new Date(parts[fmt['yyyy']], parts[fmt['MM']] - 1, parts[fmt['dd']]);
        }, dateFormatter = function (ad) {
            if (types(ad) === 'number') {
                ad = new Date(ad);
            } else if (types(ad) === 'string') {
                ad = dateParser(ad);
                if (/Invalid|NaN/i.test(ad)) {
                    return '';
                }
            } else if (types(ad) === 'date') {

            } else {
                return '';
            }
            return ad.getFullYear() + "-" + prefixZero(ad.getMonth() + 1) + "-" + prefixZero(ad.getDate()) + " ";
        }, dateTimeFormatter = function (ad) {
            if (types(ad) === 'number') {
                ad = new Date(ad);
            } else if (types(ad) === 'string') {
                ad = dateParser(ad);
                if (/Invalid|NaN/i.test(ad)) {
                    return '';
                }
            } else if (types(ad) === 'date') {

            } else {
                return '';
            }
            return ad.getFullYear() + "-" + prefixZero(ad.getMonth() + 1) + "-" + prefixZero(ad.getDate()) + " " + prefixZero(ad.getHours()) + ":" + prefixZero(ad.getMinutes());
        }, timeToNow = function (time) {
            time = time + 0;
            if (!time) {
                return '';
            }
            var now = new Date();
            var cur = now.getTime();
            var ss = cur - time;
            ss = ss / 1000;
            if (ss < 60) {
                return ss + "\u79d2\u524d";
            } else if (ss < 3600) {
                return Math.round(ss / 60) + "\u5206\u949f\u524d";
            } else if (ss < 86400) {
                return Math.round(ss / 3600) + "\u5c0f\u65f6\u524d";
            } else if (ss < 864000) {
                return Math.round(ss / 864000) + "\u5929\u524d";
            } else {
                return dateTimeFormatter(time);
            }
        }, prefixZero = function (i) {
            if (types(i) === 'number')
                return i <= 9 ? '0' + i : i;
            else
                return '0' + i;
        }, len = function (obj, flag) {
            var count = 0;
            if (types(obj) === 'array') {
                count = obj.length;
            } else if (types(obj) === 'string') {
                if (flag) {
                    for (var i = 0, n = obj.length; i < n; i++) {
                        if (obj.charCodeAt(i) > 1024) {
                            count += 2;
                        } else {
                            count += 1;
                        }
                    }
                } else {
                    count = obj.length;
                }
            } else if (types(obj) === 'object') {
                if (!flag) {
                    for (var i in obj) {
                        count++;
                    }
                } else {
                    for (var i in obj) {
                        if (obj[i])
                            count++;
                    }
                }
            }
            return count;
        }, wrapWord = function (msg, n, stuff) {
            if (msg.length < n) {
                return msg;
            } else {
                var ret = '';
                while (msg.length > n) {
                    var m = msg.substr(0, n);
                    msg = msg.substr(n);
                    ret += m + stuff;
                }
                ret += msg;
                return ret;
            }
        }, cookieExtractor = function () {
            var reg = /([a-z1-9_]+)=([^=]+)/i;
            return function (str) {
                if (types(str) === "string") {
                    var cookies = str.split(';'), ret = {};
                    for (var k in cookies) {
                        var cookie = cookies[k],
                            items = reg.exec(cookie);
                        if (items && items.length > 1) {
                            var ss = decodeURI(items[2]);
                            ret[items[1]] = ss;
                        }
                    }
                    return ret;
                }
                return {};
            };
        },

        moneyFormat = function (money) {

            return (Math.round(money / 100000000 * 100) / 100) + '亿';

        },
        moneyFormatSmale = function (money) {
            if (money >= 100000000) {
                return Math.round(money / 100000000 * 100) / 100 + '<em class="unit">亿</em>';
            } else if (money >= 10000) {
                return Math.round(money / 10000 * 100) / 100 + '<em class="unit">万</em>';
            } else {
                return money + '<em class="unit">元</em>';
            }
        },

        clipTailNumber = function (str) {
            var arr = str.split("");
            if (arr.length <= 4) {
                return arr.join("");
            } else {
                while (arr.length > 4) {
                    arr.shift();
                }
                return arr.join("");
            }
        },
        datatableLanguage = {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        },
        dataTable = function (el, conf) {
            conf.language = conf.language || datatableLanguage;
            return $(el).DataTable(conf);
        },
        qianfenFormat = function (money) {
            var num = (money * 1).toFixed(2);
            return String(num).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
        },
        scrollTo = function (selector) {
            var $obj;
            if (types(selector) === 'string') {
                $obj = $(selector);
            } else if (types(selector) === 'object') {
                $obj = selector;
            }
            var pos = $obj.position();
            obj.scroll(0, pos.top);
            return $obj;
        }, transToAbsoluteAddr = function (addr) {
            return location.protocol + "//" + location.host + addr;
        }, projectLib = {
            'log': logger(0), //done
            'debug': debug, //done
            'ajax': ajax, //done
            'alert': dialogFactory('alert', '\u786e\u8ba4'),
            'confirm': dialogFactory('confirm', '\u786e\u8ba4'),
            // 'majeconfirm':dialogFactory('confirmmaje', '\u786e\u8ba4'),
            // 'protocol':dialogFactory('protocol','\u786e\u8ba4'),
            'notification': promptFactory('miniconfirm', '\u63d0\u793a'),
            'loading': promptFactory('loading', '加载中'),
            'getType': types,
            'dataTable': dataTable,
            'scrollTo': scrollTo,
            'transToAbsoluteAddr': transToAbsoluteAddr,
            _time_limit: 1609372800000,
            //'init': init,
//        'widget': {
//            'form': form(),
//            'dataTable': dataTables,
//            'datePicker': datepicker,
//            'autoComplete': autoComplete
//        },
            'param': {
//            datePickerDefaultParam: datePickerDefaultParam,
                dataTablesLanguage: datatableLanguage,
                ajaxDefaultErrorHandler: ajaxErrorHandler,
                // dialogDefaultParam: dialogDefaultParam
            },
            'util': {
                'dateFormatter': dateFormatter,
                'dateTimeFormatter': dateTimeFormatter,
                'timeToNow': timeToNow,
                'prefixZero': prefixZero,
                'len': len,
                'cookieEx': cookieExtractor(),
                'wrapWord': wrapWord,
                'money': moneyFormat,
                'smalemoney': moneyFormatSmale
            },
            'config': {}
        };
    if (window.__ === undefined) {
        window.__ = projectLib;
    } else {
        alert("js error");
    }
    return projectLib;
})($);
