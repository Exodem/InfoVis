var filters = {
    minPublications: 0,
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
            min: 0,
            step: 1,
            spin: function(event, ui) {
                this.minPublications = ui.value;
                filters.updateAuthors();
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
                filters.updatePublications();
            }
        });
        $("<span class='yearMin'></span>").insertBefore("#years .ui-slider-handle:first-child");
        $("<span class='yearMax'></span>").insertBefore("#years .ui-slider-handle:nth-child(2)");
        $(".yearMin").append(Array.min(years));
        $(".yearMax").append(Array.max(years));

        /*Wait for the ui to be initialized before accessing it*/
        filters.filter();

    },
    filter: function () {
        /*Get new Values*/
        var mp = $("[name=minPub]").spinner("value");
        filters.minPublications = ($.isNumeric(mp))? mp : 12; //TODO change back to 0
        /*Return text fields to basic state*/
        $.each($("input[type=text]"), function (i, v) {
            v = $(v);
            if(v.attr("value") == ""){
                v.attr("value", v.name);
            }
        });

        /*Update stuff*/
        filters.updatePublications();
        filters.updateAuthors();
        logic.updateAll();
    },
    updateAuthors: function () {
        var authors = [];
        $.each(logic.authors, function (i, a) {
            /*Apply all filter Criteria*/
            if (a.publications.length >= filters.minPublications) {
                authors.push(a);
            }
        });
        this.authors = authors;
    },
    updatePublications: function () {
        var pub = [];
        var yearMin = $(".yearMin").text();
        var yearMax = $(".yearMax").text();
        $.each(logic.publications, function (i, p) {
            /*Apply all filter Criteria*/
            if (filters.year == "" || filters.year== p.year || (yearMin <= p.year && p.year <= yearMax)) {
                pub.push(p);
            }
        });
        this.publications = pub;
    }
};
