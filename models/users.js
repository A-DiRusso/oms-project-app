const db = require('./conn');  //requre the conn.js file
const bcrypt = require('bcryptjs');


class User {
    constructor (id, company_name, password) {
        this.id = id;
        this.companyName = company_name;
        this.password = password;
    }
    save() {
        //db.result - gives you the number of rows affected
        return db.result(`UPDATE users SET 
                    company_name= '${this.companyName}',
                    password = '${this.password}'
                     where id = ${this.id}`);
    }
    static insertUser (companyName, password) {
        return db.result(`insert into users
        (first_name, last_name, email, password)
        values  ($1, $2)`, [companyName, password])
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




modules.exports = User;