_.extend(main.app.MyPrivacyManager, {
  LoadEntityAttributes: {
    Collection: Backbone.Collection.extend({
      initialize: function(data) {
        var self = this;
        Rep.api.call(
          'MyPrivacyManager',
          'loadEntityAttributes',
          {req: {"entity_id": data.eid, "selection": data.type}},
          function(r) {
            Rep.log('LoadEntityAttributes');
            Rep.log(r);
            Backbone.clearCollection(self);
            if (r.code === 0) {
              // make sure we have at least one address, email or phone
              // r.result = {"entity_id":165919,"names":null,"addresses":[{"entity_attribute_id":null,"entity_attributes_meta_info_id":"29191267","primitive_type_id":"6","value":"9 Main St||Cupertino|CA|US|95014||||","attribute_status":"0","num_search_sources":1,"num_records_found":1,"num_pending_remove":"0","num_confirmed_remove":"0","first_found_date":"2012-09-27 17:49:07","first_protected_date":0,"auto_protected_date":0,"sources_found":["999"]},{"entity_attribute_id":null,"entity_attributes_meta_info_id":"29191268","primitive_type_id":"6","value":"202 Calvert Dr||Cupertino|CA|US|95014||||","attribute_status":"0","num_search_sources":2,"num_records_found":2,"num_pending_remove":"0","num_confirmed_remove":"0","first_found_date":"2012-09-27 17:49:07","first_protected_date":0,"auto_protected_date":0,"sources_found":["1","28"]},{"entity_attribute_id":null,"entity_attributes_meta_info_id":"29191269","primitive_type_id":"6","value":"5800 Arlington Ave||Bronx|NY|US|10471||||","attribute_status":"0","num_search_sources":1,"num_records_found":1,"num_pending_remove":"0","num_confirmed_remove":"0","first_found_date":"2012-09-27 17:49:07","first_protected_date":0,"auto_protected_date":0,"sources_found":["28"]}],"birthdays":null,"emails":[{"entity_attribute_id":"1968278","entity_attributes_meta_info_id":"29191276","primitive_type_id":"7","value":"repdef3+pyrite30@gmail.com","attribute_status":"1","num_search_sources":0,"num_records_found":1,"num_pending_remove":0,"num_confirmed_remove":0,"first_found_date":0,"first_protected_date":0,"auto_protected_date":0,"sources_found":null}],"phones":[{"entity_attribute_id":"1962637","entity_attributes_meta_info_id":"29268908","primitive_type_id":"26","value":"","attribute_status":"0","num_search_sources":0,"num_records_found":1,"num_pending_remove":0,"num_confirmed_remove":0,"first_found_date":0,"first_protected_date":0,"auto_protected_date":0,"sources_found":null},{"entity_attribute_id":"1962675","entity_attributes_meta_info_id":"29268909","primitive_type_id":"26","value":"(408) 421-9089","attribute_status":"0","num_search_sources":0,"num_records_found":1,"num_pending_remove":0,"num_confirmed_remove":0,"first_found_date":0,"first_protected_date":0,"auto_protected_date":0,"sources_found":null}],"educations":null,"positions":null,"ages":null,"genders":null,"relatives":null,"others":null};
              if (r.result.addresses !== null || r.result.emails !== null || r.result.phones !== null) {
                self.saveModel(r.result, data);
              }
            }
            if (typeof(data.callback) === "function") {
              data.callback(self);
            }
          }
        );
      },
      saveModel: function(info, data) {
        var self = this,
            Model = null,
            str = '',
            value;
        self.num = 0;
        // process the data
        _.each(info, function(v, k) {
          // grab only addresses, emails and phones
          if (k === "addresses" || k === "emails" || k === "phones") {
            _.each(v, function(val, key){

              // look through the obj and set up a model
              Model = new app.LoadEntityAttributes.Model();

              if (val.value) {
                // if it is an address, split the string
                if (k === "addresses") {
                  str = val.value;
                  value = str.split("|").join(" ");

                  // save the value
                  Model.set({attribute: value});
                } else {

                  // save the value
                  Model.set({attribute: val.value});
                }

                // this is how many sites this was found on
                if (val.num_search_sources > 0) {
                  Model.set({num: val.num_search_sources});
                  if (val.num_search_sources > 1) {
                    Model.set({sites: 'sites'});
                  }
                }

                // places this was found
                if (val.sources_found) {
                  Model.set({source: val.sources_found});
                }

                // type for the icon
                if (k === "addresses") {
                  Model.set({attribute_type:'address'});
                } else if (k === "phones") {
                  Model.set({attribute_type:'phone'});
                } else if (k === "emails") {
                  Model.set({attribute_type:'email'});
                }

                // backend id
                Model.set({id: val.entity_attributes_meta_info_id});

                // based on entitlement, if they get protect or monitor
                if (data.canProtect === "true") {
                  Model.set({canProtect: "can"});
                }

                // if this is not a callback record
                if (val.num_records_found > 0) {
                  self.num = self.num + 1;
                  if (self.models.length <= data.limit) {
                    self.add(Model);
                  }
                }
              }
            });
          }
        });
        return self;
      }
    }),
    Model: Backbone.Model.extend({
      // this is the model data structure
      defaults: {
        attribute: null,
        num: 1,
        attribute_type: null,
        source: [999],
        id: '',
        sites: 'site',
        canProtect: false
      }
    })
  }
});