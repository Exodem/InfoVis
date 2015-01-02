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
        this.buildSunburst();
    },
    buildSunburst : function () {
        /*Build the underlying Tree for the sunburst layout*/
        var root = this.buildTree();

        var radius = Math.min(sunburst.width, sunburst.height) / 2.1;
        var x = d3.scale.pow()
            .range([0,2*Math.PI]);
        var y = d3.scale.linear()
            .range([0, radius]);

        var color = d3.scale.category20c();
        var shade = d3.scale.log()
            .domain([1, d3.max(logic.authors, function (d) {return d.publications.length;})])
            .range([0.3,1]);
        var partition = d3.layout.partition()
            .sort(null)
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
            .style("fill", function (d) {return color((d.children ? d : d.parent).name);})
            .style("opacity",function (d) {return d.children ? 1 : shade (d.value);})
            .on("click", click)
            .on("mouseenter",function (d) {
                detail.show(d);
                /*sunburst.sun.selectAll("path")
                    .style("opacity", 0.6);
                var current = d3.select(this);
                current.style("opacity", 1);
                console.log(current);
                while(current.parent =! 'undefined'){
                    current = current.parent;
                    console.log(current);
                    sunburst.sun.select(current).style("opacity", 1);
                }*/
            })
            .on("mouseout",function (d) {
                detail.hide(d);
                /*sunburst.sun.selectAll("path")
                    .style("opacity", 1);*/
            });
        function shadeColor(color, percent) {
            var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
        }

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

        d3.select(self.frameElement).style("height", this.height + "px");
    },
    buildTree : function () {
        /*Get the latest filtered Data*/
        var publications = filters.publications;
        /*Reset the Tree*/
        var tree = {name : "back",children : []};
        $.each(publications,function (ip,pub) {
            var pubNode = {
                name : pub.title.name,
                children : [],
                pub : pub
            };
            $.each(pub.authors,function (ia,aut) {
                pubNode.children.push({
                    name : aut.name,
                    size : detail.reverseIndex[aut.name].publications.length,
                    aut : aut
                });
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
        return tree;
    }
};
