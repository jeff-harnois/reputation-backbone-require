// this is the reputation-backbone-require common / helper functions

if (typeof rbr !== 'object') {
  rbr = {};
}

rbr.extractRoutes = function(hash, module) {
  // this function will handle all of the logic to determine which sub-route to use, 
  // as well as what options we need to pass along
  var Hash = hash.split('/'),
      numTrue = 0,
      options = [],
      routeFound,
      obj = {},
      resp = null;

  // first, loop through the array of the hashFragment that the main.app passed in,
  // and remove any empty strings
  _.each(Hash, function(e, i) {
    if (e === '') {
      Hash.splice(i, i+1);
    }
  });

  // then, loop through the module routes that were loaded in, and save them to their
  // own array, so that we can compare the two arrays to try and figure out a match, and 
  // save each route to obj so that we can reference them again.
  // the object is {functionName: ["part1","part2"]}
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
  
  // ok, hold on tight, we are going to compare the arrays now
  // first, loop through each portion of the object we just created
  _.each(obj, function(e, i) {

    // if the length of this current element of the object is the same length
    // as the hash array, then that's a good indication that this object is worth
    // looking in to.
    if (e.length === Hash.length) {

      // since the lengths of both arrays are the same, but it's possible to have more
      // than one route of the same length, we need to compare each element of the array
      // to the others and see if they match.  To accomplish this, we compare each element
      // to see if they match.  If they don't match, we look at the module's route for that
      // particular index and see if that happens to be :param.  If it is a :param, we assume
      // that the particular element we are evaluating matches, since a :param could be anything.
      numTrue = 0;
      _.each(e, function(el, ind){
        if (el === Hash[ind]) {
          // exact match
          numTrue = numTrue + 1;
        } else {
          // not an exact match
          // check if it's a param
          if (el.indexOf(':') !== -1) {
            // it's a param, incriment the number
            numTrue = numTrue + 1;

            // remove the : from the param and save it to the options array.  This is needed
            // so that if this is truely the correct route, we store what options are being
            // passed by the :params
            options.push(Hash[ind].replace(':',''));
          } else {

            // else this is not a match
            numTrue = numTrue - 1;
          }
        }
      });

      // now we check to make sure that the number of trues match the number of elements in the hash
      if (numTrue === Hash.length) {

        // the number matches, store the index of this object as the first part of the response, and
        // also store the options as set by the :params we looped through earlier
        resp = [i, options];
      }
    }
  });

  // return the resp, it will either be null or an array.
  return resp;
};