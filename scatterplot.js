var m = {t:10,r:10,b:10,l:10},
    wL = document.getElementById("column-left").clientWidth - m.l - m.r,
    hL = document.getElementById("column-left").clientHeight - m.t - m.b;

var svgL = d3.select("#column-left")
  .append("svg")
  .attr("width", wL)
  .attr("height", hL)
  .append("g")
  .attr("class","plot")
  .attr("height", hL-40)
  .attr("transform","translate("+ m.l +","+ m.t +")");

var legend = svgL.append("g")
  .attr("class","legend")
  .style("opacity",0);

legend
  .append("path")
  .attr("id","legendLineFilled")
  .style("fill", "none")
  .style("stroke", "#292826")
  .style("stroke-width", "0.5px");

legend
  .append("path")
  .attr("id","legendLineUnfilled")
  .style("fill", "none")
  .style("stroke", "#292826")
  .style("stroke-width", "0.5px");

legend
  .append("text")
  .attr("id","legendTextFilled1")
  .text("includes one of")
  .style("font-size", "8px")
  .style("fill", "#292826")
  .attr("text-anchor","middle");
legend
  .append("text")
  .attr("id","legendTextFilled2")
  .text("the top 20 names")
  .style("font-size", "8px")
  .style("fill", "#292826")
  .attr("text-anchor","middle");

legend
  .append("text")
  .attr("id","legendTextUnfilled1")
  .text("doesn't include one of")
  .style("font-size", "8px")
  .style("fill", "#292826")
  .attr("text-anchor","middle");
legend
  .append("text")
  .attr("id","legendTextUnfilled2")
  .text("the top 20 names")
  .style("font-size", "8px")
  .style("fill", "#292826")
  .attr("text-anchor","middle");

function positionLegendLines(indicator){
  var cx, cy;
  if(indicator == 1){
    dotFilled = svgL.selectAll(".dots")
      .filter(function(d){ return (d.isTop == 1) && (d.filename == "bacon.sermonelec.xml"); });
    cx = dotFilled.attr("cx");
    cy = dotFilled.attr("cy");
  }
  if(indicator == 0){
    dotUnfilled = svgL.selectAll(".dots")
      .filter(function(d){ return (d.isTop == 0) && (d.filename == "sidney.clorinda.xml"); });
    cx = dotUnfilled.attr("cx");
    cy = dotUnfilled.attr("cy");
  }
  return {
    cx: +cx,
    cy: +cy
  }
};

// scale for scatterplot
var scaleX = d3.scaleOrdinal()
  .domain(["Drama","Fiction","Non-fiction","Verse"])
  .range([10+(wL*0.1),10+(wL*0.3),10+(wL*0.5),10+(wL*0.7)]);

var scaleY = d3.scaleTime()
  .domain([new Date(1500,0,1), new Date(1875,0,1)])
  .range([hL-40,0]);

var scaleColor = d3.scaleOrdinal()
  .domain(["Drama","Fiction","Non-fiction","Verse"])
  .range(["#C2185B", "#673AB7", "#00ACC1", "#43A047"]);
  // 700 pink, 500 deep purple, 600 cyan, 600 green

// domain for scatterplot
var axisY = d3.axisLeft()
    .scale(scaleY)
    .ticks(d3.timeYear.every(50))
    .tickFormat(d3.timeFormat("%Y"))
    .tickSize(0);

var axisX = d3.axisTop()
    .scale(scaleX)
    .tickSize(0);

svgL.append("g")
  .attr("id","axis-y")
  .attr("transform", "translate(20,0)")
  .attr("font-family","sans-serif")
  .attr("font-size","10px")
  .attr("fill","#292826")
  .attr('class', 'axisColor')
  .call(axisY)
  .select(".domain")
  .remove();

svgL.append("g")
  .attr("id","axis-x")
  .attr("transform", "translate(10,10)")
  .attr("font-family","sans-serif")
  .attr("font-size","10px")
  .attr('class', 'axisColor')
  .call(axisX)
  .select(".domain")
  .remove();

var elemTopData;

