'use strict';

(function () {
  var ACTIVE_MAIN_PIN_WIDTH = 65;
  var ACTIVE_MAIN_PIN_HEIGHT = 84;

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

  var HOUSING_TYPES = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
    palace: 'Дворец'
  };
  var ESC_KEY = 'Escape';

  var map = window.util.map;
  var mapPinMain = window.util.mapPinMain;
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);
  var cardButtonClose = cardElement.querySelector('.popup__close');
  var mapFilters = map.querySelector('.map__filters-container');
  var roomsFlexNormalize = window.util.roomsFlexNormalize;
  var guestsFlexNormalize = window.util.guestsFlexNormalize;
  var addressField = window.form.addressField;
  var addClass = window.util.addClass;
  var removeClass = window.util.removeClass;

  var getOfferFeatures = function (cardItem) {
    var cardFeaturesList = cardElement.querySelector('.popup__features');
    cardFeaturesList.innerHTML = '';
    var fragment = document.createDocumentFragment();

    if (cardItem.offer.features.length > 0) {
      cardItem.offer.features.forEach(function (item) {
        var newElement = document.createElement('li');
        newElement.className = cardElement.querySelector('.popup__features') + item;
        fragment.appendChild(newElement);
      });

      cardFeaturesList.appendChild(fragment);
      removeClass(cardFeaturesList, 'hidden');
    } else {
      addClass(cardFeaturesList, 'hidden');
    }
  };

  var getOfferPhotos = function (cardItem) {
    var photosContainer = cardElement.querySelector('.popup__photos');
    photosContainer.innerHTML = '';
    var fragment = document.createDocumentFragment();

    if (cardItem.offer.photos.length > 0) {
      cardItem.offer.photos.forEach(function (item) {
        var newImgElement = document.createElement('img');
        newImgElement.className = 'popup__photo';
        newImgElement.src = item;
        newImgElement.alt = 'Фотография жилья';
        newImgElement.width = '40';
        newImgElement.height = '40';
        fragment.appendChild(newImgElement);
      });

      photosContainer.appendChild(fragment);
      removeClass(photosContainer, 'hidden');
    } else {
      addClass(photosContainer, 'hidden');
    }
  };

  var renderCard = function (cardItem) {
    var rooms = cardItem.offer.rooms;
    var guests = cardItem.offer.guests;
    var descriptionContainer = cardElement.querySelector('.popup__description');
    cardElement.querySelector('.popup__avatar').src = cardItem.author.avatar;
    cardElement.querySelector('.popup__title').textContent = cardItem.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = cardItem.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = cardItem.offer.price + ' ₽/ночь';
    cardElement.querySelector('.popup__type').textContent = HOUSING_TYPES[cardItem.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = rooms + ' ' + roomsFlexNormalize(rooms) + ' для ' + guests + ' ' + guestsFlexNormalize(guests);
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardItem.offer.checkin + ', выезд до ' + cardItem.offer.checkout;

    if (cardItem.offer.description) {
      descriptionContainer.textContent = cardItem.offer.description;
      removeClass(descriptionContainer, 'hidden');
    } else {
      addClass(descriptionContainer, 'hidden');
    }
    getOfferFeatures(cardItem);
    getOfferPhotos(cardItem);

    if (map.querySelector('.map__card') === null) {
      map.insertBefore(cardElement, mapFilters);
    }
  };

  var openCard = function (evt) {
    var clickedPin;

    if (evt.target.classList.contains('map__pin')) {
      clickedPin = evt.target;
    } else {
      clickedPin = evt.target.parentNode;
    }

    if ((!clickedPin.classList.contains('map__pin--main')) && (clickedPin.classList.contains('map__pin'))) {
      var clickedPinId = parseInt(clickedPin.getAttribute('id'), 10);
      renderCard(window.adsList[clickedPinId]);
      removeClass(cardElement, 'hidden');
      document.addEventListener('keydown', onEscapeKeydown);
    }
  };

  var closeCard = function () {
    addClass(cardElement, 'hidden');
    document.removeEventListener('keydown', onEscapeKeydown);
  };

  var onEscapeKeydown = function (evt) {
    if (evt.key === ESC_KEY) {
      closeCard();
    }
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mapPinMainCoords = {
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y
      };

      if (mapPinMainCoords.x > (OFFER_COORDINATES.X.MAX - ACTIVE_MAIN_PIN_WIDTH / 2)) {
        mapPinMainCoords.x = (OFFER_COORDINATES.X.MAX - ACTIVE_MAIN_PIN_WIDTH / 2);
      }
      if (mapPinMainCoords.y > (OFFER_COORDINATES.Y.MAX - ACTIVE_MAIN_PIN_HEIGHT)) {
        mapPinMainCoords.y = (OFFER_COORDINATES.Y.MAX - ACTIVE_MAIN_PIN_HEIGHT);
      }
      if (mapPinMainCoords.x < (OFFER_COORDINATES.X.MIN - ACTIVE_MAIN_PIN_WIDTH / 2)) {
        mapPinMainCoords.x = (OFFER_COORDINATES.X.MIN - ACTIVE_MAIN_PIN_WIDTH / 2);
      }
      if (mapPinMainCoords.y < (OFFER_COORDINATES.Y.MIN - ACTIVE_MAIN_PIN_HEIGHT)) {
        mapPinMainCoords.y = (OFFER_COORDINATES.Y.MIN - ACTIVE_MAIN_PIN_HEIGHT);
      }

      mapPinMain.style.left = mapPinMainCoords.x + 'px';
      mapPinMain.style.top = mapPinMainCoords.y + 'px';

      addressField.setAttribute('value', Math.round(mapPinMainCoords.x + ACTIVE_MAIN_PIN_WIDTH / 2) + ', ' + (mapPinMainCoords.y + ACTIVE_MAIN_PIN_HEIGHT));
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


  window.card = {
    closeButton: cardButtonClose,
    render: renderCard,
    open: openCard,
    close: closeCard
  };
})();
