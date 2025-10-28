import React, { useEffect, useState } from "react";

const LanguageSelect = ({ language, setLanguage }) => {
  const allLanguages = [
    { code: "en", name: "English" },
    { code: "ar", name: "Arabic (العربية)" },
    { code: "da", name: "Danish (Dansk)" },
    { code: "de", name: "German (Deutsch)" },
    { code: "el", name: "Greek (Ελληνικά)" },
    { code: "es", name: "Spanish (Español)" },
    { code: "fi", name: "Finnish (Suomi)" },
    { code: "fr", name: "French (Français)" },
    { code: "he", name: "Hebrew (עברית)" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "it", name: "Italian (Italiano)" },
    { code: "ja", name: "Japanese (日本語)" },
    { code: "ko", name: "Korean (한국어)" },
    { code: "ms", name: "Malay (Bahasa Melayu)" },
    { code: "nl", name: "Dutch (Nederlands)" },
    { code: "no", name: "Norwegian (Norsk)" },
    { code: "pl", name: "Polish (Polski)" },
    { code: "pt", name: "Portuguese (Português)" },
    { code: "ru", name: "Russian (Русский)" },
    { code: "sv", name: "Swedish (Svenska)" },
    { code: "sw", name: "Swahili (Kiswahili)" },
    { code: "tr", name: "Turkish (Türkçe)" },
    { code: "zh", name: "Chinese (中文)" },
  ];

  useEffect(() => {
    // auto-detect user language
    const userLang = navigator.language.slice(0, 2);
    const isSupported = allLanguages.some((lang) => lang.code === userLang);
    if (isSupported) setLanguage(userLang);
  }, [setLanguage]);

  return (
    <div className="flex flex-col items-start space-y-2">
      <label
        htmlFor="language"
        className="text-sm font-medium text-gray-300 dark:text-gray-100"
      >
        Select Language
      </label>

      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full md:w-64 rounded-xl border border-gray-600 bg-gray-900 text-gray-100 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {allLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      <p className="text-xs text-gray-400">
        🌐 Current Language:{" "}
        <span className="font-semibold">{language || "en"}</span>
      </p>
    </div>
  );
};

export default LanguageSelect;
