const fs = require('fs');
const XLSX = require('xlsx');

// Укажи правильное название файла (если это CSV, XLSX всё равно его прочитает)
const workbook = XLSX.readFile('./СириусRon.xlsx');
const sheetName = workbook.SheetNames[0]; 
const worksheet = workbook.Sheets[sheetName];

// Конвертируем в JSON
const data = XLSX.utils.sheet_to_json(worksheet);

// НОВЫЙ СОСТАВ КОМАНДЫ
const teamMapping = { 'Трофим': 1, 'Саша Светиков': 2, 'Федор': 3, 'Паша': 4, 'Дима Панов': 5, 'Люба': 6, 'Ron': 7 };

let taskId = 196;
const tasks = [];

// Функция для безопасного поиска колонок (учитывает опечатки и регистр)
const getValue = (row, possibleKeys) => {
    const rowKeys = Object.keys(row);
    for (let key of rowKeys) {
        if (possibleKeys.includes(key.trim().toLowerCase())) {
            return row[key];
        }
    }
    return undefined;
};

data.forEach(row => {
    let rawAssignee = getValue(row, ['исполнитель']) || '';
    let assignees = [];
    Object.keys(teamMapping).forEach(name => {
        if (rawAssignee.includes(name)) assignees.push(teamMapping[name]);
    });
    if (assignees.length === 0) assignees = [null];
    
    let rawDateStart = getValue(row, ['дата когда взяли в работу', 'дата когда взята в работу']);
    let rawDateEnd = getValue(row, ['дата исполнения', 'дата выполнения']);
    
    let start = null;
    let end = null;
    
    if (rawDateStart && rawDateStart !== '-') {
        if (typeof rawDateStart === 'number') {
            const date = XLSX.SSF.parse_date_code(rawDateStart);
            start = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
        } else {
            start = String(rawDateStart);
        }
    }
    
    if (rawDateEnd && rawDateEnd !== '-') {
        if (typeof rawDateEnd === 'number') {
            const date = XLSX.SSF.parse_date_code(rawDateEnd);
            end = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
        } else {
            end = String(rawDateEnd);
        }
    }
    
    if (start === '23.01.026') start = '2026-01-23';
    
    if (start && start.includes('.')) { 
        let p = String(start).split('.'); 
        if (p.length === 3) {
            let year = p[2].length === 2 ? '20' + p[2] : p[2];
            start = `${year}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`; 
        }
    }
    
    if (end && end.includes('.')) { 
        let p = String(end).split('.'); 
        if (p.length === 3) {
            let year = p[2].length === 2 ? '20' + p[2] : p[2];
            end = `${year}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`; 
        }
    }
    
    let rawStatus = getValue(row, ['статус']) || '';
    let status = (rawStatus === '-' || !rawStatus) ? 'Будущие' : String(rawStatus).charAt(0).toUpperCase() + String(rawStatus).slice(1).toLowerCase();
    // Приводим все вариации к одному статусу "Выполнена", чтобы дашборд их понял
    if(status.includes('ыполнено') || status.includes('ыполнена')) status = 'Выполнена';
    
    let rawType = getValue(row, ['тип', 'баг']) || '';
    let type = String(rawType).toLowerCase().includes('баг') ? 'Баг' : 'Задача';
    
    let rawPriority = getValue(row, ['приритет', 'приоритет']) || ''; // Ловим опечатку "Приритет"
    let priority = 'Medium';
    let pStr = String(rawPriority).toLowerCase();
    if(pStr.includes('критич')) priority = 'Critical';
    if(pStr.includes('серьезн') || pStr.includes('высок')) priority = 'High';
    
    let title = getValue(row, ['наименование задачи', 'наименование', 'нименование']) || '';
    let description = getValue(row, ['описание']) || '';
    
    assignees.forEach(aid => {
        tasks.push({
            id: taskId++,
            title: String(title).trim(),
            description: String(description).trim(),
            assignee_id: aid,
            project: 'Сириус', // Заменил проект
            status: status, 
            type: type, 
            priority: priority, 
            start_date: start, 
            end_date: end
        });
    });
});

const output = `export const tasks2 = ${JSON.stringify(tasks, null, 2)};`;
fs.writeFileSync('./src/data7.js', output, 'utf8');
console.log('🚀 Файл data7.js успешно сгенерирован! В нем ' + tasks.length + ' задач.');