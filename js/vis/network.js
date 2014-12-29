var network = {
    width : 350,
    height : 350,
    nodes : [],
    links : [],
    net : null,
    color : null,
    opac : null,
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

        this.color = d3.scale.log()
            .domain([1, d3.max(network.nodes, function (d) {
                return d.publications.length;})])
            .range([0, 230]);

        this.opac = d3.scale.linear()
            .domain([1, d3.max(network.links, function (d) {
                return d.value;})])
            .range([0.3, 1]);

        this.force = d3.layout.force()
            .charge(-300)
            .linkDistance(30)
            .distance(10)
            .theta(0.8)
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
            .style("stroke-width", function (d) {
                return Math.sqrt(d.value);
            })
            .style("stroke-opacity", function (d) {
                //console.log(""+network.opac(d.value));
                return ""+network.opac(d.value);
            });

        var node = this.net.selectAll(".node")
            .data(this.nodes);
        node.enter().append("circle")
            .attr("class", "node")
            .attr("r", function (d){
                return (network.color(d.publications.length)/255)*5 + 2;
            })
            .style("fill", function (d) {
                var c = (Math.round(network.color(d.publications.length)));
                return "rgb("+c+","+30+","+(140-Math.round(c/2))+")";
            })
            .call(this.force.drag);

        /*Add Detail on Demand*/
        node.on("mouseover", function (d) {
            d3.select("#tooltip")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY-30 + "px")
                .style("display", "block")
                .select("p")
                .text(d.name);
            })
            .on("mouseout", function () {
                d3.select("#tooltip")
                    .style("display","none");
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
