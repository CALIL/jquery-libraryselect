// Generated by CoffeeScript 1.3.1

(function($) {
  return $.fn.libraryselect = function(options) {
    var $element, add_css, default_options, get_api, log, params,
      _this = this;
    $element = this;
    default_options = {
      'font-size': '12px',
      'keyword': false,
      'selector': $element.selector,
      'label': false,
      'onselect': function(system_id) {
        return $($element.selector).val(system_id);
      }
    };
    options = $.extend(default_options, options);
    log = function(obj) {
      try {
        return console.log(obj);
      } catch (_error) {}
    };
    add_css = function(css_code) {
      var newStyle;
      newStyle = document.createElement('style');
      newStyle.type = "text/css";
      document.getElementsByTagName('head')[0].appendChild(newStyle);
      return newStyle.innerHTML = css_code;
    };
    get_api = function(param, func) {
      var url,
        _this = this;
      if ((param.type != null) && param.type === 'search') {
        url = "//api.calil.jp/mobile/search";
      }
      return $.ajax({
        url: url,
        type: "GET",
        data: param,
        dataType: "jsonp",
        timeout: 5000,
        error: function() {
          return log('読み込みに失敗しました。');
        },
        success: function(data) {
          if ((param.type != null) && param.type === 'group') {
            _this.add_groups(param.id, data);
          }
          return func(data);
        }
      });
    };
    add_css("#library_select_div {\n    display: none;\n    height: 252px;\n    overflow:auto;\n    position: absolute;\n    z-index: 100000;\n    border: 1px solid #CCC;\n    background-color: white;\n    padding: 0;\n    margin: 0;\n}\n#library_select_div div {\n    font-size: 12px;\n    padding: 10px;\n}\n#library_select_div div:hover {\n    background-color: #CCC;\n}");
    $(document).on('focus', $element.selector, function() {
      var $textbox, offset;
      log('focus');
      $textbox = $($element.selector);
      $(document.body).after("<div id=\"library_select_div\" selector=\"" + options.selector + "\"></div>");
      offset = $textbox.offset();
      $('#library_select_div').css({
        'width': parseFloat($textbox.css('width').split('px')[0]),
        'top': offset['top'] + parseFloat($textbox.css('height').split('px')[0]),
        'left': offset['left']
      });
      return setTimeout(function() {
        return $textbox.select();
      }, 100);
    });
    $(document).on('blur', $element.selector, function() {
      log('blur');
      return $('#library_select_div').remove();
    });
    $(document).on('focus keyup', $element.selector, function(event) {
      var keyword, params,
        _this = this;
      keyword = $($element.selector).val();
      log(keyword);
      log(event.keyCode);
      if (keyword === '') {
        return $('#library_select_div').hide().empty();
      } else {
        $('#library_select_div').show();
      }
      params = {
        'type': 'search',
        'keyword': keyword,
        'limit': 10
      };
      return get_api(params, function(data) {
        var style;
        $('#library_select_div').empty();
        style = '';
        if (options['font-size']) {
          style = 'font-size:' + options['font-size'];
        }
        return $(data).each(function(i, lib) {
          return $('#library_select_div').append("<div id=\"" + lib.id + "\" name=\"" + lib.name + "\" style=\"" + style + "\">" + lib.name + " (" + lib.id + ")</div>");
        });
      });
    });
    $(document).on('mousedown', '#library_select_div div', function() {
      if ($('#library_select_div').attr('selector') === options.selector) {
        options.onselect($(this).attr('id'));
        if (options.label) {
          return $(options.label).text($(this).attr('name'));
        }
      }
    });
    if (options.keyword) {
      params = {
        'type': 'search',
        'keyword': options.keyword
      };
      get_api(params, function(data) {
        if (data.length > 0) {
          if (options.label) {
            return $(options.label).text(data[0].name);
          }
        }
      });
    }
    return this;
  };
})(jQuery);
