-- gymnast_troop_troop_id
alter table gymnast_troop_troop_id drop foreign key fk_1cd6ace6b244df1293b2f31b24c;

-- alter table gymnast_troop_troop_id drop foreign key fk_28fcfed250a8381d4e53432fb22;

-- gymnast_team_team_id
-- alter table gymnast_team_team_id drop foreign key fk_5f584c2a932b898b7609b4a2c6e;


alter table gymnast_team_team_id drop foreign key fk_9077dcc9ec4dfc5603e529e0333;

-- team_disciplines_discipline_id
-- alter table team_disciplines_discipline_id drop foreign key fk_2960026f49db747524f27039b90;
alter table team_disciplines_discipline_id drop foreign key fk_b266402660192b88d5d6a011313;

-- team_divisions_division_id
-- alter table team_divisions_division_id drop foreign key fk_7022b67aae61a7dab0df094549e;

alter table team_divisions_division_id drop foreign key fk_f14bd7364ebf1f33f2085cd39f8;

alter table tournament_lodging_gymnast drop foreign key fk_3f7b344909c5e0650b131e595bf;

alter table tournament_transport_gymnast drop foreign key fk_b030a0bf8f330592098ba159346;

alter table tournament_banquet_gymnast drop foreign key fk_21569f9fd5e1933d4f35ec0748a;