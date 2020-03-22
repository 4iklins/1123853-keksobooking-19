'use strict';

(function () {

  var MAX_PINS_QUANTITY = 5;
  var LOW_HOUSING_PRICE = 10000;
  var HIGH_HOUSING_PRICE = 50000;

  var mapFilters = window.util.mapFilters;
  var mapFiltersForm = mapFilters.querySelector('.map__filters');
  var housingTypeSelectorElement = document.querySelector('#housing-type');
  var housingPriceSelectorElement = document.querySelector('#housing-price');
  var housingRoomsSelectorElement = document.querySelector('#housing-rooms');
  var housingGuestsSelectorElement = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelectorAll('.map__checkbox');

  function filterByHousingType(ads) {
    var housingType = housingTypeSelectorElement.value;
    return (housingType === 'any') || (housingType === ads.offer.type);
  }

  function filterByHousingPrice(ads) {
    var housingPrice = housingPriceSelectorElement.value;

    switch (housingPrice) {
      case 'low':
        return ads.offer.price < LOW_HOUSING_PRICE;
      case 'middle':
        return ads.offer.price >= LOW_HOUSING_PRICE && ads.offer.price <= HIGH_HOUSING_PRICE;
      case 'high':
        return ads.offer.price > HIGH_HOUSING_PRICE;
      default:
        return true;
    }
  }

  function filterByHousingRooms(ads) {
    var housingRooms = housingRoomsSelectorElement.value;
    return (housingRooms === 'any') || (ads.offer.rooms === Number(housingRooms));
  }

  function filterByHousingGuests(ads) {
    var housingGuests = housingGuestsSelectorElement.value;
    return (housingGuests === 'any') || (ads.offer.guests === Number(housingGuests));
  }

  function filterByHousingFeatures(ads) {
    return Array.from(housingFeatures).filter(function (element) {
      return element.checked;
    }).every(function (feature) {
      return ads.offer.features.includes(feature.value);
    });
  }

  function returnFiltered(ads) {
    var filteredOffers = [];
    var index = 0;

    while (filteredOffers.length < MAX_PINS_QUANTITY && index < ads.length) {
      var ad = ads[index];

      if (filterByHousingPrice(ad)
        && filterByHousingType(ad)
        && filterByHousingFeatures(ad)
        && filterByHousingRooms(ad)
        && filterByHousingGuests(ad)) {
        filteredOffers.push(ad);
      }
      index++;
    }
    return filteredOffers;
  }

  function changeFilterForm() {
    var filteredOffers = returnFiltered(window.adsList);
    window.card.close();
    window.pin.remove(window.mapPins);
    window.pin.render(filteredOffers);
  }

  var onChangeFilterForm = function () {
    window.debounce.call(changeFilterForm)();
  };

  mapFiltersForm.addEventListener('change', onChangeFilterForm);

})();
