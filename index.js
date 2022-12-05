//Imports

const inquirer = require("inquirer");
const path = require("path");
const { title } = require("process");
const db = require("./lib/dbClass");
require("console.table");

//Storing the responses in an empty array

const responses = [];

//Creating a variable with the prompts to start the program

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

const viewAllDepts = () => {
  db.promise()
    .query(`SELECT * FROM department`)
    .then((response) => {
      console.table(response[0]);
      menu();
    });
};

const viewAllRoles = () => {
  //   db.promise()
  //     .query(
  //       `SELECT role.id, role.title, role.salary, department.name AS 'department_name' FROM role
  // LEFT JOIN department ON department.id = role.department_id;`
  //     )
  //     .then((err, result) => {
  //       if (err) console.log(err);
  //       console.table(result[0]);
  //     });
  db.query(
    `SELECT role.id, role.title, role.salary, department.name AS 'department_name' FROM role 
LEFT JOIN department ON department.id = role.department_id;`,
    (err, result) => {
      if (err) console.log(err);
      console.table(result);
      menu();
    }
  );
};

const updateEmpRole = () => {
  db.promise()
    .query("SELECT * FROM role")
    .then((roles) => {
      //   console.log(roles);
      let role_id = roles[0].map((role) => {
        return role.id;
      });
      db.promise()
        .query("SELECT * FROM employee")
        .then((employees) => {
          let employee_name = employees[0].map((employee) => {
            return employee.first_name;
          });
          console.log(role_id);
          console.log(employee_name);
          let updateRoleQuestions = [
            {
              type: "list",
              name: "selected_employee",
              message: "Select the employee you would like to update the role for.",
              choices: employee_name,
            },
            {
              type: "list",
              name: "updated_role",
              message: "Select the new role.",
              choices: role_id,
            },
          ];

          inquirer.prompt(updateRoleQuestions).then((result) => {
            console.log(result);
            let updateQuery = `UPDATE employee SET role_id = ${result.updated_role} WHERE first_name = '${result.selected_employee}'`;
            db.promise()
              .query(updateQuery)
              .then((err, result) => {
                if (err) console.log(err);
                // console.log(result);
                menu();
              });
          });
        });
    });
};

//Run a function for each selectable item in the menu

const menu = () => {
  inquirer.prompt(starterPrompts).then(({ pageLoad }) => {
    if (pageLoad == "View All Employees") {
      viewAllEmployees();
    } else if (pageLoad == "Add an Employee") {
      addNewEmployee();
    } else if (pageLoad == "View All Roles") {
      viewAllRoles();
    } else if (pageLoad == "Update an Employee Role") {
      updateEmpRole();
    } else if (pageLoad == "View All Departments") {
      viewAllDepts();
    } else {
      endProgram();
    }
  });
};

//Prompts for adding an employee

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
  //   message: "Who is the employee's manager?",
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

//The query() method takes an SQL string and it returns a Promise object. The promise will be “resolved” when the query finished executing. The returned rows will be the result of the promise. In case of an error, the promise will be “rejected”.

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

// Run a function when Add Employee is selected

const addNewEmployee = () => {
  db.promise()
    .query("SELECT * FROM employee;")
    .then((resp) => {
      const questionsToAsk = addEmployee; // ?
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

// Function to quit the program

const endProgram = () => {
  process.exit();
};

// Calling the menu function to display starter prompts
menu();
