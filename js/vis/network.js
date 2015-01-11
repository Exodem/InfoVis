var network = {
    width : 350,height : 360,
    nodes : [],links : [],
    reverseIndex : {},
    ticks : 1,mouseDown : false,
    dragPos : [0,0],
    net : null,force : null ,
    color : null,opac : null,
    init: function () {
        /*Initialize SVG*/
        this.net = d3.select(".network").append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
        /*Create force directed Layout*/
        this.force = d3.layout.force()
            .charge(-300)
            .linkDistance(30)
            .distance(10)
            .theta(0.3)
            .alpha(0.01)
            .gravity(0.3)
            .friction(0.5)
            .size([this.width, this.height]);
        /*Add Zooming and Panning Behaviour*/
        this.net
            .call(d3.behavior.zoom()
                .center([network.width / 2, network.height / 2])
                .scaleExtent([0, 8])
                .on("zoom", function () {
                    network.net.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }))
            /*Prevent Zoom on doublecklick and panning behaviour*/
            .on("dblclick.zoom", null)
            .on("mousedown.zoom", null)
            .on("touchstart.zoom", null)
            .on("touchmove.zoom", null)
            .on("touchend.zoom", null)
            .on("mousedown",function(){network.mouseDown = true;})
            .on("mouseup",function(){network.mouseDown = true;})
            .append("g");
        /*Initialize and start the network*/
        this.createNetwork();
    },
    createNetwork : function () {

        /*Create nodes and links*/
        this.updateData();

        /*Define helpers to determine node color and link opacity*/
        this.color = d3.scale.log()
            .domain([1, d3.max(logic.authors, function (d) {return d.publications.length;})])
            .range([0, 230]);
        this.opac = d3.scale.linear()
            .domain([1, d3.max(network.links, function (d) {return d.value;})])
            .range([0.2, 0.6]);

        /*Start the Layout*/
        this.force
            .nodes(this.nodes)
            .links(this.links)
            .start();

        /*Define groups for nodes and Links*/
        this.net.append("g").attr("class","links");
        this.net.append("g").attr("class","nodes");

        /*Insert new Nodes and links to the Network*/
        this.enterNetwork();

        /*Initialze Ticker to update Node positions*/
        this.force.on("tick", function () {
            if (network.ticks % 1 == 0) {
                //Skip ticks for performance sake
                network.net.selectAll(".link")
                    .data(network.links)
                    .attr("x1", function (d) {return d.source.x;})
                    .attr("y1", function (d) {return d.source.y;})
                    .attr("x2", function (d) {return d.target.x;})
                    .attr("y2", function (d) {return d.target.y;});
                network.net.selectAll(".node")
                    .data(network.nodes)
                    .attr("cx", function (d) {return d.x;})
                    .attr("cy", function (d) {return d.y;});
            }
            network.ticks++;
        });
    },
    enterNetwork : function (){
        //Enter
        var link = this.net.select(".links").selectAll(".link")
            .data(this.links);

        /*Add new Links*/
        link
            .enter().append("line")
            .attr("class", "link");

        var node = this.net.select(".nodes").selectAll(".node")
            .data(this.nodes);
        /*Add new Nodes*/
        node
            .enter()
            .append("circle")
            .attr("class", "node")
            /*Add Detail on Demand*/
            .on("mouseenter",function (d) {detail.show(d)})
            .on("mouseout",function (d) {detail.hide(d)})

            /*Add Drag behaviour*/
            .call(d3.behavior.drag()
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

        //Update existing Nodes
        link
            .style("stroke-width", function (d) {return Math.sqrt(d.value);})
            .style("stroke-opacity", function (d) {return ""+network.opac(d.value);});

        node
            .attr("r", function (d){
                return d.publications?((network.color(d.publications.length)/255)*5 + 2):
                d.pub.authors.length/2+2;})
            .style("fill", function (d) {
                if(!d.publications)return "#e6550d";
                var c = (Math.round(network.color(d.publications.length)));
                return "rgb("+c+","+30+","+(140-Math.round(c/2))+")";
            })
            .classed("award",function(d,i){
                if(!d.pub)return false;//Author
                return d.pub.award;
            });
    },
    exitNetwork : function () {
        this.net.select(".links").selectAll(".link")
            .data(this.links).exit().remove();
        this.net.select(".nodes").selectAll(".node")
            .data(this.nodes).exit().remove();
    },
    setHelpTexts : function () {
        this.net.selectAll("text").remove();
        //Show notice if no matching nodes exist
        if(this.nodes.length == 0){
            this.net.append("text")
                .attr("x",network.width/2)
                .attr("y",network.height/2)
                .attr("text-anchor","middle")
                .text("No matching Nodes found.")
                .attr("class", "notification");
        }
        else if(filters.publications.length == 1){
            if(filters.publications[0].authors.length>this.nodes.length-1){
                this.net.append("text")
                    .attr("x",5)
                    .attr("y",this.height-5)
                    .text("Some Authors are missing due to your search criteria.")
                    .style("font-size","12px")
                    .attr("class", "notification");
            }
        }
    },
    updateNetwork : function (){
        /*Get new Data*/
        this.updateData();
        /*Add Textual feedback if Nodes are missing*/
        this.setHelpTexts();
        /*Push the new Nodes to the vis*/
        this.enterNetwork();
        /*Remove nodes that  don't fit the filter criteria*/
        this.exitNetwork();
        /*Trigger the layout to rearrange*/
        this.force
            .nodes(this.nodes)
            .links(this.links)
            .start();
    },
    updateData : function (){
        this.nodes = $.extend(true, [], filters.authors);
        /*Build indices for faster access*/
        this.buildIndex();
        this.links = [];
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
            //Provide quick feedback as the computation takes quite a while
            //network.enterNetwork();
            //network.force.tick();
        });
        //Add detail nodes
        if(filters.publications.length == 1){
            this.createPubDetail();
        }
        else if(this.nodes.length == 1) {
            this.createAuthorDetail();
        }
    },
    createAuthorDetail : function () {
        //Detail view -> There is only one Node!
        var node = network.nodes[0];
        //Add a publication Node to the network
        $.each(node.publications,function (i,v){
            //Do this more efficient later?
            $.each(filters.publications,function(ip,pub){
                if(pub.id == v){
                    network.nodes.push({name : pub.title.name, pub:pub});
                    network.links.push({source : 0,target : i+1,value : (1/pub.authors.length)*4});
                    return false; //Break loop
                }
            });

        });
    },
    createPubDetail : function () {
        var pub = filters.publications[0];
        this.links = [];
        this.nodes.push({name : pub.title.name, pub:pub});
        var pubIndex = this.nodes.length-1;
        for(var i = 0;i<pubIndex;i++) {
            network.links.push({
                source: pubIndex,
                target: i, value: 1
            });
        }
    },
    buildIndex : function(){
        network.reverseIndex = {};
        $.each(this.nodes,function (i,v){
            network.reverseIndex[v.name] = i;
        });
    }
};
