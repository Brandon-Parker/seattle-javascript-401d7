var baseUrl = require('../../config').baseUrl;

module.exports = function(app) {
  app.factory('cfAuth', ['$http', '$q', function($http, $q) {
    // AUTH_EXP: explain what each of these functions are accomplishing and
    // what data we're storing in this service
    //These are all higher-order functions
    return {
      //The removeToken is called on a logout. This is designed to set the token that was generated and saved in
      //localStorage and the username to null, so the user is logged out.
      removeToken: function() {
        this.token = null;
        this.username = null;
        $http.defaults.headers.common.token = null;
        window.localStorage.token = '';
      },
      //This function will set the token in the headers, window.localStorage and as a this
      //so that we have access to it multiple places, like anywhere we need it where $http is called
      saveToken: function(token) {
        this.token = token;
        $http.defaults.headers.common.token = token;
        window.localStorage.token = token;
        return token;
      },
      //This function will grab either grab the token that was just created or call the saveToken, earlier defined,
      //to get the one that was stored on the window.localStorage
      getToken: function() {
        this.token || this.saveToken(window.localStorage.token);
        return this.token;
      },
      //This function is checking to see if a username exists and if it does then we will return the resolve from
      //the promise and retrieve that username. It will also check if there is a token available, if not it will
      //reject because there is no username or token.
      getUsername: function() {
        return $q(function(resolve, reject) {
          if (this.username) return resolve(this.username);
          if (!this.getToken()) return reject(new Error('no authtoken'));

          $http.get(baseUrl + '/api/profile')
            .then((res) => {
              this.username = res.data.username;
              resolve(res.data.username);
            }, reject);
        }.bind(this));
      }
    }
  }]);
};
