var filters = {
   init : function (){
       var filters = $(".filters");
       var labels = ["Author","Publication","Year"];
       $.each(labels, function (i, v) {
           filters.append("<input type='text'' name='" + v + "'>")
               .append(v)
               .append("<label></label>");
       });
       $("input[type=text]").click(this.filter);
       /*TODO Add Controls( autocomplete, dropdown etc.) and filter-functionality*/
   },
    filter : function(){
        /*TODO*/
    }
};
