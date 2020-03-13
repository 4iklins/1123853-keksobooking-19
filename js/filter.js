'use strict';

(function () {

  var mapFilters = document.querySelector('.map__filters-container');
  var mapFiltersForm = mapFilters.querySelector('.map__filters');

  var onFiltersFormChange = function () {
    window.debounce.call(updatePins)();
  };

  var updatePins = function () {
    var housingType = document.querySelector('#housing-type').value;
    var housingPrice = document.querySelector('#housing-price').value;
    var housingRooms = document.querySelector('#housing-rooms').value;
    var housingGuests = document.querySelector('#housing-guests').value;
    var housingFeatures = Array.from(document.querySelectorAll('.map__checkbox:checked'));
    var selectedFeatures = housingFeatures.map(function (checkbox) {
      return checkbox.value;
    });

    window.card.close();
    window.pin.remove(window.mapPins);
    window.pin.render(window.adsList

      .filter(function (ad) {
        if (housingType === 'any') {
          return true;
        }
        return ad.offer.type === housingType;
      })

      .filter(function (ad) {
        switch (housingPrice) {
          case 'any':
            return true;
          case 'middle':
            return ad.offer.price >= 10000 && ad.offer.price <= 50000;
          case 'low':
            return ad.offer.price < 10000;
          default:
            return ad.offer.price > 50000;
        }
      })

      .filter(function (ad) {
        if (housingRooms === 'any') {
          return true;
        }
        return ad.offer.rooms === Number(housingRooms);
      })

      .filter(function (ad) {
        if (housingGuests === 'any') {
          return true;
        }
        return ad.offer.guests === Number(housingGuests);
      })

      .filter(function (ad) {
        return selectedFeatures.every(function (feature) {
          return ad.offer.features.includes(feature);
        });
      })
    );
  };

  mapFiltersForm.addEventListener('change', onFiltersFormChange);

})();
