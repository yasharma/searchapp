<?php
App::uses('AppModel', 'Model');
App::uses('BlowfishPasswordHasher', 'Controller/Component/Auth');

class User extends AppModel {

	public function beforeSave($options = array()) {
	    if (isset($this->data[$this->alias]['password'])) {
	        $passwordHasher = new BlowfishPasswordHasher();
	        $this->data[$this->alias]['password'] = $passwordHasher->hash(
	            $this->data[$this->alias]['password']
	        );
	    }

	    if (isset($this->data[$this->alias]['created']) && isset($this->data[$this->alias]['id'])) {
            unset($this->data[$this->alias]['created'], $this->data[$this->alias]['email'] );
        }
	    $this->data[$this->alias]['role'] = 'admin';
	    return true;
	}

	public function afterFind($results, $primary = false) {
	    foreach ($results as $key => $val) {
	        if (isset($val['User']['created'])) {
	            $results[$key]['User']['created'] = CakeTime::format($val['User']['created'], '%b, %Y');
	        }
	    }
	    return $results;
	}

	public function checkPassword($data)
	{
		$this->id = $data['id'];
		$passwordHasher = new BlowfishPasswordHasher();
		if( $passwordHasher->check($data['currentpassword'], $this->field('password')) ){
			$this->saveField('password', $data['password']);
			return true;
		}
		return false;
	}
}
