export const menuSections = [
  {
    id: 'pizzas',
    number: '01',
    title: 'Pizzas',
    items: ['Muzzarella', 'Fugazzeta', '4 Quesos', 'Napolitana', 'Peperoni', 'Hawaiana', 'Mexicana'].map((name, index) => ({
      name,
      price: [9500, 11200, 12800, 11000, 10500, 11800, 12500][index],
    })),
  },
  {
    id: 'empanadas',
    number: '02',
    title: 'Empanadas',
    items: ['Criolla', 'Carne picante', 'Pollo al verdeo', 'Pollo y hongos', 'Pollo y calabaza', 'Jamón y queso', 'Verduras', '4 Quesos', 'Caprese', 'Bondiola BBQ', 'Cheeseburger', 'Cebolla y queso'].map((name, index) => ({
      name,
      price: [1800, 2100, 1900, 2200, 1950, 1800, 1750, 2100, 2000, 2400, 2450, 1900][index],
    })),
  },
  {
    id: 'calzones',
    number: '03',
    title: 'Calzones',
    items: [
      { name: 'Jamón y queso', price: 10800 },
      { name: 'Caprese', price: 11200 },
      { name: 'Napolitano', description: 'Jamón, queso, tomate y ajo', price: 11500 },
      { name: 'Fugazzeta', description: 'Cebolla y queso', price: 11300 },
      { name: 'EntreNos', description: 'Pollo, champiñones y queso', price: 12900 },
      { name: 'Verduras', description: 'Espinaca, calabacín, cebolla, pimientos, salsa blanca y queso', price: 11000 },
    ],
  },
  {
    id: 'milanesas',
    number: '04',
    title: 'Milanesas',
    subtitle: 'Res o pollo',
    note: 'Popurrí de Milanesas — para 2 personas, elegí 4 sabores',
    items: [
      { name: 'Clásica', description: 'De entraña, de molleja de res o de bondiola de cerdo', price: 14500 },
      { name: 'Napolitana', price: 15800 },
      { name: 'Fugazzeta', price: 15600 },
      { name: 'Suiza', price: 16000 },
      { name: 'Jamón y queso', price: 15000 },
      { name: 'Cheddar', price: 14900 },
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
      price: [10500, 9500, 9200, 12500, 9800][index],
    })),
  },
  {
    id: 'quesadillas',
    number: '06',
    title: 'Quesadillas',
    items: ['Queso', 'Asada', 'Pollo', 'Cerdo', 'Arrachera', 'Chorizo'].map((name, index) => ({
      name,
      price: [8000, 9800, 9400, 9300, 11500, 9700][index],
    })),
  },
  {
    id: 'burritos',
    number: '07',
    title: 'Burritos',
    items: [
      ...['Asada', 'Pollo', 'Cerdo', 'Arrachera', 'Chorizo'].map((name, index) => ({
        name,
        price: [9400, 9000, 8900, 11600, 9100][index],
      })),
      { name: 'Vegetariano', description: 'Frijoles, arroz, verduras y queso', price: 8500 },
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