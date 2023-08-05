import { effect } from "state";

let is_bool = (val) => val === true || val === false;

export function create_node(tag, modifiers = []) {
  let node = document.createElement(tag);
  for (let mod of modifiers) mod(node);
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
export let span = (...fns) => create_node("span", fns);
export let div = (...fns) => create_node("div", fns);
export let ul = (...fns) => create_node("ul", fns);
export let li = (...fns) => create_node("li", fns);
export let p = (...fns) => create_node("p", fns);
export let img = (...fns) => create_node("img", fns);
export let h2 = (...fns) => create_node("h2", fns);
export let a = (...fns) => create_node("a", fns);
export let button = (...fns) => create_node("button", fns);
export let input = (...fns) => create_node("input", fns);
export let label = (...fns) => create_node("label", fns);
