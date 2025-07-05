import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IMessage extends Document {
  // A more robust way is to have a Conversation ID
  conversationId: mongoose.Types.ObjectId; // Refers to a Match ID or a dedicated Conversation Model ID

  // Simpler alternative: store sender and receiver directly if no separate Conversation model
  // sender: mongoose.Types.ObjectId;    // Ref to User
  // receiver: mongoose.Types.ObjectId;  // Ref to User

  sentBy: mongoose.Types.ObjectId; // User who sent the message
  text?: string; // Text content of the message
  imageUrl?: string; // URL if the message is an image
  // other media types can be added e.g. videoUrl, audioUrl

  readBy: mongoose.Types.ObjectId[]; // Array of User IDs who have read this message

  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      // Typically this would ref 'Match' if matches are your conversations,
      // or a dedicated 'Conversation' model if you create one.
      // For now, let's assume it can be a Match ID.
      ref: 'Match',
      required: true,
      index: true,
    },
    // sender: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
    // receiver: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
    sentBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    imageUrl: {
      type: String,
    },
    readBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Ensure at least one content type is present
  },
  {
    timestamps: true,
  }
);

MessageSchema.pre<IMessage>('save', function(next) {
  if (!this.text && !this.imageUrl) {
    next(new Error('Message must have either text or an image.'));
  } else {
    next();
  }
});

// Index for fetching messages in a conversation, sorted by time
MessageSchema.index({ conversationId: 1, createdAt: -1 });

const MessageModel: Model<IMessage> = models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
