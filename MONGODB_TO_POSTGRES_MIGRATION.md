# MongoDB to PostgreSQL migration

The backend now uses Spring Data JPA with PostgreSQL. MongoDB is no longer required by the application.

## 1. Start PostgreSQL

```powershell
docker compose up -d postgres redis
```

The default local connection is `jdbc:postgresql://localhost:5432/golden_pearl_db` with user `anand` and password `secret`. Set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` for another database.

## 2. Create the PostgreSQL schema

Start the backend once with `spring.jpa.hibernate.ddl-auto=update`. Hibernate creates the tables and collection tables. Stop the backend after the health endpoint is available.

For production, replace `ddl-auto=update` with a reviewed SQL/Flyway migration before deploying.

## 3. Copy the data

Install the migration script dependencies:

```powershell
python -m pip install pymongo psycopg2-binary
```

Run the script from `backend`:

```powershell
$env:MONGO_URI = "mongodb://anand:secret@localhost:27017/golden_pearl_db?authSource=admin"
$env:PGPASSWORD = "secret"
python .\scripts\migrate_mongodb_to_postgres.py
```

The script preserves Mongo `_id` values, copies `users`, `tournaments`, `reviews`, and `leaderboard`, and recreates user/review array values in PostgreSQL join tables. It is safe to rerun for the main rows because inserts use `ON CONFLICT DO NOTHING`; array tables are replaced for each migrated user/review.

## 4. Verify before cutover

Check row counts in PostgreSQL against MongoDB, then exercise registration, login, tournament CRUD, reviews, and leaderboard endpoints. Keep the MongoDB backup until this verification is complete.

The PostgreSQL schema does not persist `Tournament.leaderBoard`; leaderboard membership remains represented by `leaderboard.tournament_id`, which matches how the services query it today.
