import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a transaction title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    validate: {
      validator: function(value) {
        return value !== 0;
      },
      message: 'Amount cannot be zero'
    }
  },
  type: {
    type: String,
    required: [true, 'Please provide transaction type'],
    enum: ['income', 'expense'],
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });

export default mongoose.model('Transaction', transactionSchema);

