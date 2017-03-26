"use strict";

const cluster = require("cluster");
const cpus = require("os").cpus().length;
const path = require("path");
const config = require(path.join(__dirname, "config", "start.json"));
const pkg = require(path.join(__dirname, "package.json"));
const debug = require("util").debuglog(pkg.name);

process.title = pkg.name;
config.basedir = __dirname;



const ambientLightSensor = require("tinkerForge-sensor").AmbientLightSensor;
const humiditySensor = require("tinkerForge-sensor").HumiditySensor;
const soundIntensitySensor = require("tinkerForge-sensor").SoundIntensitySensor;
const tempratureSensor = require("tinkerForge-sensor").TempratureSensor;
const dummySensorAll =  require("tinkerForge-sensor").DummySensor;

let ambientsensor = new ambientLightSensor({
    frequency: 2000,
    UID: "yih",
    type: "Ambient Sensor",
    name: "AmbientLight Sensor",
    unit: "lux"
});
ambientsensor.onchange = event => {
    ambientsensor.reading = event.reading;
    ambientsensor.lastReading = event;
}


let humiditysensor = new humiditySensor({
    frequency: 2000,
    UID: "xDM",
    type: "Humidity Sensor",
    name: "Humidity Sensor",
    unit: "%"
});

humiditysensor.onchange = event => {
    humiditysensor.reading = event.reading;
    humiditysensor.lastReading = event;
}


let soundintensitysensor = new soundIntensitySensor({
    frequency: 2000,
    UID: "vqY",
    type: "Sound Intensity Sensor",
    name: "SoundIntensity Sensor",
    unit: "W/m^2"
});
soundintensitysensor.onchange = event => {
    soundintensitysensor.reading = event.reading;
    soundintensitysensor.lastReading = event;
}



let tempraturesensor = new tempratureSensor({
    frequency: 2000,
    UID: "tkw",
    type: "Temperature Sensor",
    name: "Temprature Sensor",
    unit: "°C"
});
tempraturesensor.onchange = event => {
    tempraturesensor.reading = event.reading;
    tempraturesensor.lastReading = event;
}


let sensorsmap = new Map();
sensorsmap.set(ambientsensor.id, ambientsensor);
sensorsmap.set(humiditysensor.id, humiditysensor);
sensorsmap.set(soundintensitysensor.id, soundintensitysensor);
sensorsmap.set(tempraturesensor.id, tempraturesensor);


if(config.http.secure)
{
    let https = require("https");
    https.globalAgent.maxSockets = 16384;
    https.globalAgent.options.agent = false;
}
else
{
    let http = require("http");
    http.globalAgent.maxSockets = 16384;
    http.globalAgent.options.agent = false;
}

Promise.all([
    ambientsensor.start(),
    humiditysensor.start(),
    soundintensitysensor.start(),
    tempraturesensor.start()


]).then(() => {
    // start the server
    console.log("all sensors started");
    config.sensors = {
        sensorsmap:sensorsmap
    };
    if (cluster.isMaster)
    {

        // for (let i = 0; i < cpus; ++i)
        // {
            cluster.fork();
        // }
    }
    else
    {
        launcher(cluster.worker, pkg, config);
    }

    cluster.on("fork", function(worker)
    {
    });

    cluster.on("disconnect", function()
    {
    });

    cluster.on("error", function(error)
    {
        debug(error);
    });

    cluster.on("exit", function(worker, code, signal)
    {
        debug("Worker with id: " + worker.id + " died.");
        debug("Code: " + code);
        debug("Signal: " + signal);
        // restart may be possible
        //cluster.fork();
    });

    process.on("uncaughtException", function (error)
    {
        debug(error.message);
        debug(error.stack);
        process.exit(1);
    });



    function launcher(worker, pkg, config)
    {
        //console.log("inside launcher");
        const app = new (require("./lib/DefaultApp"))(worker, pkg, config);
        worker.process.title = `${pkg.name}:${worker.id}`;
        app.start();
        //console.log("server started " + worker.process.title)
    };
})
