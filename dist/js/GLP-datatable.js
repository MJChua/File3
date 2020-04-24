/*! GLP Console CMS */
'use strict';

// dataTable 預設值
$.extend(true, $.fn.dataTable.defaults, {
  lengthChange: false,
  autoWidth: false,
  order: [],
  // 關掉初始排序
  pageLength: 15,
  initComplete: function initComplete() {
    // 初始化完成後觸發事件
    var api = this.api(); // 讓過長的table使用捲軸移動

    $(this).wrap('<div class="table-responsive" />'); // 配合UI 隱藏預設的搜尋

    $(this).closest('.dataTables_wrapper').find('.row').each(function (index) {
      if (index === 0) $(this).hide();
    }); // 配合UI 設定自製的搜尋

    $('#DataTableSearch').on('keyup', function () {
      api.search(this.value).draw();
    }); // 配合UI 搜尋點擊往右展開

    $('.glp-dropRight-click').on('click', function () {
      var _this = $(this);

      var _dropRight = _this.closest('.glp-dropRight');

      if (_dropRight.hasClass('open')) {
        // 關閉搜尋 清除值
        $('#DataTableSearch').val('');
        api.search('').draw();
        $('.glp-input-clear').hide();
      } else {
        _dropRight.find('.glp-dropRight-input').focus();
      }

      _this.closest('.glp-dropRight').toggleClass('open');
    }); //配合UI 顯示/隱藏清除按鈕 //

    $('.glp-input').on('input', function () {
      var _this = $(this);

      if (_this.val().length > 0) {
        _this.next().find('.glp-input-clear').show();
      } else {
        _this.next().find('.glp-input-clear').hide();
      }
    });
    $('.glp-input-clear').on('click', function () {
      var _this = $(this);

      api.search('').draw();

      _this.parent().prev('.glp-input').val('');

      _this.hide();
    }); //./ 配合UI 顯示/隱藏清除按鈕 //
  },
  drawCallback: function drawCallback() {
    // 繪製完成後觸發事件(包含換頁)
    var api = this.api(); // 如果只有一頁，隱藏分頁按鈕

    if (api.page.len() > 1) {
      $(this).closest('.dataTables_wrapper').find('.dataTables_paginate').hide();
    }
  }
});

function isDataTable(ele) {
  // 檢查DataTable是否已初始化
  return $.fn.DataTable.isDataTable(ele);
}

function initDataTable(ele, setting) {
  if (setting === void 0) {
    setting = '';
  }

  if ($(ele).length === 0) {
    return;
  } // 渲染DataTable


  var dataTable; // 檢查DataTable是否已初始化

  if (isDataTable(ele)) {
    //已初始化的砍掉後重新繪製
    dataTable = $(ele).DataTable().destroy();
  }

  dataTable = $(ele).DataTable(setting);
  return dataTable;
}

initDataTable('#StageGameList');
