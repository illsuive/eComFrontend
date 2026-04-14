import '../cssFolder/screens/products.css';
import FilterSideBar from '../components/filterSideBar.jsx';
import ProductCard from '../components/productCard.jsx';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProduct } from '../redux/slices/productSlice.js';
// import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
    // const navigate = useNavigate();
    // 1. Get original products from Redux (Master List)
    const allProductsInRedux = useSelector((state) => state.products.products);
    const dispatch = useDispatch();

    // 2. Local state for what is actually displayed on the screen
    const [displayProducts, setDisplayProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Filter States
    const [category, setCategory] = useState([]); // Use array for multi-select
    const [brand, setBrand] = useState([]);       // Use array for multi-select
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [sort, setSort] = useState('newest');
    const [search, setSearch] = useState('');

    // Fetch products once on mount
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/products/all`);
            if (response.data.success) {
                // Save to Redux so we always have the full original list
                dispatch(setProduct(response.data.products));
                setDisplayProducts(response.data.products);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    
    // products.jsx around line 52
useEffect(() => {
    // 1. SAFETY CHECK: If Redux hasn't loaded products yet, do nothing.
    if (!allProductsInRedux || !Array.isArray(allProductsInRedux)) {
        return;
    }

    // 2. Clone the array safely
    let filtered = [...allProductsInRedux];

    // Search Filter
    if (search) {
        filtered = filtered.filter(p => 
            p.productName?.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Category Filter
    if (category && category.length > 0) {
        filtered = filtered.filter(p => category.includes(p.productCategory));
    }

    // Brand Filter
    if (brand && brand.length > 0) {
        filtered = filtered.filter(p => brand.includes(p.productBrand));
    }

    // Price Filter
    filtered = filtered.filter(p => 
        p.productPrice >= priceRange.min && p.productPrice <= priceRange.max
    );

    // 3. Sort logic (Create a final copy to avoid mutation errors)
    let sorted = [...filtered];
    if (sort === 'newest') {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'price-low-to-high') {
        sorted.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sort === 'price-high-to-low') {
        sorted.sort((a, b) => b.productPrice - a.productPrice);
    }

    setDisplayProducts(sorted);

}, [search, category, brand, priceRange, allProductsInRedux, sort]);

    if (loading) return <div className="loader-container">Loading amazing products...</div>;
    if (error) return <div className="error-container">Something went wrong.</div>;

    return (
        <div className="products-page-container">
            <header className="products-header">
                <div className="header-content">
                    <h1>Explore Our Collection</h1>
                    <p>Showing {displayProducts.length} items</p>
                </div>
            </header>

            <div className="products-layout">
                <aside className="sidebar-wrapper">
                    <FilterSideBar 
                        allProducts={allProductsInRedux} // Use master list to extract unique categories/brands
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                        brand={brand}
                        setBrand={setBrand}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        sort={sort}
                        setSort={setSort}
                    />
                </aside>

                <main className="products-main-content">
                    {displayProducts.length > 0 ? (
                        <div className="products-grid">
                            {displayProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">
                            <h3>No products found matching your criteria.</h3>
                            <button onClick={() => {
                                setSearch('');
                                setCategory([]);
                                setBrand([]);
                                setPriceRange({ min: 0, max: 100000 });
                            }}>
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;