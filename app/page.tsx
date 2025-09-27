"use client";

import { useState, useRef } from "react";

type FormData = {
  propertySubject: string;
  unitType: string;
  unitStatus: string;
  occupiedUnits: string;
  vacantUnits: string;
  clientBaseRent: string;
  clientRentOfCare: string;
  marketBaseRent: string;
  marketRentOfCare: string;
  desiredOccupancy: string;
};

export default function HomePage() {
  const formRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    propertySubject: "",
    unitType: "",
    unitStatus: "",
    occupiedUnits: "",
    vacantUnits: "",
    clientBaseRent: "",
    clientRentOfCare: "",
    marketBaseRent: "",
    marketRentOfCare: "",
    desiredOccupancy: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const [results, setResults] = useState<{
    info: string;
    suggestedBaseRent: string;
    suggestedRentOfCare: string;
    recommendation: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // For numeric fields: allow only numbers/floats
    if (
      [
        "occupiedUnits",
        "vacantUnits",
        "clientBaseRent",
        "clientRentOfCare",
        "marketBaseRent",
        "marketRentOfCare",
        "desiredOccupancy",
      ].includes(name)
    ) {
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertySubject) newErrors.propertySubject = "Required";
    if (!formData.unitType) newErrors.unitType = "Required";
    if (!formData.unitStatus) newErrors.unitStatus = "Required";

    [
      "occupiedUnits",
      "vacantUnits",
      "clientBaseRent",
      "clientRentOfCare",
      "marketBaseRent",
      "marketRentOfCare",
      "desiredOccupancy",
    ].forEach((key) => {
      const value = formData[key as keyof FormData];
      if (value === "") newErrors[key] = "Required";
      else if (isNaN(Number(value))) newErrors[key] = "Must be a number";
      else if (Number(value) < 0) newErrors[key] = "Must be ≥ 0";
    });

    const occ = Number(formData.desiredOccupancy);
    if (!isNaN(occ) && (occ < 0 || occ > 100)) {
      newErrors.desiredOccupancy = "Must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertySubject: formData.propertySubject,
          unitType: formData.unitType,
          unitStatus: formData.unitStatus,
          occupiedUnits: Number(formData.occupiedUnits),
          vacantUnits: Number(formData.vacantUnits),
          clientBaseRent: Number(formData.clientBaseRent),
          clientRentOfCare: Number(formData.clientRentOfCare),
          marketBaseRent: Number(formData.marketBaseRent),
          marketRentOfCare: Number(formData.marketRentOfCare),
          desiredOccupancy: Number(formData.desiredOccupancy),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "API request failed");
      }

      const { data } = await res.json();

      const [info, suggestedBaseRent, suggestedRentOfCare, recommendation] =
        data as [string, string, string, string];

      setResults({
        info,
        suggestedBaseRent,
        suggestedRentOfCare,
        recommendation,
      });

      setShowModal(true);
    } catch (err: unknown) {
      setErrorModal(err.message || "Failed to fetch prediction");
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen text-white">
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-purple-500 border-opacity-75"></div>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#1E1E3F] to-[#0F0F2D] shadow-md">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide">
          Rental Price Prediction Tool
        </h1>
        <button
          onClick={scrollToForm}
          className="bg-gradient-to-r from-[#6B21A8] to-[#3B0764] text-white font-semibold px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          Calculate
        </button>
      </header>

      {/* Hero */}
      <section className="flex flex-col justify-center items-center text-center h-[80vh] px-6 bg-gradient-to-br from-[#1A1A2E] via-[#0F172A] to-[#0A0A0F]">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Predict Your Rental Price with Confidence
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
          Harness the power of AI to determine the most accurate rental pricing
          for your property. Quick, reliable, and tailored to your needs.
        </p>
        <button
          onClick={scrollToForm}
          className="bg-gradient-to-r from-[#6B21A8] to-[#3B0764] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition transform hover:scale-105"
        >
          Calculate Rent
        </button>
      </section>

      {/* Content background wrapper */}
      <section className="bg-[#1C1C24] pb-24">
        {/* Form */}
        <div
          ref={formRef}
          className="max-w-3xl mx-auto text-gray-200 shadow-xl rounded-lg p-8 mt-12"
        >
          <h3 className="text-xl font-bold mb-6">Enter Property Details</h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* subject_prefix */}
            <div>
              <label className="block mb-2 font-medium">Property Subject</label>
              <select
                name="propertySubject"
                value={formData.propertySubject}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-[#0D1117] border-gray-600 text-white"
              >
                <option value="">Select...</option>
                <option value="AL">AL</option>
                <option value="MC">MC</option>
                <option value="IL">IL</option>
              </select>
              {errors.propertySubject && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.propertySubject}
                </p>
              )}
            </div>

            {/* unit_category */}
            <div>
              <label className="block mb-2 font-medium">Unit Type</label>
              <select
                name="unitType"
                value={formData.unitType}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-[#0D1117] border-gray-600 text-white"
              >
                <option value="">Select...</option>
                {[
                  "Studio",
                  "One Bedroom",
                  "Two Bedroom",
                  "Companion",
                  "1 BR Small",
                  "1 BR Large",
                  "2 BR Small",
                  "2 BR Large",
                ].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.unitType && (
                <p className="text-red-500 text-sm mt-1">{errors.unitType}</p>
              )}
            </div>

            {/* unit_status */}
            <div>
              <label className="block mb-2 font-medium">Unit Status</label>
              <select
                name="unitStatus"
                value={formData.unitStatus}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-[#0D1117] border-gray-600 text-white"
              >
                <option value="">Select...</option>
                <option value="Vacant">Vacant</option>
                <option value="Occupied">Occupied</option>
              </select>
              {errors.unitStatus && (
                <p className="text-red-500 text-sm mt-1">{errors.unitStatus}</p>
              )}
            </div>

            {/* Numeric fields */}
            {[
              ["occupiedUnits", "Occupied Units"],
              ["vacantUnits", "Vacant Units"],
              ["clientBaseRent", "Client Base Rent ($)"],
              ["clientRentOfCare", "Client Rent of Care ($)"],
              ["marketBaseRent", "Market Base Rent ($)"],
              ["marketRentOfCare", "Market Rent of Care ($)"],
              ["desiredOccupancy", "Desired Occupancy Rate (%)"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block mb-2 font-medium">{label}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key as keyof FormData]}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-[#0D1117] border-gray-600 text-white"
                />
                {errors[key as string] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[key as string]}
                  </p>
                )}
              </div>
            ))}

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#6B21A8] to-[#3B0764] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Success Modal */}
      {showModal && results && !errorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#1C1C24] text-gray-200 rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Prediction Results
            </h3>

            <div className="space-y-4">
              <div>
                <p className="font-medium">Suggested Base Rent:</p>
                <p className="text-lg">${results.suggestedBaseRent}</p>
              </div>
              <div>
                <p className="font-medium">Suggested Rent of Care:</p>
                <p className="text-lg">${results.suggestedRentOfCare}</p>
              </div>
              <div>
                <p className="font-medium">Recommendation:</p>
                <p className="text-lg">{results.recommendation}</p>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gradient-to-r from-[#6B21A8] to-[#3B0764] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#1C1C24] text-gray-200 rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setErrorModal(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-4 text-red-400">API Error</h3>
            <p>{errorModal}</p>

            <div className="mt-6 text-right">
              <button
                onClick={() => setErrorModal(null)}
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
