var controls = {
    width : 150,
    height : 350,
    init: function () {
        var con = d3.select(".controls").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("style", "background:white")
            .append("g");
        this.con = con;
    }
};
