import bizSdk from 'facebook-nodejs-business-sdk';
import { environment } from "@/environment/environment";
/**
 * Send Facebook Conversion API Event
 * @param {Object} params - Event parameters
 * @param {string} params.eventName - Name of the event (e.g., 'Purchase')
 * @param {string[]} [params.emails] - User emails (hashed)
 * @param {string[]} [params.phones] - User phones (hashed)
 * @param {string} params.fbp - Facebook browser ID from _fbp cookie
 * @param {string} [params.fbc] - Facebook click ID from _fbc cookie
 * @param {string} [params.clientIp] - User IP address
 * @param {string} [params.userAgent] - User browser agent
 * @param {Object} params.content - Product/content info
 * @param {string} params.content.id - Product ID
 * @param {number} [params.content.quantity=1] - Product quantity
 * @param {number} params.value - Purchase/event value
 * @param {string} [params.currency='usd'] - Currency code
 * @param {string} [params.eventUrl] - URL where event occurred
 * @returns {Promise<Object>} - Facebook API response
 */
async function sendFacebookEvent(params) {
  try {
    const {
      Content,
      CustomData,
      DeliveryCategory,
      EventRequest,
      UserData,
      ServerEvent,
      FacebookAdsApi
    } = bizSdk;

    // Initialize API with access token from environment variables
    const access_token = environment?.fb_key;
    const pixel_id = environment?.pixel_key;
    FacebookAdsApi.init(access_token);

    // Validate required parameters
    if (!params.fbp) throw new Error('fbp parameter is required');
    if (!params.eventName) throw new Error('eventName parameter is required');
    if (params.value === undefined) throw new Error('value parameter is required');

    const current_timestamp = Math.floor(Date.now() / 1000);

    // Create user data
    const userData = new UserData()
      .setEmails(params.emails || [])
      .setPhones(params.phones || [])
      .setClientIpAddress(params.clientIp || '')
      .setClientUserAgent(params.userAgent || '')
      .setFbp(params.fbp)
      .setFbc(params.fbc || '');

    // Create content data
    const content = new Content()
      .setId(params.content.id)
      .setQuantity(params.content.quantity || 1)
      .setDeliveryCategory(DeliveryCategory.HOME_DELIVERY);

    // Create custom data
    const customData = new CustomData()
      .setContents([content])
      .setCurrency(params.currency || 'usd')
      .setValue(params.value);

    // Create server event
    const serverEvent = new ServerEvent()
      .setEventName(params.eventName)
      .setEventTime(current_timestamp)
      .setUserData(userData)
      .setCustomData(customData)
      .setEventSourceUrl(params.eventUrl || '')
      .setActionSource('website');

    // Execute request
    const eventRequest = new EventRequest(access_token, pixel_id)
      .setEvents([serverEvent]);

    const response = await eventRequest.execute();
    return response;
  } catch (error) {
    console.error('Facebook Conversion API Error:', error);
    throw error; // Re-throw for caller to handle
  }
}

export default sendFacebookEvent ;

// Example usage:
/*
async function trackPurchase() {
  try {
    const response = await sendFacebookEvent({
      eventName: 'Purchase',
      fbp: 'fbp_from_cookie', // Get from _fbp cookie
      fbc: 'fbc_from_cookie', // Get from _fbc cookie (if available)
      emails: ['hashed_email@example.com'],
      phones: ['hashed_phone_number'],
      clientIp: '123.123.123.123', // From request IP
      userAgent: 'Mozilla/5.0...', // From request headers
      content: {
        id: 'product_123',
        quantity: 2
      },
      value: 199.98,
      currency: 'usd',
      eventUrl: 'https://yourstore.com/checkout'
    });
    console.log('Event sent successfully:', response);
  } catch (error) {
    console.error('Failed to send event:', error);
  }
}
*/