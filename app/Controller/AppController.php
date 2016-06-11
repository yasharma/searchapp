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
	 * Common function for both users and posts controllers
	 * that will returns posts and paging
	 */

	public function getPostsList($limit, $fields, $condition = array(), $callbacks = true)
	{
		$this->paginate = array(
            'limit' => $limit,
            'fields' => $fields,
            'order' => 'id desc',
            'callbacks' => $callbacks
        );
        $posts = $this->paginate('Post', $condition);
        if( empty($this->request->params['paging']['Post']) ){
            $paging = false;
        } else {
            $paging = $this->request->params['paging']['Post'];
        }
		$this->set(array(
			'posts'=> $posts,
			'paging'=> $paging,
			'_serialize' => array('posts', 'paging') 
		));
	}
}
