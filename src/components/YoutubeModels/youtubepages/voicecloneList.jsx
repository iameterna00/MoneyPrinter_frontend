import React, { useEffect, useState } from "react";
import { webApi } from "../../../api/api";

export default function VoiceCloneList() {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    fetch(`${webApi}/list-audio`)
      .then(res => res.json())
      .then(data => setVoices(data.voices))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {voices.map((voice, idx) => (
        <div key={idx} className="p-2 bg-gray-800 rounded">
          <p className="text-white text-sm">{voice}</p>
          <audio controls src={`${webApi}/voiceclone/files/${voice}`} className="mt-2 w-full" />
        </div>
      ))}
    </div>
  );
}
