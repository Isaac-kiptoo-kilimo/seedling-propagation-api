import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g. "CREATE_PRODUCT", "UPDATE_PRODUCT"
  collectionName: { type: String, required: true }, // e.g. "products"
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true }, // affected document
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who did it
  payload: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', auditLogSchema);
