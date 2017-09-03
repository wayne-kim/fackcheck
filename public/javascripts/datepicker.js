//기간 선택
$.fn.datepicker.dates['ko'] = {
  days: ["일요일", "월요일y", "화요일", "수요일", "목요일", "금요일", "토요일"],
  daysShort: ["일", "월", "화", "수", "목", "금", "토"],
  daysMin: ["일", "월", "화", "수", "목", "금", "토"],
  months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  today: "오늘",
  clear: "지우기",
  format: "yyyy.mm.dd",
  titleFormat: "yyyy MM ",
  weekStart: 0
};

$('.input-daterange input').each(function () {
  $(this).datepicker({
    language: 'ko',
    disableTouchKeyboard: true,
    autoclose: true,
    keepEmptyValues: true,
    orientation: "top",
    endDate: new Date(),
  });
});

$('#start-date').datepicker()
  .on("changeDate", function (arg) {
    let endDate = new Date(arg.target.value);
    endDate.setDate(endDate.getDate() + 7);
    $('#end-date').datepicker('setEndDate', endDate);
    let startDate = new Date(arg.target.value);
    $('#end-date').datepicker('setStartDate', startDate);
    $('#end-date').removeAttr("disabled");
  });