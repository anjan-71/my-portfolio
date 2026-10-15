import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);