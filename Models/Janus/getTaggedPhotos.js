_.extend(main.app.Janus, {
  GetTaggedPhotos: {
    Collection: Backbone.Collection.extend({
      initialize: function(data) {
        var self = this,
            photos = [];
        Rep.api.call(
          "Janus",
          "getTaggedPhotos",
          {"fb_id": data.eid},
          function(r) {
            Rep.log('getTagged');
            Rep.log(r);
            for (var i = 0; i <= r.result.length; i++) {
              photos.push({ID: "p"+(i+1), photo: r.result[i]});
            }
            var d = {photos: photos};
            if (typeof(data.callback) === 'function') {
              data.callback(d);
            }
          }
        );
      }
    })
  }
});