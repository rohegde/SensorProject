"use strict";

const uuid = require("uuid");
const httpError = require("http-errors");
const http = require("http");
const phoneSensor = require("tinkerForge-sensor").PhoneSensor;
const sensorReading = require("tinkerForge-sensor").DummySensorReading;
const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 8082
});
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            // console.log(data);
            client.send(JSON.stringify(data));
        }
    })
};


module.exports = class Sensors
{
    static sensors (request, response, next)
    {
        constructor()
        {
            let sensors = request.app.locals.sensors.sensorsmap;

            for (let [id, sensor] of sensors.entries()) {
                sensor.onchange = event => {
                    //console.log(event);
                    let sensorResponse = {
                        id: sensor.id,
                        type: sensor.type,
                        reading: event.reading.dummyValue,
                        timestamp: event.reading.timestamp,
                        unit: sensor.unit,
                        UID: sensor.UID
                    };
                    wss.broadcast(sensorResponse);
                    sensor.lastReading = event;
                }
            }
        }
        let sensorsResponse;
        let sensor = request.app.locals.sensors.sensorsmap.get(request.params.sensor);
        // console.log(sensorsResponse);
        switch (request.method)
        {
            case "GET":
                sensorsResponse = Array
                    .from(request.app.locals.sensors.sensorsmap.keys())
                    .map(id => ({id: id}));
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
                let sensorph;
                    sensorph = new phoneSensor(request.body);
                    sensorph.onchange = event => {

                        let sensorResponse = {
                            id: sensorph.UID,
                            type: sensorph.type,
                            name: sensorph.name,
                            reading: event.reading.dummyValue,
                            timestamp: event.reading.timestamp,
                            unit: sensorph.unit
                        };

                        wss.broadcast(sensorResponse);
                        sensorph.lastReading = event;
                    };
                    request.app.locals.sensors.sensorsmap.set(sensorph.UID, sensorph);
                    sensorph.start();
                    sensorsResponse = Array.from(request.app.locals.sensors.sensorsmap.keys())
                        .map(id => ({
                            id: id
                        }));
                    console.log(sensorsResponse);

                    response.format({
                        "application/json": () => {
                            response.status(201).send(sensorsResponse);
                        },
                        "default": () => {
                            next(new httpError.NotAcceptable());
                        }
                    });
                    break;
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
      console.log(sensor);
      let sensorResponse = {
          id: sensor.id,
          name: sensor.name,
          type: sensor.type
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
      let sensorResponse = {
          id: sensor.id,
          reading: sensor.lastReading.reading
        }
        switch (request.method)
        {
            case "GET":
                response.format(
                {
                    "application/json": () =>
                    {
                      // console.log("latest reading");
                      // let reading = new Array();
                      // reading.push(sensor.reading.dummyValue);
                      // console.log("latest-reading",reading);
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
                sensor.lastReading.reading = new sensorReading(
                    parseInt(request.body.lastReading.timestamp),
                    parseInt(request.body.lastReading.value));
                sensorResponse = {
                    value: sensor.lastReading.reading.dummyValue,
                    timestamp: sensor.lastReading.reading.timestamp
                };
                console.log(sensorResponse);
                sensor.onchange(sensor.lastReading);
                response.format({
                    "application/json": () => {
                        response.status(201).send(sensorResponse);
                    },
                    "default": () => {
                        next(new httpError.NotAcceptable());
                    }
                });
                break;
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
