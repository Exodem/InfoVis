var filters = {
    minPublications: 1,
    publicationName : "",
    authorName : "",
    year : "",
    authors : [],
    publications : [],
    init: function () {
        var labels = ["Author", "Publication", "Year", "minPub"];
        $.each(labels, function (i, v) {
            $(".filters").append("<label>" + v + ":<input type='text'' name='" + v + "'placeholder='" + v + "'></label>");
        });
        $("input[type=text]").change(this.filter);
            /*.click(function(e){
                e = $(e.target);
                if(e.attr("value") == e.attr("name")){
                    e.attr("value","");
                }
            });
        /*Initialize Lists*/
        filters.filter();
        filters.publications = logic.publications;
        filters.authors = logic.authors;
        /*TODO Add filter-functionality*/
        var names = [];
        for (var i = 0; i < this.authors.length; i++){
            names.push(this.authors[i].name);
        }
        $("input[name=Author]").autocomplete({
            source: names
        });

        var pubs = [];
        var years = [];
        for (var i = 0; i < this.publications.length; i++){
            pubs.push(this.publications[i].title.name);
            years.push(this.publications[i].year);
        }
        $("input[name=Publication]").autocomplete({
            source: pubs
        });

        $( "input[name=minPub]" ).spinner({
            min: 1,
            step: 1,
            spin: function(event, ui) {
                this.minPublications = ui.value;
                filters.filter();
            }
        });

        Array.max = function( array ){
            return Math.max.apply( Math, array );
        };
        Array.min = function( array ){
            return Math.min.apply( Math, array );
        };

        $("input[name=Year]").replaceWith("<span id='years'></span>");

        $("#years").slider({
            min: Array.min(years),
            max: Array.max(years),
            values: [Array.min(years), Array.max(years)],
            slide: function(event, ui){
                $(".yearMin").text(ui.values[0]);
                $(".yearMax").text(ui.values[1]);
                filters.filter();
            }
        });
        $("<span class='yearMin'></span>").insertBefore("#years .ui-slider-handle:first-child");
        $("<span class='yearMax'></span>").insertBefore("#years .ui-slider-handle:nth-child(2)");
        $(".yearMin").append(Array.min(years));
        $(".yearMax").append(Array.max(years));

        $("input[type=text]").keyup(function(){
            filters.filter();
        });
        $(".ui-autocomplete").click(function(){
           filters.filter();
        });
        /*Wait for the ui to be initialized before accessing it*/
        //filters.filter();

    },
    filter: function () {
        /*Get new Values*/
        var mp = $("[name=minPub]").val();
        //this.minPublications = ($.isNumeric(mp))? mp : 5; //TODO change back to 0

        /*Return text fields to basic state*/
        /*
        $.each($("input[type=text]"), function (i, v) {
            v = $(v);
            if(v.attr("value") == ""){
                v.attr("value", v.name);
            }
        });
        */

        filters.authorName = $('input[name=Author]').val();

        filters.publicationName = $('input[name=Publications]').val();

        /*Update stuff*/
        filters.updatePublications();
        filters.updateAuthors();
        logic.updateAll();
    },
    updateAuthors: function () {
        var authors = [];
        $.each(logic.authors, function (i, a) {
            /*Apply all filter Criteria*/
            if (a.publications.length >= filters.minPublications && (filters.authorName == "" || a.name.toLowerCase().indexOf(filters.authorName) >= 0)) {
                authors.push(a);
            }
        });
        filters.authors = authors;
    },
    updatePublications: function () {
        var pub = [];
        var yearMin = $(".yearMin").text();
        var yearMax = $(".yearMax").text();
        $.each(logic.publications, function (i, p) {
            /*Apply all filter Criteria*/
            if ((filters.year == "" || filters.year== p.year || (yearMin <= p.year && p.year <= yearMax)) && (filters.publicationName == "" || p.title.name.toLowerCase().indexOf(filters.publicationName) >= 0)) {
                pub.push(p);
            }
        });
        filters.publications = pub;
    }
};
