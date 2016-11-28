// 상수값
const YEAR_RANGE = 10;
const CALENDAR_ROW = 3;
const CALENDAR_COL = 4;

// 선택 된 날짜 JSON형식 저장 변수
var selectedDayList = "[]";

// 현재 년도 설정
var now = new Date(),
    currYear = now.getYear();

// 요일 선택자
var dayOfWeek = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

// 현재 년도 전처리
if (currYear < 1900) {
    currYear += 1900;
}


// INIT 최초실행
window.onload = function() {
    yearList();
    createCalendar();
    viewCalendar(currYear);
};



/**
 * 함수목록
 */

// 년도 목록 생성
function yearList() {
    var selectYear = document.getElementById("selectYear"),
        yearOption = "";

    for (n = currYear - YEAR_RANGE; n <= currYear + YEAR_RANGE; n++) {
        yearOption += "<option value=" + n + ">" + n;
    }

    selectYear.innerHTML = yearOption;
    selectYear[YEAR_RANGE].selected = true;
}

// 달력 월별 구역 설정
function createCalendar() {
    var calArea = document.getElementById("calendarArea"),
        calMonthHTML = "";

    for (n = 0; n < CALENDAR_ROW; n++) {
        calMonthHTML += "<div class=\"calendarLine\">";

        for (m = 1; m <= CALENDAR_COL; m++) {
            calMonthHTML += "<div class=\"calendar\" id='calendar" + (n * CALENDAR_COL + m) + "'></div>";
        }
        calMonthHTML += "</div>";
    }

    calArea.innerHTML = calMonthHTML;
}

// 월별 달력 일자 생성
function viewCalendar(cy) {
    // 월단위 반복
    for (var month = 1; month <= 12; month++) {
        var calDayHTML = "";

        // 월초 날짜
        var firstDay = new Date(cy + "/" + month + "/1");
        var firstDayOfWeek = firstDay.getDay();

        // 월말 날짜
        var lastDay = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

        // 윤년 처리
        if ((cy % 4 === 0 && cy % 100 != 0) || (cy % 400 === 0)) {
            lastDay[1]++;
        }

        calDayHTML += "<table id=\"cal" + month + "\">";
        calDayHTML += "<thead>";

        // 월별 헤더 표시
        calDayHTML += "<tr><td colspan=\"7\" class=\"monthHeader\">" + month + "</td></tr>";

        calDayHTML += "<tr>";
        // 요일 설정
        for (var i = 0; i < 7; i++) {
            calDayHTML += "<th class=\"dayOfWeek\">" + dayOfWeek[i] + "</th>";
        }
        calDayHTML += "</tr></thead><tbody>";

        // 주단위 반복
        for (var lWeek = 0; lWeek < 6; lWeek++) {
            var day;
            calDayHTML += "<tr>";

            // 일주일치 날짜 설정
            for (lDay = 0; lDay < 7; lDay++) {
                day = (lWeek * 7 + lDay + 1 - firstDayOfWeek);

                if (day > 0 && day <= lastDay[month-1]) {
                    // 날짜가 있는 경우
                    calDayHTML += "<td class=\"day\" id=\"" + month + "-" + day + "\" onclick=\"selectDay(id);\">";
                    calDayHTML += day;
                } else {
                    // 날짜가 없는 경우
                    calDayHTML += "<td>";
                }
                calDayHTML += "</td>";
            }
            calDayHTML += "</tr>";

            // 월별 마지막 일자까지 작성 후 종료
            if (day >= lastDay[month-1]) {
                break;
            }
        }
        calDayHTML += "</tbody></table>";
        document.getElementById("calendar" + month).innerHTML = calDayHTML;
    }

    // JSON Input & parse test
    preSelectDay(selectedDayList);
}

// 년도 직접 선택 시
function changeCalendar() {
    selectYear = document.getElementById("selectYear").value;
    viewCalendar(selectYear);
}

// 화살표로 년도 변경 시
function changeYear(direction) {
    var yearIndex = document.getElementById("selectYear").selectedIndex,
        yearIndex = eval(yearIndex + direction);

    if (yearIndex < 0) {
        yearIndex = 0;
    }

    if (yearIndex > YEAR_RANGE * 2) {
        yearIndex = YEAR_RANGE * 2;
    }

    document.getElementById("selectYear")[yearIndex].selected = true;

    var selectYear = document.getElementById("selectYear").value;
    viewCalendar(selectYear);
}

