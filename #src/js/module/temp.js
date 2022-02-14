$(document).ready(function () {
  //=====================HRADER SCROLL================================
  $(window).on("scroll", function () {
    let scrolled = $(this).scrollTop();
    let heightHeader = $(".header").innerHeight();
    if (scrolled > heightHeader) {
      $(".header").addClass("scrolled");
      $(".header").next().addClass("scrolled");
    }
    if (scrolled <= heightHeader) {
      $(".header").removeClass("scrolled");
      $(".header").next().removeClass("scrolled");
    }
  });

  $(window).on("load", function () {
    if ($(this).scrollTop() > $(".header").innerHeight()) {
      $(".header").addClass("scrolled");
    }
  });

  //====== BURGER
  $(".header__burger").on("click", function () {
    $(this).toggleClass("active");
    $("body").toggleClass("lock");
  });

  //====== SELECT
  // $(".select__input").on("click", function () {
  //   $(this).parent().find($(".select__menu")).toggleClass("active");
  //   $(this).parent().find($(".select__text")).toggleClass("active");
  // });

  // $(".select__option").on("click", function () {
  //   if ($(this).parents(".header__select")[0] == $(".header__select")[0]) {
  //     // ЕСЛИ ВСТАВЛЯТЬ В СПАН
  //     $(this).parents(".select").find($(".select__text > span")).text($(this).text());
  //   } else {
  //     $(this).parents(".select").find($(".select__text")).text($(this).text());
  //   }
  //   $(this).parents(".select").find(".select__option").removeClass("select__option_selected");
  //   $(this).addClass("select__option_selected");
  //   $(this).parents(".select").find($(".select__menu")).removeClass("active");
  //   $(this).parents(".select").find($(".select__text")).removeClass("active");
  // });

  //====SLIDER
  $("класс слайдера").slick({
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  //====== МЕДИА ЗАПРОС js
  let match = [window.matchMedia("(max-width: 993px)")];
  function movingEl() {
    if (match[0].matches) {
      // ПЕРЕНОС ЭЛЕМЕНТА В НОВЫЙ БЛОК
    } else {
      // ПРЕНОС ЭЛЕМНЕТА ОБРАТНО
    }
  }
  match[0].addListener(movingEl);
  movingEl();

  //====== АНИМАЦИЯ ДВИЖЕНИЯ ОБЪЕКТА ЗА МЫШЬЮ

  let paralxItems = ["КЛАСС С ИЗОБРАЖЕНИЕМ ДЛЯ АНИМАЦИИ-1", "КЛАСС С ИЗОБРАЖЕНИЕМ ДЛЯ АНИМАЦИИ-2"];

  $.each(paralxItems, function (index, val) {
    let bg = $(val);
    $(document).on("mousemove", function (e) {
      let x = e.clientX / window.innerWidth;
      let y = e.clientY / window.innerHeight;
      bg.css({ transform: `translate(${-x - 0}%, ${-y * 30}px)` });
    });
  })

  //======= АНИМАЦИЯ СЧЕТА ЧИСЕЛ
  let countbox = "КОНТЕЙНЕР С ЧИСЛАМИ";
  let show = true;
  $(window).on("scroll load resize", function () {
    if (!show) return false;
    let w_top = $(window).scrollTop();
    let e_top = $(countbox).offset().top;
    let w_height = $(window).height();
    let d_height = $(document).height();
    let e_height = $(countbox).outerHeight();

    if (w_top + 500 >= e_top || w_height + w_top == d_height || e_height + e_top < w_height) {
      $("ЭЛЕМЕНТ С ЧИСЛОМ").spincrement({
        thousandSeparator: "",
        duration: 3000,
      });

      show = false;
    }
  });

  //=====================IMG TO BACKGROUND CSS================================
  $.each($(".ibg"), function (index, val) {
    if ($(this).find("img").length > 0) {
      $(this).css("background", 'url("' + $(this).find("img").attr("src") + '") no-repeat center / cover');
    }
  });

  //===============ANIMATION SCROLL======================
  const animItems = $(".anim-items");

  if (animItems.length > 0) {
    $(window).on("scroll", animOnScroll);
    function animOnScroll() {
      $.each(animItems, function (index, val) {
        const animItem = animItems.eq(index);
        const animItemHeight = animItem.innerHeight();
        const animItemOffset = animItem.offset().top;
        const animStart = 10; // начало анимации при достижении скролом 1/10 части элемента

        let animItemPoint = $(window).height() - animItemHeight / animStart;

        if (animItemHeight > $(window).height()) {
          animItemPoint = $(window).height() - $(window).height() / animStart;
        }

        if ($(window).scrollTop() > animItemOffset - animItemPoint && $(window).scrollTop() < animItemOffset + animItemHeight) {
          animItem.addClass("animate");
        } else {
          if (!animItem.hasClass("anim-no-scrollTop")) {
            animItem.removeClass("animate");
          }
        }
      });
    }
    setTimeout(animOnScroll, 0);
  }

  //  ПОДСЧЕТ НОМЕРОВ СЛАЙДОВ
  let slider = $('КЛАСС СДЛАЙДЕРА');
  $('ВСЕ СЛАЙДЫ').text(slider.slick("getSlick").slideCount);
  $("КЛАСС СЛАЙДЕРА").on('afterChange', function (event, slick, currentSlide) {
    $("ТЕКУЩИЙ СЛАЙД").text(currentSlide + 1);
  });

  // ПЛАВНЫЙ ЯКОРЬ
  $('.js-anchor[href^="ID блока к которому прикрепден якорь"]').click(function () {
    let target = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(target).offset().top - 150
    }, 800);
    return false;
  });

  // МАСКА ТЕЛЕФОНА
  $("input[type=tel]").inputmask({
    mask: "+7 (Z99) 999-99-99",
    definitions: {
      Z: {
        validator: "[0-6,9]",
      },
    },
  });

  // КАСТОМНЫЙ СКРОЛЛБАР
  $(".класс для создания скролла").mCustomScrollbar({
    theme: "my-theme",
  });

  //======RANGE

  let sliderTooltip = function (event, ui) {
    let tooltip = '<div class="tooltip"><input type="text" id="amount" readonly="true"></div>';
    $('.ui-slider-handle:first').html(tooltip);

    let tooltipTwo = '<div class="tooltip"><input type="text" id="amount-2" readonly="true"></div>';
    $('.ui-slider-handle:last').html(tooltipTwo);
  }

  $("id элемента который будет range").slider({
    range: true,
    min: 0,
    max: 50000,
    values: [0, 30000],
    create: sliderTooltip,
    slide: function (event, ui) {
      $("#amount").val(ui.values[0]);
      $("#amount-2").val(ui.values[1]);
    }
  });

  $('#amount').val($("id элемента к который будет range").slider("values", 0))
  $('#amount-2').val($("id элемента к который будет range").slider("values", 1))

  //================GALLARY

  $("#lightgallery").lightGallery({
    selector: 'a'
  });

  //======= РАСКРАСИТЬ ПЕРВУЮ БУКВУ В НУЖНЫЙ ЦВЕТ
  $('.red-letter').each(function () {
    let text = $(this).html();
    let first = $('<span>' + text.charAt(0) + '</span>').addClass('letter');
    $(this).html(text.substring(1)).prepend(first);
  });
});
