create table customers (
    id serial primary key,
    first_name varchar(200),
    last_name varchar(200),
    email varchar(200),
    company varchar(300)
);

create table users (
    id serial primary key,
    company_email varchar(200),
    password varchar(500),
    first_name varchar(200),
    last_name varchar(200)
);
create table locations (
    id serial primary key,
    location_name varchar(500)
);

create table items (
    id serial primary key,
    name varchar(200),
    sku varchar(200),
    lead_time integer,
    wholesale money,
    retail money,
    stock integer,
    simulated_stock integer,
    location_id integer references locations(id),
    user_id integer
);

create table purchases (
    id serial primary key,
    item_id integer references items(id),
    customer_id integer references customers(id),
    location_id integer references locations(id),
    purchase_date date

);

