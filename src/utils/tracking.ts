// Tracking service for Google Simulation analytics

export interface TrackingEvent {
  eventType: 'click' | 'search' | 'page_view' | 'tab_change' | 'pagination';
  elementType: string; // 'result_card' | 'image' | 'pagination' | 'tab' | 'search' | etc.
  elementId?: string;
  elementText?: string;
  url?: string;
  platform?: string;
  persona: string; // 'greg' | 'meredith' | 'tremayne' | 'tanisha'
  timestamp: string | Date; // ISO string when sending, Date when receiving
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
  const trackingEvent = {
    ...event,
    timestamp: new Date().toISOString(), // Convert to ISO string for JSON serialization
    sessionId: getSessionId(),
  };

  try {
    // Determine API URL - use full URL in production, relative in development
    const apiUrl = import.meta.env.PROD 
      ? '/api/track' 
      : `${window.location.origin}/api/track`;
    
    // Send to API endpoint
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingEvent),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to track event:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        event: trackingEvent
      });
    } else {
      const result = await response.json();
      if (import.meta.env.DEV) {
        console.log('Event tracked successfully:', result);
      }
    }
  } catch (error: any) {
    // Log error but don't interrupt user experience
    console.error('Tracking error:', {
      error: error.message,
      stack: error.stack,
      event: trackingEvent,
      note: 'API endpoint only works when deployed to Vercel'
    });
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
