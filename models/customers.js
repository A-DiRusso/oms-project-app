const db = require('./conn');  //requre the conn.js file
const bcrypt = require('bcryptjs');

class Customer {
    constructor (id, first_name, last_name, email, company) {
        this.id = id;
        this.firstName = first_name;
        this.lastName = last_name;
        this.email = email;
        this.company = company;
    }
    save() {
        //db.result - gives you the number of rows affected
        return db.result(`UPDATE users SET 
                    first_name = '${this.firstName}',
                    last_name = '${this.lastName}',
                    email ='${this.email}',
                    conmpany = '${this.company}'
                     where id = ${this.id}`);
    }
    static insertUser (firstName, lastName, email, company) {
        return db.result(`insert into users
        (first_name, last_name, email, password)
        values  ($1, $2, $3, $4)`, [firstName, lastName, email, company])
    }

}

module.exports = Customer;


