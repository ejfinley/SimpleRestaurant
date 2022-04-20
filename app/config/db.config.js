module.exports = {
    HOST: "localhost",
    USERNAME: "root",
    PASSWORD: "password",
    DB: "simpleresturant",
    DIALECT: "mysql",
    PORT: 3306,
    pool: {
      max: 20,
      min: 0,
      acquire: 10000,
      idle: 10000
    },
    MAXTABLES: 100
}
