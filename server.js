const inquirer = require("inquirer");
const mysql = require("mysql2");

// Connect to employee_db database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "password",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database!`)
);

// This const stores one prompt that has 7 choices the user has to choose from
const prompt = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "prompt",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
    ],
  },
];

function viewEmployee() {
  db.query(
    `SELECT employee.id
    ,employee.first_name
    ,employee.last_name
    ,role.title
    ,department.name AS department
    ,role.salary
    ,CONCAT(manager.first_name, manager.last_name) AS manager
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id;`,
    function (err, results) {
      console.log("");
      console.log("==============================================");
      console.log("              VIEWING ALL EMPLOYEES");
      console.log("==============================================");
      console.table(results);
      console.log("==============================================");
    }
  );

  init();
}

function addEmployee() {
  const employeePrompt = [
    {
      type: "input",
      message: "What is the first name of this employee?",
      name: "firstName",
    },
    {
      type: "input",
      message: "What is the last name of this employee?",
      name: "lastName",
    },
  ];

  db.query("SELECT * FROM role", function (err, res) {
    // Turn Array of DATA into Array of OBJECTS that inquirer expects for its choices
    const roleChoices = res.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });

    employeePrompt.push({
      type: "list",
      message: "What is the role of this employee?",
      name: "employeeRole",
      choices: roleChoices,
    });

    db.query("SELECT * FROM employee;", function (err, res) {
      // Turn Array of DATA into Array of OBJECTS that inquirer expects for its choices
      const managerChoices = res.map((manager) => {
        return {
          name: manager.first_name + ' ' + manager.last_name,
          value: manager.id,
        };
      });

      employeePrompt.push({
        type: "list",
        message: "Who is the manager of this employee?",
        name: "managerName",
        choices: managerChoices,
      });

      inquirer.prompt(employeePrompt).then((answers) => {
        db.query(
          `INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUES (?, ?, ?, ?)`,
          [answers.firstName, answers.lastName, answers.employeeRole, answers.managerName],
          (err, res) => {
            if (err) {
              throw err;
            }
            console.log(
              `${answers.firstName} ${answers.lastName} has been added to the database!`
            );

            init();
          }
        );
      });
    });
  });
}

function updateEmployeeRole() {
  db.query("SELECT * FROM employee", (err, employees) => {
    if (err) throw err;

    const employeeChoices = employees.map((employee) => ({
      name: employee.first_name + ' ' + employee.last_name,
      value: employee.id,
    }));

    db.query("SELECT * FROM role", (err, roles) => {
      if (err) throw err;

      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            message: "Select the employee whose role you want to update:",
            name: "employeeId",
            choices: employeeChoices,
          },
          {
            type: "list",
            message: "Select the new role for the employee:",
            name: "roleId",
            choices: roleChoices,
          },
        ])
        .then((answers) => {
          db.query(
            `UPDATE employee SET role_id = ? WHERE id = ?`,
            [answers.roleId, answers.employeeId],
            (err, res) => {
              if (err) throw err;
              console.log("Employee role has been updated!");
              init();
            }
          );
        });
    });
  });
}

function viewRoles() {
  db.query(
    "SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.id = department.id;",
    function (err, results) {
      console.log("");
      console.log("==============================================");
      console.log("              VIEWING ALL ROLES");
      console.log("==============================================");
      console.table(results);
      console.log("==============================================");
    }
  );

  init();
}

function addRole() {
  const rolePrompt = [
    {
      type: "input",
      message: "What is the name of this role?",
      name: "roleName",
    },
    {
      type: "input",
      message: "What is the salary of this role?",
      name: "roleSalary",
    },
  ];

  db.query("SELECT * FROM department", function (err, res) {
    // Turn Array of DATA into Array of OBJECTS that inquirer expects for its choices
    const departmentChoices = res.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });

    rolePrompt.push({
      type: "list",
      message: "What department does this role belong to?",
      name: "departmentRole",
      choices: departmentChoices,
    });

    inquirer.prompt(rolePrompt).then((answers) => {
      db.query(
        `INSERT INTO role (title, salary, department_id)
        VALUES (?, ?, ?)`,
        [answers.roleName, answers.roleSalary, answers.departmentRole],
        (err, res) => {
          if (err) {
            throw err;
          }
          console.log(`${answers.roleName} has been added to the database!`);

          init();
        }
      );
    });
  });
}

function viewDepartment() {
  db.query(
    "SELECT department.id, department.name FROM department;",
    function (err, results) {
      console.log("");
      console.log("==============================================");
      console.log("              VIEWING ALL DEPARTMENTS");
      console.log("==============================================");
      console.table(results);
      console.log("==============================================");
    }
  );

  init();
}

function addDepartment() {
  const departmentPrompt = [
    {
      type: "input",
      message: "What is the name of this department?",
      name: "departmentName",
    },
  ];

  inquirer.prompt(departmentPrompt).then((answers) => {
    db.query(
      `INSERT INTO department (name)
            VALUES (?)`,
            [answers.departmentName],
      (err, res) => {
        if (err) {
          throw err;
        }
        console.log(
          `${answers.departmentName} has been added to the database!`
        );

        init();
      }
    );
  });
}

// Function to initialize app
function init() {
  /* The line below stores the prompt that the user will see */
  inquirer
    .prompt(prompt)

    .then((answers) => {
      // Using user feedback from .prompt to process what the user wants to see in the command line
      switch (answers.prompt) {
        case "View All Employees":
          viewEmployee();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "Add Role":
          addRole();
          break;

        case "View All Departments":
          viewDepartment();
          break;

        case "Add Department":
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
