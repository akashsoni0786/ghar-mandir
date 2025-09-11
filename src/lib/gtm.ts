// Extend the global Window interface
declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
  }
}

// Push data to the GTM dataLayer only if sendPurchaseData is true
export const pushToDataLayer = (
  event: string,
  data: Record<string, any> = {}
): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...data,
  });
};
export const pushToDataLayerWithoutEvent = (
  data: Record<string, any> = {}
): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    ...data,
  });
};
