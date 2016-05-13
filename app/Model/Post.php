<?php
App::uses('AppModel', 'Model');
App::uses('CakeTime','Utility');
/**
 * Post Model
 *
 */
class Post extends AppModel {
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
	    }
	    return true;
	}

	public function dateFormatAfterFind($dateString, $format = 'Y-m-d') {
	    return date($format, strtotime($dateString));
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
