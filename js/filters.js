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
        $("input[type=text]").keydown(this.filter)
            .click(function(e){
                e = $(e.target);
                if(e.attr("value") == e.attr("name")){
                    e.attr("value","");
                }
            });
        /*Initialize Lists*/
        filters.filter();
        /*filters.publications = logic.publications;
        filters.authors = logic.authors;*/
        /*TODO Add Controls( range slider for year) and filter-functionality*/
        var names = [];
        for (var i = 0; i < this.authors.length; i++){
            names.push(this.authors[i].name);
        }
        $("input[name=Author]").autocomplete({
            source: names
        });

        var pubs = [];
        for (var i = 0; i < this.publications.length; i++){
            pubs.push(this.publications[i].title.name);
        }
        $("input[name=Publication]").autocomplete({
            source: pubs
        });

        $( "input[name=minPub]" ).spinner({
            min: 0,
            step: 1
        });

    },
    filter: function () {
        /*Get new Values*/
        var mp = $("[name=minPub]").val();
        this.minPublications = ($.isNumeric(mp))? mp : 5; //TODO change back to 0

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
        $.each(logic.publications, function (i, p) {
            /*Apply all filter Criteria*/
            if (filters.year == "" || filters.year== p.year) {
                pub.push(p);
            }
        });
        this.publications = pub;
    }
};
