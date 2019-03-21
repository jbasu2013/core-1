/* This file is part of Jeedom.
*
* Jeedom is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Jeedom is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
*/
$('.nav-tabs a').on('shown.bs.tab', function (e) {
  window.location.hash = e.target.hash;
})

jwerty.key('ctrl+s/⌘+s', function (e) {
  e.preventDefault();
  $("#bt_saveWidgets").click();
});

if (getUrlVars('saveSuccessFull') == 1) {
  $('#div_alert').showAlert({message: '{{Sauvegarde effectuée avec succès}}', level: 'success'});
}

if (getUrlVars('removeSuccessFull') == 1) {
  $('#div_alert').showAlert({message: '{{Suppression effectuée avec succès}}', level: 'success'});
}

$('.widgetsAttr[data-l1key=type]').off('change').on('change',function(){
  $('.widgetsAttr[data-l1key=subtype] option').hide();
  if($(this).value() != ''){
    $('.widgetsAttr[data-l1key=subtype] option[data-type='+$(this).value()+']').show();
  }
  $('.widgetsAttr[data-l1key=subtype] option[data-default=1]').show();
  $('.widgetsAttr[data-l1key=subtype]').value('');
});

$('.widgetsAttr[data-l1key=subtype]').off('change').on('change',function(){
  $('.widgetsAttr[data-l1key=template] option').hide();
  if($(this).value() != '' && $('.widgetsAttr[data-l1key=type]').value() != ''){
    $('.widgetsAttr[data-l1key=template] option[data-type='+$('.widgetsAttr[data-l1key=type]').value()+'][data-subtype='+$(this).value()+']').show();
  }
  $('.widgetsAttr[data-l1key=template] option[data-default=1]').show();
  $('.widgetsAttr[data-l1key=template]').value('');
});

$('#div_templateReplace').off('click','.chooseIcon').on('click','.chooseIcon', function () {
  var bt = $(this);
  chooseIcon(function (_icon) {
    bt.closest('.form-group').find('.widgetsAttr[data-l1key=replace]').value(_icon);
  });
});

$('#div_templateTest').off('click','.chooseIcon').on('click','.chooseIcon', function () {
  var bt = $(this);
  chooseIcon(function (_icon) {
    bt.closest('.form-group').find('.testAttr[data-l1key=state]').value(_icon);
  });
});

function loadTemplateConfiguration(_template,_data){
  jeedom.widgets.getTemplateConfiguration({
    template:_template,
    error: function (error) {
      $('#div_alert').showAlert({message: error.message, level: 'danger'});
    },
    success: function (data) {
      $('#div_templateReplace').empty();
      if(typeof data.replace != 'undefined' && data.replace.length > 0){
        var replace = '';
        for(var i in data.replace){
          replace += '<div class="form-group">';
          replace += '<label class="col-lg-2 col-md-3 col-sm-4 col-xs-6 control-label">'+data.replace[i]+'</label>';
          replace += '<div class="col-lg-3 col-md-4 col-sm-5 col-xs-6">';
          replace += '<div class="input-group">';
          replace += '<input class="form-control widgetsAttr roundedLeft" data-l1key="replace" data-l2key="#_'+data.replace[i]+'_#"/>';
          replace += '<span class="input-group-btn">';
          replace += '<a class="btn btn-sm chooseIcon roundedRight">{{Icone}}</a>';
          replace += '</span>';
          replace += '</div>';
          replace += '</div>';
          replace += '</div>';
        }
        $('#div_templateReplace').append(replace);
      }
      if(typeof _data != 'undefined'){
        $('.widgets').setValues(_data, '.widgetsAttr');
      }
    }
  });
}

setTimeout(function(){
  $('.widgetsListContainer').packery();
},100);

$('#bt_returnToThumbnailDisplay').on('click',function(){
  $('#div_conf').hide();
  $('#div_widgetsList').show();
  $('.widgetsListContainer').packery();
});

$('#in_searchWidgets').keyup(function () {
  var search = $(this).value();
  if(search == ''){
    $('.widgetsDisplayCard').show();
    $('.widgetsListContainer').packery();
    return;
  }
  $('.widgetsDisplayCard').hide();
  $('.widgetsDisplayCard .name').each(function(){
    var text = $(this).text().toLowerCase();
    if(text.indexOf(search.toLowerCase()) >= 0){
      $(this).closest('.widgetsDisplayCard').show();
    }
  });
  $('.widgetsListContainer').packery();
});

