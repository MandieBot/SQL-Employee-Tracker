const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

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
    ],
  },
];

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
  {
    type: "list",
    name: "empRole",
    message: "What is the employee's role?",
    choices: ["Sales Team Lead", "Sales Representative", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead"],
  },
  {
    type: "list",
    name: "empManager",
    choices: ["None", ""],
  },
];

const addRole = [
  {
    type: "input",
    name: "roleName",
    message: "What is the name of the role?",
  },
  {
    type: "input",
    name: "roleSalary",
    message: "What is the salary of the role?",
  },
  {
    type: "list",
    name: "roleDept",
    message: "What department does the role belong to?",
    choices: ["Engineering", "Finance", "Legal", "Sales"],
  },
];
