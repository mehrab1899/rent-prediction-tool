"use client";

import { useState } from "react";

export default function HomePage() {
  const [formData, setFormData] = useState({
    propertySubject: "AL",
    unitType: "Studio",
    unitStatus: "Vacant",
    occupiedUnits: 0,
    vacantUnits: 0,
    clientBaseRent: 0,
    clientRentOfCare: 0,
    marketBaseRent: 0,
    marketRentOfCare: 0,
    desiredOccupancy: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow px-6 py-4">
        <h1 className="text-xl font-bold">Rental Price Prediction Tool</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Calculate
        </button>
      </header>

      {/* Tagline Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-blue-100">
        <h2 className="text-2xl font-semibold mb-4">
          Predict the optimal rental price with ease 🚀
        </h2>
        <p className="text-gray-700 mb-6">
          Enter your property details and calculate the recommended rent in
          seconds.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
          Calculate Rent
        </button>
      </section>

      {/* Form Section */}
      <section className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
        <h3 className="text-lg font-semibold mb-6">Property Details</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dropdowns */}
          <div>
            <label className="block mb-2 font-medium">Property Subject</label>
            <select
              name="propertySubject"
              value={formData.propertySubject}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="AL">AL</option>
              <option value="ML">ML</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Unit Type</label>
            <select
              name="unitType"
              value={formData.unitType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Studio">Studio</option>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Unit Status</label>
            <select
              name="unitStatus"
              value={formData.unitStatus}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Vacant">Vacant</option>
              <option value="Occupied">Occupied</option>
            </select>
          </div>

          {/* Numeric fields */}
          <div>
            <label className="block mb-2 font-medium">Occupied Units</label>
            <input
              type="number"
              name="occupiedUnits"
              value={formData.occupiedUnits}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Vacant Units</label>
            <input
              type="number"
              name="vacantUnits"
              value={formData.vacantUnits}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Client Base Rent ($)</label>
            <input
              type="number"
              name="clientBaseRent"
              value={formData.clientBaseRent}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Client Rent of Care ($)</label>
            <input
              type="number"
              name="clientRentOfCare"
              value={formData.clientRentOfCare}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Market Base Rent ($)</label>
            <input
              type="number"
              name="marketBaseRent"
              value={formData.marketBaseRent}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Market Rent of Care ($)</label>
            <input
              type="number"
              name="marketRentOfCare"
              value={formData.marketRentOfCare}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Desired Occupancy Rate (%)</label>
            <input
              type="number"
              name="desiredOccupancy"
              value={formData.desiredOccupancy}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Submit button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
