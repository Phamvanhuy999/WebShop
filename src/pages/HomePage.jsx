import React from 'react'
import Layout from '../components/Layout'
import { collection, addDoc, getDocs } from "firebase/firestore";
import firedb from '../FireConfig';
import { fireproduct } from '../fireproduct';
import { async } from '@firebase/util';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
function HomePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { cartItems } = useSelector(state => state.cartReducer)
  const [loading, setLoading] = useState(false)
  const [searchKey, setSearchKey] = useState([])
  const [filterType, setFilterType] = useState([])
  useEffect(() => {
    getdata()
  }, [])
  async function getdata() {
    setLoading(true)
    try {
      setLoading(true)
      const users = await getDocs(collection(firedb, "products"));
      const productArray = []
      users.forEach((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data()
        }
        productArray.push(obj)
        setLoading(false)
      });
      setProducts(productArray);
    } catch (error) {
      console.log(error)
      setLoading(false);
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
        <div className="d-flex w-50 btnsearch">
          <input
            value={searchKey}
            onChange={(e) => { setSearchKey(e.target.value) }}
            className="form-control"
            type='text'
            placeholder='Tìm kiếm' />
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value) }}
            className="form-control">
            <option>Tất cả</option>
            <option>Điện thoại</option>
            <option>Máy tính</option>
            <option>Sạc dự phòng</option>
            <option>Đồng hồ</option>
            <option>Tai nghe</option>
          </select>
        </div>
        <div className="row">
          {products
            .filter((obj) => obj.name.includes(searchKey))
            .filter((obj) => obj.category.includes(filterType))
            .map((product) => {
              return <div className="col-md-4">
                <div className="mt-1 p-2 product position-relative">
                  <div className="product-content">
                    <p>{product.name}</p>
                    <div className="text-center">
                      <img src={product.imageURL} alt="" className='product-img' />
                    </div>
                  </div>
                  <div className="product-action">
                    <h2>{product.price}</h2>
                    <div className="d-flex">
                      <button className='mx' onClick={() => addtoCart(product)}>Add to cart</button>
                      <button onClick={() =>
                        navigate(`/productinfo/${product.id}`)
                      }>View</button>
                    </div>
                  </div>
                </div>
              </div>
            })}
        </div>
      </div>
    </Layout>
  )
}

export default HomePage