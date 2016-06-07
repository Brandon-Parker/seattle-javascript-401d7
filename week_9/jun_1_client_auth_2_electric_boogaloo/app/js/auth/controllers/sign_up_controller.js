var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('SignUpController', ['$http', '$location',  'cfHandleError', 'cfAuth', function($http, $location, handleError, auth) {
    // AUTH_EXP: how does this differ from the sign_in_controller
    // This controller is authenticating a new user and generating a token that will be saved in order to login
    // and runs the getUsername function which will run the promise to determine if a token has already been generated
    // or not and then it will redirect to the /bears route. If not the promise in the authservice file will reject it.
    this.signup = true;
    this.errors = [];
    this.buttonText = 'Create New User!'
    this.authenticate = function(user) {
      $http.post(baseUrl + '/api/signup', user)
        .then((res) => {
          auth.saveToken(res.data.token);
          auth.getUsername();
          $location.path('/bears');
        }, handleError(this.errors, 'Could not create user'));
    };
  }]);
};
