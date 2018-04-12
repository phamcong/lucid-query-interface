## LUCID Query Interface installation on Windows
### Install or upgrade Node JS:
+ Go to [nodejs](https://nodejs.org/en/), download and install lastest version of node.
+ Check node version: `node --version`
+ Check node path: `where node`
+ (optional) Upgrade npm to lastest version: Run PowerShell as Administrator
    + `npm install -g npm-windows-upgrade`
    + `npm-windows-upgrade`

### Lucid query interface architecture:



#### VAQUERO Query interface: Angular JS 1 (frontend) - Django REST Framework (Backend)
##### Angular JS 1 (frontend)
+ Clone project code from github: `git clone https://github.com/phamcong/lucid-query-interface.git`
+ Go to project folder: `cd lucid-query-interface`
+ Install npm packages: `npm install` (select 4th option to install **angular#1.5.11**)
+ Copy (or replace) following packages into *app/bower-components* folder: 
    + [d3](https://drive.google.com/open?id=1YJI3YsGPoRam87-_CruJbWcxe5pT20hr), 
    + [rzslider](https://drive.google.com/open?id=1k870LtGOwCx_Er6Ttq1gXL9MmX7h5lf6), 
    + [file-saver](https://drive.google.com/open?id=1-tGq7MP5WldHS1HevKtOKYm5a76lO6p_)
+ Copy [data](https://drive.google.com/open?id=120m17w2Um6fd60RzxghVwcpNzPS_qmkC) folder into project folder.
+ Run query interface: `npm start`

#### AllegroGraph (Database)
+ Install python and virtualenv: Go to [conda](https://conda.io/docs/user-guide/install/windows.html) download and install lastest version of conda (with python 3.6, 64bit)
+ Clone project code from github: `git clone https://github.com/phamcong/lucid-backend.git`
+ Go to project folder: `cd lucid-backend`
+ Create a new virtualenv: `virtualenv venv`
+ Activate virtualenv: `venv\Scripts\activate`
+ Install dependencies: `pip install -r requirements.txt`
