insert into customers
(first_name, last_name, email, company)
VALUES
('Bob', 'Sagat', 'afhv.fullhouse.com', null),
('Taylor', 'Swift', 'tswift@1984.com', null),
('Gary', 'Busey', 'coke@snowball.com', null);

insert into users
(company_name, password)
VALUES
('Blockbuster', 'password');

insert into locations
(location_name)
VALUES
('Nome, AK');

insert into items
(name, sku, lead_time, wholesale, retail, stock, location_id)
VALUES
('Point Break', 'pntbrk92', '21', 3.00, 6.00, 5, 1),
('Jurassic Park', 'jurpk93', '25', 3.00, 6.00, 10, 1),
('Titanic', 'leokate97', '52', 9.00, 6.00, 15, 1),
('Clueless', 'getaclue97', '7', 1.00, 8.00, 2, 1),
('The Lion King', 'kingleo94', '19', 3.00, 6.00, 50, 1);

insert into purchases
(item_id, customer_id, location_id, purchase_date)
VALUES

(1, 1, 1, '2019-04-09');

