var exec = cordova.require('cordova/exec'),
    channel = require('cordova/channel');

function startSaml2Authentication(endpoint, endpointParam) {
    var ref = window.open(endpoint, '_blank', 'location=no,toolbar=no');
    var success = false;
    var loadListener = function(event) {
        if (event.url.indexOf(endpointParam) >= 0) {
            success = true;
            ref.close();
        }
    };
    var errorListener = function(event) {
        ref.close();
    };
    var exitListener = function(event) {
        exec(function() {}, function() {}, 'AuthProxy', 'strategiesSaml2Complete', [success]);
    };
    ref.addEventListener('loadstop', loadListener);
    ref.addEventListener('loadstart', loadListener);
    ref.addEventListener('loaderror', errorListener);
    ref.addEventListener('exit', exitListener);
}

channel.onCordovaReady.subscribe(function() {
    exec(function(result) {
        if (result && result.type === 'saml2.web.post') {
            startSaml2Authentication(result.finishEndpoint, result.finishEndpointParam);
        }
    }, function(e) {
        console.log('Error initializing web strategies: ' + e);
    }, 'AuthProxy', 'initWebStrategies', []);
});
