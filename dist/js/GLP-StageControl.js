/*! GLP Console CMS */
'use strict';

function selectBoxShow() {
  if ($('#selectPrizeInentoryShow').hasClass('active')) {
    $('.selectPrizeInentoryShow').show();
  } else {
    $('.selectPrizeInentoryShow').hide();
  }

  if ($('#NewPrizeShow').hasClass('active')) {
    $('.NewPrizeShow').show();
  } else {
    $('.NewPrizeShow').hide();
  }
}

function startDrawShow() {
  if ($('#StartDraw').hasClass('active')) {
    $('.StartDrawShow').show();
  } else {
    $('.StartDrawShow').hide();
  }
}

$('.glp-dropdownSelect').on('click', '.dropdown-item', function () {
  var clickedInfo = $(this).text();
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
  $(this).closest('.glp-dropdownSelect').find('[data-toggle="dropdown"] span').text(clickedInfo);
  selectBoxShow();
  startDrawShow();
});
