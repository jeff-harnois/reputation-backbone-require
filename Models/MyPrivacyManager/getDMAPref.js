_.extend(main.app.MyPrivacyManager, {
  GetDMAPref: {
    Collection: Backbone.Collection.extend({
      saveDMAModel: function(data,preferences) {
        var self = this;
        Backbone.clearCollection(self);

        _.each(data, function(val, key) {
          var Model = new app.GetDMAPref.Model();
          if (val !== null) {
            Model.set({name: val});
          }
          Model.set({dma_id: key});

          self.comparator = function(Model) {
            return Model.get("name");
          };

          // add the model to the collection
          self.add(Model);
        });
        if (self.models.length > 0) {

          // check which ones are opted out already and add that to the model
          _.each(self.models, function(val, key) {
            if (preferences.hasOwnProperty(val.attributes.dma_id)) {
              val.set({blocked: true});
            }
          });

          self.gotCatalogs = true;
        }
      },
      initialize: function(data) {
        var userData = {},
            self = this,
            getCats = function() {
              Rep.api.call(
                "MyPrivacyManager",
                "getDMACatalogs",
                {"ids": ''},
                function(r) {
                  getOpt(r.result.catalogs);
                }
              );
            },
            getOpt = function(cats) {
              Rep.api.call(
                "MyPrivacyManager",
                "getDMACatalogsOptIn",
                {"entity_id": data.eid},
                function(r) {
                  self.saveDMAModel(cats, r.result.catalogs);
                  if (typeof(data.callback) === "function") {
                    data.callback(self);
                  }
                }
              );
            };
        getCats();
      },
    }),
    Model: Backbone.Model.extend({
      // this is the model data structure
      defaults: {
        name: '',
        dma_id: null
      }
    })
  }
});