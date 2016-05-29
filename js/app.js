var app = angular.module('ChatApp', []);

app.controller('ListCtrl', function ($scope, DataFactory) {
  $scope.convos = convos;
  $scope.selectConvo = DataFactory.selectConvo;
});

app.controller('ConvoCtrl', function ($scope, DataFactory) {
  $scope.convo = DataFactory.activeConvo;
  $scope.newTextVal;

  $scope.$watch(function(){
    return DataFactory.getActiveConvo();
  }, function(newVal, oldVal){
    if(newVal !== oldVal){
      $scope.convo = newVal;
    }
  });

  $scope.resize = function(){
    var hidden = angular.element(document.querySelector('#hidden'))[0];

    var hiddenHeight = hidden.offsetHeight;
    // var hiddenHeight = hidden.offsetHeight;
    window.myHidden = hidden;
    console.log(hidden, hiddenHeight);

    var newText = angular.element(document.querySelector('#newText'))[0];
    newText.css('height', hiddenHeight + 'px');
  }

});

app.factory('DataFactory', function(){
  var DataFactory = {};

  DataFactory.activeConvo = {};

  DataFactory.getActiveConvo = function(){
    return DataFactory.activeConvo;
  };

  DataFactory.selectConvo = function(convo) {
    DataFactory.activeConvo = convo;
  };

  return DataFactory;
});

app.filter('preview', function(){
  return function(str){
    return str.substr(0,40) + '...';
  };
});

app.directive('resize', function(){
  return function(scope, elem){
    var el = elem[0];
    el.addEventListener('keyup', function(ev){
      var hidden = document.getElementById('hidden');
      var footer = document.getElementById('footer');
      var contents = document.getElementById('contents');

      var initContentStyle = contents.currentStyle || window.getComputedStyle(contents);
      var initMarginBottom = initContentStyle['margin-bottom'];
      var initContentHeight = initContentStyle.height;

      var initFootHeight = footer.offsetHeight;

      footer.style.height = (hidden.offsetHeight + 40) + 'px';
      this.style.height = hidden.offsetHeight + 'px';

      var finalFootHeight = footer.offsetHeight;

      contents.style.height = (Number(initContentHeight.replace(/[a-z]/ig, '')) + (initFootHeight - finalFootHeight)) + 'px';
      contents.style['margin-bottom'] = (Number(initMarginBottom.replace(/[a-z]/ig, '')) + (finalFootHeight - initFootHeight)) + 'px';

      // console.log(initContentStyle['margin-bottom'], contents.style['margin-bottom']);
    });
  };
});