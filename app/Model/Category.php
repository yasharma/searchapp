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

	public function saveManyCategories($data)
	{
		$names = explode(',', $data['Category']['name']);
		foreach ($names as $key => $value) {
			$data[$key]['Category']['name'] = trim($value);
		}
		unset($data['Category']);
		try{
			$this->saveMany($data);
		} catch(Exception $e){
			return $e->errorInfo;
		}
		return true;
	}
}
