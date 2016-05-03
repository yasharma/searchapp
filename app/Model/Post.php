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
	            $results[$key]['Post']['created'] = CakeTime::timeAgoInWords($val['Post']['created']);
	        }
	    }
	    return $results;
	}

	public function beforeSave($options = array()) {
	    
        if (isset($this->data['Post']['created']) && isset($this->data['Post']['id'])) {
            unset($this->data['Post']['created'] );
        }
	    
	    return true;
	}

	public function dateFormatAfterFind($dateString, $format = 'Y-m-d') {
	    return date($format, strtotime($dateString));
	}
}
