'use strict';
const SoundIntensitySensor = require('./lib/SoundIntensitySensor');

let SoundIntensity = new SoundIntensitySensor({
  frequency: 500
});
SoundIntensity.onactivate = event => console.log('SoundIntensitySensor activated');
SoundIntensity.onchange = event => console.log(
  `${event.reading.dummyValue}`
);
SoundIntensity.start();
setTimeout(
  () => {
    SoundIntensity.stop();
  },
  5000
);

const AmbientLightSensor = require('./lib/AmbientLightSensor');
let AmbientLight = new AmbientLightSensor({
  frequency:600
});
AmbientLight.onactivate = event => console.log('AmbientLightSensor activated');
AmbientLight.onchange = event => console.log(
  `${new Date(event.reading.timestamp).toLocaleTimeString()} ${event.reading.dummyValue}`
);
AmbientLight.start();
setTimeout(
  () => {
    AmbientLight.stop();
  },
  6000
);

const HumiditySensor = require('./lib/HumiditySensor');
let Humidity = new HumiditySensor({
  frequency:800
});
Humidity.onactivate = event => console.log('HumiditySensor activated');
Humidity.onchange = event => console.log(
  `${new Date(event.reading.timestamp)} ${event.reading.dummyValue}`
);
Humidity.start();
setTimeout(
  () => {
    Humidity.stop();
  },
  8000
);

const TempratureSensor = require('./lib/TempratureSensor');
let Temprature = new TempratureSensor({
  frequency:900
});
Temprature.onactivate = event => console.log('TempratureSensor activated');
Temprature.onchange = event => console.log(
  `${new Date(event.reading.timestamp)} ${event.reading.dummyValue}`
);
Temprature.start();
setTimeout(
  () => {
    Temprature.stop();
  },
  9000
);
