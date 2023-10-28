import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../globalState";
import Modal from "../modal/Modal";

export default function ProductCardButton({ product, token, callback, setCallback }) {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  const [openModal, setOpenModal] = useState(false);

  const deleteProduct = async () => {
    // ... (your deleteProduct function)

    // Rest of your deleteProduct function code
  };

  return (
    <div className="row_btn">
      {product.seller_id === user?._id ? (
        <>
          <Link id="btn_buy" to={`/edit_product/${product._id}`}>
            Edit
          </Link>
          <Link id="btn_delete" to="#!" onClick={() => setOpenModal(true)}>
            Delete
          </Link>
        </>
      ) : (
        <>
          <a id="btn_buy" href={`tel:${product.phone}`}>Call</a>
          <Link id="btn_view" to={`/details/${product._id}`}>
            View
          </Link>
        </>
      )}
      <Modal
        open={openModal}
        deleteProduct={deleteProduct}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
