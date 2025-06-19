-- Seed data for Enterprise Data Management System

-- Insert sample books
INSERT INTO books (isbn, title, author, publisher, publication_year, category, total_copies, available_copies, location) VALUES
('978-0134685991', 'Effective Java', 'Joshua Bloch', 'Addison-Wesley', 2017, 'Programming', 5, 5, 'Tech Library - Section A'),
('978-0596009205', 'Head First Design Patterns', 'Eric Freeman', 'O''Reilly Media', 2004, 'Programming', 3, 3, 'Tech Library - Section A'),
('978-0321356680', 'Effective C++', 'Scott Meyers', 'Addison-Wesley', 2005, 'Programming', 4, 4, 'Tech Library - Section A'),
('978-0134494166', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, 'Programming', 6, 6, 'Tech Library - Section B'),
('978-0201633610', 'Design Patterns', 'Gang of Four', 'Addison-Wesley', 1994, 'Programming', 2, 2, 'Tech Library - Section B'),
('978-0132350884', 'Clean Architecture', 'Robert C. Martin', 'Prentice Hall', 2017, 'Architecture', 3, 3, 'Tech Library - Section C'),
('978-1449373320', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'O''Reilly Media', 2017, 'Database', 4, 4, 'Tech Library - Section D'),
('978-0321125215', 'Domain-Driven Design', 'Eric Evans', 'Addison-Wesley', 2003, 'Architecture', 2, 2, 'Tech Library - Section C'),
('978-0134757599', 'Refactoring', 'Martin Fowler', 'Addison-Wesley', 2018, 'Programming', 3, 3, 'Tech Library - Section B'),
('978-0596517748', 'JavaScript: The Good Parts', 'Douglas Crockford', 'O''Reilly Media', 2008, 'Programming', 4, 4, 'Tech Library - Section A');

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role, department, employee_id) VALUES
('admin', 'admin@company.com', '$2b$10$rQZ8kHWKtGY5uFJ4uFJ4uOJ4uFJ4uFJ4uFJ4uFJ4uFJ4uFJ4uFJ4u', 'System', 'Administrator', 'admin', 'IT', 'EMP001');

-- Insert sample librarian user (password: librarian123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role, department, employee_id) VALUES
('librarian', 'librarian@company.com', '$2b$10$rQZ8kHWKtGY5uFJ4uFJ4uOJ4uFJ4uFJ4uFJ4uFJ4uFJ4uFJ4uFJ4u', 'Jane', 'Smith', 'librarian', 'Library', 'EMP002');

-- Insert sample regular users
INSERT INTO users (username, email, password_hash, first_name, last_name, role, department, employee_id) VALUES
('jdoe', 'john.doe@company.com', '$2b$10$rQZ8kHWKtGY5uFJ4uFJ4uOJ4uFJ4uFJ4uFJ4uFJ4uFJ4uFJ4uFJ4u', 'John', 'Doe', 'user', 'Engineering', 'EMP003'),
('asmith', 'alice.smith@company.com', '$2b$10$rQZ8kHWKtGY5uFJ4uFJ4uOJ4uFJ4uFJ4uFJ4uFJ4uFJ4uFJ4uFJ4u', 'Alice', 'Smith', 'user', 'Marketing', 'EMP004'),
('bwilson', 'bob.wilson@company.com', '$2b$10$rQZ8kHWKtGY5uFJ4uFJ4uOJ4uFJ4uFJ4uFJ4uFJ4uFJ4uFJ4uFJ4u', 'Bob', 'Wilson', 'user', 'Sales', 'EMP005');
