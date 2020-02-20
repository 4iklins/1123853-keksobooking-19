'use strict';

(function () {
  var removeClass = window.util.removeClass;
  var map = window.util.map;
  var render = window.pin.render;
  var adsList = window.data.adsList;
  var setActiveFields = window.form.setActiveFields;
  var setInactiveFields = window.form.setInactiveFields;
  var fillInactiveAddressField = window.form.fillInactiveAddressField;
  var fillActiveAddressField = window.form.fillActiveAddressField;
  var mapPinMain = window.util.mapPinMain;
  var mapPins = window.util.mapPins;
  var isEnterEvent = window.util.isEnterEvent;
  var isLeftMouseButtonEvent = window.util.isLeftMouseButtonEvent;
  var closeButton = window.card.closeButton;
  var addressField = window.form.addressField;
  var mapFilters = map.querySelector('.map__filters-container');
  var mapFiltersSelectLists = mapFilters.querySelectorAll('select');
  var mapFiltersFeaturesList = mapFilters.querySelector('.map__features');
  var adForm = window.util.adForm;
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  var setActivePage = function () {
    removeClass(map, 'map--faded');
    removeClass(adForm, 'ad-form--disabled');
    render(adsList);
    fillActiveAddressField();
    addressField.setAttribute('readonly', '');
    mapFiltersFeaturesList.removeAttribute('disabled', '');
    setActiveFields(mapFiltersSelectLists);
    setActiveFields(adFormFieldsets);
    mapPinMain.removeEventListener('mousedown', onMapPinMainLeftMouseButtonClick);
    mapPinMain.removeEventListener('keydown', onMapPinMainEnterKeyDown);
    mapPins.addEventListener('click', onMapPinClick);
  };

  var setInactivePage = function () {
    fillInactiveAddressField();
    mapFiltersFeaturesList.setAttribute('disabled', '');
    setInactiveFields(mapFiltersSelectLists);
    setInactiveFields(adFormFieldsets);
    addressField.setAttribute('disabled', '');
  };

  var onMapPinMainLeftMouseButtonClick = function () {
    if (isLeftMouseButtonEvent) {
      setActivePage();
    }
  };

  var onMapPinMainEnterKeyDown = function () {
    if (isEnterEvent) {
      setActivePage();
    }
  };

  var onMapPinClick = function (evt) {
    window.card.open(evt);
  };

  var onCardButtonCloseClick = function () {
    if (isLeftMouseButtonEvent) {
      window.card.close();
    }
  };

  closeButton.addEventListener('click', onCardButtonCloseClick);
  mapPinMain.addEventListener('mousedown', onMapPinMainLeftMouseButtonClick);
  mapPinMain.addEventListener('keydown', onMapPinMainEnterKeyDown);
  setInactivePage();

  window.map = {
    isActive: setActivePage,
    isInactive: setInactivePage
  };
})();
