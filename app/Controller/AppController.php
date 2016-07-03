<?php

class AppController extends Controller {

	public $components = array(
		'RequestHandler',
		'Paginator',
		'SecurityToken' => array(
			'csrfUseOnce' => false,
			'unlockedActions' => array('login')
		),
		'Auth' => array(
			'loginRedirect' => array(
                'controller' => 'users',
                'action' => 'index',
                'ext' => 'json'
            ),
            'loginAction' => array(
            	'controller' => 'users',
                'action' => 'login',
                'ext' => 'json'
            ),
	        'authenticate' => array(
	            'Form' => array(
	            	'passwordHasher' => 'Blowfish',
	                'fields' => array(
	                  'username' => 'email'
	                )
	            )
	        )
	    )
	);

	public function beforeFilter() {
		
	}

	/**
	 * Common function for both users, categories and posts controllers
	 * that will returns data and paging
	 */

	public function getList($model, $limit, $fields, $condition = array(), $contain = false, $callbacks = true)
	{
		$this->paginate = array(
            'limit' => $limit,
            'fields' => $fields,
            'order' => "$model.id desc",
            'contain' => $contain,
            'callbacks' => $callbacks
        );

        $results = $this->paginate($model, $condition);
        if( empty($this->request->params['paging'][$model]) ){
            $paging = false;
        } else {
            $paging = $this->request->params['paging'][$model];
        }
       
		return array(
			'results' => $results,
			'paging' => $paging
		);
	}
}
