'use strict';

(function () {

  var mapFilters = document.querySelector('.map__filters-container');
  var mapFiltersForm = mapFilters.querySelector('.map__filters');

  var onFiltersFormChange = function () {
    updatePins();
  };

  var updatePins = function () {
    var housingType = document.querySelector('#housing-type').value;
    window.card.close();
    window.pin.remove(window.mapPins);
    window.pin.render(window.adsList.filter(function (ad) {
      if (housingType === 'any') {
        return true;
      }
      return ad.offer.type === housingType;
    }));
  };

  mapFiltersForm.addEventListener('change', onFiltersFormChange);

})();
