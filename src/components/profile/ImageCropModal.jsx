import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import imageCompression from 'browser-image-compression';

const ImageCropModal = ({ image, onClose, onSave }) => {
    const [crop, setCrop] = useState({
        unit: '%',
        width: 90,
        aspect: 1
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [imgRef, setImgRef] = useState(null);

    const handleSave = async () => {
        if (!completedCrop || !imgRef) return;

        const canvas = document.createElement('canvas');
        const scaleX = imgRef.naturalWidth / imgRef.width;
        const scaleY = imgRef.naturalHeight / imgRef.height;

        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            imgRef,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        );

        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
            if (!blob) return;

            // Compress the image
            const compressedFile = await imageCompression(blob, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1000,
                useWebWorker: true
            });

            onSave(compressedFile);
        }, 'image/jpeg', 0.9);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <h2 className="text-xl font-semibold mb-4">Crop Image</h2>
                <div className="max-h-[60vh] overflow-auto">
                    <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        onComplete={c => setCompletedCrop(c)}
                        aspect={1}
                        circularCrop
                    >
                        <img
                            src={image}
                            onLoad={e => setImgRef(e.currentTarget)}
                            alt="Crop"
                        />
                    </ReactCrop>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={!completedCrop?.width || !completedCrop?.height}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal; 