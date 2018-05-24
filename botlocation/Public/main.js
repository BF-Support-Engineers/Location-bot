/* global GetUserCountryByIp */
'use strict';

var access_key = "<Enter Your API Access Key>";
var geoLocation = {};
var latitude;
var longitude;

// get the API result via jQuery.ajax
$(document).ready(function () {
    $.when(
        $.ajax({
            url: 'https://api.ipstack.com/check?access_key=' + access_key,
            dataType: 'jsonp',
            context: document.body,
            success: function (json) {

                // output the "capital" object inside "location"
                $("#cityState").text(json.city + ', ' + json.region_code);
                $("#geoLocation")
                    .val("Latitude: " + json.latitude + ', Longitude: ' + json.longitude)
                    .text("Latitude: " + json.latitude + ', Longitude: ' + json.longitude);
                geoLocation = { 'latitude': json.latitude, 'longitude': json.longitude };
                return geoLocation;
            }
        })
    ).done(function () {
        latitude = geoLocation.latitude;
        longitude = geoLocation.longitude;
    });
});

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
    secret: "<Enter Your DirectLine Secret."
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

function getLocationData() {
    botConnection
        .postActivity({
            from: { id: 'me' },
            name: 'postLocationData',
            text: JSON.stringify(latitude),
            type: 'message',
            value: JSON.stringify(latitude)
        })
        .subscribe(function (id) {
            console.log('"postLocationData" sent');
            console.log(latitude);
            console.log(JSON.stringify(latitude));
        });
}