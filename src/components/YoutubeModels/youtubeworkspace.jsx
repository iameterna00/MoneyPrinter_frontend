import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { Video, Film, User, Settings, LogOut } from "lucide-react";
import MoneyPrinter from "../../pages/MoneyPrinter";
import SidebarMenu from "./sidebar";
import SavedYoutube from "./youtubepages/saved";

// Pages

const ProfilePage = () => <div className="p-6 text-white">Profile</div>;
const SettingsPage = () => <div className="p-6 text-white">Settings</div>;
const LogoutPage = () => <div className="p-6 text-white">Logged Out</div>;

export default function YouTubeWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen ">
     <SidebarMenu/>

      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<MoneyPrinter />} />
          <Route path="/saved" element={<SavedYoutube />} />
          <Route path="/avatar" element={<SavedYoutube />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </main>
    </div>
  );
}
