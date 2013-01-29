/* Code to retrieve google hits for individual search terms - alternate names for the user that the user wants to look up on google.  see also getSearchTerms to get terms to search for. Guide to the unintuitive names:
Collection (singular) - a collection of collections, one for each page on the Search Results page
HitList - a collection of models, holds (10?) Hit hits
Hit - a Google (or bing?) hit */

_.extend(main.app.SearchResultsManager, {
  GetSearchResults: {
    Collection: Backbone.Collection.extend({
      requestData:{},
      createModels: function(info, data){
        var self = this,
            Hit = null,
            num = 0,
            remaining = 0,
            i = 0,
            maxPerPage = 9,
            collectionOne,
            collectionTwo;
            
        Backbone.clearCollection(self);

        collectionOne = new app.GetSearchResults.HitList();
        collectionTwo = new app.GetSearchResults.HitList();
        self.add(collectionOne);
        self.add(collectionTwo);
 

        _.each(info.results, function(val, key) {
          if (collectionOne.models.length <= maxPerPage || collectionTwo.models.length <= maxPerPage) {
            Hit = new app.GetSearchResults.Hit();
            Hit.set({title: val.title});
            Hit.set({url: val.Url});
            Hit.set({desc: val.description});
            Hit.set({rank: val.rank});
            Hit.set({timestamp: val.timestamp});
            Hit.set({eid: data.eid});
            if (val.meNotMeValue === 2) {
              // Rep.log(val.meNotMeValue);
              Hit.set({menotmevalue: "me"});
            } else if (val.newoldValue === 1) {
              Hit.set({newoldvalue: "new"});
            }
            Hit.bindChange();
            if (collectionOne.models.length <= maxPerPage) {
              collectionOne.add(Hit);
            } else if (collectionTwo.models.length <= maxPerPage) {
              collectionTwo.add(Hit);
            }
          }
          num = num + 1;
        });

        // add blank models to the collection if we are short
        var collen = collectionOne.models.length;
        if (collen < 10) {
          remaining = (10 - collen);
          for (i = 0; i < remaining; i++) {
            collectionOne.add(new app.GetSearchResults.Hit());
          }
        }
        // add blank models to the second collection if we are short
        collen = collectionTwo.models.length;
        if (collen > 1 && collen < 10) {
          remaining = (10 - collen);
          for (i = 0; i < remaining; i++) {
            collectionTwo.add(new app.GetSearchResults.Hit());
          }
        }
      },
      getData: function(data) {
//        Rep.log('initialize');
//        Rep.log(data);
        
        var self = this,
            i;
        self.requestData=data;
        Rep.api.call(
          "SearchResultsManager",
          "getSearchResults",
          {
            "entityID": data.eid,
            "searchTerm": data.searchTerm,
            "atts": JSON.stringify({
              "start": 0, 
              "limit": 20, 
              "engine": data.currentEngine
            })
          },
          function(r) {
            if (r.result.status === 0) {
              self.createModels(r.result, data);
              if (typeof(data.callback) === "function") {
                data.callback(self);
              }
            } else if (r.result.status === 1) {
              if (typeof(data.callback) === "function") {
                data.callback("noresults");
              }
            } else {
              if (typeof(data.callback) === "function") {
                data.callback("waiting");
              }
            }
          }
        );
      },
      initialize: function(data) {
//        Rep.log('data is ---');
//        Rep.log(data);
        this.getData(data);
      }
    }),
    
    HitList: Backbone.Collection.extend({}),
    
    Hit: Backbone.Model.extend({
      defaults: {
        title: "&nbsp;",
        url: "&nbsp;",
        desc: "&nbsp;",
        rank: 0,
        timestamp: "",
        menotmevalue: null,
        newoldvalue: null,
        clicked: 0,
        eid: null,
        imageUrl: null
      },
      attributesChanged: function() {
        
        var self = this,newmnmpercentage,oldmnmpercentage,m;
        if (this.hasChanged("menotmevalue")) {
          var me = this.get("menotmevalue"),
             
             mnm = 0;
          Rep.log('me value is'+ me);
          if (me === null || me ==="notme") {
            mnm = 1;
            
          }else{
             mnm=2;
          }
          
          Rep.api.call(
            "SearchResultsManager",
            "setMeNotMeValue",
            {
              "entityID": self.get("eid"),
              "url": self.get("url"),
              "mnm": mnm
            }, 
            function(r) {
              
              
            }
          );
        }
      },
      bindChange: function() {
 
          this.bind("change", this.attributesChanged);
      }
    })
  }
});