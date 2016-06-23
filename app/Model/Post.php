<?php
App::uses('AppModel', 'Model');
/**
 * Post Model
 *
 */
class Post extends AppModel {

	protected $_image;

	public $belongsTo = array(
        'Category' => array(
        	'className' => 'Category',
			'foreignKey' => 'categories_id',
            'counterCache' => true,
        )
    );

	public function afterFind($results, $primary = false) {
	    foreach ($results as $key => $val) {
	        if (isset($val['Post']['created'])) {
	            $results[$key]['Post']['created'] = CakeTime::timeAgoInWords($val['Post']['created'], 
	            	array('format' => 'F jS, Y', 'end' => '+3 week')
	            );
	        }
	    }
	    return $results;
	}

	public function beforeSave($options = array()) {
        if (isset($this->data['Post']['created']) && isset($this->data['Post']['id'])) {
            unset($this->data['Post']['created'] );
        }
	    if(!empty($_FILES['file']['name'])){
	    	$this->data['Post']['image'] = $this->_uploadFile($_FILES['file']);
	    	$this->data['Post']['image_url'] = null;
	    }
	    if(!empty($this->data['Post']['category']['id'])){
	    	$this->data['Post']['categories_id'] = $this->data['Post']['category']['id'];
	    }

	    if(!empty($this->data['Post']['image_url'])){
	    	$this->beforeDelete();
	    	$this->afterDelete();
	    	$this->data['Post']['image'] = null;
		}
	    return true;
	}

	public function beforeDelete($cascade = true)
	{
		$this->_image = $this->field('image');
		return true;
	}

	public function afterDelete()
	{
		if( !empty($this->_image) ){
			$path = IMAGES . 'posts_images' . DS . $this->_image;
			if( file_exists($path) ){
				return unlink($path);
			}
		}
		return false;
	}

	protected function _uploadFile($_file){
		$destination = IMAGES.'posts_images'. DS;
		$ext = pathinfo($_file['name'], PATHINFO_EXTENSION);
		$safe_filename = rand(1000,10000000).time().'.'.$ext;
		if(move_uploaded_file($_file['tmp_name'], $destination.$safe_filename)){
			return $safe_filename;
		}
		return false;
	}


}
