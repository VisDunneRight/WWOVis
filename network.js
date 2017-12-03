var m = {t:10,r:10,b:10,l:10},
    wC = document.getElementById("column-center").clientWidth - m.l - m.r,
    hC = document.getElementById("column-center").clientHeight - m.t - m.b;

var svgC = d3.select(".column-center")
  .append("svg")
  .attr("width", wC)
  .attr("height", hC)
  .append('g')
  .attr('class','plot')
  .attr('transform','translate('+ m.l+','+ m.t +')');

var col1 = wC/5,
  col2 = (wC/5)*4,
  networkHeight = hC * 0.85;

var curve = d3.line()
  .x(function(d){ return d.x})
  .y(function(d){ return d.y})
  .curve(d3.curveBundle.beta(0.85));

// function to make list of texts
function makePath(data){

  var elemPrev, y,
    countElem = 0,
    countTotal = 0;

  data.forEach(function(i){

    if(countTotal == 0){ elemPrev = i.element; }
    else if(elemPrev !== i.element){ countElem = 0; }

    increment = ((i.targetData.prop*networkHeight)/i.targetData.value) * countElem;

    y = i.targetData.y + increment;

    i.path = [{"x": i.sourceData.x - 4, "y": i.sourceData.y, "element": i.element, "mainGenre": i.mainGenre},
      {"x": i.sourceData.x - (wC/10), "y": i.sourceData.y, "element": i.element, "mainGenre": i.mainGenre},
      {"x": i.targetData.x + (wC/10), "y": y, "element": i.element, "mainGenre": i.mainGenre},
      {"x": i.targetData.x + 4, "y": y, "element": i.element, "mainGenre": i.mainGenre}];

    countElem++;
    countTotal++;
    elemPrev = i.element;
  })

  return data;

};

dispatch.on("dataLoaded.network",function(meta, metaTop, metaTopGenre, elemDistTop, elemTop){

  // create text for elements
  var ypos = 0,
    clicked = 0;
  var elemTopLength = elemTop.length;

  svgC.selectAll(".text-elem").remove();
  svgC.selectAll(".rect-elem").remove();

  var textElem = svgC.selectAll(".text-elem")
    .data(elemDistTop)
    .enter()
    .append("g")
    .attr("class","text-elem")
    .append("text")
    .attr("x", function(d){
      d.x = col1;
      return d.x - 4;
    })
    .attr("y",function(d){
      d.y = ypos;
      d.prop = d.value / elemTopLength;
      position = ypos + 5 + (d.prop*networkHeight)/2;
      ypos += ((d.value / elemTopLength)*networkHeight) + 2;
      return position;
    })
    .text(function(d){return d.key})
    .attr("font-family","sans-serif")
    .attr("font-size","8px")
    .attr("text-anchor","end");;

  var rectElem = svgC.selectAll(".rect-elem")
    .data(elemDistTop)
    .enter()
    .append("rect")
    .attr("class","rect-elem")
    .attr("x",function(d){
      return d.x;
    })
    .attr("y",function(d){
      return d.y;
    })
    .attr("width","1px")
    .attr("height", function(d){
      return (d.prop*networkHeight);
    })
    .attr("fill","black");

  // create text for genres
  var textMeta = svgC.selectAll(".text-meta")
    .data(metaTopGenre);

  textMeta.exit().remove();

  textMetaEnter = textMeta.enter()
    .append("g")
    .append("text")
    .attr("class","text-meta");

  textMeta = textMeta.merge(textMetaEnter)
    .attr("x", function(d){
      d.x = col2;
      return d.x;
    })
    .attr("y",function(d,i){
      d.y = i*(networkHeight/metaTopGenre.length);
      return d.y+2;
    })
    .text(function(d){return d.key})
    .attr("font-family","sans-serif")
    .attr("font-size","8px")
    .attr("text-anchor","start");

  // create links connecting element text and genre text
  svgC.selectAll(".links").remove();

  var link = svgC.selectAll(".links")
    .data(makePath(elemTop))
    .enter()
    .append("g")
    .attr("class","links")
    .datum(function(d){ return d.path; })
    .append("path")
    .attr("class","path-links")
    // .transition()
    // .duration(500)
    .attr("d", curve)
    .style("stroke-width", 1)
    .style("stroke", "gray")
    .style("fill","none")
    .style("opacity",0.1);

  // interactions
  textElem
    .on("mouseover",function(d){
      clicked = 0;
      dispatch.call("highlightelem",this,d);
    })
    .on("mouseout", function(d){
      if(clicked == 0){
        dispatch.call("unhighlight");
      }
    })
    .on("click",function(d){
      clicked = 1;
      dispatch.call("highlightelem",this,d);
      dispatch.call("filterlist",this,d);
    });

   textMeta
     .on("mouseover", function(d){
       clicked = 0;
       dispatch.call("highlightmeta",this,d);
     })
     .on("mouseout", function(d){
       if(clicked == 0){
         dispatch.call("unhighlight");
       }
     })
     .on("click", function(d){
       clicked = 1;
       // d3.select(this)
       //   .transition()
       //   .duration(200)
       //   .style("font-weight","bolder");
      dispatch.call("highlightmeta",this,d);
      dispatch.call("filterlist",this,d);
     });

});

dispatch.on("highlightelem", function(d){

  var metaSet = new Set();

  //highlight element
  svgC.selectAll(".text-elem")
    .transition()
    .duration(200)
    .style("opacity",function(a){
      if (a.key == d.key){
        return 1;
      }
      else { return .1; }
    });

   svgC.selectAll(".rect-elem")
    .transition()
    .duration(200)
    .style("opacity",function(a){
      if (a.key == d.key){
        return 1;
      }
      else { return .1; }
    });

  //highlight links
  svgC.selectAll(".path-links")
    .transition()
    .duration(200)
    .style("opacity",function(a){
      if (a[0].element == d.key){
        metaSet.add(a[0].mainGenre);
        return .1;
      }
      else { return 0; }
    });

  //highlight meta genre
  svgC.selectAll(".text-meta")
    .transition()
    .duration(200)
    .style("opacity",function(a){
      if (metaSet.has(a.key)){
        return 1;
      }
      else { return .1; }
    });
})

dispatch.on("highlightmeta", function(d){

  var elemSet = new Set();

  //highlight meta genre
  svgC.selectAll(".text-meta")
    .transition()
    .duration(200)
    .style("opacity",function(a){
      if (a.key == d.key){
        return 1;
      }
      else { return .1; }
    });

  //highlight links
  svgC.selectAll(".path-links")
    .transition()
    .duration(200)
    .style("opacity",function(a){
      if (a[0].mainGenre == d.key){
        elemSet.add(a[0].element);
        return .1;
      }
      else { return 0; }
    });

  //highlight element
  svgC.selectAll(".text-elem")
    .transition()
    .duration(200)
    .style("opacity",function(a){
      if (elemSet.has(a.key)){
        return 1;
      }
      else { return .1; }
    });

  svgC.selectAll(".rect-elem")
    .transition()
    .duration(200)
    .style("opacity",function(a){
      if (elemSet.has(a.key)){
        return 1;
      }
      else { return .1; }
    });
});

dispatch.on("unhighlight.network",function(){
  svgC.selectAll(".text-meta")
    .transition()
    .duration(200)
    .style("opacity",1);
  svgC.selectAll(".text-elem")
    .transition()
    .duration(200)
    .style("opacity",1);
  svgC.selectAll(".rect-elem")
    .transition()
    .duration(200)
    .style("opacity",1);
  svgC.selectAll(".path-links")
    .transition()
    .duration(200)
    .style("opacity",.1);
});
