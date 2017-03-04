"use strict";

const cluster = require("cluster");
const cpus = require("os").cpus().length;
const path = require("path");
const config = require(path.join(__dirname, "config", "start.json"));
const pkg = require(path.join(__dirname, "package.json"));
const debug = require("util").debuglog(pkg.name);

process.title = pkg.name;
config.basedir = __dirname;

const ambientLightSensor = require("dummy-sensor").AmbientLightSensor;
const humiditySensor = require("dummy-sensor").HumiditySensor;
const soundIntensitySensor = require("dummy-sensor").SoundIntensitySensor;
const tempratureSensor = require("dummy-sensor").TempratureSensor;

let ambientsensor = new ambientLightSensor({
        frequency: 2000,
        name: "AmbientLightSensor"
});
ambientsensor.onchange = event => ambientsensor.reading = event.reading;

let humiditysensor = new humiditySensor({
    frequency: 2000,
    name: "HumiditySensor"
});
humiditysensor.onchange = event => humiditysensor.reading = event.reading;

let soundintensitysensor = new soundIntensitySensor({
    frequency: 2000,
    name: "SoundIntensitySensor"
});
soundintensitysensor.onchange = event => soundintensitysensor.reading = event.reading;


let tempraturesensor = new tempratureSensor({
    frequency: 2000,
    name: "TempratureSensor"
});
tempraturesensor.onchange = event => tempraturesensor.reading = event.reading;

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
    console.log("all sensors started")
    config.sensors = {
        sensorsmap:sensorsmap,
        // ambientsensor: ambientsensor,
        // humiditysensor:humiditysensor,
        // soundintensitysensor:soundintensitysensor,
        // tempraturesensor:tempraturesensor
    };
    if (cluster.isMaster)
    {

        for (let i = 0; i < cpus; ++i)
        {
            cluster.fork();
        }
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
        const app = new (require("./lib/DefaultApp"))(worker, pkg, config);
        worker.process.title = `${pkg.name}:${worker.id}`;
        app.start();
        //console.log("server started " + worker.process.title)
    };
})


