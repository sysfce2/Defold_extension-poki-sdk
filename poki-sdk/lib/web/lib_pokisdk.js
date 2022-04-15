// https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html

var LibPokiSdk = {

    $PokiSdk: {

        _callback: null,
        _urlCallback: null,
        _urlParameters:null,

        _commercialBreakCallback: function() {
            {{{ makeDynCall("v", "PokiSdk._callback")}}}();
        },

        _rewardedBreakCallback: function(success) {
            var msg = success ? 1 : 0; 
            {{{ makeDynCall("vi", "PokiSdk._callback")}}}(msg);
        },

        _shareableURLCallback: function(url) {
            var url_arr = intArrayFromString(url, true);
            var _url = allocate(url_arr, ALLOC_NORMAL);        
            {{{ makeDynCall("vii", "PokiSdk._urlCallback")}}}(_url, url_arr.length);
            Module._free(_url);
        }
    },

    PokiSdkJs_CommercialBreak: function(callback) {
        PokiSdk._callback = callback;
        PokiSDK.commercialBreak().then(PokiSdk._commercialBreakCallback);
    },

    PokiSdkJs_RewardedBreak: function(callback) {
        PokiSdk._callback = callback;
        PokiSDK.rewardedBreak().then(PokiSdk._rewardedBreakCallback);
    },

    PokiSdkJs_GameplayStart: function() {
        PokiSDK.gameplayStart();
    },

    PokiSdkJs_GameplayStop: function() {
        PokiSDK.gameplayStop();
    },

    PokiSdkJs_SetDebug: function(value) {
        PokiSDK.setDebug(value); 
    },

    PokiSdkJs_IsAdBlock: function() {
        return Module.PokiSDK_isAdBlock;
    },

    PokiSdkJs_AddParameterForURL: function(key, value) {
        if (PokiSdk._urlParameters == null) {
            PokiSdk._urlParameters = {};
        }
        PokiSdk._urlParameters[UTF8ToString(key)] = UTF8ToString(value);
    },

    PokiSdkJs_ShareableURL: function(callback) {
        PokiSdk._urlCallback = callback;
        PokiSDK.shareableURL(PokiSdk._urlParameters).then(PokiSdk._shareableURLCallback);
        PokiSdk._urlParameters = null;
    },

    PokiSdkJs_GetURLParam: function(key) {
        var key = UTF8ToString(key);
        var value = PokiSDK.getURLParam(key);
        return allocate(intArrayFromString(value), ALLOC_STACK);
    }
}

autoAddDeps(LibPokiSdk, '$PokiSdk');
mergeInto(LibraryManager.library, LibPokiSdk);
