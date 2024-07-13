drop table if exists reviews;

create table reviews (
	id serial primary key,
	name text  not null,
	review text,
	isbn bigint unique not null,
	stars integer
);

insert into reviews (name, isbn, stars,review) values ('Romeo and Juliet',9781497438095,4,'"Romeo and Juliet" is a timeless classic with beautifully crafted language and an engaging, tragic love story that still resonates today. However, the archaic language can be challenging to understand, and the plot sometimes feels overly dramatic, which is why I’m giving it 4 stars.');