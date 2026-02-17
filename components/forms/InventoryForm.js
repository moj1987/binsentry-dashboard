'use client';

import { useState } from 'react';

export default function InventoryForm({ bins, onAdd }) {
  const [formData, setFormData] = useState({
    binId: '',
    feedType: '',
    quantity: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
          entryDate: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setMessage('Inventory item added successfully!');
        setFormData({ binId: '', feedType: '', quantity: '', notes: '' });
        onAdd(); // Refresh the data
      } else {
        setMessage('Error adding inventory item');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-50">
      <h3 className="font-semibold mb-3">Add Inventory Item</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Bin</label>
          <select
            name="binId"
            value={formData.binId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a bin</option>
            {bins.map(bin => (
              <option key={bin.id} value={bin.id}>
                {bin.name} - {bin.location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Feed Type</label>
          <input
            type="text"
            name="feedType"
            value={formData.feedType}
            onChange={handleChange}
            placeholder="e.g., Corn, Soybeans, Wheat"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Amount in units"
            min="1"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes..."
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Inventory'}
        </button>

        {message && (
          <div className={`p-2 rounded text-sm ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
