export const languages = [
  { name: 'English', shortname: 'en', flag: '🇬🇧' },
  { name: 'Dansk', shortname: 'dk', flag: '🇩🇰' },
  { name: 'Deutsch', shortname: 'de', flag: '🇩🇪' },
  { name: 'Français', shortname: 'fr', flag: '🇫🇷' },
  { name: 'Italiano', shortname: 'it', flag: '🇮🇹' },
  { name: 'Русский', shortname: 'ru', flag: '🇷🇺' },
  { name: '日本語', shortname: 'ja', flag: '🇯🇵' },
];

export const translations = {
  en: {
    result: "result",
    results: "results",
    tv_not_found: 'Show not found',
    s: 's',
    // Navigation
    nav_home: 'Home',
    nav_search: 'Search',
    nav_discover: 'Discover',
    nav_vault: 'Vault',
    nav_donate: 'Donate',
    nav_language: 'Language',
    nav_theme: 'Theme',
    
    // generic
    season: "Season",
    seasons: "Seasons",
    episode: "Episode",
    episode_aired: 'Aired',
    episodes: 'Episodes',
    overview: 'Overview',
    minutes: 'minutes',
    
    // New detail pages
    season_not_found: 'Season not found',
    episode_not_found: 'Episode not found',
    back_to_show: 'Back to Show',
    back_to_season: 'Back to Season',
    show_episode_info: 'Show episode info',
    close_player: 'Close Player',
    toggle_favorite: 'Toggle Favorite',
    
    // Cast
    cast_overview: 'Cast Overview',
    status_loading_cast: 'Loading cast...',
    status_no_cast_info: 'No cast information available.',
    status_loading_episodes: 'Loading episodes...',
    
    // Home page
    home_heading_title: 'Watch Movies & TV Shows',
    home_heading_subtitle: 'Discover and stream your favorite content with our beautiful, easy-to-use platform',
    home_now_playing: 'Now Playing',
    home_coming_soon: 'Coming Soon',
    home_trending_loading: 'Loading trending content...',
    home_trending_fetch_error: 'Failed to fetch trending content:',
    
    // Search
    search_fail_error: 'Search fail:',
    search_results_for: 'Search Results for',
    search_no_results: 'No results found',
    search_no_results_for: 'No results found for',
    search_stay_safe_warning: 'Based on your search term, you might find disturbing content. Please stay safe.',
    search_stay_safe_continue: 'Continue anyway',
    search_placeholder: 'Search movies and TV shows...',
    
    // Content types
    content_movie_singular: 'Movie',
    content_movie_plural: 'Movies',
    content_tv_singular: 'TV Show',
    content_tv_plural: 'TV Shows',
    content_trending: 'Trending',
    content_genre_singular: 'Genre',
    content_genre_plural: 'Genres',
    content_no_image: 'No Image',
    content_n_a: 'N/A',
    content_seasons: 'Seasons:',
    content_episodes: 'Episodes:',
    content_tba: 'TBA',
    content_breakdown: 'Content Breakdown',
    
    // Filtering and sorting
    filter_show_results: 'Showing',
    filter_of: 'of',
    filter_result_singular: 'result',
    filter_result_plural: 'results',
    filter_popularity: 'Popularity',
    filter_relevance: 'Relevance',
    filter_everything: 'Everything',
    filter_all: 'All',
    filter_descending_short: 'Desc',
    filter_ascending_short: 'Asc',
    filter_rating: 'Rating',
    filter_release_date: 'Release Date',
    filter_newest: 'Newest',
    filter_oldest: 'Oldest',
    filter_loading: 'Loading',
    
    // Navigation buttons
    nav_previous: 'Previous',
    nav_next: 'Next',
    nav_first_page: 'First Page',
    nav_last_page: 'Last Page',
    nav_page: 'Page',
    nav_of: 'of',
    
    // Vault
    vault_tagline: 'Your personal collection of movies, shows, and favorites',
    vault_search_placeholder: 'Search your vault...',
    vault_watchlist: 'Watchlist',
    vault_favorites: 'Favourites',
    vault_statistics: 'Statistics',
    vault_my_content: 'My',
    vault_my_tv: 'My',
    vault_my_playlist: 'My',
    vault_recently_watched: 'Recently Watched',
    vault_clear_all_watchlist: 'Clear All',
    vault_clear_all_favorites: 'Clear All',
    vault_browse_content: 'Browse Content',
    vault_favorite: 'Favourite',
    vault_statistics_title: 'Your Vault Statistics',
    vault_total: 'Total',
    vault_watched: 'Watched',
    vault_content_breakdown: 'Content Breakdown',
    vault_breakdown: ' Breakdown',
    vault_keep_building_title: 'Keep Building Your Vault!',
    vault_keep_building_subtitle: 'Discover new content and continue growing your personal collection.',
    vault_browse_trending: 'Browse Trending',
    vault_search_content: 'Search Content',
    vault_search_your_vault: 'Search your vault',
    vault_no_results_found: 'No results found',
    vault_no_favorites_yet: 'No favorites yet',
    vault_no_favorites_match: 'No favorites match',
    vault_start_adding_favorites: 'Start adding movies and shows to your favorites by clicking the heart icon.',
    
    // Statistics
    movies: 'Movies',
    tvs: 'TV Shows',
    watched: 'Watched',
    
    // Common actions
    action_play: 'Play',
    action_watch: 'Watch',
    action_add_to_watchlist: 'Add to Watchlist',
    action_remove_from_watchlist: 'Remove from Watchlist',
    action_add_to_favorites: 'Add to Favorites',
    action_remove_from_favorites: 'Remove from Favorites',
    action_clear: 'Clear',
    action_delete: 'Delete',
    action_edit: 'Edit',
    action_save: 'Save',
    action_cancel: 'Cancel',
    action_confirm: 'Confirm',
    action_continue: 'Continue',
    action_copy: 'Copy',
    action_copied: 'Copied!',
    
    // Time and dates
    time_just_now: 'Just now',
    time_minutes_ago: '{count} minutes ago',
    time_hours_ago: '{count} hours ago',
    time_days_ago: '{count} days ago',
    time_weeks_ago: '{count} weeks ago',
    time_months_ago: '{count} months ago',
    time_years_ago: '{count} years ago',
    
    // Status messages
    status_loading: 'Loading...',
    status_loading_movie_details: 'Loading movie details...',
    status_loading_tv_details: 'Loading TV details...',
    status_error: 'Error',
    status_success: 'Success',
    status_no_data: 'No data available',
    status_empty: 'Empty',
    status_offline: 'You are offline',
    status_online: 'You are back online',
    status_no_upcoming_content: 'No upcoming content found.',
    status_failed_to_load: 'Failed to load upcoming titles.',
    
    // Confirmation dialogs
    confirm_clear_watchlist: 'Are you sure you want to clear your entire watchlist?',
    confirm_clear_favorites: 'Are you sure you want to clear all favorites?',
    confirm_delete_item: 'Are you sure you want to delete this item?',
    
    // Accessibility
    accessibility_menu_button: 'Menu',
    accessibility_close_button: 'Close',
    accessibility_search_button: 'Search',
    accessibility_language_selector: 'Language selector',
    accessibility_theme_toggle: 'Toggle theme',
    accessibility_play_button: 'Play',
    accessibility_pause_button: 'Pause',
    accessibility_volume_control: 'Volume control',
    accessibility_email_us: 'Email us',
    accessibility_join_discord: 'Join our Discord',
    accessibility_follow_tiktok: 'Follow us on TikTok',
    accessibility_follow_twitter: 'Follow us on Twitter',
    accessibility_join_telegram: 'Join our Telegram',
    
    // Admin Login
    admin_login_title: 'LunaStream Admin',
    admin_login_subtitle: 'Access the analytics dashboard',
    admin_login_username_label: 'Username',
    admin_login_username_placeholder: 'Enter username',
    admin_login_password_label: 'Password',
    admin_login_password_placeholder: 'Enter password',
    admin_login_signing_in: 'Signing in...',
    admin_login_sign_in: 'Sign In',
    admin_login_secure_access: 'Secure Access',
    admin_login_security_notice: 'This admin panel provides access to real-time analytics and user data. Please ensure you have proper authorization.',
    admin_login_invalid_credentials: 'Invalid username or password',
    admin_login_network_error: 'Network error. Please try again.',
    
    // Admin Panel
    admin_panel_dashboard_title: 'Admin Dashboard',
    admin_panel_live_data: 'Live Data',
    admin_panel_refresh: 'Refresh',
    admin_panel_logout: 'Logout',
    admin_panel_analytics_title: 'Real-Time Analytics Dashboard',
    admin_panel_analytics_subtitle: 'Live streaming analytics and comprehensive user insights',
    admin_panel_last_updated: 'Last updated',
    admin_panel_auto_refresh: 'Auto-refresh every 15s',
    admin_panel_tab_overview: 'Overview',
    admin_panel_tab_content: 'Content',
    admin_panel_tab_users: 'Users',
    admin_panel_total_views: 'Total Views',
    admin_panel_live_viewers: 'Live Viewers',
    admin_panel_watch_time: 'Watch Time',
    admin_panel_completion_rate: 'Completion Rate',
    admin_panel_live_viewers_title: 'Live Viewers',
    admin_panel_no_one_watching: 'No one is currently watching',
    admin_panel_activity_trends: '7-Day Activity Trends',
    admin_panel_views: 'views',
    admin_panel_viewers: 'viewers',
    admin_panel_most_watched: 'Most Watched',
    admin_panel_longest_sessions: 'Longest Sessions',
    admin_panel_best_completion: 'Best Completion',
    admin_panel_most_rewatched: 'Most Rewatched',
    admin_panel_top_movies: 'Top Movies',
    admin_panel_no_movie_data: 'No movie data available',
    admin_panel_top_tv_shows: 'Top TV Shows',
    admin_panel_no_tv_data: 'No TV show data available',
    admin_panel_user_engagement: 'User Engagement',
    admin_panel_avg_sessions_user: 'Avg Sessions/User',
    admin_panel_avg_time_user: 'Avg Time/User',
    admin_panel_return_rate: 'Return Rate',
    admin_panel_device_distribution: 'Device Distribution',
    admin_panel_session_duration: 'Session Duration',
    admin_panel_browser_distribution: 'Browser Distribution',
    admin_panel_operating_system: 'Operating System',
    
    // 404 Page
    error_404_title: '404',
    error_404_message: 'Page Not Found',
    error_404_go_home: 'Go Home',
    movie_not_found: 'Movie not found',
    show_not_found: 'Show not found',
    
    // Donate Page
    donate_support_title: 'Support LunaStream',
    donate_support_subtitle: 'Help us keep LunaStream free and available for everyone. Your donations directly support our website to provide the best streaming experience.',
    donate_how_help_title: 'How Your Donations Help',
    donate_domain_costs: 'Domain Costs:',
    donate_domain_costs_desc: 'Domain renewal and alternative domains if possible.',
    donate_development: 'Development:',
    donate_development_desc: 'Hiring someone to help out. contact admin@lunastream.watch',
    donate_accessibility: 'Accessibility:',
    donate_accessibility_desc: 'Ensuring LunaStream remains free for users worldwide',
    donate_crypto_title: 'Cryptocurrency Donations',
    donate_crypto_desc: 'We accept donations in various cryptocurrencies. Click on any address to copy it to your clipboard.',
    donate_copy_address: 'Copy Address',
    donate_copied: 'Copied!',
    donate_thank_you_title: 'Thank You for Your Support! 💜',
    donate_thank_you_message: 'Every donation, no matter the size, makes a real difference in keeping LunaStream running and improving. We\'re grateful for your contribution to our community!',
    
    // Coming Soon Page
    coming_soon_loading: 'Loading...',
    coming_soon_no_content: 'No upcoming content found.',
    coming_soon_error: 'Failed to load upcoming titles.',
    coming_soon_prev: 'Prev',
    coming_soon_next: 'Next',
    
    // Version Page
    version_build_info: 'Real-time build and deployment information for LunaStream',
    
    // Footer
    footer_email_us: 'Email us',
    footer_join_discord: 'Join our Discord',
    footer_follow_tiktok: 'Follow us on TikTok',
    footer_follow_twitter: 'Follow us on Twitter',
    footer_join_telegram: 'Join our Telegram',
  },
  
  de: {
    result: "Ergebnis",
    results: "Ergebnisse",
    s: 's',
    tv_not_found: 'Serie nicht gefunden',

    // Navigation
    nav_home: 'Startseite',
    nav_search: 'Suchen',
    nav_discover: 'Entdecken',
    nav_vault: 'Archiv',
    nav_donate: 'Spenden',
    nav_language: 'Sprache',
    nav_theme: 'Design',
    nav_anime: 'Anime',
    
    // generic
    season: "Staffel",
    seasons: "Staffeln",
    episode: "Episode",
    episode_aired: 'Ausgestrahlt',
    episodes: 'Episoden',
    overview: 'Übersicht',
    minutes: 'Minuten',
    details: 'Details',
    cast: 'Besetzung',
    
    // New detail pages
    season_not_found: 'Staffel nicht gefunden',
    episode_not_found: 'Episode nicht gefunden',
    back_to_show: 'Zurück zur Serie',
    back_to_season: 'Zurück zur Staffel',
    show_episode_info: 'Episode-Info anzeigen',
    close_player: 'Player schließen',
    toggle_favorite: 'Favorit umschalten',
    select_season: 'Staffel auswählen',
    
    // Cast
    cast_overview: 'Besetzungsübersicht',
    status_loading_cast: 'Lade Besetzung...',
    status_no_cast_info: 'Keine Besetzungsinformationen verfügbar.',
    status_loading_episodes: 'Lade Episoden...',
    
    // Home page
    home_heading_title: 'Filme & Serien schauen',
    home_heading_subtitle: 'Entdecke und streame deine Lieblingsinhalte mit unserer schönen, benutzerfreundlichen Plattform',
    home_now_playing: 'Läuft jetzt',
    home_coming_soon: 'Demnächst',
    home_trending_loading: 'Lade beliebte Inhalte...',
    home_trending_fetch_error: 'Fehler beim Laden beliebter Inhalte:',
    
    // Search
    search_fail: 'Suche fehlgeschlagen',
    search_fail_error: 'Suchfehler:',
    search_results_for: 'Suchergebnisse für',
    search_no_results: 'Keine Ergebnisse gefunden',
    search_no_results_for: 'Keine Ergebnisse gefunden für',
    search_stay_safe_warning: 'Basierend auf deinem Suchbegriff könntest du verstörende Inhalte finden. Bitte bleib sicher.',
    search_stay_safe_continue: 'Trotzdem fortfahren',
    search_placeholder: 'Filme und Serien suchen...',
    search_loading: 'Suche...',
    
    // Content types
    content_movie_singular: 'Film',
    content_movie_plural: 'Filme',
    content_tv_singular: 'Serie',
    content_tv_plural: 'Serien',
    content_trending: 'Beliebt',
    content_genre_singular: 'Genre',
    content_genre_plural: 'Genres',
    content_no_image: 'Kein Bild',
    content_n_a: 'N/A',
    content_seasons: 'Staffeln:',
    content_episodes: 'Episoden:',
    content_tba: 'TBA',
    content_breakdown: 'Inhaltsaufschlüsselung',
    
    // Filtering and sorting
    filter_show_results: 'Zeige',
    filter_of: 'von',
    filter_result_singular: 'Ergebnis',
    filter_result_plural: 'Ergebnisse',
    filter_popularity: 'Beliebtheit',
    filter_relevance: 'Relevanz',
    filter_everything: 'Alles',
    filter_all: 'Alle',
    filter_descending_short: 'Abst',
    filter_ascending_short: 'Aufst',
    filter_rating: 'Bewertung',
    filter_release_date: 'Veröffentlichungsdatum',
    filter_newest: 'Neueste',
    filter_oldest: 'Älteste',
    filter_loading: 'Lade',
    filter_sort_label: 'Sortieren nach',
    
    // Navigation buttons
    nav_previous: 'Vorherige',
    nav_next: 'Nächste',
    nav_first_page: 'Erste Seite',
    nav_last_page: 'Letzte Seite',
    nav_page: 'Seite',
    nav_of: 'von',
    
    // Vault
    vault_tagline: 'Deine persönliche Sammlung von Filmen, Serien und Favoriten',
    vault_search_placeholder: 'Durchsuche dein Archiv',
    vault_watchlist: 'Watchlist',
    vault_favorites: 'Favoriten',
    vault_statistics: 'Statistiken',
    vault_my_content: 'Mein',
    vault_recently_watched: 'Kürzlich angesehen',
    vault_clear_all_watchlist: 'Alle löschen',
    vault_clear_all_favorites: 'Alle löschen',
    vault_browse_content: 'Inhalte durchsuchen',
    vault_favorite: 'Favorit',
    vault_statistics_title: 'Deine Archiv-Statistiken',
    vault_total: 'Gesamt',
    vault_watched: 'Angesehen',
    vault_content_breakdown: 'Inhaltsaufschlüsselung',
    vault_breakdown: ' Aufschlüsselung',
    vault_keep_building_title: 'Baue dein Archiv weiter auf!',
    vault_keep_building_subtitle: 'Entdecke neue Inhalte und erweitere deine persönliche Sammlung.',
    vault_browse_trending: 'Beliebte durchsuchen',
    vault_search_content: 'Inhalte suchen',
    vault_no_results_found: 'Keine Ergebnisse gefunden',
    vault_no_favorites_yet: 'Noch keine Favoriten',
    vault_no_favorites_match: 'Keine Favoriten entsprechen',
    vault_start_adding_favorites: 'Beginne damit, Filme und Serien zu deinen Favoriten hinzuzufügen, indem du auf das Herz-Symbol klickst.',
    vault_watchlist_empty: 'Watchlist ist leer',
    vault_no_watchlist_match: 'Keine Watchlist-Einträge entsprechen',
    vault_start_adding_watchlist: 'Beginne damit, Filme und Serien zu deiner Watchlist hinzuzufügen.',
    
    // Statistics
    movies: 'Filme',
    tvs: 'Serien',
    watched: 'Angesehen',
    favorite: 'Favorit',
    keep_building: 'Weiter aufbauen',
    keep_building_sub: 'Entdecke neue Inhalte und erweitere deine Sammlung.',
    search_content: 'Inhalte suchen',
    
    // Common actions
    action_play: 'Abspielen',
    action_watch: 'Schauen',
    action_watch_movie: 'Film schauen',
    action_add_to_watchlist: 'Zur Watchlist hinzufügen',
    action_remove_from_watchlist: 'Von Watchlist entfernen',
    action_add_to_favorites: 'Zu Favoriten hinzufügen',
    action_remove_from_favorites: 'Von Favoriten entfernen',
    action_clear: 'Löschen',
    action_delete: 'Löschen',
    action_edit: 'Bearbeiten',
    action_save: 'Speichern',
    action_cancel: 'Abbrechen',
    action_confirm: 'Bestätigen',
    action_continue: 'Fortfahren',
    action_copy: 'Kopieren',
    action_copied: 'Kopiert!',
    
    // Time and dates
    time_just_now: 'Gerade eben',
    time_minutes_ago: 'vor {count} Minuten',
    time_hours_ago: 'vor {count} Stunden',
    time_days_ago: 'vor {count} Tagen',
    time_weeks_ago: 'vor {count} Wochen',
    time_months_ago: 'vor {count} Monaten',
    time_years_ago: 'vor {count} Jahren',
    
    // Status messages
    status_loading: 'Lade...',
    status_loading_movie_details: 'Lade Filmdetails...',
    status_loading_show_details: 'Lade Seriendetails...',
    status_error: 'Fehler',
    status_success: 'Erfolg',
    status_no_data: 'Keine Daten verfügbar',
    status_empty: 'Leer',
    status_offline: 'Du bist offline',
    status_online: 'Du bist wieder online',
    status_no_upcoming_content: 'Keine kommenden Inhalte gefunden.',
    status_failed_to_load: 'Fehler beim Laden kommender Titel.',
    
    // Confirmation dialogs
    confirm_clear_watchlist: 'Bist du sicher, dass du deine gesamte Watchlist löschen möchtest?',
    confirm_clear_favorites: 'Bist du sicher, dass du alle Favoriten löschen möchtest?',
    confirm_delete_item: 'Bist du sicher, dass du dieses Element löschen möchtest?',
    
    // 404 Page
    error_404_title: '404',
    error_404_message: 'Seite nicht gefunden',
    error_404_go_home: 'Zur Startseite',
    movie_not_found: 'Film nicht gefunden',
    show_not_found: 'Serie nicht gefunden',
    
    // Donate Page
    donate_support_title: 'LunaStream unterstützen',
    donate_support_subtitle: 'Hilf uns dabei, LunaStream kostenlos und für alle verfügbar zu halten. Deine Spenden unterstützen direkt unsere Website.',
    donate_how_help_title: 'Wie deine Spenden helfen',
    donate_domain_costs: 'Domain-Kosten:',
    donate_domain_costs_desc: 'Domain-Erneuerung und alternative Domains falls möglich.',
    donate_development: 'Entwicklung:',
    donate_development_desc: 'Jemanden einstellen, der hilft. Kontakt: admin@lunastream.watch',
    donate_accessibility: 'Zugänglichkeit:',
    donate_accessibility_desc: 'Sicherstellen, dass LunaStream für Nutzer weltweit kostenlos bleibt',
    donate_crypto_title: 'Kryptowährungs-Spenden',
    donate_crypto_desc: 'Wir akzeptieren Spenden in verschiedenen Kryptowährungen. Klicke auf eine Adresse, um sie zu kopieren.',
    donate_copy_address: 'Adresse kopieren',
    donate_copied: 'Kopiert!',
    donate_thank_you_title: 'Danke für deine Unterstützung! 💜',
    donate_thank_you_message: 'Jede Spende, egal wie groß, macht einen echten Unterschied dabei, LunaStream am Laufen zu halten und zu verbessern.',
    
    // Coming Soon Page
    coming_soon_title: 'Demnächst',
    coming_soon_search_placeholder: 'Nach Titel oder Name suchen...',
    coming_soon_loading: 'Lade...',
    coming_soon_no_content: 'Keine kommenden Inhalte gefunden.',
    coming_soon_error: 'Fehler beim Laden kommender Titel.',
    coming_soon_prev: 'Zurück',
    coming_soon_next: 'Weiter',
    
    // Version Page
    version_build_info: 'Echtzeit-Build- und Deployment-Informationen für LunaStream',
    
    // Footer
    footer_email_us: 'Schreib uns',
    footer_join_discord: 'Tritt unserem Discord bei',
    footer_follow_tiktok: 'Folge uns auf TikTok',
    footer_follow_twitter: 'Folge uns auf Twitter',
    footer_join_telegram: 'Tritt unserem Telegram bei',
    
    // Admin
    admin_login_title: 'LunaStream Admin',
    admin_login_subtitle: 'Zugang zum Analytics-Dashboard',
    admin_login_username_label: 'Benutzername',
    admin_login_password_label: 'Passwort',
    admin_login_sign_in: 'Anmelden',
    admin_panel_dashboard_title: 'Admin Dashboard',
    admin_panel_refresh: 'Aktualisieren',
    admin_panel_logout: 'Abmelden',
    
    // Anime
    popular_tv_shows: 'Beliebte Anime',
    trending_tv_shows: 'Trending Anime',
    no_description: 'Keine Beschreibung verfügbar.',
    
    // Pagination
    pagination_label: 'Seitennavigation',
    loading: 'Lade',
    
    // Theme
    switch_to_light_mode: 'Zum hellen Modus wechseln',
    switch_to_dark_mode: 'Zum dunklen Modus wechseln',
    
    // Scroll
    scroll_to_top: 'Nach oben scrollen',
    
    // Boop
    boops: 'Boops',
    boop_the_frog: 'Den Frosch boopen',
    
    // Last updated
    last_updated_title: 'Seite zuletzt aktualisiert',
    last_updated_message: 'Diese Seite wurde zuletzt aktualisiert am:',
  },
  
  fr: {
    result: "résultat",
    results: "résultats",
    s: 's',
    tv_not_found: 'Série non trouvée',

    // Navigation
    nav_home: 'Accueil',
    nav_search: 'Rechercher',
    nav_discover: 'Découvrir',
    nav_vault: 'Coffre',
    nav_donate: 'Faire un don',
    nav_language: 'Langue',
    nav_theme: 'Thème',
    nav_anime: 'Anime',
    
    // generic
    season: "Saison",
    seasons: "Saisons",
    episode: "Épisode",
    episode_aired: 'Diffusé',
    episodes: 'Épisodes',
    overview: 'Aperçu',
    minutes: 'minutes',
    details: 'Détails',
    cast: 'Distribution',
    
    // New detail pages
    season_not_found: 'Saison non trouvée',
    episode_not_found: 'Épisode non trouvé',
    back_to_show: 'Retour à la série',
    back_to_season: 'Retour à la saison',
    show_episode_info: 'Afficher les infos de l\'épisode',
    close_player: 'Fermer le lecteur',
    toggle_favorite: 'Basculer favori',
    select_season: 'Sélectionner la saison',
    
    // Cast
    cast_overview: 'Aperçu de la distribution',
    status_loading_cast: 'Chargement de la distribution...',
    status_no_cast_info: 'Aucune information de distribution disponible.',
    status_loading_episodes: 'Chargement des épisodes...',
    
    // Home page
    home_heading_title: 'Regarder films & séries',
    home_heading_subtitle: 'Découvrez et diffusez votre contenu préféré avec notre plateforme belle et facile à utiliser',
    home_now_playing: 'En cours',
    home_coming_soon: 'Bientôt disponible',
    home_trending_loading: 'Chargement du contenu tendance...',
    home_trending_fetch_error: 'Échec du chargement du contenu tendance:',
    
    // Search
    search_fail: 'Échec de la recherche',
    search_fail_error: 'Erreur de recherche:',
    search_results_for: 'Résultats de recherche pour',
    search_no_results: 'Aucun résultat trouvé',
    search_no_results_for: 'Aucun résultat trouvé pour',
    search_stay_safe_warning: 'Basé sur votre terme de recherche, vous pourriez trouver du contenu dérangeant. Restez en sécurité.',
    search_stay_safe_continue: 'Continuer quand même',
    search_placeholder: 'Rechercher films et séries...',
    search_loading: 'Recherche...',
    
    // Content types
    content_movie_singular: 'Film',
    content_movie_plural: 'Films',
    content_tv_singular: 'Série',
    content_tv_plural: 'Séries',
    content_trending: 'Tendance',
    content_genre_singular: 'Genre',
    content_genre_plural: 'Genres',
    content_no_image: 'Pas d\'image',
    content_n_a: 'N/A',
    content_seasons: 'Saisons:',
    content_episodes: 'Épisodes:',
    content_tba: 'À déterminer',
    content_breakdown: 'Répartition du contenu',
    
    // Filtering and sorting
    filter_show_results: 'Affichage',
    filter_of: 'de',
    filter_result_singular: 'résultat',
    filter_result_plural: 'résultats',
    filter_popularity: 'Popularité',
    filter_relevance: 'Pertinence',
    filter_everything: 'Tout',
    filter_all: 'Tous',
    filter_descending_short: 'Desc',
    filter_ascending_short: 'Asc',
    filter_rating: 'Note',
    filter_release_date: 'Date de sortie',
    filter_newest: 'Plus récent',
    filter_oldest: 'Plus ancien',
    filter_loading: 'Chargement',
    filter_sort_label: 'Trier par',
    
    // Navigation buttons
    nav_previous: 'Précédent',
    nav_next: 'Suivant',
    nav_first_page: 'Première page',
    nav_last_page: 'Dernière page',
    nav_page: 'Page',
    nav_of: 'de',
    
    // Vault
    vault_tagline: 'Votre collection personnelle de films, séries et favoris',
    vault_search_placeholder: 'Rechercher dans votre coffre',
    vault_watchlist: 'Liste de lecture',
    vault_favorites: 'Favoris',
    vault_statistics: 'Statistiques',
    vault_my_content: 'Mon',
    vault_recently_watched: 'Récemment regardé',
    vault_clear_all_watchlist: 'Tout effacer',
    vault_clear_all_favorites: 'Tout effacer',
    vault_browse_content: 'Parcourir le contenu',
    vault_favorite: 'Favori',
    vault_statistics_title: 'Vos statistiques de coffre',
    vault_total: 'Total',
    vault_watched: 'Regardé',
    vault_content_breakdown: 'Répartition du contenu',
    vault_breakdown: ' Répartition',
    vault_keep_building_title: 'Continuez à construire votre coffre!',
    vault_keep_building_subtitle: 'Découvrez de nouveaux contenus et continuez à développer votre collection personnelle.',
    vault_browse_trending: 'Parcourir les tendances',
    vault_search_content: 'Rechercher du contenu',
    vault_no_results_found: 'Aucun résultat trouvé',
    vault_no_favorites_yet: 'Pas encore de favoris',
    vault_no_favorites_match: 'Aucun favori ne correspond',
    vault_start_adding_favorites: 'Commencez à ajouter des films et séries à vos favoris en cliquant sur l\'icône cœur.',
    vault_watchlist_empty: 'Liste de lecture vide',
    vault_no_watchlist_match: 'Aucun élément de la liste ne correspond',
    vault_start_adding_watchlist: 'Commencez à ajouter des films et séries à votre liste de lecture.',
    
    // Statistics
    movies: 'Films',
    tvs: 'Séries',
    watched: 'Regardé',
    favorite: 'Favori',
    keep_building: 'Continuer à construire',
    keep_building_sub: 'Découvrez de nouveaux contenus et développez votre collection.',
    search_content: 'Rechercher du contenu',
    
    // Common actions
    action_play: 'Lire',
    action_watch: 'Regarder',
    action_watch_movie: 'Regarder le film',
    action_add_to_watchlist: 'Ajouter à la liste',
    action_remove_from_watchlist: 'Retirer de la liste',
    action_add_to_favorites: 'Ajouter aux favoris',
    action_remove_from_favorites: 'Retirer des favoris',
    action_clear: 'Effacer',
    action_delete: 'Supprimer',
    action_edit: 'Modifier',
    action_save: 'Sauvegarder',
    action_cancel: 'Annuler',
    action_confirm: 'Confirmer',
    action_continue: 'Continuer',
    action_copy: 'Copier',
    action_copied: 'Copié!',
    
    // Time and dates
    time_just_now: 'À l\'instant',
    time_minutes_ago: 'il y a {count} minutes',
    time_hours_ago: 'il y a {count} heures',
    time_days_ago: 'il y a {count} jours',
    time_weeks_ago: 'il y a {count} semaines',
    time_months_ago: 'il y a {count} mois',
    time_years_ago: 'il y a {count} ans',
    
    // Status messages
    status_loading: 'Chargement...',
    status_loading_movie_details: 'Chargement des détails du film...',
    status_loading_show_details: 'Chargement des détails de la série...',
    status_error: 'Erreur',
    status_success: 'Succès',
    status_no_data: 'Aucune donnée disponible',
    status_empty: 'Vide',
    status_offline: 'Vous êtes hors ligne',
    status_online: 'Vous êtes de retour en ligne',
    status_no_upcoming_content: 'Aucun contenu à venir trouvé.',
    status_failed_to_load: 'Échec du chargement des titres à venir.',
    
    // Confirmation dialogs
    confirm_clear_watchlist: 'Êtes-vous sûr de vouloir effacer toute votre liste de lecture?',
    confirm_clear_favorites: 'Êtes-vous sûr de vouloir effacer tous vos favoris?',
    confirm_delete_item: 'Êtes-vous sûr de vouloir supprimer cet élément?',
    
    // 404 Page
    error_404_title: '404',
    error_404_message: 'Page non trouvée',
    error_404_go_home: 'Retour à l\'accueil',
    movie_not_found: 'Film non trouvé',
    show_not_found: 'Série non trouvée',
    
    // Donate Page
    donate_support_title: 'Soutenir LunaStream',
    donate_support_subtitle: 'Aidez-nous à garder LunaStream gratuit et disponible pour tous. Vos dons soutiennent directement notre site web.',
    donate_how_help_title: 'Comment vos dons aident',
    donate_domain_costs: 'Coûts de domaine:',
    donate_domain_costs_desc: 'Renouvellement de domaine et domaines alternatifs si possible.',
    donate_development: 'Développement:',
    donate_development_desc: 'Embaucher quelqu\'un pour aider. Contact: admin@lunastream.watch',
    donate_accessibility: 'Accessibilité:',
    donate_accessibility_desc: 'S\'assurer que LunaStream reste gratuit pour les utilisateurs du monde entier',
    donate_crypto_title: 'Dons en cryptomonnaie',
    donate_crypto_desc: 'Nous acceptons les dons dans diverses cryptomonnaies. Cliquez sur une adresse pour la copier.',
    donate_copy_address: 'Copier l\'adresse',
    donate_copied: 'Copié!',
    donate_thank_you_title: 'Merci pour votre soutien! 💜',
    donate_thank_you_message: 'Chaque don, quelle que soit sa taille, fait une vraie différence pour maintenir LunaStream en fonctionnement.',
    
    // Coming Soon Page
    coming_soon_title: 'Bientôt disponible',
    coming_soon_search_placeholder: 'Rechercher par titre ou nom...',
    coming_soon_loading: 'Chargement...',
    coming_soon_no_content: 'Aucun contenu à venir trouvé.',
    coming_soon_error: 'Échec du chargement des titres à venir.',
    coming_soon_prev: 'Précédent',
    coming_soon_next: 'Suivant',
    
    // Version Page
    version_build_info: 'Informations de build et déploiement en temps réel pour LunaStream',
    
    // Footer
    footer_email_us: 'Nous écrire',
    footer_join_discord: 'Rejoindre notre Discord',
    footer_follow_tiktok: 'Nous suivre sur TikTok',
    footer_follow_twitter: 'Nous suivre sur Twitter',
    footer_join_telegram: 'Rejoindre notre Telegram',
    
    // Admin
    admin_login_title: 'LunaStream Admin',
    admin_login_subtitle: 'Accès au tableau de bord analytique',
    admin_login_username_label: 'Nom d\'utilisateur',
    admin_login_password_label: 'Mot de passe',
    admin_login_sign_in: 'Se connecter',
    admin_panel_dashboard_title: 'Tableau de bord Admin',
    admin_panel_refresh: 'Actualiser',
    admin_panel_logout: 'Se déconnecter',
    
    // Anime
    popular_tv_shows: 'Anime populaires',
    trending_tv_shows: 'Anime tendance',
    no_description: 'Aucune description disponible.',
    
    // Pagination
    pagination_label: 'Navigation des pages',
    loading: 'Chargement',
    
    // Theme
    switch_to_light_mode: 'Passer au mode clair',
    switch_to_dark_mode: 'Passer au mode sombre',
    
    // Scroll
    scroll_to_top: 'Remonter en haut',
    
    // Boop
    boops: 'Boops',
    boop_the_frog: 'Booper la grenouille',
    
    // Last updated
    last_updated_title: 'Page mise à jour pour la dernière fois',
    last_updated_message: 'Cette page a été mise à jour pour la dernière fois le:',
  },
  
  it: {
    result: "risultato",
    results: "risultati",
    s: 's',
    tv_not_found: 'Serie non trovata',

    // Navigation
    nav_home: 'Home',
    nav_search: 'Cerca',
    nav_discover: 'Scopri',
    nav_vault: 'Archivio',
    nav_donate: 'Dona',
    nav_language: 'Lingua',
    nav_theme: 'Tema',
    nav_anime: 'Anime',
    
    // generic
    season: "Stagione",
    seasons: "Stagioni",
    episode: "Episodio",
    episode_aired: 'Andato in onda',
    episodes: 'Episodi',
    overview: 'Panoramica',
    minutes: 'minuti',
    details: 'Dettagli',
    cast: 'Cast',
    
    // New detail pages
    season_not_found: 'Stagione non trovata',
    episode_not_found: 'Episodio non trovato',
    back_to_show: 'Torna alla serie',
    back_to_season: 'Torna alla stagione',
    show_episode_info: 'Mostra info episodio',
    close_player: 'Chiudi player',
    toggle_favorite: 'Cambia preferito',
    select_season: 'Seleziona stagione',
    
    // Cast
    cast_overview: 'Panoramica del cast',
    status_loading_cast: 'Caricamento cast...',
    status_no_cast_info: 'Nessuna informazione sul cast disponibile.',
    status_loading_episodes: 'Caricamento episodi...',
    
    // Home page
    home_heading_title: 'Guarda film e serie TV',
    home_heading_subtitle: 'Scopri e guarda i tuoi contenuti preferiti con la nostra piattaforma bella e facile da usare',
    home_now_playing: 'Ora in riproduzione',
    home_coming_soon: 'Prossimamente',
    home_trending_loading: 'Caricamento contenuti di tendenza...',
    home_trending_fetch_error: 'Errore nel caricamento dei contenuti di tendenza:',
    
    // Search
    search_fail: 'Ricerca fallita',
    search_fail_error: 'Errore di ricerca:',
    search_results_for: 'Risultati di ricerca per',
    search_no_results: 'Nessun risultato trovato',
    search_no_results_for: 'Nessun risultato trovato per',
    search_stay_safe_warning: 'Basandosi sul tuo termine di ricerca, potresti trovare contenuti disturbanti. Rimani al sicuro.',
    search_stay_safe_continue: 'Continua comunque',
    search_placeholder: 'Cerca film e serie TV...',
    search_loading: 'Ricerca...',
    
    // Content types
    content_movie_singular: 'Film',
    content_movie_plural: 'Film',
    content_tv_singular: 'Serie TV',
    content_tv_plural: 'Serie TV',
    content_trending: 'Di tendenza',
    content_genre_singular: 'Genere',
    content_genre_plural: 'Generi',
    content_no_image: 'Nessuna immagine',
    content_n_a: 'N/D',
    content_seasons: 'Stagioni:',
    content_episodes: 'Episodi:',
    content_tba: 'Da annunciare',
    content_breakdown: 'Suddivisione contenuti',
    
    // Filtering and sorting
    filter_show_results: 'Mostrando',
    filter_of: 'di',
    filter_result_singular: 'risultato',
    filter_result_plural: 'risultati',
    filter_popularity: 'Popolarità',
    filter_relevance: 'Rilevanza',
    filter_everything: 'Tutto',
    filter_all: 'Tutti',
    filter_descending_short: 'Disc',
    filter_ascending_short: 'Asc',
    filter_rating: 'Valutazione',
    filter_release_date: 'Data di uscita',
    filter_newest: 'Più recente',
    filter_oldest: 'Più vecchio',
    filter_loading: 'Caricamento',
    filter_sort_label: 'Ordina per',
    
    // Navigation buttons
    nav_previous: 'Precedente',
    nav_next: 'Successivo',
    nav_first_page: 'Prima pagina',
    nav_last_page: 'Ultima pagina',
    nav_page: 'Pagina',
    nav_of: 'di',
    
    // Vault
    vault_tagline: 'La tua collezione personale di film, serie e preferiti',
    vault_search_placeholder: 'Cerca nel tuo archivio',
    vault_watchlist: 'Lista da guardare',
    vault_favorites: 'Preferiti',
    vault_statistics: 'Statistiche',
    vault_my_content: 'Il mio',
    vault_recently_watched: 'Visti di recente',
    vault_clear_all_watchlist: 'Cancella tutto',
    vault_clear_all_favorites: 'Cancella tutto',
    vault_browse_content: 'Sfoglia contenuti',
    vault_favorite: 'Preferito',
    vault_statistics_title: 'Le tue statistiche dell\'archivio',
    vault_total: 'Totale',
    vault_watched: 'Visto',
    vault_content_breakdown: 'Suddivisione contenuti',
    vault_breakdown: ' Suddivisione',
    vault_keep_building_title: 'Continua a costruire il tuo archivio!',
    vault_keep_building_subtitle: 'Scopri nuovi contenuti e continua a far crescere la tua collezione personale.',
    vault_browse_trending: 'Sfoglia tendenze',
    vault_search_content: 'Cerca contenuti',
    vault_no_results_found: 'Nessun risultato trovato',
    vault_no_favorites_yet: 'Nessun preferito ancora',
    vault_no_favorites_match: 'Nessun preferito corrisponde',
    vault_start_adding_favorites: 'Inizia ad aggiungere film e serie ai tuoi preferiti cliccando sull\'icona del cuore.',
    vault_watchlist_empty: 'Lista da guardare vuota',
    vault_no_watchlist_match: 'Nessun elemento della lista corrisponde',
    vault_start_adding_watchlist: 'Inizia ad aggiungere film e serie alla tua lista da guardare.',
    
    // Statistics
    movies: 'Film',
    tvs: 'Serie TV',
    watched: 'Visto',
    favorite: 'Preferito',
    keep_building: 'Continua a costruire',
    keep_building_sub: 'Scopri nuovi contenuti e fai crescere la tua collezione.',
    search_content: 'Cerca contenuti',
    
    // Common actions
    action_play: 'Riproduci',
    action_watch: 'Guarda',
    action_watch_movie: 'Guarda film',
    action_add_to_watchlist: 'Aggiungi alla lista',
    action_remove_from_watchlist: 'Rimuovi dalla lista',
    action_add_to_favorites: 'Aggiungi ai preferiti',
    action_remove_from_favorites: 'Rimuovi dai preferiti',
    action_clear: 'Cancella',
    action_delete: 'Elimina',
    action_edit: 'Modifica',
    action_save: 'Salva',
    action_cancel: 'Annulla',
    action_confirm: 'Conferma',
    action_continue: 'Continua',
    action_copy: 'Copia',
    action_copied: 'Copiato!',
    
    // Time and dates
    time_just_now: 'Proprio ora',
    time_minutes_ago: '{count} minuti fa',
    time_hours_ago: '{count} ore fa',
    time_days_ago: '{count} giorni fa',
    time_weeks_ago: '{count} settimane fa',
    time_months_ago: '{count} mesi fa',
    time_years_ago: '{count} anni fa',
    
    // Status messages
    status_loading: 'Caricamento...',
    status_loading_movie_details: 'Caricamento dettagli film...',
    status_loading_show_details: 'Caricamento dettagli serie...',
    status_error: 'Errore',
    status_success: 'Successo',
    status_no_data: 'Nessun dato disponibile',
    status_empty: 'Vuoto',
    status_offline: 'Sei offline',
    status_online: 'Sei di nuovo online',
    status_no_upcoming_content: 'Nessun contenuto in arrivo trovato.',
    status_failed_to_load: 'Errore nel caricamento dei titoli in arrivo.',
    
    // Confirmation dialogs
    confirm_clear_watchlist: 'Sei sicuro di voler cancellare tutta la tua lista da guardare?',
    confirm_clear_favorites: 'Sei sicuro di voler cancellare tutti i tuoi preferiti?',
    confirm_delete_item: 'Sei sicuro di voler eliminare questo elemento?',
    
    // 404 Page
    error_404_title: '404',
    error_404_message: 'Pagina non trovata',
    error_404_go_home: 'Vai alla home',
    movie_not_found: 'Film non trovato',
    show_not_found: 'Serie non trovata',
    
    // Donate Page
    donate_support_title: 'Supporta LunaStream',
    donate_support_subtitle: 'Aiutaci a mantenere LunaStream gratuito e disponibile per tutti. Le tue donazioni supportano direttamente il nostro sito web.',
    donate_how_help_title: 'Come le tue donazioni aiutano',
    donate_domain_costs: 'Costi del dominio:',
    donate_domain_costs_desc: 'Rinnovo del dominio e domini alternativi se possibile.',
    donate_development: 'Sviluppo:',
    donate_development_desc: 'Assumere qualcuno per aiutare. Contatto: admin@lunastream.watch',
    donate_accessibility: 'Accessibilità:',
    donate_accessibility_desc: 'Assicurarsi che LunaStream rimanga gratuito per gli utenti di tutto il mondo',
    donate_crypto_title: 'Donazioni in criptovaluta',
    donate_crypto_desc: 'Accettiamo donazioni in varie criptovalute. Clicca su un indirizzo per copiarlo.',
    donate_copy_address: 'Copia indirizzo',
    donate_copied: 'Copiato!',
    donate_thank_you_title: 'Grazie per il tuo supporto! 💜',
    donate_thank_you_message: 'Ogni donazione, indipendentemente dalle dimensioni, fa una vera differenza nel mantenere LunaStream in funzione.',
    
    // Coming Soon Page
    coming_soon_title: 'Prossimamente',
    coming_soon_search_placeholder: 'Cerca per titolo o nome...',
    coming_soon_loading: 'Caricamento...',
    coming_soon_no_content: 'Nessun contenuto in arrivo trovato.',
    coming_soon_error: 'Errore nel caricamento dei titoli in arrivo.',
    coming_soon_prev: 'Precedente',
    coming_soon_next: 'Successivo',
    
    // Version Page
    version_build_info: 'Informazioni di build e deployment in tempo reale per LunaStream',
    
    // Footer
    footer_email_us: 'Scrivici',
    footer_join_discord: 'Unisciti al nostro Discord',
    footer_follow_tiktok: 'Seguici su TikTok',
    footer_follow_twitter: 'Seguici su Twitter',
    footer_join_telegram: 'Unisciti al nostro Telegram',
    
    // Admin
    admin_login_title: 'LunaStream Admin',
    admin_login_subtitle: 'Accesso al dashboard analitico',
    admin_login_username_label: 'Nome utente',
    admin_login_password_label: 'Password',
    admin_login_sign_in: 'Accedi',
    admin_panel_dashboard_title: 'Dashboard Admin',
    admin_panel_refresh: 'Aggiorna',
    admin_panel_logout: 'Esci',
    
    // Anime
    popular_tv_shows: 'Anime popolari',
    trending_tv_shows: 'Anime di tendenza',
    no_description: 'Nessuna descrizione disponibile.',
    
    // Pagination
    pagination_label: 'Navigazione pagine',
    loading: 'Caricamento',
    
    // Theme
    switch_to_light_mode: 'Passa alla modalità chiara',
    switch_to_dark_mode: 'Passa alla modalità scura',
    
    // Scroll
    scroll_to_top: 'Scorri in alto',
    
    // Boop
    boops: 'Boop',
    boop_the_frog: 'Fai boop alla rana',
    
    // Last updated
    last_updated_title: 'Pagina aggiornata l\'ultima volta',
    last_updated_message: 'Questa pagina è stata aggiornata l\'ultima volta il:',
  },
  
  ru: {
    result: "результат",
    results: "результаты",
    s: 'ы',
    tv_not_found: 'Сериал не найден',

    // Navigation
    nav_home: 'Главная',
    nav_search: 'Поиск',
    nav_discover: 'Обзор',
    nav_vault: 'Архив',
    nav_donate: 'Пожертвовать',
    nav_language: 'Язык',
    nav_theme: 'Тема',
    nav_anime: 'Аниме',
    
    // generic
    season: "Сезон",
    seasons: "Сезоны",
    episode: "Эпизод",
    episode_aired: 'Вышел в эфир',
    episodes: 'Эпизоды',
    overview: 'Обзор',
    minutes: 'минут',
    details: 'Подробности',
    cast: 'Актёры',
    
    // New detail pages
    season_not_found: 'Сезон не найден',
    episode_not_found: 'Эпизод не найден',
    back_to_show: 'Назад к сериалу',
    back_to_season: 'Назад к сезону',
    show_episode_info: 'Показать информацию об эпизоде',
    close_player: 'Закрыть плеер',
    toggle_favorite: 'Переключить избранное',
    select_season: 'Выбрать сезон',
    
    // Cast
    cast_overview: 'Обзор актёрского состава',
    status_loading_cast: 'Загрузка актёрского состава...',
    status_no_cast_info: 'Информация об актёрском составе недоступна.',
    status_loading_episodes: 'Загрузка эпизодов...',
    
    // Home page
    home_heading_title: 'Смотреть фильмы и сериалы',
    home_heading_subtitle: 'Открывайте и смотрите ваш любимый контент с нашей красивой и простой в использовании платформой',
    home_now_playing: 'Сейчас показывают',
    home_coming_soon: 'Скоро',
    home_trending_loading: 'Загрузка популярного контента...',
    home_trending_fetch_error: 'Ошибка загрузки популярного контента:',
    
    // Search
    search_fail: 'Поиск не удался',
    search_fail_error: 'Ошибка поиска:',
    search_results_for: 'Результаты поиска для',
    search_no_results: 'Результаты не найдены',
    search_no_results_for: 'Результаты не найдены для',
    search_stay_safe_warning: 'Основываясь на вашем поисковом запросе, вы можете найти тревожный контент. Пожалуйста, будьте осторожны.',
    search_stay_safe_continue: 'Всё равно продолжить',
    search_placeholder: 'Искать фильмы и сериалы...',
    search_loading: 'Поиск...',
    
    // Content types
    content_movie_singular: 'Фильм',
    content_movie_plural: 'Фильмы',
    content_tv_singular: 'Сериал',
    content_tv_plural: 'Сериалы',
    content_trending: 'Популярное',
    content_genre_singular: 'Жанр',
    content_genre_plural: 'Жанры',
    content_no_image: 'Нет изображения',
    content_n_a: 'Н/Д',
    content_seasons: 'Сезоны:',
    content_episodes: 'Эпизоды:',
    content_tba: 'Будет объявлено',
    content_breakdown: 'Разбивка контента',
    
    // Filtering and sorting
    filter_show_results: 'Показано',
    filter_of: 'из',
    filter_result_singular: 'результат',
    filter_result_plural: 'результаты',
    filter_popularity: 'Популярность',
    filter_relevance: 'Релевантность',
    filter_everything: 'Всё',
    filter_all: 'Все',
    filter_descending_short: 'Убыв',
    filter_ascending_short: 'Возр',
    filter_rating: 'Рейтинг',
    filter_release_date: 'Дата выхода',
    filter_newest: 'Новейшие',
    filter_oldest: 'Старейшие',
    filter_loading: 'Загрузка',
    filter_sort_label: 'Сортировать по',
    
    // Navigation buttons
    nav_previous: 'Предыдущая',
    nav_next: 'Следующая',
    nav_first_page: 'Первая страница',
    nav_last_page: 'Последняя страница',
    nav_page: 'Страница',
    nav_of: 'из',
    
    // Vault
    vault_tagline: 'Ваша личная коллекция фильмов, сериалов и избранного',
    vault_search_placeholder: 'Поиск в вашем архиве',
    vault_watchlist: 'Список просмотра',
    vault_favorites: 'Избранное',
    vault_statistics: 'Статистика',
    vault_my_content: 'Мой',
    vault_recently_watched: 'Недавно просмотренные',
    vault_clear_all_watchlist: 'Очистить всё',
    vault_clear_all_favorites: 'Очистить всё',
    vault_browse_content: 'Просмотреть контент',
    vault_favorite: 'Избранное',
    vault_statistics_title: 'Статистика вашего архива',
    vault_total: 'Всего',
    vault_watched: 'Просмотрено',
    vault_content_breakdown: 'Разбивка контента',
    vault_breakdown: ' Разбивка',
    vault_keep_building_title: 'Продолжайте строить свой архив!',
    vault_keep_building_subtitle: 'Открывайте новый контент и продолжайте расширять свою личную коллекцию.',
    vault_browse_trending: 'Просмотреть популярное',
    vault_search_content: 'Искать контент',
    vault_no_results_found: 'Результаты не найдены',
    vault_no_favorites_yet: 'Пока нет избранного',
    vault_no_favorites_match: 'Нет соответствующего избранного',
    vault_start_adding_favorites: 'Начните добавлять фильмы и сериалы в избранное, нажав на значок сердца.',
    vault_watchlist_empty: 'Список просмотра пуст',
    vault_no_watchlist_match: 'Нет соответствующих элементов списка',
    vault_start_adding_watchlist: 'Начните добавлять фильмы и сериалы в ваш список просмотра.',
    
    // Statistics
    movies: 'Фильмы',
    tvs: 'Сериалы',
    watched: 'Просмотрено',
    favorite: 'Избранное',
    keep_building: 'Продолжить строительство',
    keep_building_sub: 'Открывайте новый контент и расширяйте свою коллекцию.',
    search_content: 'Искать контент',
    
    // Common actions
    action_play: 'Воспроизвести',
    action_watch: 'Смотреть',
    action_watch_movie: 'Смотреть фильм',
    action_add_to_watchlist: 'Добавить в список',
    action_remove_from_watchlist: 'Удалить из списка',
    action_add_to_favorites: 'Добавить в избранное',
    action_remove_from_favorites: 'Удалить из избранного',
    action_clear: 'Очистить',
    action_delete: 'Удалить',
    action_edit: 'Редактировать',
    action_save: 'Сохранить',
    action_cancel: 'Отменить',
    action_confirm: 'Подтвердить',
    action_continue: 'Продолжить',
    action_copy: 'Копировать',
    action_copied: 'Скопировано!',
    
    // Time and dates
    time_just_now: 'Только что',
    time_minutes_ago: '{count} минут назад',
    time_hours_ago: '{count} часов назад',
    time_days_ago: '{count} дней назад',
    time_weeks_ago: '{count} недель назад',
    time_months_ago: '{count} месяцев назад',
    time_years_ago: '{count} лет назад',
    
    // Status messages
    status_loading: 'Загрузка...',
    status_loading_movie_details: 'Загрузка деталей фильма...',
    status_loading_show_details: 'Загрузка деталей сериала...',
    status_error: 'Ошибка',
    status_success: 'Успех',
    status_no_data: 'Нет доступных данных',
    status_empty: 'Пусто',
    status_offline: 'Вы не в сети',
    status_online: 'Вы снова в сети',
    status_no_upcoming_content: 'Предстоящий контент не найден.',
    status_failed_to_load: 'Не удалось загрузить предстоящие названия.',
    
    // Confirmation dialogs
    confirm_clear_watchlist: 'Вы уверены, что хотите очистить весь ваш список просмотра?',
    confirm_clear_favorites: 'Вы уверены, что хотите очистить всё ваше избранное?',
    confirm_delete_item: 'Вы уверены, что хотите удалить этот элемент?',
    
    // 404 Page
    error_404_title: '404',
    error_404_message: 'Страница не найдена',
    error_404_go_home: 'На главную',
    movie_not_found: 'Фильм не найден',
    show_not_found: 'Сериал не найден',
    
    // Donate Page
    donate_support_title: 'Поддержать LunaStream',
    donate_support_subtitle: 'Помогите нам сохранить LunaStream бесплатным и доступным для всех. Ваши пожертвования напрямую поддерживают наш веб-сайт.',
    donate_how_help_title: 'Как ваши пожертвования помогают',
    donate_domain_costs: 'Расходы на домен:',
    donate_domain_costs_desc: 'Продление домена и альтернативные домены, если возможно.',
    donate_development: 'Разработка:',
    donate_development_desc: 'Нанять кого-то для помощи. Контакт: admin@lunastream.watch',
    donate_accessibility: 'Доступность:',
    donate_accessibility_desc: 'Обеспечение того, чтобы LunaStream оставался бесплатным для пользователей по всему миру',
    donate_crypto_title: 'Пожертвования в криптовалюте',
    donate_crypto_desc: 'Мы принимаем пожертвования в различных криптовалютах. Нажмите на адрес, чтобы скопировать его.',
    donate_copy_address: 'Копировать адрес',
    donate_copied: 'Скопировано!',
    donate_thank_you_title: 'Спасибо за вашу поддержку! 💜',
    donate_thank_you_message: 'Каждое пожертвование, независимо от размера, имеет реальное значение для поддержания работы LunaStream.',
    
    // Coming Soon Page
    coming_soon_title: 'Скоро',
    coming_soon_search_placeholder: 'Поиск по названию или имени...',
    coming_soon_loading: 'Загрузка...',
    coming_soon_no_content: 'Предстоящий контент не найден.',
    coming_soon_error: 'Не удалось загрузить предстоящие названия.',
    coming_soon_prev: 'Назад',
    coming_soon_next: 'Далее',
    
    // Version Page
    version_build_info: 'Информация о сборке и развертывании в реальном времени для LunaStream',
    
    // Footer
    footer_email_us: 'Напишите нам',
    footer_join_discord: 'Присоединяйтесь к нашему Discord',
    footer_follow_tiktok: 'Подписывайтесь на нас в TikTok',
    footer_follow_twitter: 'Подписывайтесь на нас в Twitter',
    footer_join_telegram: 'Присоединяйтесь к нашему Telegram',
    
    // Admin
    admin_login_title: 'LunaStream Админ',
    admin_login_subtitle: 'Доступ к панели аналитики',
    admin_login_username_label: 'Имя пользователя',
    admin_login_password_label: 'Пароль',
    admin_login_sign_in: 'Войти',
    admin_panel_dashboard_title: 'Админ панель',
    admin_panel_refresh: 'Обновить',
    admin_panel_logout: 'Выйти',
    
    // Anime
    popular_tv_shows: 'Популярные аниме',
    trending_tv_shows: 'Трендовые аниме',
    no_description: 'Описание недоступно.',
    
    // Pagination
    pagination_label: 'Навигация по страницам',
    loading: 'Загрузка',
    
    // Theme
    switch_to_light_mode: 'Переключиться на светлый режим',
    switch_to_dark_mode: 'Переключиться на тёмный режим',
    
    // Scroll
    scroll_to_top: 'Прокрутить наверх',
    
    // Boop
    boops: 'Буп',
    boop_the_frog: 'Бупнуть лягушку',
    
    // Last updated
    last_updated_title: 'Страница последний раз обновлена',
    last_updated_message: 'Эта страница была последний раз обновлена:',
  },
  
  ja: {
    result: "結果",
    results: "結果",
    s: 's',
    tv_not_found: 'ショーが見つかりません',

    // Navigation
    nav_home: 'ホーム',
    nav_search: '検索',
    nav_discover: '発見',
    nav_vault: 'アーカイブ',
    nav_donate: '寄付',
    nav_language: '言語',
    nav_theme: 'テーマ',
    nav_anime: 'アニメ',
    
    // generic
    season: "シーズン",
    seasons: "シーズン",
    episode: "エピソード",
    episode_aired: '放送済み',
    episodes: 'エピソード',
    overview: '概要',
    minutes: '分',
    details: '詳細',
    cast: 'キャスト',
    
    // New detail pages
    season_not_found: 'シーズンが見つかりません',
    episode_not_found: 'エピソードが見つかりません',
    back_to_show: 'ショーに戻る',
    back_to_season: 'シーズンに戻る',
    show_episode_info: 'エピソード情報を表示',
    close_player: 'プレーヤーを閉じる',
    toggle_favorite: 'お気に入りを切り替え',
    select_season: 'シーズンを選択',
    
    // Cast
    cast_overview: 'キャスト概要',
    status_loading_cast: 'キャストを読み込み中...',
    status_no_cast_info: 'キャスト情報がありません。',
    status_loading_episodes: 'エピソードを読み込み中...',
    
    // Home page
    home_heading_title: '映画・TV番組を視聴',
    home_heading_subtitle: '美しく使いやすいプラットフォームでお気に入りのコンテンツを発見・ストリーミング',
    home_now_playing: '現在放送中',
    home_coming_soon: '近日公開',
    home_trending_loading: 'トレンドコンテンツを読み込み中...',
    home_trending_fetch_error: 'トレンドコンテンツの取得に失敗:',
    
    // Search
    search_fail: '検索に失敗しました',
    search_fail_error: '検索エラー:',
    search_results_for: '検索結果',
    search_no_results: '結果が見つかりません',
    search_no_results_for: '結果が見つかりません',
    search_stay_safe_warning: '検索用語に基づいて、不快なコンテンツが見つかる可能性があります。安全にお過ごしください。',
    search_stay_safe_continue: 'とにかく続行',
    search_placeholder: '映画・TV番組を検索...',
    search_loading: '検索中...',
    
    // Content types
    content_movie_singular: '映画',
    content_movie_plural: '映画',
    content_tv_singular: 'TV番組',
    content_tv_plural: 'TV番組',
    content_trending: 'トレンド',
    content_genre_singular: 'ジャンル',
    content_genre_plural: 'ジャンル',
    content_no_image: '画像なし',
    content_n_a: 'N/A',
    content_seasons: 'シーズン:',
    content_episodes: 'エピソード:',
    content_tba: '未定',
    content_breakdown: 'コンテンツ内訳',
    
    // Filtering and sorting
    filter_show_results: '表示中',
    filter_of: 'の',
    filter_result_singular: '結果',
    filter_result_plural: '結果',
    filter_popularity: '人気度',
    filter_relevance: '関連性',
    filter_everything: 'すべて',
    filter_all: 'すべて',
    filter_descending_short: '降順',
    filter_ascending_short: '昇順',
    filter_rating: '評価',
    filter_release_date: 'リリース日',
    filter_newest: '最新',
    filter_oldest: '最古',
    filter_loading: '読み込み中',
    filter_sort_label: '並び替え',
    
    // Navigation buttons
    nav_previous: '前へ',
    nav_next: '次へ',
    nav_first_page: '最初のページ',
    nav_last_page: '最後のページ',
    nav_page: 'ページ',
    nav_of: 'の',
    
    // Vault
    vault_tagline: '映画、番組、お気に入りの個人コレクション',
    vault_search_placeholder: 'アーカイブを検索',
    vault_watchlist: 'ウォッチリスト',
    vault_favorites: 'お気に入り',
    vault_statistics: '統計',
    vault_my_content: 'マイ',
    vault_recently_watched: '最近視聴した',
    vault_clear_all_watchlist: 'すべてクリア',
    vault_clear_all_favorites: 'すべてクリア',
    vault_browse_content: 'コンテンツを閲覧',
    vault_favorite: 'お気に入り',
    vault_statistics_title: 'あなたのアーカイブ統計',
    vault_total: '合計',
    vault_watched: '視聴済み',
    vault_content_breakdown: 'コンテンツ内訳',
    vault_breakdown: ' 内訳',
    vault_keep_building_title: 'アーカイブを構築し続けましょう！',
    vault_keep_building_subtitle: '新しいコンテンツを発見し、個人コレクションを成長させ続けましょう。',
    vault_browse_trending: 'トレンドを閲覧',
    vault_search_content: 'コンテンツを検索',
    vault_no_results_found: '結果が見つかりません',
    vault_no_favorites_yet: 'まだお気に入りがありません',
    vault_no_favorites_match: '一致するお気に入りがありません',
    vault_start_adding_favorites: 'ハートアイコンをクリックして映画や番組をお気に入りに追加し始めましょう。',
    vault_watchlist_empty: 'ウォッチリストが空です',
    vault_no_watchlist_match: '一致するリスト項目がありません',
    vault_start_adding_watchlist: '映画や番組をウォッチリストに追加し始めましょう。',
    
    // Statistics
    movies: '映画',
    tvs: 'TV番組',
    watched: '視聴済み',
    favorite: 'お気に入り',
    keep_building: '構築を続ける',
    keep_building_sub: '新しいコンテンツを発見し、コレクションを成長させましょう。',
    search_content: 'コンテンツを検索',
    
    // Common actions
    action_play: '再生',
    action_watch: '視聴',
    action_watch_movie: '映画を視聴',
    action_add_to_watchlist: 'リストに追加',
    action_remove_from_watchlist: 'リストから削除',
    action_add_to_favorites: 'お気に入りに追加',
    action_remove_from_favorites: 'お気に入りから削除',
    action_clear: 'クリア',
    action_delete: '削除',
    action_edit: '編集',
    action_save: '保存',
    action_cancel: 'キャンセル',
    action_confirm: '確認',
    action_continue: '続行',
    action_copy: 'コピー',
    action_copied: 'コピーしました！',
    
    // Time and dates
    time_just_now: 'たった今',
    time_minutes_ago: '{count}分前',
    time_hours_ago: '{count}時間前',
    time_days_ago: '{count}日前',
    time_weeks_ago: '{count}週間前',
    time_months_ago: '{count}ヶ月前',
    time_years_ago: '{count}年前',
    
    // Status messages
    status_loading: '読み込み中...',
    status_loading_movie_details: '映画の詳細を読み込み中...',
    status_loading_show_details: '番組の詳細を読み込み中...',
    status_error: 'エラー',
    status_success: '成功',
    status_no_data: '利用可能なデータがありません',
    status_empty: '空',
    status_offline: 'オフラインです',
    status_online: 'オンラインに戻りました',
    status_no_upcoming_content: '今後のコンテンツが見つかりません。',
    status_failed_to_load: '今後のタイトルの読み込みに失敗しました。',
    
    // Confirmation dialogs
    confirm_clear_watchlist: 'ウォッチリスト全体をクリアしてもよろしいですか？',
    confirm_clear_favorites: 'すべてのお気に入りをクリアしてもよろしいですか？',
    confirm_delete_item: 'この項目を削除してもよろしいですか？',
    
    // 404 Page
    error_404_title: '404',
    error_404_message: 'ページが見つかりません',
    error_404_go_home: 'ホームに戻る',
    movie_not_found: '映画が見つかりません',
    show_not_found: '番組が見つかりません',
    
    // Donate Page
    donate_support_title: 'LunaStreamをサポート',
    donate_support_subtitle: 'LunaStreamを無料で誰でも利用できるよう維持するのを手伝ってください。あなたの寄付は直接私たちのウェブサイトをサポートします。',
    donate_how_help_title: 'あなたの寄付がどのように役立つか',
    donate_domain_costs: 'ドメイン費用:',
    donate_domain_costs_desc: 'ドメインの更新と可能であれば代替ドメイン。',
    donate_development: '開発:',
    donate_development_desc: '手伝ってくれる人を雇う。連絡先: admin@lunastream.watch',
    donate_accessibility: 'アクセシビリティ:',
    donate_accessibility_desc: 'LunaStreamが世界中のユーザーにとって無料であり続けることを確保',
    donate_crypto_title: '暗号通貨での寄付',
    donate_crypto_desc: '様々な暗号通貨での寄付を受け付けています。アドレスをクリックしてコピーしてください。',
    donate_copy_address: 'アドレスをコピー',
    donate_copied: 'コピーしました！',
    donate_thank_you_title: 'サポートありがとうございます！ 💜',
    donate_thank_you_message: 'どんなサイズの寄付でも、LunaStreamの運営と改善に本当の違いをもたらします。',
    
    // Coming Soon Page
    coming_soon_title: '近日公開',
    coming_soon_search_placeholder: 'タイトルまたは名前で検索...',
    coming_soon_loading: '読み込み中...',
    coming_soon_no_content: '今後のコンテンツが見つかりません。',
    coming_soon_error: '今後のタイトルの読み込みに失敗しました。',
    coming_soon_prev: '前へ',
    coming_soon_next: '次へ',
    
    // Version Page
    version_build_info: 'LunaStreamのリアルタイムビルドとデプロイメント情報',
    
    // Footer
    footer_email_us: 'メールを送る',
    footer_join_discord: 'Discordに参加',
    footer_follow_tiktok: 'TikTokでフォロー',
    footer_follow_twitter: 'Twitterでフォロー',
    footer_join_telegram: 'Telegramに参加',
    
    // Admin
    admin_login_title: 'LunaStream 管理者',
    admin_login_subtitle: 'アナリティクスダッシュボードへのアクセス',
    admin_login_username_label: 'ユーザー名',
    admin_login_password_label: 'パスワード',
    admin_login_sign_in: 'サインイン',
    admin_panel_dashboard_title: '管理者ダッシュボード',
    admin_panel_refresh: '更新',
    admin_panel_logout: 'ログアウト',
    
    // Anime
    popular_tv_shows: '人気のアニメ',
    trending_tv_shows: 'トレンドアニメ',
    no_description: '説明がありません。',
    
    // Pagination
    pagination_label: 'ページナビゲーション',
    loading: '読み込み中',
    
    // Theme
    switch_to_light_mode: 'ライトモードに切り替え',
    switch_to_dark_mode: 'ダークモードに切り替え',
    
    // Scroll
    scroll_to_top: 'トップにスクロール',
    
    // Boop
    boops: 'ブープ',
    boop_the_frog: 'カエルをブープ',
    
    // Last updated
    last_updated_title: 'ページが最後に更新されました',
    last_updated_message: 'このページが最後に更新されたのは:',
  },
  
  dk: {
    result: 'resultat',
    results: 'resultater',
    s: 'er',
    tv_not_found: 'TV-serie ikke fundet',

    // Navigation
    nav_home: 'Hjem',
    nav_search: 'Søg',
    nav_discover: 'Udforsk',
    nav_vault: 'Arkiv',
    nav_donate: 'Doner',
    nav_language: 'Sprog',
    nav_theme: 'Tema',
    
    // generic
    season: 'Sæson',
    seasons: 'Sæsoner',
    episode: 'Episode',
    episode_aired: 'Sendt',
    episodes: 'Episoder',
    overview: 'Oversigt',
    minutes: 'minutter',
    
    // New detail pages
    season_not_found: 'Sæson ikke fundet',
    episode_not_found: 'Episode ikke fundet',
    back_to_show: 'Tilbage til serie',
    back_to_season: 'Tilbage til sæson',
    show_episode_info: 'Vis episode-info',
    close_player: 'Luk afspiller',
    toggle_favorite: 'Skift favorit',
    
    // Cast
    cast_overview: 'Rollebesætning',
    status_loading_cast: 'Indlæser rollebesætning...',
    status_no_cast_info: 'Ingen rollebesætning tilgængelig.',
    status_loading_episodes: 'Indlæser episoder...',

    // Home page
    home_heading_title: 'Se film og TV-serier',
    home_heading_subtitle: 'Udforsk og stream dit yndlingsindhold med vores smukke og brugervenlige platform',
    home_now_playing: 'Vises nu',
    home_coming_soon: 'Kommer snart',
    home_trending_loading: 'Indlæser populært indhold...',
    home_trending_fetch_error: 'Hentning af populært indhold mislykkedes:',
    
    // Search
    search_fail_error: 'Søgefejl:',
    search_results_for: 'Søgeresultater for',
    search_no_results: 'Ingen resultater fundet',
    search_no_results_for: 'Ingen resultater fundet for',
    search_stay_safe_warning: 'Baseret på din søgning kan du støde på foruroligende indhold. Pas venligst på dig selv.',
    search_stay_safe_continue: 'Fortsæt alligevel',
    search_placeholder: 'Søg efter film og TV-serier...',
    
    // Content types
    content_movie_singular: 'Film',
    content_movie_plural: 'Film',
    content_tv_singular: 'TV-serie',
    content_tv_plural: 'TV-serier',
    content_trending: 'Populære',
    content_genre_singular: 'Genre',
    content_genre_plural: 'Genrer',
    content_no_image: 'Intet billede',
    content_n_a: '–',
    content_seasons: 'Sæsoner:',
    content_episodes: 'Episoder:',
    content_tba: 'TBA',
    content_breakdown: 'Indholdsoversigt',
    
    // Filtering and sorting
    filter_show_results: 'Viser',
    filter_of: 'af',
    filter_result_singular: 'resultat',
    filter_result_plural: 'resultater',
    filter_popularity: 'Popularitet',
    filter_relevance: 'Relevans',
    filter_everything: 'Alt',
    filter_all: 'Alle',
    filter_descending_short: 'Fald',
    filter_ascending_short: 'Stig',
    filter_rating: 'Bedømmelse',
    filter_release_date: 'Udgivelsesdato',
    filter_newest: 'Nyeste',
    filter_oldest: 'Ældste',
    filter_loading: 'Indlæser',
    
    // Navigation buttons
    nav_previous: 'Forrige',
    nav_next: 'Næste',
    nav_first_page: 'Første side',
    nav_last_page: 'Sidste side',
    nav_page: 'Side',
    nav_of: 'af',
    
    // Vault
    vault_tagline: 'Din personlige samling af film, serier og favoritter',
    vault_search_placeholder: 'Søg i dit arkiv...',
    vault_watchlist: 'Watchlist',
    vault_favorites: 'Favoritter',
    vault_statistics: 'Statistik',
    vault_my_content: 'Min',
    vault_my_tv: 'Min',
    vault_my_playlist: 'Mine',
    vault_recently_watched: 'For nylig set',
    vault_clear_all_watchlist: 'Ryd alt',
    vault_clear_all_favorites: 'Ryd alle',
    vault_browse_content: 'Gennemse indhold',
    vault_favorite: 'Favorit',
    vault_statistics_title: 'Dine arkiv-statistikker',
    vault_total: 'Total',
    vault_watched: 'Set',
    vault_content_breakdown: 'Indholdsoversigt',
    vault_breakdown: ' oversigt',
    vault_keep_building_title: 'Fortsæt med at opbygge dit arkiv!',
    vault_keep_building_subtitle: 'Udforsk nyt indhold og fortsæt med at udvide din personlige samling.',
    vault_browse_trending: 'Udforsk det populære',
    vault_search_content: 'Søg indhold',
    vault_search_your_vault: 'Søg dit arkiv',
    vault_no_results_found: 'Ingen resultater fundet',
    vault_no_favorites_yet: 'Ingen favoritter endnu',
    vault_no_favorites_match: 'Ingen favoritter matcher',
    vault_start_adding_favorites: 'Begynd at tilføje film og serier til dine favoritter ved at klikke på hjerteikonet.',
    
    // Statistics
    movies: 'Film',
    tvs: 'TV-serier',
    watched: 'Set',
    
    // Common actions
    action_play: 'Afspil',
    action_watch: 'Se',
    action_add_to_watchlist: 'Tilføj til watchlist',
    action_remove_from_watchlist: 'Fjern fra watchlist',
    action_add_to_favorites: 'Tilføj til favoritter',
    action_remove_from_favorites: 'Fjern fra favoritter',
    action_clear: 'Ryd',
    action_delete: 'Slet',
    action_edit: 'Rediger',
    action_save: 'Gem',
    action_cancel: 'Annuller',
    action_confirm: 'Bekræft',
    action_continue: 'Fortsæt',
    action_copy: 'Kopier',
    action_copied: 'Kopieret!',
    
    // Time and dates
    time_just_now: 'Lige nu',
    time_minutes_ago: 'for {count} minutter',
    time_hours_ago: 'for {count} timer',
    time_days_ago: 'for {count} dage',
    time_weeks_ago: 'for {count} uger',
    time_months_ago: 'for {count} måneder',
    time_years_ago: 'for {count} år',
    
    // Status messages
    status_loading: 'Indlæser...',
    status_loading_movie_details: 'Indlæser filmdetaljer...',
    status_loading_show_details: 'Indlæser seriedetaljer...',
    status_error: 'Fejl',
    status_success: 'Succes',
    status_no_data: 'Ingen data tilgængelig',
    status_empty: 'Tom',
    status_offline: 'Du er offline',
    status_online: 'Du er tilbage online',
    status_no_upcoming_content: 'Ingen kommende indhold fundet.',
    status_failed_to_load: 'Hentning af kommende titler mislykkedes.',
    
    // Confirmation dialogs
    confirm_clear_watchlist: 'Er du sikker på, at du vil rydde hele din watchlist?',
    confirm_clear_favorites: 'Er du sikker på, at du vil rydde alle favoritter?',
    confirm_delete_item: 'Er du sikker på, at du vil slette dette element?',
    
    // Accessibility
    accessibility_menu_button: 'Menu',
    accessibility_close_button: 'Luk',
    accessibility_search_button: 'Søg',
    accessibility_language_selector: 'Sprogvælger',
    accessibility_theme_toggle: 'Skift tema',
    accessibility_play_button: 'Afspil',
    accessibility_pause_button: 'Pause',
    accessibility_volume_control: 'Lydstyrke',
    accessibility_email_us: 'Skriv til os',
    accessibility_join_discord: 'Tilslut dig vores Discord',
    accessibility_follow_tiktok: 'Følg os på TikTok',
    accessibility_follow_twitter: 'Følg os på Twitter',
    accessibility_join_telegram: 'Tilslut dig vores Telegram',
    
    // Admin Login
    admin_login_title: 'LunaStream Admin',
    admin_login_subtitle: 'Få adgang til analyse-dashboardet',
    admin_login_username_label: 'Brugernavn',
    admin_login_username_placeholder: 'Indtast brugernavn',
    admin_login_password_label: 'Adgangskode',
    admin_login_password_placeholder: 'Indtast adgangskode',
    admin_login_signing_in: 'Logger ind...',
    admin_login_sign_in: 'Log ind',
    admin_login_secure_access: 'Sikker adgang',
    admin_login_security_notice: 'Dette adminpanel giver adgang til realtidsanalyse og brugerdata. Sørg for, at du har den rette tilladelse.',
    admin_login_invalid_credentials: 'Ugyldigt brugernavn eller adgangskode',
    admin_login_network_error: 'Netværksfejl. Prøv igen.',
    
    // Admin Panel
    admin_panel_dashboard_title: 'Admin Dashboard',
    admin_panel_live_data: 'Live-data',
    admin_panel_refresh: 'Opdater',
    admin_panel_logout: 'Log ud',
    admin_panel_analytics_title: 'Realtidsanalyse-dashboard',
    admin_panel_analytics_subtitle: 'Live streaming-analyse og brugeroverblik',
    admin_panel_last_updated: 'Sidst opdateret',
    admin_panel_auto_refresh: 'Auto-opdatering hvert 15. sekund',
    admin_panel_tab_overview: 'Overblik',
    admin_panel_tab_content: 'Indhold',
    admin_panel_tab_users: 'Brugere',
    admin_panel_total_views: 'Samlede visninger',
    admin_panel_live_viewers: 'Live-seere',
    admin_panel_watch_time: 'Seertid',
    admin_panel_completion_rate: 'Gennemførselsrate',
    admin_panel_live_viewers_title: 'Live-seere',
    admin_panel_no_one_watching: 'Ingen ser med lige nu',
    admin_panel_activity_trends: '7-dages aktivitetstendenser',
    admin_panel_views: 'visninger',
    admin_panel_viewers: 'seere',
    admin_panel_most_watched: 'Mest sete',
    admin_panel_longest_sessions: 'Længste sessioner',
    admin_panel_best_completion: 'Bedste gennemførelse',
    admin_panel_most_rewatched: 'Mest genset',
    admin_panel_top_movies: 'Topfilm',
    admin_panel_no_movie_data: 'Ingen filmdata tilgængelig',
    admin_panel_top_tv_shows: 'Top TV-serier',
    admin_panel_no_tv_data: 'Ingen TV-seriedata tilgængelig',
    admin_panel_user_engagement: 'Brugerengagement',
    admin_panel_avg_sessions_user: 'Gns. sessioner/bruger',
    admin_panel_avg_time_user: 'Gns. tid/bruger',
    admin_panel_return_rate: 'Tilbagevendingsrate',
    admin_panel_device_distribution: 'Enhedsfordeling',
    admin_panel_session_duration: 'Sessionsvarighed',
    admin_panel_browser_distribution: 'Browserfordeling',
    admin_panel_operating_system: 'Styresystem',
    
    // 404 Page
    error_404_title: '404',
    error_404_message: 'Side ikke fundet',
    error_404_go_home: 'Gå hjem',
    movie_not_found: 'Film ikke fundet',
    show_not_found: 'Serie ikke fundet',
    
    // Donate Page
    donate_support_title: 'Støt LunaStream',
    donate_support_subtitle: 'Hjælp os med at holde LunaStream gratis og tilgængelig for alle. Dine donationer støtter direkte vores hjemmeside til at levere den bedste streamingoplevelse.',
    donate_how_help_title: 'Hvordan dine donationer hjælper',
    donate_domain_costs: 'Domæneomkostninger:',
    donate_domain_costs_desc: 'Domænefornyelse og alternative domæner hvis muligt.',
    donate_development: 'Udvikling:',
    donate_development_desc: 'Ansættelse af nogen til at hjælpe. kontakt admin@lunastream.watch',
    donate_accessibility: 'Tilgængelighed:',
    donate_accessibility_desc: 'Sikrer at LunaStream forbliver gratis for brugere verden over',
    donate_crypto_title: 'Kryptovaluta-donationer',
    donate_crypto_desc: 'Vi accepterer donationer i forskellige kryptovalutaer. Klik på enhver adresse for at kopiere den til dit udklipsholder.',
    donate_copy_address: 'Kopier adresse',
    donate_copied: 'Kopieret!',
    donate_thank_you_title: 'Tak for din støtte! 💜',
    donate_thank_you_message: 'Hver donation, uanset størrelse, gør en reel forskel i at holde LunaStream kørende og forbedre. Vi er taknemmelige for dit bidrag til vores fællesskab!',
    
    // Coming Soon Page
    coming_soon_loading: 'Indlæser...',
    coming_soon_no_content: 'Ingen kommende indhold fundet.',
    coming_soon_error: 'Hentning af kommende titler mislykkedes.',
    coming_soon_prev: 'Forrige',
    coming_soon_next: 'Næste',
    
    // Version Page
    version_build_info: 'Realtids build- og deployment-information for LunaStream',
    
    // Footer
    footer_email_us: 'Skriv til os',
    footer_join_discord: 'Tilslut dig vores Discord',
    footer_follow_tiktok: 'Følg os på TikTok',
    footer_follow_twitter: 'Følg os på Twitter',
    footer_join_telegram: 'Tilslut dig vores Telegram',
  },
};

