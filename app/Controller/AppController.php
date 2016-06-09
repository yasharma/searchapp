<?php

class AppController extends Controller {
	public $components = array('RequestHandler','Paginator');

	public function beforeFilter() {
		
	}

	/**
	 * Common function for both users and posts controllers
	 * that will returns posts and paging
	 */

	public function getPostsList($limit, $fields, $callbacks = true)
	{
		$this->paginate = array(
            'limit' => $limit,
            'fields' => $fields,
            'order' => 'id desc',
            'callbacks' => $callbacks
        );
        $posts = $this->paginate('Post');
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
