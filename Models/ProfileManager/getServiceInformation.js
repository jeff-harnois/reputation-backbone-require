_.extend(main.app.ProfileManager, {
  GetServiceInformation: {
    Collection: Backbone.Collection.extend({
      initialize: function(data) {
        this.getData(data);
      },
      getData: function() {
        var self = this,
            Model,
            planDesc = false,
            payDate = false;
        Backbone.clearCollection(self);
        
        Model = new app.GetServiceInformation.Model({
          address1: 'templateVar($billingAddress->address1)',
          address2: 'templateVar($billingAddress->address2)',
          addressCity: 'templateVar($billingAddress->addressCity)',
          addressState: 'templateVar($billingAddress->addressState)',
          addressZip: 'templateVar($billingAddress->addressZip)',
          addressCountry: 'templateVar($billingAddress->addressCountry)',
          prefix: 'templateVar($billingName->prefix)',
          firstName: 'templateVar($billingName->firstName)',
          middleName: 'templateVar($billingName->middleName)',
          lastName: 'templateVar($billingName->lastName)',
          suffix: 'templateVar($billingName->suffix)',
          ccRedToken: "templateVar($ccRedToken)",
          planDesc: 'templateVar($planDesc)',
          payDate: 'templateVar($payDate)'
        });

        self.add(Model);

        return this;
      }
    }),
    Model: Backbone.Model.extend({
      defaults: {
        ccRedToken: false,
        haveBillingInfo: false,
        address1: '',
        address2: '',
        addressCity: '',
        addressZip: '',
        addressState: '',
        addressCountry: '',
        firstName: '',
        lastName: '',
        planDesc: '',
        payDate: '',
        cct: '',
        ccm: '',
        ccy: ''
      },
      validate: function(attrs) {
        Rep.log('validate');
        Rep.log(attrs);

        if (attrs.firstName === '') {
          return 'Please enter your first name';
        }
        if (attrs.lastName === '') {
          return 'Please enter your last name';
        }
        if (attrs.cct === '') {
          return 'Please enter a credit card';
        }
        if (isNaN(attrs.css) === 'true'){
          return 'Please only enter numbers for your credit card';
        }
        if (attrs.ccm === '') {
          return 'Please enter an expiration month';
        }
        if (attrs.ccy === '') {
          return 'Please select an expiration year';
        }
        if (attrs.address1 === '') {
          return 'Please enter your address on line 1';
        }
        if (attrs.addressCity === '') {
          return 'Please enter your city';
        }
        if (attrs.addressState === '') {
          return 'Please select your state';
        }
        if (attrs.addressZip === '') {
          return 'Please enter your zip code';
        }
        if (attrs.addressCountry === '') {
          return 'Please select your country';
        }

        // validate the expiration date
        if (attrs.ccy == new Date().getFullYear()) {
          if (attrs.ccm < new Date().getMonth()+1) {
            return "Please enter a valid expiration date for your credit card.";
          }
        }
      },
      updateServer: function() {
        Rep.log('updateServer called');
        var self = this;

        self.validateAddress();
      },
      validateAddress: function() {
        var self = this;

        Rep.api.call(
          "ProfileManager",
          "validateAddress",
          {
            "addressRaw": JSON.stringify(
              {
                "address1": self.get('address1'),
                "address2": self.get('address2'),
                "addressCity": self.get('addressCity'),
                "addressState": self.get('addressState'),
                "addressZip": self.get('addressZip'),
                "addressCountry": "US"
              }
            )
          },
          function(r) {
            Rep.log('validate');
            Rep.log(r);
            if (r.result.status === 1) {
              self.submitLitle();
            } else {
              $('body').trigger('submissionFailure', [r.result.msg, "validateAddress"]);
              $('.form_error').show().append();
            }
          }
        );
      },
      submitLitle: function() {
        var self = this;
        if (typeof jQuery.fn.submitLitle == 'function') {
          Rep.log('submitLitle');
          $('.default_form').submitLitle({
            onSuccess: function(response) {
              Rep.log('submitLitle successful');
              Rep.log(response);
              self.set({c: response.paypageRegistrationId});
              self.set({t: response.type});
              self.doSubmit();
            },
            onError: function(response, errorMessage) {
              Rep.log('submitLitle error');
              $('body').trigger('litleFailure', [errorMessage, response]);
            },
            onTimeout: function(timeoutMessage) {
              Rep.log('submitLitle timeout');
              $('body').trigger('litleFailure', [timeoutMessage, ""]);
            },
            paypageId: "templateVar($tokenPayPageId)",
            reportGroup: "templateVar($tokenReportGroup)",
            orderId: "templateVar($orderId)",
            id: "templateVar($merchantId)",
            url: "templateVar($tokenUrl)"
          });
        } else {
          Rep.log('no submitLitle function');
        }

      },
      doSubmit: function() {
        var self = this;
        Rep.api.call(
          "Shark",
          "changeBillingInformation",
          {
            "userId": templateVar($user_id),
            "billingInfo": JSON.stringify({
              "billingName": {
                "firstName": self.get('firstName'),
                "lastName": self.get('lastName')
              },
              "billingAddress": {
                "address1": self.get('address1'),
                "address2": self.get('address2'),
                "addressCity": self.get('addressCity'),
                "addressState": self.get('addressState'),
                "addressZip": self.get('addressZip'),
                "addressCountry": "US"
              },
              "ccToken": self.get('c'),
              "ccType": self.get('t'),
              "expirationMonth": self.get('ccm'),
              "expirationYear": self.get('ccy')
            })
          },
          function(r) {
            Rep.log("changes to Shark");
            Rep.log(r);
            if (r.result === 1) {
              $('body').trigger('submissionSuccess', [r.result, r]);
            }
          }
        );
      }
    })
  }
});