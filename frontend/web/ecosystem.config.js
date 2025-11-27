module.exports = {
  apps: [
    {
      name: 'ResumeVault',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://miniapp.egtoy.xyz/backend',
      },
    },
  ],
};
