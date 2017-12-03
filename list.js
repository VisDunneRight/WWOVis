
dispatch.on("dataLoaded.list", function(meta, metaTop, metaTopGenre, elemDistTop, elemTop){

  list = d3.select(".column-right").select(".list")
    .selectAll(".collection")
    .data(metaTop);

  list.exit().remove();

  listEnter = list.enter()
    .append('li')
    .attr("class","collection")
    .attr("id", function(d){ return d.filename }); //is the id attached?

  list.merge(listEnter)
    .html(function(d){ return "<b>Title:</b> " + d.title + " <br> <b>Author:</b> " + d.author});

  d3.selectAll(".collection")
    .on("mouseenter",function(d){
      dispatch.call("highlight", null, d);
        // d3.select(this)
        //   .style("font-weight","bold");
    })
    .on("mouseleave",function(d){
      dispatch.call("unhighlight", null, d);
    });

});

dispatch.on("highlight.list", function(d){

  // d3.selectAll(".collection")
  //   .filter(function(e){
  //     if(d.filename == e.filename){ console.log("they match!");}
  //     return d.filename == e.filename; })
  //   .classed("selectedItem",true); //don't think this happens

  d3.selectAll(".collection")
    // .style("font-weight",function(e){
    //   if(d.filename == e.filename){
    //     return "bold";
    //   }
    // })
    .style("opacity",function(e){
      if(d.filename != e.filename){
        return 0.5;
      }
    });

  document.getElementById(d.filename).scrollIntoView(true);

});

dispatch.on("unhighlight.list", function(d){

  // d3.selectAll("collection")
  //   .classed("selectedItem",false);
  d3.selectAll(".collection")
    // .style("font-weight","normal")
    .style("opacity",1);

});

dispatch.on("filterlist", function(d){


});
