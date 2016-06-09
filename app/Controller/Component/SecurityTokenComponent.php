<?php
App::uses('SecurityComponent', 'Controller/Component');
class SecurityTokenComponent extends SecurityComponent {

/**
 * Component startup. All security checking happens here.
 *
 * @param Controller $controller Instantiating controller
 * @return void
 */
	public function startup(Controller $controller) {
		$this->request = $controller->request;
		$this->_action = $this->request->params['action'];
		$this->_methodsRequired($controller);
		$this->_secureRequired($controller);
		$this->_authRequired($controller);

		$hasData = !empty($this->request->data);
		$isNotRequestAction = (
			!isset($controller->request->params['requested']) ||
			$controller->request->params['requested'] != 1
		);

		if ($this->_action === $this->blackHoleCallback) {
			return $this->blackHole($controller, 'auth');
		}

		if (!in_array($this->_action, (array)$this->unlockedActions)  && $isNotRequestAction) {
			if ($this->csrfCheck && $this->_validateCsrf($controller) === false) {
				return $this->blackHole($controller, 'csrf');
			}
		}
		$this->generateToken($controller->request);
	}

/**
 * Validate that the controller has a CSRF token in the POST data
 * and that the token is legit/not expired. If the token is valid
 * it will be removed from the list of valid tokens.
 *
 * @param Controller $controller A controller to check
 * @return bool Valid csrf token.
 */
	protected function _validateCsrf(Controller $controller) {
		$token = $this->Session->read('_Token');
		$requestToken = $controller->request->header('token');
		if (isset($token['csrfTokens'][$requestToken]) && $token['csrfTokens'][$requestToken] >= time()) {
			if ($this->csrfUseOnce) {
				$this->Session->delete('_Token.csrfTokens.' . $requestToken);
			}
			return true;
		}
		return false;
	}
}