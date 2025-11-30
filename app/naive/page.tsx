"use client";

import { useState } from "react";
import { testNaive } from "../../api/Route"; // IMPORT CONTROLLER

type NbForm = {
  fixed_acidity: string;
  volatile_acidity: string;
  citric_acid: string;
  residual_sugar: string;
  chlorides: string;
  free_sulfur_dioxide: string;
  total_sulfur_dioxide: string;
  density: string;
  ph: string;
  sulphates: string;
  alcohol: string;
};

export default function NaiveBayesInputPage() {
  const [form, setForm] = useState<NbForm>({
    fixed_acidity: "",
    volatile_acidity: "",
    citric_acid: "",
    residual_sugar: "",
    chlorides: "",
    free_sulfur_dioxide: "",
    total_sulfur_dioxide: "",
    density: "",
    ph: "",
    sulphates: "",
    alcohol: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [hasil, setHasil] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    setError(null);
    setHasil(null);

    // ❌ CEK FORM KOSONG
    for (let key in form) {
      if (form[key as keyof NbForm] === "") {
        setError(`Field "${key.replace(/_/g, " ")}" tidak boleh kosong.`);
        return;
      }
    }

    // bentuk payload angka
    const payload: any = {};
    Object.keys(form).forEach((key) => {
      payload[key] = Number(form[key as keyof NbForm]);
    });

    setLoading(true);
    const result = await testNaive(payload);
    setLoading(false);
    setHasil(result);
  };
  return (
    <div className="bg-white min-h-screen w-full p-6">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-2 text-black">
          Naive Bayes – Wine Quality Prediction
        </h1>
        <p className="mb-6 text-gray-600">
          Fill out the values below to predict wine quality using the Naive
          Bayes model.
        </p>

        {/* Input Card */}
        <div className="bg-white shadow rounded-xl p-6 border-2 border-black">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Wine Characteristics (ID3)
          </h2>

          {/* 🔥 ERROR HANDLING */}
          {error && (
            <div className="mb-3 text-red-600 font-semibold">⚠️ {error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {Object.keys(form).map((field) => (
              <div key={field} className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-black capitalize">
                  {field.replace(/_/g, " ")}
                </label>
                <input
                  type="number"
                  step="any"
                  name={field}
                  value={form[field as keyof NbForm]}
                  onChange={handleChange}
                  className="border rounded-lg p-2 text-gray-600 placeholder:text-gray-400
                    focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={`Input ${field.replace(/_/g, " ")}`}
                />
              </div>
            ))}
          </div>

          {/* Tombol */}
          <div className="flex justify-end gap-4 mt-6">
            <button className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
              Draft
            </button>
            <button
              onClick={handlePredict}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading ? "Processing..." : "Predict"}
            </button>
          </div>

          {hasil && !hasil.error && (
            <div className="mt-6 p-4 border rounded-lg bg-black text-white">
              <h3 className="font-semibold mb-2">Hasil Prediksi:</h3>
              <p>
                <b>Akurasi Model :</b> {(hasil.akurasi_model * 100).toFixed(2)}%
              </p>
              <p>
                <b>Kelas :</b> {hasil.kelas}
              </p>
              <p>
                <b>Prediksi :</b> {hasil.prediksi}
              </p>
              <p>
                <b>F1-SCORE :</b> {hasil.f1_score}
              </p>
              <p>
                <b>Precission :</b> {hasil.precision}
              </p>
              <p>
                <b>Recall :</b> {hasil.recall}
              </p>
            </div>
          )}

          {hasil?.error && (
            <p className="text-red-600 mt-4">API Error: {hasil.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
