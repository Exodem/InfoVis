/*Provides Detail on Demand functionality*/
var detail = {
    imageIndex : [],
    reverseIndex : [],
    init : function () {
        /*Build the image Index*/
        $.each(logic.authors,function (i,v){
            detail.reverseIndex[v.name] = v;
            detail.testAuthorImages(v);
        });
    },
    show : function (d){
        var tooltip = d3.select("#tooltip");
        tooltip
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY -10 + "px")
            .style("display", "block")
            .select("p.name")
            .text(d.name);

        var desc = "";
        /*Publication*/
        if(d.pub ){ desc = ((d.pub.award==true)?
            "<span class='award'>AWARD WINNING PUBLICATION</span>":"")+
            d.pub.description.html+"</br>"+"Involved Authors: "+ d.pub.authors.length;
        }
        /*Author*/
        else if ( d.publications){desc = "Total publications: "+detail.reverseIndex[d.name].publications.length;}
        else if (d.aut){desc = "Total publications: "+detail.reverseIndex[d.aut.name].publications.length;}
        /*Current Value in the bar chart*/
        else if (d.freq){desc = bars.relation.y+": "+ d.freq;}
        /*Year*/
        else if (d.parent){desc = "Publications this year: "+d.children.length;}

        tooltip
            .select("p.description")
            .html(desc);

        if (detail.imageIndex[d.name] != "" && !d.freq) {
            tooltip.select("img")
                .attr("src", detail.imageIndex[d.name]);
            $("#tooltip").find("img").show(150);
        }
        else {
            tooltip.select("img").style("display", "none");
        }

    },
    hide : function (d) {
        var tooltip = d3.select("#tooltip")
            .style("display", "none");
        /*if(!d3.select(this).classed("permanent")){
            d3.select(this).classed("fixed", d.fixed = false);
        }*/
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
