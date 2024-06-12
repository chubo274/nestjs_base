export default () => ({
  port: parseInt(process.env.PORT, 10) || 8686,
  jwt: {
    secret: process.env.AUTH_JWT_ACCESS_SECRET,
    salt: 12,
  },
  whitelistOrigins: [],
  defaultPassword: 'email@123',
  commonSortFields: ['createdAt', 'updatedAt'],
  webhookSecret: process.env.WEBHOOK_SECRET,
});