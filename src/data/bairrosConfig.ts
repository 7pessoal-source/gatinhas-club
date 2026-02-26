export interface BairroConfig {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  coordenadas?: { lat: number; lng: number };
}

export const bairrosConfig: BairroConfig[] = [
  {
    id: "centro",
    nome: "Centro",
    slug: "centro-macapa",
    descricao: "O coração comercial de Macapá com diversas lojas, serviços e atrações.",
    coordenadas: { lat: 0.0356, lng: -51.0705 },
  },
  {
    id: "santa-rita",
    nome: "Santa Rita",
    slug: "santa-rita-macapa",
    descricao: "Bairro tradicional com características residenciais e comerciais.",
    coordenadas: { lat: 0.0456, lng: -51.0805 },
  },
  {
    id: "buritizal",
    nome: "Buritizal",
    slug: "buritizal-macapa",
    descricao: "Região em desenvolvimento com crescimento imobiliário.",
    coordenadas: { lat: 0.0556, lng: -51.0905 },
  },
  {
    id: "trem",
    nome: "Trem",
    slug: "trem-macapa",
    descricao: "Bairro com características mistas residenciais e comerciais.",
    coordenadas: { lat: 0.0656, lng: -51.1005 },
  },
  {
    id: "marco-zero",
    nome: "Marco Zero",
    slug: "marco-zero-macapa",
    descricao: "Região próxima à linha do equador, importante ponto turístico.",
    coordenadas: { lat: 0.0000, lng: -51.1105 },
  },
  {
    id: "jardim-equatorial",
    nome: "Jardim Equatorial",
    slug: "jardim-equatorial-macapa",
    descricao: "Bairro residencial com infraestrutura completa.",
    coordenadas: { lat: -0.0100, lng: -51.1205 },
  },
  {
    id: "congos",
    nome: "Congós",
    slug: "congos-macapa",
    descricao: "Região com características residenciais.",
    coordenadas: { lat: -0.0200, lng: -51.1305 },
  },
  {
    id: "novo-horizonte",
    nome: "Novo Horizonte",
    slug: "novo-horizonte-macapa",
    descricao: "Bairro em desenvolvimento com novos empreendimentos.",
    coordenadas: { lat: -0.0300, lng: -51.1405 },
  },
  {
    id: "infraero",
    nome: "Infraero",
    slug: "infraero-macapa",
    descricao: "Bairro próximo ao aeroporto com bom acesso.",
    coordenadas: { lat: 0.0756, lng: -51.1505 },
  },
  {
    id: "jesus-nazare",
    nome: "Jesus de Nazaré",
    slug: "jesus-nazare-macapa",
    descricao: "Região com diversos serviços e comércios.",
    coordenadas: { lat: 0.0856, lng: -51.1605 },
  },
];
