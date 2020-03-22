'use strict';

(function () {
  var FORMS = {
    rooms: ['комнат', 'комната', 'комнаты'],
    guests: ['гостей', 'гостя', 'гостей']
  };

  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var mapFilters = document.querySelector('.map__filters-container');

  var flexNormalize = function (number, forms) {
    number = Number(number);
    if (number % 100 === 11) {
      return forms[0];
    }
    var remainder = number % 10;
    switch (true) {
      case remainder === 0 || remainder > 4:
        return forms[0];
      case remainder === 1:
        return forms[1];
      default:
        return forms[2];
    }
  };

  var roomsFlexNormalize = function (number) {
    return flexNormalize(number, FORMS.rooms);
  };

  var guestsFlexNormalize = function (number) {
    return flexNormalize(number, FORMS.guests);
  };

  var addClass = function (element, className) {
    return element.classList.add(className);
  };

  var removeClass = function (element, className) {
    return element.classList.remove(className);
  };

  window.util = {
    map: map,
    mapPinsContainer: mapPinsContainer,
    mapPinMain: mapPinMain,
    adForm: adForm,
    mapFilters: mapFilters,
    flexNormalize: flexNormalize,
    roomsFlexNormalize: roomsFlexNormalize,
    guestsFlexNormalize: guestsFlexNormalize,
    addClass: addClass,
    removeClass: removeClass
  };
})();

