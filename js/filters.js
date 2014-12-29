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
            $(".filters").append("<label>" + v + ":<input type='text'' name='" + v + "'value='" + v + "'></label>");
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
        /*TODO Add Controls( autocomplete, dropdown etc.) and filter-functionality*/
    },
    filter: function () {
        /*Get new Values*/
        var mp = $("[name=minPub]").val();
        this.minPublications = ($.isNumeric(mp))? mp : 3; //TODO change back to 0

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
