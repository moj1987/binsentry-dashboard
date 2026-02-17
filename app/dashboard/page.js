'use client';

import { useState, useEffect } from 'react';
import BinLevelChart from '../../components/charts/BinLevelChart';
import BinUpdateForm from '../../components/forms/BinUpdateForm';
import InventoryForm from '../../components/forms/InventoryForm';

export default function Dashboard() {
  const [bins, setBins] = useState([]);
  const [inventory, setInventory] = useState([]);

  const fetchBins = async () => {
    const response = await fetch('/api/bins');
    const data = await response.json();
    setBins(data);
  };

  const fetchInventory = async () => {
    const response = await fetch('/api/inventory');
    const data = await response.json();
    setInventory(data);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchBins();
      await fetchInventory();
    };
    loadData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">BinSentry Dashboard</h1>
      
      {/* Chart Section */}
      <div className="mb-8">
        <BinLevelChart data={bins} />
      </div>
      
      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Update Bin Level</h2>
          {bins.length > 0 && (
            <BinUpdateForm 
              bin={bins[0]} 
              onUpdate={() => {
                fetchBins();
                fetchInventory();
              }} 
            />
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Inventory</h2>
          <InventoryForm 
            bins={bins} 
            onAdd={() => {
              fetchBins();
              fetchInventory();
            }} 
          />
        </div>
      </div>
      
      {/* Data Display Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Feed Bins</h2>
          <div className="space-y-2">
            {bins.map(bin => (
              <div key={bin.id} className="border p-4 rounded">
                <h3>{bin.name}</h3>
                <p>Location: {bin.location}</p>
                <p>Level: {bin.currentLevel}/{bin.capacity}</p>
                <p>Status: {bin.status}</p>
                <p className="text-sm text-gray-500">
                  Updated: {new Date(bin.lastUpdated).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Inventory</h2>
          <div className="space-y-2">
            {inventory.map(item => (
              <div key={item.id} className="border p-4 rounded">
                <h3>{item.feedType}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Bin: {item.binId}</p>
                <p>{item.notes}</p>
                <p className="text-sm text-gray-500">
                  Added: {new Date(item.entryDate).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}