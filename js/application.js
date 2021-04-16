const Rounte = {
    baseUrl: 'https://localhost:44376/',
    BEUrl: 'https://'
}

let getCategories = (shopId) => {
    console.log(Rounte.baseUrl + 'api/Categories/' + shopId);
    $.ajax({
        url: Rounte.baseUrl + 'api/Categories/' + shopId,
        success: (res) => { 
            res.forEach(categories => {
                if(categories.subcategories.length > 0){
                    let dropdown = '';
                    categories.subcategories.forEach(subcategories => {
                        dropdown += '<li><a class="dropdown-item" href="#">'+ subcategories.subCategoryName +'</a></li>';
                    });
                    $('#navbar-nav').append('<li class="nav-item dropdown"> <a class="nav-link dropdown-toggle" href="#" id="' + categories.categoryName  + '" role="button" data-bs-toggle="dropdown" aria-expanded="false">'  + categories.categoryName + '</a>'
                        + '<ul class="dropdown-menu" aria-labelledby="' + categories.categoryName  + '">' + dropdown + '</ul>'
                    +'</li>');
                    dropdown = '';
                }
                else
                    $('#navbar-nav').append('<li class="nav-item dropdown"> <a class="nav-link dropdown-toggle" href="#" id="' + categories.categoryName  + '" role="button" data-bs-toggle="dropdown" aria-expanded="false">'  + categories.categoryName + '</a> </li>');
            });
        }
    });
}

$(document).ready(() => {
    getCategories(1);
})