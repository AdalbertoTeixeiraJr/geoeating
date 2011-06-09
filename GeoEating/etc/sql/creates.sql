CREATE TABLE Restaurant(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255),
	qtt_waiting INTEGER,
	description VARCHAR(255),
	tel BIGINT,
	end_web VARCHAR(255)
);

SELECT  AddGeometryColumn('restaurant','geom',4326,'POINT',2);

CREATE TABLE FoodKind(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255)
);

CREATE TABLE RestaurantFoodKind(
	id_restaurant INTEGER,
	id_foodkind INTEGER,
	PRIMARY KEY (id_restaurant,id_foodkind),
	FOREIGN KEY (id_restaurant) REFERENCES Restaurant(id),
	FOREIGN KEY (id_foodkind) REFERENCES FoodKind(id)
);

CREATE TABLE History(
	id_restaurant INTEGER,
	date TIMESTAMP,
	qtt INTEGER,
	PRIMARY KEY(id_restaurant,date),
	FOREIGN KEY (id_restaurant) REFERENCES Restaurant(id)
);

CREATE TABLE GeoUser(
	id SERIAL PRIMARY KEY,
	name VARCHAR(255),
	age INTEGER,
	username VARCHAR(255),
	passwd VARCHAR(255)
);

CREATE OR REPLACE VIEW FoodKindGeom AS 
SELECT DISTINCT r.id, rfk.id_foodkind, buffer(geom,0.005)
FROM restaurant r 
	INNER JOIN restaurantfoodkind rfk ON r.id = rfk.id_restaurant 
GROUP BY r.id,rfk.id_foodkind,r.geom;

CREATE OR REPLACE VIEW MovimentedRestaurant AS 
SELECT DISTINCT r.id, CAST(AVG(h.qtt) AS DOUBLE PRECISION) AS average,geom
FROM restaurant r 
	INNER JOIN history h ON r.id = h.id_restaurant 
GROUP BY r.id,r.geom
ORDER BY average DESC;

CREATE OR REPLACE VIEW RestaurantNoWait AS
SELECT DISTINCT r.id, r.geom
FROM restaurant r 
WHERE r.qtt_waiting = 0;

CREATE OR REPLACE VIEW FoodKindRestaurants AS
SELECT DISTINCT r.id, rfk.id_foodkind, geom
FROM restaurant r 
	INNER JOIN restaurantfoodkind rfk ON r.id = rfk.id_restaurant 
GROUP BY r.id,rfk.id_foodkind,r.geom;

CREATE OR REPLACE VIEW Top20Area AS
SELECT DISTINCT r.id, buffer(r.geom,0.005)
FROM restaurant r 
WHERE r.id IN (SELECT mv.id FROM MovimentedRestaurant mv
ORDER BY mv.average DESC LIMIT 20);

CREATE OR REPLACE VIEW AllRestaurants AS
SELECT r.name, r.qtt_waiting, r.description, r.tel, r.end_web, r.geom, fk.name AS fkname
FROM restaurant r, foodkind fk, restaurantfoodkind rfk
WHERE r.id = rfk.id_restaurant AND fk.id = rfk.id_foodkind
GROUP BY r.name, r.qtt_waiting, r.description, r.tel, r.end_web, r.geom, fkname