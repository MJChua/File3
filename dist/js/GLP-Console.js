/*! GLP Console CMS */
'use strict';

$(function () {
  //  === 插件 === //
  // plugins DataTable
  try {
    var tableFunction = {
      search: function search(eleArray, SearchInfo) {
        for (var i = 0; i < eleArray.length; i++) {
          eleArray[i].search(SearchInfo).draw();
        }
      },
      clearSearch: function clearSearch(eleArray) {
        for (var i = 0; i < eleArray.length; i++) {
          eleArray[i].search('').draw();
        }
      },
      copyChildInfo: function copyChildInfo(eleArray) {
        for (var i = 0; i < eleArray.length; i++) {
          eleArray[i].rows().every(function () {
            var qty = this.data().length;
            var childInfo = this.data()[qty - 1];
            this.child(childInfo);
          });
        }
      },
      childShow: function childShow(eleArray) {
        var _loop = function _loop(i) {
          $('.glp-childShow').on('click', function (event) {
            event.stopPropagation();
            var tr = $(this).closest('tr');
            var child = eleArray[i].row(tr).child;

            if (child.isShown()) {
              child.hide();
            } else {
              child.show();
              changeStatus();
            }
          });
        };

        for (var i = 0; i < eleArray.length; i++) {
          _loop(i);
        }
      }
    };
    var eventPrizeList = $('#eventPrizeList').DataTable({
      lengthChange: false,
      autoWidth: false,
      order: [],
      columnDefs: [{
        targets: [6],
        visible: false
      }, {
        targets: [0, 2, 3, 4, 5],
        orderable: false
      }],
      initComplete: function initComplete() {
        $(this).wrap('<div class="table-responsive" />');
      }
    }); // const stageGameList = $('#StageGameList').DataTable({
    //   lengthChange: false,
    //   autoWidth: false,
    //   order: [],
    //   displayLength: 15,
    //   columnDefs: [
    //     {
    //       targets: [3],
    //       orderable: false
    //     }
    //   ],
    //   initComplete () {
    //     $(this).wrap('<div class="table-responsive" />')
    //   }
    // })

    var groupColumn = 0;
    var patronActivation = $('#PatronActivation').DataTable({
      lengthChange: false,
      autoWidth: false,
      order: [],
      displayLength: 15,
      columnDefs: [{
        targets: [2, 4],
        orderable: false
      }, {
        visible: false,
        targets: groupColumn
      }],
      drawCallback: function drawCallback(settings) {
        var api = this.api();
        var rows = api.rows({
          page: 'current'
        }).nodes();
        var last = null;
        api.column(groupColumn, {
          page: 'current'
        }).data().each(function (group, i) {
          if (last !== group) {
            $(rows).eq(i).before("<tr class=\"glp-table-group\"><td colspan=\"8\">Event Code: <b>" + group + "</b></td></tr>");
            last = group;
          }
        });
      },
      infoCallback: function infoCallback() {
        $(this).wrap('<div class="table-responsive" />');
      }
    });
    var stageList = $('#StageList').DataTable({
      lengthChange: false,
      autoWidth: false,
      displayLength: 5,
      order: [],
      columnDefs: [{
        targets: [3],
        orderable: false
      }, {
        visible: false,
        targets: [0]
      }],
      initComplete: function initComplete() {
        $(this).wrap('<div class="table-responsive" />');
      }
    });
    var memberList = $('#MemberList').DataTable({
      lengthChange: false,
      autoWidth: false,
      ordering: false,
      paging: false,
      scrollY: 150,
      scrollCollapse: true,
      initComplete: function initComplete() {
        $(this).find('thead').hide();
      }
    });
    var memberList2 = $('#MemberList2').DataTable({
      lengthChange: false,
      autoWidth: false,
      ordering: false,
      paging: false,
      scrollY: 250,
      scrollCollapse: true,
      initComplete: function initComplete() {
        $(this).find('thead').hide();
      }
    }); // 使用 dataTable 的實體

    var dataTableEleSet = [eventPrizeList]; // 使用"子展開"的dataTable實體

    var childEleSet = [eventPrizeList];
    tableFunction.copyChildInfo(childEleSet);
    tableFunction.childShow(childEleSet);
    $('.CategorySelect').on('click', '.dropdown-item', function () {
      var clickedInfo = $(this).text();

      if (clickedInfo !== 'ALL') {
        eventPrizeList.columns(4).search(clickedInfo).draw();
      } else {
        eventPrizeList.columns(4).search('').draw();
      }
    }); // $('#DataTableSearch').on('keyup', function () {
    //   tableFunction.search(dataTableEleSet, this.value)
    // })

    $('#PatronActivationSearch').on('keyup', function () {
      tableFunction.search([patronActivation], this.value);
    });
    $('#MemberSearch').on('keyup', function () {
      tableFunction.search([memberList, memberList2], this.value);
    });
    $('#StageListSearch').on('keyup', function () {
      tableFunction.search([stageList], this.value);
    }); // $('.glp-input-clear').on('click', () => {
    //   tableFunction.clearSearch(dataTableEleSet)
    // })
  } catch (err) {
    console.log(err.name + ": " + err.message);
  } // plugins tooltip


  try {
    if (!isMobile()) {
      $('[data-toggle="tooltip"]').tooltip();
    }
  } catch (err) {
    console.log(err.name + ": " + err.message);
  } // plugins sweetalert2 彈跳提示視窗


  function glpDelete() {
    try {
      var _glpDelete = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success Swal-btn',
          cancelButton: 'btn btn-danger Swal-btn'
        },
        buttonsStyling: false
      });

      _glpDelete.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then(function (result) {
        if (result.value) {
          _glpDelete.fire('Deleted!', 'Your file has been deleted.', 'success');
        } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel) {
          _glpDelete.fire('Cancelled', 'Your file is safe :)', 'error');
        }
      });
    } catch (err) {
      console.log(err.name + ": " + err.message);
    }
  }

  $('.swal-delete').on('click', function (event) {
    event.stopPropagation();
    glpDelete();
  }); // boostrapt 4 modal

  $('.glp-btn-group').on('click', '[data-toggleGLP="modal"]', function (event) {
    event.stopPropagation();
    var modalID = $(this).data('target');
    $(modalID).modal('toggle');
  });
  $('.glp-btn-group').on('click', 'a', function (event) {
    event.stopPropagation();
  }); // plugins select2 下拉選單

  try {
    $('.select2bs4').select2({
      minimumResultsForSearch: Infinity
    });
  } catch (err) {
    console.log(err.name + ": " + err.message);
  } // plugins bootstrap-fileinput 檔案上傳


  try {
    $('.pictureFileinput').fileinput({
      allowedFileExtensions: ['jpg', 'png', 'jpeg'],
      // 接收的檔案字尾
      showUpload: false // 是否顯示上傳按鈕

    });
  } catch (err) {
    console.log(err.name + ": " + err.message);
  } // plugins Date range picker


  try {
    $('.dateRangePicker').daterangepicker({
      locale: {
        format: 'YYYY/MM/DD'
      }
    });
    $('.datePicker').daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      locale: {
        format: 'YYYY/MM/DD'
      }
    });
    $('.timePicker').daterangepicker({
      timePicker: true,
      singleDatePicker: true,
      timePicker24Hour: true,
      timePickerIncrement: 1,
      timePickerSeconds: true,
      locale: {
        format: 'HH:mm:ss'
      }
    }).on('show.daterangepicker', function (ev, picker) {
      picker.container.find('.calendar-table').hide();
    });
  } catch (err) {
    console.log(err.name + ": " + err.message);
  } //  === ./插件 === //
  //  === GLP 共用事件 === //
  // 右側滑出視窗


  $('.glp-controlSidebarShow').on('click', function (event) {
    event.stopPropagation();
    var eventCode = $(this).data('eventCode');
    $('.glp-control-sidebar').each(function () {
      if ($(this).data('eventCode') !== eventCode) {
        $(this).removeClass('open');
      }
    });
    $(".glp-control-sidebar[data-event-code=\"" + eventCode + "\"]").toggleClass('open');
  }); // // 點擊往右展開(搜尋)
  // $('.glp-dropRight-click').on('click', function () {
  //   const _this = $(this)
  //   const _dropRight = _this.closest('.glp-dropRight')
  //   if (_dropRight.hasClass('open')) {
  //     _dropRight.find('.glp-dropRight-input').val('')
  //   } else {
  //     _dropRight.find('.glp-dropRight-input').focus()
  //   }
  //   _this.closest('.glp-dropRight').toggleClass('open')
  // })
  // // __輸入框 清除按鈕__ //
  // $('.glp-input').on('input', function () {
  //   const _this = $(this)
  //   if (_this.val().length > 0) {
  //     _this.next().find('.glp-input-clear').show()
  //   } else {
  //     _this.next().find('.glp-input-clear').hide()
  //   }
  // })
  // $('.glp-input-clear').on('click', function () {
  //   const _this = $(this)
  //   _this.parent().prev('.glp-input').val('')
  //   _this.hide()
  // })
  // // __./輸入框 清除按鈕__ //
  // __列表勾選__ //
  // 全選&全取消勾選

  $('.checkbox-toggle').click(function () {
    var clicks = $(this).data('clicks');

    if (clicks) {
      // Uncheck all checkboxes
      $('.glp-table .glp-checkbox-input[type=\'checkbox\']').prop('checked', false);
      $(this).find('i').removeClass().addClass('fas fa-square');
      $(this).find('span').text('0');
      $('.glp-selectedShow').hide();
    } else {
      // Check all checkboxes
      $('.glp-table .glp-checkbox-input[type=\'checkbox\']').prop('checked', true);
      $(this).find('i').removeClass().addClass('fas fa-check-square');
      var tableSelectQty = $('.glp-table .glp-checkbox-input[type=\'checkbox\']').length;
      $(this).find('span').text(tableSelectQty);
      $('.glp-selectedShow').show().css('display', 'inline-block');
    }

    $(this).data('clicks', !clicks);
  }); // 計算勾選數量

  $('.glp-table .glp-checkbox-input[type=\'checkbox\']').on('change', function () {
    var allCheckbox = $('.glp-table .glp-checkbox-input[type=\'checkbox\']');
    var checkedQty = 0;
    allCheckbox.each(function () {
      if ($(this).prop('checked')) {
        checkedQty++;
      }
    });

    if (checkedQty > 0 && checkedQty < allCheckbox.length) {
      $('.checkbox-toggle').find('i').removeClass().addClass('fas fa-minus-square');
      $('.glp-selectedShow').show().css('display', 'inline-block');
    } else if (checkedQty === allCheckbox.length) {
      $('.checkbox-toggle').find('i').removeClass().addClass('fas fa-check-square');
      $('.glp-selectedShow').show().css('display', 'inline-block');
    } else {
      $('.checkbox-toggle').find('i').removeClass().addClass('fas fa-square');
      $('.glp-selectedShow').hide();
    }

    $('.checkbox-toggle').find('span').text(checkedQty);
    checkedQty = 0;
  }); // tr 勾選樣式

  $('.glp-trCheckbox').on('click', function () {
    var checkbox = $(this).find('.glp-checkbox-input');

    if (checkbox.prop('checked')) {
      checkbox.prop('checked', false);
      $(this).removeClass('glp-trCheckbox_checked');
    } else {
      checkbox.prop('checked', true);
      $(this).addClass('glp-trCheckbox_checked');
    }
  });
  $('.glp-trCheckbox').on('click', function () {
    var tr = $(this).data('trCheckbox');
    var checkbox = $(this).find('.glp-radio-input');

    if (!checkbox.prop('checked')) {
      checkbox.prop('checked', true);
      $(".glp-trCheckbox[data-tr-checkbox=\"" + tr + "\"]").removeClass('glp-trCheckbox_checked');
      $(this).addClass('glp-trCheckbox_checked');
    } else {
      checkbox.prop('checked', false);
      $(this).removeClass('glp-trCheckbox_checked');
    }
  }); // __./列表勾選__ //
  // __輸入框 數字 控制 (有左右加減按鈕的)__ //

  $('.glp-input-group-number').on('click', 'button', function () {
    var inputNubEle = $(this).closest('.glp-input-group-number').find('.glp-input-number');
    var inputInfoNub = Number(inputNubEle.val());
    var inputStep = Number(inputNubEle.attr('step')) || 1;
    var maxNub = Number(inputNubEle.attr('max')) || null;

    if ($(this).hasClass('minus') && inputInfoNub !== 0) {
      inputNubEle.val(subFloat(inputInfoNub, inputStep));
    } else if ($(this).hasClass('plus')) {
      if (maxNub && inputInfoNub < maxNub) {
        inputNubEle.val(addFloat(inputInfoNub, inputStep));
      } else if (!maxNub) {
        inputNubEle.val(addFloat(inputInfoNub, inputStep));
      }
    }

    inputNubEle.trigger('change');
  });
  $('.glp-input-number').on('change', function () {
    var inputInfoNub = Number($(this).val());
    var maxNub = Number($(this).attr('max')) || null;

    if (inputInfoNub === 0) {
      $(this).closest('.glp-input-group-number').find('.minus').prop('disabled', true);
    } else {
      $(this).closest('.glp-input-group-number').find('.minus').prop('disabled', false);
    }

    if (maxNub && inputInfoNub >= maxNub) {
      $(this).closest('.glp-input-group-number').find('.plus').prop('disabled', true);
    } else {
      $(this).closest('.glp-input-group-number').find('.plus').prop('disabled', false);
    }
  }); // __./輸入框 數字 控制 (有左右加減按鈕的)__ //
  // 下拉選單選擇項目
  // $('.glp-dropdownSelect').on('click', '.dropdown-item', function () {
  //   const clickedInfo = $(this).text()
  //   $(this).siblings().removeClass('active')
  //   $(this).addClass('active')
  //   $(this).closest('.glp-dropdownSelect').find('[data-toggle="dropdown"] span').text(clickedInfo)
  //   selectBoxShow()
  //   startDrawShow()
  // })
  //  === ./GLP 共用事件 === //
  //  === GLP Custom === //
  // Prize 如果勾選Whether Integrate With Bally，會顯示 Bucket Type Name 和 Bucket Name的輸入框

  $('.integrateBally').on('click', function () {
    if ($(this).prop('checked')) {
      $('.integrateBallyShow').show();
    } else {
      $('.integrateBallyShow').hide().find('input').val('');
    }
  }); //  === ./GLP Custom === //
  // === function === //
  // 狀態變化觸發事件 Enabled & Disabled

  function changeStatus() {
    $('.glp-changeStatus').off().on('click', function () {
      var _this = $(this);

      var eventCode = _this.data('eventCode');

      var _statusEle = $(".glp-Status[data-event-code=\"" + eventCode + "\"]");

      var _childBtn = $(".glp-table-child[data-event-code=\"" + eventCode + "\"]");

      var status = _this.text();

      var enabledIcon = $('<i></i>').addClass('fas fa-check pr-2');
      var disabledIcon = $('<i></i>').addClass('fas fa-minus-circle pr-2');

      if (status === 'Disabled') {
        _this.text('Enabled').removeClass('glp-btn-danger').addClass('glp-btn-success').prepend(enabledIcon);

        if (_statusEle) {
          _statusEle.text('Disabled').removeClass('glp-text-success').addClass('glp-text-danger');
        }

        if (_childBtn) {
          _childBtn.find('button').attr('disabled', true).addClass('glp-btn-disabled');
        }
      } else {
        _this.text('Disabled').removeClass('glp-btn-success').addClass('glp-btn-danger').prepend(disabledIcon);

        if (_statusEle) {
          _statusEle.text('Enabled').removeClass('glp-text-danger').addClass('glp-text-success');
        }

        if (_childBtn) {
          _childBtn.find('button').attr('disabled', false).removeClass('glp-btn-disabled');
        }
      }
    });
  } // 右側滑出區塊的高度計算


  function glpControlSidebar() {
    var _head = $('.glp-control-sidebar-head');

    var _footer = $('.glp-control-sidebar-footer');

    var _body = $('.glp-control-sidebar-body');

    _body.css({
      paddingTop: _head.innerHeight(),
      paddingBottom: _footer.innerHeight()
    });
  } // Initial Quantityity 總和 & Initial Daily Quantity 總和


  function initialQuantityTotal() {
    var _initialQuant = $('[data-tr="Initial Quantity"] input');

    var _initialDailyQuant = $('[data-tr="Initial Daily Quantity"]');

    var initialQuantityTotal = 0;
    var initialDailyQuantityTotal = 0;

    _initialQuant.each(function () {
      initialQuantityTotal += Number($(this).val());
    });

    _initialDailyQuant.each(function () {
      initialDailyQuantityTotal += Number($(this).text());
    });

    $('.initialQuantityTotal').text(initialQuantityTotal);
    $('.initialDailyQuantityTotal').text(initialDailyQuantityTotal);
  } // function startDrawShow() {
  //   if ($('#StartDraw').hasClass('active')) {
  //     $('.StartDrawShow').show()
  //   } else {
  //     $('.StartDrawShow').hide()
  //   }
  // }
  // function selectBoxShow () {
  //   if ($('#selectPrizeInentoryShow').hasClass('active')) {
  //     $('.selectPrizeInentoryShow').show()
  //   } else {
  //     $('.selectPrizeInentoryShow').hide()
  //   }
  //   if ($('#NewPrizeShow').hasClass('active')) {
  //     $('.NewPrizeShow').show()
  //   } else {
  //     $('.NewPrizeShow').hide()
  //   }
  // }
  // 浮點數相加


  function addFloat(num1, num2) {
    var r1;
    var r2;
    var m;

    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }

    try {
      r2 = num2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }

    m = Math.pow(10, Math.max(r1, r2)); // eslint-disable-next-line no-undef

    return (mulFloat(num1, m) + mulFloat(num2, m)) / m;
  } // 浮點數相減


  function subFloat(num1, num2) {
    var r1;
    var r2;
    var m;
    var n;

    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }

    try {
      r2 = num2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }

    m = Math.pow(10, Math.max(r1, r2));
    n = r1 >= r2 ? r1 : r2;
    return ((num1 * m - num2 * m) / m).toFixed(n);
  } // 浮點數相乘


  function mulFloat(num1, num2) {
    var m = 0;
    var s1 = num1.toString();
    var s2 = num2.toString();

    try {
      m += s1.split('.')[1].length;
    } catch (e) {}

    try {
      m += s2.toString().split('.')[1].length;
    } catch (e) {}

    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
  } // 浮點數相除


  function divFloat(num1, num2) {
    var r1;
    var r2;
    var t1 = 0;
    var t2 = 0;

    try {
      t1 = num1.toString().split('.')[1].length;
    } catch (e) {}

    try {
      t2 = num2.toString().split('.')[1].length;
    } catch (e) {}

    if (Math) {
      r1 = Number(num1.toString().replace('.', ''));
      r2 = Number(num2.toString().replace('.', ''));
      return r1 / r2 * pow(10, t2 - t1);
    }
  } // === ./function === //


  function isMobile() {
    try {
      document.createEvent('TouchEvent');
      return true;
    } catch (e) {
      return false;
    }
  }

  $(document).ready(function () {
    changeStatus();
    glpControlSidebar();
    initialQuantityTotal();

    if (!isMobile()) {
      $('body').addClass('no-touch');
    }

    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + "px");
  });
});
