/* start handle with localstorage */

// users local storage

export function handleGetAllUserInLocalStorage() {
  const users = localStorage.getItem("users");
  const data = JSON.parse(users);
  return data ? data : [];
}

export function handleAddUserInLocalStorage(data) {
  const users = handleGetAllUserInLocalStorage();
  const newData = [...users, data];
  handleUpdateUserInLocalStorage(newData);
}

export function handleUpdateUserInLocalStorage(data) {
  localStorage.setItem("users", JSON.stringify(data));
}

export function handleDeleteUserInLocalStorage(id) {
  const data = handleGetAllUserInLocalStorage();
  let newData = [...data].filter((item) => item.id !== id);
  handleUpdateUserInLocalStorage(newData);
}

// users filter local storage//

export function handleSetFilterUserInLocalStorage(obj) {
  localStorage.setItem("filter", JSON.stringify(obj));
}

export function handleGetFilterUserInLocalStorage() {
  const data = localStorage.getItem("filter");
  const newData = JSON.parse(data);
  return newData ? newData : {};
}

export function handleUpdateDataFilterUserInLocalStorage(data) {
  const filter = handleGetFilterUserInLocalStorage();
  let obj = {
    ...filter,
    data: data,
  };
  localStorage.setItem("filter", JSON.stringify(obj));
}

// sort local storage //

export function handleSetSortInLocalStorage(obj) {
  localStorage.setItem("sorts", JSON.stringify(obj));
}

export function handleGetSortInLocalStorage() {
  const data = localStorage.getItem("sorts");
  const newData = JSON.parse(data);
  return newData ? newData : {};
}

/* end handle with localstorage */
