'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var fileAvatarChoose = document.querySelector('.ad-form-header__input');
  var avatarPeview = document.querySelector('.ad-form-header__preview img');
  var fileHousingChoose = document.querySelector('.ad-form__input');
  var housingPreview = document.querySelector('.ad-form__photo');

  var uploadAvatarImage = function () {
    var file = fileAvatarChoose.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        avatarPeview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  };

  var uploadHousingImage = function () {
    var file = fileHousingChoose.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var imageContainer = document.createElement('img');
        imageContainer.setAttribute('src', housingPreview.src = reader.result);
        imageContainer.setAttribute('width', '70');
        imageContainer.setAttribute('height', '70');
        housingPreview.appendChild(imageContainer);
      });
      reader.readAsDataURL(file);
    }
  };

  var onFileAvatarChooseChange = function () {
    uploadAvatarImage();
  };

  var onFileHousingChooseChange = function () {
    uploadHousingImage();
  };

  var resetAvatarPreview = function () {
    avatarPeview.setAttribute('src', 'img/muffin-grey.svg');
    avatarPeview.setAttribute('width', '40');
    avatarPeview.setAttribute('height', '44');
    avatarPeview.setAttribute('alt', 'Аватар пользователя');
  };

  var resetHousingPreview = function () {
    var housingPreviews = document.querySelectorAll('.ad-form__photo');
    for (var i = 0; i < housingPreviews.length; i++) {
      housingPreviews[i].remove();
    }
  };

  fileAvatarChoose.addEventListener('change', onFileAvatarChooseChange);
  fileHousingChoose.addEventListener('change', onFileHousingChooseChange);

  window.avatar = {
    resetMapPreview: resetAvatarPreview,
    resetHousingPreview: resetHousingPreview
  };
})();
