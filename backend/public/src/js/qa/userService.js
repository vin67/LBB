angular.module('lbbApp.qa')
  .service('userService', [function(){
    var category = 'Web';
    var type = 'Watson' // Store if user is searching by Natural language or a question

    return {
      getCategory: function() {
        return category;
      },
      setCategory: function(val) {
        category = val;
      },
      getType: function() {
        return type;
      },
      setType: function(val) {
        type = val;
      }
    };

  }]);