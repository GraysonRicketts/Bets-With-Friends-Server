import config from 'config';

export const isProd = () => {
  const env = config.get('app.nodeEnv');
  return env === 'production';
};
