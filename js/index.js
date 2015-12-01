var Url = "https://en.wikipedia.org/w/api.php?callback=?";
var xhr = null;

function displayResult(page) {
    var link = page["title"].replace(/\s/g,'_');
    link = "https://en.wikipedia.org/wiki/"+link;
    var html = "<li class='list-item'><a target='_blank' href='" + link + "'><h2>" + page["title"] + "</h2><p>" + page["extract"] + "</p></a></li>";
    $(".result > ul").append(html);
    
    if (page.hasOwnProperty("thumbnail")) {
        var img = "<img class='img-responsive' src='" + page["thumbnail"]["source"] + "'>";
        $(".result > ul > li:last-child > a").prepend(img);
    }
    
    
}

function getRandomWiki() {
    $(".result > ul").empty();
    
    $.getJSON(Url, {
        action: "query",
        generator: "random",
        grnnamespace: "0",
        prop: "pageimages|extracts",
        exchars: "200",
        format: "json",
        explaintext: "",
        inprop: "url",
        pithumbsize: "100"
    })
    .done(function(data) {
        $.each(data.query.pages, function(key, value) {
            displayResult(value);
        })
        
    }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    })
}

function searchWiki(string) {
    $(".result > ul").empty();
    
    $.getJSON(Url, {
        action: "query",
        generator: "search",
        gsrnamespace: "0",
        gsrlimit: "20",
        prop: "pageimages|extracts",
        pilimit: "max",
        exintro: "",
        exlimit: "max",
        continue: "",
        gsrsearch: string,
        exchars: "200",
        format: "json",
        explaintext: "",
        inprop: "url",
        pithumbsize: "100"
    })
    .done(function(data) {
        //console.log(data);
        $.each(data.query.pages, function(key, value) {
            //console.log(value);
            displayResult(value);
        })
        
    }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    })
    
}


function autocomplete(string) {
    $(".autocomplete").css("display","block");
    $(".search-wiki").css("margin-bottom", 0);
    $(".autocomplete > ul").empty();
    
    if (xhr !== null)
        xhr.abort();
     
    xhr = $.getJSON(Url, {
        action: "query",
        generator: "search",
        gsrnamespace: "0",
        gsrlimit: "20",
        prop: "pageimages|extracts",
        pilimit: "max",
        exintro: "",
        exlimit: "max",
        continue: "",
        gsrsearch: string,
        srwhat: "title",
        gsrtitles: string,
        exchars: "200",
        format: "json",
        explaintext: "",
        inprop: "url",
        pithumbsize: "100"
    })
    .done(function(data) {
        console.log(xhr);
        if (data.hasOwnProperty("query")){
            var counter = 0;
            $.each(data.query.pages, function(key, value) {
                if (value.title !== '') {
                    counter += 1;
                    $(".autocomplete > ul").append("<li tabindex='" + counter + "'>" + value.title + "</li>");
                }
                
            });
        }
        
        
    }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    })
}

$(document).ready( function() {
    
    
    $(".random-wiki").click( function() {
        getRandomWiki($(".search-wiki").val().trim());
    });
    
    $(".search-wiki").keyup( function(e) {
        if (e.which === 40) {
            e.preventDefault();
            $(".autocomplete > ul > li:first-child").focus();
        } 
        else if (e.which === 13) {
            searchWiki($(".search-wiki").val().trim());
            $(".autocomplete").css("display","none");
        } else {
            autocomplete($(".search-wiki").val().trim());
        }
        
        if ($(".search-wiki").val().trim() === "") {
            $(".autocomplete").css("display","none");
        }
           
    });
    
    $(".autocomplete > ul").on('click', 'li', function() {
       //console.log($(this).text());
       $(".search-wiki").val($(this).text()); 
        $(".search-wiki").focus();
        var e = jQuery.Event("keyup");
        e.which = 13;
        $(".search-wiki").trigger(e);
        $(".autocomplete").css("display","none");
    });
    
    $(".autocomplete > ul").on('keyup', 'li', function(e) {
       //console.log($(this).text());
        if (e.which === 40) {
            e.preventDefault();
            $(this).next().focus();
        }
        if (e.which === 38) {
            e.preventDefault();
            $(this).prev().focus();
        }
        if (e.which === 13) {
            e.preventDefault();
            $(".search-wiki").val($(this).text()); 
            $(".search-wiki").focus();
            var e = jQuery.Event("keyup");
            e.which = 13;
            $(".search-wiki").trigger(e);
            $(".autocomplete").css("display","none");
        }
        
    });
    
    

});