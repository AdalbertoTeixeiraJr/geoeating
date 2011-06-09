$(document).ready(function() {	
	$('.window .close').click(function (e) {
		e.preventDefault();
		closeDialog();
	});		
	
	$('#mask').click(function () {
		$(this).hide();
		$('.window').hide();
	});
});

function closeDialog() {
	$('#mask').hide();
	$('.window').hide();
}

function openDialog(id,width,height) {
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();

	$('#mask').css({'width':maskWidth,'height':maskHeight});
	$('#mask').fadeIn(1000);
	$('#mask').fadeTo("slow",0.8);	

	//Get the window height and width
	var winH = $(window).height();
	var winW = $(window).width();

	$(id).css('width', width);
	$(id).css('height', height);
	$(id).css('top',  winH/2-$(id).height()/2);
	$(id).css('left', winW/2-$(id).width()/2);
	$(id).fadeIn(2000); 
}