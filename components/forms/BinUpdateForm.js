'use client';

import { useState } from 'react';

export default function BinUpdateForm({ bin, onUpdate }) {
  const [currentLevel, setCurrentLevel] = useState(bin.level);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/bins`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        id: bin.id,
        name: bin.name,
        level: parseInt(currentLevel),
        location: bin.location, 
        lastUpdated: new Date().toISOString()
      }),
      });

      if (response.ok) {
        setMessage('Bin updated successfully!');
        onUpdate(); // Refresh the data
      } else {
        setMessage('Error updating bin');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-50">
      <h3 className="font-semibold mb-3">Update {bin.name}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Level (max: {bin.capacity})
          </label>
          <input
            type="number"
            min="0"
            max={bin.capacity}
            value={currentLevel}
            onChange={(e) => setCurrentLevel(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Updating...' : 'Update Bin'}
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
