var network = {
    width : 350,
    height : 350,
    nodes : [],
    links : [],
    net : null,
    color : null,
    force : null,
    reverseIndex : {},
    ticks : 1,
    init: function () {
        this.net = d3.select(".network").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("style", "background:white")
            .append("g");
        this.createBaseNetwork();
    },
    updateData : function (){
        //Get filtered nodes
        this.nodes = filters.authors;
        this.buildReverseIndex();
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
    createBaseNetwork : function () {
        /*Create nodes and links*/
        this.updateData();

        this.color = d3.scale.category20();
        this.force = d3.layout.force()
            .charge(-300)
            .linkDistance(30)
            .distance(10)
            .theta(0.8)
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
            .style("stroke-width", function (d) {
                return Math.sqrt(d.value);
            });

        var node = this.net.selectAll(".node")
            .data(this.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 3)
            .style("fill", function (d) {
                return network.color(d.publications.length);
            })
            .call(this.force.drag);

        node.append("title")
            .text(function (d) {
                return d.name;
            });

        this.force.on("tick", function () {
            if (network.ticks % 3 != 0) {
                //Skip ticks for performance sake
                link.attr("x1", function (d) {
                    return d.source.x;
                })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node.attr("cx", function (d) {
                    return d.x;
                })
                    .attr("cy", function (d) {
                        return d.y;
                    });
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
    buildReverseIndex : function(){
        network.reverseIndex = {};
        $.each(this.nodes,function (i,v){
            network.reverseIndex[v.name] = i;
        });
    }
};
