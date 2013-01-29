// creating this object so that when we create the other collections we have access to CollDefaults

_.extend(main.app.ProfileManager, {
  GetAttributes: {
    CollDefaults: {
      addNewModelToDB: function(data, Model, callback) {
        Rep.api.call(
          "ProfileManager",
          "addAttributes",
          {
            "attributes": JSON.stringify([{
              "entityId": data.entity_id,
              "primitiveTypeId": data.primitiveTypeId,
              "type": data.type,
              "data": data.data
            }]),
            isPartial: 0
          },
          function(r) {
            Rep.log('addAttributes');
            Rep.log(r.result);
            if (r.result.status === 1) {
              Model.set({tid: r.result.attributeResults[0].id});
              if (typeof(data.dataCallback) === 'function') {
                data.dataCallback(r.result);
              }
            }
            if (typeof(callback) === 'function') {
              callback(r, data, Model);
            }
          }
        );
      },
      updateModelOnDB: function (data, Model, callback) {
        Rep.api.call(
          "ProfileManager",
          "modifyAttributeValues",
          {
            "attributes": JSON.stringify([{
              "id": data.tid,
              "entityId": data.entity_id,
              "primitiveTypeId": data.primitiveTypeId,
              "type": data.type,
              "data": data.data
            }])
          },
          function(r) {
            Rep.log('modifyAttributeValues');
            Rep.log(r.result);
            if (typeof(data.dataCallback) === 'function') {
              data.dataCallback(r.result);
            }
            if (typeof(callback) === 'function') {
              callback(r, data, Model);
            }
          }
        );
      },
      deleteModelFromDB: function(data, Model, callback) {
        Rep.api.call(
          "ProfileManager",
          "deleteAttributes",
          {"attributeIds": data.data},
          function(r) {
            Rep.log('deleteAttributes');
            Rep.log(r.result);
            // fire the delete event and have the model remove itself from the collection
            if (typeof(data.deleteOne) === 'function') {
              data.deleteOne();
            }
            if (typeof(data.dataCallback) === 'function') {
              data.dataCallback(r.result);
            }
            if (typeof(callback) === 'function') {
              callback(r, data, Model);
            }
          }
        );
      }
    }
  }
});

