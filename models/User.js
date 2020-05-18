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
        login:  async function(username, password) {
            //Get user from db
            try{
                let user = await new this({ username }).fetch({require: false});
                
                if (!user) {
                    return false
                }
                
                //check if password is hashed
                if(user.get('password') === password) {
                    await this.updatePassword(user);
                    user = await new this({ username }).fetch({require: false});
                }
                
                //check if password matches
                const hash = user.get('password');
                
                const result = await bcrypt.compare(password, hash);
    
                //return false if password is incorrect
                if(!result) {
                    return false;
                }
    
                //return user
                return user;

            } catch(error) {
                throw error;
            }
        },
        updatePassword: async function(user) {
            //get password
            try{
                const password = user.get('password');
                const hash = await bcrypt.hash(password, this.hashSaltRounds);
                const updatedUser = await user.save({password: hash});

                return updatedUser;
            } catch (error) {
                throw error;
            }
        },
    })
}