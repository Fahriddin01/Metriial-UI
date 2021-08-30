export const getProductCategory = () => [
  { id: 'EXTRA', title: 'Экстра' },
  { id: 'FIRSTGRADESALT', title: 'Намаки оши- навьи якум' },
  { id: 'SECONDGRADESALT', title: 'Намаки оши - навьи дуюм' },
  { id: 'DRINKINGSALT', title: 'Намаки ошомидани' },
  { id: 'TECHSALT', title: 'Намаки техники' },
  { id: 'ROCKSALT', title: 'Намаки санги' },
];

export const getActivityType = () => [
  { id: '7', title: 'Добыча' },
  { id: '8', title: 'Переработка' },
  { id: '9', title: 'Упаковка' },
  { id: '10', title: 'Продажа' },
];

export const getWeightUnit = () => [
  { id: 'gr', title: 'Гр' },
  { id: 'kg', title: 'Кг' },
  { id: 'ton', title: 'Тонна' },
];

export const getActionType = () => [
  { id: 'sale', title: 'Продажа' },
  { id: 'store', title: 'Складировать' },
];

export const getIodineConcentration = () => [
  { id: '0ppm', title: '0 ppm' },
  { id: '1-25ppm', title: '1-25 ppm' },
  { id: '25-45ppm', title: '25-45 ppm' },
  { id: '45ppm+', title: '45ppm +' },
];

export const userRole = () => [
  { id: 'supervisorAdmin', title: 'Администратор' },
  { id: 'hr', title: 'HR' },
  { id: 'curator', title: 'Куратор' },
  { id: 'client', title: 'Клиент' },
  { id: 'clientAdmin', title: 'Клиент(Администратор)' },
];

export const complainCategory = () => [
  { id: "tech", title: "Администратор" },
  { id: "hr", title: "HR" },
];

export const orgtype = () => [
  { id: 'supervision', title: 'Наблюдение' },
  { id: 'client', title: 'Клиент' },
];

export const orgActivities = () => [
  { id: 'production', title: 'Производство' },
  { id: 'processing', title: 'Переработка' },
  { id: 'packaging', title: 'Упаковка' },
  { id: 'sale', title: 'Продажа' },
  { id: 'mining', title: 'Добыча' },
];
