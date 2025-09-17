import { useState, useEffect } from "react";
import axios from "axios";
import { webApi } from "../api/api";
import { Download, Share2, Trash } from 'lucide-react';
function ShortsGallery({ isLoading }) {
  const [shorts, setShorts] = useState([]);

  const fetchShorts = async () => {
    try {
      const res = await axios.get(`${webApi}/shorts/anonymous`);
      setShorts(res.data.shorts || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  const handleDelete = async (video_id) => {
    try {
      await axios.delete(`${webApi}/shorts/${video_id}`);
      // Re-fetch after deletion
      fetchShorts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete short");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-6 w-[80vw]">
      {isLoading
        ? Array(2).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div className="w-full max-w-xs h-[360px] rounded-lg overflow-hidden relative bg-gray-700">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-skeleton"></div>
              </div>
              <div className="w-40 h-4 mt-2 bg-gray-600 rounded animate-pulse"></div>
            </div>
          ))
        : shorts.map((short, i) => (
            <div key={i} className="flex flex-col items-center w-full">
             <video className="w-full max-w-xs aspect-[9/16] bg-black" controls>
  <source src={short.cloudinary_url} type="video/mp4" />
</video>

              {/* <p className="mt-2 break-words text-center">
                {short.cloudinary_url.split("/").pop()}
              </p> */}
             <div className="flex gap-2 items-center justify-between w-full" >
              <Download/>
               <button
                onClick={() => handleDelete(short.video_id)}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                <Trash size={16}/>
              </button>
             </div>
            </div>
          ))}
    </div>
  );
}


function Youtube() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${webApi}/process_video`, { url: youtubeUrl });
      // Optionally, trigger a re-fetch of ShortsGallery here
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh]  overflow-auto darkbg text-white flex flex-col items-center p-4">
      <div className="flex flex-col mt-40 items-center w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Generate Viral Youtube Shorts</h1>

      <form onSubmit={handleSubmit} className="flex  flex-col gap-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="lightborder p-2 rounded-lg"
          required
        />
        <button
          type="submit"
          className="started p-3 mt-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? "Processing..." : "Analyze Video"}
        </button>
      </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <ShortsGallery isLoading={loading} />
    </div>
  );
}

export default Youtube;
