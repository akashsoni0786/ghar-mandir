import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
// import logo from "../assets/icons/name_logo.ico";
import Script from "next/script";
import { ToastProvider } from "@/components/Common/Toast/ToastProvider";
import { detectLanguage } from "@/utils/languageDetect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghar Mandir",
  description: "Aapki shraddha, Hamari Jimmedari",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = detectLanguage();
  return (
    <html lang={lang}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1,, maximum-scale=1, viewport-fit=cover"
        />

        {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
          <Script
            id="utm-referrer-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
    (function() {
      // Function to save UTM parameters to local storage with an expiry of 30 days
      function saveUTMParameters() {
          const urlParams = new URLSearchParams(window.location.search);
          const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'];
          utmParams.forEach(param => {
              const paramValue = urlParams.get(param);
              if (paramValue) {
                  const utmData = {
                      value: paramValue,
                      expiry: new Date().getTime() + 30 * 24 * 60 * 60 * 1000 // 30 days expiry
                  };
                  localStorage.setItem(param, JSON.stringify(utmData));
              }
          });
      }
      
      // Function to retrieve UTM parameters from local storage if they are not expired
      function getUTMParameter(param) {
          const paramData = localStorage.getItem(param);
          if (paramData) {
              try {
                  const parsedData = JSON.parse(paramData);
                  if (new Date().getTime() < parsedData.expiry) {
                      return parsedData.value;
                  } else {
                      localStorage.removeItem(param);
                  }
              } catch (e) {
                  return null;
              }
          }
          return null;
      }
      
      // Function to save the initial referrer URL in local storage with an expiry
      function saveInitialReferrer() {
          if (!localStorage.getItem('initial_referrer')) {
              const referrer = document.referrer || "direct";
              const referrerData = {
                  url: referrer,
                  expiry: new Date().getTime() + 30 * 24 * 60 * 60 * 1000 // 30 days expiry
              };
              localStorage.setItem('initial_referrer', JSON.stringify(referrerData));
          }
      }
      
      // Function to retrieve the saved referrer from local storage if not expired
      function getSavedReferrer() {
          const referrerData = localStorage.getItem('initial_referrer');
          if (referrerData) {
              try {
                  const parsedData = JSON.parse(referrerData);
                  if (new Date().getTime() < parsedData.expiry) {
                      return parsedData.url;
                  } else {
                      localStorage.removeItem('initial_referrer');
                  }
              } catch (e) {
                  return null;
              }
          }
          return null;
      }
      
      // Function to set referrer and UTM parameters in hidden input fields
      function setReferrerAndUTMInForm() {
          const referrer = getSavedReferrer();
          const formField = document.querySelector('input[name="form_fields[referrer_url]"]');
          if (referrer && formField) {
              formField.value = referrer;
          }
          const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'];
          utmFields.forEach(utm => {
              const utmValue = getUTMParameter(utm);
              if (utmValue) {
                  const utmInput = document.querySelector(\`input[name="form_fields[\${utm}]"]\`);
                  if (utmInput) {
                      utmInput.value = utmValue;
                  }
              }
          });
      }
      
      // Execute functions
      saveInitialReferrer();
      saveUTMParameters();
      
      // Run form field population after a slight delay to ensure DOM is ready
      setTimeout(setReferrerAndUTMInForm, 500);
    })();
    `,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "qcnfwb5jj5");
            `,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-DF1RPTNXT0"
          />
        )}

        {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
          <Script id="google-analytics">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DF1RPTNXT0');
          `}
          </Script>
        )}

        {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
          <Script id="gtm-dataLayer" strategy="afterInteractive">
            {`
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'pageview',
          'page': {
            'url': window.location.href,
            'title': document.title,
            'path': window.location.pathname
          }
        });
      `}
          </Script>
        )}
        {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s);
            j.async=true;
            j.src="https://load.gtm.gharmandir.in/dlhy6xxxkzrju.js?"+i;
            f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','9d=aWQ9R1RNLU5RVDlURDhO&sort=desc')`,
            }}
          />
        )}

        {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
            /**
             * UTM Parameters and Visitor Journey Tracker
             * Tracks UTM parameters, referrals, and visitor journey with cookie and localStorage sync
             */
            
            class UTMTracker {
                constructor() {
                    this.cookiePrefix = 'IR_';
                    this.cookieExpireDays = 365;
                    this.utmParams = ['source', 'medium', 'campaign', 'term', 'content'];
                    this.trackingIds = ['gclid', 'fbclid', 'msclkid', 'ttclid', 'twclid', 'li_fat_id'];
                    this.thankyouPages = ['thank_you', 'thank-you', 'success', 'order-received', 'confirmation', 'complete'];
                    
                    this.init();
                }
            
                init() {
                    // First priority: Recover any missing data immediately when script fires
                    this.performRecovery();
                    
                    // Then sync any remaining discrepancies
                    this.syncCookiesAndStorage();
                    
                    // Process current visit
                    this.processCurrentVisit();
                    
                    // Handle thank you page
                    this.handleThankYouPage();
                    
                    // Set up ongoing recovery system
                    this.startPeriodicSync();
                }
            
                /**
                 * Get domain for cookie (handles .example.com and .example.co.in)
                 */
                getDomain() {
                    const hostname = window.location.hostname;
                    const parts = hostname.split('.');
                    
                    if (parts.length >= 3) {
                        // For domains like subdomain.example.co.in or subdomain.example.com
                        if (parts[parts.length - 2] === 'co' && parts.length >= 4) {
                            // Handle .co.in, .co.uk, etc.
                            return '.' + parts.slice(-3).join('.');
                        } else {
                            // Handle .com, .org, etc.
                            return '.' + parts.slice(-2).join('.');
                        }
                    }
                    return hostname;
                }
            
                /**
                 * Set cookie with proper domain and expiration
                 */
                setCookie(name, value, days = this.cookieExpireDays) {
                    const expires = new Date();
                    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
                    const domain = this.getDomain();
                    
                    document.cookie = \`\${name}=\${encodeURIComponent(value)}; expires=\${expires.toUTCString()}; path=/; domain=\${domain}; SameSite=Lax\`;
                }
            
                /**
                 * Get cookie value
                 */
                getCookie(name) {
                    const nameEQ = name + "=";
                    const ca = document.cookie.split(';');
                    
                    for (let i = 0; i < ca.length; i++) {
                        let c = ca[i];
                        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                        if (c.indexOf(nameEQ) === 0) {
                            return decodeURIComponent(c.substring(nameEQ.length, c.length));
                        }
                    }
                    return null;
                }
            
                /**
                 * Set item in localStorage
                 */
                setLocalStorage(key, value) {
                    try {
                        localStorage.setItem(key, value);
                    } catch (e) {
                        console.warn('LocalStorage not available:', e);
                    }
                }
            
                /**
                 * Get item from localStorage
                 */
                getLocalStorage(key) {
                    try {
                        return localStorage.getItem(key);
                    } catch (e) {
                        console.warn('LocalStorage not available:', e);
                        return null;
                    }
                }
            
                /**
                 * Get URL parameters
                 */
                getUrlParams() {
                    const params = {};
                    const urlSearchParams = new URLSearchParams(window.location.search);
                    
                    for (const [key, value] of urlSearchParams) {
                        params[key.toLowerCase()] = decodeURIComponent(value);
                    }
                    
                    return params;
                }
            
                /**
                 * Get referrer source
                 */
                getReferrerSource() {
                    const referrer = document.referrer;
                    if (!referrer) return 'direct';
                    
                    try {
                        const referrerUrl = new URL(referrer);
                        const currentUrl = new URL(window.location.href);
                        
                        if (referrerUrl.hostname === currentUrl.hostname) {
                            return 'direct';
                        }
                        
                        return referrerUrl.hostname.replace('www.', '');
                    } catch (e) {
                        return 'direct';
                    }
                }
            
                /**
                 * Get current source and medium (only if there are actual new parameters)
                 */
                getCurrentSourceMedium() {
                    const urlParams = this.getUrlParams();
                    
                    // Check if we have actual UTM parameters in current URL
                    if (urlParams.utm_source) {
                        const source = urlParams.utm_source;
                        const medium = urlParams.utm_medium || 'utm';
                        return \`\${source}/\${medium}\`;
                    }
                    
                    // Check if we have a real external referrer (not internal navigation)
                    const referrerSource = this.getReferrerSource();
                    if (referrerSource !== 'direct') {
                        const referrer = document.referrer;
                        if (referrer) {
                            try {
                                const referrerUrl = new URL(referrer);
                                const currentUrl = new URL(window.location.href);
                                
                                // Only count as referrer if it's actually from external domain
                                if (referrerUrl.hostname !== currentUrl.hostname) {
                                    return \`\${referrerSource}/referral\`;
                                }
                            } catch (e) {
                                // If URL parsing fails, ignore
                            }
                        }
                    }
                    
                    // Return null if no new source/medium found (internal navigation)
                    return null;
                }
            
                /**
                 * Store single parameter in both cookie and localStorage
                 */
                storeParameter(key, value) {
                    const cookieKey = this.cookiePrefix + key;
                    
                    this.setCookie(cookieKey, value);
                    this.setLocalStorage(cookieKey, value);
                }
            
                /**
                 * Get parameter from cookie or localStorage
                 */
                getParameter(key) {
                    const cookieKey = this.cookiePrefix + key;
                    
                    let value = this.getCookie(cookieKey);
                    if (!value) {
                        value = this.getLocalStorage(cookieKey);
                        if (value) {
                            // Restore to cookie if found in localStorage
                            this.setCookie(cookieKey, value);
                        }
                    }
                    
                    return value;
                }
            
                /**
                 * Sync cookies and localStorage (recover missing values)
                 */
                syncCookiesAndStorage() {
                    const allKeys = [
                        ...this.utmParams,
                        ...this.trackingIds,
                        'channel_first',
                        'channel_last',
                        'channel_flow',
                        'campaign_flow',
                        'referrer'
                    ];
            
                    allKeys.forEach(key => {
                        const cookieKey = this.cookiePrefix + key;
                        const cookieValue = this.getCookie(cookieKey);
                        const storageValue = this.getLocalStorage(cookieKey);
            
                        if (cookieValue && !storageValue) {
                            this.setLocalStorage(cookieKey, cookieValue);
                        } else if (!cookieValue && storageValue) {
                            this.setCookie(cookieKey, storageValue);
                        }
                    });
                }
            
                /**
                 * Remove consecutive duplicates from flow
                 */
                removeConsecutiveDuplicates(flow) {
                    if (!flow) return '';
                    
                    const items = flow.split(',');
                    const result = [];
                    
                    for (let i = 0; i < items.length; i++) {
                        if (i === 0 || items[i] !== items[i - 1]) {
                            result.push(items[i]);
                        }
                    }
                    
                    return result.join(',');
                }
            
                /**
                 * Update visitor journey (only when there's actual new source/medium)
                 */
                updateVisitorJourney(currentSourceMedium, currentCampaign) {
                    // Only proceed if we have a new source/medium (not internal navigation)
                    if (!currentSourceMedium) {
                        return; // No update needed for internal page navigation
                    }
            
                    // Update first channel (only set once, never changes)
                    let firstChannel = this.getParameter('channel_first');
                    if (!firstChannel) {
                        this.storeParameter('channel_first', currentSourceMedium);
                        firstChannel = currentSourceMedium;
                    }
            
                    // Update last channel (only when we have new source)
                    this.storeParameter('channel_last', currentSourceMedium);
            
                    // Update channel flow (only add new sources)
                    let channelFlow = this.getParameter('channel_flow') || '';
                    if (channelFlow) {
                        const flowItems = channelFlow.split(',');
                        const lastItem = flowItems[flowItems.length - 1];
                        
                        // Only add if it's different from the last item
                        if (lastItem !== currentSourceMedium) {
                            channelFlow += ',' + currentSourceMedium;
                        }
                    } else {
                        channelFlow = currentSourceMedium;
                    }
                    
                    // Remove consecutive duplicates and store
                    channelFlow = this.removeConsecutiveDuplicates(channelFlow);
                    this.storeParameter('channel_flow', channelFlow);
            
                    // Update campaign flow (only when we have a campaign)
                    if (currentCampaign && currentCampaign !== 'undefined') {
                        let campaignFlow = this.getParameter('campaign_flow') || '';
                        if (campaignFlow) {
                            const campaignItems = campaignFlow.split(',');
                            const lastCampaign = campaignItems[campaignItems.length - 1];
                            
                            // Only add if it's different from the last campaign
                            if (lastCampaign !== currentCampaign) {
                                campaignFlow += ',' + currentCampaign;
                            }
                        } else {
                            campaignFlow = currentCampaign;
                        }
                        
                        // Remove consecutive duplicates and store
                        campaignFlow = this.removeConsecutiveDuplicates(campaignFlow);
                        this.storeParameter('campaign_flow', campaignFlow);
                    }
                }
            
                /**
                 * Process current visit and update parameters (only when new data is available)
                 */
                processCurrentVisit() {
                    const urlParams = this.getUrlParams();
                    let hasNewParams = false;
            
                    // Process UTM parameters (only if present in current URL)
                    this.utmParams.forEach(param => {
                        const utmKey = 'utm_' + param;
                        if (urlParams[utmKey]) {
                            this.storeParameter(param, urlParams[utmKey]);
                            hasNewParams = true;
                        }
                    });
            
                    // Process tracking IDs (only if present in current URL)
                    this.trackingIds.forEach(id => {
                        if (urlParams[id]) {
                            this.storeParameter(id, urlParams[id]);
                            hasNewParams = true;
                        }
                    });
            
                    // Store referrer only if it's external and we don't already have UTM parameters
                    if (!hasNewParams) {
                        const referrerSource = this.getReferrerSource();
                        if (referrerSource !== 'direct') {
                            const referrer = document.referrer;
                            if (referrer) {
                                try {
                                    const referrerUrl = new URL(referrer);
                                    const currentUrl = new URL(window.location.href);
                                    
                                    // Only store if it's truly external
                                    if (referrerUrl.hostname !== currentUrl.hostname) {
                                        this.storeParameter('referrer', referrerSource);
                                        hasNewParams = true;
                                    }
                                } catch (e) {
                                    // Ignore URL parsing errors
                                }
                            }
                        }
                    }
            
                    // Update visitor journey only if we have new tracking data
                    // This prevents updating journey on internal page navigation
                    if (hasNewParams || this.isFirstVisit()) {
                        const currentSourceMedium = this.getCurrentSourceMedium();
                        const currentCampaign = urlParams.utm_campaign;
                        
                        // Only update journey if we have actual source/medium data
                        if (currentSourceMedium) {
                            this.updateVisitorJourney(currentSourceMedium, currentCampaign);
                        } else if (this.isFirstVisit()) {
                            // For first visit with no UTM/referrer, set as direct
                            this.updateVisitorJourney('direct/none', null);
                        }
                    }
                }
            
                /**
                 * Check if this is the first visit (no existing journey data)
                 */
                isFirstVisit() {
                    return !this.getParameter('channel_first');
                }
            
                /**
                 * Build query string from stored parameters (only UTM and tracking IDs for thank you pages)
                 */
                buildQueryString() {
                    const params = [];
                    
                    // Add UTM parameters
                    this.utmParams.forEach(param => {
                        const value = this.getParameter(param);
                        if (value) {
                            params.push(\`utm_\${param}=\${encodeURIComponent(value)}\`);
                        }
                    });
            
                    // Add tracking IDs
                    this.trackingIds.forEach(id => {
                        const value = this.getParameter(id);
                        if (value) {
                            params.push(\`\${id}=\${encodeURIComponent(value)}\`);
                        }
                    });
            
                    // Note: Journey parameters (IR_campaign_flow, IR_channel_first, etc.) are excluded from thank you page URLs
                    // They remain stored in cookies/localStorage but don't appear in URL
            
                    return params.length > 0 ? '?' + params.join('&') : '';
                }
            
                /**
                 * Check if current page is a thank you page
                 */
                isThankYouPage() {
                    const currentPath = window.location.pathname.toLowerCase();
                    const currentUrl = window.location.href.toLowerCase();
                    
                    return this.thankyouPages.some(page => 
                        currentPath.includes(page) || currentUrl.includes(page)
                    );
                }
            
                /**
                 * Append parameters to thank you page URL
                 */
                handleThankYouPage() {
                    if (this.isThankYouPage()) {
                        const queryString = this.buildQueryString();
                        
                        if (queryString && !window.location.search.includes('utm_')) {
                            const newUrl = window.location.protocol + '//' + 
                                          window.location.host + 
                                          window.location.pathname + 
                                          queryString + 
                                          window.location.hash;
                            
                            // Update URL without reloading
                            window.history.replaceState({}, '', newUrl);
                        }
                    }
                }
            
                /**
                 * Start periodic sync to recover missing cookies/localStorage
                 * Also performs immediate recovery on page load
                 */
                startPeriodicSync() {
                    // Immediate recovery when script fires
                    this.performRecovery();
                    
                    // Set up periodic sync for current session
                    setInterval(() => {
                        this.performRecovery();
                    }, 604800000); // Sync every 7 days = 604800 seconds
                }
            
                /**
                 * Perform comprehensive recovery of missing data
                 */
                performRecovery() {
                    const allKeys = [
                        ...this.utmParams,
                        ...this.trackingIds,
                        'channel_first',
                        'channel_last',
                        'channel_flow',
                        'campaign_flow',
                        'referrer'
                    ];
            
                    let recoveredCount = 0;
            
                    allKeys.forEach(key => {
                        const cookieKey = this.cookiePrefix + key;
                        const cookieValue = this.getCookie(cookieKey);
                        const storageValue = this.getLocalStorage(cookieKey);
            
                        // If cookie is missing but localStorage has it, restore cookie
                        if (!cookieValue && storageValue) {
                            this.setCookie(cookieKey, storageValue);
                            recoveredCount++;
                            console.log(\`UTM Tracker: Recovered cookie \${cookieKey} from localStorage\`);
                        }
                        // If localStorage is missing but cookie has it, restore localStorage
                        else if (cookieValue && !storageValue) {
                            this.setLocalStorage(cookieKey, cookieValue);
                            recoveredCount++;
                            console.log(\`UTM Tracker: Recovered localStorage \${cookieKey} from cookie\`);
                        }
                    });
            
                    if (recoveredCount > 0) {
                        console.log(\`UTM Tracker: Successfully recovered \${recoveredCount} parameters\`);
                    }
                }
            
                /**
                 * Get all stored tracking data
                 */
                getAllTrackingData() {
                    const data = {};
                    
                    // UTM parameters
                    this.utmParams.forEach(param => {
                        const value = this.getParameter(param);
                        if (value) {
                            data[this.cookiePrefix + param] = value;
                        }
                    });
            
                    // Tracking IDs
                    this.trackingIds.forEach(id => {
                        const value = this.getParameter(id);
                        if (value) {
                            data[this.cookiePrefix + id] = value;
                        }
                    });
            
                    // Journey data
                    ['channel_first', 'channel_last', 'channel_flow', 'campaign_flow', 'referrer'].forEach(key => {
                        const value = this.getParameter(key);
                        if (value) {
                            data[this.cookiePrefix + key] = value;
                        }
                    });
            
                    return data;
                }
            
                /**
                 * Debug method to log all tracking data
                 */
                debug() {
                    console.log('UTM Tracker Debug Data:', this.getAllTrackingData());
                }
            }
            
            // Initialize the tracker immediately when script loads (for <head> placement)
            // No need to wait for DOMContentLoaded since we're not manipulating DOM initially
            window.utmTracker = new UTMTracker();
            
            // Also initialize again if DOM wasn't ready (fallback)
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    if (!window.utmTracker) {
                        window.utmTracker = new UTMTracker();
                    }
                });
            }
            
            // Expose debug method globally
            window.debugUTMTracker = () => {
                if (window.utmTracker) {
                    window.utmTracker.debug();
                }
            };
            `,
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <Providers>{children}</Providers>
        </ToastProvider>

        {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
          <Script
            id="exit-intent-gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
          (function() {
            let exitIntentFired = false;

            // Desktop: Mouse leaves top of viewport
            function handleMouseOut(e) {
          if (
            !exitIntentFired &&
            (!e.toElement && !e.relatedTarget) &&
            e.clientY <= 0
          ) {
            exitIntentFired = true;
            window.dataLayer = window.dataLayer || [];
            console.log('Exit intent fired');
            window.dataLayer.push({
              event: 'Exit_Intent_Shown_Web'
            });
          }
            }

            // Mobile: Back button or swipe navigation
            function handleVisibilityChange() {
          if (
            !exitIntentFired &&
            document.visibilityState === 'hidden'
          ) {
            exitIntentFired = true;
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: 'Exit_Intent_Shown_Web'
            });
          }
            }

            // Mobile: Scroll up quickly near top (simulate exit intent)
            let lastScrollY = window.scrollY;
            function handleTouchEnd() {
          if (
            !exitIntentFired &&
            window.scrollY < 50 &&
            lastScrollY - window.scrollY > 100
          ) {
            exitIntentFired = true;
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: 'Exit_Intent_Shown_Web'
            });
          }
          lastScrollY = window.scrollY;
            }

            document.addEventListener('mouseout', handleMouseOut);
            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('touchend', handleTouchEnd);
          })();
        `,
            }}
          />
        )}
      </body>
    </html>
  );
}
