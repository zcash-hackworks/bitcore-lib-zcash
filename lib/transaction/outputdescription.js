'use strict';

var _ = require('lodash');
var $ = require('../util/preconditions');
var BN = require('../crypto/bn');
var buffer = require('buffer');
var BufferWriter = require('../encoding/bufferwriter');
var BufferUtil = require('../util/buffer');
var JSUtil = require('../util/js');

// Sapling note magic values, copied from src/zcash/Zcash.h
var NOTEENCRYPTION_AUTH_BYTES = 16;
var ZC_NOTEPLAINTEXT_LEADING = 1;
var ZC_V_SIZE = 8;
var ZC_RHO_SIZE = 32;
var ZC_R_SIZE = 32;
var ZC_MEMO_SIZE = 512;
var ZC_DIVERSIFIER_SIZE = 11;
var ZC_JUBJUB_POINT_SIZE = 32;
var ZC_JUBJUB_SCALAR_SIZE = 32;
var ZC_NOTEPLAINTEXT_SIZE = ZC_NOTEPLAINTEXT_LEADING + ZC_V_SIZE + ZC_RHO_SIZE + ZC_R_SIZE + ZC_MEMO_SIZE;
var ZC_SAPLING_ENCPLAINTEXT_SIZE = ZC_NOTEPLAINTEXT_LEADING + ZC_DIVERSIFIER_SIZE + ZC_V_SIZE + ZC_R_SIZE + ZC_MEMO_SIZE;
var ZC_SAPLING_OUTPLAINTEXT_SIZE = ZC_JUBJUB_POINT_SIZE + ZC_JUBJUB_SCALAR_SIZE;
var ZC_SAPLING_ENCCIPHERTEXT_SIZE = ZC_SAPLING_ENCPLAINTEXT_SIZE + NOTEENCRYPTION_AUTH_BYTES;
var ZC_SAPLING_OUTCIPHERTEXT_SIZE = ZC_SAPLING_OUTPLAINTEXT_SIZE + NOTEENCRYPTION_AUTH_BYTES;

function OutputDescription(params) {
  if (!(this instanceof OutputDescription)) {
    return new OutputDescription(params);
  }
  if (params) {
    return this._fromObject(params);
  }
}

OutputDescription.fromObject = function(obj) {
  $.checkArgument(_.isObject(obj));
  var outputdesc = new OutputDescription();
  return outputdesc._fromObject(obj);
};

OutputDescription.prototype._fromObject = function(params) {
  // TODO: Populate from parameters, but for now it's ok to do nothing.
  return this;
};

OutputDescription.prototype.toObject = OutputDescription.prototype.toJSON = function toObject() {
  // TODO: Populate JSON object, but for now it's ok to return a placeholder.
  var obj = {};
  return obj;
};

OutputDescription.fromBufferReader = function(br) {
  var obj = new OutputDescription();
  obj.cv = br.read(32);
  obj.cmu = br.read(32);
  obj.ephemeralKey = br.read(32);
  obj.encCipherText = br.read(ZC_SAPLING_ENCCIPHERTEXT_SIZE);
  obj.outCipherText = br.read(ZC_SAPLING_OUTCIPHERTEXT_SIZE);
  obj.proof = br.read(48 + 96 + 48);
  return obj;
};

OutputDescription.prototype.toBufferWriter = function(writer) {
  var i;
  if (!writer) {
    writer = new BufferWriter();
  }
  writer.write(this.cv);
  writer.write(this.cmu);
  writer.write(this.ephemeralKey);
  writer.write(this.encCipherText);
  writer.write(this.outCipherText);
  writer.write(this.proof);
  return writer;
};

module.exports = OutputDescription;
