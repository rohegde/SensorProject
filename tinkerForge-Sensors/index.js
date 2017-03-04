'use strict';
const AmbientLightSensor = require('./lib/AmbientLightSensor');
const HumiditySensor = require('./lib/HumiditySensor');
const SoundIntensitySensor = require('./lib/SoundIntensitySensor');
const TempratureSensor = require('./lib/TempratureSensor');
const DummySensorReading = require('./lib/DummySensorReading');

module.exports = {
  AmbientLightSensor: AmbientLightSensor,
  HumiditySensor:HumiditySensor,
  SoundIntensitySensor:SoundIntensitySensor,
  TempratureSensor:TempratureSensor,
  DummySensorReading: DummySensorReading
}
