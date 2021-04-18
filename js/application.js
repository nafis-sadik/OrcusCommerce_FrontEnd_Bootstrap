const Rounte = {
  baseUrl: "http://127.0.0.1:8080/",
  BEUrl: "https://localhost:44376/",
  PartialViews: {
    HomePageCarousel : "partialViews/homepageCarousel.html",
    Banner : "partialViews/banner.html"
  },
};

let getCategories = (shopId) => {
  $.ajax({
      url: Rounte.BEUrl + "api/Categories/" + shopId,
      success: (res) => {
        res.forEach((categories) => {
          if (categories.subcategories.length > 0) {
            let dropdown = '<div class="dropdown-menu shadow-sm sm-menu" aria-labelledby="' + categories.categoryName + '">';
            categories.subcategories.forEach((subcategories) => {
              dropdown += '<a class="dropdown-item" href="#">' + subcategories.subCategoryName + "</a>";
            });
            dropdown += '</div>';

            $("#navbar-nav").append('<li class="nav-item px-lg-2 dropdown d-menu ripple">' + GetDropdownFrame(categories.categoryName) + dropdown + '</li>');
            dropdown = "";
          } else {
            $("#navbar-nav").append(
              '<li class="nav-item px-lg-2 d-menu"> <a class="nav-link" href="#"><span class="d-inline-block d-lg-none icon-width"><i class="fas fa-spa"></i></span>' + categories.categoryName + '</a> </li>'
            );
          }
        });
        enableHoverNavbar();
      },
  });
};

let GetDropdownFrame = (DrowdownLabel) => {
  let frame = '';
  frame = '<a class="nav-link dropdown-toggle" href="#" id="'+DrowdownLabel+'" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
  frame += '<span class="d-inline-block d-lg-none icon-width">';
  frame += '<i class="far fa-caret-square-down"></i>';
  frame += '</span>';
  frame += DrowdownLabel;
  frame += '<svg  id="arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  frame += '<polyline points="6 9 12 15 18 9"></polyline>';
  frame += '</svg>';
  frame += '</a>';
  return frame;
}

$(document).ready(() => {
  getCategories(1);
  enableHoverNavbar();
});

let enableHoverNavbar = () => {
  if ($(window).width() > 991){
    $('.navbar .d-menu').hover(
      function () {
        $(this).find('.sm-menu').first().stop(true, true).slideDown(150);
      }, function () {
        $(this).find('.sm-menu').first().stop(true, true).delay(120).slideUp(100);
      });
  }
}

let Controller = (url, method, data, emptyBody = true, callback) => {
  $.ajax({
    url: url,
    data: data,
    method: method,
    success: (res) => {
      if(emptyBody == true){
        $('#body').empty();
      }
      $('#body').append(res);
      if(typoeof(callback) === 'function'){ callback(); }
    },
    error: (res) => {
      console.log(res);
    }
  })
}

let PlaceBanner = (bannerHookId, bannerImgUrl, clearHook = true) => {
  if(bannerHookId[0] != '#') { bannerHookId = '#' + bannerHookId; }
  if(clearHook) { $(bannerHookId).empty(); }
  $(bannerHookId).append('<div class="container"> <a href="#" class="banner"> <img src="' + bannerImgUrl + '" alt="" srcset=""> </a> </div>');
}

let PrepareHomePage = () => {
  $('#body').css('padding-top',$('header').height());
  Controller(Rounte.baseUrl + Rounte.PartialViews.HomePageCarousel, 'GET', null, false, PlaceBanner("body", "./../assets/Banners/black-friday-1898114_1280.jpg", false));
  // Controller(Rounte.baseUrl + Rounte.PartialViews.Banner, 'GET', null, false);
  ;
}

let Search = () => {
  $('#Search').click(
    Controller(Rounte.BEUrl + 'Search', "GET", $('#SearchField').val())
  );
} 

// Reskinning Guidance
// Classes not to be removed
// navbar, d-menu