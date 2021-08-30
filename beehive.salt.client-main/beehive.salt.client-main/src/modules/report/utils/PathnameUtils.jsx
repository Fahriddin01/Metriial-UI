export class PathnameUtils {
  static pathnames = [
    {
      name: 'Продажа',
      path: '/complains',
    },
    {
      name: 'Добыча',
      path: '/complains/add',
    },
    {
      name: 'Переработка',
      path: '/complains/edit/:id',
    },
    {
      name: 'Упаковка',
      path: '/reports/add/:activity',
    },
    {
      name: 'Производство',
      path: '/reports',
    },
    {
      name: 'Добыча',
      path: '/organization-profile',
    },
    {
      name: 'Переработка',
      path: '/reports/add',
    },
    {
      name: 'Упаковка',
      path: '/complains/:id',
    },
    {
      name: 'Производство',
      path: '/reports/view/:id',
    },

    {
      name: 'Упаковка',
      path: '/reports/edit/:id',
    },
    {
      name: 'Упаковка',
      path: '/users',
    },
    {
      name: 'Упаковка',
      path: '/users/add',
    },
    {
      name: 'Упаковка',
      path: '/users/edit/:id',
    },
    {
      name: 'Упаковка',
      path: '/users/:id',
    },
    {
      name: 'Упаковка',
      path: '/organizations',
    },
    {
      name: 'Упаковка',
      path: '/organizations/:id',
    },
    {
      name: 'Упаковка',
      path: '/organizations/edit/:id',
    },
    {
      name: 'Упаковка',
      path: '/organizations/add',
    },
  ];

  static getNameByPath(path) {
    return this.pathnames.find((pathname) => pathname.path === path).name;
  }
}
