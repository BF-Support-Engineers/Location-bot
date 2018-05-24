/* global GetUserCountryByIp */
'use strict';

var access_key = "[Enter API access key";
var apiLocation = {};
var browserLocation = {};

// get the API result via jQuery.ajax
$(document).ready(function () {
    getApiPosition();
    initNavigator();
    getBrowserPosition();
});

// get location via external API service
function getApiPosition() {
    $.ajax({
        url: 'https://api.ipstack.com/check?access_key=' + access_key,
        dataType: 'jsonp',
        context: document.body,
        success: function (json) {

            // assign location to element attributes
            $("#apiGeoLocation")
                .val("Latitude: " + json.latitude + ', Longitude: ' + json.longitude)
                .text("Latitude: " + json.latitude + ', Longitude: ' + json.longitude);
            apiLocation = { 'latitude': json.latitude, 'longitude': json.longitude };
            return apiLocation;
        }
    });
};

// get location via internal browser API
function initNavigator() {
    navigator.geolocation.getCurrentPosition(getBrowserPosition, error);
};

function getBrowserPosition(pos) {
    var crd = pos.coords;

    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    browserLocation = { 'latitude': roundUp(crd.latitude, 3), 'longitude': roundUp(crd.longitude, 3) };

    $("#browserGeoLocation")
        .val("Latitude: " + browserLocation.latitude + ', Longitude: ' + browserLocation.longitude)
        .text("Latitude: " + browserLocation.latitude + ', Longitude: ' + browserLocation.longitude);

    return browserLocation;
};

function error(err) {
    console.wanr(`ERROR(${err.code}): ${err.message}`);
};

function roundUp(num, precision) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
}

// botchat code
const params = BotChat.queryParams(location.search);

const user = {
    id: params['User'] || 'User',
    name: params['User'] || 'User'
};

const bot = {
    id: params['Location Bot'] || 'Location Bot',
    name: params['Location Bot'] || 'Location Bot'
};

const botConnection = new BotChat.DirectLine({
    secret: "[Enter DirectLine secret]"
});

BotChat.App({
    user: user,
    bot: bot,
    botConnection: botConnection,
    resize: 'detect',
    locale: 'en'
}, document.getElementById('bot'));

botConnection.activity$
    .filter(function (activity) {
        return activity.type === 'message' && activity.name === 'postLocationData';
    })
    .subscribe(function (activity) {
        console.log('"postLocationData" received with value: ' + activity.value);
        postLocationData(activity.value);
    });

function postLocationData(newlocation) {
    console.log(newlocation);
}

function getAPIData() {
    botConnection
        .postActivity({
            from: { id: 'me' },
            name: 'postLocationData',
            text: 'I said my location is ' + JSON.stringify(apiLocation.latitude),
            type: 'message',
            value: JSON.stringify(apiLocation.latitude)
        })
        .subscribe(function (id) {
            //console.log('"postLocationData" sent');
            //console.log(apiLocation.latitude);
            //console.log(JSON.stringify(apiLocation.latitude));
        });
}

function getBrowserData() {
    console.log(browserLocation);
    botConnection
        .postActivity({
            from: { id: 'me' },
            name: 'postLocationData',
            text: JSON.stringify(browserLocation.latitude),
            type: 'message',
            value: JSON.stringify(browserLocation.latitude)
        })
        .subscribe(function (id) {
            //console.log('"postLocationData" sent');
            //console.log(browserLocation.latitude);
            //console.log(JSON.stringify(browserLocation.latitude));
        });
}