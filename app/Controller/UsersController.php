<?php
App::uses('AppController', 'Controller');

class UsersController extends AppController {

	public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('login','checklogin');
    }

    public function isAuthorized($user) {
        // Admin can access every action
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // Default deny
        return false;
    }

    public function checklogin()
    {
    	if($this->Auth->loggedIn()){
    		$result = array(
    			'user' => true,
    			'type' => 'success'
    		);
    	} else {
    		$result = array(
    			'user' => false,
    			'type' => 'error'
    		);
    	}
    	$this->set(array(
    	    'User' => $result,
    	    '_serialize' => array('User')
    	));
    }

	public function index() {
        
	}

	public function login()
	{
		if ($this->request->is('post')) {
	        if ($this->Auth->login()) {
	        	if( isset($this->request->params['_Token']) ){
	        		$this->response->header(array('token' => $this->request->params['_Token']['key']));	
	        	}
	        	$message = array(
	        		'text' => __('Login success'),
	        		'type' => 'success'
	        	);
	        	$user = $this->Auth->user();

	        } else {
	        	$message = array(
	        	    'text' => __('Email or password is incorrect'),
	        	    'type' => 'error'
	        	);
	        	$user = null;
	        }
	        
	        $this->set(array(
	            'message' => $message,
	            'user' => $user,
	            '_serialize' => array('message','user')
	        ));
	    }
	}

	public function logout() {
	    $this->Auth->logout();
	    $this->set(array(
	        'message' => array('text' => 'Logout Successfully', 'type' => 'success'),
	        '_serialize' => array('message')
	    ));
	}

	public function view($id = null) {
		$user = $this->User->findById($id);
        $this->set(array(
            'record' => $user,
            '_serialize' => array('record')
        ));
	}

	public function add() {
		if ($this->request->is('post')) {
			$this->User->create();
			if ($this->User->save($this->request->data)) {
				return $this->flash(__('The user has been saved.'), array('action' => 'index'));
			}
		}
	}

	public function edit($id = null) {
		if (!$this->User->exists($id)) {
			throw new NotFoundException(__('Invalid user'));
		}
		if ($this->request->is(array('post', 'put'))) {
			if ($this->User->save($this->request->data)) {
				$message = array(
	                'text' => __('Account information updated successfully'),
	                'type' => 'success'
	            );
			}
		} else {
			$message = array(
                'text' => __('Error on saving data'),
                'type' => 'error'
            );
		}
		$this->set(array(
            'message' => $message,
            '_serialize' => array('message','user')
        ));
	}

	public function delete($id = null) {
		$this->User->id = $id; 
		if (!$this->User->exists()) {
			throw new NotFoundException(__('Invalid user'));
		}
		$this->request->allowMethod('post', 'delete');
		if ($this->User->delete()) {
			return $this->flash(__('The user has been deleted.'), array('action' => 'index'));
		} else {
			return $this->flash(__('The user could not be deleted. Please, try again.'), array('action' => 'index'));
		}
	}

	public function change_password()
	{
		if( !empty($this->request->data) ){
			if($this->User->checkPassword($this->request->data['user'])){
				$message = array('type' => 'success', 'text' => 'Password has changed successfully');
			} else {
				$message = array('type' => 'error', 'text' => 'Current password not matched');
			}

			$this->set(array(
	            'message' => $message,
	            '_serialize' => array('message')
	        ));
		}
	}

	public function posts_list()
	{
		$this->loadModel('Post');
		$this->getList('Post', 20, array('id', 'title', 'status','created'), [],false);	
	}	
}
