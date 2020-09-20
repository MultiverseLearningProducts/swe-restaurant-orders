const { Restaurant, Menu } = require('./index')

async function seed () {
    const r1 = await new Restaurant({ name: 'Nicolas Lobbestael', imageUrl: 'https://cdn.cnn.com/cnnnext/dam/assets/190625170055-mirazur-dining-room-night-nicolas-lobbestael.jpg'})
    await r1.createMenu('mains')
    await r1.createMenu('desserts')
    const r2 = await new Restaurant({ name: 'L\'Ambassade d\'Auvergne', imageUrl: 'https://ichef.bbci.co.uk/news/1024/cpsprodpb/102D8/production/_112546266_mediaitem112546106.jpg'})
    await r2.createMenu('drinks')
    console.log('Create 2 Restaurants')
}

seed()