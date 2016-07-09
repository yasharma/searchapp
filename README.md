# CakePHP and AngularJS
Simple blog application using cakephp as REST API and angularJS as frontend, basically this is a starter website for cakephp developers who wants to use angular for his projects. you can scale this as much as you want like posts comments, posts tags, user logins etc. I developed this project for learning purpose of angular but scale it little by adding admin panel and [socket.io](http://socket.io/), later the same will be created using [MEAN STACK](https://mean.io).  

checkout the working demo on heroku: http://peerblog.herokuapp.com

## Usage

#### 1. Clone this repository (in the command line)

```bash
git clone git@github.com:yasharma/peerblog.git
cd peerblog
```

#### 2. You need [bower](https://bower.io/) to install all css and js files in bower.json using  (in the command line)

```bash
bower install
```

#### 3. You need [npm (Node package manager)](https://www.npmjs.com/) to install all the node package in package.json

##### we will use Grunt packages for minification as well as linting of js and css files

```bash
npm install
```

#### 4. Migrate the database schema (app/Config/Schema/schema.php) using cake shell (in the command lne)

##### You can also directly import the blog.sql file (app/Config/Schema/blog.sql) in phpmyadmin 

```bash
Console/cake schema create
```
###### More info on schema migration can found [here](http://book.cakephp.org/2.0/en/console-and-shells/schema-management-and-migrations.html)

5. ```Run Grunt command line and point your browser lik http://localhost/peerblog/index.html or anyhow you setup```
Now grunt will watch your files for changes and everytime file is saved after changes grunt will run tasks defined in ```Gruntfile.js```

6. Admin can accessed with http://blog.dev/admin.html or http://localhost/peerblog/admin.html by default a user will created when you first hit this url http://locahost/peerblog/users.json or http://blog.dev/users.json with post request without any parameters it will create default user with email ```admin@peerblog.dev``` and password ```admin```

**NOTE:** During development i had use nginx server and nginx server block you can get to know how to setup Nginx Server Blocks ([Virtual Hosts](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-14-04-lts)) on Ubuntu however application can be run on either apache or nginx. I've also included my server block .conf file (blog.dev) if you need some reference after creating server blocks. after setup same you can access your application as (http://blog.dev)

Because we are using cakephp as REST API so you can also directly check the json response using (http://blog.dev/posts.json)

#### Features
1. Frontend design is developed using [bootstrap theme](http://startbootstrap.com/template-overviews/blog-home/)
2. Admin panel to manage posts and categories has used [AdminLTE](https://almsaeedstudio.com/preview)
3. Most challenging part is manage security where server sessions cannot be used in views as in php, after user login in admin panel using CakePHP ```AuthComponent``` users session has been created however angular is not aware about server sessions, so we have to check session in each request, so to automate his feature we leverage CakePHP  ```SecurityComponent```.
4. Token based authentication using ```SecurityComponent``` and extends to create custom ```SecurityTokenComponent```. Token will travel in headers and validate with server token with each request and if not match or temperated user will logout automatically.
5. localstorage on angular side to save user data and pass user token in header by Angular ```Interceptor```.
6. Real time posts can be updated using [```Socket.io```](http://socket.io/), although i've commented the code because not running on heroku but you can uncomment the code first uncomment ```socketio``` service in ```services.js``` file then uncomment the socketio code in ```controllers.js```  file after injecting service. after doing this you need to start node server ```Run node server.js ``` in command line

Contribution
------------
Contribution are always **welcome and recommended**! Here is how:

- Fork the repository ([here is the guide](https://help.github.com/articles/fork-a-repo/)).
- Clone to your machine ```git clone git@github.com:yasharma/peerblog.git```
- Make your changes
- Create a pull request

## License

This project is licensed under the [GNU General Public License](https://opensource.org/licenses/GPL-3.0).
