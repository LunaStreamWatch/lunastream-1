import React from "react"
import { useLocation } from "react-router-dom"
import { Film, Tv } from "lucide-react"
import { translations } from "../data/i18n"
import { useLanguage } from "./LanguageContext"

interface LoadingProps {
  message?: string
}

const Loading: React.FC<LoadingProps> = ({ message }) => {
  const location = useLocation()
  const path = location.pathname
  const Icon = path.startsWith("/tv") ? Tv : Film

  const { language } = useLanguage()
  const t = translations[language] || translations.en
  const displayMessage = message || t.status_loading

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center transition-colors duration-300">
      <div className="text-center">
        <div className="w-20 h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-pink-200/50 dark:border-gray-700/50 rounded-full animate-spin shadow-xl flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-pink-500 dark:text-purple-400" />
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 transition-colors duration-300">
          {displayMessage}
        </p>
      </div>
    </div>
  )
}

export default Loading
