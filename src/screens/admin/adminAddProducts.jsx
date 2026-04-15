import { useState } from 'react';
import { useDispatch } from 'react-redux'
import axios from 'axios';
import '../../cssFolder/screens/admin/adminAddProducts.css';
import ImageUploader from '../../components/imgeUpload.jsx'
import { setProduct } from '../../redux/slices/productSlice.js'

const AdminAddProductsPage = () => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        productName: '',
        productBrand: '',
        productCategory: '',
        productPrice: '',
        productDescription: '',
        // FIX 1: Your ImageUploader likely sets files into 'newFiles' 
        // based on your working AdminProductsPage code
        newFiles: [] 
    });

    const [btnDisabled, setBtnDisabled] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // FIX 2: Check 'newFiles' instead of 'productImgs'
        if (!formData.newFiles || formData.newFiles.length === 0) {
            alert("Please upload at least one image.");
            return;
        }

        setBtnDisabled(true);

        try {
            const data = new FormData();
            data.append('productName', formData.productName);
            data.append('productBrand', formData.productBrand);
            data.append('productCategory', formData.productCategory);
            data.append('productPrice', formData.productPrice);
            data.append('productDescription', formData.productDescription);

            // FIX 3: Append images from 'newFiles' using the key 'files'
            formData.newFiles.forEach(file => {
                data.append('files', file);
            });

            const res = await axios.post(`${import.meta.env.VITE_URL}/products/add`, data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                alert(res.data.message);
                dispatch(setProduct(res.data.product));
                setFormData({
                    productName: '',
                    productBrand: '',
                    productCategory: '',
                    productPrice: '',
                    productDescription: '',
                    newFiles: [] // Reset this too
                });
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Something went wrong');
        } finally {
            setBtnDisabled(false);
        }
    };

    return (
        <div className="admin-add-products-wrapper">
            <h1>Admin Add Products</h1>

            <form onSubmit={handleSubmit} className="add-product-form">
                {/* ... (Input fields remain the same) ... */}
                <div className="form-group">
                    <label>Product Name</label>
                    <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Brand</label>
                    <input type="text" name="productBrand" value={formData.productBrand} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input type="text" name="productCategory" value={formData.productCategory} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input type="number" name="productPrice" value={formData.productPrice} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="productDescription" value={formData.productDescription} onChange={handleChange} rows="4" required />
                </div>

                {/* Important: ImageUploader will now update formData.newFiles */}
                <ImageUploader formData={formData} setFormData={setFormData} />

                <button disabled={btnDisabled} type="submit" className={`submit-btn ${btnDisabled ? 'loading' : ''}`}>
                    {btnDisabled ? "Creating Product..." : "Create Product"}
                </button>
            </form>
        </div>
    );
};

export default AdminAddProductsPage;