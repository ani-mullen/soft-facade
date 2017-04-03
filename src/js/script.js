'use strict';

if (document.documentElement.clientWidth <= 1024) {
  (function() {

    var box = document.querySelectorAll(".page-footer__item");
    var title = document.querySelectorAll(".page-footer__item-title");
    var content = document.querySelectorAll(".page-footer__item-content");

    (function() {
      for (var i = 0; i < content.length; i++) {
        content[i].classList.add("page-footer__item-content--close");
      }
      for (var i = 0; i < title.length; i++) {
        title[i].classList.add("page-footer__item-title--close");
      }
    })();

    for (var i = 0; i < box.length; i++) {
      box[i].addEventListener('click', function(evt) {
        evt.target.nextElementSibling.classList.toggle("page-footer__item-content--close");
        evt.target.nextElementSibling.classList.toggle("page-footer__item-content--open");
        evt.target.classList.toggle("page-footer__item-title--close");
        evt.target.classList.toggle("page-footer__item-title--open");
      });
    }
  })();
}
