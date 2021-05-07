// Configuration section

const ApplocationConfiguration = {
  shopId: 1
}

const Rounte = {
  baseUrl: "http://127.0.0.1:5501/",
  BEUrl: "https://localhost:44376/api/",
  PartialViews: {
    HomePage : "PartialViews/home.html",
    ProductGridPage: "PartialViews/productGridPage.html"
  },
  Components: {
    FullWidthCarousel : "Components/FullWidthCarousel.html"
  },
  API: {
    ProductBySubCategory: "Shop/ProductsBySubCategory/"
  }
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
};

let enableHoverNavbar = () => {
  if ($(window).width() > 991){
    $('.navbar .d-menu').hover(
      function () {
        $(this).find('.sm-menu').first().stop(true, true).slideDown(150);
      }, function () {
        $(this).find('.sm-menu').first().stop(true, true).delay(120).slideUp(100);
      });
  }
};

$(document).ready(() => {
  getCategories(1);
  LoadHomePage();
});

// Toolbox Secttion

let Controller = (url, method, data, emptyHook = true, HookId, callback) => {
  if(HookId != undefined && HookId[0] != '#'){ HookId = '#' + HookId; }
  $.ajax({
    url: url,
    data: data,
    method: method,
    success: (res) => {
      if(emptyHook == true){
        $(HookId).empty();
      }
      
      $(HookId).append(res);
      if(callback != undefined){
        if(typoeof(callback) === 'function'){
          callback();
        }
      }
    },
    error: (res) => {
      console.log(res);
    }
  })
};

let getCategories = (shopId) => {
  $.ajax({
      url: Rounte.BEUrl + "Shop/Categories/" + shopId,
      success: (res) => {
        res.forEach((categories) => {
          if (categories.subcategories.length > 0) {
            let dropdown = '<div class="dropdown-menu shadow-sm sm-menu" aria-labelledby="' + categories.categoryName + '">';
            categories.subcategories.forEach((subcategories) => {
              dropdown += '<a class="dropdown-item" href="#" onClick="LoadProductGridPage(' + subcategories.subCategoryId + ' ,&apos;' + subcategories.subCategoryName + '&apos;)">' + subcategories.subCategoryName + "</a>";
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

let PlaceBanner = (bannerHookId, bannerImgUrl,  bannerRedirectionUrl, clearHook = true) => {
  if(bannerHookId[0] != '#') { bannerHookId = '#' + bannerHookId; }
  if(clearHook) { $(bannerHookId).empty(); }
  $(bannerHookId).append('<div class="container"> <a href="' + bannerRedirectionUrl + '" class="fullWidthBanner"> <img src="' + bannerImgUrl + '" alt="" srcset=""> </a> </div>');
};

let GenerateProductGridComponent = (heading, cardSize,  discountStyle, productList) => {
  let productGrid = '<div class="container product-grid"><div class="row"><h1 class="heading"><span>' + heading + '</span></h1>';
  productList.forEach((product) => {
    if(product.hasDiscount){
      productGrid += '<div class="col-md-' + cardSize + '"><div class="card ' + discountStyle + '" style="margin: 0.5rem;">';
    }
    else{
      productGrid += '<div class="col-md-' + cardSize + '"><div class="card" style="margin: 0.5rem;">';
    }

    if(product.discountPercentage != null && product.discountPercentage != undefined  && product.discountPercentage != NaN && product.discountPercentage > 0){
        productGrid  += '<h2>'+ product.discountPercentage +'%</h2>';
    }
    
    if(product.productUrl != null && product.productUrl != undefined  && product.productUrl != NaN){
      productGrid += '<img src="' + product.productUrl + '" class="card-img-top" alt="' + product.productName + '">';
    }else {
      productGrid += '<img src="./../assets/dev/empty-placeholder-image-icon-design-260nw-1366372628.jpg" class="card-img-top" alt="' + product.productName + '">';
    }

    productGrid += '<div class="card-body">';
    productGrid += '<a href="#"><h5 class="card-title">' + product.productName + '</h5></a> ';

    if(product.discountPercentage != null && product.discountPercentage != undefined  && product.discountPercentage != NaN && product.discountPercentage > 0){
      let discountAmount = (product.price * (product.discountPercentage / 100));
      let originalPrice = product.price - discountAmount;
      productGrid += '<p class="card-text price"><s>৳' + product.price.toFixed(2) + '</s> ৳' + originalPrice + ' </p>';
    } else {
      productGrid += '<p class="card-text price">৳' + product.price + '</p>';
    }

    productGrid += '</div></div></div>';
  });

  productGrid += '</div></div>';
  return productGrid;
};

let PlaceProductGrid = (bannerHookId, heading, cardSize,  discountStyle, productSubCategory) => {
  if(bannerHookId[0] != '#') { bannerHookId = '#' + bannerHookId; }
  $.get(Rounte.BEUrl + Rounte.API.ProductBySubCategory + ApplocationConfiguration.shopId +'/' + productSubCategory, function(productList) {
    let content = GenerateProductGridComponent(heading, cardSize,  discountStyle, productList);
    $(bannerHookId).empty();
    $(bannerHookId).append(content);
  });
}

// UI Section

let RenderHomePage = () => {
  $('#body').css('padding-top',$('header').height());
  Controller(Rounte.baseUrl + Rounte.Components.FullWidthCarousel, 'GET', null, false, '#FullWidthCarousel1', null);
  PlaceBanner("OfferBanner1", "./../assets/Banners/Computer-Accessories-v2.png", '#', false);
  PlaceBanner("OfferBanner2", "./../assets/Banners/Lifstyle-v2.png", '#', false);
  PlaceBanner("OfferBanner3", "./../assets/Banners/Electronics-Appliances-v2.png", '#', false);
  PlaceProductGrid('HotSellers', 'Trending Products', 3, 'discount-style-1', 3);
  PlaceProductGrid('RecentCollection', 'New Collection', 2, 'discount-style-1', 3);
  PlaceProductGrid('JustForYou', 'Recommended only for you', 2, 'discount-style-1', 3);
};

let LoadHomePage = () => {
    Controller(Rounte.baseUrl + Rounte.PartialViews.HomePage, 'GET', null, true, 'body', null);
    $('#body').css('margin-top', '0');
}

let LoadProductGridPage = (subcategories, heading) => {
  Controller(Rounte.baseUrl + Rounte.PartialViews.ProductGridPage, 'GET', null, true, 'body', null);
  PlaceProductGrid('ProductContainer', heading, 3, 'discount-style-1', subcategories);
  $('#body').css('margin-top', '50px');
}

// Backend communication

let Search = () => {
  $('#Search').click(
    Controller(Rounte.BEUrl + 'Search', "GET", $('#SearchField').val())
  );
};

// Reskinning Guidance
// Classes not to be removed
// navbar, d-menu