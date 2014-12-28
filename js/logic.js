/*Handles the data and triggers diagram updates*/
var logic = {
    publications: [],
    authors: [],
    init: function () {
        $(".loading").show(1000);
        /*Initialize the data*/
        this.getPubDB(function(){
            /*Initialize all components*/
            logic.createStructure();
            filters.init();
            network.init();
            sunburst.init();
            controls.init();

            /*Show the result*/
            $(".loading").hide(500);
            $(".content>div").show(500);
        });

    },
    getPubDB : function (callback){
        // create a new pubDB json object
        var converter = new pubDB.json();
        converter.init(function (dbObject) {
            /*Build the JSONs*/
            converter.buildPublicationJSON(dbObject, function (pubData) {
                this.publications = pubData;
                converter.buildAuthorJSON(pubData, function (authorData) {
                    this.authors = authorData;
                    callback();
                });
            });
        });
    },
    createStructure : function (){
        var con = $(".content");
        /*create structure to be filled*/
        con.append("<div class='filters hidden'></div>")
            .append("<div class='vis hidden'>" +
                "<div class = 'network'></div>" +
                "<div class = 'sunburst'></div>" +
                "<div class = 'controls'></div>" +
            "</div>");
    }
};
