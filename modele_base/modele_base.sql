-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.9.1-beta
-- PostgreSQL version: 10.0
-- Project Site: pgmodeler.com.br
-- Model Author: ---


-- Database creation must be done outside an multicommand file.
-- These commands were put in this file only for convenience.
-- -- object: acilim | type: DATABASE --
-- -- DROP DATABASE IF EXISTS acilim;
-- CREATE DATABASE acilim
-- ;
-- -- ddl-end --
-- 

-- object: public.communes | type: TABLE --
-- DROP TABLE IF EXISTS public.communes CASCADE;
CREATE TABLE public.communes(
	code_insee varchar(5) NOT NULL,
	nom_commune varchar(254) NOT NULL,
	contours geometry(GEOMETRY, 2154) NOT NULL
);
-- ddl-end --
ALTER TABLE public.communes OWNER TO postgres;
-- ddl-end --

-- object: public.population_annee | type: TABLE --
-- DROP TABLE IF EXISTS public.population_annee CASCADE;
CREATE TABLE public.population_annee(
	code_insee varchar(5) NOT NULL,
	annee integer NOT NULL,
	population integer,
	CONSTRAINT population_annee_pk PRIMARY KEY (code_insee,annee)

);
-- ddl-end --
ALTER TABLE public.population_annee OWNER TO postgres;
-- ddl-end --

-- object: public.prixm2 | type: TABLE --
-- DROP TABLE IF EXISTS public.prixm2 CASCADE;
CREATE TABLE public.prixm2(
	code_insee varchar NOT NULL,
	prixm2 float,
	annee integer NOT NULL,
	CONSTRAINT prixm2_pk PRIMARY KEY (code_insee,annee)

);
-- ddl-end --
ALTER TABLE public.prixm2 OWNER TO postgres;
-- ddl-end --

-- object: public.constructions | type: TABLE --
-- DROP TABLE IF EXISTS public.constructions CASCADE;
CREATE TABLE public.constructions(
	code_insee varchar(5) NOT NULL,
	nombre_constructions integer NOT NULL,
	CONSTRAINT constructions_pk PRIMARY KEY (code_insee,nombre_constructions)

);
-- ddl-end --
ALTER TABLE public.constructions OWNER TO postgres;
-- ddl-end --

-- object: code_insee_fk | type: CONSTRAINT --
-- ALTER TABLE public.population_annee DROP CONSTRAINT IF EXISTS code_insee_fk CASCADE;
ALTER TABLE public.population_annee ADD CONSTRAINT code_insee_fk FOREIGN KEY (code_insee)
REFERENCES public.communes (code_insee) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: code_insee_fk | type: CONSTRAINT --
-- ALTER TABLE public.prixm2 DROP CONSTRAINT IF EXISTS code_insee_fk CASCADE;
ALTER TABLE public.prixm2 ADD CONSTRAINT code_insee_fk FOREIGN KEY (code_insee)
REFERENCES public.communes (code_insee) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --

-- object: code_insee_fk | type: CONSTRAINT --
-- ALTER TABLE public.constructions DROP CONSTRAINT IF EXISTS code_insee_fk CASCADE;
ALTER TABLE public.constructions ADD CONSTRAINT code_insee_fk FOREIGN KEY (code_insee)
REFERENCES public.communes (code_insee) MATCH FULL
ON DELETE CASCADE ON UPDATE CASCADE;
-- ddl-end --


