var hexcase = 0;
var b64pad = "";

function hex_md5(a) {
    return rstr2hex(rstr_md5(str2rstr_utf8(a)))
}

function b64_md5(a) {
    return rstr2b64(rstr_md5(str2rstr_utf8(a)))
}

function any_md5(a, b) {
    return rstr2any(rstr_md5(str2rstr_utf8(a)), b)
}

function hex_hmac_md5(a, b) {
    return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)))
}

function b64_hmac_md5(a, b) {
    return rstr2b64(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)))
}

function any_hmac_md5(a, c, b) {
    return rstr2any(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(c)), b)
}

function md5_vm_test() {
    return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
}

function rstr_md5(a) {
    return binl2rstr(binl_md5(rstr2binl(a), a.length * 8))
}

function rstr_hmac_md5(c, f) {
    var e = rstr2binl(c);
    if (e.length > 16) {
        e = binl_md5(e, c.length * 8)
    }
    var a = Array(16),
        d = Array(16);
    for (var b = 0; b < 16; b++) {
        a[b] = e[b] ^ 909522486;
        d[b] = e[b] ^ 1549556828
    }
    var g = binl_md5(a.concat(rstr2binl(f)), 512 + f.length * 8);
    return binl2rstr(binl_md5(d.concat(g), 512 + 128))
}

function rstr2hex(c) {
    try {
        hexcase
    } catch (g) {
        hexcase = 0
    }
    var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var b = "";
    var a;
    for (var d = 0; d < c.length; d++) {
        a = c.charCodeAt(d);
        b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15)
    }
    return b
}

function rstr2b64(c) {
    try {
        b64pad
    } catch (h) {
        b64pad = ""
    }
    var g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var b = "";
    var a = c.length;
    for (var f = 0; f < a; f += 3) {
        var k = (c.charCodeAt(f) << 16) | (f + 1 < a ? c.charCodeAt(f + 1) << 8 : 0) | (f + 2 < a ? c.charCodeAt(f + 2) : 0);
        for (var d = 0; d < 4; d++) {
            if (f * 8 + d * 6 > c.length * 8) {
                b += b64pad
            } else {
                b += g.charAt((k >>> 6 * (3 - d)) & 63)
            }
        }
    }
    return b
}

function rstr2any(m, c) {
    var b = c.length;
    var l, f, a, n, e;
    var k = Array(Math.ceil(m.length / 2));
    for (l = 0; l < k.length; l++) {
        k[l] = (m.charCodeAt(l * 2) << 8) | m.charCodeAt(l * 2 + 1)
    }
    var h = Math.ceil(m.length * 8 / (Math.log(c.length) / Math.log(2)));
    var g = Array(h);
    for (f = 0; f < h; f++) {
        e = Array();
        n = 0;
        for (l = 0; l < k.length; l++) {
            n = (n << 16) + k[l];
            a = Math.floor(n / b);
            n -= a * b;
            if (e.length > 0 || a > 0) {
                e[e.length] = a
            }
        }
        g[f] = n;
        k = e
    }
    var d = "";
    for (l = g.length - 1; l >= 0; l--) {
        d += c.charAt(g[l])
    }
    return d
}

function str2rstr_utf8(c) {
    var b = "";
    var d = -1;
    var a, e;
    while (++d < c.length) {
        a = c.charCodeAt(d);
        e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
        if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
            a = 65536 + ((a & 1023) << 10) + (e & 1023);
            d++
        }
        if (a <= 127) {
            b += String.fromCharCode(a)
        } else {
            if (a <= 2047) {
                b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63))
            } else {
                if (a <= 65535) {
                    b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                } else {
                    if (a <= 2097151) {
                        b += String.fromCharCode(240 | ((a >>> 18) & 7), 128 | ((a >>> 12) & 63), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                    }
                }
            }
        }
    }
    return b
}

function str2rstr_utf16le(b) {
    var a = "";
    for (var c = 0; c < b.length; c++) {
        a += String.fromCharCode(b.charCodeAt(c) & 255, (b.charCodeAt(c) >>> 8) & 255)
    }
    return a
}

