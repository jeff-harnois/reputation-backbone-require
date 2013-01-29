/* Interface to retrieve and manage (via ajax) the list of search terms - alternate names for the user that the user wants to look up on google.  see also getSearchResults for the actual searching. 

GetSearchTerms.Collection is the class for the list itself, Model for each term.
*/

_.extend(main.app.SearchResultsManager, {
  GetSearchTerms: {
    Collection: Backbone.Collection.extend({
    
      // humanInfo has user's entity id, and a callback for when the data arrives from the server
      initialize: function(humanInfo) {
        Rep.log('initialize');
        this.getData(humanInfo);
      },
      
      // call server to get the search terms for this user, as seen in the search results menu
      getData: function(humanInfo) {
        var self = this;
            
        try {
          Rep.api.call(
            "SearchResultsManager",
            "getAllSearchTerms",
            {
              "entityID": humanInfo.eid
            },
            function(r){
//              Rep.log('getData');
              Rep.log((r.result));
              if (r.result.length > 0){
                Rep.log("Result from getAllST: ");Rep.dir(r.result);////
                Backbone.clearCollection(self);
                self.saveModels(r.result, humanInfo);
                if (typeof(humanInfo.callback) === "function") {
                  humanInfo.callback(self);
                }
              }
            }
          );
        } catch(err) {
            
        }
      },
      
      // add search term(s) to this Collection
      // newTerms is either a string or an array or object of strings
      // humanInfo has the entity id for current user
      addModel: function(newTerms, humanInfo) {
        var self = this,
            Model = null;
        
        if (this.length < 4) {
          if (typeof(newTerms) === 'string') {
            Model = new app.GetSearchTerms.Model();
            Model.set({eid: humanInfo.eid});
            Model.set({term: newTerms});
            self.add(Model);
          } else {
            _.each(newTerms, function(v,k) {
              if (v !== '') {
                Model = new app.GetSearchTerms.Model();
                Model.set({eid: humanInfo.eid});
                Model.set({term: v});
              }
              self.add(Model);
            });
          }
        }

        return true;
      },
      
      // from the termlist (just an array of term strings), construct this collection
      saveModels: function(termList, humanInfo) {
        var self = this,
            m;
        m = new app.GetSearchTerms.DefaultModel();
        self.add(m);
        _.each(termList, function(term,k) {
          self.addModel(term, humanInfo);
        });

        this.bindChange();

        return this;
      },
      
      // fired when a new term is added to this collection
      modelAdded: function(model, options) {
        var self = this,
            searchTermList = [];
        searchTermList.push({oldTerm: '', newTerm: model.get("term")});
        self.saveUpdate(searchTermList);
        return true;
      },
      
      // fired when anything (?) changes in this collection
      // We are passed the specific term's model from the collection that changed
      modelChanged: function(model) {
        var self = this,
            previousTerm,
            searchTermList = [];
        if (model.hasChanged("term")){
          previousTerm = model.previous("term");
          if (previousTerm !== model.get("term")){
            if (previousTerm !== "" && model.get("term") === ""){
                self.deleteTerm(model, previousTerm);
            } else {
                searchTermList.push({oldTerm: previousTerm, newTerm: model.get("term")});
                self.saveUpdate(searchTermList);
            }
          }
        }
      },
      
      // gets rid of one of the user's search terms
      deleteTerm:function(model, previousTerm){
        var self = this;
        Rep.api.call(
          "SearchResultsManager",
          "deleteSearchTerm",
          {
            "entityID": model.get("eid"),
            "searchTerm": previousTerm
          },
          function(r){
             self.remove(model);

              // update time for the whole collection is stored in [0]
             self.models[0].set({lastUpdatedTime : new Date().getTime()});
          }
        );
      },
      
      // send a searchterm update to server, typically a new term or a replaced term.
      // searchTermList=[{oldTerm: 'foo', newTerm: 'bar'}]
      saveUpdate: function(searchTermList) {
        var self = this;
        
          // note that, on server, term slot is identified by old term value; therefore it's ambiguous if more than 
          // one matches!  Server sends back failure if there's a duplicate and leaves unchanged.
          Rep.api.call(
          "SearchResultsManager",
          "addEditSearchTerm",
          {
            "entityID": self.models[1].attributes.eid,
            "termsList": searchTermList
          }, 
          function(r) {
                Rep.log("Result from addEditSearchTerm: ");Rep.dir(r.result);////
            Rep.log('saveUpdate');
            Rep.log(r);
            self.models[0].set({lastUpdatedTime: new Date().getTime()});
          }
        );
      },
      
      // reattaches event handlers, cuz every time data comes in we totally recreate all our models
      bindChange: function() {
        this.bind("change", this.modelChanged);
        this.bind("add", this.modelAdded, this);
      }
    }),
    
    // the lame model that's always model 0 in the terms collection.
    // Somebody uses that lastUpdatedTime somewhere.
    DefaultModel: Backbone.Model.extend({
        defaults:{
            lastUpdatedTime:0
        }
    }),
    
    // this one is models 1, 2, ... that actually have search terms.  term='' means not used.  
    // eids all the same for all the uses I know about.
    Model: Backbone.Model.extend({
      defaults: {
        term: "",
        eid: null
      }
    })
  }
});