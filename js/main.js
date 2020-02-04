'use strict';

var NUMBER_OF_ADS = 8;

var OFFER_TITLES = ['Квартира', 'Бунгало', 'Дворец', 'Дом'];
var OFFER_COORDINATES = {
  X: {
    MIN: 0,
    MAX: 1200
  },
  Y: {
    MIN: 130,
    MAX: 630
  }
};
var OFFER_PRICES = {
  MIN: 1000,
  MAX: 100000
};
var OFFER_TYPES = ['flat', 'bungalo', 'palace', 'house'];
var OFFER_ROOMS = {
  MIN: 1,
  MAX: 4
};
var OFFER_GUESTS = {
  MIN: 1,
  MAX: 4
};
var OFFER_CHECKINS = ['12:00', '13:00', '14:00'];
var OFFER_CHECKOUTS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_DESCRIPTIONS = [
  'Уютная спальня',
  'Утреннее солнце в кухне создаст настроение на весь день',
  'Прекрасный вид из окон на парк радует в любое время года',
  'Летом на закате в окна доносится запах нагретой солнцем травы'
];
var OFFER_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var map = document.querySelector('.map');

var activateMap = function () {
  map.classList.remove('map--faded');
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

var getGeneratedAd = function (number) {

  var coordinateX = getRandomNumber(OFFER_COORDINATES.X.MIN, OFFER_COORDINATES.X.MAX);
  var coordinateY = getRandomNumber(OFFER_COORDINATES.Y.MIN, OFFER_COORDINATES.Y.MAX);

  return {
    author: {
      avatar: 'img/avatars/user0' + number + '.png'
    },

    offer: {
      title: getRandomItem(OFFER_TITLES),
      address: coordinateX + ', ' + coordinateY,
      price: getRandomNumber(OFFER_PRICES.MIN, OFFER_PRICES.MAX),
      type: getRandomItem(OFFER_TYPES),
      rooms: getRandomNumber(OFFER_ROOMS.MIN, OFFER_ROOMS.MAX),
      guests: getRandomNumber(OFFER_GUESTS.MIN, OFFER_GUESTS.MAX),
      checkin: getRandomItem(OFFER_CHECKINS),
      checkout: getRandomItem(OFFER_CHECKOUTS),
      features: getArrayRandomLength(OFFER_FEATURES),
      description: getRandomItem(OFFER_DESCRIPTIONS),
      photos: getArrayRandomLength(OFFER_PHOTOS)
    },

    location: {
      x: coordinateX,
      y: coordinateY
    }
  };
};

var createAds = function (numberOfAd) {
  var adsArray = [];
  for (var i = 0; i < numberOfAd; i++) {
    adsArray.push(getGeneratedAd(i + 1));
  }
  return adsArray;
};

var createPin = function (pin) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var newPin = pinTemplate.cloneNode(true);
  newPin.style.top = pin.location.y - PIN_HEIGHT + 'px';
  newPin.style.left = pin.location.x - PIN_WIDTH / 2 + 'px';
  newPin.querySelector('img').src = pin.author.avatar;
  newPin.querySelector('img').alt = pin.offer.title;
  return newPin;
};

var renderPins = function (pins) {
  var fragment = document.createDocumentFragment();
  pins.forEach(function (pin) {
    fragment.appendChild(createPin(pin));
  });
  map.querySelector('.map__pins').appendChild(fragment);
};

var adsList = createAds(NUMBER_OF_ADS);
activateMap();
renderPins(adsList);
