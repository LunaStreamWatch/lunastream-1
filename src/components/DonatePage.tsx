import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Film, Heart, Copy, Check, Bitcoin, Coins, DollarSign, Shield } from 'lucide-react';
import GlobalNavbar from './GlobalNavbar';
import { useLanguage } from './LanguageContext';
import { translations } from '../data/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

const DonatePage: React.FC = () => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const isMobile = useIsMobile();

  const cryptoAddresses = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      address: 'bc1qu6mr60wy4ldq9ym2zcmc57jaa5zudkgev7h5d3',
      icon: Bitcoin,
      color: 'from-orange-400 to-orange-600'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '0xB06d3d3D778cBb57d208890ca8deBE985FD738B1',
      icon: Coins,
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Litecoin',
      symbol: 'LTC',
      address: 'LSQ4Q2wAcpCXYppaDXEU4inavTi5zZdnyS',
      icon: Coins,
      color: 'from-gray-400 to-gray-600'
    },
    {
      name: 'Monero',
      symbol: 'XMR',
      address: '44V5nhNyiywe31r87WBZLP7AiKmW63tf5EwYFpqQ7BRuhts1tMzA8gvFeFEsL3pjGQ9ipnd43YUBQYWPaS7uBihKEr1kCdB',
      icon: Shield,
      color: 'from-orange-500 to-red-600'
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      address: '2v3vFWGmR6nvLjzYZz5LGjQr73US1S3obeKkZavJjU2j',
      icon: Coins,
      color: 'from-purple-400 to-purple-600'
    },
    {
      name: 'Polygon',
      symbol: 'MATIC',
      address: '0xB06d3d3D778cBb57d208890ca8deBE985FD738B1',
      icon: Coins,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const copyToClipboard = async (address: string, symbol: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(symbol);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <GlobalNavbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className={`text-center ${isMobile ? 'mb-8' : 'mb-12'}`}>
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className={`font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300 ${isMobile ? 'text-2xl' : 'text-4xl sm:text-5xl'}`}>
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {t.donate_support_title}
            </span>
          </h1>
          <p className={`text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${isMobile ? 'text-base' : 'text-xl'}`}>
            {t.donate_support_subtitle}
          </p>
        </div>

        {/* What Donations Do */}
        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border border-pink-200/50 dark:border-gray-700/50 transition-colors duration-300 ${isMobile ? 'rounded-xl p-4 mb-6' : 'rounded-2xl p-8 mb-12'}`}>
          <h2 className={`font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            <DollarSign className="w-7 h-7 mr-3 text-green-500" />
            {t.donate_how_help_title}
          </h2>
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2'}`}>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className={`text-gray-700 dark:text-gray-300 transition-colors duration-300 ${isMobile ? 'text-sm' : ''}`}><strong>{t.donate_domain_costs}</strong> {t.donate_domain_costs_desc}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className={`text-gray-700 dark:text-gray-300 transition-colors duration-300 ${isMobile ? 'text-sm' : ''}`}><strong>{t.donate_development}</strong> {t.donate_development_desc}</p>
              </div>
            </div>
            <div className={`space-y-4 ${isMobile ? 'mt-2' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className={`text-gray-700 dark:text-gray-300 transition-colors duration-300 ${isMobile ? 'text-sm' : ''}`}><strong>{t.donate_accessibility}</strong> {t.donate_accessibility_desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cryptocurrency Addresses */}
        <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border border-pink-200/50 dark:border-gray-700/50 transition-colors duration-300 ${isMobile ? 'rounded-xl p-4' : 'rounded-2xl p-8'}`}>
          <h2 className={`font-bold text-gray-900 dark:text-white mb-6 flex items-center transition-colors duration-300 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            <Bitcoin className="w-7 h-7 mr-3 text-orange-500" />
            {t.donate_crypto_title}
          </h2>
          <p className={`text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300 ${isMobile ? 'text-sm mb-4' : ''}`}>
            {t.donate_crypto_desc}
          </p>
          
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1 gap-3' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {cryptoAddresses.map((crypto) => {
              const IconComponent = crypto.icon;
              return (
                <div
                  key={crypto.symbol}
                  className={`group bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${isMobile ? 'rounded-lg p-3' : 'rounded-xl p-4'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`bg-gradient-to-r ${crypto.color} rounded-lg flex items-center justify-center shadow-md ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold text-gray-900 dark:text-white transition-colors duration-300 ${isMobile ? 'text-sm' : ''}`}>{crypto.name}</h3>
                        <p className={`text-gray-500 dark:text-gray-400 transition-colors duration-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>{crypto.symbol}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 transition-colors duration-300 ${isMobile ? 'p-2' : 'p-3'}`}>
                    <p className={`font-mono text-gray-700 dark:text-gray-300 break-all leading-relaxed transition-colors duration-300 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                      {crypto.address}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => copyToClipboard(crypto.address, crypto.symbol)}
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      copiedAddress === crypto.symbol
                        ? 'bg-green-500 text-white'
                        : `bg-gradient-to-r ${crypto.color} text-white hover:shadow-md`
                    } ${isMobile ? 'text-sm py-2' : ''}`}
                  >
                    {copiedAddress === crypto.symbol ? (
                      <>
                        <Check className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                        <span>{t.donate_copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                        <span>{t.donate_copy_address}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Thank You Message */}
        <div className={`text-center ${isMobile ? 'mt-6' : 'mt-12'}`}>
          <div className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white ${isMobile ? 'rounded-xl p-4' : 'rounded-2xl p-8'}`}>
            <h3 className={`font-bold mb-4 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{t.donate_thank_you_title}</h3>
            <p className={`opacity-90 max-w-2xl mx-auto ${isMobile ? 'text-sm' : 'text-lg'}`}>
              {t.donate_thank_you_message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
