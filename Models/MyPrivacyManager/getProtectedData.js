_.extend(main.app.MyPrivacyManager, {
  GetProtectedData: {
    Collection: Backbone.Collection.extend({
      initialize: function(data){
        var self = this;
        self.getData(data);
      },
      getData: function(data) {
        var self = this,
            d;
        Rep.api.call(
          "MyPrivacyManager",
          "getProtectedData",
          {"req": {"entity_id": data.eid, "start_ix": data.start, "end_ix": data.chunk, action: data.action}},
          function(r) {
            Rep.log(r);
            Backbone.clearCollection(self);
            if (r.code === 0) {
              // data retrieve was successful, send it to be saved if there is any data inside the response
              if (r.result.records.length > 0) {
                d = self.saveModel(r.result, data);
              }
            }
            if (typeof(data.callback) === "function") {
              data.callback(self);
            }
          }
        );
      },
      saveModel: function(data, options) {
        var self = this,
            collection = self.collection,
            Model,
            dateF, d1, dateFo,
            dateR, d2, dateRe;

        // go through each object in the data returned
        _.each(data.records, function(val, key) {
          Model = new app.GetProtectedData.Model();

          // set all the data to the model
          if (val.source !== null) {
            Model.set({source: val.source});
          }
          if (val.addresses !== null) {
            Model.set({addresses: val.addresses, addressCount: val.addresses.length});
          }
          if (val.phones !== null) {
            Model.set({phones: val.phones, phoneCount: val.phones.length});
          }
          if (val.emails !== null) {
            Model.set({emails: val.emails, emailCount: val.emails.length});
          }
          if (options.canProtect === "true") {
            Model.set({canProtect: "can"});
          }
          Model.set({upgradeUrl: Rep.addBaseUrl('/secure/upgrade')});

          // process time to human readable
          if (val.dateFound !== 0) {
            dateF = Rep.getJStime(val.dateFound);
            d1 = new Date(dateF);
            dateFo = (d1.getMonth()+1)+'/'+d1.getDate()+'/'+d1.getFullYear();
            Model.set({dateFound: dateFo});
          }
          if (val.dateRemoved !== 0) {
            dateR = Rep.getJStime(val.dateRemoved);
            d2 = new Date(dateR);
            dateRe = (d2.getMonth()+1)+'/'+d2.getDate()+'/'+d2.getFullYear();
            Model.set({dateRemoved: dateRe});
            Model.set({removed: val.dateRemoved});
          } else {
            // add a pending class to the row for css rule
            Model.set({pending: "true"});
          }
          // add the model to the collection
          self.add(Model);
          self.loaded++;
        });

        self.record_ct = data.record_ct;

        return self;
      }
    }),
    Model: Backbone.Model.extend({
      // this is the model data structure
      defaults: {
        source: 0,
        dateFound: null,
        dateRemoved: null,
        removed: 9999999999,
        emails: undefined,
        phones: undefined,
        addresses: null,
        canProtect: false
      }
    })
  }
});

