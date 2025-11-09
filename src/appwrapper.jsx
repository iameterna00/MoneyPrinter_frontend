import { Routes, Route, Navigate } from "react-router-dom";
import YouTubeWorkspace from './components/YoutubeModels/youtubeworkspace';
import Home from "./home";




export default function AppWrapper() {

  return (
    <>
   <Routes>
      {/* <Route path="/" element={<Navigate to="/youtube" replace />} /> */}
      <Route path="/youtube/*" element={<YouTubeWorkspace />} />
      <Route path="/" element={<Home />} />
    </Routes>
    </>
  );
}
