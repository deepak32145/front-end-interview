const API_URL = "https://api.github.com/users/deepak32145";

async function getUsers() {
  const data = await fetch(API_URL);
  const jsonValue = await data.json();
  console.log(jsonValue);
}

getUsers();
