<?php
App::uses('AppController', 'Controller');

class PostsController extends AppController {

	public $components = array('RequestHandler','Paginator');

	public function index() {
		$this->Post->recursive = 0;
        $this->paginate = array(
            'limit' => 10,
            'fields' => array('id', 'title', 'image','created'),
            'order' => 'id desc'
        );
        $posts = $this->paginate('Post');
        if( empty($this->request->params['paging']['Post']) ){
            $paging = false;
        } else {
            $paging = $this->request->params['paging']['Post'];
        }
        $this->set('posts', $posts);
        $this->set('paging', $paging);
		$this->set('_serialize' , array('posts', 'paging') );
	}
	public function view($id) {
        $post = $this->Post->findById($id);
        $this->set(array(
            'post' => $post,
            '_serialize' => array('post')
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
}
