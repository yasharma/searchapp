<?php
App::uses('AppModel', 'Model');
class Category extends AppModel {

	public $hasMany = array(
		'Post' => array(
			'className' => 'Post',
			'foreignKey' => 'categories_id',
			'dependent' => true,
		)
	);

	public function afterFind($results, $primary = false) {
	    foreach ($results as $key => $val) {
	        if (isset($val['Category']['name'])) {
	            $results[$key]['Category']['name'] = strtoupper($val['Category']['name']);
	        }
	    }
	    return $results;
	}

	public function saveManyCategories($data)
	{
		$names = array_filter(explode(',', $data['Category']['name']));
		foreach ($names as $key => $value) {
			$data[$key]['Category']['name'] = $this->_hypen($value);
		}
		unset($data['Category']);
		try{
			$this->saveMany($data);
		} catch(Exception $e){
			return $e->errorInfo;
		}
		return true;
	}

	protected function _hypen($string)
	{
		return trim(strtolower(preg_replace('/\s+/', '-', $string)));
	}
}
