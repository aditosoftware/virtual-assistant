class Message {
  // * create a new empty object
  constructor() {
    this.imageUrl = null;
    this.imageAlt = null;
    this.messageText = null;
    this.messageAudio = null;
    this.isMyMessage = null;
    this.isAudioMessage = null;
    this.queryText = null;
    this.createdAt = null;
    this.aditoUserId = null;
    this.usertoken = null;
    this.isPlaying = null;
  }

  // * init object with given data
  initModel(data) {
    this.imageUrl = data.imageUrl;
    this.imageAlt = data.imageAlt;
    this.messageText = data.messageText;
    this.messageAudio = data.messageAudio;
    this.isMyMessage = data.isMyMessage;
    this.isAudioMessage = data.isAudioMessage;
    this.queryText = data.queryText;
    this.createdAt = data.createdAt;
    this.aditoUserId = data.aditoUserId;
    this.usertoken = data.usertoken;
    this.isPlaying = data.isPlaying;
  }

  // * fill an already existing object with the given fields
  fill(newFields) {
    for (let field in newFields) {
      if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
        if (this[field] !== 'undefined') {
          this[field] = newFields[field];
        }
      }
    }
  }

  // * checks if the given message is valid and therefore usable for the virtual assistant
  isValid() {
    if (!this.aditoUserId) {
      return false;
    }
    return true;
  }
}

module.exports = Message;
