var controls = {
    init: function () {
        /*Create Containers*/
        var con = $(".controls");
        con.append("<label>Network</label><div class='netControls'></div>");
        //con.append("<label>Sunburst</label><div class='sunControls'></div>");
        con.append("<label>Bar Chart</label><div class='barControls'></div>");
        var net = $(".netControls");
        //var sun = $(".sunControls");
        var bar = $(".barControls");

        /*Network options*/
        net.append("<span>Click behaviour: </span></br>" +
        "<input type='radio' name='beh' value='fix' checked> Unfix Nodes <br>" +
        "<input type='radio' name='beh' value='select'> Select Nodes ");
        $("input[name=beh]").on("change",function(){
            network.behaviour = this.value;
        });

        /*Bar chart Options*/
        bar.append("<span>X-Axis</span></br>" +
            "<select name='x-axis'>" +
                "<option value='Author'>Author</option>" +
                "<option value='Year'>Year</option>" +
            "</select></br>");
        $("select[name=x-axis]").on("change",function (){
            bars.relation.x = this.value;
            bars.buildBars();
        });

        bar.append("<span>Y-Axis</span></br>" +
            "<select name='y-axis'>" +
                "<option value='Publications'>Publications</option>" +
                "<option value='Awards'>Awards</option>" +
            "</select></br>");
        $("select[name=y-axis]").on("change",function (){
            bars.relation.y = this.value;
            bars.buildBars();
        });

        bar.append("<span>Sort entries by</span></br>" +
            "<input type='radio' name='sort' value='true' checked> value <br>" +
            "<input type='radio' name='sort' value='false'> name ");
        $("input[name=sort]").on("change",function(){
            bars.sort = (this.value=="true");
            bars.buildBars();
        })
    }
};
