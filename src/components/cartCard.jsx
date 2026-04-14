import '../cssFolder/components/cartCard.css';
import axios from 'axios';
import { useState } from 'react';
import { updateQuantity, removeFromCart, setCart } from '../redux/slices/productSlice.js'
import { useDispatch } from 'react-redux'

const CartCard = ({ item }) => {
    // 1. Extract product details from the nested productId object
    const product = item.productId;
    // const [type, setType] = useState(item.type);
    const dispatch = useDispatch();

    const handleUpdateQuantity = async (id, type) => {
        try {
            const res = await axios.patch(`${import.meta.env.VITE_URL}/cart/update-quantity`, { productId: id, type },
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }
            );

            if (res.data.success) {
                alert(res.data.message);
                dispatch(updateQuantity({ id, type }));
                return;
            }
            alert(res.data.message);
            console.log(value);

        } catch (error) {
            console.log(error);

        }
    }

    const handleRemoveItem = async (id) => {
        try {
            const productId = id
            const res = await axios.delete(`${import.meta.env.VITE_URL}/cart/remove-from-cart`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },  // ✅ object
                data: { productId }
            })

            if (res.data.success) {
                alert(res.data.message);

                dispatch(setCart(res.data.cart));
                dispatch(removeFromCart(id))
                return;
            } else {

                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="cart-card">
            {/* Displaying the first image from the productImgs array */}
            <div className="cart-card-image">
                <img
                    src={product?.productImgs?.[0]?.url}
                    alt={product?.productName}
                />
            </div>

            <div className="cart-card-info">
                {/* Accessing name and description via productId */}
                <h2 className="cart-product-name">{product?.productName}</h2>
                <p className="cart-product-brand">{product?.productBrand}</p>

                <div className="cart-pricing">
                    <p className="unit-price">Price: ${item.price}</p>

                    {/* Quantity Controls */}
                    <div className="cart-qty-selector">
                        <button onClick={() => handleUpdateQuantity(product._id, "decrement")} className="qty-btn">-</button>
                        <span className="qty-count">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(product._id, "increment")} className="qty-btn">+</button>
                    </div>
                </div>

                {/* Calculating Subtotal for this specific item */}
                <p className="item-subtotal">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>

                <button onClick={() => handleRemoveItem(product._id)} className="remove-item-btn">Remove Item</button>
            </div>
        </div>
    );
};
// 
export default CartCard;