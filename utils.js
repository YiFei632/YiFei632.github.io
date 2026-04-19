// js/authors.js
// 作者链接表（只维护人名 -> 链接）
const authorLinks = {
  "Shihan Kong": "https://amr.pku.edu.cn/jzyg/szdw/K/dd31c0717a33499098f55a4f8103f0e4.htm",
  "Zhanhua Xin": "https://xinzhanhua.github.io/",
  "Kaiwei Zhu": "https://scholar.google.com.hk/citations?user=BFdOuJ8AAAAJ&hl=zh-CN",
  "Junzhi Yu": "https://amr.pku.edu.cn/jzyg/szdw/Y/7cc6c4a98def4c4089fe08ce09a5479c.htm",

};

// 自动替换逻辑
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".authors").forEach(block => {
    const names = block.innerText.split(",").map(s => s.trim());

    const rendered = names.map(raw => {
      // ✅ 检查是否是 "me" 或带标记的 "me*"/"me†"
      if (/^me([†‡*]+)?$/i.test(raw)) {
        const match = raw.match(/^me([†‡*]+)?$/i);
        const mark = match && match[1] ? `<sup>${match[1]}</sup>` : "";
        const myName = "Y1Fei Wang";
        return `<b>${myName}</b>${mark}`; // ✅ 仅粗体，无链接
      }

      // 普通作者逻辑
      const match = raw.match(/^(.+?)([†‡*]+)?$/);
      const name = match[1].trim();
      const mark = match[2] ? `<sup>${match[2]}</sup>` : "";

      if (authorLinks[name]) {
        return `<a href="${authorLinks[name]}" target="_blank">${name}</a>${mark}`;
      } else {
        return `${name}${mark}`;
      }
    });

    block.innerHTML = rendered.join(", ");
  });
});
