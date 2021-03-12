/**
 * Cross domain translation
 *
 * Example usage - attempt to translate 'Hello world!' from
 * English to Hebrew and display the result in an alert box:
 *
 * function myCallback(translation) { alert(translation); }
 * var translator = new babylonTranslator();
 * translator.translate(0, 14, 'Hello world!', 'myCallback');
 *
 */

 
 function babylonTranslator(appid) {
    var head = document.getElementsByTagName('head')[0],
        removeScript = function() { head.removeChild(this); };
    
    return {
        version: '0.5',
        defaultDriver: 'babylon',
        translate: function(source_lang, target_lang, text, callback) {
            text = text.replace(/^\s+|\s+$/g, '');
            if (text === '') { return; }
            var driverName = this.defaultDriver, driver;
            if (driverName == 'google') {
                if (text.split(' ').length < 2) {
                    driverName = 'babylon';
                } else {
                    driver = new babylonTranslator.driver(driverName);
                    if (driver.getLangpair(source_lang, target_lang) === false) {
                        driverName = 'babylon';
                    }
                }
            }
            driver = new babylonTranslator.driver(driverName);
            var script = document.createElement('script'),
                context = [driverName, source_lang, target_lang, appid || '',text].join('.') + '_' + callback,
                params = {v: '1.0', q: text, langpair: driver.getLangpair(source_lang, target_lang),
                          callback: 'babylonTranslator.callback', context: context};
            script.src = driver.gateway + '?' + babylonTranslator.queryString(params);
            script.type = 'text/javascript';
            script.onload = removeScript;
            script.onreadystatechange = function() {
                var state = this.readyState;
                if (state == 'loaded' || state == 'complete') {
                    removeScript.apply(this);
                }
            };
            head.appendChild(script);
            babylonTranslator.storage.text = text;
        }
    };
}
babylonTranslator.driver = function(driverName) {
    var driver = {branding: '', pixel: null};
    switch (driverName) {
        case 'google':
            driver.gateway = 'https://ajax.googleapis.com/ajax/services/language/translate';
            driver.branding = '<div class="powered-by-google">powered by <img src="https://www.google.com/uds/css/small-logo.png" alt="Google" width="51" height="15" /></div>';
            driver.pixel = 'https://translation.babylon-software.com/translate/google_pixel.gif';
            driver.getLangpair = function(source_lang, target_lang) {
                var _source_lang = babylonTranslator.langs[source_lang],
                    _target_lang = babylonTranslator.langs[target_lang];
                return (_source_lang !== null && _target_lang !== null) ?
                       _source_lang + '|' + _target_lang :
                       false;
            };
            break;
        case 'babylon':
            driver.gateway = 'https://translation.babylon-software.com/translate/babylon.php';
            driver.getLangpair = function(source_lang, target_lang) {
                return source_lang + '|' + target_lang;
            };
            break;
    }
    return driver;
};
babylonTranslator.queryString = function(params) {
    var queryString = [];
    for (var i in params) {
        if (params.hasOwnProperty(i) && params[i] !== '') {
            queryString.push(i + '=' + encodeURIComponent(params[i]));
        }
    }
    return queryString.join('&');
};
babylonTranslator.langs = {0:"en", 15:"ar", 1:"fr", 6:"de", 11:"el", 2:"it", 8:"ja", 5:"pt-PT", 7:"ru", 3:"es", 344:"es-c", 13:"tr", 10:"zh-CN", 9:"zh-TW", 31:"cs", 43:"da", 4:"nl", 14:"iw", 60:"hi", 30:"hu", 12:"ko", 46:"no", 51:"fa", 29:"pl", 47:"ro", 61:null, 22:"sv", 24:"uk", 39:null};
babylonTranslator.callback = function(context, result, status, status_details) {
    var matches = /^([^_]+?)_(.+?)$/.exec(context); // matches = [context, details, callback]
    if (matches) {
        var details = matches[1].split('.'), // details = [driver, source_lang, target_lang, appid]
            driver = new babylonTranslator.driver(details[0]);
        if (driver.pixel && document.images) {
            var pixel = new Image(),
                params = {status: status, sl: details[1], tl: details[2],
                          appid: details[3], nocache: new Date().getTime()};
            pixel.src = driver.pixel + '?' + babylonTranslator.queryString(params);
        }
        if (status == 200 && result.translatedText) {

            var callback = window[matches[2]];
            if (typeof callback == 'function') {
                callback.apply(window, [details[4],result.translatedText + driver.branding]);
            }
            
        } else if (details[0] == 'google') {
            var translator = new babylonTranslator();
            translator.defaultDriver = 'babylon';
            translator.translate(details[1], details[2], babylonTranslator.storage.text, matches[2]);
        }
    }
};
babylonTranslator.storage = {};