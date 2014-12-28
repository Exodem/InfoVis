var controls = {
    init: function () {
        var con = d3.select(".controls").append("svg")
            .attr("width", 150)
            .attr("height", 300)
            .attr("style", "background:white")
            .append("g");
        this.con = con;
    }
};
