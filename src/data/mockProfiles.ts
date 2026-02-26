export interface Profile {
  id: string;
  nome: string;
  idade: number;
  bairro: string;
  categoria: string;
  descricao: string;
  foto: string;
  fotos: string[];
  whatsapp: string;
  verificada: boolean;
  destaque: boolean;
}

export const bairros = [
  "Centro",
  "Santa Rita",
  "Trem",
  "Buritizal",
  "Pacoval",
  "Jardim Equatorial",
  "Novo Horizonte",
  "Zerão",
  "Congós",
  "Laguinho",
  "Beirol",
  "Marco Zero",
];

export const categorias = [
  "Luxo",
  "Independente",
  "Massagem",
  "Acompanhante",
];

export const mockProfiles: Profile[] = [
  {
    id: "1",
    nome: "Isabella",
    idade: 25,
    bairro: "Centro",
    categoria: "Luxo",
    descricao: "Olá! Sou a Isabella, uma mulher elegante e sofisticada. Atendo com muito carinho e discrição no Centro de Macapá. Entre em contato para mais informações.",
    foto: "",
    fotos: [],
    whatsapp: "5596999999999",
    verificada: true,
    destaque: true,
  },
  {
    id: "2",
    nome: "Valentina",
    idade: 23,
    bairro: "Santa Rita",
    categoria: "Independente",
    descricao: "Oi, sou a Valentina! Sou independente e atendo com muita dedicação. Venha me conhecer em Santa Rita.",
    foto: "",
    fotos: [],
    whatsapp: "5596999999998",
    verificada: true,
    destaque: false,
  },
  {
    id: "3",
    nome: "Sofia",
    idade: 28,
    bairro: "Buritizal",
    categoria: "Massagem",
    descricao: "Sou a Sofia, especialista em massagem relaxante e terapêutica. Ambiente aconchegante no Buritizal.",
    foto: "",
    fotos: [],
    whatsapp: "5596999999997",
    verificada: false,
    destaque: false,
  },
  {
    id: "4",
    nome: "Laura",
    idade: 26,
    bairro: "Jardim Equatorial",
    categoria: "Luxo",
    descricao: "Laura, sofisticada e discreta. Ambiente exclusivo no Jardim Equatorial. Agende seu horário.",
    foto: "",
    fotos: [],
    whatsapp: "5596999999996",
    verificada: true,
    destaque: true,
  },
  {
    id: "5",
    nome: "Helena",
    idade: 24,
    bairro: "Trem",
    categoria: "Independente",
    descricao: "Olá! Sou a Helena, uma jovem simpática e atenciosa. Atendo no bairro do Trem com discrição total.",
    foto: "",
    fotos: [],
    whatsapp: "5596999999995",
    verificada: false,
    destaque: false,
  },
  {
    id: "6",
    nome: "Manuela",
    idade: 27,
    bairro: "Marco Zero",
    categoria: "Acompanhante",
    descricao: "Manuela, acompanhante para eventos e jantares. Região do Marco Zero. Elegância garantida.",
    foto: "",
    fotos: [],
    whatsapp: "5596999999994",
    verificada: true,
    destaque: true,
  },
  {
    id: "7",
    nome: "Camila",
    idade: 22,
    bairro: "Congós",
    categoria: "Independente",
    descricao: "Oi! Sou a Camila, independente e carinhosa. Atendo na região dos Congós.",
    foto: "",
    fotos: [],
    whatsapp: "5596999999993",
    verificada: false,
    destaque: false,
  },
  {
    id: "8",
    nome: "Bianca",
    idade: 29,
    bairro: "Laguinho",
    categoria: "Massagem",
    descricao: "Bianca, massagista profissional. Sessões de relaxamento no Laguinho. Agende já!",
    foto: "",
    fotos: [],
    whatsapp: "5596999999992",
    verificada: true,
    destaque: false,
  },
];
