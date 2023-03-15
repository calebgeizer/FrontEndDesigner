// * Local Storage * //
function set(name, data) {
  localStorage.setItem(name, data);
}

function get(name) {
  return localStorage.getItem(name);
}

function del(name) {
  localStorage.removeItem(name);
}

function clear() {
  localStorage.clear();
}

export { set, get, del, clear };
