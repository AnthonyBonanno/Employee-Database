INSERT INTO department (name)
VALUES ("Hospice");

INSERT INTO role (title, salary, department_id)
VALUES ("Service", 80000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Anthony", "Bonanno", 1, NULL);