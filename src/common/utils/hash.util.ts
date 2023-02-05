import bcrypt from 'bcrypt';

export const hashPassword = async (passwordToHash: string): Promise<string> => {
  return await bcrypt.hash(passwordToHash, 11);
};

export const comparePassword = async (hashedPassword: string, plainPassword: string): Promise<boolean> => {
  return await bcrypt.compare(hashedPassword, plainPassword);
};

export const genSalt = async () => {
  return await bcrypt.genSalt();
};
