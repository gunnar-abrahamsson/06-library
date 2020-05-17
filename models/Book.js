/**
 * book model
 */

module.exports = (bookshelf) => {
    return bookshelf.model('Book', {
        tableName: 'books',
        author() {
            return this.belongsTo('Author')  //books.author_id = 3 (single author) -> authors.id = 3
        },
        users() {
            return this.belongsToMany('User');
        },
    })
}