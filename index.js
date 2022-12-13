const AM_DRIVERS = ['DY', 'EH', 'CH', 'FB', 'JB', 'JJ', 'MS', 'GC'];
let NO_REPEAT_LINK = true;
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

const noRepeatLinkInput = document.getElementById('noRepeatLinkInput');
noRepeatLinkInput.checked = true;
noRepeatLinkInput.addEventListener('click', () => {
  const { checked } = noRepeatLinkInput;
  NO_REPEAT_LINK = checked;
});

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
  simulateLoading();
  clearAssignmentTables();

  [AM_DRIVERS, PM_DRIVERS].forEach((DRIVERS) => {
    const sudokuKey = createSudoku(8);
    if (sudokuKey === undefined) {
      const errorHeading = document.createElement('h2');
      errorHeading.innerText = 'Table creation failed. Please try again.';
      routeTableContainer.appendChild(errorHeading);
      return;
    }

    const routeTable = document.createElement('table');
    const routeTableBody = document.createElement('tbody');
    const routeTableHeader = document.createElement('thead');
    const tableHeaderRow = document.createElement('tr');
    const placeholderCell = document.createElement('th');

    routeTable.className = 'table table-striped table-bordered center';
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
        const routeNameIsLink = route[0] === 'L';
        if (routeNameIsLink) {
          tableCell.classList.add('table-info');
        }
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
});

function simulateLoading() {
  const spinner = document.getElementById('loading');
  const spinnerText = document.getElementById('loading-text');

  hide(routeTableContainer);
  hide(generateRouteAssignmentsButton);
  hide(clearAssignmentButton);
  show(spinner);
  show(spinnerText);

  setTimeout(() => {
    show(routeTableContainer);
    show(generateRouteAssignmentsButton);
    show(clearAssignmentButton);
    hide(spinner);
    hide(spinnerText);
  }, 1300);
}

function createSudoku(size) {
  let masterLoopBreaker = 0;
  const BREAK_LOOP = () => masterLoopBreaker >= 100;
  let sudokuIsIncomplete = true;

  let sudoku;
  while (sudokuIsIncomplete && !BREAK_LOOP()) {
    sudoku = [];
    masterLoopBreaker++;
    let loopBreaker = 0;

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

        function findPossibleValuesForSquare(
          possibleValuesForRow,
          valuesInColumn,
          previousRoute
        ) {
          const allPossibleValues = filterArrayANotInArrayB(
            possibleValuesForRow,
            valuesInColumn
          );
          if (previousRoute === undefined) return allPossibleValues;
          if (!NO_REPEAT_LINK) return allPossibleValues;

          const previousRouteName = ROUTES[previousRoute];
          const previousRouteIsLink = previousRouteName[0] === 'L';
          if (!previousRouteIsLink) return allPossibleValues;
          const possibleValuesWithoutLinks = allPossibleValues.filter(
            (value) => {
              const routeName = ROUTES[value];
              const routeNameIsLink = routeName[0] === 'L';
              return !routeNameIsLink;
            }
          );
          return possibleValuesWithoutLinks;
        }

        const previousRoute = sudoku[rowIndex][columnIndex - 1];
        const possibleValuesForSquare = findPossibleValuesForSquare(
          possibleValuesForRow,
          valuesInColumn,
          previousRoute
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
        loopBreaker++;
        if (loopBreaker > 100) {
          break;
        }
        sudoku[rowIndex] = [];
        rowIndex--;
        continue;
      }

      if (sudoku.length === size && sudoku[size - 1].length === size) {
        sudokuIsIncomplete = false;
      }
    }
  }

  if (sudokuIsIncomplete && BREAK_LOOP()) {
    return undefined;
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

function hide(element) {
  element.setAttribute('hidden', true);
}
function show(element) {
  element.removeAttribute('hidden');
}
