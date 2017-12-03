var m = {t:10,r:10,b:10,l:10},
    wL = document.getElementById("column-left").clientWidth - m.l - m.r,
    hL = document.getElementById("column-left").clientHeight - m.t - m.b;

var svgL = d3.select(".column-left")
  .append("svg")
  .attr("width", wL)
  .attr("height", hL)
  .append('g')
  .attr('class','plot')
  .attr('transform','translate('+ m.l +','+ m.t +')');

// scale for scatterplot
var scaleX = d3.scaleOrdinal()
  .domain(["Drama","Fiction","Non-fiction","Verse","Other"])
  .range([10+(wL*0.1),10+(wL*0.25),10+(wL*0.4),10+(wL*0.55),10+(wL*0.7)]);

var scaleY = d3.scaleTime()
  .domain([new Date(1500,0,1), new Date(1875,0,1)])
  .range([hL,0]);

// domain for scatterplot
var axisY = d3.axisLeft()
    .scale(scaleY)
    .ticks(d3.timeYear.every(50))
    .tickSize(0);

var axisX = d3.axisTop()
    .scale(scaleX)
    .tickSize(0);

var elemTopData;

dispatch.on("dataLoaded.scatterplot",function(meta, metaTop, metaTopGenre, elemDistTop, elemTop){

  elemTopData = elemTop;

  svgL.selectAll(".dots").remove();

  // force-layout
  var forceX = d3.forceX()
    .x(function(d) { return scaleX(d.genre)+10; });
  var forceY = d3.forceY()
    .y(function(d) { return scaleY(d.pubDate); });
  var simulation = d3.forceSimulation()
    .force("collide", d3.forceCollide(4) )
    .force("forceX", forceX )
    .force("forceY", forceY );

  // create circles for metadata
  var dot = svgL.selectAll(".dots")
    .data(meta)
    .enter()
    .append("circle")
    .attr("class","dots")
    .attr("r", 3)
    .style("fill", function(d){
      if(d.isTop == 1){ return "black"; }
      else{ return "none"; }
    })
    .style("stroke", function(d){
      if(d.isTop == 0){ return "black"; }
    })
    .style("stroke-width", function(d){
      if(d.isTop == 0){ return "1px"; }
    })
    .style("opacity", 0.1)
    .attr("cx", function(d) { return scaleX(d.genre); })
    .attr("cy", function(d) { return scaleY(d.pubDate); });

  // interactions
  dot
   .on("mouseenter",function(d){
      if(d.isTop == 1){
        dispatch.call("highlight",this,d);
  };
   })
   .on("mouseout",function(d){
     dispatch.call("unhighlight", null, d);
   });

  simulation.on("tick", function() {
    dot
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
    })
    .nodes(meta);

  svgL.append("g")
    .attr("id","axis-y")
    .attr("transform", "translate(20,0)")
    .attr("font-family","sans-serif")
    .attr("font-size","10px")
    .call(axisY)
    .select(".domain")
    .remove();

  svgL.append("g")
    .attr("id","axis-x")
    .attr("transform", "translate(10,10)")
    .attr("font-family","sans-serif")
    .attr("font-size","10px")
    .call(axisX)
    .select(".domain")
    .remove();

});

dispatch.on("highlight.scatterplot",function(d){
  svgL.selectAll(".dots")
    .filter(function(e){ return e.filename == d.filename; })
    .transition()
    .duration(100)
    .style("fill","black")
    .style("stroke","black")
    .style("stroke-width","1px")
    .style("opacity",1);
});

dispatch.on("highlightmeta.scatterplot",function(d){
  svgL.selectAll(".dots")
    .filter(function(e){ return (e.isTop == 1) && (e.mainGenre == d.key); })
    .transition()
    .duration(100)
    .style("fill","black")
    .style("stroke","black")
    .style("stroke-width","1px")
    .style("opacity",1);
});

dispatch.on("highlightelem.scatterplot",function(d){
  var idSet = new Set();

  elemTopData.forEach(function(e){
    if(d.key == e.element){
      idSet.add(e.filename);
    }
  });

  svgL.selectAll(".dots")
    .filter(function(e){ return (e.isTop == 1) && (idSet.has(e.filename)); })
    .transition()
    .duration(100)
    .style("fill","black")
    .style("stroke","black")
    .style("stroke-width","1px")
    .style("opacity",1);
});

dispatch.on("unhighlight.scatterplot",function(d){
  svgL.selectAll(".dots")
    .transition()
    .duration(100)
    .style("fill", function(d){
      if(d.isTop == 1){ return "black"; }
      else{ return "none"; }
    })
    .style("stroke", function(d){
      if(d.isTop == 0){ return "black"; }
    })
    .style("stroke-width", function(d){
      if(d.isTop == 0){ return "1px"; }
    })
    .style("opacity", 0.1);
});