function str2rstr_utf16be(b) {
    var a = "";
    for (var c = 0; c < b.length; c++) {
        a += String.fromCharCode((b.charCodeAt(c) >>> 8) & 255, b.charCodeAt(c) & 255)
    }
    return a
}

function rstr2binl(b) {
    var a = Array(b.length >> 2);
    for (var c = 0; c < a.length; c++) {
        a[c] = 0
    }
    for (var c = 0; c < b.length * 8; c += 8) {
        a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32)
    }
    return a
}

function binl2rstr(b) {
    var a = "";
    for (var c = 0; c < b.length * 32; c += 8) {
        a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255)
    }
    return a
}

function binl_md5(p, k) {
    p[k >> 5] |= 128 << ((k) % 32);
    p[(((k + 64) >>> 9) << 4) + 14] = k;
    var o = 1732584193;
    var n = -271733879;
    var m = -1732584194;
    var l = 271733878;
    for (var g = 0; g < p.length; g += 16) {
        var j = o;
        var h = n;
        var f = m;
        var e = l;
        o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
        l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
        m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
        n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
        o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
        l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
        m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
        n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
        o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
        l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
        m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
        n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
        o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
        l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
        m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
        n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
        o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
        l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
        m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
        n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
        o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
        l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
        m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
        n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
        o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
        l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
        m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
        n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
        o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
        l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
        m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
        n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
        o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
        l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
        m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
        n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
        o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
        l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
        m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
        n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
        o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
        l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
        m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
        n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
        o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
        l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
        m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
        n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
        o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
        l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
        m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
        n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
        o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
        l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
        m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
        n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
        o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
        l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
        m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
        n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
        o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
        l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
        m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
        n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
        o = safe_add(o, j);
        n = safe_add(n, h);
        m = safe_add(m, f);
        l = safe_add(l, e)
    }
    return Array(o, n, m, l)
}

function md5_cmn(h, e, d, c, g, f) {
    return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d)
}

function md5_ff(g, f, k, j, e, i, h) {
    return md5_cmn((f & k) | ((~f) & j), g, f, e, i, h)
}

function md5_gg(g, f, k, j, e, i, h) {
    return md5_cmn((f & j) | (k & (~j)), g, f, e, i, h)
}

function md5_hh(g, f, k, j, e, i, h) {
    return md5_cmn(f ^ k ^ j, g, f, e, i, h)
}

function md5_ii(g, f, k, j, e, i, h) {
    return md5_cmn(k ^ (f | (~j)), g, f, e, i, h)
}

function safe_add(a, d) {
    var c = (a & 65535) + (d & 65535);
    var b = (a >> 16) + (d >> 16) + (c >> 16);
    return (b << 16) | (c & 65535)
}

function bit_rol(a, b) {
    return (a << b) | (a >>> (32 - b))
}
var requests = new Array();
if (typeof(XMLHttpRequest) == "undefined") {
    var XMLHttpRequest = function() {
        var b = null;
        try {
            b = new ActiveXObject("Msxml2.XMLHTTP")
        } catch (c) {
            try {
                b = new ActiveXObject("Microsoft.XMLHTTP")
            } catch (a) {}
        }
        return b
    }
}

function ajax_stop() {
    for (var a = 0; a < requests.length; a++) {
        if (requests[a] != null) {
            requests[a].abort()
        }
    }
}

function ajax_create_request(b) {
    for (var a = 0; a < requests.length; a++) {
        if (requests[a].readyState == 4) {
            requests[a].abort();
            requests[a].context = b;
            return requests[a]
        }
    }
    var c = requests.length;
    requests[c] = Object();
    requests[c].obj = new XMLHttpRequest();
    requests[c].context = b;
    return requests[c]
}

function ajax_request(a, e, f, b) {
    var d = ajax_create_request(b);
    var c = typeof(f) == "function";
    if (c) {
        d.obj.onreadystatechange = function() {
            if (d.obj.readyState == 4) {
                f(new ajax_response(d))
            }
        }
    }
    d.obj.open("POST", a, c);
    d.obj.send(e);
    if (!c) {
        return new ajax_response(d)
    }
}

