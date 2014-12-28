var network = {
    init: function () {
        var net = d3.select(".network").append("svg")
                .attr("width", 300)
                .attr("height", 300)
                .attr("style", "background:white")
                .append("g");
        this.net = net;
    }
};
