'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  var ESC_KEY = 'Escape';
  var LEFT_MOUSE_BUTTON_KEY = 0;

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');

  var isEnterEvent = function (evt) {
    return evt.key === ENTER_KEY;
  };

  var isEscEvent = function (evt) {
    return evt.key === ESC_KEY;
  };

  var isLeftMouseButtonEvent = function (evt) {
    return evt.button === LEFT_MOUSE_BUTTON_KEY;
  };

  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  var getRandomItem = function (array) {
    return array[getRandomNumber(0, array.length)];
  };

  var getShuffleArray = function (array) {
    var shuffleArray = array;
    var j;
    var temp;
    for (var i = shuffleArray.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = shuffleArray[j];
      shuffleArray[j] = shuffleArray[i];
      shuffleArray[i] = temp;
    }
    return shuffleArray;
  };

  var getArrayRandomLength = function (array) {
    return getShuffleArray(array).slice(0, getRandomNumber(1, array.length));
  };

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
    var forms = ['комнат', 'комната', 'комнаты'];
    return flexNormalize(number, forms);
  };

  var guestsFlexNormalize = function (number) {
    var forms = ['гостей', 'гостя', 'гостей'];
    return flexNormalize(number, forms);
  };

  var createFeatureList = function (features) {
    return features.map(function (feature) {
      return '<li class="popup__feature popup__feature--' + feature + '"></li>';
    }).join('\n');
  };

  var createGalleryElements = function (photos) {
    return photos.map(function (photo) {
      return '<img src="' + photo + '"' + ' class="popup__photo" width="45" height="40" alt="Фотография жилья">';
    }).join('\n');
  };

  var addClass = function (element, className) {
    return element.classList.add(className);
  };

  var removeClass = function (element, className) {
    return element.classList.remove(className);
  };

  window.util = {
    map: map,
    mapPins: mapPins,
    mapPinMain: mapPinMain,
    adForm: adForm,
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    isLeftMouseButtonEvent: isLeftMouseButtonEvent,
    getRandomNumber: getRandomNumber,
    getRandomItem: getRandomItem,
    getShuffleArray: getShuffleArray,
    getArrayRandomLength: getArrayRandomLength,
    flexNormalize: flexNormalize,
    roomsFlexNormalize: roomsFlexNormalize,
    guestsFlexNormalize: guestsFlexNormalize,
    createFeatureList: createFeatureList,
    createGalleryElements: createGalleryElements,
    addClass: addClass,
    removeClass: removeClass
  };
})();

