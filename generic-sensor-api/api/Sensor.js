'use strict';

const uuid = require("uuid");
const SensorState = require('./SensorState');

module.exports = class Sensor {
  constructor(sensorOptions) {
    this._id = uuid();
    this._sensorOptions = sensorOptions || {};
    if(this.sensorOptions.frequency === 'undefined') {
      this.sensorOptions.frequency = 500;
    }
    this._state = null;
    this._reading = null;
    this._lastReading = { timestamp: null, value: null };
    this._target = null;
    this._onactivate = event => {};
    this._onchange = event => {};
    this._onerror = event => {};
  }
  set id(value) {
    this._id = value;
  }
  get id() {
    return this._id;
  }
  set target(value) {
        this._target = value;
  }
  get target() {
        return this._target;
  }
  set sensorOptions(value) {
    this._sensorOptions = value;
  }
  get sensorOptions() {
    return this._sensorOptions;
  }
  set state(value) {
    this._state = value;
  }
  get state() {
    return this._state;
  }
  set reading(value) {
    this._reading = value;
  }
  get reading() {
    return this._reading;
  }
  set lastReading(value) {
        this._lastReading = value;
  }
  get lastReading() {
        return this._lastReading;
  }
  set onactivate(value) {
    this._onactivate = value;
  }
  get onactivate() {
    return this._onactivate;
  }
  set unit(value) {
        this._unit = value;
  }
  get unit() {
        return this._unit;
  }
  set onchange(value) {
    this._onchange = value;
  }
  get onchange() {
    return this._onchange;
  }
  set onerror(value) {
    this._onerror = value;
  }
  get onerror() {
    return this._onerror;
  }
  start() {
    this.state = SensorState.ACTIVATING;
    this.state = SensorState.ACTIVATED;
    this.onactivate();
    return this.handleStarted();
  }
  stop() {
    this.state = SensorState.IDLE;
    return this.handleStopped();
  }
}
