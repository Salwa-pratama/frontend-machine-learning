"use client";

import { useState } from "react";
import { testNaive } from "../../api/Route";

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasil, setHasil] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleClear = () => {
    setForm({
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

    setErrors({});
    setHasil(null);
  };

  const handlePredict = async () => {
    setErrors({});
    setHasil(null);

    let newErrors: Record<string, string> = {};
    let hasError = false;

    for (let key in form) {
      if (form[key as keyof NbForm] === "") {
        newErrors[key] = `${key.replace(/_/g, " ")} tidak boleh kosong`;
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

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
        <h1 className="text-2xl font-bold mb-2 text-black">
          Naive Bayes – Wine Quality Prediction
        </h1>
        <p className="mb-6 text-gray-600">
          Fill out the values below to predict wine quality using the Naive
          Bayes model.
        </p>

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
              <b>Precision :</b> {hasil.precision}
            </p>
            <p>
              <b>Recall :</b> {hasil.recall}
            </p>
          </div>
        )}

        {hasil?.error && (
          <p className="text-red-600 mt-4">API Error: {hasil.message}</p>
        )}

        <div className="bg-white shadow rounded-xl p-6 border-2 border-black mt-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Wine Characteristics (Naive Bayes)
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {Object.keys(form).map((field) => (
              <div key={field} className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-black capitalize">
                  {field.replace(/_/g, " ")}
                </label>

                <input
                  type="number"
                  step="any"
                  min="0"
                  name={field}
                  value={form[field as keyof NbForm]}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Cegah angka negatif
                    if (value.startsWith("-")) return;

                    setForm({ ...form, [field]: value });

                    // hapus error
                    setErrors((prev) => ({ ...prev, [field]: "" }));
                  }}
                  // Cegah scroll mouse bikin nilai turun / negatif
                  onWheel={(e) => e.currentTarget.blur()}
                  // Cegah input karakter: e, E, +, -
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="border rounded-lg p-2 text-gray-600 placeholder:text-gray-400
    focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={`Input ${field.replace(/_/g, " ")}`}
                />

                {errors[field] && (
                  <span className="text-red-600 text-sm mt-1">
                    {errors[field]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleClear}
              className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Clear
            </button>

            <button
              onClick={handlePredict}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading ? "Processing..." : "Predict"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
