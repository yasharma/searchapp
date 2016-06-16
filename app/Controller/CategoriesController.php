<?php
App::uses('AppController', 'Controller');

class CategoriesController extends AppController {

	public function index() {
		$this->getList('Category', 20, array('id', 'name', 'status','created','post_count'), [],false);
	}

	public function view($id = null) {
		$category = $this->Category->findById($id);
        $this->set(array(
            'record' => $category,
            '_serialize' => array('record')
        ));
	}

	public function add() {
		if ($this->request->is('post')) {
			$result = $this->Category->saveManyCategories($this->request->data);
			if($result === true){
				$message = array(
				    'text' => __('Category saved successfully'),
				    'type' => 'success'
				);
			} else {
				$message = array(
				    'text' => 'Category '.substr($result[2], 16,-15).' Already exist',
				    'type' => 'error'
				);
			}
			$this->set(array(
			    'message' => $message,
			    '_serialize' => array('message')
			));
		}
	}

	public function edit($id = null) {
		$this->Category->id = $id;
		if ($this->request->is(array('post', 'put'))) {
			try{
				$this->Category->save($this->request->data);
				$message = array(
				    'text' => __('Category updated successfully'),
				    'type' => 'success'
				);
			}catch(Exception $e){
				$message = array(
				    'text' => 'Category '.substr($e->errorInfo[2], 16,-15).' Already exist',
				    'type' => 'error'
				);
			}
			
			$this->set(array(
			    'message' => $message,
			    '_serialize' => array('message')
			));
		}
	}

	public function delete($id = null) {
		$this->request->allowMethod('post', 'delete');
		$this->Category->id = $id;
		if ($this->Category->delete()) {
			$message = array(
			    'text' => __('Category deleted successfully'),
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
