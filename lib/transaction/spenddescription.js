'use strict';

var _ = require('lodash');
var $ = require('../util/preconditions');
var BN = require('../crypto/bn');
var buffer = require('buffer');
var BufferWriter = require('../encoding/bufferwriter');
var BufferUtil = require('../util/buffer');
var JSUtil = require('../util/js');

function SpendDescription(params) {
  if (!(this instanceof SpendDescription)) {
    return new SpendDescription(params);
  }
  if (params) {
    return this._fromObject(params);
  }
}

SpendDescription.fromObject = function(obj) {
  $.checkArgument(_.isObject(obj));
  var spenddesc = new SpendDescription();
  return spenddesc._fromObject(obj);
};

SpendDescription.prototype._fromObject = function(params) {
  // TODO: Populate from parameters, but for now it's ok to do nothing.
  return this;
};

SpendDescription.prototype.toObject = SpendDescription.prototype.toJSON = function toObject() {
  // TODO: Populate JSON object, but for now it's ok to return a placeholder.
  var obj = {};
  return obj;
};

SpendDescription.fromBufferReader = function(br) {
  var obj = new SpendDescription();
  obj.cv = br.read(32);
  obj.anchor = br.read(32);
  obj.nullifier = br.read(32);
  obj.rk = br.read(32);
  obj.proof = br.read(48 + 96 + 48);
  obj.spendAuthSig = br.read(64);
  return obj;
};

SpendDescription.prototype.toBufferWriter = function(writer) {
  var i;
  if (!writer) {
    writer = new BufferWriter();
  }
  writer.write(this.cv);
  writer.write(this.anchor);
  writer.write(this.nullifier);
  writer.write(this.rk);
  writer.write(this.proof);
  writer.write(this.spendAuthSig);
  return writer;
};

module.exports = SpendDescription;
