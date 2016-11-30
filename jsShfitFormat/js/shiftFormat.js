const DAY_SHIFT   = ["", "F"];
const TWO_SHIFT   = ["", "D", "E"];
const THREE_SHIFT = ["", "A", "B", "C"];

const MAX_TEAM = 26;
const MAX_DAYS = 30;
const HEAD_ROWS = 2;

var selectedPattern = "day";
var shiftPattern = document.getElementById("shiftPattern");

// 교대 패턴 변경 시
shiftPattern.onchange = function () {
    selectedPattern = this.value;
    clearShift();
};

// window.onload = function () {
    // init();
// };

function init() {

    if ( !initFlg ) {
        var colPlusElem = document.getElementById("colButton").children[0].children[0],
            rowPlusElem = document.getElementById("rowButton").children[0].children[0];
        var i;

        for ( i = 1; i < countDay; i++ ) {
            addCol(colPlusElem);
        }

        for ( i = 1; i < countTeam; i++ ) {
            addRow(rowPlusElem);
        }

        initFlg = true;
    }

}


// 교대 타입 칸 비움
function clearShift() {
    var shiftTypes = document.getElementsByClassName("shiftType");

    for ( var i = 0; i < shiftTypes.length; i++ ) {
        shiftTypes[i].textContent = "";
    }
}

// 교대 타입 칸 클릭시
function clickShift(id) {
    var selectedCell = document.getElementById(id);
    var num;

    if ( selectedPattern === "day" ) {
        num = DAY_SHIFT.indexOf(selectedCell.textContent);
        num = (++num % 2);
        selectedCell.textContent = DAY_SHIFT[num];
    } else if ( selectedPattern === "two" ) {
        num = TWO_SHIFT.indexOf(selectedCell.textContent);
        num = (++num % 3);
        selectedCell.textContent = TWO_SHIFT[num];
    } else if ( selectedPattern === "three" ) {
        num = THREE_SHIFT.indexOf(selectedCell.textContent);
        num = (++num % 4);
        selectedCell.textContent = THREE_SHIFT[num];
    }
}


/* *************************
 *  Table add/Remove (row, col)
 ************************* */
// 열 추가
function addCol(item) {
    var $colButton = $(item.parentElement);
    var shiftTable = document.getElementById("shiftTable");
    var colLength  = shiftTable.rows[HEAD_ROWS].cells.length;
    var rowLength  = shiftTable.rows.length;
    var daysHeader = document.getElementById("daysHeader");
    var colId      = ( maxIdVal("col") + 1 );
    var objCell;
    var rowId;

    if ( colLength <= MAX_DAYS ) {
        objCell = shiftTable.tHead.rows[1].insertCell( $colButton.index() );
        objCell.className = "shiftDay";

        for ( var i = HEAD_ROWS; i < rowLength; i++ ) {
            objCell = shiftTable.rows[i].insertCell( $colButton.index() + 1 );
            rowId = shiftTable.rows[i].lastElementChild.id.split("-")[0];
            objCell.className = "shiftType";
            objCell.id = rowId + "-" + colId;
            objCell.setAttribute("onclick", "clickShift(id)");
            objCell.innerHTML = "";
        }

        // daysHeader colspan set
        daysHeader.setAttribute("colspan", shiftTable.rows[1].cells.length);

        addPlusMinus("col");
        namingDays();

    }
}

// 열 삭제 버튼
function removeCol(item) {
    var $colButton = $(item.parentElement),
        shiftTable = document.getElementById("shiftTable"),
        rowLength  = shiftTable.rows.length;

    if ( shiftTable.tHead.rows[1].cells.length > 1 ) {
        shiftTable.tHead.rows[1].deleteCell( $colButton.index() );

        for ( var i = HEAD_ROWS; i < rowLength; i++ ) {
            shiftTable.rows[i].deleteCell( $colButton.index() + 1 );
        }
    }

    removePlusMinus("col");
    namingDays();
}


// 행 추가
function addRow(item) {
    var $rowButton = $(item.parentElement);
    var shiftTable = document.getElementById("shiftTable");
    var colLength  = shiftTable.rows[HEAD_ROWS].cells.length;
    var rowLength  = shiftTable.rows.length;
    var objRow     = shiftTable.insertRow( $rowButton.index() + 2 );
    var rowId      = maxIdVal("row") + 1;
    var objCell;

    if ( rowLength < MAX_TEAM + HEAD_ROWS ) {
        objCell = objRow.insertCell(0);
        objCell.className = "teamName";

        for ( var i = 1; i < colLength; i++ ) {
            objCell = objRow.insertCell(i);
            objCell.className = "shiftType";
            objCell.id = rowId + "-" + i;
            objCell.setAttribute("onclick", "clickShift(id)");
            objCell.innerHTML = "";
        }

        addPlusMinus("row");
        namingTeam();
    }
}

// 행 삭제
function removeRow(item) {
    var $rowButton = $(item.parentElement);
    var shiftTable = document.getElementById("shiftTable");

    if ( shiftTable.rows.length > HEAD_ROWS + 1 ) {
        shiftTable.deleteRow( $rowButton.index() + HEAD_ROWS );
    }

    removePlusMinus("row");
    namingTeam();
}


