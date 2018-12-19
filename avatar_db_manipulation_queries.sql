-- Name: Artem Slivka
-- Date: 05/23/18
--
-- These are some Database Manipulation queries for a Project Website using the
-- Avatar database.
-- Your submission should contain ALL the queries required to implement ALL the
-- functionalities listed in the Website Functionality Rubric.


--Characters page
-- Get all characters and their attributes including nation and organization name for List Characters page table
SELECT ac.char_id, ac.name, ac.gender, atla_nation.name AS nationality, ac.age, atla_org.title AS membership 
FROM atla_characters AS ac
LEFT JOIN atla_nation ON ac.nationality = atla_nation.nation_id 
LEFT JOIN atla_org ON atla_org.org_id = ac.membership

-- get all nation Ids and Names to populate Nationality dropdown
SELECT nation_id, name FROM atla_nation

--get all organization IDs and names to populate Membership dropdown
SELECT org_id, title FROM atla_org

-- get a single character's data for Update Character page
SELECT char_id, name, gender, nationality, age, membership FROM atla_characters 
WHERE char_id = [character_ID_selected_from_list_characters page]

-- add a new character 
INSERT INTO atla_characters (name, gender, nationality, age, membership) VALUES ([name_input,gender_input, nationality_ID_from_dropdown_input, ageInput, membership_ID_from_dropdown_input)

-- delete a character 
DELETE FROM atla_characters WHERE char_id = [character_ID_selected_from_list_characters page]

-- update a character on the Update Character page (1-N relationship addition for nationality, membership possible)
UPDATE atla_characters SET name=[nameInput], nationality=[nation_id_selected_from_dropdown], gender=[genderInput], age=[ageInput], membership=[organization_id_selected_from_dropdown_input] 
WHERE char_id=[character_ID_from_update_char_page]


--Nations page
--get all nations and their attributes for List Nations page
SELECT nation_id, name, government, population, location, capital FROM atla_nation

--add a new nation 
INSERT INTO atla_nation (name, government, population, location, capital) VALUES ([nameInput], [governmentInput], [populationInput], [location_selected_from_dropdown_input], [capitalInput])

--delete a nation 
DELETE FROM atla_nation WHERE nation_id = [nation_id_selected_from_list_nations_page]


--Organizations page
--get all organizations and their attributes for List Organizations page
SELECT org_id, title, purpose, status, influence FROM atla_org

--add new organization
INSERT INTO atla_org (title, purpose, status, influence) VALUES ([titleInput], [purposeInput], [status_selected_from_dropdown_input], [influence_level_selected_from_dropdown_input])

--delete organization
DELETE FROM atla_org WHERE org_id = [organization_id_selected_from_list_organizations_page]


--Cities page
--get all cites and their attributes to display on List Cities page
SELECT c.city_id, c.name, c.population, n.name AS nation, n.nation_id FROM atla_cities AS c 
LEFT JOIN atla_nation AS n ON n.nation_id = c.nation

--add a new city 
INSERT INTO atla_cities (name, population, nation) VALUES ([nameInput], [populationInput],[nation_id_selected_from dropdown_input])

--delete a city 
DELETE FROM atla_cities WHERE city_id = [city_id_selected_from_list_cities_page]


--Bending page
--get all bending types and their attributes for List Bending page
SELECT bend_id, type, rarity, source, learned_from FROM atla_bending

--add new bending type 
INSERT INTO atla_bending (type, rarity, source, learned_from) VALUES ([typeInput], [rarityInput], [sourceInput], [learned_from_input])

--delete bending type 
DELETE FROM atla_bending WHERE bend_id = [bend_id_selected_from_list_bending_page]


--Benders page
--get all bending types and ids to populate Bending dropdown
SELECT bend_id, type FROM atla_bending

--get all character names and ids to populate Character dropdown
SELECT char_id, name FROM atla_characters

--get all characters/benders and their bending types 
SELECT ch.name, bending.type, benders.char_id, benders.bend_id 
FROM atla_characters AS ch 
INNER JOIN atla_benders AS benders ON benders.char_id = ch.char_id 
INNER JOIN atla_bending AS bending ON bending.bend_id = benders.bend_id ORDER BY ch.name ASC 

--associate a character/bender with a bending (N-M relationship addition)
INSERT INTO atla_benders (char_id, bend_id) VALUES ([char_id_selected_from_dropdown_input], [bend_id_selected_from_dropdown_input])

--deassociate a character/bender with a bending(N-M relationship deletion)
DELETE FROM atla_benders WHERE char_id = [character_id_selected_from_list_benders_page] AND bend_id = [bending_id_selected_from_list_benders_page]

--update a character's bending type on Update Bender page
UPDATE atla_benders SET bend_id=[bending_id_selected_from_dropdown_input]
WHERE char_id=[character_id_selected_from_list_benders_page] AND bend_id=[bending_id_selected_from_list_benders_page]


--Filter characters by nationality, age page
--get all nation names and ids to populate Nationality dropdown
SELECT nation_id, name FROM atla_nation

--filter characters by nationality, include other attributes for populating a more complete table for display
SELECT ac.char_id, ac.name, ac.gender, atla_nation.name AS nation_name, ac.nationality, ac.age, atla_org.title AS membership 
FROM atla_characters AS ac
LEFT JOIN atla_nation ON ac.nationality = atla_nation.nation_id
LEFT JOIN atla_org ON atla_org.org_id = ac.membership 
WHERE ac.nationality = [nation_id_selected_from_dropdown_input]

--filter characters by age (at most having that age), include other data for populating a more complete table for display
SELECT ac.char_id, ac.name, ac.gender, atla_nation.name AS nation_name, ac.nationality, ac.age, atla_org.title AS membership 
FROM atla_characters AS ac
LEFT JOIN atla_nation ON ac.nationality = atla_nation.nation_id
LEFT JOIN atla_org ON atla_org.org_id = ac.membership 
WHERE ac.age <= [ageinput]
