# Web app 'sprzęt budowlany'

The application allows to:
- Browsing the rental offer
- Self-rental of equipment by the client
- data management from the panel for employees

## run via docker
In terminal run
```
cp .env.example .env
docker compose up -d
```
In laravel conteiner run
```
composer i
php artisan migrate --seed
php artisan key:generate
php artisan storage:link
```
Then restart the laravel container
