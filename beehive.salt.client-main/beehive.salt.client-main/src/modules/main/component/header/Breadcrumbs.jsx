import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Typography, Link } from '@material-ui/core';

const translateMeasure = (x) => {
  switch (x) {
    case 'reports':
      return 'Отчеты';
    case 'mining':
      return 'Добыча';
    case 'organizations/edit/:id':
      return 'Редактировать';
    case 'sale':
      return 'Продажа';
    case 'processing':
      return 'Переработка';
    case 'production':
      return 'Производство';
    case 'packaging':
      return 'Упаковка';
    case 'organizations':
      return 'Организации';
    case 'users':
      return 'Пользователи';
    case 'settings':
      return 'Настройка';
    case 'view':
      return 'Посмотреть';
    case 'organization-profile':
      return 'Профиль организации';
    case '/:id':
      return 'ID';
    case 'edit':
      return 'Редактировать';
    case 'add':
      return 'Добавить';
    case 'complains':
      return 'Жалобы';
    default:
      return null;
  }
};

export default function () {
  let location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label="Breadcrumb">
      {/* <Link color="inherit" component={RouterLink} to="/"></Link> */}
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="textPrimary" key={to}>
            {translateMeasure(value)}
          </Typography>
        ) : (
          <Link color="inherit" component={RouterLink} to={to} key={to}>
            {translateMeasure(value)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
