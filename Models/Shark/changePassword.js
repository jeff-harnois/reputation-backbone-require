_.extend(main.app.Shark, {
  ChangePassword: {
    Collection: Backbone.Collection.extend({
      initialize: function(data) {
        Rep.log('initialize');
        this.getData(data);
      },
      getData: function(data) {
        var self = this;
        
        self.addModels();

        return self;
      },
      addModels: function() {
        var self = this,
            Model;
        Model = new app.ChangePassword.Model({
          entity_id: main.app.entity_id,
          user_id: main.app.user_id
        });
        self.add(Model);

        return self
      }
    }),
    Model: Backbone.Model.extend({
      defaults: {
        entity_id: 0,
        user_id: 0,
        password: "",
        confirmpassword: ""
      },
      validate: function(attrs) {
        if (attrs.password === '') {
          return 'Please enter a password';
        }
        if (attrs.password.length < 5) {
          return 'Please enter at least 5 characters';
        }
        if (attrs.password !== attrs.confirmpassword) {
          return 'Please confirm your password';
        }
      },
      submitModel: function(Model, callback) {
        Rep.log('submitModel changePassword called');
        var self = this;
        Rep.api.call(
          "Shark",
          "changePassword",
          {
            "userId": self.get('user_id'), 
            "newPassword": self.get('password')
          },
          function(r) {
            Rep.log('changePassword');
            Rep.log(r);
            if (typeof(callback) === 'function') {
              callback(r);
            }
          }
        );
      }
    })
  }
});