export interface Product {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  categoria: string;
  imagen: string;
  descripcion?: string;
}

export interface Combo {
  id: number;
  titulo: string;
  productos: string[];
  precioNormal: number;
  precioCombo: number;
  descuento: number;
  imagen: string;
}

export const productos: Product[] = [
  { id: 1, nombre: "Vaper ELF BAR 5000 Puffs - Mango", marca: "ELF BAR", precio: 45.00, categoria: "Vapers", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=ELF+BAR" },
  { id: 2, nombre: "GEEK VAPE Aegis Mini Kit", marca: "GEEK VAPE", precio: 180.00, categoria: "Vapers", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=AEGIS+MINI" },
  { id: 3, nombre: "Líquido NAKED 100 - Mango 60ml", marca: "NAKED 100", precio: 35.00, categoria: "Líquidos", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=NAKED+100" },
  { id: 4, nombre: "Pipa de Vidrio RAW 25cm", marca: "RAW", precio: 65.00, categoria: "Pipas", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=RAW+PIPA" },
  { id: 5, nombre: "Vaper LOST MARY 3500 Puffs - Fresa", marca: "LOST MARY", precio: 40.00, categoria: "Vapers", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=LOST+MARY" },
  { id: 6, nombre: "Líquido VGOD - Lush Ice 60ml", marca: "VGOD", precio: 38.00, categoria: "Líquidos", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=VGOD" },
  { id: 7, nombre: "Bong de Vidrio Premium 30cm", marca: "MR. HUMO", precio: 120.00, categoria: "Bongs", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=BONG+30CM" },
  { id: 8, nombre: "Grinder Metálico 4 Piezas", marca: "RAW", precio: 25.00, categoria: "Accesorios", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=GRINDER" },
  { id: 9, nombre: "Tabaco American Spirit Blue", marca: "American Spirit", precio: 28.00, categoria: "Tabaco", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=TABACO" },
  { id: 10, nombre: "Kit de Limpieza para Vapers", marca: "MR. HUMO", precio: 15.00, categoria: "Accesorios", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=KIT+LIMPIEZA" },
  { id: 11, nombre: "Cargador USB-C para Vaper", marca: "GEEK VAPE", precio: 12.00, categoria: "Accesorios", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=CARGADOR" },
  { id: 12, nombre: "Pipa Sherlock de Madera", marca: "RAW", precio: 55.00, categoria: "Pipas", imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=PIPA+MADERA" },
];

export const combos: Combo[] = [
  {
    id: 101,
    titulo: "Kit Inicio Vaper",
    productos: ["Vaper ELF BAR 5000 Puffs", "Líquido NAKED 100 60ml", "Cargador USB-C"],
    precioNormal: 180,
    precioCombo: 150,
    descuento: 17,
    imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=KIT+INICIO",
  },
  {
    id: 102,
    titulo: "Pack Fumador",
    productos: ["Pipa de Vidrio RAW 25cm", "Grinder Metálico 4 Piezas", "Encendedor Premium"],
    precioNormal: 100,
    precioCombo: 85,
    descuento: 15,
    imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=PACK+FUMADOR",
  },
  {
    id: 103,
    titulo: "Pack Líquidos x3",
    productos: ["Líquido NAKED 100 - Mango", "Líquido VGOD - Lush Ice", "Líquido NAKED 100 - Berry"],
    precioNormal: 111,
    precioCombo: 90,
    descuento: 19,
    imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=PACK+LIQUIDOS",
  },
  {
    id: 104,
    titulo: "Combo Premium Vaper",
    productos: ["GEEK VAPE Aegis Mini Kit", "Líquido VGOD 60ml", "Kit de Limpieza"],
    precioNormal: 233,
    precioCombo: 199,
    descuento: 15,
    imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=COMBO+PREMIUM",
  },
];

export const categorias = [
  { nombre: "Vapers", emoji: "💨" },
  { nombre: "Líquidos", emoji: "💧" },
  { nombre: "Pipas", emoji: "🪈" },
  { nombre: "Bongs", emoji: "🫙" },
  { nombre: "Tabaco", emoji: "🚬" },
  { nombre: "Accesorios", emoji: "🔧" },
  { nombre: "Combos", emoji: "🎁" },
];
