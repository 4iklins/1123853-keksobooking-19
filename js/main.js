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

var HOUSING_TYPES = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало',
  palace: 'Дворец'
};

var map = document.querySelector('.map');
var mapFilters = map.querySelector('.map__filters-container');

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

var createFeatureList = function (array) {
  return array.map(function (item) {
    return '<li class="popup__feature popup__feature--' + item + '"></li>';
  }).join('\n');
};

var createGalleryElements = function (array) {
  return array.map(function (item) {
    return '<img src="' + item + '"' + ' class="popup__photo" width="45" height="40" alt="Фотография жилья">';
  }).join('\n');
};

var fillCard = function (cardItem) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = cardItem.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = cardItem.offer.address;
  cardElement.querySelector('.popup__text--price').innerHTML = cardItem.offer.price + ' &#x20bd;/ночь';
  cardElement.querySelector('.popup__type').textContent = HOUSING_TYPES[cardItem.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = cardItem.offer.rooms + ' комнат для ' + cardItem.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardItem.offer.checkin + ', выезд до ' + cardItem.offer.checkout;
  cardElement.querySelector('.popup__features').innerHTML = '';
  cardElement.querySelector('.popup__features').insertAdjacentHTML('beforeend', createFeatureList(cardItem.offer.features));
  cardElement.querySelector('.popup__description').textContent = cardItem.offer.description;
  cardElement.querySelector('.popup__photos').innerHTML = '';
  cardElement.querySelector('.popup__photos').insertAdjacentHTML('beforeend', createGalleryElements(cardItem.offer.photos));
  return cardElement;
};

var renderPins = function (pins) {
  var fragment = document.createDocumentFragment();
  pins.forEach(function (pin) {
    fragment.appendChild(createPin(pin));
  });
  map.querySelector('.map__pins').appendChild(fragment);
};

var renderCard = function (element) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(fillCard(element));
  mapFilters.appendChild(fragment);
};

var adsList = createAds(NUMBER_OF_ADS);
activateMap();
renderPins(adsList);
renderCard(adsList[0]);
