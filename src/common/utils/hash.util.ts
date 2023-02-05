import bcrypt from 'bcrypt';

/**
 * Generate hashed password
 * @param {string} passwordToHash password to hash
 * @returns {string} hashed password
 */
export const hashPassword = async (passwordToHash: string): Promise<string> => {
  return await bcrypt.hash(passwordToHash, 11);
};

/**
 * Compare hash and plain password
 * @param {string} hashedPassword hashed password
 * @param {string} plainPassword plain password
 * @returns {boolean} whether plain password matches hashed password
 */
export const comparePassword = async (hashedPassword: string, plainPassword: string): Promise<boolean> => {
  return await bcrypt.compare(hashedPassword, plainPassword);
};

/**
 * Generate string salt
 * @returns {string} salt
 */
export const genSalt = async (): Promise<string> => {
  return await bcrypt.genSalt();
};
