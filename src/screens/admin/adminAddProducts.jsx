import { useState } from 'react';
import { useDispatch } from 'react-redux'
import axios from 'axios';
import '../../cssFolder/screens/admin/adminAddProducts.css';
import ImageUploader from '../../components/imgeUpload.jsx'
import { setProduct } from '../../redux/slices/productSlice.js'

const AdminAddProductsPage = () => {
    const dispatch = useDispatch();

    // 1. Unified state for all form fields
    const [formData, setFormData] = useState({
        productName: '',
        productBrand: '',
        productCategory: '',
        productPrice: '',
        productDescription: '',
        productImgs: [] // Array to store file objects
    });

    const [btnDisabled, setBtnDisabled] = useState(false);

    // 2. Generic handler for text/number inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 4. Submit handler to console log the object
    // 4. Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Start Loading / Disable Button
        setBtnDisabled(true);

        try {
            const data = new FormData();
            data.append('productName', formData.productName);
            data.append('productBrand', formData.productBrand);
            data.append('productCategory', formData.productCategory);
            data.append('productPrice', formData.productPrice);
            data.append('productDescription', formData.productDescription);

            // Append images
            formData.productImgs.forEach(file => data.append('files', file));

            const res = await axios.post(`${import.meta.env.VITE_URL}/products/add`, data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                alert(res.data.message);

                // 2. Update Redux (ensure your slice handles a single product push)
                dispatch(setProduct(res.data.product));

                // 3. Clear the form completely
                setFormData({
                    productName: '',
                    productBrand: '',
                    productCategory: '',
                    productPrice: '',
                    productDescription: '',
                    productImgs: []
                });
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Something went wrong');
        } finally {
            // 4. Re-enable button after process finishes (success or error)
            setBtnDisabled(false);
        }
    };

    return (
        <div className="admin-add-products-wrapper">
            <h1>Admin Add Products</h1>

            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Brand</label>
                    <input
                        type="text"
                        name="productBrand"
                        value={formData.productBrand}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        name="productCategory"
                        value={formData.productCategory}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        name="productPrice"
                        value={formData.productPrice}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleChange}
                        rows="4"
                        required
                    ></textarea>
                </div>

                <ImageUploader formData={formData} setFormData={setFormData} />
                {/* condition button  */}
                <button
                    disabled={btnDisabled}
                    type="submit"
                    className={`submit-btn ${btnDisabled ? 'loading' : ''}`}
                >
                    {btnDisabled ? (
                        <span className="btn-spinner-text">Creating Product...</span>
                    ) : (
                        "Create Product"
                    )}
                </button>
            </form>
        </div>
    );
};

export default AdminAddProductsPage;