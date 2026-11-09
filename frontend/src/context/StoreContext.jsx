import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api/apiClient'
import { useAuth } from './AuthContext'
import { categories as fallbackCategories } from '../data/products'

const StoreContext = createContext(null)
export const useStore = () => useContext(StoreContext)

export function StoreProvider({ children }) {
  const { user } = useAuth()
  const key = user ? `${user.role}:${user.id}` : ''

  const [products, setProducts] = useState([])
  const [productsReady, setProductsReady] = useState(false)
  const [productsError, setProductsError] = useState('')
  const [categories, setCategories] = useState(fallbackCategories) // ['All', 'Floral', ...]

  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [ordersFor, setOrdersFor] = useState('') // which login the loaded orders belong to
  const [usersFor, setUsersFor] = useState('')

  // ----- loaders -----
  const refreshProducts = useCallback(async () => {
    try {
      setProducts(await api.products())
      setProductsError('')
    } catch (err) {
      setProductsError(err.message)
    } finally {
      setProductsReady(true)
    }
  }, [])

  const refreshOrders = useCallback(async () => {
    if (!user) return
    try {
      setOrders(user.role === 'Admin' ? await api.admin.orders() : await api.myOrders())
    } catch {
      setOrders([])
    } finally {
      setOrdersFor(key)
    }
  }, [user, key])

  const refreshUsers = useCallback(async () => {
    if (user?.role !== 'Admin') return
    try {
      setUsers(await api.admin.users())
    } catch {
      setUsers([])
    } finally {
      setUsersFor(key)
    }
  }, [user, key])

  // products + categories: once, for everybody
  useEffect(() => {
    refreshProducts()
    api.categories()
      .then((list) => setCategories(['All', ...list.map((c) => c.name)]))
      .catch(() => {}) // keep the built-in list
  }, [refreshProducts])

  // orders + users: whenever somebody logs in or out
  useEffect(() => {
    if (!user) { setOrders([]); setUsers([]); setOrdersFor(''); setUsersFor(''); return }
    refreshOrders()
    if (user.role === 'Admin') refreshUsers()
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  // ----- PRODUCTS (Admin A3 / A3a / A3b). These throw an ApiError when the server says no. -----
  const addProduct = async (data, imageFile) => {
    const product = await api.admin.createProduct(data, imageFile)
    await refreshProducts()
    return product
  }
  const updateProduct = async (id, data, imageFile) => {
    const product = await api.admin.updateProduct(id, data, imageFile)
    await refreshProducts()
    return product
  }
  const deleteProduct = async (id) => {
    await api.admin.deleteProduct(id)
    await refreshProducts()
  }

  // ----- USERS (Admin A5 / A5a / A5b) -----
  const addUser = async (data) => {
    const created = await api.admin.createUser(data)
    await refreshUsers()
    return created
  }
  const updateUser = async (id, data) => {
    const updated = await api.admin.updateUser(id, data)
    await refreshUsers()
    return updated
  }
  const deleteUser = async (id) => {
    await api.admin.deleteUser(id)
    await refreshUsers()
  }

  // ----- ORDERS (Checkout C7, Admin A4/A4a) -----
  // Only product ids + quantities are sent. The server reads the prices itself.
  const placeOrder = async ({ lines, shipping, payment }) => {
    const order = await api.placeOrder(shipping, payment, lines.map((l) => ({ productId: l.product.id, qty: l.qty })))
    await Promise.all([refreshProducts(), refreshOrders()]) // stock changed + new order
    return order
  }
  const updateOrderStatus = async (no, status) => {
    await api.admin.updateOrderStatus(no, status)
    await refreshOrders()
  }

  const value = {
    products, productsReady, productsError, refreshProducts, categories,
    users, usersReady: usersFor === key && key !== '',
    orders, ordersReady: ordersFor === key && key !== '',
    addProduct, updateProduct, deleteProduct,
    addUser, updateUser, deleteUser,
    placeOrder, updateOrderStatus,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
