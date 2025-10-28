import React, { useState } from "react";
import axios from "axios";
import UploadSection from "./components/UploadSection";
import ResultSection from "./components/ResultSection";
import Header from "./components/Header";
import StatsSection from "./components/StatsSection";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to analyze image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <UploadSection
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            loading={loading}
            onFileSelect={handleFileSelect}
            onUpload={handleUpload}
            onReset={handleReset}
          />

          {/* Result Section */}
          <ResultSection result={result} error={error} loading={loading} />
        </div>

        {/* Stats Section */}
        <StatsSection />
      </main>

      <footer className="text-center py-6 text-gray-600 text-sm">
        <p>
          © 2025 Pneumonia Detection AI | Built with React, Flask & TensorFlow
        </p>
      </footer>
    </div>
  );
}

export default App;
