/*Handles the data and triggers diagram updates*/
var logic = {
    publications: [],
    authors: [],
    initialized : false,
    init: function () {
        $(".loading").show(1000);
        /*Initialize the data*/
        this.getPubDB(function(){
            /*Initialize all components*/
            logic.createStructure();
            filters.init();
            detail.init();
            network.init();
            sunburst.init();
            bars.init();
            controls.init();

            logic.initialized = true;

            /*Show the result*/
            $(".loading").hide(500);
            $(".content>div").show(500);
        });

    },
    getPubDB : function (callback){
        // create a new pubDB json object
        logic.converter = new pubDB.json();
        logic.converter.init(function (dbObject) {
            /*Build the JSONs*/
            logic.converter.buildPublicationJSON(dbObject, function (pubData) {
                logic.publications = pubData;
                logic.converter.buildAuthorJSON(pubData, function (authorData) {
                    logic.authors = authorData;
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
                "<div class = 'hor'>" +
                    "<div class = 'sunburst'></div>" +
                    "<div class = 'bars'></div></div>" +
                "<div class = 'controls'></div>" +
            "</div>");
    },
    updateAll : function (){
        //Prevent update before all components are initialized
        if(this.initialized){
            /*TODO Add more*/
            network.updateNetwork();
            sunburst.buildSunburst();
            bars.buildBars();
        }


    }
};