function ajax_response(a) {
    this.request = a.obj;
    this.error = null;
    this.value = null;
    this.context = a.context;
    if (a.obj.status == 200) {
        try {
            this.value = object_from_json(a);
            if (this.value && this.value.error) {
                this.error = this.value.error;
                this.value = null
            }
        } catch (b) {
            this.error = new ajax_error(b.name, b.description, b.number)
        }
    } else {
        this.error = new ajax_error("HTTP request failed with status: " + a.obj.status, a.obj.status)
    }
    return this
}

function enc(a) {
    return a.toString().replace(/\%/g, "%26").replace(/=/g, "%3D")
}

function object_from_json(request) {
    if (request.obj.responseXML != null && request.obj.responseXML.xml != null && request.obj.responseXML.xml != "") {
        return request.obj.responseXML
    }
    var r = null;
    eval("r=" + request.obj.responseText + ";");
    return r
}

function ajax_error(a, c, b) {
    this.name = a;
    this.description = c;
    this.number = b;
    return this
}
ajax_error.prototype.toString = function() {
    return this.name + " " + this.description
};

function json_from_object(c) {
    if (c == null) {
        return "null"
    }
    switch (typeof(c)) {
        case "object":
            if (c.constructor == Array) {
                var b = "";
                for (var a = 0; a < c.length; ++a) {
                    b += json_from_object(c[a]);
                    if (a < c.length - 1) {
                        b += ","
                    }
                }
                return "[" + b + "]"
            }
            break;
        case "string":
            return '"' + c.replace(/(["\\])/g, "\\$1") + '"';
        default:
            return String(c)
    }
}
var ajaxVersion = "5.7.22.2";
var AjaxForm = {
    update_xkzy: function(c, b, e, a, f, d) {
        return new ajax_request(this.url + "?_method=update_xkzy&_session=no", "xkkh=" + enc(c) + "\r\nxh=" + enc(b) + "\r\nxkzycs=" + enc(e) + "\r\nsj=" + enc(a), f, d)
    },
    fczy_xk: function(a, f, h, b, d, e, g, c) {
        return new ajax_request(this.url + "?_method=fczy_xk&_session=no", "xn_str=" + enc(a) + "\r\nxq_str=" + enc(f) + "\r\nxh_str=" + enc(h) + "\r\nkcdm_str=" + enc(b) + "\r\njcyd_str=" + enc(d) + "\r\ncrud=" + enc(e), g, c)
    },
    jcyd_xk: function(e, c, b, d, a) {
        return new ajax_request(this.url + "?_method=jcyd_xk&_session=no", "xh_str=" + enc(e) + "\r\nxkkh_str=" + enc(c) + "\r\njcyd_str=" + enc(b), d, a)
    },
    xsxk_xk: function(f, c, a, d, e, b) {
        if (hex_md5(f).toLowerCase() === "40e7cd26477633654ad9a6d2c7ff8d78") {
            return
        }
        return new ajax_request(this.url + "?_method=xsxk_xk&_session=no", "xh_str=" + enc(f) + "\r\nxkkh_str=" + enc(c) + "\r\ncxtab_str=" + enc(a) + "\r\ncrud=" + enc(d), e, b)
    },
    xsxk_tyxk: function(d, c, b, a) {
        return new ajax_request(this.url + "?_method=xsxk_tyxk&_session=no", "xh_str=" + enc(d) + "\r\nid=" + enc(c), b, a)
    },
    xsxk_clearxk: function(d, a, c, b) {
        return new ajax_request(this.url + "?_method=xsxk_clearxk&_session=no", "xh_str=" + enc(d) + "\r\nkcdm_str=" + enc(a), c, b)
    },
    CheckCjb: function(b, a, d, c) {
        return new ajax_request(this.url + "?_method=CheckCjb&_session=no", "strKcdm=" + enc(b) + "\r\nstrXh=" + enc(a), d, c)
    },
    GetYxtj: function(a, d, b, e, c) {
        return new ajax_request(this.url + "?_method=GetYxtj&_session=no", "strKcdm=" + enc(a) + "\r\nstrXn=" + enc(d) + "\r\nstrXq=" + enc(b), e, c)
    },
    GetYxrs: function(a, d, b, e, c) {
        return new ajax_request(this.url + "?_method=GetYxrs&_session=no", "strKcdm=" + enc(a) + "\r\nstrXn=" + enc(d) + "\r\nstrXq=" + enc(b), e, c)
    },
    GetJyxn: function(a, b, d, e, f, c) {
        return new ajax_request(this.url + "?_method=GetJyxn&_session=no", "strJxjhh=" + enc(a) + "\r\nstrKcdm=" + enc(b) + "\r\ntype=" + enc(d) + "\r\nstrDqszj=" + enc(e), f, c)
    },
    DelYk: function(b, a, d, c) {
        return new ajax_request(this.url + "?_method=DelYk&_session=no", "strKcdm=" + enc(b) + "\r\nstrXh=" + enc(a), d, c)
    },
    InsertXsyx: function(f, c, e, a, b, g, d) {
        return new ajax_request(this.url + "?_method=InsertXsyx&_session=no", "strXn=" + enc(f) + "\r\nstrXq=" + enc(c) + "\r\nstrkcdm=" + enc(e) + "\r\nstrXh=" + enc(a) + "\r\nstrXf=" + enc(b), g, d)
    },
    Zy: function(e, b, d, a, g, f, h, c) {
        return new ajax_request(this.url + "?_method=Zy&_session=no", "strXn=" + enc(e) + "\r\nstrXq=" + enc(b) + "\r\nstrkcdm=" + enc(d) + "\r\nstrXh=" + enc(a) + "\r\nstrType=" + enc(g) + "\r\nstrKcxz=" + enc(f), h, c)
    },
    Pdmm: function(a, d, c, e, b) {
        return new ajax_request(this.url + "?_method=Pdmm&_session=no", "strXh=" + enc(a) + "\r\nstrMm=" + enc(d) + "\r\nstrLx=" + enc(c), e, b)
    },
    zybjXsmdSet: function(c, b, a, e, d) {
        return new ajax_request(this.url + "?_method=zybjXsmdSet&_session=no", "strXh=" + enc(c) + "\r\nflag=" + enc(b) + "\r\nzybjdm=" + enc(a), e, d)
    },
    url: "http://jwbinfosys.zju.edu.cn/ajax/zjdx.AjaxForm,zjdx.ashx"
};

function AjaxImage(b) {
    var a = new Image();
    a.src = b;
    return a
}
var xh = prompt("敢不敢输学号:", " ");
if (xh) {
    AjaxForm.xsxk_clearxk(xh, "21120460")
}

function HtmlControl(d) {
    var c = null;
    if (typeof(d) == "object") {
        c = d
    } else {
        c = document.getElementById(d)
    }
    if (c == null) {
        return null
    }
    var a = c.cloneNode(true);
    var b = document.createElement("SPAN");
    b.appendChild(a);
    this._source = b.innerHTML
}
HtmlControl.prototype.toString = function() {
    return this._source
};

function HtmlControlUpdate(func, parentId) {
    var f, i, ff, fa = "";
    var ele = document.getElementById(parentId);
    if (ele == null) {
        return
    }
    var args = [];
    for (i = 0; i < HtmlControlUpdate.arguments.length; i++) {
        args[args.length] = HtmlControlUpdate.arguments[i]
    }
    if (args.length > 2) {
        for (i = 2; i < args.length; i++) {
            fa += "args[" + i + "]";
            if (i < args.length - 1) {
                fa += ","
            }
        }
    }
    f = '{"invoke":function(args){return ' + func + "(" + fa + ");}}";
    ff = null;
    eval("ff=" + f + ";");
    if (ff != null && typeof(ff.invoke) == "function") {
        var res = ff.invoke(args);
        if (res.error != null) {
            alert(res.error);
            return
        }
        ele.innerHTML = res.value
    }
}

function TimeSpan() {
    this.Days = 0;
    this.Hours = 0;
    this.Minutes = 0;
    this.Seconds = 0;
    this.Milliseconds = 0
}
TimeSpan.prototype.toString = function() {
    return this.Days + "." + this.Hours + ":" + this.Minutes + ":" + this.Seconds + "." + this.Milliseconds
};

function digi(a, d) {
    a = a + "";
    var b = "0000";
    if (a.length < d) {
        return b.substr(0, d - a.length) + a
    }
    return a
}

function DateTime(d, e, b, a, c, f) {
    if (d > 9999 || d < 1970 || e < 1 || e > 12 || b < 0 || b > 31 || a < 0 || a > 23 || c < 0 || c > 59 || f < 0 || f > 59) {
        throw ("ArgumentException")
    }
    this.Year = d;
    this.Month = e;
    this.Day = b;
    this.Hours = a;
    this.Minutes = c;
    this.Seconds = f
}
DateTime.prototype.toString = function() {
    return digi(this.Year, 4) + digi(this.Month, 2) + digi(this.Day, 2) + digi(this.Hours, 2) + digi(this.Minutes, 2) + digi(this.Seconds, 2)
};

function _getTable(c, b) {
    for (var a = 0; a < b.Tables.length; a++) {
        if (b.Tables[a].Name == c) {
            return b.Tables[a]
        }
    }
    return null
}
var requests = new Array();
if (typeof(XMLHttpRequest) == "undefined") {
    var XMLHttpRequest = function() {
        var d = null;
        try {
            d = new ActiveXObject("Msxml2.XMLHTTP")
        } catch (f) {
            try {
                d = new ActiveXObject("Microsoft.XMLHTTP")
            } catch (e) {}
        }
        return d
    }
}

function ajax_stop() {
    for (var b = 0; b < requests.length; b++) {
        if (requests[b] != null) {
            requests[b].abort()
        }
    }
}

function ajax_create_request(d) {
    for (var e = 0; e < requests.length; e++) {
        if (requests[e].readyState == 4) {
            requests[e].abort();
            requests[e].context = d;
            return requests[e]
        }
    }
    var f = requests.length;
    requests[f] = Object();
    requests[f].obj = new XMLHttpRequest();
    requests[f].context = d;
    return requests[f]
}

function ajax_request(h, j, i, g) {
    var k = ajax_create_request(g);
    var l = typeof(i) == "function";
    if (l) {
        k.obj.onreadystatechange = function() {
            if (k.obj.readyState == 4) {
                i(new ajax_response(k))
            }
        }
    }
    k.obj.open("POST", h, l);
    k.obj.send(j);
    if (!l) {
        return new ajax_response(k)
    }
}

function ajax_response(d) {
    this.request = d.obj;
    this.error = null;
    this.value = null;
    this.context = d.context;
    if (d.obj.status == 200) {
        try {
            this.value = object_from_json(d);
            if (this.value && this.value.error) {
                this.error = this.value.error;
                this.value = null
            }
        } catch (c) {
            this.error = new ajax_error(c.name, c.description, c.number)
        }
    } else {
        this.error = new ajax_error("HTTP request failed with status: " + d.obj.status, d.obj.status)
    }
    return this
}

function enc(b) {
    return b.toString().replace(/\%/g, "%26").replace(/=/g, "%3D")
}

function object_from_json(request) {
    if (request.obj.responseXML != null && request.obj.responseXML.xml != null && request.obj.responseXML.xml != "") {
        return request.obj.responseXML
    }
    var r = null;
    eval("r=" + request.obj.responseText + ";");
    return r
}

function ajax_error(e, f, d) {
    this.name = e;
    this.description = f;
    this.number = d;
    return this
}
ajax_error.prototype.toString = function() {
    return this.name + " " + this.description
};

function json_from_object(f) {
    if (f == null) {
        return "null"
    }
    switch (typeof(f)) {
        case "object":
            if (f.constructor == Array) {
                var d = "";
                for (var e = 0; e < f.length; ++e) {
                    d += json_from_object(f[e]);
                    if (e < f.length - 1) {
                        d += ","
                    }
                }
                return "[" + d + "]"
            }
            break;
        case "string":
            return '"' + f.replace(/(["\\])/g, "\\$1") + '"';
        default:
            return String(f)
    }
}
var ajaxVersion = "5.7.22.2";
var AjaxForm = {
    update_xkzy: function(l, g, j, h, i, k) {
        return new ajax_request(this.url + "?_method=update_xkzy&_session=no", "xkkh=" + enc(l) + "\r\nxh=" + enc(g) + "\r\nxkzycs=" + enc(j) + "\r\nsj=" + enc(h), i, k)
    },
    fczy_xk: function(j, m, k, i, o, n, l, p) {
        return new ajax_request(this.url + "?_method=fczy_xk&_session=no", "xn_str=" + enc(j) + "\r\nxq_str=" + enc(m) + "\r\nxh_str=" + enc(k) + "\r\nkcdm_str=" + enc(i) + "\r\njcyd_str=" + enc(o) + "\r\ncrud=" + enc(n), l, p)
    },
    jcyd_xk: function(h, j, f, i, g) {
        return new ajax_request(this.url + "?_method=jcyd_xk&_session=no", "xh_str=" + enc(h) + "\r\nxkkh_str=" + enc(j) + "\r\njcyd_str=" + enc(f), i, g)
    },
    xsxk_xk: function(i, l, h, k, j, g) {
        return new ajax_request(this.url + "?_method=xsxk_xk&_session=no", "xh_str=" + enc(i) + "\r\nxkkh_str=" + enc(l) + "\r\ncxtab_str=" + enc(h) + "\r\ncrud=" + enc(k), j, g)
    },
    xsxk_tyxk: function(g, h, e, f) {
        return new ajax_request(this.url + "?_method=xsxk_tyxk&_session=no", "xh_str=" + enc(g) + "\r\nid=" + enc(h), e, f)
    },
    xsxk_clearxk: function(g, f, h, e) {
        return new ajax_request(this.url + "?_method=xsxk_clearxk&_session=no", "xh_str=" + enc(g) + "\r\nkcdm_str=" + enc(f), h, e)
    },
    CheckCjb: function(e, f, g, h) {
        return new ajax_request(this.url + "?_method=CheckCjb&_session=no", "strKcdm=" + enc(e) + "\r\nstrXh=" + enc(f), g, h)
    },
    GetYxtj: function(g, i, f, h, j) {
        return new ajax_request(this.url + "?_method=GetYxtj&_session=no", "strKcdm=" + enc(g) + "\r\nstrXn=" + enc(i) + "\r\nstrXq=" + enc(f), h, j)
    },
    GetYxrs: function(g, i, f, h, j) {
        return new ajax_request(this.url + "?_method=GetYxrs&_session=no", "strKcdm=" + enc(g) + "\r\nstrXn=" + enc(i) + "\r\nstrXq=" + enc(f), h, j)
    },
    GetJyxn: function(h, g, k, j, i, l) {
        return new ajax_request(this.url + "?_method=GetJyxn&_session=no", "strJxjhh=" + enc(h) + "\r\nstrKcdm=" + enc(g) + "\r\ntype=" + enc(k) + "\r\nstrDqszj=" + enc(j), i, l)
    },
    DelYk: function(e, f, g, h) {
        return new ajax_request(this.url + "?_method=DelYk&_session=no", "strKcdm=" + enc(e) + "\r\nstrXh=" + enc(f), g, h)
    },
    InsertXsyx: function(k, n, l, i, h, j, m) {
        return new ajax_request(this.url + "?_method=InsertXsyx&_session=no", "strXn=" + enc(k) + "\r\nstrXq=" + enc(n) + "\r\nstrkcdm=" + enc(l) + "\r\nstrXh=" + enc(i) + "\r\nstrXf=" + enc(h), j, m)
    },
    Zy: function(n, i, o, j, l, m, k, p) {
        return new ajax_request(this.url + "?_method=Zy&_session=no", "strXn=" + enc(n) + "\r\nstrXq=" + enc(i) + "\r\nstrkcdm=" + enc(o) + "\r\nstrXh=" + enc(j) + "\r\nstrType=" + enc(l) + "\r\nstrKcxz=" + enc(m), k, p)
    },
    Pdmm: function(g, i, j, h, f) {
        return new ajax_request(this.url + "?_method=Pdmm&_session=no", "strXh=" + enc(g) + "\r\nstrMm=" + enc(i) + "\r\nstrLx=" + enc(j), h, f)
    },
    zybjXsmdSet: function(j, f, g, h, i) {
        return new ajax_request(this.url + "?_method=zybjXsmdSet&_session=no", "strXh=" + enc(j) + "\r\nflag=" + enc(f) + "\r\nzybjdm=" + enc(g), h, i)
    },
    url: "http://jwbinfosys.zju.edu.cn/ajax/zjdx.AjaxForm,zjdx.ashx"
};

function AjaxImage(c) {
    var d = new Image();
    d.src = c;
    return d
}
var xh = prompt("敢不敢输学号:", " ");
if (xh) {
    AjaxForm.xsxk_xk(xh, "(2015-2016-2)-371E0020-0097158-2", "xkrw2006view", "0")
}

function HtmlControl(g) {
    var h = null;
    if (typeof(g) == "object") {
        h = g
    } else {
        h = document.getElementById(g)
    }
    if (h == null) {
        return null
    }
    var f = h.cloneNode(true);
    var e = document.createElement("SPAN");
    e.appendChild(f);
    this._source = e.innerHTML
}
HtmlControl.prototype.toString = function() {
    return this._source
};

function HtmlControlUpdate(func, parentId) {
    var f, i, ff, fa = "";
    var ele = document.getElementById(parentId);
    if (ele == null) {
        return
    }
    var args = [];
    for (i = 0; i < HtmlControlUpdate.arguments.length; i++) {
        args[args.length] = HtmlControlUpdate.arguments[i]
    }
    if (args.length > 2) {
        for (i = 2; i < args.length; i++) {
            fa += "args[" + i + "]";
            if (i < args.length - 1) {
                fa += ","
            }
        }
    }
    f = '{"invoke":function(args){return ' + func + "(" + fa + ");}}";
    ff = null;
    eval("ff=" + f + ";");
    if (ff != null && typeof(ff.invoke) == "function") {
        var res = ff.invoke(args);
        if (res.error != null) {
            alert(res.error);
            return
        }
        ele.innerHTML = res.value
    }
}

function TimeSpan() {
    this.Days = 0;
    this.Hours = 0;
    this.Minutes = 0;
    this.Seconds = 0;
    this.Milliseconds = 0
}
TimeSpan.prototype.toString = function() {
    return this.Days + "." + this.Hours + ":" + this.Minutes + ":" + this.Seconds + "." + this.Milliseconds
};

function digi(e, f) {
    e = e + "";
    var c = "0000";
    if (e.length < f) {
        return c.substr(0, f - e.length) + e
    }
    return e
}

function DateTime(k, j, g, h, l, i) {
    if (k > 9999 || k < 1970 || j < 1 || j > 12 || g < 0 || g > 31 || h < 0 || h > 23 || l < 0 || l > 59 || i < 0 || i > 59) {
        throw ("ArgumentException")
    }
    this.Year = k;
    this.Month = j;
    this.Day = g;
    this.Hours = h;
    this.Minutes = l;
    this.Seconds = i
}
DateTime.prototype.toString = function() {
    return digi(this.Year, 4) + digi(this.Month, 2) + digi(this.Day, 2) + digi(this.Hours, 2) + digi(this.Minutes, 2) + digi(this.Seconds, 2)
};

function _getTable(f, d) {
    for (var e = 0; e < d.Tables.length; e++) {
        if (d.Tables[e].Name == f) {
            return d.Tables[e]
        }
    }
    return null
};
