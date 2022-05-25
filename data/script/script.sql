create database skatepark;

create table skaters (
	id serial,
	email varchar(50) not null,
	nombre varchar(25) not null,
	password varchar(25) not null,
	anos_experiencia int not null,
	especialidad varchar(50) not null,
	foto varchar(255) not null,
	estado boolean not null
);

insert into skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) values 
	('tonyhawk@skate.com', 'Tony Hawk', 'password', 12, 'Kickflip', 'tony.jpg', true),
	('evelienbouilliart@skate.com', 'Evelien Bouilliart', 'password', 10, 'Heelflip', 'Evelien.jpg', true),
	('dannyway@skate.com', 'Danny Way', 'password', 8, 'Ollie', 'Danny.jpg', false);