// 날짜를 클릭 했을 때의 함수, 날짜선택/해제
function selectDay(id) {
    var dayArray = JSON.parse(selectedDayList);
    var selectedDay = new Object();
    var tempJSON;

    if (document.getElementById(id).classList.toggle('selectedDay')) {
        // 날짜 선택
        selectedDay.year = document.getElementById("selectYear").value;
        selectedDay.month = id.split("-")[0];
        selectedDay.day = id.split("-")[1];
        dayArray.push(selectedDay);
    } else {
        // 날짜 선택 해제
        selectedDay.year = document.getElementById("selectYear").value;
        selectedDay.month = id.split("-")[0];
        selectedDay.day = id.split("-")[1];
        dayArray.splice(getArrayIndex(selectedDay), 1);
    }

    selectedDayList = JSON.stringify(dayArray);
}

// 입력 받은 객체가 선택된 날짜 배열 몇번째에 들어있는지 반환
function getArrayIndex(item) {
    var dayArray = JSON.parse(selectedDayList);
    var len = dayArray.length;

    for (var i = 0; i < len; i++) {
        if (dayArray[i].year === item.year && dayArray[i].month === item.month && dayArray[i].day === item.day) {
            return i;
        }
    }

    // 일치항목이 없는 경우 -1 반환
    return -1;
}

// 현재 선택 된 날짜 JSON 표시
function showList() {
    if (selectedDayList === "[]") {
        alert("Please, select days");
    } else {
        alert(selectedDayList);
    }
}

// 기존 선택 된 날짜 달력에 표시 (초기, 년도 이동 시)
function preSelectDay(jsonStr) {
    var dayArray = JSON.parse(jsonStr),
        selectedYear = document.getElementById("selectYear").value;

    for(var i in dayArray) {
        if(selectedYear === dayArray[i].year) {
            var id = dayArray[i].month + "-" + dayArray[i].day;
            document.getElementById(id).classList.toggle('selectedDay');
        }
    }
}


// 올해 년도로 이동
function moveCurrYear() {
    var selectYear = document.getElementById("selectYear");

    selectYear.selected = false;
    selectYear[YEAR_RANGE].selected = true;

    viewCalendar(currYear);
}



// PDF다운로드
function pdfDown() {
/*
    // 이미지 형식으로 변환 후 저장
    html2canvas(document.getElementById("calendarArea"), {
        onrendered: function(canvas) {
            var imgData = canvas.toDataURL("image/png");
            console.log("Report Image URL: "+ imgData);
            pdf.addImage(imgData, "PNG", 10, 10, 190, 95);
            pdf.save("sample-file.pdf");
        }
    });
*/

    var doc = new jsPDF('l', 'pt', 'a4');
    // doc.text("From HTML", 40, 50);
    //doc.text( 40, 50);
    var elem = document.getElementById("cal1");
    var res = doc.autoTableHtmlToJson(elem);

    console.log(res);

    doc.autoTable(res.columns, res.data, {
        startY: 60,
        theme: "grid"
    });

    doc.output('dataurlnewwindow');
}

