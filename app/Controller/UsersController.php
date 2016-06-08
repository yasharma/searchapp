<?php
App::uses('AppController', 'Controller');

class UsersController extends AppController {

	public $uses = array('User','Post');
	public $components = array(
		'RequestHandler',
		'Paginator',
        'Flash',
        'Security' => array(
        	'csrfUseOnce' => false,
        	'unlockedActions' => array('login')
        ),
        'Auth' => array(
            'loginAction' => array(
                'controller' => 'users',
                'action' => 'login',
                'ext' => 'json'
            ),
            'authenticate' => array(
                'Form' => array(
                	'fields' => array('username' => 'email'),
                    'passwordHasher' => 'Blowfish'
                )
            )
        )
    );

    public function beforeFilter() {
        $this->Auth->allow('index', 'login');
    }

    public function _setResponseToken(){
    	if(isset($this->request->params['_Token'])){
    		$this->response->header(array('token' => $this->request->params['_Token']['key']));
    	}
    }

    public function login() {
    	if($this->request->is('post')){
	        if ($this->Auth->login()) {
	        	$this->_setResponseToken();
	            $message = array(
			        'text' => __('Success'),
			        'type' => 'success'
			    );
			    $user = $this->Auth->user();
	        } else {
	        	$message = array(
			        'text' => __('Invalid username or password, try again'),
			        'type' => 'error'
			    );
			    $user = null;
	        }
    	}
        
		$this->set(array(
		    'message' => $message,
		    'user' => $user,
		    '_serialize' => array('message','user')
		));
    }

    public function logout() {
        if($this->Auth->logout()){
        	$this->set(array(
        	    'message' => array('type' => 'success', 'text' => 'logout successfully'),
        	    '_serialize' => array('message')
        	));
        }
    }

	public function index() {
		$post = $this->Post->find('count');
		$this->set(array(
		    'post' => $post,
		    '_serialize' => array('post')
		));
	}

	public function view($id = null) {
		if (!$this->User->exists($id)) {
			throw new NotFoundException(__('Invalid user'));
		}
		$options = array('conditions' => array('User.' . $this->User->primaryKey => $id));
		$this->set('user', $this->User->find('first', $options));
	}

	public function add() {
		if ($this->User->save($this->request->data)) {
			$message = array(
		        'text' => __('Saved'),
		        'type' => 'success'
		    );
		} else {
			$message = array(
		        'text' => __('Error'),
		        'type' => 'error'
		    );
		}
		$this->set(array(
		    'message' => $message,
		    '_serialize' => array('message')
		));
	}

	public function edit($id = null) {
		if (!$this->User->exists($id)) {
			throw new NotFoundException(__('Invalid user'));
		}
		if ($this->request->is(array('post', 'put'))) {
			if ($this->User->save($this->request->data)) {
				return $this->flash(__('The user has been saved.'), array('action' => 'index'));
			}
		} else {
			$options = array('conditions' => array('User.' . $this->User->primaryKey => $id));
			$this->request->data = $this->User->find('first', $options);
		}
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
}
