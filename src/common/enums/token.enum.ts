export enum TokenExpiration {
  ACCESS = 15 * 60, // 15 minutes
  REFRESH = 7 * 24 * 60 * 60, // 1 week
  REQUEST = 30 * 60, // 30 MIN
}

export enum Cookies {
  ACCESS_TOKEN = 'access',
  REFRESH_TOKEN = 'refresh',
}
