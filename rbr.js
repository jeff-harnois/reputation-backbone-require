if (typeof rbr !== 'object') {
  rbr = {};
}

rbr.extractRoutes = function(hash, module) {
  // this function will handle all of the logic to determine which sub-route to use, 
  // as well as what options we need to pass along
  var Arr = hash.split('/'),
      numTrue = 0,
      options = [],
      routeFound,
      obj = {},
      resp = null;
  _.each(Arr, function(e, i) {
    if (e === '') {
      Arr.splice(i, i+1);
    }
  });

  _.each(module.routes, function(e, i) {
    var a = [];
    a = i.split('/');
    _.each(a, function(el, ind) {
      if (el === '') {
        a.splice(ind, ind+1);
      }
    });
    
    obj[e] = a;
  });
  
  _.each(obj, function(e, i) {
    if (e.length === Arr.length) {
      numTrue = 0;
      _.each(e, function(el, ind){
        if (el === Arr[ind]) {
          numTrue = numTrue + 1;
        } else {
          if (el.indexOf(':') !== -1) {
            numTrue = numTrue + 1;

            options.push(Arr[ind].replace(':',''));
          } else {
            numTrue = numTrue - 1;
          }
        }
      });
      if (numTrue === Arr.length) {
        resp = [i, options];
      }
    }
  });
  return resp;
};