// Mock cookie package for browser compatibility
export const parse = (str: string, options?: any) => {
  const cookies: Record<string, string> = {};
  if (!str) return cookies;

  str.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
};

export const serialize = (name: string, value: string, options?: any) => {
  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (options?.expires) {
    const expires = new Date(options.expires);
    cookie += `; expires=${expires.toUTCString()}`;
  }

  if (options?.path) {
    cookie += `; path=${options.path}`;
  }

  if (options?.domain) {
    cookie += `; domain=${options.domain}`;
  }

  if (options?.secure) {
    cookie += '; secure';
  }

  if (options?.httpOnly) {
    cookie += '; httpOnly';
  }

  if (options?.sameSite) {
    cookie += `; samesite=${options.sameSite}`;
  }

  return cookie;
};

// For set-cookie-parser compatibility
export const splitCookiesString = (cookiesString: string): string[] => {
  if (!cookiesString) return [];
  return cookiesString.split(',').map(cookie => cookie.trim());
};

export const parseString = (setCookieValue: string) => {
  const parts = setCookieValue.split(';');
  const nameValue = parts[0].split('=');
  const name = nameValue[0].trim();
  const value = nameValue.slice(1).join('=');

  const cookie: any = { name, value };

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i].trim();
    const [key, val] = part.split('=');

    switch (key.toLowerCase()) {
      case 'expires':
        cookie.expires = new Date(val);
        break;
      case 'max-age':
        cookie.maxAge = parseInt(val, 10);
        break;
      case 'domain':
        cookie.domain = val;
        break;
      case 'path':
        cookie.path = val;
        break;
      case 'secure':
        cookie.secure = true;
        break;
      case 'httponly':
        cookie.httpOnly = true;
        break;
      case 'samesite':
        cookie.sameSite = val;
        break;
    }
  }

  return cookie;
};

export default { parse, serialize, splitCookiesString, parseString };
