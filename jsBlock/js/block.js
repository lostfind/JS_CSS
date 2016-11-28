const AUTO_SEC = 1000;

var pos = [0, 0]
  , brick;

// 좌표의 DOM반환
function getBlock(x, y) {
  return document.querySelector("[data-y=\"" + y + "\"] [data-x=\"" + x + "\"]");
}

// 화면에서 블럭 지우기
function clearBlock() {
  document.querySelector('.now').classList.remove("now");  
}

// 키보드 입력 리스너
window.addEventListener("keydown", keyDown = function(e) {
  // down arrow
  if (e.keyCode == 40) {
    pos[1] = (pos[1] + 1) % 20;
  }
  
  // up arrow
  if (e.keyCode == 38) {
    if(--pos[1] < 0) {
      pos[1] = 19;
    }
  }
  
  // right arrow
  if (e.keyCode == 39) {
    pos[0] = (pos[0] + 1) % 10;
  }
  
  // left arrow
  if (e.keyCode == 37) {
    if(--pos[0] < 0) {
      pos[0] = 9;
    }
  }

  clearBlock();
  viewBlock();
});

// 좌표(pos)에 블럭 표시
function viewBlock() {
  brick = getBlock(pos[0], pos[1]);
  brick.classList.add("now");
}

//자동으로 한칸씩 내리기
function startTimer() {
  setTimeout(function() {
    keyDown({keyCode: 40});
    startTimer();
  }, AUTO_SEC);
}

//init
viewBlock();
startTimer();