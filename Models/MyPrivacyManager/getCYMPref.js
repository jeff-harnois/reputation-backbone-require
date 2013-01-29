_.extend(main.app.MyPrivacyManager, {
  GetCYMPref: {
    Collection: Backbone.Collection.extend({
      initialize: function(collParams) {
        var self = this,
            // get optin prefs from server (not including individual catalogs)
            loadDMPrefs = function() {
              Rep.api.call(
                "MyPrivacyManager",
                "getDMACategoryPreferences",
                {"entity_id": collParams.eid},
                function(r) {
                  Rep.log('getDMACategoryPreferences');
                  Rep.log(r);
                  if (r.code) {
                    Rep.log("Error calling MyPrivacyManager:getDMACategoryPreferences: "+ r.code +": "+ r.message);
                    // IE8 was failing this.  now what... r.result is null
                  } else {
                    loadCatalogCount(r.result);
                  }
                }
              );
            },
            
            // get just the number of catalogs checked off
            loadCatalogCount = function(settings) {
              Rep.api.call(
                "MyPrivacyManager",
                "getDMACatalogsOptInCount",
                {"entity_id": collParams.eid},
                function(r) {
                  Rep.log('getDMACatalogsOptInCount');
                  Rep.log(r);
                  if (typeof(collParams.callback) === "function") {
                    var d = self.createCYMModel(settings, r.result);
                    collParams.callback(self, settings.preferences);
                  }
                }
              );
            };
        loadDMPrefs();
      },
      
      // save the direct mail optout modal settings into a Model and attach it to me, the collection
      // count=how many catalogs are checked
      createCYMModel: function(settings, count) {
        var self = this;
        Backbone.clearCollection(self);
        var Model = new app.GetCYMPref.Model();

        // [1] optout=All Catalogs or optin=Some Catalogs   [2]=optout=Junk Mail ticked   [3] = same as 2
        if (settings.preferences[2] === 'optout') {
          Model.set({mailOptOut: true});  // please get me off of junk mail lists
        }
        if (settings.preferences[1] === 'optout') {
          Model.set({catOptOut: true});  // please get me off of ALL catalog lists
          // for this one, optin means user has selected some, but not all, catalogs to cancel.  (maybe none!)
        }
        
        // if they have EVER set any of these, show the Edit button, else the Set button.
        // Never Set = junkmail off && catalogs=some && all catalog checkmarks off.
        // The user can recreate this state and get back to Set if they really want to.
        if (settings.preferences[1] === 'optout' || settings.preferences[2] === 'optout' || count > 0) {
          Model.set({text: 
            '<div class=donotdisturb-large-checkmark></div>\
            <p class=checkmark-paragraph>\
                Preferences applied to the first addresses (up to three) in \
                <a href="{{profileLink}}">Personal Data</a>.<div class=clear></div>\
              <a href=direct-mail/customize data-bypass=false \
              class="btn large primary">Edit Preferences</a>\
            </p>'});
          Model.set({customize: 'cust'});  // means, user has customized before, not a beginner
        } else {
          // if none are turned on, act as though user's never tried and show Set Prefs
          Model.set({text: 
            '<div class="module-cta can">\
              <a href="direct-mail/customize" data-bypass="false" class="btn large primary">\
                Set Preferences\
              </a>\
            </div>'});
        }
        // neither of these will show up if the user's not a Paid user.  See directmail.mustache
        if (count > 0) {
          Model.set({items: count});
        }

        self.add(Model);

        return true;
      }
    }),
    Model: Backbone.Model.extend({
      defaults: {
        // the text you get if you've never done any of this?!?  Is this even used?  no cuz the if-then-else always resets it
        text: 'You may receive mail offers and catalogs.'
      }
    })
  }
});
