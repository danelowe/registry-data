const {Lokka} = require('lokka');
const {Transport} = require('lokka-transport-http');
const yaml = require('js-yaml');
const fs   = require('fs');
// set timezone to UTC (needed for Graphcool)
process.env.TZ = 'UTC';
const headers = {
    'Authorization': 'Bearer '+process.env.AUTH
};
const client = new Lokka({
    transport: new Transport('https://api.graph.cool/simple/v1/cja9bjel55trg01546241jgep', {headers})
    //transport: new Transport('http://localhost:60000/simple/v1/cja0pxzqs000401032rfdjskp')
});

const createWish = async(wish) => {
    await client.mutate(`{
    wish: createWish(
      orSimilar: ${wish.orSimilar}
      url: "${wish.url}"
      title: "${wish.title}"
      description: "${wish.description}"
      price: ${wish.price}
      quantityDesired: ${wish.quantityDesired}
      quantityUnallocated: ${wish.quantityUnallocated}
      quantityType: "${wish.quantityType}"
      imageUrl: "${wish.imageUrl}"
      sortOrder: ${wish.sortOrder}
    ) {
      id
    }
  }`);
};

const createUser = async() => {
    await client.mutate(`{
    user: createUser(
        email: visitor@daneandkate.nz
    ) {
        id
    }
    }`)
}

const createWishes = async(rawWishes) => {
    return await Promise.all(rawWishes.map(createWish))
};

const main = async() => {
    const rawWishes = yaml.safeLoad(fs.readFileSync('./wishes.yaml', 'utf8'));
    await createUser();
    const ids = await createWishes(rawWishes);
    console.log(`Created ${ids.length} wishes`)
};

main().catch((e) => console.error(e));