"use strict";

const uuid = require("uuid");
const httpError = require("http-errors");
const http = require("http");
const WebSocket = require('ws');
//const server =require("./lib/DefaultApp").server;

// const wss = new WebSocket.Server({
//     port: 8080
// });
//
//
// wss.broadcast = function broadcast(data) {
//     wss.clients.forEach(function each(client) {
//         if (client.readyState === WebSocket.OPEN) {
//             // console.log(data);
//             client.send(JSON.stringify(data));
//         }
//     })
// };


module.exports = class Sensors
{
    static sensors (request, response, next)
    {

        let sensorsResponse = Array
            .from(request.app.locals.sensors.sensorsmap.keys())
            .map(id => ({id: id}));
        // for(var id of request.app.locals.sensors.sensorsmap.keys()){
        //     console.log("id"+ id);
        // }
        // console.log(sensorsResponse);
        switch (request.method)
        {
            case "GET":
              response.format(
                {
                    "application/json": () =>
                    {

                        response.status(200).json({ "sensors": sensorsResponse });
                    },
                    "default": () => { next(new httpError.NotAcceptable()); }
                });
                break;
            case "POST":
            case "CONNECT":
            case "DELETE":
            case "HEAD":
            case "OPTIONS":
            case "PUT":
            case "TRACE":
            default:
                response.set("allow", "GET");
                next(new httpError.MethodNotAllowed());
                break;
        }
    }

    static sensor (request, response, next)
    {
      let sensor = request.app.locals.sensors.sensorsmap.get(request.params.sensor);
      let sensorResponse = {
          id: sensor.id,
          name: sensor.name
        }
        console.log(sensorResponse);
        switch (request.method)
        {
            case "GET":
                response.format(
                {
                    "application/json": () =>
                    {

                        response.status(200).json(sensorResponse);
                    },
                    "default": () => { next(new httpError.NotAcceptable()); }
                });
                break;
            case "DELETE":
            case "PUT":
            case "CONNECT":
            case "HEAD":
            case "OPTIONS":
            case "POST":
            case "TRACE":
            default:
                response.set("allow", "GET, POST");
                next(new httpError.MethodNotAllowed());
                break;
        }
    }

    static sensorReadings (request, response, next)
    {

      let sensor = request.app.locals.sensors.sensorsmap.get(request.params.sensor);
      // for(var id of request.app.locals.sensors.sensorsmap.keys())
      // console.log("id"+ id);
      // console.log(request.params.sensor);
      // console.log(sensor);
      //console.log("readings", forEach(sensor));
      let sensorResponse = {
          id: sensor.id,
          name: sensor.name,
          reading: sensor.reading
        }
        switch (request.method)
        {
            case "GET":
                response.format(
                {
                    "application/json": () =>
                    {
                      console.log("latest reading");
                      let reading = new Array();
                      reading.push(sensor.reading.dummyValue);
                      console.log("latest-reading",reading);
                      response.status(200).json(sensorResponse);
                    },
                    "default": () => { next(new httpError.NotAcceptable()); }
                });
                break;
            case "DELETE":
            case "PUT":
            case "CONNECT":
            case "HEAD":
            case "OPTIONS":
            case "POST":
            case "TRACE":
            default:
                response.set("allow", "GET, POST");
                next(new httpError.MethodNotAllowed());
                break;
        }
    }

    static _404 (request, response)
    {
        response.status(404).json({ "error": http.STATUS_CODES[404] })
    }
};