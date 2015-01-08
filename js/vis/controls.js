var controls = {
    width : 150,
    height : 360,
    init: function () {
        controls.con = d3.select(".controls").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("style", "background:white")
            .append("g");
    }
};