$('#bt_widgetsAddTest').off('click').on('click', function (event) {
  addTest({})
});

$('#div_templateTest').off('click','.bt_removeTest').on('click','.bt_removeTest',function(){
  $(this).closest('.test').remove();
});

function addTest(_test){
  if (!isset(_test)) {
    _trigger = {};
  }
  var div = '<div class="test">';
  div += '<div class="form-group">';
  div += '<label class="col-lg-2 col-md-3 col-sm-4 col-xs-6 control-label">{{Test}}</label>';
  div += '<div class="col-sm-3">';
  div += '<div class="input-group">';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-default bt_removeTest btn-sm roundedLeft"><i class="fas fa-minus-circle"></i></a>';
  div += '</span>';
  div += '<input class="testAttr form-control input-sm roundedRight" data-l1key="operation" placeholder="Test, utiliser #value# pour la valeur"/>';
  div += '</div>';
  div += '</div>';
  div += '<div class="col-sm-3">';
  div += '<div class="input-group">';
  div += '<input class="testAttr form-control input-sm roundedLeft" data-l1key="state" placeholder="Résultat si test ok"/>';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-sm chooseIcon roundedRight">{{Icone}}</a>';
  div += '</span>';
  div += '</div>';
  div += '</div>';
  div += '</div>';
  div += '</div>';
  $('#div_templateTest').append(div);
  $('#div_templateTest').find('.test:last').setValues(_test, '.testAttr');
}

$("#bt_addWidgets").off('click').on('click', function (event) {
  bootbox.prompt("Nom du widget ?", function (result) {
    if (result !== null) {
      jeedom.widgets.save({
        widgets: {name: result},
        error: function (error) {
          $('#div_alert').showAlert({message: error.message, level: 'danger'});
        },
        success: function (data) {
          modifyWithoutSave = false;
          loadPage('index.php?v=d&p=widgets&id=' + data.id + '&saveSuccessFull=1');
          $('#div_alert').showAlert({message: '{{Sauvegarde effectuée avec succès}}', level: 'success'});
        }
      });
    }
  });
});

$(".widgetsDisplayCard").on('click', function (event) {
  $('#div_conf').show();
  $('#div_widgetsList').hide();
  $('#div_templateTest').empty();
  jeedom.widgets.byId({
    id: $(this).attr('data-widgets_id'),
    cache: false,
    error: function (error) {
      $('#div_alert').showAlert({message: error.message, level: 'danger'});
    },
    success: function (data) {
      $('.widgetsAttr[data-l1key=template]').off('change')
      $('.widgetsAttr').value('');
      $('.widgets').setValues(data, '.widgetsAttr');
      if (isset(data.test)) {
        for (var i in data.test) {
          addTest(data.test[i]);
        }
      }
      loadTemplateConfiguration('cmd.'+data.type+'.'+data.subtype+'.'+data.template,data);
      modifyWithoutSave = false;
      setTimeout(function(){
        $('.widgetsAttr[data-l1key=template]').on('change',function(){
          if($(this).value() == ''){
            return;
          }
          loadTemplateConfiguration('cmd.'+ $('.widgetsAttr[data-l1key=type]').value()+'.'+$('.widgetsAttr[data-l1key=subtype]').value()+'.'+$(this).value());
        });
      }, 500);
    }
  });
});

if (is_numeric(getUrlVars('id'))) {
  if ($('.widgetsDisplayCard[data-widgets_id=' + getUrlVars('id') + ']').length != 0) {
    $('.widgetsDisplayCard[data-widgets_id=' + getUrlVars('id') + ']').click();
  } else {
    $('.widgetsDisplayCard:first').click();
  }
}

$("#bt_saveWidgets").on('click', function (event) {
  var widgets = $('.widgets').getValues('.widgetsAttr')[0];
  widgets.test = $('#div_templateTest .test').getValues('.testAttr');
  jeedom.widgets.save({
    widgets: widgets,
    error: function (error) {
      $('#div_alert').showAlert({message: error.message, level: 'danger'});
    },
    success: function (data) {
      modifyWithoutSave = false;
      window.location = 'index.php?v=d&p=widgets&id=' + data.id + '&saveSuccessFull=1';
    }
  });
  return false;
});
