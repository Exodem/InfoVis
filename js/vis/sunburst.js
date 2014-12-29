var sunburst = {
    width : 250,
    height : 150,
    init: function () {
        var sun = d3.select(".sunburst").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("style", "background:white")
            .append("g");
        this.sun = sun;
    }
};
