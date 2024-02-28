const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to employee_db database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'password',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database!`)
);

// This const stores one prompt that has 7 choices the user has to choose from
const prompt = [{
    type: 'list',
    message: 'What would you like to do?',
    name: 'prompt',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
}];

function viewEmployee() {
    db.query(`SELECT employee.id
    ,employee.first_name
    ,employee.last_name
    ,role.title
    ,department.name AS department
    ,role.salary
    ,CONCAT(manager.first_name, manager.last_name) AS manager
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id;`, function (err, results) {
        console.table(results);
    });

    init();
}

function addEmployee() {

    const employeePrompt = [{
        type: 'input',
        message: 'What is the first name of this employee?',
        name: 'firstName'
    },
    {
        type: 'input',
        message: 'What is the last name of this employee?',
        name: 'lastName'
    },
];

    db.query('SELECT role.title, role.id FROM role', function (err, res) {
        // Turn Array of DATA into Array of OBJECTS that inquirer expects for its choices
        const roleChoices = res.map((role) => {
            return {
                name: role.title,
                value: role.id,
            }
        });
        
        employeePrompt.push({
            type: 'list',
            message: 'What is the role of this employee?',
            name: 'employeeRole',
            choices: roleChoices
        });

        db.query('SELECT employee.first_name, employee.last_name, employee.id FROM employee;', function (err, res) {
            // Turn Array of DATA into Array of OBJECTS that inquirer expects for its choices
            const managerChoices = res.map((manager) => {
                return {
                    name: manager.first_name,
                    value: manager.id,
                }
            });

            employeePrompt.push({
                type: 'list',
                message: 'Who is the manager of this employee?',
                name: 'managerName',
                choices: managerChoices
            });

            inquirer.prompt(employeePrompt)
            .then((answers) => {
                db.query(
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES ("${answers.firstName.replaceAll(" ", "_")}", "${answers.lastName.replaceAll(" ", "_")}", ${answers.employeeRole}, ${answers.managerName});`,
                    (err, res) => {
                        if (err) {
                            throw err;
                        } 
                        console.log(`${answers.firstName} ${answers.lastName} has been added to the database!`)

                        init();
                    }
                )
            })
        })
    })
}


function updateEmployeeRole() {
    db.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, (err, res) => {
        if (err) {
            throw err;
        }

        init();
    })
}

function viewRoles() {
    db.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.id = department.id;', function (err, results) {
        console.table(results);
    });

    init();
}

function addRole() {
    db.query('')

    const rolePrompt = [{
        type: 'input',
        message: 'What is the name of this role?',
        name: 'roleName'
    },
    {
        type: 'input',
        message: 'What is the salary of this role?',
        name: 'roleSalary'
    },
    {
        type: 'input',
        message: 'Which department does this role belong to?',
        name: 'roleDepartment'
    }];
}

function viewDepartment() {
    db.query('SELECT department.id, department.name FROM department;', function (err, results) {
        console.table(results);
    });

    init();
}

function addDepartment() {
    db.query('')

    const rolePrompt = [{
        type: 'input',
        message: 'What is the name of this role?',
        name: 'roleName'
    },
    {
        type: 'input',
        message: 'What is the salary of this role?',
        name: 'roleSalary'
    },
    {
        type: 'input',
        message: 'Which department does this role belong to?',
        name: 'roleDepartment'
    }];

}


// Function to initialize app
function init() {
    /* The line below stores the prompt that the user will see */
    inquirer.prompt(prompt)

        .then((answers) => {
            // Using user feedback from .prompt to process what the user wants to see in the command line
            switch (answers.prompt) {

                case 'View All Employees':
                    viewEmployee();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;

                case 'View All Roles':
                    viewRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'View All Departments':
                    viewDepartment();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

            }
        })
        .catch((error) => {
            // Prompt couldn't be rendered in the current environment
            if (error.isTtyError) {
            } else {
                // Something else went wrong
            }
        });
    }

// Function call to initialize app
init();
