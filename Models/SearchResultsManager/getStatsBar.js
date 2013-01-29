_.extend(main.app.SearchResultsManager,{
  GetStatsBar: {
    Collection: Backbone.Collection.extend({
      count: 0, 
      total: 3,
      requestData:{},
      initialize:function(data){
        this.requestData=data;
        var makeRequest=this.requestData;
        this.getData(makeRequest);
      },
      getData:function(data){
        var self = this,
            Model;
        Rep.log("data score request is");
        
        Rep.log(data.scoreRequest);
        Backbone.clearCollection(self);
        Model = new app.GetStatsBar.Model();
        self.add(Model); 
        self.getMonthlySearches(data);
        self.getPercentdataSold(data);
        self.getUrlScore(data);
        Model.bindChange();
        
      },
      getUrlScore:function(data){
        Rep.log('Calculating grade');
        Rep.log(data);
        var self=this;
        try {
           
            Rep.api.call(
              "GoldStar",
              "calculateScore",
              {
                 "request":JSON.stringify({
                   "urls":data.scoreRequest,
                   "searchTerm":data.searchTerm
                 }),
                
              },
              function(r){
               
                  self.models[0].set({goldstarscore:r.result.currentGrade});
                  
                  self.count=self.count+1;
                  Rep.log("count is");
                  Rep.log(self.count);
                  if(self.count===self.total){
                      self.count=0;  
                     
                    self.doneProcessing(data);

                  }
              }
               
              
            );
        }catch(err){
          
        }
      },
      
      getMonthlySearches:function(data){
        var self = this,m,defaultSearches=0;
        try{
          
          Rep.api.call(
            "MEAdWords",
            "getMonthlyGraphData",
            {
              "request": JSON.stringify({
                "searchTerm": data.searchTerm,
//                  "searchTerm":"Mitt Romney",
                "country": "US", 
                "language": "en"
              })
            },
            function(r){
              Rep.log('getMonthlySearches');
              Rep.log(r);
              if (r.code !== 1) {
                var searches= [];
                if(r.result===0){
                  self.models[0].set({monthlysearches:r.result});
                }else{
                 
                  $.each(r.result,function(key,value){
                    searches.push(value);
                    
                  });
//                  Rep.log(searches);
                  if(searches.length > 0){
                    self.models[0].set({monthlysearches:searches[searches.length-2]});
                  }
                  else{
                    self.models[0].set({monthlysearches:defaultSearches});
                  }
                }
                
                self.count = self.count + 1;
                Rep.log("count is");
                Rep.log(self.count);
                if (self.count === self.total){
                    self.count=0;
                    //searchresults.app.search.StatsBarRequest.render(searchresults.app.search.barCollection.models);
                  self.doneProcessing(data);
                }
              }
            }
          );
        } catch(err){

        }
      },
      getPercentdataSold:function(data) {
        var self = this, m =0;
        try {
          Rep.api.call("SearchResultsManager",
            "getPercentSellingDomains",
            {
              "entityId":data.eid,
              "searchTerm":data.searchTerm 
            },
            function(r){
              
              self.models[0].set({datasold: Math.ceil(r.result)});
              self.count = self.count + 1;
              Rep.log("count is");
              Rep.log(self.count);
              if (self.count === self.total){
//                self.models[0].bindChange();
                self.count=0;
                self.doneProcessing(data);
                //searchresults.app.search.StatsBarRequest.render(searchresults.app.search.barCollection.models);
              }
              
            }
          );
        } catch(err){
           
        }
      },
      doneProcessing: function(data) {
        var self = this;
        if (typeof(data.callback) === "function") {
          data.callback(self);
        }
      }
    }),
    Model: Backbone.Model.extend({
      defaults: {
        mnmpercentage: "",
        datasold: "",
        monthlysearches: "",
        goldstarscore:""
      },
      attributesChanged: function() {
        Rep.log('We have bound a change');
      },
      bindChange: function() {
        Rep.log('Binding change event');
        this.bind("change", this.attributesChanged);
      }
    })
  }
});

