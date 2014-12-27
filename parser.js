/*Defines a parser Object to get the required Data from PubDB as JSON*/
var parser = {
    getPubDB : function (success,error) {
        $.ajax({
            type: "POST",
            url: "http://www.medien.ifi.lmu.de/cgi-bin/search.pl?all:all:all:all:all",
            success : function (data){
                var pubDB = parse(data);
                success(pubDB);
            },
            error : function (code){
                error(code);
            }
        });
    }
};
