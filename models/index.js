const sqlite3 = require('sqlite3');
const location = process.env.NODE_ENV === 'test' ? ':memory:' : './data'

class Storage {
    static db = undefined;
    static _initStorage = () => {
        if (Storage.db) return Promise.resolve()
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(location)
            db.serialize(() => {
                db.exec([
                    'CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY, name TEXT, imageUrl TEXT);',
                    'CREATE TABLE IF NOT EXISTS menus (id INTEGER PRIMARY KEY, restaurant_id INTEGER, title TEXT);'
                ].join(''), function (err) {
                    Storage.db = db
                    err ? reject(err) : resolve()
                })
            })
        })
    }
    save = async () => {
        await Storage._initStorage()
        const item = this
        const {db} = Storage
        
        if (item instanceof Restaurant) {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO restaurants(name, imageUrl) VALUES(?, ?);', [item.name, item.imageUrl], function (err) {
                    if (err) return reject(err)
                    item.id = this.lastID
                    resolve(item)
                })
            })
        }

        if (item instanceof Menu) {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO menus(restaurant_id, title) VALUES(?, ?);', [item.restaurant_id, this.title], function (err) {
                    if (err) return reject(err)
                    item.id = this.lastID
                    resolve(item)
                })
            })
        }
    }
    getMenus() {
        const {db} = Storage
        const restaurant = this
        return new Promise((resolve, reject) => {
            db.all('SELECT * from menus WHERE restaurant_id = ?', [restaurant.id], function (err, rows) {
                Promise.all(rows.map(row => new Menu(row))).then(menus => {
                    restaurant.menus = menus
                    resolve(restaurant)
                })
            })
        })
    }
}

class Restaurant extends Storage {
    static all () {
        return new Promise((resolve, reject) => {
            Storage._initStorage().then(() => {
                Storage.db.all('SELECT * from restaurants;', function (err, rows) {
                    if (err) return reject(err)
                    resolve(rows)
                })
            })
        })
    }
    constructor(data) {
        super()
        this.id = data.id
        this.name = data.name
        this.imageUrl = data.imageUrl
        this.menus = []
        if (this.id) {
            return this.getMenus()
        } else {
            return this.save()
        }
    }
    async createMenu(title) {
        const menu = await new Menu({title, restaurant_id: this.id})
        this.menus.push(menu)
    }
}

class Menu extends Storage{
    constructor(data) {
        super()
        this.id = data.id
        this.restaurant_id = data.restaurant_id
        this.title = data.title
        this.items = []
        if(!this.id) {
            return this.save(this)
        }
    }
}

module.exports = {
    Storage,
    Restaurant,
    Menu
}