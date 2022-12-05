--  You might also want to include a seeds.sql file to pre-populate your database, making the development of individual features much easier.

INSERT INTO department (name)
VALUES 
('Engineering'), ('Finance'), ('Legal'), ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES 
('Sales Team Lead', 60000, 4), 
('Sales Representative', 50000, 4), 
('Lead Engineer', 140000, 1), 
('Software Engineer', 100000, 1), 
('Account Manager', 70000, 2), 
('Accountant', 90000, 2), 
('Legal Team Lead', 110000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Bob', 'Sponge', 3, NULL),
('Sandy', 'Cheeks', 4, 1),
('Patrick', 'Star', 5, 1);
