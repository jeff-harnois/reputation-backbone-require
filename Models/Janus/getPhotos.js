_.extend(main.app.Janus, {
  GetPhotos: {
    Model: Backbone.Model.extend({
      defaults: {
        moreThan: function() {
          return function(text,render) {
            var num = render(text);
            if (num >= 25) {
              return '24+';
            }
            return num;
          };
        },
        time: function(){
          return function(t,render) {
            time = render(t);
            
            return Rep.prettyTime(time);
          };
        }
      }
    }),
    Collection: Backbone.Collection.extend({
      photosDone: false,

      getData: function (data) {
        var self = this;
        Rep.api.call(
          "RepStream",
          "get",
          {
            "appId": "RepStream",
            "entityId": data.eid,
            "request": JSON.stringify({
              "skip": 0,
              "limit": data.limit,
              "saveImpression": false,
              "returnImpressionData": false,
              "importanceValue": -1
            })
          },
          function(r) {
            Rep.log('stream');
            Rep.log(r);
            self.processModels(r.result, data);
            if (typeof(data.callback) === "function") {
                data.callback();
            }
          }
        );
      },
      processModels: function(data, context) {
        var col = context.currCol,
            self = this,
            da = [];
        _.each(data, function(val, key) {
          var eventDetails = unescape(val.data.eventDetails),
              Event = $.parseJSON(val.data.eventDetails),
              objectDetails = unescape(val.data.objectDetails),
              object = '';
          if (Event.status && Event.status === "done") {
            self.photosDone = true;
          }
          try {
            if (val.data.objectType === 'PHOTO_UNTAGGED' && !(Event.status)) {
              object = $.parseJSON(val.data.objectDetails);
              if (context.freeUser !== undefined && da.length < 5) {
                da.push(object);
              } else if (!context.freeUser) {
                da.push(object);
              }
            }
          } catch(e) {
            Rep.log('Stream Event is not an PHOTO_UNTAGGED, so we dont care about it: '+e);
          }
        });
        if (da.length > 0) {
          _.each(da, function(val) {
            if (self.where({source: val.url}).length === 0 && val.url !== undefined) {
              var model = new app.GetPhotos.Model();
              var from = false;
              if (val.album) {
                from.category = val.album.title;
                from.name = val.name;
              }
              Rep.log(val);
              model.set({comments: val.comments});
              model.set({likes: val.likes});
              model.set({created_time: val.created_time});
              model.set({updated_time: val.updated_time});
              model.set({from: from});
              model.set({height: val.height});
              model.set({width: val.width});
              model.set({face_height: val.face_height});
              model.set({face_width: val.face_width});
              model.set({x: val.x});
              model.set({y: val.y});
              model.set({source: val.url});
              model.set({URL: val.photoPageLink});
              Rep.log(model);
              self.add(model);
            }
          });
        }
        return this;
      }
    })
  }
});
