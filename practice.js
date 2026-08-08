function getUser(id) {
  return Promise.resolve({ id, name: 'Ada' });
}
function getPosts(userId) {
  return Promise.resolve([{ id: 1 }, { id: 2 }]);
}

async function run() {
    const id = await getUser(1);
    const posts = await getPosts(id.id);
    console.log(posts.filter((data) => data.id ==1));
}

run();