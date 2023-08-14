import { effect } from "state";

let is_bool = (val) => val === true || val === false;

// TODO: do something abuot duplication in create_node and create_fragment;
export function node_args(node, ...args) {
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    // skip falsey
    if (arg !== 0 && !arg) {
      continue;
    }

    let type = typeof arg;
    if (type === "string" || type === "number") text(arg)(node);
    else if (arg.nodeType) node.append(arg);
    else if (type === "object") attrs(arg)(node);
    else arg(node, i);
  }

  return node;
}

export function create_node(tag, ...args) {
  let node = document.createElement(tag);
  return node_args(node, ...args);
}

export function create_svg_ns(...args) {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return node_args(svg, ...args)
}

export function create_path_ns(...args) {
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return node_args(path, ...args)
}

export function create_fragment(...args) {
  let fragment = document.createDocumentFragment();
  return node_args(fragment, ...args);
}

export function text(content, modfn) {
  return (node) => {
    if (typeof content === "function") {
      effect(() => {
        node.textContent = content(modfn);
      });
    } else {
      node.textContent = content;
    }

    return node;
  };
}

export function classes(list = []) {
  return (node) => {
    node.className = list.filter(Boolean).join(" ");
  };
}

export function attrs(attrs) {
  return (node) => {
    for (let key in attrs) {
      let value = attrs[key];
      if (typeof value === "function") {
        effect(() => {
          let val = value();
          if (is_bool(val)) node.toggleAttribute(key, val, val);
          else node.setAttribute(key, val);
        });
      } else node.setAttribute(key, value);
    }

    return node;
  };
}

export function html(str) {
  return (node) => {
    node.innerHTML = str;
    return node;
  };
}

export function listeners(listeners) {
  return (node) => {
    for (let event in listeners) {
      node.addEventListener(event, listeners[event]);
    }
  };
}

export function value(content) {
  return (node) => {
    if (typeof content === "function") {
      effect(() => {
        node.value = content();
      });
    } else node.value = content;
  };
}

export function condition(cond, truthy, falsey) {
  return (parent, pos) => {
    effect(() => {
      if (cond()) {
        if (falsey) falsey.remove();
        return parent.insertBefore(truthy, parent.children[pos - 1]);
      } else if (falsey) {
        return parent.insertBefore(falsey, parent.children[pos - 1]);
      }
    });

    return falsey;
  };
}

export let fragment = (...args) => create_fragment(...args);
export let svg = (...args) => create_svg_ns(...args);
export let path = (...args) => create_path_ns(...args);
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
export let form = (...args) => create_node("form", ...args);
