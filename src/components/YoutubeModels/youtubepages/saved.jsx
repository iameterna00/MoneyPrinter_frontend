import React, { useState, useEffect } from "react";
import { Trash2, Eye } from "lucide-react";

const SavedYoutube = () => {
  const [savedMedia, setSavedMedia] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    // Fetch all generated videos from backend
    fetch("http://localhost:8080/videos")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // Map filenames to media objects
          const videos = data.videos.map((filename, idx) => ({
            id: idx,
            url: `http://localhost:8080/video/${filename}`,
            title: filename,
            date: new Date().toLocaleDateString(),
            views: 0,
            platform: "Generated",
            Visibility: "Private",
          }));
          setSavedMedia(videos);
        }
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  const handleDelete = (id) => {
    const filtered = savedMedia.filter((item) => item.id !== id);
    setSavedMedia(filtered);
    setSelected(selected.filter((selId) => selId !== id));
  };

  const handleView = (url) => {
    window.open(url, "_blank");
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((selId) => selId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  if (!savedMedia.length) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-300 h-full p-6">
        <p className="text-lg">No generated videos yet!</p>
      </div>
    );
  }

  return (
    <div className="p-6  h-full overflow-y-auto scrollbar-hide">
      <h2 className="text-white font-semibold text-xl mb-4">Generated Videos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#111] text-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="lightborderbottom">
              <th className="p-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={selected.length === savedMedia.length}
                  onChange={(e) =>
                    e.target.checked
                      ? setSelected(savedMedia.map((m) => m.id))
                      : setSelected([])
                  }
                />
              </th>
              <th className="p-3 text-left">Video & Title</th>
              <th className="p-3 text-left">Views</th>
              <th className="p-3 text-left">Visibility</th>
              <th className="p-3 text-left">Platform</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedMedia.map((item) => (
              <tr
                key={item.id}
                className="lightborderbottom hover:bg-[#161616] transition-colors"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                </td>

                <td className="p-3 flex items-center gap-4">
                  <video
                    src={item.url}
                    controls
                    className="w-48 h-28 darkbg rounded"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{item.title}</span>
                    <span className="text-gray-400 text-sm">{item.date}</span>
                  </div>
                </td>

                <td className="p-3">{item.views}</td>
                <td className="p-3">{item.Visibility}</td>
                <td className="p-3">{item.platform}</td>

                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleView(item.url)}
                      className="p-2 rounded hover:bg-blue-600 transition"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded hover:bg-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SavedYoutube;
