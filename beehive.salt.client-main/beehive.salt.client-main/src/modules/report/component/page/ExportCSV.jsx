import React from 'react';

import * as FileSaver from 'file-saver';
import { makeStyles } from '@material-ui/core/styles';
import * as XLSX from 'xlsx';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Button } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  exportBtn: {
    height: '40px',
   
    marginLeft: theme.spacing(90),
    fontSize: '18px',
  },
}));
export const ExportCSV = ({ csvData, fileName }) => {
  const classes = useStyles();
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  const fileExtension = '.xlsx';

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);

    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button
      startIcon={<GetAppIcon fontSize="18px" />}
      onClick={(e) => exportToCSV(csvData, fileName)}
      className={classes.exportBtn}
    >
      Экспорт
    </Button>
  );
};
