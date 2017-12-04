var dispatch = d3.dispatch("dataLoaded",
  "highlight","highlightmeta","highlightelem","unhighlight");

var name = "orgName";
var redraws = 0;

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

function drawNetwork(name){

  d3.queue()
    .defer(d3.csv, "wwo-metadata_2017-10-12.csv")
    .defer(d3.csv, "wwo_element_" + name + ".csv")
    .await(function(error, meta, elem) {

      if (error) throw error;

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
                if(i.mainGenre == "G.drama.mixed"){ i.mainGenre = "Drama: Mixed"; }
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
            i.pubDate = new Date(+i.pubDate,0,1);

            if(i.mainGenre == "G.drama" ||
              i.mainGenre == "G.drama.prose" ||
              i.mainGenre == "G.drama.verse" ||
              i.mainGenre == "G.drama.mixed"){
                i.genre = "Drama";
                if(i.mainGenre == "G.drama"){ i.mainGenre = "Drama"; }
                if(i.mainGenre == "G.drama.prose"){ i.mainGenre = "Drama: Prose"; }
                if(i.mainGenre == "G.drama.verse"){ i.mainGenre = "Drama: Verse"; }
                if(i.mainGenre == "G.drama.mixed"){ i.mainGenre = "Drama: Mixed"; }
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

      // elemTop.sort(function(a,b){
      //   return d3.ascending(a.mainGenre, b.mainGenre);
      // });

      elemTop.sort(function(a,b){
        return b["pubDate"]-a["pubDate"];
      });

      elemTop.sort(function(a,b){
        return d3.ascending(a.element, b.element);
      });

      // filter metadata to match texts in elemTop
      meta.forEach(function(d){
        elemTop.forEach(function(a){
          if(a.filename == d.filename){
            d.isTop = 1;
          }
        });
        if(d.isTop == 1){ }
        else{d.isTop = 0; }
      });

      var metaTop = meta.filter(function(d){
        return d.isTop == 1;
      });

      metaTop.sort(function(a,b){
        if (a.title < b.title){
          return -1;
        }
        else if (a.title > b.title){
          return 1;
        }
        else{ return 0; }
      });

      // var metaTop = meta.filter(function(d){
      //   var i = 0;
      //   elemTop.forEach(function(a){
      //     if(a.filename == d.filename){
      //       i = 1;
      //     }
      //   });
      //   return i == 1;
      // });


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

      dispatch.call("dataLoaded", null, meta, metaTop, metaTopGenre, elemDistTop, elemTop);

  });
};
