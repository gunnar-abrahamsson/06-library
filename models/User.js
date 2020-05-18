/**
 * user model
 */
const bcrypt = require('bcrypt');

module.exports = (bookshelf) => {
    return bookshelf.model('User', {
        tableName: 'users',
        books() {
            return this.belongsToMany('Book');
        },
    }, {
        hashSaltRounds: 10,
        async login(username, password) {
            //Get user from db
            try{
                let user = await new this({ username }).fetch({require: false});
                
                if (!user) {
                    return false
                }
                
                //check if password is hashed
                if(user.get('password') === password) {
                    await this.hashPassword(user);
                    user = await new this({ username }).fetch({require: false});
                }
                
                //check if password matches
                const hash = user.get('password');
                
                //return false if password is incorrect
                //return user
                return (await bcrypt.compare(password, hash))
                    ? user
                    :false;

            } catch(error) {
                throw error;
            }
        },
        async checkAndUpdatePassword(user, password) {
            //check if password is hashed
            if(user.get('password') === password) {
                await this.hashPassword(user);
                user = await new this({ username }).fetch({require: false});
            }

            return user;
        },
        async updatePassword(password) {
            const hash = await bcrypt.hash(password, this.hashSaltRounds);
            return hash;
        },
        async hashPassword(user) {
            //get password
            try{
                const password = user.get('password');
                const hash = await this.updatePassword(password);
                const updatedUser = await user.save({password: hash});

                return updatedUser;
            } catch (error) {
                throw error;
            }
        },
    })
}