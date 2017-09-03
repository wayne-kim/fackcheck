let searchBefore = true;

function graph() {
  var svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseTime = d3.timeParse("%d-%b-%y");

  var x = d3.scaleTime()
    .rangeRound([0, width]);
  var y = d3.scaleLinear()
    .rangeRound([height, 0]);
  var line = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.close); });

  d3.tsv("./data/data.tsv", function (d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
  }, function (error, data) {
    if (error) throw error;
    x.domain(d3.extent(data, function (d) {
      return d.date;
    }));
    y.domain(d3.extent(data, function (d) { return d.close; }));
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .select(".domain")
      .remove();

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("기사수");

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

  });

  d3.tsv("./data/data2.tsv", function (d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
  }, function (error, data) {
    if (error) throw error;
    // x.domain(d3.extent(data, function (d) {
    //   return d.date;
    // }));
    y.domain(d3.extent(data, function (d) { return d.close; }));

    // g.append("g")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(d3.axisBottom(x))
    //   .select(".domain")
    //   .remove();

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("기사수");

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  });
}
function resize() {
  d3.select("svg").remove();
  $(".img-border").html('<svg class="img-fluid" width="1300" height="500"></svg>');
  $(".img-fluid").attr("heigth", $("body").height() - 50);
  $(".img-fluid").attr("width", $("body").width() - 50);
  if (searchBefore) graph();
  else {
    var svg = d3.select("svg"),
      margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleTime()
      .rangeRound([0, width]);

    var y = d3.scaleLinear()
      .rangeRound([height, 0]);

    var line = d3.line()
      .x(function (d) { return x(d.date); })
      .y(function (d) { return y(d.close); });

    //키워드1 그리기
    keyword1datas = d3.tsvParse(keyword1TSV);
    for (var data of keyword1datas) {
      data.date = parseTime(data.date);
      data.close = +data.close;
    }
    let big1 = 0;
    for (var data of keyword1datas) {
      if (big1 < data.close) big1 = data.close;
    }
    keyword2datas = d3.tsvParse(keyword2TSV);
    for (var data of keyword2datas) {
      data.date = parseTime(data.date);
      data.close = +data.close;
    }
    let big2 = 0;
    for (var data of keyword2datas) {
      if (big2 < data.close) big2 = data.close;
    }

    //그래프 틀 그리기
    if (big1 >= big2) {
      x.domain(d3.extent(keyword1datas, function (d) {
        return d.date;
      }));
      y.domain(d3.extent(keyword1datas, function (d) { return d.close; }));
    } else {
      x.domain(d3.extent(keyword2datas, function (d) {
        return d.date;
      }));
      y.domain(d3.extent(keyword2datas, function (d) { return d.close; }));
    }

    //키워드1 그리기
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .select(".domain")
      .remove();

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("기사수");

    g.append("path")
      .datum(keyword1datas)
      .attr("fill", "none")
      .attr("stroke", "RED")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    //키워드2 그리기
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .select(".domain")
      .remove();

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("기사수");

    g.append("path")
      .datum(keyword2datas)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

  }
}
resize()