dispatch.on("dataLoaded.scatterplot",function(allData){
  var meta = allData.meta,
  metaTop = allData.metaTop,
  metaTopGenre = allData.metaTopGenre,
  elemTop = allData.elemTop,
  elemDistTop = allData.elemDistTop;

  elemTopData = elemTop;

  // force-layout
  var forceX = d3.forceX()
    .x(function(d) { return scaleX(d.genre)+10; });
  var forceY = d3.forceY()
    .y(function(d) { return scaleY(d.pubDate); });
  var simulation = d3.forceSimulation()
    .force("collide", d3.forceCollide(4))
    .force("forceX", forceX )
    .force("forceY", forceY );
  simulation.first = 0;

  // create circles for metadata
  var dot = svgL.selectAll(".dots")
    .data(meta, function(d) {
      return d.filename;
    });

  dot.exit().remove();

  dotEnter = dot.enter()
    .append("circle")
    .attr("class","dots")
    .attr("cx", function(d) { d.x = scaleX(d.genre)+10; return d.x; })
    .attr("cy", function(d) { d.y = scaleY(d.pubDate); return d.y; });

  dot = dot.merge(dotEnter)
    .attr("r", function(d){
      if(d.isTop == 1){ return 3; }
      else{ return 2.5; }
    })
    .style("fill", function(d){
      if(d.isTop == 1){ return scaleColor(d.genre); }
      else{ return "none"; }
    })
    .style("stroke", function(d){
      if(d.isTop == 0){ return scaleColor(d.genre); }
    })
    .style("stroke-width", function(d){
      if(d.isTop == 0){ return "1px"; }
    })
    .style("opacity", 0.8);

    simulation.on("tick", function() {
      dot
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    })
    .nodes(meta);

    // place legend
    legend
      .transition()
      .delay(3000)
      .duration(2000)
      .style("opacity",0.6);

    var cxFilled, cxUnfilled;

    svgL.select("#legendLineFilled")
      .attr("d",function(){
        start = positionLegendLines(1);
        cxFilled = start.cx;
        return "M " + (start.cx-8) + " " + (start.cy) +
          " L " + (start.cx-28) + " " + (start.cy) +
          " L " + (start.cx-28) + " 430";
      });

    svgL.select("#legendLineUnfilled")
      .attr("d",function(){
        start = positionLegendLines(0);
        cxUnfilled = start.cx;
        return "M " + (start.cx+8) + " " + (start.cy) +
          " L " + (start.cx+18) + " " + (start.cy) +
          " L " + (start.cx+18) + " 400";
      });

    svgL.select("#legendTextFilled1")
      .attr("x",cxFilled-28)
      .attr("y",440);

    svgL.select("#legendTextFilled2")
      .attr("x",cxFilled-28)
      .attr("y",450);

    svgL.select("#legendTextUnfilled1")
      .attr("x",cxUnfilled+18)
      .attr("y",410);

    svgL.select("#legendTextUnfilled2")
      .attr("x",cxUnfilled+18)
      .attr("y",420);

  // interactions
  dot
   .on("mouseenter",function(d){
     var i = 1
      if(d.isTop == 1){
        dispatch.call("highlight",this,d,i);
      };
   })
   .on("mouseout",function(d){
     dispatch.call("unhighlight", null, d);
   });

});

dispatch.on("highlight.scatterplot",function(d){
  svgL.selectAll(".dots")
    .filter(function(e){ return e.filename == d.filename; })
    .transition()
    .duration(100)
    // .style("fill","black")
    .style("stroke",function(e){ return scaleColor(e.genre); })
    .style("stroke-width","1px")
    .style("opacity",1);
  svgL.selectAll(".dots")
    .filter(function(e){ return (e.filename != d.filename); })
    .transition()
    .duration(100)
    .style("opacity",0.2);
  svgL.selectAll(".legend")
    .transition()
    .duration(100)
    .style("opacity",0.1);
});

dispatch.on("highlightmeta.scatterplot",function(d){
  svgL.selectAll(".dots")
    .filter(function(e){ return (e.isTop == 1) && (e.mainGenre == d.key); })
    .transition()
    .duration(100)
    // .style("fill","black")
    .style("stroke",function(e){ return scaleColor(e.genre); })
    .style("stroke-width","1px")
    .style("opacity",1);
  svgL.selectAll(".dots")
    .filter(function(e){ return (e.isTop == 0) || (e.mainGenre != d.key); })
    .transition()
    .duration(100)
    .style("opacity",0.2);
  svgL.selectAll(".legend")
    .transition()
    .duration(100)
    .style("opacity",0.1);
});

dispatch.on("highlightelem.scatterplot",function(d){
  var idSet = new Set();
  elemTopData.forEach(function(e){
    if(d.key == e.element){ idSet.add(e.filename); }
  });
  svgL.selectAll(".dots")
    .filter(function(e){ return (e.isTop == 1) && (idSet.has(e.filename)); })
    .transition()
    .duration(100)
    .style("stroke", function(e){ return scaleColor(e.genre); })
    .style("stroke-width","1px")
    .style("opacity",1);
  svgL.selectAll(".dots")
    .filter(function(e){ return !(idSet.has(e.filename)); })
    .transition()
    .duration(100)
    .style("opacity",0.2);
  svgL.selectAll(".legend")
    .transition()
    .duration(100)
    .style("opacity",0.1);
});

dispatch.on("unhighlight.scatterplot",function(d){
  svgL.selectAll(".dots")
    .transition()
    .duration(100)
    .style("fill", function(d){
      if(d.isTop == 1){ return scaleColor(d.genre); }
      else{ return "none"; }
    })
    .style("stroke", function(d){
      if(d.isTop == 0){ return scaleColor(d.genre); }
    })
    .style("stroke-width", function(d){
      if(d.isTop == 0){ return "1px"; }
    })
    .style("opacity", 0.8);
  svgL.selectAll(".legend")
    .transition()
    .duration(100)
    .style("opacity",0.6);
});
