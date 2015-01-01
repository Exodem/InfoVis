var sunburst = {
    width : 250, height : 200,
    tree : null,node : null,
    init: function () {
        /*Initialize the sunburst*/
        sunburst.sun = d3.select(".sunburst").append("svg")
            .attr("width", sunburst.width)
            .attr("height", sunburst.height)
            .append("g")
            .attr("transform", "translate(" + sunburst.width / 2 + "," + (sunburst.height / 2) + ")");

        /*var root = this.buildTree();

        var width = 960,
            height = 700,
            radius = Math.min(width, height) / 2;

        var x = d3.scale.linear()
            .range([0, 2 * Math.PI]);

        var y = d3.scale.sqrt()
            .range([0, radius]);

        var color = d3.scale.category20c();

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        var partition = d3.layout.partition()
            .value(function(d) { return d.size; });

        var arc = d3.svg.arc()
            .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
            .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
            .innerRadius(function(d) { return Math.max(0, y(d.y)); })
            .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

        var path = svg.selectAll("path")
            .data(partition.nodes(root))
            .enter().append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return color((d.children ? d : d.parent).name);
            })
            .on("click", click);

        function click(d) {
            path.transition()
                .duration(750)
                .attrTween("d", arcTween(d));
        }

        d3.select(self.frameElement).style("height", height + "px");

        function arcTween(d) {
            var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(y.domain(), [d.y, 1]),
                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
            return function(d, i) {
                return i
                    ? function(t) { return arc(d); }
                    : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
            };
        }*/

        this.buildSunburst();
    },
    buildSunburst : function () {
        /*Build the underlying Tree for the sunburst layout*/

        var root = this.buildTree();

        var radius = Math.min(sunburst.width, sunburst.height) / 2;
        var x = d3.scale.linear()
            .range([0, 2 * Math.PI]);
        var y = d3.scale.sqrt()
            .range([0, radius]);

        var color = d3.scale.category20c();
        var partition = d3.layout.partition()
            .value(function(d) { return d.size; });

        var arc = d3.svg.arc()
            .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
            .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
            .innerRadius(function(d) { return Math.max(0, y(d.y)); })
            .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

        var path = sunburst.sun.selectAll("path")
            .data(partition.nodes(root))
            .enter().append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return color((d.children ? d : d.parent).name);
            })
            .on("click", click)
            .on("mouseenter",function (d) {detail.show(d)})
            .on("mouseout",function (d) {detail.hide(d)});

        function click(d) {
            path.transition()
                .duration(750)
                .attrTween("d", arcTween(d));
        }

        d3.select(self.frameElement).style("height", sunburst.height + "px");

        function arcTween(d) {
            var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(y.domain(), [d.y, 1]),
                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
            return function(d, i) {
                return i
                    ? function(t) { return arc(d); }
                    : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
            };
        }



        /*sunburst.x = d3.scale.linear()
            .range([0, 2 * Math.PI]);
        sunburst.y = d3.scale.sqrt()
            .range([0, this.radius]);

        sunburst.color = d3.scale.category20c();

        sunburst.partition = d3.layout.partition()
            .sort(null)
            .value(function(d) { return d.size; });

        sunburst.arc = d3.svg.arc()
            .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, sunburst.x(d.x))); })
            .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, sunburst.x(d.x + d.dx))); })
            .innerRadius(function(d) { return Math.max(0, sunburst.y(d.y)); })
            .outerRadius(function(d) { return Math.max(0, sunburst.y(d.y + d.dy)); });

        var path = sunburst.sun.selectAll("path")
            .data(sunburst.partition.nodes(sunburst.tree))
            .enter().append("path")
            .attr("d", sunburst.arc)
            .style("fill", function (d) {
                return sunburst.color((d.children ? d : d.parent).name);
                //return sunburst.color(1);
            });
            /*.on("click", function (d) {
                path.transition()
                    .duration(750)
                    .attrTween("d", function (d){
                        // Interpolate the scales!
                        var xd = d3.interpolate(sunburst.x.domain(), [d.x, d.x + d.dx]),
                            yd = d3.interpolate(sunburst.y.domain(), [d.y, 1]),
                            yr = d3.interpolate(sunburst.y.range(), [d.y ? 20 : 0, sunburst.radius]);
                        return function(d, i) {
                            return i ?
                                function(t) { return sunburst.arc(d); } :
                                function (t) {
                                    sunburst.x.domain(xd(t));
                                    sunburst.y.domain(yd(t)).range(yr(t));
                                    return sunburst.arc(d);
                                };
                        };
                    });
            });*/
        d3.select(self.frameElement).style("height", this.height + "px");
    },
    buildTree : function () {
        /*Get the latest filtered Data*/
        var publications = filters.publications;
        /*Reset the Tree*/
        var tree = {name : "root",children : []};
        $.each(publications,function (ip,pub) {
            var pubNode = {
                name : pub.title.name,
                children : [],
                pub : pub
            };
            $.each(pub.authors,function (ia,aut) {
                pubNode.children.push({
                    name : aut.name,
                    size : 1,
                    aut : aut
                })
            });
            var yearEx = false;
            $.each(tree.children,function (iy,year){
                if(year.name == pub.year){
                    yearEx = true;
                    year.children.push(pubNode);
                }
            });
            if(!yearEx){
                tree.children.push({
                    name : pub.year,
                    children : [pubNode]
                })
            }
        });
        console.log(tree);

        /*tree = {
            "name": "flare",
            "children": [
                {
                    "name": "analytics",
                    "children": [
                        {
                            "name": "cluster",
                            "children": [
                                {"name": "AgglomerativeCluster", "size": 3938},
                                {"name": "CommunityStructure", "size": 3812},
                                {"name": "MergeEdge", "size": 743}
                            ]
                        },
                        {
                            "name": "graph",
                            "children": [
                                {"name": "BetweennessCentrality", "size": 3534},
                                {"name": "LinkDistance", "size": 5731}
                            ]
                        }
                    ]
                }
            ]
        };*/
        return tree;

    }
};
