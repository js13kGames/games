function denull(x) {
  return x ? x : 0;
}

function accum(x, y) {
  for(var i in y) {
    x[i] = denull(x[i]) + y[i];
  }
}

function dccum(x, y) {
  for(var i in y) {
    x[i] = denull(x[i]) - y[i];
  }
}

function calc_scale1(thing) {
  var scale = {};
  for(var i in thing.down) {
    if(denull(thing.up[i]) < 0.01) {
      if(thing.down[i] > 0.01) {
        scale[i] = 0;
      }
      continue;
    }
    if(thing.down[i] > 0) {
      scale[i] = denull(thing.up[i]) / thing.down[i];
    }
  }
  return scale;
}

function scale_of(thing, scale) {
  var scale = 1;
  for(var i in thing.down) {
    if(scale.hasOwnProperty(i)) {
      scale = Math.min(scale, scale[i]);
    }
  }
  return scale;
}

function mul(m, thing) {
  var scaled = {up: {}, down: {}};
  for(var i in thing.up) {
    scaled.up[i] = m*thing.up[i];
  }
  for(var i in thing.down) {
    scaled.down[i] = m*thing.down[i];
  }
  return scaled;
}

function scale_by(scale, thing) {
  var min = 1;
  for(var i in thing.down) {
    if(scale.hasOwnProperty(i)) {
      min = Math.min(min, scale[i]);
    }
  }
  return mul(min, thing);
}

function full_accum(sum, more) {
  accum(sum.up, more.up);
  accum(sum.down, more.down);
}

function sum_things(scale) {
  var sum = {up: {}, down: {}};
  full_accum(sum, scale_by(scale, mul(ship.crew, crew.eating)));
  full_accum(sum, scale_by(scale, mul(ship.crew, crew.drinking)));
  full_accum(sum, scale_by(scale, mul(ship.crew, crew.breathing)));
  for(var i = 0; i < rooms.length; ++i) {
    full_accum(sum, scale_by(scale, rooms[i]));
  }
  return mul(days_per_tick, sum);
}

function combine_scale(scale0, scale1) {
  var combined = {};
  for(var i in scale0) {
    combined[i] = scale1[i] ? scale0[i]*scale1[i] : scale0[i];
  }
  for(var i in scale1) {
    if(!scale0[i]) {
      combined[i] = scale1[i];
    }
  }
  return combined;
}

function changes(scale, new_scale) {
  for(var i in new_scale) {
    if(new_scale[i] < 0.0001 && scale.hasOwnProperty(i) && scale[i] < 0.0001) {
      continue;
    }
    if(new_scale[i] < 0.9999) {
      return true;
    }
  }
  return false;
}

function calc_scale() {
  var scale = {};
  var sum = sum_things(scale);
  accum(sum.up, ship);
  var new_scale = calc_scale1(sum);
  var bail = 1000;
  while(changes(scale, new_scale) && --bail) {
    scale = combine_scale(scale, new_scale);
    sum = sum_things(scale);
    accum(sum.up, ship);
    new_scale = calc_scale1(sum);
  }
  return scale;
}


