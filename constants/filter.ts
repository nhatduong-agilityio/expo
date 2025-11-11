export const CONTENT_TABS = {
  NEWS: {
    ID: 'news',
    LABEL: 'News',
  },
  TOPICS: {
    ID: 'topics',
    LABEL: 'Topics',
  },
  AUTHOR: {
    ID: 'author',
    LABEL: 'Author',
  },
} as const;

export const FILTER_CONTENT_TABS = [
  { id: CONTENT_TABS.NEWS.ID, label: CONTENT_TABS.NEWS.LABEL },
  { id: CONTENT_TABS.TOPICS.ID, label: CONTENT_TABS.TOPICS.LABEL },
  { id: CONTENT_TABS.AUTHOR.ID, label: CONTENT_TABS.AUTHOR.LABEL },
];

export const PROFILE_TABS = {
  NEWS: {
    ID: 'news',
    LABEL: 'News',
  },
  RECENT: {
    ID: 'recent',
    LABEL: 'Recent',
  },
} as const;

export const FILTER_PROFILE_TABS = [
  { id: PROFILE_TABS.NEWS.ID, label: PROFILE_TABS.NEWS.LABEL },
  { id: PROFILE_TABS.RECENT.ID, label: PROFILE_TABS.RECENT.LABEL },
];

// Category tabs for filtering news by category
export const CATEGORY_TABS = {
  ALL: {
    ID: 'all',
    LABEL: 'All',
  },
  HEALTH: {
    ID: 'health',
    LABEL: 'Health',
  },
  TECHNOLOGY: {
    ID: 'technology',
    LABEL: 'Technology',
  },
  SPORT: {
    ID: 'sport',
    LABEL: 'Sport',
  },
  POLITICS: {
    ID: 'politics',
    LABEL: 'Politics',
  },
  BUSINESS: {
    ID: 'business',
    LABEL: 'Business',
  },
  TRAVEL: {
    ID: 'travel',
    LABEL: 'Travel',
  },
  EUROPE: {
    ID: 'europe',
    LABEL: 'Europe',
  },
} as const;

export const FILTER_CATEGORY_TABS = [
  { id: CATEGORY_TABS.ALL.ID, label: CATEGORY_TABS.ALL.LABEL },
  { id: CATEGORY_TABS.HEALTH.ID, label: CATEGORY_TABS.HEALTH.LABEL },
  { id: CATEGORY_TABS.TECHNOLOGY.ID, label: CATEGORY_TABS.TECHNOLOGY.LABEL },
  { id: CATEGORY_TABS.SPORT.ID, label: CATEGORY_TABS.SPORT.LABEL },
  { id: CATEGORY_TABS.POLITICS.ID, label: CATEGORY_TABS.POLITICS.LABEL },
  { id: CATEGORY_TABS.BUSINESS.ID, label: CATEGORY_TABS.BUSINESS.LABEL },
  { id: CATEGORY_TABS.TRAVEL.ID, label: CATEGORY_TABS.TRAVEL.LABEL },
  { id: CATEGORY_TABS.EUROPE.ID, label: CATEGORY_TABS.EUROPE.LABEL },
];
