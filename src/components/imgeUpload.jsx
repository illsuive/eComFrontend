// import { useState } from 'react'
// import '../cssFolder/components/imgeUpload.css'

// const ImageUploader = ({ formData, setFormData }) => {
//     const [previews, setPreviews] = useState([])

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files)
//         const currentCount = formData.productImgs.length

//         // Check total count
//         if (currentCount + files.length > 5) {
//             alert(`You can only upload max 5 images. You have ${currentCount} already.`)
//             e.target.value = ""
//             return
//         }
            
//         // Create preview URLs
//         const newPreviews = files.map(file => ({
//             file,
//             url: URL.createObjectURL(file),
//             name: file.name
//         }))

//         setPreviews(prev => [...prev, ...newPreviews])
//         setFormData(prev => ({
//             ...prev,
//             productImgs: [...prev.productImgs, ...files]
//         }))

//         e.target.value = "" // reset input so same file can be added again
//     }

//     const handleRemove = (index) => {
//         // Remove from previews
//         setPreviews(prev => {
//             URL.revokeObjectURL(prev[index].url) // free memory
//             return prev.filter((_, i) => i !== index)
//         })

//         // Remove from formData
//         setFormData(prev => ({
//             ...prev,
//             productImgs: prev.productImgs.filter((_, i) => i !== index)
//         }))
//     }

//     return (
//         <div className="image-uploader">
//             <label>Product Images (Max 5)</label>

//             {/* Upload Button — hide when 5 reached */}
//             {formData.productImgs.length < 5 && (
//                 <label className="upload-area">
//                     <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         hidden
//                     />
//                     <div className="upload-placeholder">
//                         <span>📁</span>
//                         <p>Click to upload images</p>
//                         <small>{formData.productImgs.length}/5 uploaded</small>
//                     </div>
//                 </label>
//             )}

//             {/* Image Previews */}
//             {previews.length > 0 && (
//                 <div className="preview-grid">
//                     {previews.map((preview, index) => (
//                         <div key={index} className="preview-item">
//                             <img src={preview.url} alt={preview.name} />
//                             <div className="preview-overlay">
//                                 <p className="img-name">{preview.name.substring(0, 15)}...</p>
//                                 <button
//                                     type="button"
//                                     className="remove-img-btn"
//                                     onClick={() => handleRemove(index)}
//                                 >
//                                     ✕ Remove
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {formData.productImgs.length === 5 && (
//                 <p className="max-reached">✅ Maximum 5 images reached</p>
//             )}
//         </div>
//     )
// }

// export default ImageUploader

import { useState, useEffect } from 'react'  // ✅ add useEffect
import '../cssFolder/components/imgeUpload.css'

const ImageUploader = ({ formData, setFormData }) => {

    // Existing images from DB — [{ url, public_id }]
    const [existingImgs, setExistingImgs] = useState([])

    // New local previews — [{ file, url, name }]
    const [newPreviews, setNewPreviews] = useState([])

    // Total = existing + new
    const totalCount = existingImgs.length + newPreviews.length

    // ─────────────────────────────────────────
    // On mount — load existing DB images
    // Only runs when editing (productImgs has { url, public_id })
    // Skip when adding new product (productImgs is empty [])
    // ─────────────────────────────────────────
    useEffect(() => {
        if (
            formData.productImgs &&
            formData.productImgs.length > 0 &&
            formData.productImgs[0]?.public_id // ✅ means it's from DB not a File object
        ) {
            setExistingImgs(formData.productImgs)
        }
    }, [])

    // ─────────────────────────────────────────
    // Add new images from file input
    // ─────────────────────────────────────────
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)

        // Check total count
        if (totalCount + files.length > 5) {
            alert(`You can only upload max 5 images. You have ${totalCount} already.`)
            e.target.value = ""
            return
        }

        // Create preview URLs for display
        const previews = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name
        }))

        // Add to new previews
        setNewPreviews(prev => [...prev, ...previews])

        // Add new File objects to formData.newFiles
        setFormData(prev => ({
            ...prev,
            newFiles: [...(prev.newFiles || []), ...files]
        }))

        e.target.value = "" // reset so same file can be selected again
    }

    // ─────────────────────────────────────────
    // Remove existing image (from DB)
    // Will be deleted from Cloudinary on save
    // ─────────────────────────────────────────
    const handleRemoveExisting = (publicId) => {
        const updated = existingImgs.filter(img => img.public_id !== publicId)
        setExistingImgs(updated)

        // Sync with parent so handleSaveEdits gets updated list
        setFormData(prev => ({
            ...prev,
            productImgs: updated
        }))
    }

    // ─────────────────────────────────────────
    // Remove new image (not yet uploaded)
    // ─────────────────────────────────────────
    const handleRemoveNew = (index) => {
        // Free memory
        URL.revokeObjectURL(newPreviews[index].url)

        // Remove from previews
        setNewPreviews(prev => prev.filter((_, i) => i !== index))

        // Remove from formData.newFiles
        setFormData(prev => ({
            ...prev,
            newFiles: (prev.newFiles || []).filter((_, i) => i !== index)
        }))
    }

    return (
        <div className="image-uploader">
            <label>Product Images ({totalCount}/5)</label>

            {/* ── Existing Images from DB ── */}
            {existingImgs.length > 0 && (
                <>
                    <p className="img-section-label">Current Images</p>
                    <div className="preview-grid">
                        {existingImgs.map((img) => (
                            <div key={img.public_id} className="preview-item">
                                {/* Cloudinary URL */}
                                <img src={img.url} alt="existing product" />
                                <div className="preview-overlay">
                                    <button
                                        type="button"
                                        className="remove-img-btn"
                                        onClick={() => handleRemoveExisting(img.public_id)}
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ── New Image Previews ── */}
            {newPreviews.length > 0 && (
                <>
                    <p className="img-section-label">New Images</p>
                    <div className="preview-grid">
                        {newPreviews.map((preview, index) => (
                            <div key={index} className="preview-item">
                                {/* Local object URL */}
                                <img src={preview.url} alt={preview.name} />
                                <div className="preview-overlay">
                                    <p className="img-name">
                                        {preview.name.substring(0, 15)}...
                                    </p>
                                    <button
                                        type="button"
                                        className="remove-img-btn"
                                        onClick={() => handleRemoveNew(index)}
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ── Upload Button — hidden when max reached ── */}
            {totalCount < 5 && (
                <label className="upload-area">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                    />
                    <div className="upload-placeholder">
                        <span>📁</span>
                        <p>Click to upload images</p>
                        <small>{totalCount}/5 uploaded</small>
                    </div>
                </label>
            )}

            {/* ── Max reached message ── */}
            {totalCount === 5 && (
                <p className="max-reached">✅ Maximum 5 images reached</p>
            )}
        </div>
    )
}

export default ImageUploader