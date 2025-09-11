import { environment } from "@/environment/environment";
import { getLocalStorage } from "@/services/storage";
import axios from "axios";
export const pathObj = {
  "/": "Home",
  "/puja": "Puja",
  "/chadhava": "Chadhava",
  "/about": "About Us",
  "/contact": "Contact Us",
};
export function createSessionManager(
  options: Partial<{
    minSessionDuration: number;
    inactivityTimeout: number;
    storageKey: string;
  }> = {}
) {
  // Configuration with defaults
  const config = {
    minSessionDuration: 5 * 60 * 1000, // 5 minutes minimum
    inactivityTimeout: 30 * 60 * 1000, // 30 minutes inactivity timeout
    storageKey: "app_session_metadata", // Changed to store all session data
    ...options,
  };

  // Session data structure
  type SessionData = {
    sessionId: string;
    startTime: number;
    lastActivityTime: number;
    deviceInfo: ReturnType<typeof getDeviceInfo>;
    browserInfo: ReturnType<typeof getBrowserInfo>;
    endTime?: number;
    endReason?: string;
  };

  // Retrieve or initialize session data
  const storedData = sessionStorage.getItem(config.storageKey);
  const isNewSession = !storedData;
  let sessionData: SessionData = storedData
    ? JSON.parse(storedData)
    : {
        sessionId:
          "session_" +
          Date.now() +
          "_" +
          Math.random().toString(36).substring(2, 11),
        startTime: Date.now(),
        lastActivityTime: Date.now(),
        deviceInfo: getDeviceInfo(),
        browserInfo: getBrowserInfo(),
      };

  // Store initial session data
  if (isNewSession) {
    sessionStorage.setItem(config.storageKey, JSON.stringify(sessionData));
  }

  let timeoutId: any = null;
  let minDurationTimeoutId: any = null;

  // Update session activity
  const updateActivity = () => {
    sessionData.lastActivityTime = Date.now();
    sessionStorage.setItem(config.storageKey, JSON.stringify(sessionData));
  };

  // Reset inactivity timer
  const resetTimer = () => {
    updateActivity();

    if (timeoutId) clearTimeout(timeoutId);

    const timeElapsed = Date.now() - sessionData.startTime;
    const remainingMinTime = Math.max(
      0,
      config.minSessionDuration - timeElapsed
    );

    timeoutId = setTimeout(
      () => endSession("inactivity"),
      remainingMinTime + config.inactivityTimeout
    );
  };

  // Handle session end
  const endSession = (reason = "inactivity") => {
    const timeElapsed = Date.now() - sessionData.startTime;

    if (timeElapsed < config.minSessionDuration) {
      const remainingTime = config.minSessionDuration - timeElapsed;
      minDurationTimeoutId = setTimeout(
        () => endSession(reason),
        remainingTime
      );
      return;
    }

    // Finalize session data
    sessionData.endTime = Date.now();
    sessionData.endReason = reason;
    logSessionEnd(sessionData);

    // Clean up
    cleanupSession();
  };

  const cleanupSession = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (minDurationTimeoutId) clearTimeout(minDurationTimeoutId);

    ["mousedown", "mousemove", "keypress", "scroll", "touchstart"].forEach(
      (event) => window.removeEventListener(event, resetTimer)
    );

    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("beforeunload", handleUnload);
    window.removeEventListener("pagehide", handleUnload);

    sessionStorage.removeItem(config.storageKey);
  };

  const handleVisibilityChange = () => {
    document.hidden ? endSession("tab_switch") : resetTimer();
  };

  const handleUnload = () => endSession("user_left");

  // Initialize event listeners
  ["mousedown", "mousemove", "keypress", "scroll", "touchstart"].forEach(
    (event) => window.addEventListener(event, resetTimer)
  );
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("beforeunload", handleUnload);
  window.addEventListener("pagehide", handleUnload);

  // Start the session
  resetTimer();

  return {
    getSessionId: () => sessionData.sessionId,
    getSessionStartTime: () => sessionData.startTime,
    getSessionStartDateTime: () => {
      const date = new Date(sessionData.startTime);
      return {
        timestamp: sessionData.startTime,
        localTime: date.toLocaleString(),
        sessionStart: isNewSession ? "Now" : "Already started"
      };
    },
    getSessionDuration: () => Date.now() - sessionData.startTime,
    getSessionData: () => ({ ...sessionData }),
    endSession,
  };
}
function logSessionEnd(data: any) {
  // Implement your analytics logging here
  console.log(
    `Session ended after ${(data.endTime! - data.startTime) / 1000} seconds`,
    data
  );
}
export const utm_obj = () => {
  return {
    utm_source: getLocalStorage("utm_source") ?? "organic",
    utm_medium: getLocalStorage("utm_medium") ?? "organic",
    utm_campaign: getLocalStorage("utm_campaign") ?? "organic",
    utm_content: getLocalStorage("utm_content") ?? "organic",
    utm_term: getLocalStorage("utm_term") ?? "organic",
  };
};
export const time_of_event = () => {
  const now = new Date();
  const timestamp = now.getTime();
  // Format local time string
  const formatTimeUnit = (unit: number) => unit.toString().padStart(2, "0");
  const day = formatTimeUnit(now.getDate());
  const month = formatTimeUnit(now.getMonth() + 1); // Months are 0-indexed
  const year = now.getFullYear();
  const hours = formatTimeUnit(now.getHours() % 12 || 12); // Convert to 12-hour format
  const minutes = formatTimeUnit(now.getMinutes());
  const seconds = formatTimeUnit(now.getSeconds());
  const ampm = now.getHours() >= 12 ? "pm" : "am";

  const localTime = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  return {
    timestamp,
    localTime,
    // isoString: now.toISOString(),
    // timezoneOffset: now.getTimezoneOffset(),
  };
};
export function getDeviceInfo() {
  const userAgent = navigator.userAgent;

  return {
    deviceType:
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      )
        ? "mobile"
        : "desktop",
    isTouchDevice: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    pixelRatio: window.devicePixelRatio || 1,
  };
}
export function getBrowserInfo() {
  const userAgent = navigator.userAgent;

  let browser = "unknown";
  let version = "unknown";

  if (userAgent.includes("Firefox")) {
    browser = "firefox";
    version = userAgent.match(/Firefox\/(\d+)/)?.[1] || version;
  } else if (userAgent.includes("Edg")) {
    browser = "edge";
    version = userAgent.match(/Edg\/(\d+)/)?.[1] || version;
  } else if (userAgent.includes("Chrome")) {
    browser = "chrome";
    version = userAgent.match(/Chrome\/(\d+)/)?.[1] || version;
  } else if (userAgent.includes("Safari")) {
    browser = "safari";
    version = userAgent.match(/Version\/(\d+)/)?.[1] || version;
  }

  return {
    browser,
    version,
    userAgent: navigator.userAgent,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
  };
}
export function getNetworkInfo() {
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  return {
    online: navigator.onLine,
    connectionType: connection?.type || "unknown",
    effectiveType: connection?.effectiveType || "unknown",
    downlink: connection?.downlink || "unknown",
    rtt: connection?.rtt || "unknown",
  };
}
export function getLocationInfo() {
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    geolocationSupported: "geolocation" in navigator,
    // Note: Actual geolocation requires user permission
    // getCurrentPosition: () => navigator.geolocation.getCurrentPosition(...)
  };
}
export const save_event = async (user_id, page_name, event_data) => {
  const session = createSessionManager({ inactivityTimeout: 15 * 60 * 1000 });
  const params = {
    sessionId: session.getSessionId(),
    userId: user_id ?? "N/A",
    sessionStartTime: session.getSessionStartDateTime(),
    pageType: page_name,
    device: getDeviceInfo(),
    browser: getBrowserInfo(),
    network: getNetworkInfo(),
    location: getLocationInfo(),
    events: event_data,
    utm: utm_obj(),
  };
  // const baseUrl = environment?.API_ENDPOINT;
  // try {
  //   await axios.post(`${baseUrl}events/eventsLogs`, params);
  // } catch (error) {
  //   console.error("Event upload error:", error);
  //   throw error;
  // }
};
export const button_event = (
  buttonName: string,
  action: string,
  pageTitle?: string,
  additionalData?: any
) => {
  // Get current date and time

  return {
    type: "buttonClick",
    createdAt: time_of_event(),
    details: {
      buttonName: buttonName,
      pageTitle: pageTitle || document.title, // Fallback to current page title
      action: action,
      ...(additionalData || {}), // Spread any additional data
    },
  };
};
export const pageview_event = (
  pageName: string,
  // pageTitle?: string,
  additionalData?: any
) => {
  return {
    type: "pageView",
    createdAt: time_of_event(),
    details: {
      pageName: pageName,
      // ...(pageTitle ? { pageTitle } : {}),
      ...(additionalData || {}),
    },
  };
};
