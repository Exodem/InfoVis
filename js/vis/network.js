var network = {
    width : 350,height : 350,
    nodes : [],links : [],
    net : null,
    color : null,opac : null,
    force : null,
    reverseIndex : {},imageIndex : {},
    ticks : 1,mouseDown : false,
    dragPos : [0,0],
    init: function () {
        this.net = d3.select(".network").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("style", "background:white");
        /*Add Zooming and Panning Behaviour*/
        this.net
            .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", function () {
                network.net.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }))
            .on("dblclick.zoom", null) /*Prevent Zoom on doublecklick*/
            .on("mousedown",function(){network.mouseDown = true;})
            .on("mouseup",function(){network.mouseDown = true;})
            .append("g");

        this.createBaseNetwork();
    },

    updateData : function (){
        //Get filtered nodes
        this.nodes = filters.authors;
        this.buildIndices();
        //Build links between authors who published together
        $.each(filters.publications, function (ip,pub){
            $.each(pub.authors,function (i,aut){
                var src = network.reverseIndex[pub.authors[i].name];
                if(typeof(src)=='undefined')return true;//continue
                for(var j = i+1;j<pub.authors.length;j++){
                    var ex = false;
                    var dst = network.reverseIndex[pub.authors[j].name];
                    if(typeof(dst)=='undefined')continue;
                    $.each(network.links, function (il,link){
                        if((link.source == src && link.target == dst)
                            || (link.source == dst && link.target ==src)){
                            //Existing link
                            link.value++;
                            ex = true;
                        }
                    });
                    if(!ex){
                        network.links.push({source : src,target : dst,value : 1});
                    }
                }
            });
        });
    },

    /*
    TODO : Add Zoom and pan functionality and an alternative detail view on click
     */

    createBaseNetwork : function () {
        /*Create nodes and links*/
        this.updateData();

        this.color = d3.scale.log()
            .domain([1, d3.max(network.nodes, function (d) {return d.publications.length;})])
            .range([0, 230]);

        this.opac = d3.scale.linear()
            .domain([1, d3.max(network.links, function (d) {return d.value;})])
            .range([0.2, 0.6]);

        this.force = d3.layout.force()
            .charge(-300)
            .linkDistance(30)
            .distance(10)
            .theta(0.3)
            .alpha(0.01)
            .gravity(0.3)
            .friction(0.5)
            .size([this.width, this.height]);

        this.force
            .nodes(this.nodes)
            .links(this.links)
            .start();

        var link = this.net.selectAll(".link")
            .data(this.links)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function (d) {return Math.sqrt(d.value);})
            .style("stroke-opacity", function (d) {return ""+network.opac(d.value);});

        var node = this.net.selectAll(".node")
            .data(this.nodes);


        node.enter().append("circle")
            .attr("class", "node")
            .attr("r", function (d){return (network.color(d.publications.length)/255)*5 + 2;})
            .style("fill", function (d) {
                var c = (Math.round(network.color(d.publications.length)));
                return "rgb("+c+","+30+","+(140-Math.round(c/2))+")";
            }).call(d3.behavior.drag()
                .on("dragstart", function(d) {
                    network.dragPos = d3.mouse(this);
                    d3.event.sourceEvent.stopPropagation();
                    d3.select(this).classed("fixed", d.fixed = true);
                    d3.select(this).classed("permanent",d.permanent = true);
                    d3.select("#tooltip").style("display", "none");
                })
                .on("drag",function (d) {
                    d3.select(this).classed("fixed", d.fixed = true);
                    d3.select(this).classed("permanent",d.permanent = true);
                    d3.event.sourceEvent.stopPropagation();
                    d.px += d3.event.dx;
                    d.py += d3.event.dy;
                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
                    network.force.resume();
                })
                .on("dragend",function(d) {
                    var pos = d3.mouse(this);
                    var dist = Math.sqrt(Math.pow(pos[0]- network.dragPos[0],2)+
                        Math.pow(pos[1]- network.dragPos[1],2));
                    if(dist > 1){
                        d3.select(this).classed("fixed", d.fixed = true);
                        d3.select(this).classed("permanent",d.permanent = true);
                    }
                    else { /*Understand it as a click event for unlocking the node*/
                        d3.select(this).classed("fixed", d.fixed = false);
                        d3.select(this).classed("permanent",d.permanent = false);
                    }
                    d3.select("#tooltip")
                        .style("display", "block")
                        .style("left", d3.event.pageX + 10 + "px")
                        .style("top", d3.event.pageY + 10 + "px");
                    network.force.resume();
                })
        );

        /*Add Detail on Demand*/
        node
            .on("mouseenter", function (d) {
                    var tooltip = d3.select("#tooltip");
                    tooltip
                        .style("left", d3.event.pageX + 10 + "px")
                        .style("top", d3.event.pageY + 10 + "px")
                        .style("display", "block")
                        .select("p")
                        .text(d.name);
                    if (network.imageIndex[d.name] != "") {
                        tooltip.select("img")
                            .attr("src", network.imageIndex[d.name]);
                        $("#tooltip").find("img").show(150);
                    }
                    else {
                        tooltip.select("img").style("display", "none");
                    }
                    d3.select(this).classed("fixed", d.fixed = true);
            })
            .on("mouseout", function (d) {
                    d3.select("#tooltip")
                        .style("display", "none");
                if(!d3.select(this).classed("permanent")){
                    d3.select(this).classed("fixed", d.fixed = false);
                }
            });


        this.force.on("tick", function () {
            if (network.ticks % 4 == 0) {
                //Skip ticks for performance sake
                link
                    .attr("x1", function (d) {return d.source.x;})
                    .attr("y1", function (d) {return d.source.y;})
                    .attr("x2", function (d) {return d.target.x;})
                    .attr("y2", function (d) {return d.target.y;});
                node
                    .attr("cx", function (d) {return d.x;})
                    .attr("cy", function (d) {return d.y;});
            }
            network.ticks++;
        });
    },
    updateNetwork : function (){
        /*Not jet working */
        this.updateData();

        var link = this.net.selectAll(".link")
            .data(this.links);
        link.enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function (d) {
                return Math.sqrt(d.value);
            });
        link.exit().remove();

        var node = this.net.selectAll(".node")
            .data(this.nodes);
        node.enter().append("circle")
            .attr("class", "node")
            .attr("r", 3)
            .style("fill", function (d) {
                return network.color(d.publications.length);
            })
            .call(this.force.drag);
        node.exit().remove();

        /*restart the animation*/
        this.force
            .nodes(this.nodes)
            .links(this.links)
            .start();

    },

    buildIndices : function(){
        network.reverseIndex = {};
        $.each(this.nodes,function (i,v){
            network.imageIndex[v.name] = "";
            network.testAuthorImages(v);
            network.reverseIndex[v.name] = i;
        });
    },

    testAuthorImages : function (author){
        if(author.url=='undefined'||author.url==""){
            network.imageIndex[author.name] = "";
            return;
        }
        /*Try different options of building the image name*/
        var replacements = ["-","_"];
        var endings = [".jpg",".jpeg"];
        $.each(replacements,function(ir,rep){
            $.each(endings,function(ie,ending){
                var url = author.url+ author.name.toLowerCase().split(" ").join(rep)+ending;
                network.setAuthorImage(author,url);
            });
        });

    },

    setAuthorImage : function (author,url) {
        var img = new Image();
        img.onload = function() {
            network.imageIndex[author.name] = url;
        };
        img.src = url;
    }
};
