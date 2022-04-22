function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.uaBrowser = factory());
})(this, function () {
  'use strict';

  var version = "1.0.0";
  var UA = navigator.userAgent;
  var mimeTypes = navigator.mimeTypes;
  var platfrom = navigator.platform;
  /** 内核 */

  var engineRegExp = {
    Trident: /(Trident|NET CLR)/,
    Presto: /Presto/,
    WebKit: /AppleWebKit/,
    Gecko: /Gecko\//,
    KHTML: /KHTML\//
  };
  /** 浏览器 */

  var browserRegExp = {
    Safari: /Safari/,
    Chrome: /(Chrome|CriOS)/,
    IE: /(MSIE|Trident)/,
    Edge: /(Edge|Edg\/|EdgA|EdgiOS)/,
    Firefox: /(Firefox|FxiOS)/,
    'Firefox Focus': /Focus/,
    Chromium: /Chromium/,
    Opera: /(Opera|OPR|OPT)/,
    Vivaldi: /Vivaldi/,
    Yandex: /YaBrowser/,
    Arora: /Arora/,
    Lunascape: /Lunascape/,
    QupZilla: /QupZilla/,
    'Coc Coc': /coc_coc_browser/,
    Kindle: /(Kindle|Silk\/)/,
    Iceweasel: /Iceweasel/,
    Konqueror: /Konqueror/,
    Iceape: /Iceape/,
    SeaMonkey: /SeaMonkey/,
    Epiphany: /Epiphany/,
    '360': /(QihooBrowser|QHBrowser)/,
    '360EE': /360EE/,
    '360SE': /360SE/,
    UC: /(UCBrowser|UBrowser|UCWEB)/,
    QQBrowser: /QQBrowser/,
    QQ: /QQ\//,
    Baidu: /(Baidu|BIDUBrowser|baidubrowser|baiduboxapp|BaiduHD)/,
    Maxthon: /Maxthon/,
    Sogou: /(Metasr|Sogou)/,
    Liebao: /(LBBROWSER|LieBaoFast)/,
    '2345Explorer': /2345Explorer/,
    '115Browser': /115Browser/,
    TheWorld: /TheWorld/,
    XiaoMi: /MiuiBrowser/,
    Quark: /Quark/,
    Qiyu: /Qiyu/,
    Wechat: /MicroMessenger/,
    WechatWork: /wxwork\//,
    Taobao: /AliApp\(TB/,
    Alipay: /AliApp\(AP/,
    Weibo: /Weibo/,
    Douban: /com\.douban\.frodo/,
    Suning: /SNEBUY-APP/,
    iQiYi: /IqiyiAp/,
    DingTalk: /DingTalk/,
    Huawei: /(HuaweiBrowser|HUAWEI\/|HONOR)/,
    Vivo: /VivoBrowser/
  };
  /** 系统或平台 */

  var osRegExp = {
    Windows: /Windows/,
    Linux: /(Linux|X11)/,
    MacOS: /Macintosh/,
    Android: /(Android|Adr)/,
    HarmonyOS: /HarmonyOS/,
    Ubuntu: /Ubuntu/,
    FreeBSD: /FreeBSD/,
    Debian: /Debian/,
    'Windows Phone': /(IEMobile|Windows Phone)/,
    BlackBerry: /(BlackBerry|RIM)/,
    MeeGo: /MeeGo/,
    Symbian: /Symbian/,
    iOS: /like Mac OS X/,
    'Chrome OS': /CrOS/,
    WebOS: /hpwOS/
  };
  /** 设备 */

  var deviceRegExp = {
    Mobile: /(Mobi|iPh|480)/,
    Tablet: /(Tablet|Pad|Nexus 7)/
  };
  /** 环境 */

  var envRegExp = {
    isWebview: /; wv/
  };
  var hash = {
    device: ['Mobile', 'Tablet'],
    os: ['Windows', 'Linux', 'MacOS', 'Android', 'HarmonyOS', 'Ubuntu', 'FreeBSD', 'Debian', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'iOS', 'Chrome OS', 'WebOS'],
    engine: ['Trident', 'Presto', 'WebKit', 'Gecko', 'KHTML'],
    browser: ['Safari', 'Chrome', 'IE', 'Edge', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Arora', 'Lunascape', 'QupZilla', 'Coc Coc', 'Kindle', 'Iceweasel', 'Konqueror', 'Iceape', 'SeaMonkey', 'Epiphany', '360', '360EE', '360SE', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'Liebao', '2345Explorer', '115Browser', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat', 'WechatWork', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi', 'DingTalk', 'Huawei', 'Vivo']
  };

  var getMimeType = function getMimeType(value) {
    try {
      return !!mimeTypes.namedItem(value);
    } catch (e) {
      return false;
    }
  };

  var getValueOf = function getValueOf(values, reg) {
    var ua = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : UA;
    var i = values.length;

    while (i--) {
      var value = values[i];
      if (reg[value].test(ua)) return value;
    }

    return 'unknown';
  };

  var getLanguage = function getLanguage() {
    return (navigator.browserLanguage || navigator.language).replace(/-\w+/g, function (word) {
      return word.toUpperCase();
    });
  };

  var isWechatMiniapp = function isWechatMiniapp() {
    return '__wxjs_environment' in window && window.__wxjs_environment === 'miniprogram';
  };

  var isWebview = function isWebview(ua) {
    return envRegExp.isWebview.test(ua);
  };

  var UaBrowser = /*#__PURE__*/function () {
    function UaBrowser(ua) {
      var _this = this;

      _classCallCheck(this, UaBrowser);

      this.ua = UA;
      this.version = {
        Safari: function Safari() {
          return _this.ua.replace(/^.*Version\/([\d.]+).*$/, '$1');
        },
        Chrome: function Chrome() {
          return _this.ua.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
        },
        IE: function IE() {
          return _this.ua.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1');
        },
        Edge: function Edge() {
          return _this.ua.replace(/^.*Edge\/([\d.]+).*$/, '$1').replace(/^.*Edg\/([\d.]+).*$/, '$1').replace(/^.*EdgA\/([\d.]+).*$/, '$1').replace(/^.*EdgiOS\/([\d.]+).*$/, '$1');
        },
        Firefox: function Firefox() {
          return _this.ua.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1');
        },
        'Firefox Focus': function FirefoxFocus() {
          return _this.ua.replace(/^.*Focus\/([\d.]+).*$/, '$1');
        },
        Chromium: function Chromium() {
          return _this.ua.replace(/^.*Chromium\/([\d.]+).*$/, '$1');
        },
        Opera: function Opera() {
          return _this.ua.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1').replace(/^.*OPT\/([\d.]+).*$/, '$1');
        },
        Vivaldi: function Vivaldi() {
          return _this.ua.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1');
        },
        Yandex: function Yandex() {
          return _this.ua.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1');
        },
        Arora: function Arora() {
          return _this.ua.replace(/^.*Arora\/([\d.]+).*$/, '$1');
        },
        Lunascape: function Lunascape() {
          return _this.ua.replace(/^.*Lunascape[\s]([\d.]+).*$/, '$1');
        },
        QupZilla: function QupZilla() {
          return _this.ua.replace(/^.*QupZilla[\s]([\d.]+).*$/, '$1');
        },
        'Coc Coc': function CocCoc() {
          return _this.ua.replace(/^.*coc_coc_browser\/([\d.]+).*$/, '$1');
        },
        Kindle: function Kindle() {
          return _this.ua.replace(/^.*Version\/([\d.]+).*$/, '$1');
        },
        Iceweasel: function Iceweasel() {
          return _this.ua.replace(/^.*Iceweasel\/([\d.]+).*$/, '$1');
        },
        Konqueror: function Konqueror() {
          return _this.ua.replace(/^.*Konqueror\/([\d.]+).*$/, '$1');
        },
        Iceape: function Iceape() {
          return _this.ua.replace(/^.*Iceape\/([\d.]+).*$/, '$1');
        },
        SeaMonkey: function SeaMonkey() {
          return _this.ua.replace(/^.*SeaMonkey\/([\d.]+).*$/, '$1');
        },
        Epiphany: function Epiphany() {
          return _this.ua.replace(/^.*Epiphany\/([\d.]+).*$/, '$1');
        },
        Maxthon: function Maxthon() {
          return _this.ua.replace(/^.*Maxthon\/([\d.]+).*$/, '$1');
        },
        QQBrowser: function QQBrowser() {
          return _this.ua.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1');
        },
        QQ: function QQ() {
          return _this.ua.replace(/^.*QQ\/([\d.]+).*$/, '$1');
        },
        Baidu: function Baidu() {
          return _this.ua.replace(/^.*BIDUBrowser[\s/]([\d.]+).*$/, '$1').replace(/^.*baiduboxapp\/([\d.]+).*$/, '$1');
        },
        UC: function UC() {
          return _this.ua.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1');
        },
        Sogou: function Sogou() {
          return _this.ua.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1');
        },
        TheWorld: function TheWorld() {
          return _this.ua.replace(/^.*TheWorld ([\d.]+).*$/, '$1');
        },
        XiaoMi: function XiaoMi() {
          return _this.ua.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1');
        },
        Vivo: function Vivo() {
          return _this.ua.replace(/^.*VivoBrowser\/([\d.]+).*$/, '$1');
        },
        Quark: function Quark() {
          return _this.ua.replace(/^.*Quark\/([\d.]+).*$/, '$1');
        },
        Qiyu: function Qiyu() {
          return _this.ua.replace(/^.*Qiyu\/([\d.]+).*$/, '$1');
        },
        Wechat: function Wechat() {
          return _this.ua.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1');
        },
        WechatWork: function WechatWork() {
          return _this.ua.replace(/^.*wxwork\/([\d.]+).*$/, '$1');
        },
        Taobao: function Taobao() {
          return _this.ua.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1');
        },
        Alipay: function Alipay() {
          return _this.ua.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1');
        },
        Weibo: function Weibo() {
          return _this.ua.replace(/^.*weibo__([\d.]+).*$/, '$1');
        },
        Douban: function Douban() {
          return _this.ua.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1');
        },
        Suning: function Suning() {
          return _this.ua.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1');
        },
        iQiYi: function iQiYi() {
          return _this.ua.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1');
        },
        DingTalk: function DingTalk() {
          return _this.ua.replace(/^.*DingTalk\/([\d.]+).*$/, '$1');
        },
        Huawei: function Huawei() {
          return _this.ua.replace(/^.*Version\/([\d.]+).*$/, '$1').replace(/^.*HuaweiBrowser\/([\d.]+).*$/, '$1');
        },
        '115Browser': function Browser() {
          return _this.ua.replace(/^.*115Browser\/([\d.]+).*$/, '$1');
        },
        '360': function _() {
          return _this.ua.replace(/^.*QihooBrowser\/([\d.]+).*$/, '$1');
        },
        '360SE': function SE() {
          var vers = _this.ua.replace(/^.*Chrome\/([\d]+).*$/, '$1');

          var hash = {
            '86': '13.0',
            '78': '12.0',
            '69': '11.0',
            '63': '10.0',
            '55': '9.1',
            '45': '8.1',
            '42': '8.0',
            '31': '7.0',
            '21': '6.3'
          };
          return hash[vers] || '';
        },
        '360EE': function EE() {
          var vers = _this.ua.replace(/^.*Chrome\/([\d]+).*$/, '$1');

          var hash = {
            '86': '13.0',
            '78': '12.0',
            '69': '11.0',
            '63': '9.5',
            '55': '9.0',
            '50': '8.7',
            '30': '7.5'
          };
          return hash[vers] || '';
        },
        '2345Explorer': function Explorer() {
          var vers = _this.ua.replace(/^.*Chrome\/([\d]+).*$/, '$1');

          var hash = {
            '69': '10.0',
            '55': '9.9'
          };
          return hash[vers] || _this.ua.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1').replace(/^.*Mb2345Browser\/([\d.]+).*$/, '$1');
        },
        Liebao: function Liebao() {
          var _version = '';

          if (/LieBaoFast/.test(_this.ua)) {
            _version = _this.ua.replace(/^.*LieBaoFast\/([\d.]+).*$/, '$1');
          }

          var vers = _this.ua.replace(/^.*Chrome\/([\d]+).*$/, '$1');

          var hash = {
            '57': '6.5',
            '49': '6.0',
            '46': '5.9',
            '42': '5.3',
            '39': '5.2',
            '34': '5.0',
            '29': '4.5',
            '21': '4.0'
          };
          return _version || hash[vers] || '';
        }
      };
      this.osVersion = {
        Android: function Android() {
          return _this.ua.replace(/^.*Android ([\d.]+);.*$/, '$1');
        },
        iOS: function iOS() {
          return _this.ua.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
        },
        Debian: function Debian() {
          return _this.ua.replace(/^.*Debian\/([\d.]+).*$/, '$1');
        },
        'Windows Phone': function WindowsPhone() {
          return _this.ua.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2');
        },
        MacOS: function MacOS() {
          return _this.ua.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
        },
        WebOS: function WebOS() {
          return _this.ua.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1');
        },
        HarmonyOS: function HarmonyOS() {
          var vers = _this.ua.replace(/^Mozilla.*Android ([\d.]+)[;)].*$/, '$1');

          var hash = {
            '10': '2'
          };
          return hash[vers] || '';
        },
        Windows: function Windows() {
          var vers = _this.ua.replace(/^Mozilla\/\d.0 \(Windows NT ([\d.]+);.*$/, '$1');

          var hash = {
            '10': '10',
            '6.4': '10',
            '6.3': '8.1',
            '6.2': '8',
            '6.1': '7',
            '6.0': 'Vista',
            '5.2': 'XP',
            '5.1': 'XP',
            '5.0': '2000'
          };
          return hash[vers] || vers;
        }
      };

      if (ua) {
        this.ua = ua;
      }
    }

    _createClass(UaBrowser, [{
      key: "getOs",
      value: function getOs() {
        return getValueOf(hash.os, osRegExp, this.ua);
      }
    }, {
      key: "getEngine",
      value: function getEngine() {
        return getValueOf(hash.engine, engineRegExp, this.ua);
      }
    }, {
      key: "getBrowser",
      value: function getBrowser() {
        return getValueOf(hash.browser, browserRegExp, this.ua);
      }
    }, {
      key: "getDevice",
      value: function getDevice() {
        if (platfrom === 'MacIntel' && navigator.maxTouchPoints > 1) {
          return 'Tablet';
        }

        var device = getValueOf(hash.device, deviceRegExp, this.ua);
        return device === 'unknown' ? 'PC' : device;
      }
    }, {
      key: "getEnv",
      value: function getEnv(ua) {
        var _a, _b;

        if (ua) {
          this.ua = ua;
        } else {
          this.ua = UA;
        }

        var env = {
          version: 'unknown',
          osVersion: 'unknown',
          engine: this.getEngine(),
          browser: this.getBrowser(),
          os: this.getOs(),
          device: this.getDevice(),
          isWebview: isWebview(this.ua),
          language: (_a = getLanguage()) !== null && _a !== void 0 ? _a : 'unknown',
          platfrom: platfrom !== null && platfrom !== void 0 ? platfrom : 'unknown'
        };
        var is360 = false;

        if ('chrome' in window) {
          var chrome = window.chrome;
          var vers = this.ua.replace(/^.*Chrome\/([\d]+).*$/, '$1');

          if (chrome.adblock2345 || chrome.common2345) {
            env.browser = '2345Explorer';
          } else if (getMimeType('application/360softmgrplugin') || getMimeType('application/mozilla-npqihooquicklogin') || vers > '36' && window.showModalDialog) {
            is360 = true;
          } else if (vers > '45') {
            is360 = getMimeType('application/vnd.chromium.remoting-viewer');

            if (!is360 && vers >= '69') {
              is360 = getMimeType('application/hwepass2001.installepass2001') || getMimeType('application/asx');
            }
          }
        }

        if (env.device === 'Mobile' && /iPad/.test(this.ua)) {
          env.device = 'Tablet';
        } else if (is360) {
          if (getMimeType('application/gameplugin') || !((_b = navigator === null || navigator === void 0 ? void 0 : navigator.connection) === null || _b === void 0 ? void 0 : _b.saveData)) {
            env.browser = '360SE';
          } else {
            env.browser = '360EE';
          }
        }

        if (env.browser === 'Baidu' && browserRegExp.Opera.test(this.ua)) {
          env.browser = 'Opera';
        }

        if (env.os in this.osVersion) {
          env.osVersion = this.osVersion[env.os]();

          if (env.osVersion === this.ua) {
            env.osVersion = 'unknown';
          }
        }

        if (env.browser in this.version) {
          env.version = this.version[env.browser]();

          if (env.version === this.ua) {
            env.version = 'unknown';
          }
        }

        if (env.browser === 'Chrome' && this.ua.match(/\S+Browser/)) {
          env.browser = this.ua.match(/\S+Browser/)[0];
          env.version = this.ua.replace(/^.*Browser\/([\d.]+).*$/, '$1');
        } else if (env.browser === 'Firefox' && ('clientInformation' in window || !('u2f' in window))) {
          env.browser = "".concat(env.browser, " Nightly");
        } else if (env.browser === 'Wechat' && isWechatMiniapp()) {
          env.browser = 'Wechat Miniapp';
        }

        if (env.browser === 'Edge') {
          env.engine = parseInt(env.version) > 75 ? 'Blink' : 'EdgeHTML';
        } else if (browserRegExp.Chrome.test(this.ua) && env.engine === 'WebKit' && parseInt(this.version.Chrome()) > 27 || env.browser === 'Opera' && parseInt(env.version) > 12 || env.browser === 'Yandex') {
          env.engine = 'Blink';
        }

        return env;
      }
    }]);

    return UaBrowser;
  }();

  var instance = new UaBrowser();

  function Wrap(ua) {
    return instance.getEnv(ua);
  }

  Wrap.isWebview = isWebview;
  Wrap.isWechatMiniapp = isWechatMiniapp;
  Wrap.getLanguage = getLanguage;
  Wrap.VERSION = version;
  return Wrap;
});
