import { useState } from 'react'
import '../../cssFolder/screens/admin/adminProducts.css'
import { useSelector, useDispatch } from 'react-redux'
import ImageUploader from '../../components/imgeUpload.jsx'
import axios from 'axios'
import { setProduct, deleteProduct } from '../../redux/slices/productSlice.js'

const AdminProductsPage = () => {
    const dispatch = useDispatch()
    const products = useSelector((state) => state.products.products) || []

    const [sort, setSort] = useState('newest')
    const [editingProduct, setEditingProduct] = useState(null)
    
    // 1. Add search state
    const [searchQuery, setSearchQuery] = useState('')

    // 2. Filter and then Sort products
    const filteredAndSortedProducts = products
        .filter((product) => {
            const query = searchQuery.toLowerCase();
            return (
                product.productName.toLowerCase().includes(query) ||
                product.productBrand.toLowerCase().includes(query) ||
                product.productCategory.toLowerCase().includes(query)
            );
        })
        .sort((a, b) => {
            if (sort === 'price-low-to-high') return a.productPrice - b.productPrice
            if (sort === 'price-high-to-low') return b.productPrice - a.productPrice
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

    const handleEditClick = (product) => {
        setEditingProduct({
            ...product,
            newFiles: [] 
        })
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditingProduct(prev => ({ ...prev, [name]: value }))
    }

    const handleSaveEdits = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData()
            data.append('productName', editingProduct.productName)
            data.append('productBrand', editingProduct.productBrand)
            data.append('productCategory', editingProduct.productCategory)
            data.append('productPrice', editingProduct.productPrice)
            data.append('productDescription', editingProduct.productDescription)
            data.append('existingImages', JSON.stringify(editingProduct.productImgs))

            if (editingProduct.newFiles && editingProduct.newFiles.length > 0) {
                editingProduct.newFiles.forEach(file => data.append('files', file))
            }

            const res = await axios.patch(
                `${import.meta.env.VITE_URL}/products/update/${editingProduct._id}`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            if (res.data.success) {
                alert('Product updated successfully!')
                dispatch(setProduct(res.data.products)) 
                setEditingProduct(null)                 
            }
        } catch (error) {
            console.error('Update error:', error)
            alert(error.response?.data?.message || 'Something went wrong')
        }
    }

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_URL}/products/delete/${productId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            if (res.data.success) {
                alert('Product deleted!')
                dispatch(deleteProduct(productId))
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Delete failed')
        }
    }

    return (
        <div className="admin-products-container">

            <div className="admin-header">
                <h1>Products Management</h1>
                
                <div className="admin-controls">
                    {/* 3. Search Bar UI */}
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Search by name, brand or category..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>

                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="price-low-to-high">Price: Low to High</option>
                        <option value="price-high-to-low">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="products-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 4. Map over filtered array */}
                        {filteredAndSortedProducts.length > 0 ? (
                            filteredAndSortedProducts.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={product.productImgs[0]?.url}
                                            alt={product.productName}
                                            className="admin-thumb"
                                        />
                                    </td>
                                    <td>{product.productName}</td>
                                    <td>{product.productBrand}</td>
                                    <td>{product.productCategory}</td>
                                    <td>${product.productPrice}</td>
                                    <td className="table-btns">
                                        <button className="btn-edit" onClick={() => handleEditClick(product)}>Edit</button>
                                        <button className="btn-delete" onClick={() => handleDelete(product._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                                    No products found matching "{searchQuery}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editingProduct && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal">
                        <h2>Edit: {editingProduct.productName}</h2>
                        <form onSubmit={handleSaveEdits}>
                            <div className="edit-form-grid">
                                <label>Product Name</label>
                                <input name="productName" value={editingProduct.productName} onChange={handleEditChange} />
                                
                                <label>Brand</label>
                                <input name="productBrand" value={editingProduct.productBrand} onChange={handleEditChange} />
                                
                                <label>Category</label>
                                <input name="productCategory" value={editingProduct.productCategory} onChange={handleEditChange} />
                                
                                <label>Price</label>
                                <input type="number" name="productPrice" value={editingProduct.productPrice} onChange={handleEditChange} />
                                
                                <label>Description</label>
                                <textarea name="productDescription" value={editingProduct.productDescription} onChange={handleEditChange} rows="4" />

                                <ImageUploader formData={editingProduct} setFormData={setEditingProduct} />
                            </div>

                            <div className="modal-btns">
                                <button type="submit" className="save-btn">Save Changes</button>
                                <button type="button" className="cancel-btn" onClick={() => setEditingProduct(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminProductsPage