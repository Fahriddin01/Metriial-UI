export class ReportUtils {
  static activities = [
    {
      name: 'Продажа',
      value: 'sale',
    },
    {
      name: 'Добыча',
      value: 'mining',
    },
    {
      name: 'Переработка',
      value: 'processing',
    },
    {
      name: 'Упаковка',
      value: 'packaging',
    },
    {
      name: 'Производство',
      value: 'production',
    },
  ];

  static getNameByValue(value) {
    return this.activities.find((activity) => activity.value === value).name;
  }
}
