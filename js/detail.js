/*Provides Detail on Demand functionality*/
var detail = {
    imageIndex : {},
    init : function () {
        /*Build the image Index*/
        $.each(logic.authors,function (i,v){
            detail.testAuthorImages(v);
        });
    },
    show : function (d){
        var tooltip = d3.select("#tooltip");
        tooltip
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY + 10 + "px")
            .style("display", "block")
            .select("p")
            .text(d.name);
        if (detail.imageIndex[d.name] != "") {
            tooltip.select("img")
                .attr("src", detail.imageIndex[d.name]);
            $("#tooltip").find("img").show(150);
        }
        else {
            tooltip.select("img").style("display", "none");
        }
        d3.select(this).classed("fixed", d.fixed = true);
    },
    hide : function (d) {
        d3.select("#tooltip")
            .style("display", "none");
        if(!d3.select(this).classed("permanent")){
            d3.select(this).classed("fixed", d.fixed = false);
        }
    },
    testAuthorImages : function (author){
        if(author.url=='undefined'||author.url==""){
            detail.imageIndex[author.name] = "";
            return;
        }
        /*Try different options of building the image name*/
        var replacements = ["-","_"];
        var endings = [".jpg",".jpeg"];
        $.each(replacements,function(ir,rep){
            $.each(endings,function(ie,ending){
                var url = author.url+ author.name.toLowerCase().split(" ").join(rep)+ending;
                detail.setAuthorImage(author,url);
            });
        });
    },
    setAuthorImage : function (author,url) {
        var img = new Image();
        img.onload = function() {
            detail.imageIndex[author.name] = url;
        };
        img.src = url;
    }
};
