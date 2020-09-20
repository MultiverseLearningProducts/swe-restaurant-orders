const {Restaurant, Storage} = require('../models')

describe('Restaurant', () => {
    test('are created with a name', async () => {
        const restaurant = await new Restaurant({name: 'loulous', imageUrl: 'image-url'})
        expect(restaurant.name).toEqual('loulous')
        expect(restaurant.id).toBe(1)
    })

    test('get a Restaurant with the menus', async (done) => {
        await Storage._initStorage()
        Storage.db.run('INSERT INTO restaurants (id, name, imageUrl) VALUES(?, ?, ?);', [100, 'test', 'img-src'], function () {
            Storage.db.run('INSERT INTO menus(restaurant_id, title) VALUES(?,?);', [100, 'main'], function () {
                Storage.db.run('INSERT INTO menus(restaurant_id, title) VALUES(?, ?);', [100, 'Desserts'], function () {
                    Storage.db.get('SELECT * FROM restaurants WHERE id = ?;', [100], async function (err, row) {
                        expect(row.id).toBe(100)
                        const restaurant = await new Restaurant(row)
                        expect(restaurant.id).toBe(100)
                        expect(restaurant.menus.length).toBe(2)
                        done()
                    })
                })
            })
        })
    })

    test('get all the restaurants', async () => {
        const restaurants = await Restaurant.all()
        expect(restaurants.length).toBe(2)
    })
})

describe('Menus', () => {
    test('restaurants have menus', async () => {
        const restaurant = await new Restaurant('Bennies', 'image-url')
        await restaurant.createMenu('Desserts')
        expect(restaurant.menus.length).toBe(1)
    })
})
