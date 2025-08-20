import Cookies from 'js-cookie';

// Cookie utility functions using js-cookie
export const setCookie = (name: string, value: string, days: number = 7): void => {
  Cookies.set(name, value, { expires: days });
};

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const deleteCookie = (name: string): void => {
  Cookies.remove(name);
};

export const parseCookies = (cookieString: string): Record<string, string> => {
  const cookies: Record<string, string> = {};
  if (!cookieString) return cookies;
  
  cookieString.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  
  return cookies;
};

// Additional js-cookie utilities
export const getAllCookies = (): Record<string, string> => {
  return Cookies.get();
};

export const setCookieWithOptions = (
  name: string, 
  value: string, 
  options?: Cookies.CookieAttributes
): void => {
  Cookies.set(name, value, options);
};
