import React, { useState, useEffect } from "react";
import { Trash2, Eye } from "lucide-react";
import { webApi } from "../../../api/api";

const SavedYoutube = () => {
  const [savedMedia, setSavedMedia] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch(`${webApi}/videos`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const videos = data.videos.map((filename, idx) => ({
            id: idx,
            url: `${webApi}/video/${filename}`,
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
    setSavedMedia(savedMedia.filter((item) => item.id !== id));
    setSelected(selected.filter((selId) => selId !== id));
  };

  const handleView = (url) => window.open(url, "_blank");

  const toggleSelect = (id) =>
    selected.includes(id)
      ? setSelected(selected.filter((selId) => selId !== id))
      : setSelected([...selected, id]);

  if (!savedMedia.length) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-300 h-full p-6">
        <p className="text-lg">No generated videos yet!</p>
      </div>
    );
  }

  return (
    <div className="p-0 sm:p-6 h-full overflow-y-auto">
      <h2 className="text-white font-semibold text-xl mb-4">Generated Videos</h2>

      {/* Large screen table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-[#111] text-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3 w-10">
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
                className="border-b border-gray-700 hover:bg-[#161616] transition-colors"
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
                    className="w-48 h-28 rounded bg-black object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{item.title}</span>
                    <span className="text-gray-400 text-sm">{item.date}</span>
                  </div>
                </td>
                <td className="p-3">{item.views}</td>
                <td className="p-3">{item.Visibility}</td>
                <td className="p-3">{item.platform}</td>
                <td className="p-3 flex justify-center gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden flex flex-col gap-4">
        {savedMedia.map((item) => (
          <div
            key={item.id}
            className="bg-[#111] p-2 rounded-md flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(item.url)}
                  className="p-2 rounded hover:bg-blue-600 transition"
                >
                  <Eye size={16} className="text-white" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded hover:bg-red-600 transition"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            </div>
            <video
              src={item.url}
              controls
              className="w-full h-40 rounded bg-black object-cover"
            />
            <div className="flex flex-col gap-1">
              <span className="text-gray-300 text-sm">{item.title}</span>
              <span className="text-gray-400 text-sm">{item.date}</span>
              <span className="text-gray-400 text-sm">
                Views: {item.views} | {item.Visibility} | {item.platform}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedYoutube;
