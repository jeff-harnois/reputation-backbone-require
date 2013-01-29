_.extend(main.app.Janus, {
  GetAlbums: {
    Collection: Backbone.Collection.extend({
      initialize: function(data) {
        var albums = [],
            self = this;
        Rep.api.call(
          "Janus",
          "getSearchAlbums",
          {"fb_id": data.FBid, "entity_id": data.eid},
          function(r) {
            Rep.log('getAlbums');
            Rep.log(r);
            _.each(r.result, function(val, key) {
              if (val.username !== null) {
                _.each(val.albums, function(v, k) {
                  albums.push(v + " by " + val.username);
                });
              }
            });
            if (typeof(data.callback) === "function") {
              data.callback(albums);
            }
          }
        );
      }
    })
  }
});