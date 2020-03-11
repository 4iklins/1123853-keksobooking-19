'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var map = window.util.map;
  var mapPinsContainer = window.util.mapPinsContainer;

  var createPin = function (pin, index) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var newPin = pinTemplate.cloneNode(true);
    newPin.style.top = pin.location.y - PIN_HEIGHT + 'px';
    newPin.style.left = pin.location.x - PIN_WIDTH / 2 + 'px';
    newPin.querySelector('img').src = pin.author.avatar;
    newPin.querySelector('img').alt = pin.offer.title;
    newPin.setAttribute('id', String(index));
    return newPin;
  };

  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();
    pins.slice(0, 5).forEach(function (pin) {
      fragment.appendChild(createPin(pin, pin.id));
    });
    mapPinsContainer.appendChild(fragment);
    window.mapPins = map.querySelectorAll('button[type="button"]');
  };

  var removePins = function (pins) {
    return pins.forEach(function (item) {
      item.remove();
    });
  };

  window.pin = {
    create: createPin,
    render: renderPins,
    remove: removePins
  };
})();
