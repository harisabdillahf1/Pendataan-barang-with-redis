import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import DataTable from 'react-data-table-component';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: '',
    product_name: '',
    description: '',
    price: '',
    stock: '',
  });

  let [isOpen, setIsOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4040/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const handleViewTable = () => {
    setIsOpen(true);
  };

  const handleHideTable = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = async () => {
    // Generate a random ID using uuid
    const randomId = uuidv4();

    if (
      !newProduct.product_name ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      alert('Semua field harus diisi. Gagal menambahkan produk.');
      return;
    }

    const isDuplicateProduct = products.some(
      (product) =>
        product.data.product_name.toLowerCase() ===
        newProduct.product_name.toLowerCase()
    );

    if (isDuplicateProduct) {
      alert(
        'Produk yang anda tambahkan sudah tersedia. Gagal menambahkan user.'
      );
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:4040/product/add',
        { ...newProduct, id: randomId } // Include the generated ID in the request
      );
      console.log('API Response:', response.data);
      fetchData();
      setNewProduct({
        id: '',
        product_name: '',
        description: '',
        price: '',
        stock: '',
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (row) => {
    setEditingRowId(row.id);
    setNewProduct({
      id: row.id,
      product_name: row.data.product_name,
      description: row.data.description,
      price: row.data.price,
      stock: row.data.stock,
    });
  };

  const handleUpdateProduct = async () => {
    if (
      !newProduct.product_name ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      alert('Semua field harus diisi. Gagal update produk.');
      return;
    }

    // const isDuplicateProduct = products.some(
    //   (product) =>
    //     product.data.product_name.toLowerCase() ===
    //     newProduct.product_name.toLowerCase()
    // );

    // if (isDuplicateProduct) {
    //   alert('Produk yang anda tambahkan sudah tersedia. Gagal update produk.');
    //   return;
    // }
    try {
      const response = await axios.put(
        `http://localhost:4040/product/update/${newProduct.id}`,
        newProduct
      );
      console.log('API Response:', response.data);
      fetchData();
      setNewProduct({
        id: '',
        product_name: '',
        description: '',
        price: '',
        stock: '',
      });
      setEditingRowId(null); // Bersihkan nilai editingRowId setelah update
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4040/product/delete/${productId}`
      );
      console.log('API Response:', response.data);
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  const columns = [
    {
      name: 'Product Name',
      selector: (row) => (
        <div className="flex">
          {editingRowId === row.id ? '' : row.data.product_name}
          {editingRowId === row.id && (
            <input
              type="text"
              name="product_name"
              value={newProduct.product_name}
              onChange={handleInputChange}
              className="border border-stone-400 rounded pl-1 font-normal"
            />
          )}
        </div>
      ),
    },
    {
      name: 'Description',
      selector: (row) => (
        <div
          className="truncate overflow-hidden"
          style={{ whiteSpace: 'normal' }}
        >
          {editingRowId === row.id ? '' : row.data.description}
          {editingRowId === row.id && (
            <textarea
              type="text"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="border border-stone-400 rounded pl-1 font-normal"
            />
          )}
        </div>
      ),
    },
    {
      name: 'Price',
      selector: (row) => (
        <div className="flex">
          {editingRowId === row.id ? '' : row.data.price}
          {editingRowId === row.id && (
            <input
              type="text"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="border border-stone-400 rounded pl-1 font-normal"
            />
          )}
        </div>
      ),
    },
    {
      name: 'Stock',
      selector: (row) => (
        <div className="flex">
          {editingRowId === row.id ? '' : row.data.stock}
          {editingRowId === row.id && (
            <input
              type="text"
              name="stock"
              value={newProduct.stock}
              onChange={handleInputChange}
              className="border border-stone-400 rounded pl-1 font-normal"
            />
          )}
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => {
              editingRowId === row.id
                ? handleUpdateProduct()
                : handleEditProduct(row);
            }}
          >
            {editingRowId === row.id ? 'Save' : 'Edit'}
          </button>
          <button
            className="text-red-600 hover:text-red-900 ml-2"
            onClick={() => {
              editingRowId === row.id ? '' : handleDeleteProduct(row.id);
            }}
          >
            {editingRowId === row.id ? '' : 'Delete'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-20">
      <div className=" flex items-center justify-center text-3xl py-10 font-bold">
        Manage Products
      </div>
      {editingRowId === null && (
        <form className="">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border border-stone-300 bg-stone-200 px-5 py-3 text-left">
                  Add a New Product
                </th>
              </tr>
            </thead>
            <tbody className="border border-stone-300 text-left">
              <tr>
                <th className="px-5 py-5">
                  <label className="flex-col flex pb-2">
                    Product Name :
                    <input
                      type="text"
                      name="product_name"
                      value={newProduct.product_name}
                      onChange={handleInputChange}
                      className="border border-stone-400 rounded pl-1 font-normal"
                    />
                  </label>
                  <label className="flex flex-col pb-2">
                    Description:
                    <textarea
                      name="description" // Update the name attribute to "description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      className="border border-stone-400 rounded pl-1 font-normal"
                    />
                  </label>
                  <label className="flex-col flex pb-2">
                    Price :
                    <input
                      type="textarea"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      className="border border-stone-400 rounded pl-1 font-normal"
                    />
                  </label>
                  <label className="flex flex-col pb-2">
                    Stock:
                    <input
                      type="text"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      className="border border-stone-400 rounded pl-1 font-normal"
                    />
                  </label>
                  <div className="flex pt-2 justify-end">
                    <button
                      type="button"
                      onClick={isOpen ? handleHideTable : handleViewTable}
                      className="bg-sky-500 text-white px-2 py-1 mr-2 rounded-lg text-sm"
                    >
                      {isOpen ? 'Hide Table' : 'View Table'}
                    </button>
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="w-16 bg-black rounded-lg text-white font-medium text-sm"
                    >
                      Add
                    </button>
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </form>
      )}

      <div>
        {isOpen && (
          <div className="py-10">
            <div>
              <DataTable
                columns={columns}
                data={products}
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 20, 50]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
