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

var HOUSING_PRICES = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var INACTIVE_MAIN_PIN_WIDTH = 65;
var INACTIVE_MAIN_PIN_HEIGHT = 65;

var ACTIVE_MAIN_PIN_WIDTH = 65;
var ACTIVE_MAIN_PIN_HEIGHT = 84;

var ENTER_KEY = 'Enter';
var LEFT_MOUSE_BUTTON_KEY = 0;
var MIN_TITLE_LENGTH = 30;

var roomsCapacityMap = {
  '1': [1],
  '2': [1, 2],
  '3': [1, 2, 3],
  '100': [0]
};

var map = document.querySelector('.map');
var mapFilters = map.querySelector('.map__filters-container');
var mapPin = map.querySelector('.map__pins');
var mapPinMain = map.querySelector('.map__pin--main');
var mapFiltersSelectLists = mapFilters.querySelectorAll('select');
var mapFiltersFeaturesList = mapFilters.querySelector('.map__features');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var addressField = adForm.querySelector('#address');
var titleField = adForm.querySelector('#title');
var typeOfHousingField = adForm.querySelector('#type');
var pricePerNightField = adForm.querySelector('#price');
var checkinField = adForm.querySelector('#timein');
var checkoutField = adForm.querySelector('#timeout');
var roomsField = adForm.querySelector('#room_number');
var guestsField = adForm.querySelector('#capacity');

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

var renderCard = function (cardItem) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);
  var rooms = cardItem.offer.rooms;
  var guests = cardItem.offer.guests;
  cardElement.querySelector('.popup__title').textContent = cardItem.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = cardItem.offer.address;
  cardElement.querySelector('.popup__text--price').innerHTML = cardItem.offer.price + ' &#x20bd;/ночь';
  cardElement.querySelector('.popup__type').textContent = HOUSING_TYPES[cardItem.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = rooms + ' ' + roomsFlexNormalize(rooms) + ' для ' + guests + ' ' + guestsFlexNormalize(guests);
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardItem.offer.checkin + ', выезд до ' + cardItem.offer.checkout;
  cardElement.querySelector('.popup__features').innerHTML = '';
  cardElement.querySelector('.popup__features').insertAdjacentHTML('beforeend', createFeatureList(cardItem.offer.features));
  cardElement.querySelector('.popup__description').textContent = cardItem.offer.description;
  cardElement.querySelector('.popup__photos').innerHTML = '';
  cardElement.querySelector('.popup__photos').insertAdjacentHTML('beforeend', createGalleryElements(cardItem.offer.photos));

  map.insertBefore(cardElement, mapFilters);
};

var renderPins = function (pins) {
  var fragment = document.createDocumentFragment();
  pins.forEach(function (pin) {
    fragment.appendChild(createPin(pin));
  });
  mapPin.appendChild(fragment);
};

var adsList = createAds(NUMBER_OF_ADS);

var removeClass = function (element, className) {
  return element.classList.remove(className);
};

var setActivePage = function () {
  removeClass(map, 'map--faded');
  removeClass(adForm, 'ad-form--disabled');
  renderPins(adsList);
  renderCard(adsList[0]);
  fillActiveAddressField();
  addressField.setAttribute('readonly', '');
  mapFiltersFeaturesList.removeAttribute('disabled', '');
  setActiveFields(mapFiltersSelectLists);
  setActiveFields(adFormFieldsets);
  validateTitle();
  validatePrice();
  setActiveGuestFieldItem();
  titleField.addEventListener('input', onTtitleFieldInput);
  typeOfHousingField.addEventListener('change', onTypeOfHousingChange);
  pricePerNightField.addEventListener('input', onPricePerNightFieldInput);
  checkinField.addEventListener('change', onCheckinFieldChange);
  checkoutField.addEventListener('change', onCheckoutFieldChange);
  roomsField.addEventListener('change', onRoomsFieldChange);
  mapPinMain.removeEventListener('mousedown', onMapPinMainLeftMouseButtonClick);
  mapPinMain.removeEventListener('keydown', onMapPinMainEnterKeyDown);
};

