const inquirer = require("inquirer");
// const fs = require("fs");
const path = require("path");
const { title } = require("process");
const db = require("./lib/dbClass");
require("console.table");

const responses = [];

const starterPrompts = [
  {
    type: "list",
    name: "pageLoad",
    message: "Select an action from the options below (use arrow keys)",
    choices: [
      "View All Employees",
      "Add an Employee",
      "Update an Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Exit",
    ],
  },
];

const menu = () => {
  inquirer.prompt(starterPrompts).then(({ pageLoad }) => {
    if (pageLoad == "View All Employees") {
      viewAllEmployees();
    } else if (pageLoad == "Add an Employee") {
      addNewEmployee();
    } else {
      endProgram();
    }
  });
};

const addEmployee = [
  {
    type: "input",
    name: "firstName",
    message: "What is the employee's first name?",
  },
  {
    type: "input",
    name: "lastName",
    message: "What is the employee's last name?",
  },
  //   {
  //     type: "list",
  //     name: "empRole",
  //     message: "What is the employee's role?",
  //     choices: ["Sales Team Lead", "Sales Representative", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead"],
  //   },
  //   {
  //     type: "list",
  //     name: "empManager",
  //     choices: ["None", ""],
  //   },
];

// const addRole = [
//   {
//     type: "input",
//     name: "roleName",
//     message: "What is the name of the role?",
//   },
//   {
//     type: "input",
//     name: "roleSalary",
//     message: "What is the salary of the role?",
//   },
//   {
//     type: "list",
//     name: "roleDept",
//     message: "What department does the role belong to?",
//     choices: ["Engineering", "Finance", "Legal", "Sales"],
//   },
// ];

const viewAllEmployees = () => {
  db.promise()
    .query(
      `
    SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    title, 
    salary, name AS department,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN role
    ON employee.role_id = role.id
    JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee AS manager
    ON employee.manager_id = manager.id;
  `
    )
    .then((response) => {
      console.table(response[0]);
      menu();
    });
};

const addNewEmployee = () => {
  db.promise()
    .query("SELECT * FROM employee;")
    .then((resp) => {
      const questionsToAsk = addEmployee;
      const managerOptions = resp[0].map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));
      db.promise()
        .query("SELECT * FROM role;")
        .then((roleResp) => {
          const roleOptions = roleResp[0].map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          managerOptions.push({
            name: "None",
            value: null,
          });

          questionsToAsk.push({
            type: "list",
            name: "empRole",
            message: "What is the employee's role?",
            choices: roleOptions,
          });
          questionsToAsk.push({
            type: "list",
            name: "managerSelect",
            message: "Who is the manager of this employee?",
            choices: managerOptions,
          });

          inquirer.prompt(questionsToAsk).then(({ firstName, lastName, empRole, managerSelect }) => {
            console.log(firstName, lastName, empRole, managerSelect);

            db.promise()
              .query(
                `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES
                    ('${firstName}', '${lastName}', ${empRole}, ${managerSelect ? managerSelect : "NULL"});
                `
              )
              .then((resp) => {
                console.log(resp);

                db.promise()
                  .query("SELECT * FROM employee;")
                  .then((resp) => {
                    console.table(resp[0]);
                    menu();
                  });
              });
          });
        });
    });
};

const endProgram = () => {
  process.exit();
};

menu();
