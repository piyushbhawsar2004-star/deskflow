import mongoose from 'mongoose';
import validator from 'validator';

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address']
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be one of: low, medium, high, urgent'
      },
      required: [true, 'Priority is required']
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in_progress', 'resolved', 'closed'],
        message: 'Status must be one of: open, in_progress, resolved, closed'
      },
      default: 'open'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: false
  }
);

// Pre-save middleware to validate transitions
ticketSchema.pre('save', async function(next) {
  if (!this.isModified('status')) return next();

  const originalTicket = await mongoose.model('Ticket').findById(this._id);
  if (!originalTicket) return next();

  const currentStatus = originalTicket.status;
  const newStatus = this.status;

  // Define valid transitions
  const validTransitions = {
    'open': ['in_progress'],
    'in_progress': ['resolved', 'open'],
    'resolved': ['closed', 'in_progress'],
    'closed': []
  };

  if (!validTransitions[currentStatus].includes(newStatus)) {
    return next(new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`));
  }

  // Set resolvedAt when transitioning to resolved
  if (newStatus === 'resolved' && currentStatus !== 'resolved') {
    this.resolvedAt = new Date();
  }

  // Clear resolvedAt when transitioning back to in_progress
  if (newStatus === 'in_progress' && currentStatus === 'resolved') {
    this.resolvedAt = null;
  }

  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
