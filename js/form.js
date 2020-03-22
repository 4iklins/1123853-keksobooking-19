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
  var INPUT_BORDER = 'outline: none; box-shadow: 0 0 2px 2px #ff6547;';

  var roomsCapacityMap = {
    '1': [1],
    '2': [1, 2],
    '3': [1, 2, 3],
    '100': [0]
  };
  var ESC_KEY = 'Escape';

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
  var onSuccessSend = window.load.send;
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
      titleField.style = INPUT_BORDER;
    } else if (titleField.value.length < MIN_TITLE_LENGTH) {
      titleField.setCustomValidity('Минимальная длина — ' + MIN_TITLE_LENGTH + ' символов');
      titleField.style = INPUT_BORDER;
    } else {
      titleField.setCustomValidity('');
      titleField.style = 'box-shadow: none';
    }
  };

  var validatePrice = function () {
    if (pricePerNightField.validity.valueMissing) {
      pricePerNightField.setCustomValidity('Обязательное текстовое поле');
      pricePerNightField.style = INPUT_BORDER;
    } else if (pricePerNightField.validity.rangeUnderflow) {
      pricePerNightField.setCustomValidity('Цена не может быть меньше ' + pricePerNightField.min + ' руб.');
      pricePerNightField.style = INPUT_BORDER;
    } else if (pricePerNightField.validity.rangeOverflow) {
      pricePerNightField.setCustomValidity('Цена не может быть больше ' + pricePerNightField.max + ' руб.');
      pricePerNightField.style = INPUT_BORDER;
    } else {
      pricePerNightField.setCustomValidity('');
      pricePerNightField.style = 'box-shadow: none';
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
    onSuccessSend(new FormData(adForm), function () {
      main.appendChild(successNode);
      window.map.setInactive();
      window.pin.remove(window.mapPins);
      document.addEventListener('click', onSuccessMessageClick);
      document.addEventListener('keydown', onSuccessMessageEscPress);
    }, onError);
    evt.preventDefault();
  };

  var onError = function () {
    main.appendChild(errorNode);
    document.addEventListener('click', onErrorMessageClick);
    document.addEventListener('keydown', onErrorMessageEscPress);
  };

  var onSuccessSubmit = function (evt) {
    sendFormData(evt);
  };

  var onSuccessMessageClick = function (evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('success') || clickedElement.classList.contains('success__message')) {
      successNode.remove();
      document.removeEventListener('click', onSuccessMessageClick);
      document.removeEventListener('keydown', onSuccessMessageEscPress);
    }
  };

  var onErrorMessageClick = function (evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('error') || clickedElement.classList.contains('error__message') || clickedElement.classList.contains('error__button')) {
      errorNode.remove();
      document.removeEventListener('click', onErrorMessageClick);
      document.removeEventListener('keydown', onErrorMessageEscPress);
    }
  };

  var onSuccessMessageEscPress = function (evt) {
    if (evt.key === ESC_KEY) {
      successNode.remove();
      document.removeEventListener('click', onSuccessMessageClick);
      document.removeEventListener('keydown', onSuccessMessageEscPress);
    }
  };

  var onErrorMessageEscPress = function (evt) {
    if (evt.key === ESC_KEY) {
      errorNode.remove();
      document.removeEventListener('click', onErrorMessageClick);
      document.removeEventListener('keydown', onErrorMessageEscPress);
    }
  };

  var resetForm = function () {
    adForm.reset();
  };

  var setDefaultPriceFieldAttributes = function () {
    pricePerNightField.setAttribute('min', HOUSING_PRICES['flat']);
    pricePerNightField.setAttribute('placeholder', HOUSING_PRICES['flat']);
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
    reset: resetForm,
    setDefaultPriceFieldAttributes: setDefaultPriceFieldAttributes
  };
})();

