const FILMES = [
  {
    id: 'orbita',
    titulo: 'Órbita Silenciosa',
    genero: 'Ficção científica',
    duracao: 128,
    classificacao: '12',
    poster: 'img/orbita-silenciosa.jpg',
    sessoes: [
      { id: 'orb-1400', hora: '14:00', formato: '2D', tipo: 'regular', sala: 1 },
      { id: 'orb-1700', hora: '17:00', formato: '3D', tipo: 'regular', sala: 1 },
      { id: 'orb-2030', hora: '20:30', formato: '3D', tipo: 'regular', sala: 1 }
    ]
  },
  {
    id: 'farol',
    titulo: 'O Último Farol',
    genero: 'Drama',
    duracao: 112,
    classificacao: '14',
    poster: 'img/o-ultimo-farol.jpg',
    sessoes: [
      { id: 'far-1630', hora: '16:30', formato: '2D', tipo: 'regular', sala: 2 },
      { id: 'far-2100', hora: '21:00', formato: '2D', tipo: 'regular', sala: 2 }
    ]
  },
  {
    id: 'quintal',
    titulo: 'Turma do Quintal',
    genero: 'Animação',
    duracao: 95,
    classificacao: 'Livre',
    poster: 'img/turma-do-quintal.jpg',
    sessoes: [
      { id: 'qui-1300', hora: '13:00', formato: '2D', tipo: 'regular', sala: 3 },
      { id: 'qui-1530', hora: '15:30', formato: '3D', tipo: 'regular', sala: 3 }
    ]
  },
  {
    id: 'vidro',
    titulo: 'Cidade de Vidro',
    genero: 'Suspense',
    duracao: 121,
    classificacao: '16',
    poster: 'img/cidade-de-vidro.jpg',
    sessoes: [
      { id: 'vid-2200', hora: '22:00', formato: '2D', tipo: 'pré-estreia', sala: 4 }
    ]
  }
];

const FILEIRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ASSENTOS_POR_FILEIRA = 10;

const OCUPADOS_INICIAIS = {
  'orb-1400': ['A1', 'A2', 'D5', 'D6', 'E5', 'E6'],
  'orb-1700': ['C3', 'C4', 'C5', 'F7', 'F8'],
  'orb-2030': ['B1', 'B2', 'B3', 'D4', 'D5', 'D6', 'D7', 'H10'],
  'far-1630': ['E1', 'E2'],
  'far-2100': ['C5', 'C6', 'G1', 'G2', 'G3'],
  'qui-1300': ['A5', 'A6', 'B5', 'B6'],
  'qui-1530': ['D1', 'D2', 'D3', 'D4'],
  'vid-2200': ['E4', 'E5', 'E6', 'E7', 'F4', 'F5', 'F6', 'F7']
};

const PRODUTOS = [
  { id: 'pipocaP', nome: 'Pipoca pequena', preco: 14.00 },
  { id: 'pipocaG', nome: 'Pipoca grande', preco: 22.00 },
  { id: 'refri', nome: 'Refrigerante 500 ml', preco: 9.50 },
  { id: 'agua', nome: 'Água mineral', preco: 6.00 },
  { id: 'chocolate', nome: 'Chocolate', preco: 7.90 }
];
