// js/authors.js
// 作者链接表（只维护人名 -> 链接）
const authorLinks = {
  "Jingjing Liu": "https://air.tsinghua.edu.cn/en/info/1046/1194.htm",
  "Ya-Qin Zhang": "https://air.tsinghua.edu.cn/en/info/1046/1188.htm",
  "Xianyuan Zhan": "https://zhanxianyuan.xyz/",

  "Jianxiong Li": "https://facebear-ljx.github.io/",
  "Jinliang Zheng": "https://scholar.google.com/citations?user=3j5AHFsAAAAJ&hl=zh-CN",
  "Yinan Zheng": "https://zhengyinan-air.github.io/",
  "Haoyi Niu": "https://t6-thu.github.io/",
  "Dongxiu Liu": "https://openreview.net/profile?id=~Dongxiu_Liu2",
  "Guanming Wang": "https://openreview.net/profile?id=~Guanming_Wang1",
  "Xiaoai Zhou": "https://openreview.net/profile?id=~Xiaoai_Zhou1",
  "Wencong Zhang": "https://openreview.net/profile?id=~Wencong_Zhang2",
  "Xirui Kang": "https://scholar.google.com/citations?user=X9qKxrQAAAAJ&hl=zh-CN",
  "Jiayin Zou": "https://openreview.net/profile?id=~Jiayin_Zou1",
  "Yuchun Feng": "https://github.com/CathyF9600",
  "Ruiming Liang": "https://github.com/LRMbbj",
  "Kexin Zheng": "https://github.com/Whiterrrrr",
  "Tianyi Tan": "https://github.com/0ttwhy4",
  "Liyuan Mao": "https://scholar.google.com/citations?user=Xa2pDisAAAAJ&hl=en",

  "Junzhi Yu": "https://scholar.google.com/citations?user=Gudfky4AAAAJ&hl=zh-CN",
  "Zhanhua Xin": "https://ieeexplore.ieee.org/author/37089550574",
  "Yan Xiong": "https://ieeexplore.ieee.org/author/395377228084533",
  "Shenghao Zhang": "https://ieeexplore.ieee.org/author/37088400646",
  "Wanchao Chi": "https://ieeexplore.ieee.org/author/37088401669",
  "Yan Meng": "https://scholar.google.com/citations?user=dQc4qhsAAAAJ&hl=zh-CN",
  "Shihan Kong": "https://scholar.google.com.hk/citations?user=Rucrm6EAAAAJ&hl=zh-CN",
  "Chong Zhang": "https://ieeexplore.ieee.org/author/37088689969",
  "Yuzhen Liu": "https://ieeexplore.ieee.org/author/37086560116",

  "Guanglu Song": "https://songguanglu.github.io/",
  "Yu Liu": "https://liuyu.us/",
  "Zhonghong Ou": "https://teacher.bupt.edu.cn/ouzhonghong/en/index.htm",
  "Jianming Hu": "https://scholar.google.com/citations?user=OD-QFQQAAAAJ&hl=en",
  "Yilun Chen": "https://yilunchen.com/about/",
  "Jia Zeng": "https://zeng-jia.github.io/",
  "Tai Wang": "https://tai-wang.github.io/",
  "Jiangmiao Pang": "https://oceanpang.github.io/",
  "Guang Chen": "https://openreview.net/profile?id=%7EGuang_Chen1",
  "Hangjun Ye": "https://openreview.net/profile?id=~Hangjun_Ye1",
  "Jinqiao Wang": "https://openreview.net/profile?id=~Jinqiao_Wang1",

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
        const myName = "Zh1hao Wang";
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
