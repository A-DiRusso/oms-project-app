const db = require('./conn');
const bcrypt = require('bcryptjs');

class User {
    constructor(id, company_name, password) {
        this.id = id;
        this.companyName = company_name,
        this.password = password;
    }
    setPassword(newPassword) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        this.password = hash;
    };

    static getByEmail(email) {
        return db.one(`select * from users where email=$1`, [email])
            .then(userData => {
                const aUser = new User(
                    userData.id,
                    userData.company_name,
                    userData.password);
                return aUser;
            })
        }
    
    checkPassword(aPassword) {
        // const isCorrect = bcrypt.compareSync(aPassword, this.password);
        return bcrypt.compareSync(aPassword, this.password);
    }
}