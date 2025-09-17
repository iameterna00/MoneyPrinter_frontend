import { Routes, Route, Navigate } from "react-router-dom";
import YouTubeWorkspace from './components/YoutubeModels/youtubeworkspace';



export default function AppWrapper() {

  return (
    <>
   <Routes>
      <Route path="/" element={<Navigate to="/workspace" replace />} />
      <Route path="/youtube/*" element={<YouTubeWorkspace />} />
    </Routes>
    </>
  );
}
