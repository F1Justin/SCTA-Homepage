export interface School {
  id: string;
  name: string;
  logo: string;
  groupInfo?: {
    name: string;
    number: string;
    description: string;
    extraGroups?: Array<{
      name: string;
      number: string;
      description: string;
    }>;
  };
}

export const schools: School[] = [
  {
    id: "fudan",
    name: "复旦大学",
    logo: "/School-Logos/复旦大学.png",
    groupInfo: {
      name: "普通のFDU东方群",
      number: "305785855",
      description: "普通のFDU东方群",
      extraGroups: [{
        name: "东方光华语游客群",
        number: "570042132",
        description: "复旦大学东方例会群聊"
      }]
    }
  },
  {
    id: "sjtu",
    name: "上海交通大学",
    logo: "/School-Logos/上海交通大学.png",
    groupInfo: {
      name: "Scarlet Joyful Touhou Univ.",
      number: "326840538",
      description: "表群，欢迎各路内鬼前来水群～～",
      extraGroups: [{
        name: "FZ西方文化交流群",
        number: "686922858",
        description: "里群喵，欢迎同学和校友前来游玩～～"
      }]
    }
  },
  {
    id: "tongji",
    name: "同济大学",
    logo: "/School-Logos/同济大学.png",
    groupInfo: {
      name: "幻想乡万有引力",
      number: "928225852",
      description: "原则上仅允许同济学生进入，欢迎加入✧٩(ˊωˋ*)و✧（若群号搜索无法进入，请尝试下方的链接或例会群聊【幻想乡‖万有引力】：https://qm.qq.com/q/WEdL13t6mI）",
      extraGroups: [{
        name: "同济大学 ❀ 济悠樱",
        number: "895825069",
        description: "同济大学东方Project例会群聊"
      }]
    }
  },
  {
    id: "shu",
    name: "上海大学",
    logo: "/School-Logos/上海大学.png",
    groupInfo: {
      name: "上海大学东方文化研讨",
      number: "805604480",
      description: "仅允许上海大学学生进入，少量例外;官方网站sdygroup.xyz"
    }
  },
  {
    id: "shiep",
    name: "上海电力大学",
    logo: "/School-Logos/上海电力大学.png",
    groupInfo: {
      name: "上电地灵殿托卡马克实验室",
      number: "513758886",
      description: "仅限本校同学，特殊请备注"
    }
  },
  {
    id: "usst",
    name: "上海理工大学",
    logo: "/School-Logos/上海理工大学.png",
    groupInfo: {
      name: "上理东方闲聊群",
      number: "910755656",
      description: "上理东方闲聊群"
    }
  },
  {
    id: "dhu",
    name: "东华大学",
    logo: "/School-Logos/东华大学.png",
    groupInfo: {
      name: "东华/松江-东方啤酒馆",
      number: "511594207",
      description: "（前身东华-东方project同好会）松江大学城东方众交流群"
    }
  },
  {
    id: "ecust",
    name: "华东理工大学",
    logo: "/School-Logos/华东理工大学.png",
    groupInfo: {
      name: "华理东方群",
      number: "547764191",
      description: "群主会不定时开展线下组织观摩幻奏以及逐梦东方圈，欢迎加入"
    }
  },
  {
    id: "shnu",
    name: "上海师范大学",
    logo: "/School-Logos/上海师范大学.png",
    groupInfo: {
      name: "海思路寺子屋",
      number: "459538957",
      description: "欢迎加入上师大幻乐团"
    }
  },
  {
    id: "sit",
    name: "上海应用技术大学",
    logo: "/School-Logos/上海应用技术大学.png",
    groupInfo: {
      name: "映姬东方project",
      number: "1043620753",
      description: "欢迎大家加入"
    }
  },
  {
    id: "ecnu",
    name: "华东师范大学",
    logo: "/School-Logos/华东师范大学.png",
    groupInfo: {
      name: "华师东方众交流群",
      number: "833917518",
      description: "欢迎加入华师东方交流群"
    }
  },
  {
    id: "shufe",
    name: "上海财经大学",
    logo: "/School-Logos/上海财经大学.png",
    groupInfo: {
      name: "上财东方牌麻薯厂兼老黄单推群",
      number: "591679113",
      description: "欢迎上财同好加入～",
      extraGroups: [{
        name: "上财东方例会群",
        number: "950687679",
        description: "上财东方例会群聊"
      }]
    }
  },
  {
    id: "ecupl",
    name: "华东政法大学",
    logo: "/School-Logos/华东政法大学.png",
    groupInfo: {
      name: "风依华梦-华政东方闲聊群",
      number: "2167037234",
      description: "欢迎华政同好和外校同好来玩～"
    }
  },
  {
    id: "shou",
    name: "上海海洋大学",
    logo: "/School-Logos/上海海洋大学.png",
    groupInfo: {
      name: "水域东方Project",
      number: "586928891",
      description: "养老闲聊群，欢迎加入"
    }
  },
  {
    id: "shmtu",
    name: "上海海事大学",
    logo: "/School-Logos/上海海事大学.png",
    groupInfo: {
      name: "神曲漫协东方同好会 -上海爱海丝幻乐团",
      number: "457747541",
      description: "欢迎来自海大的车万同好~ 我们每周都有小型thp,并且拥有自己的东方同人社团（魔女的秘密会所）"
    }
  },
  {
    id: "shcc",
    name: "上海海关学院",
    logo: "/School-Logos/上海海关学院.png",
    groupInfo: {
      name: "关院东方兴趣小组新手训练营",
      number: "670856523",
      description: "准入人群：关院本校学生（所有校区），非关院但在张江校区的同学，本校就在北蔡、张江的院校"
    }
  },
  {
    id: "lixin",
    name: "上海立信会计金融学院",
    logo: "/School-Logos/上海立信会计金融学院.png",
    groupInfo: {
      name: "超负荷幻想乡",
      number: "698534855",
      description: "立信的东方群，曾经人很多但现在似乎成为QQ单机版了QAQ，欢迎各位校友加入make 立信 great again(划掉)，内鬼也可以(小声)"
    }
  },
  {
    id: "sues",
    name: "上海电机学院",
    logo: "/School-Logos/上海电机学院.png",
    groupInfo: {
      name: "上海电机学院东方project同好会",
      number: "993840410",
      description: "欢迎各大校园的同志们卧底潜水（是本校生更好了）"
    }
  },
  {
    id: "sandau",
    name: "上海杉达学院",
    logo: "/School-Logos/上海杉达学院.png",
    groupInfo: {
      name: "上海杉达东方群 ミホ屋社团",
      number: "763759124",
      description: "欢迎大家加入上海杉达东方同好聊天群～"
    }
  },
  {
    id: "gench",
    name: "上海建桥学院",
    logo: "/School-Logos/上海建桥学院.png",
    groupInfo: {
      name: "桥砖东方同好会",
      number: "171782589",
      description: "这里是上海建桥学院的东方project同好会，欢迎各位车万加入，内鬼也可"
    }
  },
  {
    id: "shupl",
    name: "上海政法学院",
    logo: "/School-Logos/上海政法学院.png",
    groupInfo: {
      name: "耀月幻想乡",
      number: "490567412",
      description: "欢迎各位过气车万人（笑）。在这里甚至可以约片、约漫展、约音乐会！（根本抢不到票啊喂！）"
    }
  },
  {
    id: "sues-engineering",
    name: "上海工程技术大学",
    logo: "/School-Logos/上海工程技术大学.png",
    groupInfo: {
      name: "上海工程技术大学东方同好会",
      number: "974334274",
      description: "欢迎加入上海工程技术大学东方同好会"
    }
  },
  {
    id: "suibe",
    name: "上海对外经贸大学",
    logo: "/School-Logos/上海对外经贸大学.png",
    groupInfo: {
      name: "上海对外经贸大学东方同好会",
      number: "914878315",
      description: "SUIBE越共收集中"
    }
  },
  {
    id: "shanghaitech",
    name: "上海科技大学",
    logo: "/School-Logos/上海科技大学.png",
    groupInfo: {
      name: "铁科黑车",
      number: "█████████",
      description: "是上科大车车同好会☆~ 仅限本校同学加入，获取群号可通过生活手册的群宣共享表格（生活手册链接可在各校内大群群公告中查看），或者也可直接联系 QQ: 3504058036。"
    }
  },
  {
    id: "joint-colleges",
    name: "上海电子信息职业技术学院 & 上海中侨职业技术大学 & 上海城建职业学院 & 上海立达学院",
    logo: "/School-Logos/电子信息&城建&中侨&立达.png",
    groupInfo: {
      name: "电子信息×城建×中侨×立达の东方根据地",
      number: "117933986",
      description: "欢迎广大东方众校友进来唠嗑～",
      extraGroups: [{
        name: "东方虹柒录游客集散中心",
        number: "1038925807",
        description: "四校联合例会群聊"
      }]
    }
  },
  {
    id: "sbs",
    name: "上海商学院",
    logo: "/School-Logos/上海商学院.png"
  },
  {
    id: "shzq",
    name: "上海中侨职业技术大学",
    logo: "/School-Logos/上海中侨职业技术大学.png"
  },
  {
    id: "sisu",
    name:"上海外国语大学",
    logo: "/School-Logos/上海外国语大学.png",
    groupInfo:{
      name:"西索国际东方研究院",
      number:"1064822274",
      description:"由几个25级学生建立的上外东方群，欢迎上外的各位加入！（本群为非官方群聊）"
    }
  }
]; 