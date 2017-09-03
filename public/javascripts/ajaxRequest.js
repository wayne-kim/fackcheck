//Ajax
$("#check").click(function () {
  let a = $("#key1").val();
  let b = $("#key2").val();
  let c = $("#start-date").val();
  let d = $("#end-date").val();
  let getURL = `/crawler?key1=${a}&key2=${b}&startDate=${c}&endDate=${d}`;

  if(a != "" && b != "" && c != "" && d!=""){
    $('#myModal').modal('show');
    $.ajax({
      type: "GET",
      url: getURL,
      success: function (result) {
        console.log(result);
        result = result.replace(/]\[/g, '/');
        result = result.replace(/]/g, '');
        result = result.replace(/\[/g, '');
        result = result.replace(/},/g, '}/');
        result = result.split('/');
        let keyword1 = [];
        let keyword2 = [];
        for (var data of result) {
          data = JSON.parse(data);
          if (data.keyword == "키워드1") {
            keyword1.push(data);
          } else {
            keyword2.push(data);
          }
        }
        //정렬
        keyword1.sort(function (a, b) {
          if (a.date > b.date) return 1;
          else return -1;
        })
        keyword2.sort(function (a, b) {
          if (a.date > b.date) return 1;
          else return -1;
        })
  
        //형식화
        keyword1TSV = "date\tclose\n";
        for (var data of keyword1) {
          data.date = makeD3DateFormat(data.date);
          keyword1TSV = keyword1TSV + data.date + "\t" + data.count + "\n"
        }
  
        keyword2TSV = "date\tclose\n";
        for (var data of keyword2) {
          data.date = makeD3DateFormat(data.date);
          keyword2TSV = keyword2TSV + data.date + "\t" + data.count + "\n"
        }
  
        //세팅
        d3.select("svg").remove();
        $(".img-border").html('<svg class="img-fluid" width="1300" height="500"></svg>');
        $(".img-fluid").attr("heigth", $("body").height() - 50);
        $(".img-fluid").attr("width", $("body").width() - 50);
  
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
          if(big1 < data.close) big1 = data.close;
        }
        keyword2datas = d3.tsvParse(keyword2TSV);
        for (var data of keyword2datas) {
          data.date = parseTime(data.date);
          data.close = +data.close;
        }
        let big2 = 0;
        for (var data of keyword2datas) {
          if(big2 < data.close) big2 = data.close;
        }
  
        //그래프 틀 그리기
        if(big1 >= big2){
          x.domain(d3.extent(keyword1datas, function (d) {
            return d.date;
          }));
          y.domain(d3.extent(keyword1datas, function (d) { return d.close; }));
        }else {
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
  
        $('#myModal').modal('hide');
      }
    });
  }else {
    alert("데이터를 입력해주세요.");
  }
  

  function makeD3DateFormat(date) {
    let dates = date.split(".");
    dates[1] = dates[1].replace("01", "Jan");
    dates[1] = dates[1].replace("02", "Feb");
    dates[1] = dates[1].replace("03", "Mar");
    dates[1] = dates[1].replace("04", "Apr");
    dates[1] = dates[1].replace("05", "May");
    dates[1] = dates[1].replace("06", "Jun");
    dates[1] = dates[1].replace("07", "Jul");
    dates[1] = dates[1].replace("08", "Aug");
    dates[1] = dates[1].replace("09", "Sep");
    dates[1] = dates[1].replace("10", "Oct");
    dates[1] = dates[1].replace("11", "Nov");
    dates[1] = dates[1].replace("12", "Dec");
    return [Number(dates[2]), dates[1], dates[0][2] + dates[0][3]].join("-");
  }
})