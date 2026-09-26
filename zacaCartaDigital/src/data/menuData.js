export const menuSections = [
  {
    id: 'pizzas',
    number: '01',
    title: 'Pizzas',
    items: ['Muzzarella', 'Fugazzeta', '4 Quesos', 'Napolitana', 'Peperoni', 'Hawaiana', 'Mexicana'].map((name) => ({ name, price: '' })),
  },
  {
    id: 'empanadas',
    number: '02',
    title: 'Empanadas',
    items: ['Criolla', 'Carne picante', 'Pollo al verdeo', 'Pollo y hongos', 'Pollo y calabaza', 'Jamón y queso', 'Verduras', '4 Quesos', 'Caprese', 'Bondiola BBQ', 'Cheeseburger', 'Cebolla y queso'].map((name) => ({ name, price: '' })),
  },
  {
    id: 'calzones',
    number: '03',
    title: 'Calzones',
    items: [
      { name: 'Jamón y queso', price: '' },
      { name: 'Caprese', price: '' },
      { name: 'Napolitano', description: 'Jamón, queso, tomate y ajo', price: '' },
      { name: 'Fugazzeta', description: 'Cebolla y queso', price: '' },
      { name: 'EntreNos', description: 'Pollo, champiñones y queso', price: '' },
      { name: 'Verduras', description: 'Espinaca, calabacín, cebolla, pimientos, salsa blanca y queso', price: '' },
    ],
  },
  {
    id: 'milanesas',
    number: '04',
    title: 'Milanesas',
    subtitle: 'Res o pollo',
    note: 'Popurrí de Milanesas — para 2 personas, elegí 4 sabores',
    items: [
      { name: 'Clásica', description: 'De entraña, de molleja de res o de bondiola de cerdo', price: '' },
      { name: 'Napolitana', price: '' },
      { name: 'Fugazzeta', price: '' },
      { name: 'Suiza', price: '' },
      { name: 'Jamón y queso', price: '' },
      { name: 'Cheddar', price: '' },
    ],
    footnote: 'Todas vienen con papas fritas, camote frito, puré de papas o puré de calabaza, a elección.',
  },
  {
    id: 'tacos',
    number: '05',
    title: 'Tacos',
    subtitle: 'Orden de 3',
    items: ['Asada', 'Pollo', 'Cerdo', 'Arrachera', 'Chorizo'].map((name) => ({ name, price: '' })),
  },
  {
    id: 'quesadillas',
    number: '06',
    title: 'Quesadillas',
    items: ['Queso', 'Asada', 'Pollo', 'Cerdo', 'Arrachera', 'Chorizo'].map((name) => ({ name, price: '' })),
  },
  {
    id: 'burritos',
    number: '07',
    title: 'Burritos',
    items: [
      ...['Asada', 'Pollo', 'Cerdo', 'Arrachera', 'Chorizo'].map((name) => ({ name, price: '' })),
      { name: 'Vegetariano', description: 'Frijoles, arroz, verduras y queso', price: '' },
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