// Tracking service for Google Simulation analytics

export interface TrackingEvent {
  eventType: 'click' | 'search' | 'page_view' | 'tab_change' | 'pagination';
  elementType: string; // 'result_card' | 'image' | 'pagination' | 'tab' | 'search' | etc.
  elementId?: string;
  elementText?: string;
  url?: string;
  platform?: string;
  persona: string; // 'greg' | 'meredith' | 'tremayne' | 'tanisha'
  timestamp: Date;
  sessionId?: string;
  page?: number;
  tab?: string;
  searchQuery?: string;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('google_sim_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('google_sim_session_id', sessionId);
  }
  return sessionId;
};

// Track an event
export const trackEvent = async (event: Omit<TrackingEvent, 'timestamp' | 'sessionId'>): Promise<void> => {
  const trackingEvent: TrackingEvent = {
    ...event,
    timestamp: new Date(),
    sessionId: getSessionId(),
  };

  try {
    // Send to API endpoint
    const response = await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingEvent),
    });

    if (!response.ok) {
      console.error('Failed to track event:', response.statusText);
    }
  } catch (error) {
    // Silently fail - don't interrupt user experience
    console.error('Tracking error:', error);
  }
};

// Helper functions for common tracking scenarios
export const trackResultClick = (resultId: string, platform: string, title: string, persona: string) => {
  trackEvent({
    eventType: 'click',
    elementType: 'result_card',
    elementId: resultId,
    elementText: title,
    platform,
    persona,
  });
};

export const trackImageClick = (imageId: string, imageTitle: string, persona: string) => {
  trackEvent({
    eventType: 'click',
    elementType: 'image',
    elementId: imageId,
    elementText: imageTitle,
    persona,
  });
};

export const trackTabChange = (tab: string, persona: string) => {
  trackEvent({
    eventType: 'tab_change',
    elementType: 'tab',
    elementText: tab,
    persona,
    tab,
  });
};

export const trackPagination = (page: number, persona: string) => {
  trackEvent({
    eventType: 'pagination',
    elementType: 'pagination',
    persona,
    page,
  });
};

export const trackSearch = (query: string, persona: string) => {
  trackEvent({
    eventType: 'search',
    elementType: 'search',
    searchQuery: query,
    persona,
  });
};

export const trackPageView = (persona: string, page?: number, tab?: string) => {
  trackEvent({
    eventType: 'page_view',
    elementType: 'page',
    persona,
    page,
    tab,
  });
};
