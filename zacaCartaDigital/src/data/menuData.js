export const menuSections = [
  {
    id: 'pizzas',
    number: '01',
    title: 'Pizzas',
    items: ['Muzzarella', 'Fugazzeta', '4 Quesos', 'Napolitana', 'Peperoni', 'Hawaiana', 'Mexicana'].map((name, index) => ({
      name,
      price: [180, 210, 250, 220, 225, 230, 240][index],
    })),
  },
  {
    id: 'empanadas',
    number: '02',
    title: 'Empanadas',
    items: ['Criolla', 'Carne picante', 'Pollo al verdeo', 'Pollo y hongos', 'Pollo y calabaza', 'Jamón y queso', 'Verduras', '4 Quesos', 'Caprese', 'Bondiola BBQ', 'Cheeseburger', 'Cebolla y queso'].map((name, index) => ({
      name,
      price: [35, 42, 39, 43, 40, 38, 35, 45, 40, 48, 50, 39][index],
    })),
  },
  {
    id: 'calzones',
    number: '03',
    title: 'Calzones',
    items: [
      { name: 'Jamón y queso', price: 145 },
      { name: 'Caprese', price: 150 },
      { name: 'Napolitano', description: 'Jamón, queso, tomate y ajo', price: 155 },
      { name: 'Fugazzeta', description: 'Cebolla y queso', price: 150 },
      { name: 'EntreNos', description: 'Pollo, champiñones y queso', price: 180 },
      { name: 'Verduras', description: 'Espinaca, calabacín, cebolla, pimientos, salsa blanca y queso', price: 150 },
    ],
  },
  {
    id: 'milanesas',
    number: '04',
    title: 'Milanesas',
    subtitle: 'Res o pollo',
    note: 'Popurrí de Milanesas — para 2 personas, elegí 4 sabores',
    items: [
      { name: 'Clásica', description: 'De entraña, de molleja de res o de bondiola de cerdo', price: 160 },
      { name: 'Napolitana', price: 190 },
      { name: 'Fugazzeta', price: 180 },
      { name: 'Suiza', price: 195 },
      { name: 'Jamón y queso', price: 175 },
      { name: 'Cheddar', price: 170 },
    ],
    footnote: 'Todas vienen con papas fritas, camote frito, puré de papas o puré de calabaza, a elección.',
  },
  {
    id: 'tacos',
    number: '05',
    title: 'Tacos',
    subtitle: 'Orden de 3',
    items: ['Asada', 'Pollo', 'Cerdo', 'Arrachera', 'Chorizo'].map((name, index) => ({
      name,
      price: [105, 95, 90, 130, 100][index],
    })),
  },
  {
    id: 'quesadillas',
    number: '06',
    title: 'Quesadillas',
    items: ['Queso', 'Asada', 'Pollo', 'Cerdo', 'Arrachera', 'Chorizo'].map((name, index) => ({
      name,
      price: [75, 100, 95, 90, 120, 100][index],
    })),
  },
  {
    id: 'burritos',
    number: '07',
    title: 'Burritos',
    items: [
      ...['Asada', 'Pollo', 'Cerdo', 'Arrachera', 'Chorizo'].map((name, index) => ({
        name,
        price: [110, 105, 100, 140, 110][index],
      })),
      { name: 'Vegetariano', description: 'Frijoles, arroz, verduras y queso', price: 95 },
    ],
  },
]

export const complements = [
  { name: 'Cebolla', icon: '🧅' },
  { name: 'Cilantro', icon: '🌿' },
  { name: 'Piña', icon: '🍍' },
  { name: 'Cebolla morada', icon: '🧅' },
  { name: 'Aguacate', icon: '🥑' },
]