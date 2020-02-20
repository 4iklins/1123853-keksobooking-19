'use strict';

(function () {
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

  var getRandomNumber = window.util.getRandomNumber;
  var getRandomItem = window.util.getRandomItem;
  var getArrayRandomLength = window.util.getArrayRandomLength;

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

  window.data = {
    adsList: createAds(NUMBER_OF_ADS)
  };
})();
