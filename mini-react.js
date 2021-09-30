class React {
  /**
   * 创建文本节点
   * @param {text} 文本值
   * @return {element} 虚拟 DOM
   */
  static createTextElement(text) {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: [],
      },
    };
  }

  /**
   * 创建虚拟 DOM 结构
   * @param {type} 标签名
   * @param {props} 属性对象
   * @param {children} 子节点
   * @return {element} 虚拟 DOM
   */
  static createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) =>
          // 当 children 是非对象时，应该创建一个 textElement 元素
          typeof child === "object" ? child : this.createTextElement(child)
        ),
      },
    };
  }

  /**
   * 将虚拟 DOM 添加至真实 DOM
   * @param {element} 虚拟 DOM
   * @param {container} 真实 DOM
   */
  static render(element, container) {
    // 判断是文字还是dom节点, 分别创建
    const dom =
      element.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type);
    // 递归将 children 转成 真实dom push 进 container
    element.props.children.forEach((child) => {
      this.render(child, dom);
    });
    // 判断 props key 类型 && 过滤 children 类型
    // 为 dom 类型 的进行 props 赋值
    const isProperty = (key) => key !== "children";
    Object.keys(element.props)
      .filter(isProperty)
      .forEach((name) => {
        dom[name] = element.props[name];
      });

    container.appendChild(dom);
  }
}

const element = React.createElement(
  "div",
  null,
  React.createElement(
    "div",
    null,
    React.createElement("span", { style: "color:blue" }, "React")
  )
);
React.render(element, document.getElementById("root"));