var onMapPinMainLeftMouseButtonClick = function (evt) {
  if (evt.button === LEFT_MOUSE_BUTTON_KEY) {
    setActivePage();
  }
};

var onMapPinMainEnterKeyDown = function (evt) {
  if (evt.key === ENTER_KEY) {
    setActivePage();
  }
};

var setInactiveFields = function (elements) {
  return elements.forEach(function (element) {
    element.setAttribute('disabled', '');
  });
};

var setActiveFields = function (elements) {
  return elements.forEach(function (element) {
    element.removeAttribute('disabled', '');
  });
};

var setInactivePage = function () {
  fillInactiveAddressField();
  mapFiltersFeaturesList.setAttribute('disabled', '');
  setInactiveFields(mapFiltersSelectLists);
  setInactiveFields(adFormFieldsets);
  addressField.setAttribute('disabled', '');
};

var fillInactiveAddressField = function () {
  var coordinates = {
    left: Math.round(parseInt(mapPinMain.style.left, 10) + INACTIVE_MAIN_PIN_WIDTH / 2),
    top: Math.round(parseInt(mapPinMain.style.top, 10) + INACTIVE_MAIN_PIN_HEIGHT / 2)
  };
  addressField.setAttribute('value', coordinates.left + ', ' + coordinates.top);
};

var fillActiveAddressField = function () {
  var coordinates = {
    left: Math.round(parseInt(mapPinMain.style.left, 10) + ACTIVE_MAIN_PIN_WIDTH / 2),
    top: Math.round(parseInt(mapPinMain.style.top, 10) + ACTIVE_MAIN_PIN_HEIGHT)
  };
  addressField.setAttribute('value', coordinates.left + ', ' + coordinates.top);
};

var validateTitle = function () {
  if (titleField.validity.valueMissing) {
    titleField.setCustomValidity('Обязательное текстовое поле');
  } else if (titleField.value.length < MIN_TITLE_LENGTH) {
    titleField.setCustomValidity('Минимальная длина — ' + MIN_TITLE_LENGTH + ' символов');
  } else {
    titleField.setCustomValidity('');
  }
};

var onTtitleFieldInput = function () {
  validateTitle();
};

var validatePrice = function () {
  if (pricePerNightField.validity.valueMissing) {
    pricePerNightField.setCustomValidity('Обязательное текстовое поле');
  } else if (pricePerNightField.validity.rangeUnderflow) {
    pricePerNightField.setCustomValidity('Цена не может быть меньше ' + pricePerNightField.min + ' руб.');
  } else if (pricePerNightField.validity.rangeOverflow) {
    pricePerNightField.setCustomValidity('Цена не может быть больше ' + pricePerNightField.max + ' руб.');
  } else {
    pricePerNightField.setCustomValidity('');
  }
};

var onPricePerNightFieldInput = function () {
  validatePrice();
};

var onTypeOfHousingChange = function (evt) {
  var target = evt.target.value;
  pricePerNightField.setAttribute('min', HOUSING_PRICES[target]);
  pricePerNightField.setAttribute('placeholder', HOUSING_PRICES[target]);
};

var onCheckinFieldChange = function (evt) {
  checkoutField.value = evt.target.value;
};

var onCheckoutFieldChange = function (evt) {
  checkinField.value = evt.target.value;
};

var setActiveGuestFieldItem = function () {
  var rooms = roomsField.value;
  var guests = guestsField;
  var selectedGuestsOptions = guests.children;
  Array.prototype.forEach.call(selectedGuestsOptions, function (item) {
    item.disabled = !roomsCapacityMap[rooms].includes(+item.value) ? true : false;
  });
  guests.value = roomsCapacityMap[rooms].includes(+guests.value)
    ? guests.value
    : roomsCapacityMap[rooms][0];
};

var onRoomsFieldChange = function () {
  setActiveGuestFieldItem();
};

mapPinMain.addEventListener('mousedown', onMapPinMainLeftMouseButtonClick);
mapPinMain.addEventListener('keydown', onMapPinMainEnterKeyDown);
setInactivePage();

