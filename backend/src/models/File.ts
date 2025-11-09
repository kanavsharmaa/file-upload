import mongoose, { Schema } from 'mongoose';

const FileSchema = new Schema({
    gridFsId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    fileName: { 
        type: String, 
        required: true 
    },
    uploaderRole: { 
        type: String, 
        required: true 
    },
    uploadDate: { 
        type: Date, 
        default: Date.now 
    }
});

const File = mongoose.models.File || mongoose.model('File', FileSchema);
export default File;
