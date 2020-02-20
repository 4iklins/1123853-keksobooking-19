'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var mapPins = window.util.mapPins;


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
    pins.forEach(function (pin, index) {
      fragment.appendChild(createPin(pin, index));
    });
    mapPins.appendChild(fragment);
  };

  window.pin = {
    create: createPin,
    render: renderPins
  };
})();
