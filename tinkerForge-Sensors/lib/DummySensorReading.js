'use strict';
const SensorReading = require('generic-sensor-api').SensorReading;

module.exports = class DummySensorReading extends SensorReading {
  constructor(timestamp, value) {
    super(timestamp);
    this._dummyValue = value;
    //this._name = value;
  }

get name(){
  return this._name;
}

set name(value){
  this._name = value;
}

  get dummyValue() {
    return this._dummyValue;
  }
  set dummyValue(value) {
    this._dummyValue = value;
  }
}
