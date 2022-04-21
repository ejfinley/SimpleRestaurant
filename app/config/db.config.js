module.exports = {
    HOST: "localhost",
    USERNAME: "root",
    PASSWORD: "password",
    DB: "simplerestaurant",
    DIALECT: "mysql",
    PORT: 3306,
    pool: {
      max: 20,
      min: 0,
      acquire: 10000,
      idle: 10000
    },
    // Max tables should be done dynamically 
    // This could be done easily by creating a resturant database
    // This database could have maximums and data like the resturants menu
    MAXTABLES: 100
}
