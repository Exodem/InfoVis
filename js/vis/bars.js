var bars = {
    width : 250, height : 150,
    tree : null,node : null,
    relation : {x:"Authors",y:"Publications"},
    bounds : {top : 15,bottom : 15,left : 30,right : 0},
    initialized:false,
    init: function () {
        /*Initialize the sunburst*/
        bars.bars = d3.select(".bars").append("svg")
            .attr("width", bars.width)
            .attr("height", bars.height)
            .append("g")
            .style("background","black")
            .attr("transform", "translate(" + bars.bounds.left + "," + bars.bounds.top + ")");
        this.buildBars();
    },
    buildBars : function () {
        /*Build tha Data*/
        var data = this.buildData();

        var x = d3.scale.ordinal()
            .rangeBands([1, bars.width-bars.bounds.right-bars.bounds.left-1]);

        var y = d3.scale.linear()
            .range([bars.height-bars.bounds.bottom-bars.bounds.top, 0]);

        x.domain(data.map(function(d) { return d.name; }));
        y.domain([0, d3.max(data, function(d) { return d.freq; })]);

        //Initialize Axes on startup
        if(!this.initialized){
            this.initialized = true;
            this.bars.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (this.height - bars.bounds.bottom - bars.bounds.top) + ")")
                .call(d3.svg.axis()
                    .scale(x)
                    .orient("bottom"))
                .append("text")
                .attr("y", 11)
                .attr("x", (bars.width - bars.bounds.right - bars.bounds.left) / 2)
                .attr("class", "legend")
                .text(bars.relation.x);

            this.bars.append("g")
                .attr("class", "y axis")
                .call(d3.svg.axis()
                    .scale(y)
                    .orient("left"))
                .append("text")
                .attr("x", -bars.bounds.left + 5)
                .attr("y", -5)
                .attr("class", "legend")
                .text(bars.relation.y);
        }

        var rects = this.bars.selectAll(".bar")
            .data(data);

        //Enter
        rects
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.name); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.freq); })
            .attr("height", function(d) { return bars.height-bars.bounds.bottom - bars.bounds.top - y(d.freq); })
            .on("mouseover",function (d) {detail.show(d);})
            .on("mouseout",function (d) {detail.hide(d);});

        //Update
        rects
            .attr("x", function(d) { return x(d.name); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.freq); })
            .attr("height", function(d) { return bars.height-bars.bounds.bottom - bars.bounds.top - y(d.freq); });

        //Exit
        rects
            .exit()
            .remove();
    },
    buildData : function () {
        /*Get the latest filtered Data*/
        var authors = filters.authors;
        /*Reset Data*/
        var data = [];
        $.each(authors,function (i,v){
            data.push({name : v.name, freq : v.publications.length})
        });
        data.sort(function (a,b){
            return a.freq< b.freq;
        });
        //Crop data that can not be shown
        data.length = Math.min(data.length,bars.width/2);
        return data;
    }
};