/* *************************
 *  Table Header Rename (row, col)
 ************************* */
// Shift Team 명칭 부여
function namingTeam() {
    var teamList = document.getElementsByClassName("teamName");
    var len      = teamList.length;

    for ( var i = 0; i < len; i++ ) {
        teamList[i].innerText = "Team " + String.fromCharCode( 65 + i );
    }
}

// 일자 헤더 재정렬
function namingDays() {
    var dayList = document.getElementsByClassName("shiftDay"),
        len     = dayList.length;

    for ( var i = 0; i < len; i++ ) {
        dayList[i].innerText = ( i + 1 );
    }
}


/* *************************
 *  ( + - ) Button Function
 ************************* */
// + - 버튼 추가
function addPlusMinus(division) {
    var buttonElem,
        itm,
        cln;

    if ( division === "row" ) {
        buttonElem = document.getElementById("rowButton");
        itm = buttonElem.firstElementChild;
        cln = itm.cloneNode(true);

        buttonElem.appendChild(cln);

    } else if ( division === "col" ) {
        buttonElem = document.getElementById("colButton");
        itm = buttonElem.firstElementChild;
        cln = itm.cloneNode(true);

        buttonElem.appendChild(cln);
    }
}

// + - 버튼 삭제
function removePlusMinus(division) {
    var buttonElem;

    if ( division === "row" ) {
        buttonElem = document.getElementById("rowButton");
    } else if ( division === "col" ) {
        buttonElem = document.getElementById("colButton");
    }

    if ( buttonElem !== undefined && buttonElem.children.length > 1) {
        buttonElem.removeChild(buttonElem.lastElementChild);
    }
}


// ID 최대치 반환
function maxIdVal( division ) {
    var shiftTypes = document.getElementsByClassName("shiftType");
    var len        = shiftTypes.length;
    var shiftTypeId,
        idArray = [];

    if ( division === "row" ) {
        for ( var i = 0; i < len; i++ ) {
            shiftTypeId = shiftTypes[i].id;
            idArray.push(shiftTypeId.split("-")[0]);
        }
        return Math.max.apply(null, idArray);

    } else if ( division === "col" ) {
        for ( var i = 0; i < len; i++ ) {
            shiftTypeId = shiftTypes[i].id;
            idArray.push(shiftTypeId.split("-")[1]);
        }
        return Math.max.apply(null, idArray);
    }
}

function loadShift() {
    var shiftData = JSON.parse(shiftInfo).data;
    var len = shiftData.length;
    var i;
    var shiftTeamArray = [],
        shiftDayArray  = [];
    var teamList  = document.getElementsByClassName("teamName"),
        dayList   = document.getElementsByClassName("shiftDay"),
        shiftList = document.getElementsByClassName("shiftType");

    var teamListLen  = teamList.length,
        dayListLen   = dayList.length;

    clearShift();

    for ( i = 0; i < teamListLen; i++ ) {
        shiftTeamArray.push(teamList[i].innerText);
    }

    for ( i = 0; i < dayListLen; i++ ) {
        shiftDayArray.push(dayList[i].innerText);
    }


    for ( i = 0; i < len; i++ ) {
        var teamIdx = shiftTeamArray.indexOf(shiftData[i].team);
        var dayIdx = shiftDayArray.indexOf(shiftData[i].days);
        var dataIdx = ( Math.floor(teamIdx * dayListLen) ) + dayIdx;

        shiftList[dataIdx].innerText = shiftData[i].shift;
    }

}

// 저장 버튼 클릭
function saveShift() {
    var shiftTeamArray = [],
        shiftDayArray  = [];
    var teamList  = document.getElementsByClassName("teamName"),
        dayList   = document.getElementsByClassName("shiftDay"),
        shiftList = document.getElementsByClassName("shiftType");
    var shiftListLen = shiftList.length,
        teamListLen  = teamList.length,
        dayListLen   = dayList.length;
    var shiftObj = {},
        shiftArr = [],
        totalObj = {},
        shiftListJSON;

    /* 공통 정보 넣기 위한 처리 TEST START */
    /*
    var comObj = {},
        comArr = [];

    comObj.shiftPattern = "3shift";
    comObj.calPattern = "365day";
    comArr.push(comObj);

    totalObj.title = comObj;
    */
    /* 공통 정보 넣기 위한 처리 TEST END */


    for ( var i = 0; i < teamListLen; i++ ) {
        shiftTeamArray.push(teamList[i].innerText);
    }

    for ( var i = 0; i < dayListLen; i++ ) {
        shiftDayArray.push(dayList[i].innerText);
    }

    for ( var i = 0; i < shiftListLen; i++ ) {

        if ( shiftList[i].innerText !== "" ) {
            shiftObj = {};
            shiftObj.team = shiftTeamArray[Math.floor(i / dayListLen)];
            shiftObj.days = shiftDayArray[(i % dayListLen)];
            shiftObj.shift = shiftList[i].innerText;

            shiftArr.push(shiftObj);
        }
    }

    totalObj.data = shiftArr;
    shiftListJSON = JSON.stringify(totalObj);

    // TEST
    console.log(shiftListJSON);
}
