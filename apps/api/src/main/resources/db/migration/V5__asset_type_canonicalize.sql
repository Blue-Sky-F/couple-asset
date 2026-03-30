UPDATE assets SET type = 'BANK' WHERE UPPER(type) = 'CASH';
UPDATE assets SET type = 'STOCK' WHERE UPPER(type) = 'ESOP';

