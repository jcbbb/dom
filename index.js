import { effect } from "state";

let is_bool = (val) => val === true || val === false;

export function create_node(tag, ...args) {
  let node = document.createElement(tag);
  for (let arg of args) {
    // skip falsey
    if (arg !== 0 && !arg) {
      continue
    }

    let type = typeof arg
    if (type === "string" || type === "number") text(arg)(node)
    else if (arg.nodeType) node.append(arg);
    else if (type === "object") attrs(arg)(node)
    else arg(node)
  }

  return node;
}

export function create_fragment(modifiers = []) {
  const fragment = new DocumentFragment();
  for (const mod of modifiers) mod(fragment);
  return fragment;
}

export function text(content, modfn) {
  return (node) => {
    if (typeof content === "function") {
      effect(() => {
        node.textContent = content(modfn)
      })
    } else {
      node.textContent = content
    }

    return node;
  }
}

export function classes(list = []) {
  return (node) => {
    node.className = list.filter(Boolean).join(" ");
  }
}

export function create_svg_ns(modifiers = []) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  for (const mod of modifiers) mod(svg);

  return svg;
}

export function create_path_ns(modifiers = []) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  for (const mod of modifiers) mod(path);

  return path;
}

export function attrs(attrs) {
  return (node) => {
    for (let key in attrs) {
      let value = attrs[key];
      if (typeof value === "function") {
        effect(() => {
          let val = value();
          if (is_bool(val)) node.toggleAttribute(key, val, val);
          else node.setAttribute(key, val)
        });
      } else node.setAttribute(key, value)
    }

    return node;
  }
}

export function html(str) {
  return (node) => {
    node.innerHTML = str;
    return node;
  };
}

export let fragment = (...fns) => create_fragment(fns);
export let svg = (...fns) => create_svg_ns(fns);
export let path = (...fns) => create_path_ns(fns);
export let span = (...args) => create_node("span", ...args);
export let div = (...args) => create_node("div", ...args);
export let ul = (...args) => create_node("ul", ...args);
export let li = (...args) => create_node("li", ...args);
export let p = (...args) => create_node("p", ...args);
export let img = (...args) => create_node("img", ...args);
export let h2 = (...args) => create_node("h2", ...args);
export let a = (...args) => create_node("a", ...args);
export let button = (...args) => create_node("button", ...args);
export let input = (...args) => create_node("input", ...args);
export let label = (...args) => create_node("label", ...args);
