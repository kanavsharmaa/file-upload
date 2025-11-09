import mongoose, { Schema } from 'mongoose';

const AnnotationSchema: Schema = new Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'File'
    },
    createdBy: {
        type: String,
        required: true
    },
    isPrivate: {
        type: Boolean,
        required: true,
        default: true
    },
    visibility: {
        type: [String],
        default: []
    },
    type: {
        type: String,
        required: true,
        enum: ['Highlight', 'Comment', 'Draw']
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Annotation = mongoose.models.Annotation || mongoose.model('Annotation', AnnotationSchema);
export default Annotation;