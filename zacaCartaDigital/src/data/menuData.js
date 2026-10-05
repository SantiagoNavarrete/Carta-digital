export const menuSections = [
  {
    id: 'pizzas',
    number: '01',
    title: 'Pizzas',
    items: ['Muzzarella', 'Fugazzeta', '4 Quesos', 'Napolitana', 'Peperoni', 'Hawaiana', 'Mexicana'].map((name, index) => ({
      name,
      price: [275, 285, 285, 285, 285, 285, 285][index],
    })),
  },
  {
    id: 'empanadas',
    number: '02',
    title: 'Empanadas',
    items: ['Criolla', 'Carne picante', 'Pollo al verdeo', 'Pollo y hongos', 'Jamón y queso', 'Verduras', '4 Quesos', 'Caprese', 'Bondiola BBQ', 'Cheeseburger', 'Cebolla y queso'].map((name) => ({
      name,
      price: 50,
    })),
  },
  {
    id: 'calzones',
    number: '03',
    title: 'Calzones',
    items: [
      { name: 'Jamón y queso', price: 330 },
      { name: 'Caprese', price: 330 },
      { name: 'Napolitano', price: 330 },
      { name: 'Fugazzeta', price: 330 },
      { name: 'Entrenos', price: 330 },
      { name: 'Verduras', price: 330 },
    ],
  },
  {
    id: 'milanesas',
    number: '04',
    title: 'Milanesas',
    subtitle: 'Res o pollo',
    items: [
      { name: 'Clásica', description: 'Res o pollo', price: 275 },
      { name: 'Napolitana', description: 'Salsa de tomate, jamón, queso, rodaja de tomate y orégano', price: 330 },
      { name: 'Fugazzeta', description: 'Queso y cebolla', price: 330 },
      { name: 'Suiza', description: 'Salsa blanca y queso', price: 330 },
      { name: 'Jamón y queso', price: 330 },
      { name: 'Cheddar', description: 'Cheddar, bacon y verdeo', price: 330 },
      { name: 'Popurrí de Milanesas', description: 'Para 2 personas, elige 4 sabores', price: 499 },
    ],
    footnote: 'Todas vienen con guarnición a elección: papas fritas, camote frito o puré de papas.',
  },
  {
    id: 'sandwiches',
    number: '05',
    title: 'Sandwiches',
    note: 'Armá tu combo con papas fritas por $35 más',
    items: [
      { name: 'Milanesa', description: 'Res o pollo, jamón, queso, huevo, mayonesa, lechuga y tomate', price: 275 },
      { name: 'Lomo de pollo', price: 275 },
      { name: 'Bondiola de cerdo', price: 275 },
      { name: 'Entraña', price: 295 },
      { name: 'Molleja', price: 295 },
      { name: 'Vacío', price: 295 },
    ],
    complements: [
      { name: 'Cebolla', icon: '🧅' },
      { name: 'Tomate', icon: '🍅' },
      { name: 'Lechuga', icon: '🥬' },
      { name: 'Jalapeño', icon: '🌶️' },
    ],
  },
  {
    id: 'tacos',
    number: '06',
    title: 'Tacos',
    subtitle: 'Orden de 3',
    items: ['Asada', 'Pollo', 'Cerdo', 'Arrachera', 'Chorizo'].map((name, index) => ({
      name,
      price: [105, 95, 90, 130, 100][index],
    })),
  },
  {
    id: 'quesadillas',
    number: '07',
    title: 'Quesadillas',
    items: ['Queso', 'Asada', 'Pollo', 'Cerdo', 'Arrachera', 'Chorizo'].map((name, index) => ({
      name,
      price: [75, 100, 95, 90, 120, 100][index],
    })),
  },
  {
    id: 'burritos',
    number: '08',
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