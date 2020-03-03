'use strict';

(function () {
  var TIMEOUT = 15000;
  var URL = 'https://js.dump.academy/keksobooking';
  var StatusCode = {
    OK: 200
  };

  var setup = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    return xhr;
  };

  var sendFormData = function (data, onSuccess, onError) {
    var xhr = setup(onSuccess, onError);
    xhr.open('POST', URL);
    xhr.send(data);
  };

  var getServerData = function (onSuccess, onError) {
    var xhr = setup(onSuccess, onError);
    xhr.open('GET', URL + '/data');
    xhr.send();
  };

  window.load = {
    send: sendFormData,
    get: getServerData
  };
})();
