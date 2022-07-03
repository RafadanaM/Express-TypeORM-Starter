export enum TokenExpiration {
  ACCESS = 15 * 60, // 15 minutes
  REFRESH = 7 * 24 * 60 * 60, // 1 week
}

export enum Cookies {
  ACCESS_TOKEN = 'access',
  REFRESH_TOKEN = 'refresh',
}
