'use strict';

(function () {
  var ENTER_KEY = 'Enter';
  var LEFT_MOUSE_BUTTON_KEY = 0;

  var addClass = window.util.addClass;
  var removeClass = window.util.removeClass;
  var map = window.util.map;
  var getData = window.data.get;
  var setActiveFields = window.form.setActiveFields;
  var setInactiveFields = window.form.setInactiveFields;
  var fillInactiveAddressField = window.form.fillInactiveAddressField;
  var fillActiveAddressField = window.form.fillActiveAddressField;
  var mapPinMain = window.util.mapPinMain;
  var mapPinsContainer = window.util.mapPinsContainer;
  var closeButton = window.card.closeButton;
  var addressField = window.form.addressField;
  var mapFilters = window.util.mapFilters;
  var mapFiltersSelectLists = mapFilters.querySelectorAll('select');
  var mapFiltersFeaturesList = mapFilters.querySelector('.map__features');
  var adForm = window.util.adForm;
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var resetForm = window.form.reset;
  var resetButton = adForm.querySelector('.ad-form__reset');
  var closeCard = window.card.close;
  var avatarPeview = document.querySelector('.ad-form-header__preview img');
  var setDefaultPriceFieldAttributes = window.form.setDefaultPriceFieldAttributes;

  var setActivePage = function () {
    removeClass(map, 'map--faded');
    removeClass(adForm, 'ad-form--disabled');
    getData();
    fillActiveAddressField();
    addressField.setAttribute('readonly', '');
    addressField.removeAttribute('disabled', '');
    setActiveFields(adFormFieldsets);
    mapPinMain.removeEventListener('mousedown', onMapPinMainLeftMouseButtonClick);
    mapPinMain.removeEventListener('keydown', onMapPinMainEnterKeyDown);
    mapPinsContainer.addEventListener('click', onMapPinClick);
    resetButton.addEventListener('click', onResetButtonClick);
  };

  var setInactivePage = function () {
    var housingPreview = document.querySelector('.ad-form__photo');
    addClass(map, 'map--faded');
    addClass(adForm, 'ad-form--disabled');
    resetForm();
    closeCard();
    fillInactiveAddressField();
    mapFiltersFeaturesList.setAttribute('disabled', '');
    setInactiveFields(mapFiltersSelectLists);
    setInactiveFields(adFormFieldsets);
    addressField.setAttribute('disabled', '');
    setDefaultPriceFieldAttributes();
    mapPinMain.addEventListener('mousedown', onMapPinMainLeftMouseButtonClick);
    mapPinMain.addEventListener('keydown', onMapPinMainEnterKeyDown);
    if (window.mapPin !== undefined) {
      window.pin.remove(window.mapPins);
    }
    if (!avatarPeview.src.includes('img/muffin-grey.svg')) {
      window.avatar.resetMapPreview();
    }
    if (housingPreview && housingPreview.hasChildNodes()) {
      window.avatar.resetHousingPreview();
    }
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

  var onMapPinClick = function (evt) {
    window.card.open(evt);
  };

  var onCardButtonCloseClick = function (evt) {
    if (evt.button === LEFT_MOUSE_BUTTON_KEY) {
      window.card.close();
    }
  };

  var onResetButtonClick = function () {
    setInactivePage();
    window.pin.remove(window.mapPins);
  };

  closeButton.addEventListener('click', onCardButtonCloseClick);
  setInactivePage();

  window.map = {
    setActive: setActivePage,
    setInactive: setInactivePage
  };
})();
