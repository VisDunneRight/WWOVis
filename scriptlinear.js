var m = {t:10,r:10,b:10,l:10},
    wC = document.getElementById("column-center").clientWidth - m.l - m.r,
    hC = document.getElementById("column-center").clientHeight - m.t - m.b,
    wL = document.getElementById("column-left").clientWidth - m.l - m.r,
    hL = document.getElementById("column-left").clientHeight - m.t - m.b,
    wR = document.getElementById("column-right").clientWidth - m.l - m.r,
    hR = document.getElementById("column-right").clientHeight - m.t - m.b;

var svgC = d3.select(".column-center")
  .append("svg")
  .attr("width", wC)
  .attr("height", hC)
  .append('g')
  .attr('class','plot')
  .attr('transform','translate('+ m.l+','+ m.t +')');

var svgL = d3.select(".column-left")
  .append("svg")
  .attr("width", wL)
  .attr("height", hL)
  .append('g')
  .attr('class','plot')
  .attr('transform','translate('+ m.l+','+ m.t +')');

// var svgR = d3.select(".column-right")
//   .append("svg")
//   .attr("width", wR)
//   .attr("height", hR)
  // .append('g')
  // .attr('class','plot')
  // .attr('transform','translate('+ m.l+','+ m.t +')');

// scale for scatterplot
var scaleX = d3.scaleOrdinal()
  .domain(["Drama","Fiction","Non-fiction","Verse","Other"])
  .range([(wL*0.1),(wL*0.25),(wL*0.4),(wL*0.55),(wL*0.7)]);
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

var col1 = wC/4,
  col2 = (wC/4)*3,
  networkHeight = hC * 0.85;
  increment = 14,
  redraws = 0,
  name = "orgName";

var curve = d3.line()
  .x(function(d){ return d.x})
  .y(function(d){ return d.y})
  .curve(d3.curveBundle.beta(0.85));

// buttons
d3.select("#btn-persName")
  .on("click",function(d){
    redraws++;
    name = "persName";
    drawNetwork(name);
  });

d3.select("#btn-orgName")
  .on("click",function(d){
    redraws++;
    name = "orgName";
    drawNetwork(name);
  });

d3.select("#btn-placeName")
  .on("click",function(d){
    redraws++;
    name = "placeName";
    drawNetwork(name);
  });

drawNetwork(name);

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
  // data.forEach(function(d){
  //   var targetDataX = d.targetData.x;
  //   var targetDataY = d.targetData.y;
  //   var element = d.key;
  //   d.values.forEach(function(i){
  //     i.path = [{"x": i.sourceData.x - 4, "y": i.sourceData.y - 2, "element": element, "mainGenre": i.key},
  //       {"x": i.sourceData.x - (wC/10), "y": i.sourceData.y - 2, "element": element, "mainGenre": i.key},
  //       {"x": targetDataX + (wC/10), "y": targetDataY - 2, "element": element, "mainGenre": i.key},
  //       {"x": targetDataX + 4, "y": targetDataY - 2, "element": element, "mainGenre": i.key}]
  //   })
  // })

  return data;
};

function makeList(metaTop){

  list = d3.select(".column-right").select(".list")
    .selectAll(".collection")
    .data(metaTop);

  list.exit().remove();

  listEnter = list.enter()
    .append('li')
    .attr("class","collection")
    .attr("id", function(d){ d.filename});

  list.merge(listEnter)
    .html(function(d){ return d.title });
};

