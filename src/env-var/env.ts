const getEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (value === undefined) {
    throw new Error("Missing environment variable: " + key);
  }
  return value;
};

const env = {
  api: {
    baseUrl: getEnv("VITE_API_BASE_URL"),
  },
};

export default env;
