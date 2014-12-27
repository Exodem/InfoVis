/*Handles the data and triggers diagram updates*/
var logic = {
    publicationsJSON: [],
    authors: [],
    init: function () {
        // create a new pubDB json object
        var converter = new pubDB.json();
        converter.init(function (dbObject) {
            /*Build the JSON*/
            converter.buildPublicationJSON(dbObject, function (pubData) {
                logic.publications = pubData;
                converter.buildAuthorJSON(pubData, function (authorData) {
                    logic.authors = authorData;
                });
            });
        });

    }
};
