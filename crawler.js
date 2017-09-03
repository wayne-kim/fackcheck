var Nightmare = require('nightmare');
var nightmare0 = Nightmare({ show: false });
var nightmare1 = Nightmare({ show: true });

let myURL = "https://search.naver.com/search.naver?where=news&query="
myURL = myURL + "%2B국정화 %2B교과서";
myURL = myURL + "&ie=utf8&sm=tab_opt&sort=0&photo=0&field=0&reporter_article=&pd=3&ds="
myURL = myURL + "2015.10.08"
myURL = myURL + "&de="
myURL = myURL + "2015.10.15"
myURL = myURL + "&docid=&nso=so%3Ar%2Cp%3Afrom20151001to20151031%2Ca%3Aall&mynews=0&mson=0&refresh_start=0&related=0"

let dates = [];
let number = 1;

//작업량 가져오기
function getCount(){
  nightmare0
  .goto(myURL)
  .evaluate(function () {
    let info = document.querySelector('.title_desc.all_my');
    let count = info.innerText.split("/")[1].match(/\d+/g).join("");
    let url = document.querySelectorAll(".paging>a")[0].href;
    let result = [count,url];
    return result;
  })
  .end()
  .then(function (result){
    let count = result[0];
    let url = result[1];
    console.log(count, url);
    getDate(count, url);
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });
}
getCount();

//게시물 날짜 가져오기
function getDate(count, url){
  nightmare1
  .goto(url)
  .evaluate(function () {
    let items = document.querySelectorAll('.txt_inline');
    let infos = [];
    for(var item of items){
      let info = item.innerText;
      infos.push(info.split(" ")[2]);
    }
    return infos;
  })
  .then(function (infos) {
    for(let info of infos){
      dates.push(info);
    }
    // console.log(url);
    let data = url.split("start=");
    number = number + 10;
    url = data[0] + "start=" + number;
    // console.log(url);
    if(Number(count) > dates.length){
      getDate(count, url)
    }else{
      fs.writeFile('국정화 교과서.txt', dates.join(","), (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
      });
    }
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });
}
