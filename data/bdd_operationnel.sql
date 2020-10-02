-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.9.1
-- PostgreSQL version: 10.0
-- Project Site: pgmodeler.io
-- Model Author: ---


-- Database creation must be done outside a multicommand file.
-- These commands were put in this file only as a convenience.
-- -- object: "BDD_operationnelle" | type: DATABASE --
-- -- DROP DATABASE IF EXISTS "BDD_operationnelle";
-- CREATE DATABASE "BDD_operationnelle";
-- -- ddl-end --
-- 

-- object: postgis | type: EXTENSION --
-- DROP EXTENSION IF EXISTS postgis CASCADE;
CREATE EXTENSION postgis;
-- ddl-end --

-- object: public.construction | type: TABLE --
-- DROP TABLE IF EXISTS public.construction CASCADE;
CREATE TABLE public.construction(
	the_geom geometry NOT NULL,
	osm_original_geom geometry NOT NULL
);
-- ddl-end --
ALTER TABLE public.construction OWNER TO postgres;
-- ddl-end --

-- object: public.communes | type: TABLE --
-- DROP TABLE IF EXISTS public.communes CASCADE;
CREATE TABLE public.communes(
	code_insee character varying(5) NOT NULL,
	nom_commune varchar NOT NULL,
	contours geometry(POLYGON) NOT NULL,
	PRIMARY KEY (code_insee)

);
-- ddl-end --
ALTER TABLE public.communes OWNER TO postgres;
-- ddl-end --

-- object: public.population | type: TABLE --
-- DROP TABLE IF EXISTS public.population CASCADE;
CREATE TABLE public.pop_annee(
	code_insee character varying(5) NOT NULL,
	annee integer NOT NULL,
	population integer NOT NULL,
	CONSTRAINT population_fk FOREIGN KEY (code_insee) REFERENCES communes(code_insee)

);
-- ddl-end --
ALTER TABLE public.pop_annee OWNER TO postgres;
-- ddl-end --

-- object: public.prix | type: TABLE --
-- DROP TABLE IF EXISTS public.prix CASCADE;
CREATE TABLE public.prixm2_ville(
	code_insee character varying(5) NOT NULL,
	annee smallint NOT NULL,
	prixm2 INTEGER NOT NULL,
	CONSTRAINT prixm2_fk FOREIGN KEY (code_insee) REFERENCES communes(code_insee)

);
-- ddl-end --
ALTER TABLE public.prixm2_ville OWNER TO postgres;


