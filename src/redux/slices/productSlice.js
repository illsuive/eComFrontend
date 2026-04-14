import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [],
    cart: {
        items: [],
        totalPrice: 0
    },
    address: {
        totalAddress: [],
        selectedAddress: null
    },
    loading: false,
    error: null
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.products = action.payload;
        },
        addToCart: (state, action) => {
            if (!state.cart || Array.isArray(state.cart)) {
                state.cart = { items: [], totalPrice: 0 };
            }

            const productId = action.payload._id;
            const existing = state.cart.items.find(item =>
                (item.productId?._id || item.productId) === productId
            );

            if (existing) {
                existing.quantity += 1;
            } else {
                state.cart.items.push({
                    _id: new Date().getTime().toString(),
                    productId: action.payload,
                    quantity: 1,
                    price: action.payload.productPrice
                });
            }

            state.cart.totalPrice = state.cart.items.reduce((total, item) => {
                return total + (item.price * (item.quantity || 1));
            }, 0);
        },
        removeFromCart: (state, action) => {
            state.cart.items = state.cart.items.filter(
                item => (item.productId?._id || item.productId) !== action.payload
            );
            state.cart.totalPrice = state.cart.items.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
        },
        updateQuantity: (state, action) => {
            const { id, type } = action.payload;
            const item = state.cart.items.find(i => (i.productId?._id || i.productId) === id);

            if (item) {
                if (type === 'increment') {
                    item.quantity += 1;
                } else if (type === 'decrement' && item.quantity > 1) {
                    item.quantity -= 1;
                }
            }

            state.cart.totalPrice = state.cart.items.reduce((total, i) => {
                return total + (i.price * i.quantity);
            }, 0);
        },
        setCart: (state, action) => {
            state.cart = action.payload || { items: [], totalPrice: 0 };
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(p => p._id !== action.payload);
        },
        
        // --- ADDRESS REDUCERS (WITH SAFETY CHECKS) ---
        setAddress: (state, action) => {
            // If address or totalAddress is missing (bug prevention), initialize it
            if (!state.address) {
                state.address = { totalAddress: [], selectedAddress: null };
            }
            if (!state.address.totalAddress) {
                state.address.totalAddress = [];
            }
            
            state.address.totalAddress.push(action.payload);
        },
        setSelectedAddress: (state, action) => {
            if (!state.address) {
                state.address = { totalAddress: [], selectedAddress: null };
            }
            state.address.selectedAddress = action.payload;
        },
        deleteAddress: (state, action) => {
            if (state.address?.totalAddress) {
                state.address.totalAddress = state.address.totalAddress.filter(
                    addr => addr._id !== action.payload
                );
            }
        },
    }
});

export const { 
    setProduct, addToCart, removeFromCart, updateQuantity, 
    setCart, deleteProduct, setAddress, setSelectedAddress, deleteAddress 
} = productSlice.actions;

export default productSlice.reducer;