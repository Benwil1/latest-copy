import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IMatch extends Document {
  user1: mongoose.Types.ObjectId; // User who initiated the like/swipe
  user2: mongoose.Types.ObjectId; // User who was liked/swiped
  // OR, if it's a listing match:
  // userId: mongoose.Types.ObjectId;
  // listingId: mongoose.Types.ObjectId;

  status: 'pending' | 'matched' | 'blocked_by_user1' | 'blocked_by_user2' | 'unmatched';
  // 'pending' means user1 liked user2, waiting for user2 to like back for a 'matched' status.
  // Could also be a direct 'matched' if it's for a listing, or if your system auto-matches.

  matchedAt?: Date; // Date when the status became 'matched'
  lastMessageAt?: Date; // To sort conversations by recent activity

  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema: Schema<IMatch> = new Schema(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // userId: { // For listing matches
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    // },
    // listingId: { // For listing matches
    //   type: Schema.Types.ObjectId,
    //   ref: 'Listing',
    // },
    status: {
      type: String,
      enum: ['pending', 'matched', 'blocked_by_user1', 'blocked_by_user2', 'unmatched'],
      default: 'pending',
      required: true,
    },
    matchedAt: {
      type: Date,
    },
    lastMessageAt: { // Useful for sorting active chats
        type: Date,
        default: Date.now
    }
  },
  {
    timestamps: true,
  }
);

// Ensure a unique combination of user1 and user2 to prevent duplicate pending matches.
// If order doesn't matter (user1 liking user2 is same as user2 liking user1 before matching),
// you might need a pre-save hook to always store IDs in a consistent order (e.g., alphabetically).
// For a typical swipe-to-match system, user1 -> user2 is one potential match record,
// and user2 -> user1 is another. When both exist and are 'pending', they become 'matched'.
MatchSchema.index({ user1: 1, user2: 1 }, { unique: true });
MatchSchema.index({ user2: 1, user1: 1 }, { unique: true }); // If you want to enforce strict one-way liking first.
                                                            // Or handle this logic in service layer.

// Index for querying matches for a user
MatchSchema.index({ user1: 1, status: 1 });
MatchSchema.index({ user2: 1, status: 1 });
MatchSchema.index({ lastMessageAt: -1 });


// Pre-save hook to set matchedAt when status changes to 'matched'
MatchSchema.pre<IMatch>('save', function (next) {
  if (this.isModified('status') && this.status === 'matched' && !this.matchedAt) {
    this.matchedAt = new Date();
  }
  next();
});

const MatchModel: Model<IMatch> = models.Match || mongoose.model<IMatch>('Match', MatchSchema);

export default MatchModel;
