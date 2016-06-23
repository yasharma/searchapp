<?php
App::uses('AppController', 'Controller');

class PostsController extends AppController {

    public function beforeFilter() {
        $this->SecurityToken->unlockedActions = array('index','view');
        $this->Auth->allow();
    }

	public function index() {
        $this->getList('Post', 10, array('id', 'title', 'status','image','image_url','created'), array('Post.status' => 1));
	}
    
	public function view($id) {
        $post = $this->Post->findById($id);
        $this->set(array(
            'record' => $post,
            '_serialize' => array('record')
        ));
    }

	public function add() {
        $data = $this->request->data['Post'];
        $newData['Post'] = json_decode($data, true);
		if ($this->Post->save($newData)) {
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

    public function count()
    {
        $posts = $this->Post->find('count');
        $this->set(array(
            'records' => $posts,
            '_serialize' => array('records')
        ));
    }
}