function drawNetwork(name){

  d3.queue()
    .defer(d3.csv, "wwo-metadata_2017-10-12.csv")
    .defer(d3.csv, "wwo_element_" + name + ".csv")
    .await(function(error, meta, elem) {

      // categorize genres
      elem.forEach(function(i){
        if(i.pubDate == "1558-01-23"){
          i.pubDate = "1558";
        }
        if(i.pubDate == "1601-11-30"){
          i.pubDate = "1601";
        }
        if(i.pubDate == "1643-01-28"){
          i.pubDate = "1643";
        }
        if(i.pubDate == "1760-1761"){
          i.pubDate = "1760";
        }
        // i.pubDate = +i.pubDate;
        i.pubDate = new Date(+i.pubDate,0,1);

          if(i.mainGenre == "G.drama" ||
            i.mainGenre == "G.drama.prose" ||
            i.mainGenre == "G.drama.verse" ||
            i.mainGenre == "G.drama.mixed"){
              i.genre = "Drama";
              if(i.mainGenre == "G.drama"){ i.mainGenre = "Drama"; }
              if(i.mainGenre == "G.drama.prose"){ i.mainGenre = "Drama: Prose"; }
              if(i.mainGenre == "G.drama.verse"){ i.mainGenre = "Drama: Verse"; }
              if(i.mainGenre == "G.drama.mixed "){ i.mainGenre = "Drama: Mixed"; }
          }
          else if(i.mainGenre == "G.non-fiction" ||
            i.mainGenre == "G.non-fiction.other" ||
            i.mainGenre == "G.non-fiction.essay" ||
            i.mainGenre == "G.non-fiction.letter"){
              i.genre = "Non-fiction";
              if(i.mainGenre == "G.non-fiction"){ i.mainGenre = "Non-fiction"; }
              if(i.mainGenre == "G.non-fiction.other"){ i.mainGenre = "Non-fiction: Other"; }
              if(i.mainGenre == "G.non-fiction.essay"){ i.mainGenre = "Non-fiction: Essay"; }
              if(i.mainGenre == "G.non-fiction.letter"){ i.mainGenre = "Non-fiction: Letter"; }
          }
          else if(i.mainGenre == "G.verse" ||
            i.mainGenre == "G.verse.lyric"||
            i.mainGenre == "G.verse.narrative" ||
            i.mainGenre == "G.verse.other"){
              i.genre = "Verse";
              if(i.mainGenre == "G.verse"){ i.mainGenre = "Verse"; }
              if(i.mainGenre == "G.verse.lyric"){ i.mainGenre = "Verse: Lyric"; }
              if(i.mainGenre == "G.verse.narrative"){ i.mainGenre = "Verse: Narrative"; }
              if(i.mainGenre == "G.verse.other"){ i.mainGenre = "Verse: Other"; }
          }
          else if(i.mainGenre == "G.fiction" ||
            i.mainGenre == "G.fiction.other"||
            i.mainGenre == "G.fiction.novel" ||
            i.mainGenre == "G.fiction.letter"){
              i.genre = "Fiction";
              if(i.mainGenre == "G.fiction"){ i.mainGenre = "Fiction"; }
              if(i.mainGenre == "G.fiction.other"){ i.mainGenre = "Fiction: Other"; }
              if(i.mainGenre == "G.fiction.novel"){ i.mainGenre = "Fiction: Novel"; }
              if(i.mainGenre == "G.fiction.letter"){ i.mainGenre = "Fiction: Letter"; }
          }
          else if(i.mainGenre == ""){
            i.mainGenre = "Other";
            i.genre = "Other";
          }
      });

      meta.forEach(function(i){

          if(i.pubDate == "1558-01-23"){
            i.pubDate = "1558";
          }
          if(i.pubDate == "1601-11-30"){
            i.pubDate = "1601";
          }
          if(i.pubDate == "1643-01-28"){
            i.pubDate = "1643";
          }
          if(i.pubDate == "1760-1761"){
            i.pubDate = "1760";
          }
          // i.pubDate = +i.pubDate;
          i.pubDate = new Date(+i.pubDate,0,1);

          if(i.mainGenre == "G.drama" ||
            i.mainGenre == "G.drama.prose" ||
            i.mainGenre == "G.drama.verse" ||
            i.mainGenre == "G.drama.mixed"){
              i.genre = "Drama";
              if(i.mainGenre == "G.drama"){ i.mainGenre = "Drama"; }
              if(i.mainGenre == "G.drama.prose"){ i.mainGenre = "Drama: Prose"; }
              if(i.mainGenre == "G.drama.verse"){ i.mainGenre = "Drama: Verse"; }
              if(i.mainGenre == "G.drama.mixed "){ i.mainGenre = "Drama: Mixed"; }
          }
          else if(i.mainGenre == "G.non-fiction" ||
            i.mainGenre == "G.non-fiction.other" ||
            i.mainGenre == "G.non-fiction.essay" ||
            i.mainGenre == "G.non-fiction.letter"){
              i.genre = "Non-fiction";
              if(i.mainGenre == "G.non-fiction"){ i.mainGenre = "Non-fiction"; }
              if(i.mainGenre == "G.non-fiction.other"){ i.mainGenre = "Non-fiction: Other"; }
              if(i.mainGenre == "G.non-fiction.essay"){ i.mainGenre = "Non-fiction: Essay"; }
              if(i.mainGenre == "G.non-fiction.letter"){ i.mainGenre = "Non-fiction: Letter"; }
          }
          else if(i.mainGenre == "G.verse" ||
            i.mainGenre == "G.verse.lyric"||
            i.mainGenre == "G.verse.narrative" ||
            i.mainGenre == "G.verse.other"){
              i.genre = "Verse";
              if(i.mainGenre == "G.verse"){ i.mainGenre = "Verse"; }
              if(i.mainGenre == "G.verse.lyric"){ i.mainGenre = "Verse: Lyric"; }
              if(i.mainGenre == "G.verse.narrative"){ i.mainGenre = "Verse: Narrative"; }
              if(i.mainGenre == "G.verse.other"){ i.mainGenre = "Verse: Other"; }
          }
          else if(i.mainGenre == "G.fiction" ||
            i.mainGenre == "G.fiction.other"||
            i.mainGenre == "G.fiction.novel" ||
            i.mainGenre == "G.fiction.letter"){
              i.genre = "Fiction";
              if(i.mainGenre == "G.fiction"){ i.mainGenre = "Fiction"; }
              if(i.mainGenre == "G.fiction.other"){ i.mainGenre = "Fiction: Other"; }
              if(i.mainGenre == "G.fiction.novel"){ i.mainGenre = "Fiction: Novel"; }
              if(i.mainGenre == "G.fiction.letter"){ i.mainGenre = "Fiction: Letter"; }
          }
          else if(i.mainGenre == ""){
            i.mainGenre = "Other";
            i.genre = "Other";
          }
      });

      if (error) throw error;

      if(redraws == 0){

        // force-layout
        var forceX = d3.forceX()
          .x(function(d) { return scaleX(d.genre); });
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
          .attr('r', 2)
          .attr("stroke", "black")
          .style("opacity", 0.1)
          .attr("cx", function(d) { return scaleX(d.genre); })
          .attr("cy", function(d) { return scaleY(d.pubDate); });

        simulation.on("tick", function() {
          dot
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
          })
          .nodes(meta);

        svgL.append("g")
          .attr("id","axis-y")
         .attr("transform", "translate(10,0)")
          .attr("font-family","sans-serif")
          .attr("font-size","10px")
          .call(axisY)
          .select(".domain")
          .remove();

        svgL.append("g")
          .attr("id","axis-x")
          .attr("font-family","sans-serif")
          .attr("font-size","10px")
          .call(axisX)
          .select(".domain")
          .remove();

      };

      // create array of distinct in-text element values
      var elemDist = d3.nest()
        .key(function(d){return d.element})
        .rollup(function(d){return d.length})
        .entries(elem);

      elemDist.sort(function(a,b){
          return b["value"]-a["value"];
        });

      // take top 20 distinct in-text element values
      var elemDistTop = elemDist.slice(0,21);

      // filter element data to match elements in elemDistTop
      var elemTop = elem.filter(function(d){
        var i = 0;
        elemDistTop.forEach(function(a){
          if(a.key == d.element){
            i = 1;
          }
        });
        return i == 1;
      });

      elemTop.sort(function(a,b){
        return d3.ascending(a.element, b.element);
      });

      var elemTopGrp = d3.nest()
        .key(function(d){return d.element;})
        .key(function(d){return d.mainGenre;})
        .entries(elemTop);

      elemTopGrp.forEach(function(d){
        var i = 0;
        d.values.forEach(function(a){
          i += a.values.length;
          a.count = a.values.length;
        })
        d.count = i;
      });

      elemTopGrp.sort(function(a,b){
        return b["count"]-a["count"];
      });

      // filter metadata to match texts in elemTop
      var metaTop = meta.filter(function(d){
        var i = 0;
        elemTop.forEach(function(a){
          if(a.filename == d.filename){
            i = 1;
          }
        });
        return i == 1;
      });

      // create array of distinct genre values
      var metaTopGenre = d3.nest()
        .key(function(d){ return d.mainGenre })
        .rollup(function(d){return d.length})
        .entries(metaTop);

      metaTopGenre.sort(function(a,b){
        return d3.ascending(a.key, b.key);
      })

      // create objects connecting positions of element and genre text to link data
      var elemDistObj = {};
      var metaObj = {};
      elemDistTop.forEach(function(a){
        elemDistObj[a.key] = a
      });

      metaTopGenre.forEach(function(a){
        metaObj[a.key] = a
      });

      elemTop.forEach(function(i){
        i.sourceData = metaObj[i.mainGenre]
        i.targetData = elemDistObj[i.element]
      });

      elemTopGrp.forEach(function(i){
        i.targetData = elemDistObj[i.key]
        i.values.forEach(function(b){
          b.sourceData = metaObj[b.key]
        })
      });

  // make the list of texts using metaTop data
  makeList(metaTop);

  // create text for elements
  var ypos = 0;
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
      // position = ypos + (d.value/2) - 10;
      ypos += ((d.value / elemTopLength)*networkHeight) + 2;
      return position;
    })
    .text(function(d){return d.key})
    .attr("font-family","sans-serif")
    .attr("font-size","10px")
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
      return d.y;
    })
    .text(function(d){return d.key})
    .attr("font-family","sans-serif")
    .attr("font-size","10px")
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
    .attr("d", curve)
    .style("stroke-width", 1)
    .style("stroke", "gray")
    .style("fill","none")
    .style("opacity",0.2);

 // interactions

 // element list
 textElem
   .on("mouseover",function(d){
     var metaSet = new Set();
     //highlight element name
     textElem
       .transition()
       .duration(200)
       .style("opacity",function(a){
         if (a.key == d.key){
           return 1;
         }
         else { return .1; }
       });

     //highlight links
     link
       .transition()
       .duration(200)
       .style("opacity",function(a){
         if (a[0].element == d.key){
           metaSet.add(a[0].mainGenre);
           return .4;
         }
         else { return 0; }
       });

     //highlight meta genre
     textMeta
       .transition()
       .duration(200)
       .style("opacity",function(a){
         if (metaSet.has(a.key)){
           return 1;
         }
         else { return .1; }
       });
   })
   .on("mouseout",mouseout);

  // genre list
  textMeta
    .on("mouseover",textMetaMouseover)
    .on("mouseout",mouseout)
    .on("click",function(d){
      d3.select(this)
        .transition()
        .duration(200)
        .style("font-weight","bolder");
    });

function textMetaMouseover(d){
  var elemSet = new Set();

      //highlight meta genre
      textMeta
        .transition()
        .duration(200)
        .style("opacity",function(a){
          if (a.key == d.key){
            return 1;
          }
          else { return .1; }
        });

      //highlight links
      link
        .transition()
        .duration(200)
        .style("opacity",function(a){
          if (a[0].mainGenre == d.key){
            elemSet.add(a[0].element);
            return .4;
          }
          else { return 0; }
        });

      //highlight element name
      textElem
        .transition()
        .duration(200)
        .style("opacity",function(a){
          if (elemSet.has(a.key)){
            return 1;
          }
          else { return .1; }
        });
      };
  function mouseout(d){
    textMeta
      .transition()
      .duration(200)
      .style("opacity",1);
    textElem
      .transition()
      .duration(200)
      .style("opacity",1);
    link
      .transition()
      .duration(200)
      .style("opacity",.2);
  };

  });

};
