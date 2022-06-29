export enum TokenExpiration {
  Access = 15 * 60, // 15 minutes
  Refresh = 7 * 24 * 60 * 60, // 1 week
}

export enum Cookies {
  AccessToken = 'access',
  RefreshToken = 'refresh',
}
