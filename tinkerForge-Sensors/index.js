'use strict';
const AmbientLightSensor = require('./lib/AmbientLightSensor');
const HumiditySensor = require('./lib/HumiditySensor');
const SoundIntensitySensor = require('./lib/SoundIntensitySensor');
const TempratureSensor = require('./lib/TempratureSensor');
const DummySensor = require('./lib/DummySensor');
const DummySensorReading = require('./lib/DummySensorReading');
const PhoneSensor = require('./lib/PhoneSensor');

module.exports = {
  AmbientLightSensor: AmbientLightSensor,
  HumiditySensor: HumiditySensor,
  SoundIntensitySensor: SoundIntensitySensor,
  TempratureSensor: TempratureSensor,
  DummySensor: DummySensor,
  PhoneSensor: PhoneSensor,
  DummySensorReading: DummySensorReading
}
