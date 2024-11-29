CREATE TABLE IF NOT EXISTS status_log (
    time TIMESTAMPTZ NOT NULL,
    service text
    data JSON DEFAULT '{}'
);
SELECT create_hypertable('mqtt_log','time');

ALTER TABLE mqtt_log SET (timescaledb.compress,
   timescaledb.compress_orderby = 'time DESC',
   timescaledb.compress_segmentby = 'topic'
);

SELECT add_compression_policy('mqtt_log', compress_after => INTERVAL '60d');
SELECT add_retention_policy('mqtt_log', INTERVAL '6 months');

CREATE INDEX IF NOT EXISTS idx_status_log_time_service ON status_log (service, time DESC);

-- CREATE INDEX IF NOT EXISTS idx_mqtt_log_topic ON mqtt_log (topic, time DESC);
-- ALTER TABLE mqtt_log
-- ADD COLUMN time_1hr     TIMESTAMPTZ GENERATED ALWAYS AS (date_bin('1 hours',    time AT TIME ZONE 'UTC', '2000-01-01 00:00:00+00')) STORED,
-- ADD COLUMN time_30min   TIMESTAMPTZ GENERATED ALWAYS AS (date_bin('30 minutes', time AT TIME ZONE 'UTC', '2000-01-01 00:00:00+00')) STORED,
-- ADD COLUMN time_15min   TIMESTAMPTZ GENERATED ALWAYS AS (date_bin('15 minutes', time AT TIME ZONE 'UTC', '2000-01-01 00:00:00+00')) STORED,
-- ADD COLUMN time_1min    TIMESTAMPTZ GENERATED ALWAYS AS (date_bin('1 minutes',  time AT TIME ZONE 'UTC', '2000-01-01 00:00:00+00')) STORED,
-- ADD COLUMN time_1sec    TIMESTAMPTZ GENERATED ALWAYS AS (date_bin('1 seconds',  time AT TIME ZONE 'UTC', '2000-01-01 00:00:00+00')) STORED;

-- CREATE INDEX IF NOT EXISTS idx_mqtt_log_time_1hr_topic_asc      ON mqtt_log(topic, time_1hr ASC);
-- CREATE INDEX IF NOT EXISTS idx_mqtt_log_time_1hr_topic_desc     ON mqtt_log(topic, time_1hr DESC);
-- CREATE INDEX IF NOT EXISTS idx_mqtt_log_time_30min_topic_asc    ON mqtt_log(topic, time_30min ASC);
-- CREATE INDEX IF NOT EXISTS idx_mqtt_log_time_30min_topic_desc   ON mqtt_log(topic, time_30min DESC);
-- CREATE INDEX IF NOT EXISTS idx_mqtt_log_time_15min_topic_asc    ON mqtt_log(topic, time_15min ASC);
-- CREATE INDEX IF NOT EXISTS idx_mqtt_log_time_15min_topic_desc   ON mqtt_log(topic, time_15min DESC);
-- CREATE INDEX IF NOT EXISTS idx_mqtt_log_time_1min_topic_asc     ON mqtt_log(topic, time_1min ASC);
-- CREATE INDEX IF NOT EXISTS idx_mqtt_log_time_1min_topic_desc    ON mqtt_log(topic, time_1min DESC);
-- CREATE INDEX IF NOT EXISTS idx_mqtt_log_time_1sec_topic_asc     ON mqtt_log(topic, time_1sec ASC);
-- CREATE INDEX IF NOT EXISTS idx_mqtt_log_time_1sec_topic_desc    ON mqtt_log(topic, time_1sec DESC);


