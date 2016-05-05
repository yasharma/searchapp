<?php
class DATABASE_CONFIG {

	public $test = array(
		'datasource' => 'Database/Mysql',
		'persistent' => false,
		'host' => 'localhost',
		'login' => 'user',
		'password' => 'password',
		'database' => 'test_database_name',
	);
	public $default = array(
		'datasource' => 'Database/Mysql',
		'persistent' => false,
		'host' => 'localhost',
		'login' => 'root',
		'password' => '123456',
		'database' => 'blog',
		'prefix' => '',
		//'encoding' => 'utf8',
	);

	public $staging = array(
		'datasource' => 'Database/Postgres',
		'persistent' => false,
		'host' => 'ec2-107-20-174-127.compute-1.amazonaws.com',
		'login' => 'pdkdllunnozuhi',
		'port' => 5432,
		'password' => 'EXiP5hQ7xnq65XFPzLfiDAZaaL',
		'database' => 'dcakquvk3fak85',
		'prefix' => '',
		//'encoding' => 'utf8'
	);

	public function __construct()
	{
		if(isset($_SERVER) && isset($_SERVER['SERVER_NAME'])){
			if( $_SERVER['SERVER_NAME'] == 'peerblog.herokuapp.com' ){
				echo 'From If';die;
				$this->default = $this->staging;
			} else {
				echo 'From else';die;
			}
		}
	}
}
