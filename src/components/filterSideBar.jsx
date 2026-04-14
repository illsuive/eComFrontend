import { useState } from 'react';
import '../cssFolder/components/filterSideBar.css';

const FilterSideBar = ({ 
    allProducts, category, setCategory, brand, setBrand, 
    priceRange, setPriceRange, search, setSearch, sort, setSort 
}) => {

    // UI States for "See All" toggles
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllBrands, setShowAllBrands] = useState(false);

    // Get Unique values for Sidebar lists
    const categories = [...new Set(allProducts.map(p => p.productCategory))];
    const brands = [...new Set(allProducts.map(p => p.productBrand))];

    // Helper to add/remove items from filter arrays
    const handleToggle = (value, currentArray, setArray) => {
        if (currentArray.includes(value)) {
            setArray(currentArray.filter(item => item !== value));
        } else {
            setArray([...currentArray, value]);
        }
    };

    const handleReset = () => {
        setCategory([]);
        setBrand([]);
        setSearch('');
        setSort('newest');
        setPriceRange({ min: 0, max: 1000000 });
    };

    return (
        <aside className="filter-sidebar">
            <div className="filter-header">
                <h3>Filters</h3>
                <button onClick={handleReset} className="reset-link">Reset</button>
            </div>

            {/* Search Bar */}
            <div className="filter-group">
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Sort Dropdown */}
           <div className="filter-group">
                <label>Sort By</label>
                <select 
                    value={sort} 
                    onChange={(e) => setSort(e.target.value)} // Tells parent which sorting algorithm to use
                    >
                    <option value="newest">Newest First</option>
                    <option value="price-low-to-high">Price: Low to High</option>
                    <option value="price-high-to-low">Price: High to Low</option>
                </select>
            </div>

            {/* Categories Section */}
            <div className="filter-group">
                <h4>Categories</h4>
                {(showAllCategories ? categories : categories.slice(0, 3)).map(cat => (
                    <label key={cat} className="checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={category.includes(cat)}
                            onChange={() => handleToggle(cat, category, setCategory)}
                        />
                        {cat}
                    </label>
                ))}
                {categories.length > 3 && (
                    <button className="see-all-btn" onClick={() => setShowAllCategories(!showAllCategories)}>
                        {showAllCategories ? "Show Less" : "See All"}
                    </button>
                )}
            </div>

            {/* Brands Section */}
            <div className="filter-group">
                <h4>Brands</h4>
                {(showAllBrands ? brands : brands.slice(0, 3)).map(b => (
                    <label key={b} className="checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={brand.includes(b)}
                            onChange={() => handleToggle(b, brand, setBrand)}
                        />
                        {b}
                    </label>
                ))}
                {brands.length > 3 && (
                    <button className="see-all-btn" onClick={() => setShowAllBrands(!showAllBrands)}>
                        {showAllBrands ? "Show Less" : "See All"}
                    </button>
                )}
            </div>

            {/* Price Range */}
            <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-row">
                    <input 
                        type="number" 
                        placeholder="Min" 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    />
                    <input 
                        type="number" 
                        placeholder="Max" 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    />
                </div>
            </div>
        </aside>
    );
};

export default FilterSideBar;