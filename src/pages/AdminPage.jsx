import React from 'react'
import Layout from '../components/Layout'
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import firedb from '../FireConfig';
import { useState } from 'react';
import { useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Tabs, Tab } from 'react-bootstrap';
import { async } from '@firebase/util';
import { toast } from 'react-toastify';
function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([]);
  const userid = JSON.parse(localStorage.getItem('currentUser')).user.uid
  const [product, setProduct] = useState({
    name: '',
    price: 0,
    imageURL: '',
    category: '',
  });
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [add, setAdd] = useState(false)

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
    getorderdata()
  }, []);
  async function getorderdata() {

    try {
      setLoading(true)
      const result = await getDocs(collection(firedb, "orders"));
      const ordersArray = [];
      result.forEach((doc) => {
        ordersArray.push(doc.data())
        setLoading(false)
      });
      setOrders(ordersArray);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }
  const editHandle = (item) => {
    setProduct(item);
    setShow(true);
  };
  const updateProduct = async () => {
    try {
      setLoading(true);
      await setDoc(doc(firedb, 'products', product.id), product)
      getdata()
      handleClose()
      toast.success('Update successfullly')
      window.location.reload()
    } catch (error) {
      toast.error('Update failed')
      setLoading(false)
    }
  }
  const addProduct = async () => {
    try {
      setLoading(true);
      await addDoc(collection(firedb, 'products'), product)
      getdata()
      handleClose()
      toast.success('Add successfullly')
      window.location.reload()
    } catch (error) {
      toast.error('ADD failed')
      setLoading(false)
    }
  }
  const deleteProduct = async (item) => {
    try {
      setLoading(true);
      await deleteDoc(doc(firedb, 'products', item.id))
      toast.success('Delete successfullly')
      getdata()
    } catch (error) {
      toast.error('Delete failed')
      setLoading(false)
    }
  }
  const addhandler = () => {
    setAdd(true)
    handleShow()
  }
  return (
    <Layout loading={loading}>
      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="products" title="Products">
          <div className="d-flex justify-content-between">
            <h3>Products List</h3>
            <button onClick={addhandler}>Add Product</button>
          </div>
          <table className='table mt-3'>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => {
                return <tr>
                  <td><img src={item.imageURL} height='100' width='100' /></td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.price}đ</td>
                  <td>
                    <FaTrash color='red' size={20} onClick={() => { deleteProduct(item) }} />
                    <FaEdit color='blue' size={20} onClick={() => editHandle(item)} />
                  </td>
                </tr>
              })}
            </tbody>
          </table>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{add == true ? 'Add a product' : 'Edit Product'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="register-form">
                <h5 className='text_edit'>Name</h5>
                <input
                  type='text'
                  className='form-control'
                  placeholder='name'
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })} />
                <h5 className='text_edit'>Image URL</h5>
                <textarea rows={3}
                  type='text'
                  className='form-control'
                  placeholder='image URL'
                  value={product.imageURL}
                  onChange={(e) => setProduct({ ...product, imageURL: e.target.value })} />
                <h5 className='text_edit'>Price</h5>
                <input
                  type='text'
                  className='form-control'
                  placeholder='price'
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })} />
                <h5 className='text_edit'>Category</h5>
                <input
                  type='text'
                  className='form-control'
                  placeholder='category'
                  value={product.category}
                  onChange={(e) => setProduct({ ...product, category: e.target.value })} />

                <hr />
                {/* <Link to='/login'>Click here to Login</Link> */}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button>Close</button>
              {add ? (<button onClick={addProduct} >Save</button>) : (<button onClick={updateProduct} >Save</button>)}
            </Modal.Footer>
          </Modal>
        </Tab>
        <Tab eventKey="orders" title="Orders">
          {orders.map(order => {
            return (
              <table className='table mt-3 order'>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.cartItems.map(item => {
                    return <tr>
                      <td><img src={item.imageURL} height='100' width='100' /></td>
                      <td>{item.name}</td>
                      <td>{item.price}đ</td>
                    </tr>
                  })}
                </tbody>
              </table>
            )
          })}
        </Tab>
        <Tab eventKey="contact" title="Users" disabled>

        </Tab>
      </Tabs>

    </Layout>
  )
}

export default AdminPage