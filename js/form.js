'use strict';

(function () {
  var INACTIVE_MAIN_PIN_WIDTH = 65;
  var INACTIVE_MAIN_PIN_HEIGHT = 65;

  var ACTIVE_MAIN_PIN_WIDTH = 65;
  var ACTIVE_MAIN_PIN_HEIGHT = 84;

  var MAIN_PIN_TOP = '375px';
  var MAIN_PIN_LEFT = '570px';

  var MIN_TITLE_LENGTH = 30;

  var HOUSING_PRICES = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var roomsCapacityMap = {
    '1': [1],
    '2': [1, 2],
    '3': [1, 2, 3],
    '100': [0]
  };

  var adForm = window.util.adForm;
  var addressField = adForm.querySelector('#address');
  var titleField = adForm.querySelector('#title');
  var typeOfHousingField = adForm.querySelector('#type');
  var pricePerNightField = adForm.querySelector('#price');
  var checkinField = adForm.querySelector('#timein');
  var checkoutField = adForm.querySelector('#timeout');
  var roomsField = adForm.querySelector('#room_number');
  var guestsField = adForm.querySelector('#capacity');
  var mapPinMain = window.util.mapPinMain;
  var onSuccess = window.load.send;
  var main = document.querySelector('main');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successNode = successTemplate.cloneNode(true);
  var errorTamplate = document.querySelector('#error').content.querySelector('.error');
  var errorNode = errorTamplate.cloneNode(true);

  var fillInactiveAddressField = function () {
    mapPinMain.style.left = MAIN_PIN_LEFT;
    mapPinMain.style.top = MAIN_PIN_TOP;
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

  var validateTitle = function () {
    if (titleField.validity.valueMissing) {
      titleField.setCustomValidity('Обязательное текстовое поле');
    } else if (titleField.value.length < MIN_TITLE_LENGTH) {
      titleField.setCustomValidity('Минимальная длина — ' + MIN_TITLE_LENGTH + ' символов');
    } else {
      titleField.setCustomValidity('');
    }
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

  validateTitle();
  validatePrice();
  setActiveGuestFieldItem();

  var onTitleFieldInput = function () {
    validateTitle();
  };

  var onPricePerNightFieldInput = function () {
    validatePrice();
  };

  var onRoomsFieldChange = function () {
    setActiveGuestFieldItem();
  };

  var sendFormData = function (evt) {
    onSuccess(new FormData(adForm), function () {
      main.appendChild(successNode);
      window.map.setInactive();
      window.pin.remove(window.mapPins);
      addEventListener('click', onSuccessNodeClick);
      addEventListener('keydown', onSuccessNodeKeydown);
    }, onError);
    evt.preventDefault();
  };

  var onError = function () {
    main.appendChild(errorNode);
    addEventListener('click', onErrorNodeClick);
    addEventListener('keydown', onErrorNodeKeydown);
  };

  var onSuccessSubmit = function (evt) {
    sendFormData(evt);
  };

  var onSuccessNodeClick = function (evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('success') || clickedElement.classList.contains('success__message')) {
      successNode.remove();
    }
  };

  var onErrorNodeClick = function (evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('error') || clickedElement.classList.contains('error__message') || clickedElement.classList.contains('error__button')) {
      errorNode.remove();
    }
  };

  var onSuccessNodeKeydown = function () {
    if (window.util.isEscEvent) {
      successNode.remove();
    }
  };

  var onErrorNodeKeydown = function () {
    if (window.util.isEscEvent) {
      errorNode.remove();
    }
  };

  var resetForm = function () {
    adForm.reset();
  };


  titleField.addEventListener('input', onTitleFieldInput);
  typeOfHousingField.addEventListener('change', onTypeOfHousingChange);
  pricePerNightField.addEventListener('input', onPricePerNightFieldInput);
  checkinField.addEventListener('change', onCheckinFieldChange);
  checkoutField.addEventListener('change', onCheckoutFieldChange);
  roomsField.addEventListener('change', onRoomsFieldChange);
  adForm.addEventListener('submit', onSuccessSubmit);

  window.form = {
    setInactiveFields: setInactiveFields,
    setActiveFields: setActiveFields,
    addressField: addressField,
    fillInactiveAddressField: fillInactiveAddressField,
    fillActiveAddressField: fillActiveAddressField,
    onTypeOfHousingChange: onTypeOfHousingChange,
    validateTitle: validateTitle,
    validatePrice: validatePrice,
    setActiveGuestFieldItem: setActiveGuestFieldItem,
    onCheckinFieldChange: onCheckinFieldChange,
    onCheckoutFieldChange: onCheckoutFieldChange,
    resetForm: resetForm
  };
})();

