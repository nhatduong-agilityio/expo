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
