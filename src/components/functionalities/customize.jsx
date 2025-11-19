import React, { useState, useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { webApi } from "../../api/api";

export default function Customize({ defaultImage }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Create preview URL for display
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setUploadedFile(null);
      setPreviewUrl(null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const editImage = async () => {
    if (!uploadedFile || !prompt.trim()) {
      alert("Please upload an image and enter a prompt");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Only append the uploaded file (since defaultImage is a URL, not a file)
      formData.append('uploadedImage', uploadedFile);
      formData.append('prompt', prompt.trim());
      formData.append('defaultImageUrl', defaultImage); // Send the URL as a string

      console.log("Sending data:", {
        defaultImageUrl: defaultImage,
        uploadedImage: uploadedFile.name,
        prompt: prompt.trim()
      });

      const response = await fetch(`${webApi}/edit_img`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);
      alert("Video generation started successfully!");

    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-white w-full flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />

        <div
          className="w-full min-h-64 border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition"
          onClick={openFileDialog}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Uploaded" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <FiUpload size={40} className="mb-2" />
              <span>Click to upload image</span>
            </div>
          )}
        </div>
      </div>

      {previewUrl && (
        <div className="p-2 w-full max-w-sm">
          <p>Prompt</p>
          <input 
            placeholder="Enter your prompt to change image" 
            className="lightborder p-2 bg-gray-900 w-full rounded-lg" 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <button
            onClick={editImage}
            disabled={isLoading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Changing..." : "Change Image"}
          </button>
        </div>
      )}
    </div>
  );
}