w = window,
d = document,
e = d.documentElement,
g = d.getElementsByTagName('body')[0],
x = e.clientWidth || g.clientWidth,
y = e.clientHeight|| g.clientHeight;

var bars = {
    width : (x*0.95-228)*0.45, height : (y-170)*0.5-6,
    tree : null,node : null,
    relation : {x:"Author",y:"Publications"},
    bounds : {top : 15,bottom : 15,left : 30,right : 0},
    initialized:false,
    sort : true,
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
            .domain([0, d3.max(data, function (d) {
                return d.freq;
            })])
            .range([bars.height-bars.bounds.bottom-bars.bounds.top, 0]);

        x.domain(data.map(function(d) { return d.name; }));
        y.domain([0, d3.max(data, function(d) { return d.freq; })]);

        //Initialize Axes on startup
        if(!this.initialized){
            this.initialized = true;
            this.bars.append("g")
                .attr("class", "x axis");

            this.bars.append("g")
                .attr("class", "y axis");
        }

        var rects = this.bars.selectAll(".bar")
            .data(data);

        //Enter
        rects
            .enter().append("rect")
            .attr("class", "bar")
            .on("mouseover",function (d) {detail.show(d);})
            .on("mouseout",function (d) {detail.hide(d);});

        //Update
        rects
            .attr("x", function(d) { return x(d.name); })
            .attr("y", function(d) { return y(d.freq); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return bars.height-bars.bounds.bottom - bars.bounds.top - y(d.freq); });

            //.attr("fill",function(d){return d3.scale.category20c()(d.name)});

        //Exit
        rects
            .exit()
            .remove();

        //Adapt Axis
        this.bars.selectAll("g.axis .legend").remove();
        this.bars.selectAll("g.y.axis")
            .call(d3.svg.axis()
                .tickFormat(d3.format("d"))
                .scale(y)
                .orient("left"))
            .append("text")
            .attr("x", -bars.bounds.left + 5)
            .attr("y", -5)
            .attr("class", "legend")
            .text(bars.relation.y);

        this.bars.selectAll("g.x.axis")
            .attr("transform", "translate(0," + (this.height - bars.bounds.bottom - bars.bounds.top) + ")")
            .call(d3.svg.axis()
                .scale(x)
                .orient("bottom"))
            .append("text")
            .attr("y", 11)
            .attr("x", (bars.width - bars.bounds.right - bars.bounds.left) / 2)
            .attr("class", "legend")
            .text(bars.relation.x);
    },
    buildData : function () {
        /*Get the latest filtered Data*/
        var authors = filters.authors;
        var publications = filters.publications;
        /*Reset Data*/
        var data = [];
        if(bars.relation.x == "Author"){
            $.each(authors, function (i, v) {
                if(bars.relation.y == "Publications"){
                    data.push({name: v.name, freq: v.publications.length})
                }
                else{
                    var awards = 0;
                    $.each(v.publications,function(ip1,pub1){
                        $.each(publications,function(ip2,pub2){
                            if(pub1 == pub2.id){
                                if(pub2.award){
                                    awards++;
                                }
                            }
                        })
                    });
                    if(awards >0){
                        data.push({name: v.name, freq: awards})
                    }
                }
            });
        }
        else{
            $.each(publications, function (i, v) {
                if(bars.relation.y == "Awards"){
                    if(!v.award) return true; //Continue
                }
                var ex = false;
                $.each(data, function (id, d) {
                    if (d.name == v.year) {
                        ex = true;
                        d.freq++;
                        return false; //Break
                    }
                });
                if (!ex) {
                    data.push({name: v.year, freq: 1})
                }
            });
        }
        if(this.sort){
            data.sort(function (a,b){
                return a.freq< b.freq;
            });
        }
        return data;
    }
};

