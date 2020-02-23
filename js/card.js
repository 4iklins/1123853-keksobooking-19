/* eslint-disable no-unused-expressions */
'use strict';

(function () {
  var HOUSING_TYPES = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
    palace: 'Дворец'
  };
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

  var map = window.util.map;
  var mapPinMain = window.util.mapPinMain;
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);
  var cardButtonClose = cardElement.querySelector('.popup__close');
  var mapFilters = map.querySelector('.map__filters-container');
  var adsList = window.data.adsList;
  var removeClass = window.util.removeClass;
  var addClass = window.util.addClass;
  var roomsFlexNormalize = window.util.roomsFlexNormalize;
  var guestsFlexNormalize = window.util.guestsFlexNormalize;
  var createFeatureList = window.util.createFeatureList;
  var createGalleryElements = window.util.createGalleryElements;
  var isEscEvent = window.util.isEscEvent;
  var addressField = window.form.addressField;

  var renderCard = function (cardItem) {
    var rooms = cardItem.offer.rooms;
    var guests = cardItem.offer.guests;
    cardElement.querySelector('.popup__avatar').src = cardItem.author.avatar;
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

  var openCard = function (evt) {
    var clickedPin;

    if (evt.target.classList.contains('map__pin')) {
      clickedPin = evt.target;
    } else {
      clickedPin = evt.target.parentNode;
    }

    if ((!clickedPin.classList.contains('map__pin--main')) && (clickedPin.classList.contains('map__pin'))) {
      var clickedPinId = parseInt(clickedPin.getAttribute('id'), 10);
      renderCard(adsList[clickedPinId]);
      removeClass(cardElement, 'hidden');
      document.addEventListener('keydown', onEscapeKeydown);
    }
  };

  var closeCard = function () {
    addClass(cardElement, 'hidden');
    document.removeEventListener('keydown', onEscapeKeydown);
  };

  var onEscapeKeydown = function () {
    if (isEscEvent) {
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

      var pinTopCoordinate = parseInt(mapPinMain.style.top, 10) + ACTIVE_MAIN_PIN_HEIGHT - shift.y;
      var pinLeftCoordinate = Math.round(parseInt(mapPinMain.style.left, 10) + ACTIVE_MAIN_PIN_WIDTH / 2 - shift.x);

      (pinTopCoordinate >= OFFER_COORDINATES.Y.MIN && pinTopCoordinate <= OFFER_COORDINATES.Y.MAX)
        ? mapPinMain.style.top = (parseInt(mapPinMain.style.top, 10) - shift.y) + 'px'
        : pinLeftCoordinate += shift.y;

      (pinLeftCoordinate >= OFFER_COORDINATES.X.MIN && pinLeftCoordinate <= OFFER_COORDINATES.X.MAX)
        ? mapPinMain.style.left = (parseInt(mapPinMain.style.left, 10) - shift.x) + 'px'
        : pinLeftCoordinate += shift.x;

      addressField.setAttribute('value', pinLeftCoordinate + ', ' + pinTopCoordinate);
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
