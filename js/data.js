'use strict';

(function () {
  var renderPins = window.pin.render;
  var getServerData = window.load.get;

  var getData = function () {
    getServerData(onSuccess, onError);
  };

  var onSuccess = function (pins) {
    window.adsList = pins.map(function (ad, index) {
      return Object.assign(ad, {id: index});
    });
    console.log(window.adsList);
    renderPins(window.adsList);
  };

  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: #ff5635;';
    node.style.position = 'absolute';
    node.style.top = '30%';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '32px';
    node.style.fontFamily = '"Roboto", "Arial", sans-serif';
    node.style.color = '#ffffff';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.data = {
    get: getData
  };
})();
