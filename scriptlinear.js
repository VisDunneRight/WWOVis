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
  .attr('transform','translate(20,20)');

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

var col1 = wC/3;
var col2 = (wC/3)*2;
var increment = 14;
var redraws = 0;
var name = "orgName";

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

d3.select("#btn-foreign")
  .on("click",function(d){
    redraws++;
    name = "foreign";
    drawNetwork(name);
  });

drawNetwork(name);

// function to make list of texts
function makePath(data){

  data.forEach(function(i){
    i.path = [{"x": i.sourceData.x - 4, "y": i.sourceData.y - 2, "element": i.element, "mainGenre": i.mainGenre},
      {"x": i.sourceData.x - (wC/10), "y": i.sourceData.y - 2, "element": i.element, "mainGenre": i.mainGenre},
      {"x": i.targetData.x + (wC/10), "y": i.targetData.y - 2, "element": i.element, "mainGenre": i.mainGenre},
      {"x": i.targetData.x + 4, "y": i.targetData.y - 2, "element": i.element, "mainGenre": i.mainGenre}]
  })
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

      // create circles for metadata
      var dot = svgL.selectAll(".dots")
        .data(meta);

      dot.exit().remove();

      var dotEnter = dot.enter()
        .append("circle")
        .attr("class","dots");

      dot.merge(dotEnter)
        .attr("r", 4)
        .style("opacity",.1)
        .attr("stroke", "black")
        // .attr("stroke-width", 1)
        .attr("cx", function(d) { return scaleX(d.genre); })
        .attr("cy", function(d) { return scaleY(d.pubDate); });

      if(redraws == 0){
        svgL.append("g")
          .attr("id","axis-y")
         .attr("transform", "translate(10,0)")
          .attr("font-family","sans-serif")
          .attr("font-size","10px")
          .call(axisY);

        svgL.append("g")
          .attr("id","axis-x")
          // .attr("transform", "translate(50,0)")
          .attr("font-family","sans-serif")
          .attr("font-size","10px")
          .call(axisX)
          .select(".domain")
          .remove();;

        // svgL.append("text")
        //   .attr("transform", "rotate(-90)")
        //   .attr("y", 0 - m.l)
        //   .attr("x", 0 - (hL / 2))
        //   .attr("dy", "1em")
        //   .style("text-anchor", "middle")
        //   .text("Year of publication")
        //   .attr("font-family","sans-serif")
        //   .attr("font-size","10px");

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

  // make the list of texts using metaTop data
  makeList(metaTop);

  // create text for elements
  svgC.selectAll(".text-elem").remove();

  var textElem = svgC.selectAll(".text-elem")
    .data(elemDistTop);

  textElem.exit().remove();

  textElemEnter = textElem.enter()
    .append("g")
    .append("text")
    .attr("class","text-elem");

  textElem = textElem.merge(textElemEnter)
    .attr("x", function(d){
      d.x = col1;
      return d.x;
    })
    .attr("y",function(d,i){
      d.y = 0+(i*increment*1.5);
      return d.y;
    })
    .text(function(d){return d.key})
    .attr("font-family","sans-serif")
    .attr("font-size","10px")
    .attr("text-anchor","end");

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
      d.y = 0+(i*increment*2);
      return d.y;
    })
    .text(function(d){return d.key})
    .attr("font-family","sans-serif")
    .attr("font-size","10px")
    .attr("text-anchor","start");

  // create links connecting element text and genre text
  svgC.selectAll(".links").remove();

  var link = svgC.selectAll(".links")
    .data(makePath(elemTop));

  link.exit().remove();

  linkEnter = link.enter()
    .append("g")
    .attr("class", "links")
    .datum(function(d){ return d.path; })
    .append("path");

  link = link.merge(linkEnter)
    .attr("d", curve)
    .style("stroke-width", 1)
    .style("stroke", "gray")
    .style("fill","none")
    .style("opacity",0.2);

 // interactions
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
   .on("mouseout",function(d){
     textElem
       .transition()
       .duration(200)
       .style("opacity",1);
     link
       .transition()
       .duration(200)
       .style("opacity",.2);
     textMeta
       .transition()
       .duration(200)
       .style("opacity",1);
   });

  textMeta
    .on("mouseover",function(d){
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
          if (elemSet.has(d.key)){
            return 1;
          }
          else { return .1; }
        });
    })
    .on("mouseout",function(d){
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
    });

  });

};
