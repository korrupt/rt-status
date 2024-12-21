CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TABLE IF NOT EXISTS device (
    id uuid DEFAULT uuid_generate_v4(),
    slug character varying NOT NULL COLLATE pg_catalog."default",
    name character varying NOT NULL COLLATE pg_catalog."default",
    description character varying COLLATE pg_catalog."default",
    location GEOGRAPHY(Point),

    CONSTRAINT "PK_DEVICE_ID" PRIMARY KEY (id),
    CONSTRAINT "UQ_DEVICE_SLUG" UNIQUE (slug)
);


CREATE TABLE IF NOT EXISTS watcher (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    slug character varying NOT NULL COLLATE pg_catalog."default",
    name character varying NOT NULL COLLATE pg_catalog."default",
    description character varying COLLATE pg_catalog."default",

    device_id uuid NOT NULL,

    CONSTRAINT "PK_WATCHER" PRIMARY KEY (id),
    CONSTRAINT "UQ_WATCHER_SLUG" UNIQUE (device_id, slug),
    CONSTRAINT "FK_WATCHER_DEVICE" FOREIGN KEY (device_id)
        REFERENCES public."device" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS watcher_heartbeat (
    time TIMESTAMPTZ NOT NULL,
    watcher_id uuid NOT NULL,
    status TEXT NOT NULL,
    type TEXT NOT NULl,
    metadata JSONB DEFAULT '{}',

    CONSTRAINT "FK_WATCHER_HEARTBEAT_WATCHER" FOREIGN KEY (watcher_id)
        REFERENCES public.watcher (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "PK_WATCHER_HEARTBEAT" PRIMARY KEY (time, watcher_id)
);

CREATE INDEX IF NOT EXISTS IDX_WATCHER_HEARTBEAT_TIME_WATCHER_ID ON watcher_heartbeat (watcher_id, time DESC);

CREATE TABLE IF NOT EXISTS watcher_log (
    time TIMESTAMPTZ NOT NULL,
    watcher_id uuid NOT NULL,
    severity TEXT NOT NULL,
    scope TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',

    CONSTRAINT "FK_WATCHER_LOG_WATCHER" FOREIGN KEY (watcher_id)
        REFERENCES public.watcher (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "PK_WATCHER_LOG" PRIMARY KEY (time, watcher_id)
);

CREATE INDEX IF NOT EXISTS IDX_WATCHER_LOG_TIME_WATCHER_ID ON watcher_heartbeat (watcher_id, time DESC);




-- CREATE TABLE IF NOT EXISTS domain (
--     id uuid DEFAULT uuid_generate_v4(),
--     slug character varying NOT NULL COLLATE pg_catalog."default",
--     name character varying NOT NULL collate pg_catalog."default",
--     description character varying NOT NULL COLLATE pg_catalog."default",

--     CONSTRAINT "PK_DOMAIN_ID" PRIMARY KEY (id),
--     CONSTRAINT "UQ_DOMAIN_SLUG" UNIQUE (slug)
-- );

-- CREATE TABLE IF NOT EXISTS domain_device (
--     domain_id uuid NOT NULL,
--     device_id uuid NOT NULL,

--     slug character varying COLLATE pg_catalog."default",

--     CONSTRAINT "FK_DOMAIN_DEVICE_DOMAIN" FOREIGN KEY (domain_id)
--         REFERENCES public."domain" (id)
--         ON UPDATE NO ACTION
--         ON DELETE CASCADE,
    
--     CONSTRAINT "FK_DOMAIN_DEVICE_DEVICE" FOREIGN KEY (device_id)
--         REFERENCES public."device" (id)
--         ON UPDATE NO ACTION
--         ON DELETE CASCADE,

--     CONSTRAINT "UQ_DOMAIN_DEVICE_SLUG" UNIQUE (domain_id, slug)
-- );


-- CREATE TABLE IF NOT EXISTS DOMAIN_DEVICE_WATCHER (
--     domain_id uuid NOT NULL,
--     device_id uuid NOT NULL,
--     watcher_id uuid NOT NULL,

--     slug character varying NOT NULL,

--     CONSTRAINT "FK_DOMAIN_DEVICE_WATCHER_DOMAIN" FOREIGN KEY (domain_id)
--         REFERENCES public."domain" (id) MATCH SIMPLE
--         ON UPDATE NO ACTION
--         ON DELETE CASCADE,

--     CONSTRAINT "FK_DOMAIN_DEVICE_WATCHER_DEVICE" FOREIGN KEY (device_id)
--         REFERENCES public."device" (id) MATCH SIMPLE
--         ON UPDATE NO ACTION
--         ON DELETE CASCADE,

--     CONSTRAINT "FK_DOMAIN_DEVICE_WATCHER_WATCHER" FOREIGN KEY (watcher_id)
--         REFERENCES public."watcher" (id) MATCH SIMPLE
--         ON UPDATE NO ACTION
--         ON DELETE CASCADE,

--     CONSTRAINT "PK_DOMAIN_DEVICE_WATCHER" PRIMARY KEY (domain_id, device_id, watcher_id),
--     CONSTRAINT "UQ_DOMAIN_DEVICE_WATCHER_SLUG" UNIQUE (domain_id, device_id, watcher_id, slug)
-- );



SELECT create_hypertable('watcher_heartbeat','time');

ALTER TABLE watcher_heartbeat SET (timescaledb.compress,
   timescaledb.compress_orderby = 'time DESC',
   timescaledb.compress_segmentby = 'watcher_id'
);

SELECT add_compression_policy('watcher_heartbeat', compress_after => INTERVAL '60d');
SELECT add_retention_policy('watcher_heartbeat', INTERVAL '6 months');
