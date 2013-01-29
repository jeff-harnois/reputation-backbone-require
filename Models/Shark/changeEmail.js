_.extend(main.app.Shark, {
  ChangeEmail: {
    Collection: Backbone.Collection.extend({
      initialize: function(data) {
        Rep.log('initialize');
        this.getData(data);
      },
      getData: function(data) {
        var self = this;
        
        self.saveModels();

        return self;
      },
      saveModels: function() {
        var self = this,
            Model;
        Model = new app.ChangeEmail.Model({
          entity_id: main.app.entity_id,
          user_id: main.app.user_id,
          email: "main.app.email",
          confirmemail: "main.app.email"
        });
        Rep.log('saveModels');
        Rep.log(Model);
        self.add(Model);

        return self;
      }
    }),
    Model: Backbone.Model.extend({
      defaults: {
        entity_id: 0,
        user_id: 0,
        email: "",
        confirmemail: ""
      },
      validate: function(attrs) {
        if (attrs.email === '') {
          return 'Please enter an email';
        }
        if (Rep.regex.email.test(attrs.email) === false || Rep.regex.email.test(attrs.confirmemail) === false) {
          return 'Please enter a valid email';
        }
        if (attrs.email !== attrs.confirmemail) {
          return 'Please enter the same email address';
        }
      },
      submitModel: function(Model, callback) {
        Rep.log('submitModel changeEmail called');
        var self = this;
        Rep.api.call(
          "Shark",
          "changeEmail",
          {
            "userId": self.get('user_id'), 
            "newEmail": self.get('email')
          },
          function(r) {
            Rep.log('changeEmail');
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