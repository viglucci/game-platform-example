class JSONCodec {
  mimeType = 'application/json';

  // eslint-disable-next-line class-methods-use-this
  decode(buffer) {
    return JSON.parse(buffer.toString());
  }

  // eslint-disable-next-line class-methods-use-this
  encode(entity) {
    return Buffer.from(JSON.stringify(entity));
  }
}

export default JSONCodec;
