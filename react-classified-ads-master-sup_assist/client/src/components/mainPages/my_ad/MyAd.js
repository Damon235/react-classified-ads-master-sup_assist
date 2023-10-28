import React, { useContext } from "react";
import { GlobalState } from "../../../globalState";
import ProductItem from "../utils/product_item/ProductItem";
import Loading from "../utils/loading/Loading";
import "./MyAd.css";
import {
  FaWhatsapp,
  FaPhone,
} from "react-icons/fa";

export default function MyAd() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [myAd] = state.adAPI.myAd;
  const [callback, setCallback] = state.productsAPI.callback;

  const handleCallAdminClick = () => {
    // Implement the functionality to make a phone call to admin
    // For example, you can use the "tel:" protocol to initiate a phone call
    window.location.href = "tel:08117246049"; // Replace with admin's phone number
  };

  const handleWhatsAppClick = () => {
    // Implement the functionality to open a WhatsApp chat
    // For example, you can use the "https://wa.me/" link
    window.open("https://wa.me/2348117245997", "_blank"); // Replace with admin's WhatsApp number
  };

  return (
    <>
      <div className="products">
        {myAd.map((product) => (
          <div key={product._id} className="product-item-container">
            {product.checked === false && (
              <span className="pending-tag">Pending Approval</span>
            )}
            <ProductItem
              product={product}
              token={token}
              callback={callback}
              setCallback={setCallback}
            />
          </div>
        ))}
        {myAd.length === 0 && <Loading />}
      </div>
      {/* Floating Buttons */}
      <button className="floating-button" onClick={handleCallAdminClick}>
          <FaPhone /> Call Admin
      </button>
      <button className="floating-button2" onClick={handleWhatsAppClick}>
          <FaWhatsapp /> WhatsApp
      </button>
    </>
  );
}
