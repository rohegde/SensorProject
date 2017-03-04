"use strict";

module.exports = function (request, response)
{
    response.render("index", {
        "menu_name": "index",
        "header": "Dashboard for Sensors"
    });
};