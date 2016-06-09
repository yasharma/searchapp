<?php

App::uses('Model', 'Model');
App::uses('CakeTime','Utility');
/**
 * Application model for Cake.
 *
 * Add your application-wide methods in the class below, your models
 * will inherit them.
 *
 * @package       app.Model
 */
class AppModel extends Model {
	public $recursive = -1;

	public function dateFormatAfterFind($dateString, $format = 'Y-m-d') {
	    return date($format, strtotime($dateString));
	}
}
