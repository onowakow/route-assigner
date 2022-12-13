const AM_DRIVERS = ['DY', 'EH', 'CH', 'FB', 'JB', 'JJ', 'MS', 'GC'];
AM_DRIVERS.sort((a, b) => a.localeCompare(b));
const PM_DRIVERS = ['NA', 'ON', 'CG', 'JL', 'JS', 'AF', 'ZB', '(ALT)'];
PM_DRIVERS.sort((a, b) => a.localeCompare(b));
const DRIVERS = AM_DRIVERS;
const ROUTES = [
  'Exp 1',
  'Exp 2',
  'Exp 3',
  'Exp 4',
  'Exp 5',
  'Link 1',
  'Link 2',
  'Link 3',
];

const routeTableContainer = document.getElementById('routeTableContainer');
const generateRouteAssignmentsButton = document.getElementById(
  'generateRouteAssignmentButton'
);
const clearAssignmentButton = document.getElementById('clearAssignmentButton');
clearAssignmentButton.addEventListener('click', () => {
  clearAssignmentTables();
  resetGenerateRouteAssignmentButton();
  clearAssignmentButton.setAttribute('hidden', true);
});

generateRouteAssignmentsButton.addEventListener('click', () => {
  clearAssignmentTables();

  [AM_DRIVERS, PM_DRIVERS].forEach((DRIVERS) => {
    const sudokuKey = createSudoku(8);

    const routeTable = document.createElement('table');
    routeTable.className = 'table table-striped table-bordered center';
    const routeTableBody = document.createElement('tbody');
    const routeTableHeader = document.createElement('thead');

    const tableHeaderRow = document.createElement('tr');
    const placeholderCell = document.createElement('th');
    placeholderCell.innerText = 'Driver';
    tableHeaderRow.appendChild(placeholderCell);
    for (let col = 0; col < sudokuKey[0].length; col++) {
      const tableHeader = document.createElement('th');
      tableHeader.innerText = `Rotation ${col + 1}`;
      tableHeaderRow.appendChild(tableHeader);
    }
    routeTableHeader.appendChild(tableHeaderRow);
    routeTable.appendChild(routeTableHeader);

    sudokuKey.forEach((row, rowIndex) => {
      const tableRow = document.createElement('tr');
      row.forEach((cell, cellIndex) => {
        if (cellIndex === 0) {
          const tableCell = document.createElement('td');
          const driver = DRIVERS[rowIndex];
          tableCell.innerText = driver;
          tableRow.appendChild(tableCell);
        }
        const tableCell = document.createElement('td');
        const route = ROUTES[cell];
        tableCell.innerText = route;

        tableRow.appendChild(tableCell);
      });
      routeTableBody.appendChild(tableRow);
    });

    routeTable.appendChild(routeTableBody);
    routeTableContainer.appendChild(routeTable);
  });
  generateRouteAssignmentsButton.classList.replace(
    'btn-primary',
    'btn-warning'
  );
  generateRouteAssignmentsButton.innerText = 'Regenerate Route Assignments';
  clearAssignmentButton.removeAttribute('hidden');
});

function createSudoku(size) {
  const sudoku = [];

  for (let row = 0; row < size; row++) {
    sudoku.push([]);
  }

  const initialArray = [];
  for (let i = 0; i < size; i++) {
    initialArray.push(i);
  }

  for (/**Each row */ let rowIndex = 0; rowIndex < size; rowIndex++) {
    for (
      /**Each square in row */ let columnIndex = 0;
      columnIndex < size;
      columnIndex++
    ) {
      const valuesInRow = sudoku[rowIndex];
      const possibleValuesForRow = filterArrayANotInArrayB(
        initialArray,
        valuesInRow
      );

      const valuesInColumn = sudoku.map((row) => {
        return row[columnIndex];
      });
      const possibleValuesForSquare = filterArrayANotInArrayB(
        possibleValuesForRow,
        valuesInColumn
      );
      if (possibleValuesForSquare.length === 0) {
        break;
      }
      const randomValueIndex = Math.floor(
        Math.random() * possibleValuesForSquare.length
      );
      const randomValue = possibleValuesForSquare[randomValueIndex];
      sudoku[rowIndex].push(randomValue);
    }
    if (sudoku[rowIndex].length < size) {
      sudoku[rowIndex] = [];
      rowIndex--;
      continue;
    }
  }
  return sudoku;
}

function filterArrayANotInArrayB(arrayA, arrayB) {
  return arrayA.filter((item) => {
    const index = arrayB.indexOf(item);
    if (index === -1) {
      return true;
    }
    return false;
  });
}

function clearAssignmentTables() {
  routeTableContainer.innerHTML = '';
}

function resetGenerateRouteAssignmentButton() {
  generateRouteAssignmentsButton.classList.replace(
    'btn-warning',
    'btn-primary'
  );
  generateRouteAssignmentsButton.innerText = 'Generate Route Assignments';
}
