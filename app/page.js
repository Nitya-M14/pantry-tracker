'use client';
import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, query, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', Quantity: '', category: '' });
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState(['Food', 'Beverages', 'Other']); 
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [updatedQuantity, setUpdatedQuantity] = useState('');

  // Add item to the database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.Quantity !== '' && newItem.category !== '') {
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        Quantity: newItem.Quantity,
        category: newItem.category,
      });
      setNewItem({ name: '', Quantity: '', category: '' });
    }
  };

  // Read items from the database
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
      
      // Calculate total from itemsArr
      const calculateTotal = () => {
        const totalQuantity = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.Quantity),
          0
        );
        setTotal(totalQuantity);
      };
      calculateTotal();
    });
    return () => unsubscribe();
  }, []);

  // Delete item from the database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  // Update item quantity in the database
  const updateItemQuantity = async (id) => {
    if (updatedQuantity === '') return;

    await updateDoc(doc(db, 'items', id), {
      Quantity: updatedQuantity,
    });

    setEditingItemId(null);
    setUpdatedQuantity('');
  };

  // Mark item as in stock
  const markAsInStock = async (id) => {
    await updateDoc(doc(db, 'items', id), {
      Quantity: '0', // or some other logic to handle "in stock"
    });
  };

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className='text-4xl p-4 text-center'>Pantry Tracker</h1>
        <div className='bg-slate-800 p-4 rounded-lg'>
          <form className='flex flex-col items-center gap-4 text-black' onSubmit={addItem}>
            <div className='flex gap-4'>
              <input 
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className='p-3 border text-center'
                type="text" 
                placeholder='Enter Item' 
              />
              <input 
                value={newItem.Quantity}
                onChange={(e) => setNewItem({ ...newItem, Quantity: e.target.value })}
                className='p-2 border text-center' 
                type="number" 
                placeholder='Enter Quantity' 
              />
            </div>
            <select 
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className='p-2 border text-center'
            >
              <option value=''>Select Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
            <button 
              type='submit'
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl'
            >
              +
            </button>
          </form>

          {/* Search Bar */}
          <div className='my-4'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='p-2 border w-full text-center  text-black'
              placeholder='Search items'
            />
          </div>

          <ul>
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className='capitalize'>{item.name}</span>
                  <span>{item.Quantity}</span>
                  <span className='capitalize'>{item.category}</span>
                </div>
                {editingItemId === item.id ? (
                  <div className='flex items-center'>
                    <input
                      type='number'
                      value={updatedQuantity}
                      onChange={(e) => setUpdatedQuantity(e.target.value)}
                      className='p-6 border text-center text-black'
                      placeholder='New Quantity'
                    />
                    <button 
                      onClick={() => updateItemQuantity(item.id)}
                      className='ml-2 p-2 border text-white bg-green-500 hover:bg-green-700'
                    >
                      Update
                    </button>
                    <button 
                      onClick={() => {
                        setEditingItemId(null);
                        setUpdatedQuantity('');
                      }}
                      className='ml-2 p-2 border text-white bg-red-500 hover:bg-red-700'
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setEditingItemId(item.id)}
                      className='ml-10 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-11'
                    >
                      NEED MORE
                    </button>

                    <button 
                      onClick={() => deleteItem(item.id)}
                      className='ml-4 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'
                    >
                    AT HOME
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {items.length > 0 && (
            <div className='flex justify-between p-3'>
              <span>Total Items:</span>
              <span>{total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
