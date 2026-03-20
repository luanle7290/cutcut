import type { Hairstyle } from '@/types'

export const HAIRSTYLES: Hairstyle[] = [
  // SHORT
  { id: 'pixie-cut',       name: 'Pixie Cut',        nameVi: 'Tóc Pixie',          image: '/hairstyles/pixie-cut.svg',       category: 'short'    },
  { id: 'bob-classic',     name: 'Classic Bob',       nameVi: 'Bob Cổ Điển',        image: '/hairstyles/bob-classic.svg',     category: 'short'    },
  { id: 'bob-wavy',        name: 'Wavy Bob',          nameVi: 'Bob Gợn Sóng',       image: '/hairstyles/bob-wavy.svg',        category: 'short'    },
  { id: 'undercut',        name: 'Undercut',          nameVi: 'Undercut',            image: '/hairstyles/undercut.svg',        category: 'short'    },

  // MEDIUM
  { id: 'lob-straight',    name: 'Straight Lob',      nameVi: 'Lob Thẳng',          image: '/hairstyles/lob-straight.svg',    category: 'medium'   },
  { id: 'lob-wavy',        name: 'Wavy Lob',          nameVi: 'Lob Gợn Sóng',       image: '/hairstyles/lob-wavy.svg',        category: 'medium'   },
  { id: 'wolf-cut',        name: 'Wolf Cut',          nameVi: 'Wolf Cut',            image: '/hairstyles/wolf-cut.svg',        category: 'medium'   },
  { id: 'shag-cut',        name: 'Shag Cut',          nameVi: 'Shag Cut',            image: '/hairstyles/shag-cut.svg',        category: 'medium'   },
  { id: 'butterfly-cut',   name: 'Butterfly Cut',     nameVi: 'Butterfly Cut',       image: '/hairstyles/butterfly-cut.svg',   category: 'medium'   },

  // LONG
  { id: 'long-straight',   name: 'Long Straight',     nameVi: 'Dài Thẳng',          image: '/hairstyles/long-straight.svg',   category: 'long'     },
  { id: 'long-layers',     name: 'Long Layers',       nameVi: 'Dài Layer',           image: '/hairstyles/long-layers.svg',     category: 'long'     },
  { id: 'curtain-bangs',   name: 'Curtain Bangs',     nameVi: 'Mái Curtain Bangs',   image: '/hairstyles/curtain-bangs.svg',   category: 'long'     },
  { id: 'side-part-long',  name: 'Side Part Long',    nameVi: 'Dài Rẽ Ngôi',        image: '/hairstyles/side-part-long.svg',  category: 'long'     },

  // CURLY
  { id: 'curly-natural',   name: 'Natural Curls',     nameVi: 'Xoăn Tự Nhiên',      image: '/hairstyles/curly-natural.svg',   category: 'curly'    },
  { id: 'curly-bob',       name: 'Curly Bob',         nameVi: 'Bob Xoăn',            image: '/hairstyles/curly-bob.svg',       category: 'curly'    },
  { id: 'perm-waves',      name: 'Perm Waves',        nameVi: 'Uốn Sóng Nhẹ',       image: '/hairstyles/perm-waves.svg',      category: 'curly'    },

  // STRAIGHT
  { id: 'blunt-straight',  name: 'Blunt Cut',         nameVi: 'Cắt Blunt',           image: '/hairstyles/blunt-straight.svg',  category: 'straight' },
  { id: 'middle-part',     name: 'Middle Part',       nameVi: 'Rẽ Ngôi Giữa',       image: '/hairstyles/middle-part.svg',     category: 'straight' },

  // WAVY
  { id: 'beach-waves',     name: 'Beach Waves',       nameVi: 'Sóng Biển',           image: '/hairstyles/beach-waves.svg',     category: 'wavy'     },
  { id: 'mermaid-waves',   name: 'Mermaid Waves',     nameVi: 'Sóng Mermaid',        image: '/hairstyles/mermaid-waves.svg',   category: 'wavy'     },
]

export const CATEGORIES = [
  { id: 'all',      label: 'Tất Cả'   },
  { id: 'short',    label: 'Ngắn'     },
  { id: 'medium',   label: 'Vừa'      },
  { id: 'long',     label: 'Dài'      },
  { id: 'curly',    label: 'Xoăn'     },
  { id: 'wavy',     label: 'Gợn Sóng' },
  { id: 'straight', label: 'Thẳng'    },
] as const
