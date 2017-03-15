<?php
App::uses('AppController', 'Controller');
App::uses('HttpSocket', 'Network/Http');

class SearchController extends AppController {
	protected $_SEARCH_URL = 'https://www.bing.com/search?q=';
	protected $_TOTAL_COUNT = 500;
	protected $_next = 1;


	public function find()
	{
		$page = $this->request->data['page'];
		$next = $this->request->data['next'];
		if( !empty($this->request->data['q']) ){
			$query = urlencode($this->request->data['q']);

			$results = $this->_bing_search($query, $next);
			$paging = array('page' => $page, 'count' => $this->_TOTAL_COUNT, 'limit' => count($results));
	       
			$this->set(array(
	            'records' => $results,
	            'paging'=> $paging,
	            '_serialize' => array('records', 'paging') 
	        ));
		}
	}



	protected function _bing_search($query, $first)
	{
		$result = [];
		$next = 0;$previous=1;
		$url = ($first == 0) ? $this->_SEARCH_URL . $query : $this->_SEARCH_URL . $query . '&first=' . $first;
		$html = file_get_contents($url);
		
		$pokemon_doc = new DOMDocument();
		libxml_use_internal_errors(TRUE); //disable libxml errors
		if(!empty($html)){ //if any html is actually returned
		    $pokemon_doc->loadHTML($html);
		    libxml_clear_errors(); //remove errors for yucky html

		    $pokemon_xpath = new DOMXPath($pokemon_doc);
		    //get all the h2's with an id
		    $pokemon_row = $pokemon_xpath->query('//li[@class="b_algo"]');
		    

		    $previous_page = @$pokemon_xpath->query('//li[@class="b_pag"]/nav/ul/li/a[@class="sb_pagP"]/@href')->item(0)->nodeValue;
		    parse_str(parse_url($previous_page, PHP_URL_QUERY), $query_params);
		    
		    if (array_key_exists('first', $query_params)) {
		        $previous = $query_params['first'];
		    }

		    $next_page = $pokemon_xpath->query('//li[@class="b_pag"]/nav/ul/li/a[@class="sb_pagN"]/@href')->item(0)->nodeValue;
		    parse_str(parse_url($next_page, PHP_URL_QUERY), $query_params_next);
		    
		    if (array_key_exists('first', $query_params_next)) {
		        $next = $query_params_next['first'];
		    }

		    if($pokemon_row->length > 0){
		        foreach($pokemon_row as $key => $row){
		            $result[$key]['SearchResult']['title'] = @$pokemon_xpath->query('h2', $row)->item(0)->nodeValue;
		            $desc_1 = @$pokemon_xpath->query('div[@class="b_caption"]/div[@class="b_snippet"]/p', $row)->item(0)->nodeValue;
		            if(empty($desc_1)){
		                $desc_1 = @$pokemon_xpath->query('div[@class="b_caption"]/p', $row)->item(0)->nodeValue;
		            }
		            $result[$key]['SearchResult']['description'] = $desc_1;
		            $result[$key]['SearchResult']['url'] = @$pokemon_xpath->query('h2/a/@href', $row)->item(0)->nodeValue;
		            $result[$key]['SearchResult']['search_url'] = $url;
		            $result[$key]['SearchResult']['next'] = $next;
		            $result[$key]['SearchResult']['previous'] = $previous;
		        }
		    }
		}
		
		return $result;
	}
}