_.extend(app, {
  GetAttributes: {
    Collection: {
      Addresses: Backbone.Collection.extend(app.GetAttributes.CollDefaults),
      NonUsAddresses: Backbone.Collection.extend(app.GetAttributes.CollDefaults),
      Phones: Backbone.Collection.extend(app.GetAttributes.CollDefaults),
      Emails: Backbone.Collection.extend(app.GetAttributes.CollDefaults),
      Names: Backbone.Collection.extend(app.GetAttributes.CollDefaults),
      Birthdays: Backbone.Collection.extend(app.GetAttributes.CollDefaults),
      Default: Backbone.Collection.extend({
        requestData: {},
        dataCallback: null,
        profileAttrs: {
          Addresses: null,
          NonUsAddresses: null,
          Phones: null,
          Emails: null,
          Names: null,
          Birthdays: null
        },
        initialize: function(data) {
          this.requestData = data;

          this.dataCallback = data.dataCallback;
          this.getData();
        },
        getData: function() {
          var self = this,
              requestData = this.requestData,
              d, m;
          Rep.api.call(
            "ProfileManager",
            "getAttributes",
            {
              entityId: requestData.entity_id,
              attributeQuery: JSON.stringify({
                isMe: 1,
                isPartial: -1
              })
            },
            function(r) {
              Rep.log('GetAttributes');
              Rep.log(r);

              if (r.result.length) {
                Backbone.clearCollection(self);
              
                m = self.setupCollections();
                d = self.saveModels(r.result);
                if (typeof(requestData.callback) === 'function') {
                  requestData.callback(self);
                }
              } else {
                if (typeof(requestData.callback) === 'function') {
                  requestData.callback('no data');
                }
              }
            }
          );
        },
        setupCollections: function() {
          this.profileAttrs.Addresses = new app.GetAttributes.Collection.Addresses();
          this.profileAttrs.NonUsAddresses = new app.GetAttributes.Collection.NonUsAddresses();
          this.profileAttrs.Phones = new app.GetAttributes.Collection.Phones();
          this.profileAttrs.Emails = new app.GetAttributes.Collection.Emails();
          this.profileAttrs.Names = new app.GetAttributes.Collection.Names();
          this.profileAttrs.Birthdays = new app.GetAttributes.Collection.Birthdays();

          return this;
        },
        saveModels: function(data) {
          var self = this,
              Model,
              d = {},
              p,
              esc = /["]{1}/gi,
              names = 0,
              addresses = 0,
              phones = 0,
              emails = 0,
              active = false;

          _.each(data, function(v) {
            switch(v.primitiveTypeId) {
              case '6':
                // address
                p = $.parseJSON(v.data);
                if (p.location.country !== 'US') {
                  // non-us address
                  d = {
                    tid: v.id,
                    entity_id: self.requestData.entity_id,
                    city: p.location.city,
                    country: p.location.country,
                    dataCallback: self.dataCallback
                  };
                  Model = new app.GetAttributes.Model.NonUsAddress(d);
                  self.profileAttrs.NonUsAddresses.add(Model);
                } else {
                  if (addresses < "templateVar($address_ct)") {
                    addresses = addresses + 1;
                    active = 'active';
                  } else {
                    active = false;
                  }

                  d = {
                    tid: v.id,
                    entity_id: self.requestData.entity_id,
                    line1: p.line1,
                    line2: p.line2,
                    city: p.location.city,
                    state: p.location.state,
                    country: p.location.country,
                    postal_code: p.postal_code,
                    dataCallback: self.dataCallback,
                    active: active
                  };
                  Model = new app.GetAttributes.Model.Address(d);
                  self.profileAttrs.Addresses.add(Model);
                }
                break;
              case '7':
                // email
                if (emails < "templateVar($other_ct)") {
                  emails = emails + 1;
                  active = 'active';
                } else {
                  active = false;
                }

                d = v.data.replace(esc, "");
                Model = new app.GetAttributes.Model.Email({email: d, tid: v.id, entity_id: self.requestData.entity_id, dataCallback: self.dataCallback, active: active});
                self.profileAttrs.Emails.add(Model);
                break;
              case '9':
                // name
                if (names < "templateVar($name_ct)") {
                  names = names + 1;
                  active = 'active';
                } else {
                  active = false;
                }

                d = $.parseJSON(v.data);
                d.tid = v.id;
                d.entity_id = self.requestData.entity_id;
                d.dataCallback = self.dataCallback;
                d.active = active;
                Model = new app.GetAttributes.Model.Name(d);
                self.profileAttrs.Names.add(Model);
                break;
              case '18':
                // birthday
                d = $.parseJSON(v.data);
                d.tid = v.id;
                d.entity_id = self.requestData.entity_id;
                d.dataCallback = self.dataCallback;
                d.active = active;
                Model = new app.GetAttributes.Model.Birthday(d);
                self.profileAttrs.Birthdays.add(Model);
                break;
              case '26':
                // phone
                d = v.data.replace(esc ,"");
                if (phones < "templateVar($other_ct)") {
                  phones = phones + 1;
                  active = 'active';
                } else {
                  active = false;
                }

                Model = new app.GetAttributes.Model.Phone({phone: d, tid: v.id, entity_id: self.requestData.entity_id, dataCallback: self.dataCallback, active: active});
                self.profileAttrs.Phones.add(Model);
                break;
            }
          });
          return self;
        }
      })
    },

    Model: {

      Address: Backbone.Model.extend({
        defaults: {
          tid: 0,
          dataCallback: null,
          entity_id: 0,
          primitiveTypeId: 6,
          line1: '',
          line2: '',
          city: '',
          state: '',
          country: 'US',
          postal_code: ''
        },
        toDelete: false,
        validate: function(attrs) {
          if (attrs.line1 === '' || attrs.city === '' || attrs.country === '') {
            return 'Please include street address, city and country.';
          }
        },
        deleteModel: function() {
          var self = this,
              data = {},
              mod;
          data.data = [];
          data.dataCallback = self.get('dataCallback');
          data.deleteOne = function() {
            self.collection.remove(self);
          };
          if (self.get('tid') !== 0) {
            if (self.collection.length > 1) {
              data.data.push(self.get('tid'));
              self.collection.deleteModelFromDB(data);
            } else {
              // throw error about not deleting the last one
              Rep.log('trying to delete the last address');
            }
          }
        },
        submitModel: function(callback) {
          var self = this,
              data;

          data = {
            entity_id: self.get('entity_id'),
            primitiveTypeId: self.get('primitiveTypeId'),
            type: "Address",
            data: JSON.stringify({
              line1: self.get('line1'),
              line2: self.get('line2'),
              location: {
                city: self.get('city'),
                state: self.get('state'),
                country: self.get('country')
              },
              postal_code: self.get('postal_code')
            })
          };
          data.dataCallback = self.get('dataCallback');

          if (self.get('tid') === 0) {
            self.collection.addNewModelToDB(data, self, callback);
          } else {
            data.tid = self.get('tid');
            self.collection.updateModelOnDB(data, self, callback);
          }
        }
      }),

      Phone: Backbone.Model.extend({
        defaults: {
          tid: 0,
          dataCallback: null,
          entity_id: 0,
          primitiveTypeId: 26,
          phone: ''
        },
        toDelete: false,
        validate: function(attrs) {
          var phonePattern = Rep.regex.phone;  
          
          if (attrs.phone === '') {
            return 'Please enter a phone number';
          }
          if (phonePattern.test(attrs.phone) === false) {
            return 'Please enter a valid phone number';
          }
        },
        deleteModel: function(callback) {
          var self = this,
              data = {},
              mod;
          data.data = [];
          data.dataCallback = self.get('dataCallback');
          data.deleteOne = function() {
            self.collection.remove(self);
          };
          if (self.get('tid') !== 0) {
            data.data.push(self.get('tid'));
            self.collection.deleteModelFromDB(data, self, callback);
          }
        },
        submitModel: function(callback) {
          var self = this,
              data = {
                entity_id: self.get('entity_id'),
                primitiveTypeId: self.get('primitiveTypeId'),
                type: "Phone",
                data: '\"'+self.get('phone')+'\"'
              };

          data.dataCallback = self.get('dataCallback');
              
          if (self.get('tid') === 0) {
            self.collection.addNewModelToDB(data, self, callback);
          } else {
            data.tid = self.get('tid');
            self.collection.updateModelOnDB(data, self, callback);
          }
        }
      }),

      Email: Backbone.Model.extend({
        defaults: {
          tid: 0,
          dataCallback: null,
          entity_id: 0,
          primitiveTypeId: 7,
          email: ''
        },
        toDelete: false,
        validate: function(attrs) {
          if (Rep.regex.email.test(attrs.email) === false) {
            return 'Please enter a valid email';
          }
        },
        deleteModel: function(callback) {
          var self = this,
              data = {},
              mod;
          data.data = [];
          data.dataCallback = self.get('dataCallback');
          data.deleteOne = function() {
            self.collection.remove(self);
          };
          if (self.get('tid') !== 0) {
            data.data.push(self.get('tid'));
            self.collection.deleteModelFromDB(data, self, callback);
          }
        },
        submitModel: function(callback) {
          var self = this,
              data = {
                dataCallback: this.get('dataCallback'),
                entity_id: this.get('entity_id'),
                primitiveTypeId: this.get('primitiveTypeId'),
                type: "Email",
                data: '\"'+this.get('email')+'\"'
              };

          data.dataCallback = self.get('dataCallback');

          if (self.get('tid') === 0) {
            self.collection.addNewModelToDB(data, self, callback);
          } else {
            data.tid = self.get('tid');
            self.collection.updateModelOnDB(data, self, callback);
          }
        }
      }),

      Name: Backbone.Model.extend({
        defaults: {
          tid: 0,
          dataCallback: null,
          entity_id: 0,
          primitiveTypeId: 9,
          first: '',
          middle: '',
          last: '',
          suffix: '',
          prefix: ''
        },
        toDelete: false,
        validate: function(attrs) {
          if (attrs.first === '' || attrs.last === '') {
            return 'Please include first and last name';
          }
          Rep.log('name validating');
          Rep.log(attrs);
          if (Rep.regex.names.test(attrs.first) === false || 
              Rep.regex.names.test(attrs.middle) === false || 
              Rep.regex.names.test(attrs.last) === false) {
            Rep.log('false');
            return "Please only use letters, single quotes and hyphens";
          } else {
            Rep.log('true');
          }
        },
        deleteModel: function(callback) {
          var self = this,
              data = {},
              mod;
          data.data = [];
          data.dataCallback = self.get('dataCallback');
          data.deleteOne = function() {
            self.collection.remove(self);
          };
          if (self.get('tid') !== 0) {
            data.data.push(self.get('tid'));
            self.collection.deleteModelFromDB(data, self, callback);
          }
        },
        submitModel: function(callback) {
          var self = this,
              data = {
                entity_id: self.get('entity_id'),
                primitiveTypeId: self.get('primitiveTypeId'),
                type: "Name",
                data: JSON.stringify({
                  first: self.get('first'),
                  middle: self.get('middle'),
                  last: self.get('last'),
                  suffix: self.get('suffix'),
                  prefix: self.get('prefix')
                })
              };

          data.dataCallback = self.get('dataCallback');
              
          if (self.get('tid') === 0) {
            self.collection.addNewModelToDB(data, self, callback);
          } else {
            data.tid = self.get('tid');
            self.collection.updateModelOnDB(data, self, callback);
          }
        }
      }),

      Birthday: Backbone.Model.extend({
        defaults: {
          tid: 0,
          dataCallback: null,
          entity_id: 0,
          primitiveTypeId: 18,
          month: '',
          day: '',
          year: ''
        },
        toDelete: false,
        validate: function(attrs) {
          var da = new Date(attrs.year, attrs.month - 1, attrs.day);
          if ((da.getFullYear() !== parseInt(attrs.year) || da.getMonth() !== parseInt(attrs.month - 1) || da.getDate() !== parseInt(attrs.day))) {
            return "No such date.  Please enter a valid date for your birthday.";
          }
        },
        deleteModel: function(callback) {
          var self = this,
              data = {},
              mod;
          data.data = [];
          data.dataCallback = self.get('dataCallback');
          data.deleteOne = function() {
            self.collection.remove(self);
          };
          if (self.get('tid') !== 0) {
            data.data.push(self.get('tid'));
            self.collection.deleteModelFromDB(data, self, callback);
          }
        },
        submitModel: function(callback) {
          var self = this,
              data = {
                entity_id: self.get('entity_id'),
                primitiveTypeId: self.get('primitiveTypeId'),
                type: "Birthday",
                data: JSON.stringify({
                  month: self.get('month'),
                  day: self.get('day'),
                  year: self.get('year')
                })
              };
              
          data.dataCallback = self.get('dataCallback');

          if (self.get('tid') === 0) {
            self.collection.addNewModelToDB(data, self, callback);
          } else {
            data.tid = self.get('tid');
            self.collection.updateModelOnDB(data, self, callback);
          }
        }
      }),

      NonUsAddress: Backbone.Model.extend({
        defaults: {
          tid: 0,
          dataCallback: null,
          entity_id: 0,
          primitiveTypeId: 6,
          state: '',
          country: ''
        },
        toDelete: false,
        validate: function(attrs) {
          if (attrs.city === '' || attrs.country === '') {
            return 'Please include city and country.';
          }
        },
        deleteModel: function() {
          var self = this,
              data = [];
          if (self.get('tid') !== 0) {
            data.push(self.get('tid'));
            self.collection.deleteModelFromDB(data);
          }
        }
      })

    }
  }
});