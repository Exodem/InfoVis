/*Defines a parser Object to get the required Data from PubDB as JSON*/
var parser = {
    getPubDB : function () {
        $.ajax({
            url: "http://www.medien.ifi.lmu.de/cgi-bin/search.pl?all:all:all:all:all:callback=?",
            dataType: "jsonp",
            success : function (data){
                alert("bla");
                console.log(data);
                return parse(data);
            }
        });
    },
    parse : function (data){
        return data;
    }
};
