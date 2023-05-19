/* *************** Users *************** */
CREATE TABLE "public"."users" (
    "name" character varying(16) NOT NULL,
    "password" character varying(64) NOT NULL,
    "role" character varying(8) NOT NULL,
    CONSTRAINT "pk_user" PRIMARY KEY ("name")
) WITH (oids = false);

/* ************* Favorites ************* */
CREATE TABLE "public"."favorites" (
    "user" character varying(16) NOT NULL,
    "id" character varying(64) NOT NULL,
    "type" character varying(16) NOT NULL
) WITH (oids = false);

ALTER TABLE ONLY "public"."favorites" ADD CONSTRAINT "favorites_user_fkey" FOREIGN KEY ("user") REFERENCES users(name) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
