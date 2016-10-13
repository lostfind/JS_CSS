$(function() {

	var repeatCnt = 15;
	$targetItem = $('#sample01, #sample03, #sample07');
	$targetItem.addClass('newItem');

	hikaru($('.newItem'), repeatCnt);

});

/* 一定時間光ってから止まる 
 *  파라미터 설명
 *   $target : 대상DOM
 *   repeatCnt : 반복횟수
*/
function hikaru($target, repeatCnt) {

	const fadeTime = 500
		, intevalTime = 1500;

	playTwinkle = setInterval(function() {
		$target.fadeOut(fadeTime).fadeIn(fadeTime);
	}, intevalTime);

	setTimeout(function() {
		clearInterval(playTwinkle);
	}, intevalTime * repeatCnt);
}
