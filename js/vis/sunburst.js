var sunburst = {
    init: function () {
        var sun = d3.select(".sunburst").append("svg")
            .attr("width", 250)
            .attr("height", 150)
            .attr("style", "background:white")
            .append("g");
        this.sun = sun;
    }
};
