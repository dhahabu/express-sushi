'use strict';

var slides = document.querySelectorAll('.omsk__slide');
var currentSlide = 0;
var slideInterval = setInterval(nextSlide, 3000);

function nextSlide() {
  slides[currentSlide].classList.remove('omsk__slide--visible');
  currentSlide = (currentSlide+1)%slides.length;
  slides[currentSlide].classList.add('omsk__slide--visible');
}

nextSlide();
