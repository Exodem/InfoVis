var filters = {
    minPublications: 1,
    publicationName : "",
    authorName : "",
    year : "",
    yearMin : "",
    yearMax : "",
    authors : [],
    publications : [],
    reversePubs : {},
    reverseAuthors : {},
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
        //filters.filter();
        filters.publications = logic.publications;
        filters.authors = logic.authors;

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
            step: 1
        }).val(3); //Set initial value to save performance on loading the page

        $( "input[name=minPub]").click(function(){
            filters.filter();
        });
        $( "input[name=minPub]").keyup(function(){
            filters.filter();
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
        filters.filter();
    },
    filter: function () {
        /*Get new Values*/
        var mp = $("[name=minPub]").val();
        this.minPublications = ($.isNumeric(mp))? mp : 1;

        filters.yearMin = $(".yearMin").text();
        filters.yearMax = $(".yearMax").text();

        filters.authorName = $('input[name=Author]').val();
        filters.publicationName = $('input[name=Publication]').val();

        /*Update stuff*/
        filters.updatePublications();
        filters.updateAuthors();
        filters.applyAuthorPubFiltering();
        logic.updateAll();
    },
    updateAuthors: function () {
        var authors = [];
        filters.reverseAuthors = {};
        $.each(logic.authors, function (i, a) {
            /*Apply all filter Criteria*/
            if (a.publications.length >= filters.minPublications && (filters.authorName == "" || a.name.toLowerCase().indexOf(filters.authorName.toLowerCase()) >= 0)) {
                authors.push(a);
                filters.reverseAuthors[a.name] = a;
            }
        });
        filters.authors = authors;
    },
    updatePublications: function () {
        var pub = [];
        filters.reversePubs = {};
        $.each(logic.publications, function (i, p) {
            /*Apply all filter Criteria*/
            if ((filters.yearMin <= p.year && p.year <= filters.yearMax) && (filters.publicationName == "" || p.title.name.toLowerCase().indexOf(filters.publicationName.toLowerCase()) >= 0)) {
                pub.push(p);
                filters.reversePubs[p.id] = p;
            }
        });
        filters.publications = pub;
    },
    applyAuthorPubFiltering: function () {
        var pub = [];
        var authors = [];

        $.each(filters.publications, function (i,p){
            $.each(p.authors, function (i,a){
                if(filters.reverseAuthors[a.name]){
                    pub.push(p);
                    authors.push(filters.reverseAuthors[a.name]);
                }
            });
        });

        /*Delete duplicates*/
        var uPub = pub.reduce(function(a,b){
            if (a.indexOf(b) < 0 ) a.push(b);
            return a;
        },[]);
        var uAuthors = authors.reduce(function(a,b){
            if (a.indexOf(b) < 0 ) a.push(b);
            return a;
        },[]);

        filters.publications = uPub;
        filters.authors = uAuthors;
    }
};
