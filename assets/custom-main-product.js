(function () {
  const swiperOptions = {
    spaceBetween: 10,
    slidesPerView: 3,
    breakpoints: {
      640: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
    },
  };

  const allGemStoneItems = document.querySelectorAll(".gemstone_type__item");
  if (allGemStoneItems.length > 0) {
    allGemStoneItems.forEach((item) => {
      item.addEventListener("click", () => {
        allGemStoneItems.forEach((_item) =>
          _item.classList.remove("selected--product")
        );
        item.classList.add("selected--product");

        const mainProductForm = item
          .closest("product-form")
          .querySelector("form.js-product-form");

        const gemstoneType = mainProductForm.querySelector(
          "input[name='properties[Gemstone Type]']"
        );
        if (gemstoneType) gemstoneType.value = item.dataset.title;
      });
    });
    allGemStoneItems[0].click();
  }

  new Swiper(".diamond_sizes-slider", {
    ...swiperOptions,
    navigation: {
      nextEl: ".diamond_sizes-swiper-button-next",
      prevEl: ".diamond_sizes-swiper-button-prev",
    },
    on: {
      init: function () {
        const activeSlideIndex = this.slides.indexOf(
          this.slides.find((slide) =>
            slide.classList.contains("selected--product")
          )
        );
        if (activeSlideIndex != -1) this.slideTo(activeSlideIndex);
      },
    },
  });

  new Swiper(".stone_type--slider", {
    ...swiperOptions,
    navigation: {
      nextEl: ".stone_type-swiper-button-next",
      prevEl: ".stone_type-swiper-button-prev",
    },
    on: {
      init: function () {
        const activeSlideIndex = this.slides.indexOf(
          this.slides.find((slide) =>
            slide.classList.contains("selected--product")
          )
        );
        if (activeSlideIndex != -1) this.slideTo(activeSlideIndex);
      },
    },
  });

  new Swiper(".materials--slider", {
    ...swiperOptions,
    navigation: {
      nextEl: ".materials-swiper-button-next",
      prevEl: ".materials-swiper-button-prev",
    },
    on: {
      init: function () {
        const activeSlideIndex = this.slides.indexOf(
          this.slides.find((slide) =>
            slide.classList.contains("selected--product")
          )
        );
        if (activeSlideIndex != -1) this.slideTo(activeSlideIndex);
      },
    },
  });
})();
