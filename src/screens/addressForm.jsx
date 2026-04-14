import '../cssFolder/screens/addressForm.css'
import { setAddress, setCart, setSelectedAddress } from '../redux/slices/productSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useState, useEffect } from 'react'

const AddressFormPage = () => {
    // 1. Safe destructuring
    const { address, cart } = useSelector((state) => state.products || { 
        address: { totalAddress: [], selectedAddress: null }, 
        cart: { items: [], totalPrice: 0 } 
    });
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 2. Initialize state
    const [showForm, setShowForm] = useState(false);
    const [formValues, setFormValues] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNo: "",
        city: "",
        zipCode: "",
        address: "",
    });

    // 3. Logic to show form automatically if no addresses exist
    useEffect(() => {
        if (address?.totalAddress?.length === 0) {
            setShowForm(true);
        }
    }, [address?.totalAddress?.length]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNewAddress = (e) => {
        e.preventDefault();
        
        // Create unique ID for the local state address
        const newAddress = { ...formValues, _id: Date.now().toString() };
        
        // Update Redux
        dispatch(setAddress(newAddress));
        dispatch(setSelectedAddress(newAddress));
        
        // Reset and hide form
        setFormValues({ firstName: "", middleName: "", lastName: "", phoneNo: "", city: "", zipCode: "", address: "" });
        setShowForm(false);
    };

    const handlePayment = async () => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_URL}/orders/create-order`,
                { amount: cart.totalPrice * 100 },
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            )

            if (!data.success) {
                alert('Failed to create order')
                return
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                order_id: data.order.id,
                name: 'ShopFlow',
                description: `Order #${data.order.id}`,
                handler: async (response) => {
                    try {
                        const verifyResponse = await axios.post(`${import.meta.env.VITE_URL}/orders/verify-payment`,
                            {
                                orderID: data.order.id,
                                paymentID: response.razorpay_payment_id,
                                signature: response.razorpay_signature
                            },
                            { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
                        )

                        if (verifyResponse.data.success) {
                            dispatch(setSelectedAddress(null))
                            dispatch(setCart({ items: [], totalPrice: 0 }))
                            navigate('/success')
                        } else {
                            alert('Payment verification failed')
                        }
                    } catch (error) {
                        console.error('Verify error:', error)
                    }
                },
                modal: { ondismiss: () => alert('Payment cancelled') }
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.error('Payment error:', error)
            alert(error.response?.data?.message || 'Payment failed')
        }
    }

    return (
        <div className="address-checkout-container">
            <div className="left-side-address">
                <h2>Shipping Address</h2>

                {!showForm ? (
                    <div className="address-selection-area">
                        <div className="address-list">
                            {address?.totalAddress?.map((item) => (
                                <div 
                                    key={item._id} 
                                    className={`address-item-card ${address.selectedAddress?._id === item._id ? 'selected' : ''}`}
                                    onClick={() => dispatch(setSelectedAddress(item))}
                                >
                                    <input 
                                        type="radio" 
                                        checked={address.selectedAddress?._id === item._id} 
                                        readOnly 
                                    />
                                    <div className="address-details">
                                        <p><strong>{item.firstName} {item.lastName}</strong></p>
                                        <p>{item.address}, {item.city} - {item.zipCode}</p>
                                        <p>Phone: {item.phoneNo}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="add-new-btn" onClick={() => setShowForm(true)}>
                            + Add New Address
                        </button>
                    </div>
                ) : (
                    <div className="address-form-container">
                        <h3>Add New Address</h3>
                        <form onSubmit={handleAddNewAddress}>
                            <div className="form-grid">
                                <input type="text" name="firstName" value={formValues.firstName} placeholder="First Name" onChange={handleChange} required />
                                <input type="text" name="lastName" value={formValues.lastName} placeholder="Last Name" onChange={handleChange} required />
                                <input type="text" name="phoneNo" value={formValues.phoneNo} placeholder="Phone Number" onChange={handleChange} required />
                                <input type="text" name="city" value={formValues.city} placeholder="City" onChange={handleChange} required />
                                <input type="text" name="zipCode" value={formValues.zipCode} placeholder="Zip Code" onChange={handleChange} required />
                                <textarea name="address" value={formValues.address} placeholder="Full Address" onChange={handleChange} required />
                            </div>
                            <div className="form-btns">
                                {/* This is your "Save & Deliver" button */}
                                <button type="submit" className="save-addr-btn">Save & Deliver Here</button>
                                {address?.totalAddress?.length > 0 && (
                                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div className="right-side-summary">
                <h2>Order Summary</h2>
                <div className="summary-items-list">
                    {cart?.items?.map((item) => (
                        <div key={item._id} className="summary-item">
                            <div className="item-img">
                                <img src={item.productId?.productImgs?.[0]?.url} alt="" />
                            </div>
                            <div className="item-info">
                                <p className="item-name">{item.productId?.productName}</p>
                                <p className="item-qty">Qty: {item.quantity}</p>
                                <p className="item-price">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="price-breakdown">
                    <div className="price-row">
                        <span>Subtotal</span>
                        <span>${(cart?.totalPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                        <span>Shipping</span>
                        <span className="free-text">FREE</span>
                    </div>
                    <hr />
                    <div className="price-row total">
                        <span><strong>Order Total</strong></span>
                        <span><strong>${(cart?.totalPrice || 0).toFixed(2)}</strong></span>
                    </div>
                </div>

                <button 
                    className="payment-proceed-btn" 
                    disabled={!address?.selectedAddress}
                    onClick={handlePayment}
                >
                    {address?.selectedAddress ? "Proceed to Payment" : "Please Select an Address"}
                </button>
            </div>
        </div>
    )
}

export default AddressFormPage;
