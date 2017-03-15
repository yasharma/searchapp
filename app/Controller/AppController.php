<?php

App::uses('Controller', 'Controller');

class AppController extends Controller {
	public $components = array('RequestHandler','Paginator');
	public function beforeFilter() {
		
	}
}
