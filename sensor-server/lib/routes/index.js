"use strict";

var os = require('os');




module.exports = function (request, response) {
    let interfaces = os.networkInterfaces();
    let addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    // console.log(addresses[0]);

    response.render("index", {
        "menu_name": "index",
        "header": "Sensors Dashboard"
    });
};