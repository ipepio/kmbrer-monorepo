module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: process.env.NODE_ENV === 'development' ? 'postgres' : env('DB_HOST'),
      port: env.int('POSTGRES_PORT', 5432),
      database: env('POSTGRES_DB', 'my-project'),
      user: env('POSTGRES_USER', 'root'),
      password: env('POSTGRES_PASSWORD', '123456'),
      ssl: env.bool('POSTGRES_SSL', false) && {
        rejectUnauthorized: env.bool('POSTGRES_SSL_REJECT_UNAUTHORIZED', false),
      },
    },
  }
});
