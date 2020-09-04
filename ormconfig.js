module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'endsoul',
  password: 'dnjsclr1',
  database: 'mydb',
  logging: false,
  connectTimeoutMS: 100,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  // 모든 Entity(테이블) 이름 앞에 설정 값을 붙여서 테이블을 생성한다.
  // entityPrefix: 'my',
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
