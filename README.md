# lucid-query-interface

Lucid query interface is a visual query interface developped with Angular JS 1 (frontend) and Django REST Framework (backend). PostgreSQL is used to stock users queries.

## How to install

### Lucid query interface (frontend: AngularJS 1)

+ Clone the git project: `git clone https://github.com/phamcong/lucid-query-interface.git`
+ Move into project folder:  `cd lucid-query-interface`
+ Ensure that [npm](https://www.npmjs.com/get-npm) and [bower](https://bower.io/) are installed.
+ Install packages: `npm install`
+ Run: `npm start` and open the query interface at `http://localhost:8000`

### PostgreSQL (backend: Django REST Framework)

+ Clone the git project: `git clone https://github.com/phamcong/lucid-backend.git`
+ Move into project folder: `cd lucid-backend`
+ Make sure that [python 3](https://www.python.org/downloads/), [virtualenv](https://virtualenv.pypa.io/en/stable/installation/) are installed.
+ Create a new virtualenv: `virtualenv env` (on MacOs)
+ Activate virtual environment: `source env/bin/activate` (on MacOs)
+ Install requirements: pip intall -r requirements.txt
+ Move into backend folder: `cd lucicBackend`
+ Migrate database: `python manage.py migrate`
+ Create super user: `python manage.py createsuperuser`
+ Run server at post 8080: `python manage.py runserver 8080`