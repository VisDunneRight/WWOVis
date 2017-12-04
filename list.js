var elemTopData,
  metaTopData;

dispatch.on("dataLoaded.list", function(meta, metaTop, metaTopGenre, elemDistTop, elemTop){

  elemTopData = elemTop;
  metaTopData = metaTop;

  list = d3.select("#column-right").select(".list")
    .selectAll(".collection")
    .data(metaTop);

  list.exit().remove();

  listEnter = list.enter()
    .append('li')
    .attr("class","collection")
    .attr("id", function(d){ return d.filename })
    .style("color", function(d) {return scaleColor(d.genre); })
    .style("opacity", 0.8);

  list.merge(listEnter)
    .html(function(d){ return "<b>Title:</b> " + d.title + " <br> <b>Author:</b> " + d.author});

  var i = 0;
  d3.selectAll(".collection")
    .on("mouseenter",function(d){
      dispatch.call("highlight", null, d, i);
        // d3.select(this)
        //   .style("font-weight","bold");
    })
    .on("mouseleave",function(d){
      dispatch.call("unhighlight", null, d);
    });

});

dispatch.on("highlight.list", function(d,i){

  // d3.selectAll(".collection")
  //   .filter(function(e){
  //     if(d.filename == e.filename){ console.log("they match!");}
  //     return d.filename == e.filename; })
  //   .classed("selectedItem",true); //don't think this happens

  d3.selectAll(".collection")
    .transition()
    .duration(100)
    // .style("font-weight",function(e){
    //   if(d.filename == e.filename){
    //     return "bold";
    //   }
    // })
    .style("opacity",function(e){
      if(d.filename != e.filename){
        return 0.2;
      }
    });

  if(i == 1){
    document.getElementById(d.filename).scrollIntoView(true);
  }
});

dispatch.on("highlightmeta.list",function(d,i){
  d3.selectAll(".collection")
    .transition()
    .duration(100)
    .style("display",function(e){
      if((e.isTop == 1) && (e.mainGenre == d.key)){
        return "list-item";
      }
      else{ return "none"; }
    });
    // .style("opacity",function(e){
    //   if((e.isTop == 1) && (e.mainGenre == d.key)){
    //     return 1;
    //   }
    //   else{ return 0.2; }
    // });
});

dispatch.on("highlightelem.list",function(d,i){
  var idSet = new Set();
  elemTopData.forEach(function(e){
    if(d.key == e.element){ idSet.add(e.filename); }
  });
  d3.selectAll(".collection")
    .transition()
    .duration(100)
    .style("display",function(e){
      if((e.isTop == 1) && (idSet.has(e.filename))){
        return "list-item";
      }
      else{ return "none"; }
    });
    // .style("opacity",function(e){
    //   if((e.isTop == 1) && (idSet.has(e.filename))){
    //     return 1;
    //   }
    //   else{ return 0.2; }
    // });
});

dispatch.on("unhighlight.list", function(d){

  // d3.selectAll("collection")
  //   .classed("selectedItem",false);
  d3.selectAll(".collection")
    .transition()
    .duration(200)
    // .style("font-weight","normal")
    .style("display","list-item")
    .style("opacity",1);

});

// dispatch.on("filterlistmeta", function(d){
//   d3.selectAll(".collection")
//     .filter(function(e){ return e.mainGenre != d.key})
//     .transition()
//     .duration(200)
//     .style("display","none");
// });
