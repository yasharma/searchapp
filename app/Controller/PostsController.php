<?php
App::uses('AppController', 'Controller');

class PostsController extends AppController {

	public $components = array('RequestHandler');
	public function index() {
		$this->Post->recursive = 0;
		$posts = $this->Post->find('all');
		$this->set(array(
			'posts' => $posts,
			'_serialize' => array('posts') 
		));
	}
	public function view($id) {
        $post = $this->Post->findById($id);
        $this->set(array(
            'post' => $post,
            '_serialize' => array('post')
        ));
    }

	public function add() {
		if ($this->Post->save($this->request->data)) {
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

	public function edit($id) {
        $this->Post->id = $id;
        if ($this->Post->save($this->request->data)) {
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

	public function delete($id) {
        if ($this->Post->delete($id)) {
            $message = array(
                'text' => __('Deleted'),
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
}
