function PubSub () {
  this.topics = {};
}

PubSub.prototype.subscribe = function (topic, callback) {
  this.topics[topic] || (this.topics[topic] = []);
  this.topics[topic].push(callback);
};

PubSub.prototype.publish = function (topic, params) {
  var callbacks;

  callbacks = this.topics[topic] || [];
  callbacks.forEach(function (callback) {
    callback(params);
  });
};
