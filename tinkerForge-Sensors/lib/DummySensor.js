'use strict';

const Sensor = require('generic-sensor-api').Sensor;
const DummySensorReading = require('./DummySensorReading');

module.exports = class DummySensor extends Sensor {

    constructor(sensorOptions) {
        super(sensorOptions);
        this._intervalHandle = null;
        this.name = sensorOptions.name;
        this.type = sensorOptions.type;
        this.UID = sensorOptions.UID;
        this.unit = sensorOptions.unit;
    }

    handleStarted() {
        return new Promise((resolve, reject) => {
            this._intervalHandle = setInterval(
                () => {
                    let dummySensorReading = new DummySensorReading(
                        Date.now(),
                        Math.floor(Math.random() * (100 - 1)) + 1
                    )
                    this.onchange({
                        reading: dummySensorReading
                    });
                },
                this.sensorOptions.frequency
            );
            resolve();
        });
    }

    handleStopped() {
        return new Promise((resolve, reject) => {
            clearInterval(this._intervalHandle);
            resolve();
        });
    }
}