import React from 'react'
import Layout from '../components/Layout'
import { getDoc, doc } from "firebase/firestore";
import firedb from '../FireConfig';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
function ProductInfo() {
  const [product, setProduct] = useState();
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { cartItems } = useSelector(state => state.cartReducer)
  useEffect(() => {
    getdata()
  }, []);
  async function getdata() {
    try {
      setLoading(true)
      const productTemp = await getDoc(doc(firedb, "products", params.productId));

      setProduct(productTemp.data());
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems])
  const addtoCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <Layout loading={loading}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {product && ( 
              <div>
                <p><b>{product.name}</b></p>
                <img src={product.imageURL} className="product-info-img" />
                <hr />
                <p>{product.description}</p>
                <div className="d-flex justify-content-end my-3">
                  <button onClick={()=>addtoCart(product)}>Add to cart</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </Layout>
  )
}

export default ProductInfo