function tableDown() {

    var personInfoCol = [
        {title: "Item", dataKey: "item"},
        {title: "Data", dataKey: "data"}
    ];
    var personInfoRow = [
        {item: "Name", data: "Daewook"},
        {item: "Job", data: "Engineer"},
        {item: "Position", data: "Software"},
        {item: "Company", data: "Career System"}
    ];

    var columns = [
        {title: "SUN", dataKey: "sun"},
        {title: "MON", dataKey: "mon"},
        {title: "TUE", dataKey: "tue"},
        {title: "WED", dataKey: "wed"},
        {title: "THU", dataKey: "thu"},
        {title: "FRI", dataKey: "fri"},
        {title: "SAT", dataKey: "sat"}
    ];
    var data = [
        {sun: "", mon: "", tue: "", wed: "", thu: "", fri: "1", sat: "2"},
        {sun: "", mon: "", tue: "", wed: "", thu: "", fri: "A", sat: "A"},
        {sun: "3", mon: "4", tue: "5", wed: "6", thu: "7", fri: "8", sat: "9"},
        {sun: "A", mon: "A", tue: "", wed: "", thu: "B", fri: "B", sat: "B"},
        {sun: "10", mon: "11", tue: "12", wed: "13", thu: "14", fri: "15", sat: "16"},
        {sun: "B", mon: "", tue: "", wed: "C", thu: "C", fri: "C", sat: "C"},
        {sun: "17", mon: "18", tue: "19", wed: "20", thu: "21", fri: "22", sat: "23"},
        {sun: "", mon: "", tue: "A", wed: "A", thu: "A", fri: "A", sat: ""},
        {sun: "24", mon: "25", tue: "26", wed: "27", thu: "28", fri: "29", sat: "30"},
        {sun: "", mon: "B", tue: "B", wed: "PV", thu: "B", fri: "", sat: ""},
        {sun: "31", mon: "", tue: "", wed: "", thu: "", fri: "", sat: ""},
        {sun: "C", mon: "", tue: "", wed: "", thu: "", fri: "", sat: ""}
    ];

    var doc = new jsPDF("l", "pt");

    // Document title
    doc.text("2016/07 Shift Table", 30, 40);

    // Person Information
    doc.autoTable(personInfoCol, personInfoRow,{
        theme: "plain",
        startY: 50,
        tableWidth: 250,
        margin: {right: 450},
        drawHeaderRow: function() {
            // Don't draw header row
            return false;
        },
        columnStyles: {
            first_name: {fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold'}
        }
    });


    // Shift Table
    doc.autoTable(columns, data, {
        theme: "grid",
        startY: 140,
        tableWidth: 560,
        margin: {left: 100, right: 100},
        styles: {
            halign: 'center',
            valign: 'middle',
            columnWidth: 80
        },
        headerStyles: {
            fillColor: [79, 129, 189]
        },
        drawHeaderRow: function (row, data) {
            // ShiftTable Year/Month Header add
            doc.setFontStyle('bold');
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.setFillColor(79, 129, 189);
            doc.rect(data.settings.margin.left, data.cursor.y, data.table.width, 20, 'F');
            doc.autoTableText("2016/07", data.settings.margin.left + data.table.width / 2, data.cursor.y + row.height / 2, {
                halign: 'center',
                valign: 'middle'
            });
            
            data.cursor.y += 20;
        },
        drawRow: function (row, data) {
            if (row.index % 2 === 1 && row.index > 0) {
                row.styles.fillColor = [186, 245, 234];
                data.row.height = 40;
            }
        },
        createdCell: function (cell, data) {
            if (data.row.index % 2 === 1 && data.row.index > 0) {
                cell.styles.fillColor = [233, 237, 244];
            } else {
                cell.styles.fillColor = [208, 216, 232];
            }
            
            if (cell.text === "PV") {
                cell.styles.textColor = [255, 0, 0];
            }
        }
    });
    
    
    var shiftDesc  = "A : Early Shift\n";
        shiftDesc += "    (8:00 - 17:00)\n";
        shiftDesc += "\n";
        shiftDesc += "B : Late Shift\n";
        shiftDesc += "    (HH:mm - HH:mm)\n";
        shiftDesc += "\n";
        shiftDesc += "C : Night Shift\n";
        shiftDesc += "    (HH:mm - HH:mm)\n";
        shiftDesc += "\n";
        shiftDesc += "PV: Paid Vacation\n";
        shiftDesc += "\n";
        shiftDesc += "BT: Business trip";

    // Shift description
    doc.setFontSize(10);
    doc.setFont("helvetica");
    doc.autoTableText(
        shiftDesc,
        690,
        470,
        {halign: 'left', valign: 'middle'}
    );
    

    // PDF View or Download
    doc.output('dataurlnewwindow');
    //doc.save("table.pdf");
}




/* **********************************
function callme() {
    var table = tableToJson( $("#cal1").get(0) );
    var doc = new jsPDF("l", "pt", "a4", true);

    $.each(table, function(i, row) {
        $.each(row, function(j, cell) {
            doc.cell(1, 10, 90, 20, cell, i);
        });
    });

    doc.save('Safaa.pdf');
}

function tableToJson(table) {
    var data = [];

    // first row needs to be headers
    var headers = [];
    for (var i = 0; i < table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
    }
    data.push(headers);
    // go through cells
    for (var i=1; i<table.rows.length; i++) {
        var tableRow = table.rows[i];
        var rowData = {};

        for (var j=0; j<tableRow.cells.length; j++) {
            rowData[ headers[j] ] = tableRow.cells[j].innerHTML;
        }
        data.push(rowData);
    }

    console.log(data);

    return data;
}
************************************* */