// Helper function for interpolation (futureproof for different word orders)
export const interpolate = (template: string, values: Record<string, string | number>): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
};

// Helper function to get pluralized text
export const getPluralized = (
  translations: Record<string, string>,
  key: string,
  count: number,
  language: string
): string => {
  const singularKey = `${key}_singular`;
  const pluralKey = `${key}_plural`;
  
  if (language === 'dk') {
    // Danish pluralization rules
    if (count === 1) {
      return translations[singularKey] || translations[key] || key;
    } else {
      return translations[pluralKey] || translations[key] || key;
    }
  } else {
    // English pluralization rules
    if (count === 1) {
      return translations[singularKey] || translations[key] || key;
    } else {
      return translations[pluralKey] || translations[key] || key;
    }
  }
};

// Helper function to get time-ago text with proper interpolation
export const getTimeAgo = (
  translations: Record<string, string>,
  minutes: number,
  language: string
): string => {
  if (minutes < 1) {
    return translations.time_just_now;
  } else if (minutes < 60) {
    return interpolate(translations.time_minutes_ago, { count: minutes });
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    return interpolate(translations.time_hours_ago, { count: hours });
  } else if (minutes < 10080) {
    const days = Math.floor(minutes / 1440);
    return interpolate(translations.time_days_ago, { count: days });
  } else if (minutes < 43200) {
    const weeks = Math.floor(minutes / 10080);
    return interpolate(translations.time_weeks_ago, { count: weeks });
  } else if (minutes < 525600) {
    const months = Math.floor(minutes / 43200);
    return interpolate(translations.time_months_ago, { count: months });
  } else {
    const years = Math.floor(minutes / 525600);
    return interpolate(translations.time_years_ago, { count: years });
  }
};