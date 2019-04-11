const db = require('./conn');  //requre the conn.js file
const bcrypt = require('bcryptjs');


class User {
    constructor (id, company_email, password, first_name, last_name) {
        this.id = id;
        this.companyEmail = company_email;
        this.password = password;
        this.firstName = first_name;
        this.lastName = last_name;
    }

    static getByEmail(email) {
        return db.one(`SELECT * FROM users WHERE email=$1`, [email])
            .then((userData) => {
                console.log(userData);
                const userInstance = new User(userData.id, userData.company_email, userData.first_name, userData.last_name);
                
                return userInstance;
            })
            .catch((error) => {
                return null;
            });
    }
    save() {
        //db.result - gives you the number of rows affected
        return db.result(`UPDATE users SET 
                    company_email= '${this.companyEmail}',
                    password = '${this.password}',
                    first_name = '${this.firstName}',
                    last_name = '${this.lastName}'
                     where id = ${this.id}`);
    }
    static insertUser (companyEmail, password, firstName, lastName) {
        return db.result(`insert into users
        (company_email, password, first_name, last_name)
        values  ($1, $2, $3, $4)`, [companyEmail, password, firstName, lastName])
    }
    setPassword(password) {
        this.password = bcrypt.hashSync(password, 10);  //10 is my salt
    }
    static hashPassword(password) {
        return bcrypt.hashSync(password, 10);  //10 is my salt
    }
    checkPassword(password) {
        return bcrypt.compareSync(password,this.password);
    }

}




module.exports = User;
